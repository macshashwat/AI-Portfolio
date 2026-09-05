create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  username_candidate text;
begin
  username_candidate := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'given_name', ''),
    nullif(split_part(new.raw_user_meta_data->>'name', ' ', 1), ''),
    nullif(split_part(coalesce(new.raw_user_meta_data->>'full_name', new.email), ' ', 1), '')
  );
  username_candidate := lower(regexp_replace(username_candidate, '[^a-zA-Z0-9]+', '-', 'g'));
  username_candidate := trim(both '-' from username_candidate);

  if exists (select 1 from public.profiles where username = username_candidate) then
    username_candidate := username_candidate || '-' || left(new.id::text, 6);
  end if;

  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', username_candidate, 'Reader'),
    coalesce(nullif(username_candidate, ''), 'reader-' || left(new.id::text, 6))
  );
  return new;
end
$$;
