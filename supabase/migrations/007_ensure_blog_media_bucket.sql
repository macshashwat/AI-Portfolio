-- Repair migration for projects where the media migration was not applied.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 8388608,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public blog media is readable" on storage.objects;
create policy "Public blog media is readable"
on storage.objects for select
using (bucket_id = 'blog-media');

drop policy if exists "Admins upload blog media" on storage.objects;
create policy "Admins upload blog media"
on storage.objects for insert
with check (
  bucket_id = 'blog-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins update own blog media" on storage.objects;
create policy "Admins update own blog media"
on storage.objects for update
using (bucket_id = 'blog-media' and owner_id = auth.uid()::text);

drop policy if exists "Admins delete own blog media" on storage.objects;
create policy "Admins delete own blog media"
on storage.objects for delete
using (bucket_id = 'blog-media' and owner_id = auth.uid()::text);
