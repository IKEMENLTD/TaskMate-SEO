# TaskMateAI ブログ

TaskMateAI の公式ブログサイトです。タスク管理とAIに関する最新情報をお届けします。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Markdown (gray-matter, remark)

## プロジェクト構造

```
taskmateai-blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # ルートレイアウト
│   │   ├── page.tsx           # ホームページ（記事一覧）
│   │   ├── globals.css        # グローバルスタイル
│   │   ├── sitemap.ts         # サイトマップ生成
│   │   ├── robots.ts          # robots.txt生成
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx   # 個別記事ページ
│   └── lib/
│       └── posts.ts           # マークダウン処理ユーティリティ
├── content/
│   └── posts/                 # マークダウン記事ファイル
│       ├── first-post.md
│       └── second-post.md
├── next.config.ts             # Next.js設定（basePath含む）
├── netlify.toml               # Netlifyデプロイ設定
└── package.json

```

## ローカル開発

### 必要な環境

- Node.js 18以上

### セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで確認:
```
http://localhost:3000
```

## ビルド

```bash
npm run build
```

静的ファイルは `out/` ディレクトリに生成されます。

## 記事の追加方法

1. `content/posts/` ディレクトリに新しい `.md` ファイルを作成
2. フロントマターを追加:

```markdown
---
title: "記事のタイトル"
date: "2025-10-15"
description: "記事の説明"
slug: "article-slug"
---

# 記事の内容

ここに記事の本文を書きます。
```

3. ファイルを保存すると、自動的にブログに反映されます

## デプロイ（Netlify）

### ブログサイトのデプロイ

1. GitHubリポジトリにプッシュ
2. Netlifyでリポジトリを選択
3. ビルド設定:
   - Build command: `npm run build`
   - Publish directory: `out`
4. デプロイ

### メインサイトとの連携

メインサイト（taskmateai.net）のnetlify.tomlに以下を追加:

```toml
[[redirects]]
  from = "/blog"
  to = "https://[your-blog-url].netlify.app"
  status = 200
  force = true

[[redirects]]
  from = "/blog/*"
  to = "https://[your-blog-url].netlify.app/:splat"
  status = 200
  force = true
```

詳細は `MAIN_SITE_NETLIFY_CONFIG.md` を参照してください。

## ライセンス

ISC
