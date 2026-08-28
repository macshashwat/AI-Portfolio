-- Seed one image-backed story for testing.
-- Run after 001_blog.sql and after creating/promoting an admin profile.

do $$
declare
  admin_id uuid;
  category_id uuid;
begin
  select id into admin_id
  from public.profiles
  where role = 'admin'
  order by created_at
  limit 1;

  if admin_id is null then
    raise exception 'No admin profile found. Create a Supabase Auth user and promote its profile to admin first.';
  end if;

  select id into category_id
  from public.categories
  where slug = 'ai-engineering';

  insert into public.posts (
    author_id,
    category_id,
    title,
    slug,
    excerpt,
    content,
    cover_url,
    published_at,
    status,
    featured,
    read_time,
    views,
    likes
  ) values (
    admin_id,
    category_id,
    'From prototype to production: lessons from an AI voice product',
    'prototype-to-production-ai-voice-product',
    'What I learned while turning an AI voice idea into a focused, useful product experience.',
    $post$The distance between a prototype and a product is mostly made of thoughtful decisions. The interface has to make the next action obvious, while the backend must stay resilient when usage becomes unpredictable.

For AI voice experiences, feedback speed is everything. Keep the interaction focused, make generated output easy to review, and give people control over what they keep. Small moments of clarity are what turn impressive demos into tools people return to.$post$,
    '/images/ai-voice-studio.png',
    now() - interval '2 days',
    'published',
    false,
    5,
    37,
    9
  )
  on conflict (slug) do nothing;
end $$;
