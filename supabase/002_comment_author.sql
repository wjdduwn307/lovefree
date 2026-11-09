-- 댓글에 "글쓴이가 쓴 댓글인지" 표시를 추가합니다. 작성자 ID는 계속 공개되지 않습니다.
-- setup.sql을 이미 실행한 Supabase의 SQL Editor에서 한 번 실행하세요.
create or replace view public.comments_public as
select
  c.id,
  c.post_id,
  c.relationship,
  c.body,
  c.created_at,
  coalesce(c.user_id = auth.uid(), false) as is_mine,
  coalesce(c.user_id = p.user_id, false) as is_author
from public.comments c
join public.posts p on p.id = c.post_id;
