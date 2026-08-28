-- Remove all blog content and engagement data.
-- Auth users and public.profiles are intentionally preserved.
truncate table
  public.comments,
  public.post_likes,
  public.bookmarks,
  public.post_tags,
  public.posts,
  public.tags,
  public.categories
restart identity cascade;

-- Remove uploaded story/profile media while keeping the bucket configuration.
delete from storage.objects
where bucket_id = 'blog-media';
