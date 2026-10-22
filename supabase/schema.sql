-- =============================================================
-- 多肉小百科 · Supabase 初始化脚本
-- 在 Supabase 控制台的 SQL Editor 中一次性运行本文件。
-- =============================================================

-- 1) 日记表 -------------------------------------------------
create table if not exists public.diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text,
  mood text,
  growth_status text,
  title text,
  content text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- 开启行级安全（RLS）
alter table public.diaries enable row level security;

-- 删除旧策略（避免新旧策略叠加）
drop policy if exists "Public read" on public.diaries;
drop policy if exists "Read own" on public.diaries;
drop policy if exists "Insert own" on public.diaries;
drop policy if exists "Update own" on public.diaries;
drop policy if exists "Delete own" on public.diaries;
drop policy if exists "diaries_select_public" on public.diaries;
drop policy if exists "diaries_select_own" on public.diaries;

-- SELECT：公开的日记所有人（含未登录）可读
create policy "diaries_select_public"
  on public.diaries
  for select
  using (is_public = true);

-- SELECT：私密日记仅本人可读
create policy "diaries_select_own"
  on public.diaries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT：只能插入 user_id = 自己的记录
create policy "diaries_insert_own"
  on public.diaries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE：只能修改自己的记录，且不能把记录改给他人
create policy "diaries_update_own"
  on public.diaries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE：只能删除自己的记录
create policy "diaries_delete_own"
  on public.diaries
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 2) 图片存储桶 ---------------------------------------------
insert into storage.buckets (id, name, public)
values ('diary-images', 'diary-images', true)
on conflict (id) do nothing;

-- 所有人可读
drop policy if exists "Public read diary-images" on storage.objects;
create policy "Public read diary-images"
  on storage.objects
  for select
  using (bucket_id = 'diary-images');

-- 登录用户可上传到自己的目录（diary-images/<user_id>/...）
drop policy if exists "Auth upload diary-images" on storage.objects;
create policy "Auth upload diary-images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'diary-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 登录用户可删除自己目录下的图片
drop policy if exists "Auth delete diary-images" on storage.objects;
create policy "Auth delete diary-images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'diary-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3) 用户资料表（作者昵称 + 个人中心） -----------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,                          -- 注册用户名（可空；未填写时为 null）
  nickname text,                          -- 展示昵称（个人中心可修改）
  succulent_years int,                    -- 种肉年龄（年）
  avatar_url text,                        -- 头像 URL
  bio text,                               -- 简介
  created_at timestamptz not null default now()
);

-- 兼容旧版 profiles 表：补充缺失列（幂等，已存在则跳过）
alter table public.profiles add column if not exists nickname text;
alter table public.profiles add column if not exists succulent_years int;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles alter column username drop not null;

-- 清理旧版生成的 user_<id前缀> 用户名（改为 null，展示层回退到「匿名」）
update public.profiles set username = null where username like 'user\_%';

-- 注册时自动创建 profile；昵称优先取注册时传入的 nickname，
-- 其次 username；都不填则为 null（页面显示「匿名」）。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, nickname)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'username', ''),
    coalesce(
      nullif(new.raw_user_meta_data->>'nickname', ''),
      nullif(new.raw_user_meta_data->>'username', '')
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 为已存在的用户补齐 profile（一次性回填）
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;

-- 所有人可读（用于展示作者昵称与个人主页）
drop policy if exists "profiles_read_public" on public.profiles;
create policy "profiles_read_public"
  on public.profiles
  for select
  using (true);

-- 本人可修改自己的资料
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 本人可创建（补登）自己的资料（配合页面 upsert 使用）
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- 3b) 头像存储桶 --------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 所有人可读
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- 登录用户可上传到自己的目录（avatars/<user_id>/...）
drop policy if exists "Auth upload avatars" on storage.objects;
create policy "Auth upload avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 登录用户可覆盖（upsert）自己目录下的头像
drop policy if exists "Auth update avatars" on storage.objects;
create policy "Auth update avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) 多肉词条表（用户投稿） ---------------------------------
-- 注：文本字段为中英双语（*_zh / *_en），拉丁学名经 GBIF 核验。
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id) on delete cascade,
  name_zh text not null,
  name_en text,
  scientific_name text,                 -- 拉丁学名（GBIF 精确匹配时写回规范名）
  scientific_name_authority text,       -- 命名人 / 权威（如 "Haw."）
  scientific_name_verified boolean not null default false,  -- 是否已核验
  family_zh text,
  family_en text,
  genus_zh text,
  genus_en text,
  growth_habit_zh text,
  growth_habit_en text,
  description_zh text,
  description_en text,
  care_difficulty text not null default 'medium',  -- easy / medium / hard
  image_url text,
  status text not null default 'pending',          -- pending / approved / rejected
  created_at timestamptz not null default now()
);

alter table public.plants enable row level security;

drop policy if exists "plants_select_approved" on public.plants;
drop policy if exists "plants_select_own" on public.plants;
drop policy if exists "plants_insert_own" on public.plants;

-- SELECT：所有人（含未登录）可读「已通过」的词条
create policy "plants_select_approved"
  on public.plants
  for select
  using (status = 'approved');

-- SELECT：登录用户可读自己的词条（查看审核状态）
create policy "plants_select_own"
  on public.plants
  for select
  to authenticated
  using (created_by = auth.uid());

-- INSERT：登录用户可投稿；强制 created_by = 自己、status = 'pending'
--         （防止用户在插入时把自己设为 approved）
create policy "plants_insert_own"
  on public.plants
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and status = 'pending'
  );

-- 管理员审核：在 Supabase Dashboard 的 Table Editor 中直接把 status
-- 改为 'approved' / 'rejected'，或用 SQL：
--   update public.plants set status = 'approved' where id = '...';

-- 5) 词条封面图存储桶 ---------------------------------------
insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do nothing;

-- 所有人可读
drop policy if exists "Public read plant-images" on storage.objects;
create policy "Public read plant-images"
  on storage.objects
  for select
  using (bucket_id = 'plant-images');

-- 登录用户可上传到自己的目录（plant-images/<user_id>/...）
drop policy if exists "Auth upload plant-images" on storage.objects;
create policy "Auth upload plant-images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
