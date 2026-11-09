-- 연애해방 DB 설정
-- Supabase > SQL Editor에 이 파일 전체를 붙여넣고 한 번만 실행하세요.

-- 1. 테이블
create table public.profiles (
  id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  relationship text,
  my_gender text,
  partner_gender text
);

create table public.posts (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  category text not null,
  title text not null check (char_length(trim(title)) between 5 and 60),
  body text not null check (char_length(trim(body)) between 20 and 2000),
  relationship text,
  author_gender text,
  partner_gender text,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.resolutions (
  post_id bigint primary key references public.posts (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 5 and 60),
  body text not null check (char_length(trim(body)) between 20 and 2000),
  changed text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  relationship text,
  body text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index comments_post_id_idx on public.comments (post_id);

-- 2. 공개 조회용 뷰. 작성자 ID는 빼고 "내 글인지"만 알려줘서 익명성을 지킴
create view public.posts_public as
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
  r.created_at as resolution_created_at
from public.posts p
left join public.resolutions r on r.post_id = p.id;

create view public.comments_public as
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

-- 3. 접근 권한. 뷰는 읽기만, 수정은 지정한 칸만 가능
revoke all on public.profiles, public.posts, public.resolutions, public.comments,
  public.posts_public, public.comments_public from anon, authenticated;

grant select on public.posts_public, public.comments_public to anon, authenticated;
grant select on public.resolutions to anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;

grant select, insert, delete on public.posts to authenticated;
grant update (category, title, body) on public.posts to authenticated;

grant insert, delete on public.resolutions to authenticated;
grant update (title, body, changed) on public.resolutions to authenticated;

grant select, insert, delete on public.comments to authenticated;
grant update (body) on public.comments to authenticated;

-- 4. 행 단위 보안 규칙
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.resolutions enable row level security;
alter table public.comments enable row level security;

create policy "내 프로필 전체 권한" on public.profiles
  for all to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "내 글 조회" on public.posts
  for select to authenticated using (user_id = auth.uid());
create policy "내 글 작성" on public.posts
  for insert to authenticated with check (user_id = auth.uid());
create policy "내 글 수정" on public.posts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "내 글 삭제" on public.posts
  for delete to authenticated using (user_id = auth.uid());

create policy "후기는 누구나 조회" on public.resolutions
  for select to anon, authenticated using (true);
create policy "내 글에 후기 작성" on public.resolutions
  for insert to authenticated
  with check (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "내 후기 수정" on public.resolutions
  for update to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "내 후기 삭제" on public.resolutions
  for delete to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));

create policy "내 댓글 조회" on public.comments
  for select to authenticated using (user_id = auth.uid());
create policy "내 댓글 작성" on public.comments
  for insert to authenticated with check (user_id = auth.uid());
create policy "내 댓글 수정" on public.comments
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "내 댓글 삭제" on public.comments
  for delete to authenticated using (user_id = auth.uid());

-- 5. 샘플 데이터. 작성자가 없어서 아무도 수정할 수 없음
insert into public.posts (category, title, body, relationship, author_gender, partner_gender, likes, created_at) values
  ('연락 문제', '연락 텀이 길어진 남자친구, 제가 예민한 걸까요?', E'예전에는 바빠도 한두 시간 안에는 답장이 왔는데, 요즘은 반나절씩 소식이 없어요.\n\n바쁜 시기라는 건 알고 있지만 연락을 기다리는 시간이 길어질수록 저만 우리 관계를 신경 쓰는 것 같은 기분이 들어요. 서운하다고 말하면 부담스러워할까 봐 아직 제대로 이야기하지 못했습니다.\n\n감정적으로 따지지 않으면서 제 마음을 어떻게 전하면 좋을까요?', '1년 이상 3년 미만', '여성', '남성', 46, now() - interval '8 days'),
  ('데이트', '기념일을 자꾸 잊는 연인과 어떻게 대화할까요?', E'날짜 자체보다 나만 우리 관계를 중요하게 생각하는 것 같은 기분이 들어요.\n\n지난번에는 서운한 마음에 바로 화를 냈고 결국 서로 기분만 상했습니다. 이번에는 싸우지 않고 제가 왜 서운했는지 차분히 전하고 싶어요.', '3년 이상', '여성', '여성', 31, now() - interval '13 days'),
  ('가치관', '서로 다른 소비 습관, 맞춰갈 수 있을까요?', E'저는 미래를 위해 저축하는 편이고 연인은 지금의 행복이 더 중요하다고 생각해요.\n\n데이트 비용이나 여행 계획을 세울 때마다 서로가 답답하다고 느끼게 됩니다.', '3개월 이상 1년 미만', '남성', '여성', 52, now() - interval '23 days'),
  ('권태기', '요즘 대화가 줄었는데 권태기의 시작일까요?', '함께 있어도 각자 휴대폰만 보는 시간이 많아졌어요. 편안해진 건지 마음이 멀어진 건지 구분이 되지 않아 고민입니다.', '1년 이상 3년 미만', '남성', '남성', 25, now() - interval '2 hours'),
  ('장거리', '한 달에 한 번 만나는 장거리 연애, 지치지 않는 방법이 있을까요?', '서로의 일정이 맞지 않아 만나는 횟수가 줄고 있습니다. 연락만으로 관계를 잘 이어갈 수 있는 방법이 궁금해요.', '3개월 이상 1년 미만', '여성', '남성', 38, now() - interval '5 hours'),
  ('가족', '연인의 가족 문제에 어디까지 의견을 내도 될까요?', '힘들어하는 모습을 보면 도와주고 싶지만 괜히 선을 넘는 건 아닐까 조심스러워요.', '3년 이상', '기타', '여성', 17, now() - interval '8 hours');

insert into public.resolutions (post_id, title, body, changed, created_at) values
  (1, '답장 시간보다 서로의 하루를 묻기로 했어요', E'댓글에서 알려준 대화법을 참고해 서운함부터 꺼내기보다 요즘 많이 바쁜지 먼저 물어봤어요.\n\n연인도 연락이 줄어든 걸 미안해하고 있었고, 이제는 답장 시간보다 하루에 한 번 서로의 하루를 제대로 묻기로 했어요.', array['기다리는 시간을 혼자 해석하지 않기', '매일 밤 서로의 하루 나누기'], now() - interval '1 day'),
  (2, '기념일보다 중요한 마음을 확인했어요', E'서운했던 이유가 날짜를 잊어서가 아니라 나만 관계를 중요하게 생각하는 것 같았기 때문이라고 차분히 이야기했어요.\n\n함께 기억하고 싶은 날을 둘이 다시 정하고 캘린더에 기록했습니다.', array['함께 기억할 기념일 정하기', '서운함을 쌓아두지 않고 설명하기'], now() - interval '1 day'),
  (3, '우리 둘만의 소비 기준이 생겼어요', E'각자의 소비 방식을 틀렸다고 말하지 않고 우리가 함께 이루고 싶은 목표부터 이야기했습니다.\n\n공동 저축과 각자 자유롭게 쓸 수 있는 금액을 나누기로 했어요.', array['공동 목표 금액 먼저 정하기', '각자의 자유 소비 존중하기'], now() - interval '2 days');

insert into public.comments (post_id, relationship, body, created_at) values
  (1, '2년째 연애 중', '저도 비슷한 시기가 있었어요. 연락 횟수보다 서로 꼭 지키고 싶은 연락 시간을 하나 정해보니 훨씬 편해졌습니다.', now() - interval '43 minutes'),
  (1, '8개월째 연애 중', '서운함부터 말하기보다 요즘 많이 바쁜지 먼저 물어보는 건 어떨까요? 대화의 시작이 한결 부드러웠어요.', now() - interval '21 minutes'),
  (1, '4년째 연애 중', '기다리는 동안 어떤 기분이 들었는지를 솔직하게 말해보세요. 상대를 탓하지 않고 내 감정을 설명하는 게 중요하더라고요.', now() - interval '8 minutes');
