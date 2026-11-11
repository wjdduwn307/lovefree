-- 게시글 저장(북마크). 003_search_admin.sql을 실행한 뒤 한 번 실행하세요.

create table public.saved_posts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  post_id bigint not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.saved_posts enable row level security;

revoke all on public.saved_posts from anon, authenticated;
grant select, insert, delete on public.saved_posts to authenticated;

create policy "내 저장 목록 조회" on public.saved_posts
  for select to authenticated using (user_id = auth.uid());
create policy "내 저장 목록에 추가" on public.saved_posts
  for insert to authenticated with check (user_id = auth.uid());
create policy "내 저장 목록에서 삭제" on public.saved_posts
  for delete to authenticated using (user_id = auth.uid());

-- 내가 저장한 시각만 알려줌. 다른 사람의 저장 여부는 공개하지 않음
create or replace view public.posts_public as
select
  p.id,
  p.category,
  p.title,
  p.body,
  p.relationship,
  p.author_gender,
  p.partner_gender,
  p.likes,
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
  ) as saved_at
from public.posts p
left join public.resolutions r on r.post_id = p.id;
