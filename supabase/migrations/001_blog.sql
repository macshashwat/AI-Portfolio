create extension if not exists pgcrypto;

create type public.user_role as enum ('reader', 'admin');
create type public.post_status as enum ('draft', 'published');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Reader',
  avatar_url text,
  role public.user_role not null default 'reader',
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  category_id uuid references public.categories(id),
  title text not null check (char_length(title) between 3 and 180),
  slug text not null unique,
  excerpt text not null check (char_length(excerpt) between 10 and 400),
  content text not null,
  published_at timestamptz,
  status public.post_status not null default 'draft',
  featured boolean not null default false,
  read_time integer not null default 1 check (read_time > 0),
  views integer not null default 0 check (views >= 0),
  likes integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.bookmarks (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.comments enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());
create policy "Published posts are public" on public.posts for select using (status = 'published' or public.is_admin());
create policy "Admins manage posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());
create policy "Public taxonomy is readable" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Public tags are readable" on public.tags for select using (true);
create policy "Admins manage tags" on public.tags for all using (public.is_admin()) with check (public.is_admin());
create policy "Public post tags are readable" on public.post_tags for select using (true);
create policy "Admins manage post tags" on public.post_tags for all using (public.is_admin()) with check (public.is_admin());
create policy "Users manage own likes" on public.post_likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own bookmarks" on public.bookmarks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Published comments are readable" on public.comments for select using (exists (select 1 from public.posts where id = post_id and status = 'published'));
create policy "Authenticated users comment" on public.comments for insert with check (author_id = auth.uid());
create policy "Users delete own comments" on public.comments for delete using (author_id = auth.uid() or public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id, display_name, username) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(new.id::text, 6)); return new; end $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create index posts_status_published_at_idx on public.posts(status, published_at desc);
create index comments_post_id_idx on public.comments(post_id, created_at);

create or replace function public.increment_post_views(post_id uuid)
returns void language sql security definer set search_path = public
as $$ update public.posts set views = views + 1, updated_at = now() where id = post_id and status = 'published' $$;

insert into public.categories (name, slug) values
  ('AI Engineering', 'ai-engineering'),
  ('Backend', 'backend'),
  ('Product Design', 'product-design')
on conflict (slug) do nothing;
