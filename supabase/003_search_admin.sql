-- 검색어 집계, 지금 Hot한 주제, 관리자 기능
-- Supabase > SQL Editor에서 맨 아래 이메일을 내 계정으로 바꾼 뒤 한 번 실행하세요.

-- 1. 테이블
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- 사용자 ID는 저장하지 않음. dedupe_hash는 같은 날 중복 집계를 막는 일방향 값
create table public.search_logs (
  id bigint generated always as identity primary key,
  term text not null,
  dedupe_hash text unique,
  created_at timestamptz not null default now()
);

create index search_logs_created_at_idx on public.search_logs (created_at);

create table public.search_banned_words (
  word text primary key
);

insert into public.search_banned_words (word) values
  ('시발'), ('씨발'), ('병신'), ('개새끼'), ('좆'), ('존나'), ('지랄'), ('섹스');

create table public.search_term_overrides (
  term text primary key,
  label text check (label is null or char_length(trim(label)) between 1 and 20),
  pinned_rank integer unique check (pinned_rank between 1 and 5),
  hidden boolean not null default false
);

-- 2. 접근 권한. 검색 기록과 관리자 목록은 아래 함수로만 다룸
alter table public.admins enable row level security;
alter table public.search_logs enable row level security;
alter table public.search_banned_words enable row level security;
alter table public.search_term_overrides enable row level security;

revoke all on public.admins, public.search_logs, public.search_banned_words,
  public.search_term_overrides from anon, authenticated;

create function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid())
$$;

grant select, insert, update, delete on public.search_term_overrides to authenticated;

create policy "관리자만 순위 관리" on public.search_term_overrides
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 3. 검색어 집계. 결과가 있고 금칙어가 아닌 검색어만 저장
create function public.record_search(search_term text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  normalized text := lower(trim(regexp_replace(coalesce(search_term, ''), '[*[:space:]]+', ' ', 'g')));
  uid uuid := auth.uid();
begin
  if char_length(normalized) not between 2 and 20 then
    return;
  end if;

  if exists (
    select 1 from public.search_banned_words b
    where position(b.word in replace(normalized, ' ', '')) > 0
  ) then
    return;
  end if;

  if not exists (
    select 1
    from public.posts p
    left join public.resolutions r on r.post_id = p.id
    where not exists (
      select 1
      from unnest(string_to_array(normalized, ' ')) as w(word)
      where concat_ws(' ', p.category, p.title, p.body, r.title, r.body)
        not ilike '%' || replace(replace(replace(w.word, '\', '\\'), '%', '\%'), '_', '\_') || '%'
    )
  ) then
    return;
  end if;

  delete from public.search_logs where created_at < now() - interval '14 days';

  insert into public.search_logs (term, dedupe_hash)
  values (
    normalized,
    case when uid is not null
      then md5(uid::text || ':' || normalized || ':' || current_date::text)
    end
  )
  on conflict (dedupe_hash) do nothing;
end;
$$;

-- 4. 지금 Hot한 주제. 집계가 5개보다 적으면 추천 주제로 채움
create function public.hot_topic_defaults()
returns text[]
language sql immutable
as $$
  select array['연락 문제', '권태기', '데이트', '가치관', '장거리']
$$;

create function public.hot_topics()
returns table (rank integer, term text, label text)
language sql stable security definer set search_path = ''
as $$
  with counted as (
    select l.term, count(*) as n
    from public.search_logs l
    where l.created_at > now() - interval '7 days'
    group by l.term
  ),
  pool as (
    select c.term, 0 as source, -c.n as sort from counted c
    union all
    select d.term, 1, d.ord
    from unnest(public.hot_topic_defaults()) with ordinality as d(term, ord)
    where not exists (select 1 from counted c where c.term = d.term)
  ),
  available as (
    select p.term, row_number() over (order by p.source, p.sort, p.term) as n
    from pool p
    where not exists (
      select 1 from public.search_term_overrides o
      where o.term = p.term and (o.hidden or o.pinned_rank is not null)
    )
  ),
  free_slots as (
    select s.slot, row_number() over (order by s.slot) as n
    from generate_series(1, 5) as s(slot)
    where not exists (
      select 1 from public.search_term_overrides o
      where o.pinned_rank = s.slot and not o.hidden
    )
  )
  select o.pinned_rank, o.term, coalesce(o.label, o.term)
  from public.search_term_overrides o
  where o.pinned_rank is not null and not o.hidden
  union all
  select f.slot, a.term, coalesce(o.label, a.term)
  from free_slots f
  join available a on a.n = f.n
  left join public.search_term_overrides o on o.term = a.term
  order by 1
$$;

create function public.admin_search_terms()
returns table (
  term text,
  search_count integer,
  label text,
  pinned_rank integer,
  hidden boolean,
  current_rank integer
)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.is_admin() then
    raise exception '관리자만 사용할 수 있어요' using errcode = '42501';
  end if;

  return query
  with counted as (
    select l.term, count(*)::integer as n
    from public.search_logs l
    where l.created_at > now() - interval '7 days'
    group by l.term
  ),
  terms as (
    select c.term from counted c
    union
    select o.term from public.search_term_overrides o
    union
    select unnest(public.hot_topic_defaults())
  )
  select
    t.term,
    coalesce(c.n, 0),
    o.label,
    o.pinned_rank,
    coalesce(o.hidden, false),
    h.rank
  from terms t
  left join counted c on c.term = t.term
  left join public.search_term_overrides o on o.term = t.term
  left join public.hot_topics() h on h.term = t.term
  order by coalesce(o.hidden, false), h.rank nulls last, coalesce(c.n, 0) desc, t.term
  limit 50;
end;
$$;

revoke all on function public.is_admin(), public.record_search(text), public.hot_topics(),
  public.admin_search_terms() from public;

grant execute on function public.is_admin(), public.record_search(text), public.hot_topics()
  to anon, authenticated;
grant execute on function public.admin_search_terms() to authenticated;

-- 5. 관리자가 쓴 글과 댓글 표시. 작성자 ID는 계속 공개하지 않음
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
  exists (select 1 from public.admins a where a.user_id = p.user_id) as is_admin_author
from public.posts p
left join public.resolutions r on r.post_id = p.id;

create or replace view public.comments_public as
select
  c.id,
  c.post_id,
  c.relationship,
  c.body,
  c.created_at,
  coalesce(c.user_id = auth.uid(), false) as is_mine,
  coalesce(c.user_id = p.user_id, false) as is_author,
  exists (select 1 from public.admins a where a.user_id = c.user_id) as is_admin_author
from public.comments c
join public.posts p on p.id = c.post_id;

-- 6. 관리자 등록.
insert into public.admins (user_id)
select id from auth.users where email = 'jeungyeoju@gmail.com';
