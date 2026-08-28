-- Seed three published posts for local/staging verification.
-- Run after 001_blog.sql and after creating/promoting an admin profile.

do $$
declare
  admin_id uuid;
  ai_category_id uuid;
  backend_category_id uuid;
  design_category_id uuid;
begin
  select id into admin_id
  from public.profiles
  where role = 'admin'
  order by created_at
  limit 1;

  if admin_id is null then
    raise exception 'No admin profile found. Create a Supabase Auth user and promote its profile to admin first.';
  end if;

  select id into ai_category_id from public.categories where slug = 'ai-engineering';
  select id into backend_category_id from public.categories where slug = 'backend';
  select id into design_category_id from public.categories where slug = 'product-design';

  insert into public.posts (
    author_id, category_id, title, slug, excerpt, content,
    published_at, status, featured, read_time, views, likes
  ) values
  (
    admin_id,
    ai_category_id,
    'Building AI features users can trust',
    'building-ai-features-users-can-trust',
    'A practical guide to making AI products reliable, transparent, and genuinely useful.',
    $post$Trustworthy AI starts with clear boundaries. Keep the first workflow narrow, validate every model response, and make uncertainty visible instead of hiding it.

In production, graceful fallbacks matter as much as the happy path. When the model is unsure, the product should still explain what happened and give the user a useful next step.$post$,
    now() - interval '7 days',
    'published',
    true,
    6,
    128,
    18
  ),
  (
    admin_id,
    backend_category_id,
    'The calm backend: patterns that scale',
    'the-calm-backend-patterns-that-scale',
    'A few boring, observable primitives can make ambitious products easier to build and operate.',
    $post$Scale is rarely one database decision. It comes from boundaries that keep change affordable: independent domain logic, idempotent jobs, predictable APIs, and useful observability.

I prefer boring infrastructure with excellent dashboards. It gives a team room to focus on customer value instead of debugging surprises at two in the morning.$post$,
    now() - interval '14 days',
    'published',
    false,
    5,
    84,
    11
  ),
  (
    admin_id,
    design_category_id,
    'Designing developer tools for momentum',
    'designing-developer-tools-for-momentum',
    'Small interaction details compound into tools that feel fast, focused, and made for their users.',
    $post$Developer tools are used in a state of flow. Every unnecessary decision costs more than a click: it costs context.

Good tools make the next useful action obvious, preserve intent, and keep feedback close to the action that caused it. The result feels simple because the complexity is doing its work quietly.$post$,
    now() - interval '21 days',
    'published',
    false,
    4,
    52,
    7
  )
  on conflict (slug) do nothing;
end $$;
