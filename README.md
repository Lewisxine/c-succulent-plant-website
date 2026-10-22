# 多肉小百科 · Succulent Guide

一个面向中国用户的多肉植物科普网站，绿黄配色、简约可爱风格。包含「植物图鉴」与「多肉日记」两大板块，支持中英文切换。

- 植物图鉴：学名（拉丁）、中文/英文常见名、存活环境、适宜温度、浇水、生长周期、照顾方式。
- 多肉日记：注册登录后上传照片、选择心情与生长状态、记录文字，与大家分享。
- 社区投稿：登录后提交多肉词条，自动翻译成中英双语、核验拉丁学名，审核通过后展示在植物图鉴的「社区投稿」板块。
- 图片：全部来自 [Wikimedia Commons](https://commons.wikimedia.org) 的真实摄影作品，**非 AI 生成**，来源见 [IMAGE_SOURCES.md](./IMAGE_SOURCES.md)。

## 技术栈

- [Next.js 16](https://nextjs.org)（App Router + TypeScript）
- [Tailwind CSS 4](https://tailwindcss.com)（绿/黄自定义主题）
- [next-intl](https://next-intl.dev)（中文 `zh` 默认，英文 `en` 可切换）
- [Supabase](https://supabase.com)（Postgres 数据库 + Storage 图片存储 + Auth 用户认证）

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>（会自动跳转到 `/zh`）。

生产构建与启动：

```bash
npm run build
npm run start
```

## 环境变量

在项目根目录创建 `.env.local`（仓库已通过 `.gitignore` 忽略）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://<你的项目 ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

这两个值在 Supabase 控制台 **Project Settings → API Keys** 中获取（项目 URL 与 publishable key）。

## Supabase 初始化（必须执行一次）

日记功能依赖数据库表和存储桶，需要在 Supabase 控制台的 **SQL Editor** 中一次性运行：

```sql
-- 复制 supabase/schema.sql 的全部内容粘贴运行
```

`supabase/schema.sql` 会创建：

- `diaries` 表（含行级安全 RLS：公开日记所有人可读，私密日记仅本人可读、增、删、改）
- `plants` 表（社区投稿词条，含 `created_by` 上传者、`status` 审核状态、`*_zh` / `*_en` 双语字段、`scientific_name_verified` 学名核验标记；RLS：仅 `approved` 词条公开可读，本人可读自己的词条，登录用户可投稿且强制 `status = 'pending'`）
- `profiles` 表（作者名，注册时自动创建，所有人可读）
- `diary-images` 存储桶（公开读，登录用户可上传到自己的目录）
- `plant-images` 存储桶（词条封面图，公开读，登录用户可上传到自己的目录）

### 词条审核

用户提交的词条默认 `status = 'pending'`（待审核），只有 `approved`（已通过）会出现在植物图鉴的「社区投稿」中。审核在 Supabase 控制台的 **Table Editor → plants** 中直接把 `status` 改为 `approved` 或 `rejected`，或用 SQL：

```sql
update public.plants set status = 'approved' where id = '<词条 uuid>';
```

提交者可在 `/plants/mine`（我的词条）中查看自己词条的状态。

### 自动翻译与学名核验

提交词条时，服务端会做两件事（均为免费、无需 Key 的外部服务）：

- **自动翻译**：用 [MyMemory](https://mymemory.translated.net) 把单语言字段翻成中英双语（`*_zh` / `*_en`）。翻译失败时该语言回退到源语言，不影响提交。
- **学名核验**：用 [GBIF](https://www.gbif.org) 物种匹配接口核验拉丁学名。只有精确匹配（`EXACT`）才标记 `scientific_name_verified = true` 并写回规范名与命名人；查无 / 近似匹配时标记「待验证」，仍正常提交。

> 两个服务都是免费公开接口，存在限流；如需更高质量翻译可后续替换为 DeepL API。

### 关于邮箱确认

默认情况下，Supabase 注册后会发送确认邮件。如果只是本地测试，可在 **Authentication → Providers → Email** 中关闭「Confirm email」，这样注册后即可直接登录。

## 项目结构

```
src/
├── app/
│   ├── [locale]/                # 国际化路由（zh / en）
│   │   ├── page.tsx             # 首页
│   │   ├── plants/              # 植物图鉴（列表 + 详情 + 投稿 + 我的词条）
│   │   ├── diary/               # 多肉日记（列表 + 新建 + 详情）
│   │   ├── login/               # 登录 / 注册
│   │   └── about/               # 关于（含图片来源说明）
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 重定向到默认语言
├── components/                  # Header、Footer、植物卡片、日记表单等
├── i18n/                        # next-intl 路由与请求配置
├── lib/
│   ├── plants.ts                # 12 种多肉的策展资料（中英双语）+ 投稿词条类型
│   ├── diary.ts                 # 心情 / 生长状态选项与类型
│   ├── translate.ts             # MyMemory 自动翻译 + 语言检测
│   ├── verify-name.ts           # GBIF 拉丁学名核验
│   ├── actions.ts               # 日记发布、词条投稿的 Server Action
│   └── supabase/                # Supabase 客户端（browser / server）
├── proxy.ts                     # next-intl 路由 + Supabase 会话刷新
└── ...

messages/                        # zh.json / en.json 界面文案
public/images/plants/            # Wikimedia Commons 下载的植物实拍图
supabase/schema.sql              # 数据库与存储初始化脚本
scripts/fetch-images.mjs         # 从 Wikimedia Commons 下载图片的脚本
```

## 添加或修改植物

有两种方式：

1. **社区投稿**：登录后进入植物图鉴，点击「添加多肉词条」，提交后自动翻译成中英双语并核验学名，进入待审核状态，审核通过即展示在「社区投稿」板块。
2. **策展资料**：编辑 `src/lib/plants.ts`，按现有结构新增条目；图片放到 `public/images/plants/<slug>.jpg`，并更新 [IMAGE_SOURCES.md](./IMAGE_SOURCES.md)。

## 图片来源与许可

图片通过 `scripts/fetch-images.mjs` 从 Wikimedia Commons 搜索并下载，自动记录作者与许可。完整清单见 [IMAGE_SOURCES.md](./IMAGE_SOURCES.md)。
