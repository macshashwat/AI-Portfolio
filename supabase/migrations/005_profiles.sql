alter table public.profiles add column if not exists username text;

update public.profiles
set username = lower(regexp_replace(coalesce(display_name, 'reader'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 6)
where username is null;

create unique index if not exists profiles_username_idx on public.profiles(username);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(new.id::text, 6)
  );
  return new;
end
$$;

create policy "Users upload own profile media"
on storage.objects for insert
with check (bucket_id = 'blog-media' and auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text);
