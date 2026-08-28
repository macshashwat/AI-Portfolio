-- Apply this migration if publishing reports that posts.cover_url is missing.
alter table public.posts add column if not exists cover_url text;

-- Refresh Supabase/PostgREST schema metadata immediately after the change.
notify pgrst, 'reload schema';
