-- =========================================================================
-- 학습사이트 템플릿 — Supabase 스키마
-- 모든 테이블은 접두사 tpl_ 를 사용 (프로젝트별로 일괄 치환).
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행.
-- 인증: Authentication > Providers 에서 Google, Kakao 활성화 필요.
-- =========================================================================

-- 1. 프로필 (auth.users 1:1 확장)
create table if not exists tpl_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  plan text default 'free',           -- free | pro
  created_at timestamptz default now()
);

-- 2. 수강 진도 (레슨 단위 완료 기록)
create table if not exists tpl_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,            -- config/site.js 의 lesson id
  completed boolean default false,
  last_position int default 0,        -- 영상 재생 위치(초)
  updated_at timestamptz default now(),
  unique (user_id, lesson_id)
);

-- 3. 레슨 노트 (밑줄·메모 — 시그니처 컨셉의 데이터화)
create table if not exists tpl_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  body text not null,
  created_at timestamptz default now()
);

-- 4. 결제 주문 (포트원/이니시스 결제 결과 기록)
create table if not exists tpl_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  merchant_uid text unique not null,  -- 주문 고유번호
  imp_uid text,                       -- 포트원 결제 고유번호
  plan text not null,
  amount int not null,
  status text default 'pending',      -- pending | paid | failed | cancelled
  created_at timestamptz default now()
);

-- =========================================================================
-- RLS (Row Level Security) — 본인 데이터만 접근
-- =========================================================================
alter table tpl_profiles enable row level security;
alter table tpl_progress enable row level security;
alter table tpl_notes    enable row level security;
alter table tpl_orders   enable row level security;

create policy "own profile"  on tpl_profiles for all using (auth.uid() = id)        with check (auth.uid() = id);
create policy "own progress" on tpl_progress for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
create policy "own notes"    on tpl_notes    for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
create policy "own orders"   on tpl_orders   for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);

-- =========================================================================
-- 신규 가입 시 프로필 자동 생성 트리거
-- =========================================================================
create or replace function tpl_handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into tpl_profiles (id, email, display_name, avatar_url)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists tpl_on_auth_user_created on auth.users;
create trigger tpl_on_auth_user_created
  after insert on auth.users
  for each row execute function tpl_handle_new_user();
