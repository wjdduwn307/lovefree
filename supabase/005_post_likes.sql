-- 게시글 공감. 004_saved_posts.sql을 실행한 뒤 한 번 실행하세요.

create table public.post_likes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  post_id bigint not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index post_likes_post_id_idx on public.post_likes (post_id);

alter table public.post_likes enable row level security;

revoke all on public.post_likes from anon, authenticated;
grant select, insert, delete on public.post_likes to authenticated;

create policy "내 공감 조회" on public.post_likes
  for select to authenticated using (user_id = auth.uid());
create policy "내 공감 추가" on public.post_likes
  for insert to authenticated with check (user_id = auth.uid());
create policy "내 공감 취소" on public.post_likes
  for delete to authenticated using (user_id = auth.uid());

-- 샘플 글에 미리 넣어 둔 공감 수는 더 이상 쓰지 않음
update public.posts set likes = 0;

-- likes는 실제 공감 수, is_liked는 내가 공감했는지 여부
create or replace view public.posts_public as
select
  p.id,
  p.category,
  p.title,
  p.body,
  p.relationship,
  p.author_gender,
  p.partner_gender,
  (select count(*)::int from public.post_likes l where l.post_id = p.id) as likes,
  p.created_at,
  coalesce(p.user_id = auth.uid(), false) as is_mine,
  (select count(*)::int from public.comments c where c.post_id = p.id) as comment_count,
  r.title as resolution_title,
  r.body as resolution_body,
  r.changed as resolution_changed,
  r.created_at as resolution_created_at,
  exists (select 1 from public.admins a where a.user_id = p.user_id) as is_admin_author,
  (
    select s.created_at from public.saved_posts s
    where s.post_id = p.id and s.user_id = auth.uid()
  ) as saved_at,
  exists (
    select 1 from public.post_likes l
    where l.post_id = p.id and l.user_id = auth.uid()
  ) as is_liked
from public.posts p
left join public.resolutions r on r.post_id = p.id;
