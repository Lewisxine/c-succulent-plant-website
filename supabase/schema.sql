-- =============================================================
-- 多肉小百科 · Supabase 初始化脚本
-- 在 Supabase 控制台的 SQL Editor 中一次性运行本文件。
-- =============================================================

-- 1) 日记表 -------------------------------------------------
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text,
  mood text,
  growth_status text,
  title text,
  content text,
  created_at timestamptz not null default now()
);

-- 开启行级安全（RLS）
alter table public.diary_entries enable row level security;

-- 所有人可读
drop policy if exists "Public read" on public.diary_entries;
create policy "Public read"
  on public.diary_entries
  for select
  using (true);

-- 登录用户只能新增自己的日记
drop policy if exists "Insert own" on public.diary_entries;
create policy "Insert own"
  on public.diary_entries
  for insert
  with check (auth.uid() = user_id);

-- 登录用户只能修改自己的日记
drop policy if exists "Update own" on public.diary_entries;
create policy "Update own"
  on public.diary_entries
  for update
  using (auth.uid() = user_id);

-- 登录用户只能删除自己的日记
drop policy if exists "Delete own" on public.diary_entries;
create policy "Delete own"
  on public.diary_entries
  for delete
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
