create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  username_candidate text;
  suffix integer := 1;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'given_name', ''),
    nullif(split_part(new.raw_user_meta_data->>'name', ' ', 1), ''),
    nullif(split_part(coalesce(new.raw_user_meta_data->>'full_name', new.email), ' ', 1), '')
  );
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]+', '-', 'g'));
  base_username := coalesce(nullif(trim(both '-' from base_username), ''), 'reader');
  username_candidate := base_username;

  while exists (select 1 from public.profiles where username = username_candidate) loop
    suffix := suffix + 1;
    username_candidate := base_username || '#' || suffix;
  end loop;

  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', username_candidate, 'Reader'),
    username_candidate
  );
  return new;
end
$$;
