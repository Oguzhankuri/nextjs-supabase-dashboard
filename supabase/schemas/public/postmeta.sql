----------------------------------------------------------------
--                                                            --
--                      public.postmeta                       --
--                                                            --
----------------------------------------------------------------

drop function if exists set_post_views;
drop function if exists set_post_meta;

drop table if exists postmeta;

----------------------------------------------------------------

create table postmeta (
  id bigint generated by default as identity primary key,
  post_id bigint references posts(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique(post_id, meta_key)
);

-- Add table indexing
create index postmeta_post_id_idx on postmeta (post_id);
create index postmeta_meta_key_idx on postmeta (meta_key);

-- Secure the table
alter table postmeta enable row level security;

-- Add row-level security
create policy "Public access for all users" on postmeta for select to authenticated, anon using ( true );
create policy "User can insert postmeta" on postmeta for insert to authenticated with check ( true );
create policy "User can update postmeta" on postmeta for update to authenticated using ( true );
create policy "User can delete postmeta" on postmeta for delete to authenticated using ( true );

----------------------------------------------------------------

create or replace function set_post_meta(postid bigint, metakey text, metavalue text)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from postmeta where post_id = postid and meta_key = metakey) then
    update postmeta set meta_value = metavalue where post_id = postid and meta_key = metakey;
  else
    insert into postmeta(post_id, meta_key, meta_value) values(postid, metakey, metavalue);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_post_views(postid bigint)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from postmeta where post_id = postid and meta_key = 'views') then
    update postmeta set meta_value = meta_value::integer + 1 where post_id = postid and meta_key = 'views';
  else
    insert into postmeta(post_id, meta_key, meta_value) values(postid, 'views', '1');
  end if;
end;
$$ language plpgsql;
