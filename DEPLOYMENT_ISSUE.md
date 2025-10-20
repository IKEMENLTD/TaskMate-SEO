# Issue: TaskMate Blog Netlifyデプロイ

## 📋 概要

TaskMate Blog（Next.js静的サイト）をNetlifyにデプロイし、メインサイト（taskmateai.net）からのリダイレクトを設定する。

## 🎯 目標

- ✅ GitHub にコードをプッシュ
- ✅ Netlify サイトを作成
- ✅ ビルド設定を構成
- ✅ メインサイトのリダイレクト設定
- ✅ デプロイの検証

## 📝 実装手順

### ステップ1: GitHub プッシュ

```bash
# リポジトリ: IKEMENLTD/TaskMate-SEO
# ブランチ: main
# コミット済み: f4ddbf3, 4228e8c

# 認証設定後にプッシュ
export GITHUB_TOKEN="your_token_here"
git push origin main
```

### ステップ2: Netlify サイト作成

1. Netlify にログイン: https://app.netlify.com/
2. "Add new site" → "Import an existing project"
3. GitHub 連携: IKEMENLTD/TaskMate-SEO を選択
4. ブランチ: main

### ステップ3: ビルド設定

```toml
# netlify.toml (プロジェクトルート)

[build]
  command = "npm run build"
  publish = "out"
  
[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/blog/*"
  to = "/blog/:splat"
  status = 200
  force = false

[[redirects]]
  from = "/blog"
  to = "/blog/"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    
[[headers]]
  for = "/blog/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### ステップ4: メインサイトのリダイレクト設定

メインサイト（taskmateai.net）の netlify.toml に追加:

```toml
[[redirects]]
  from = "/blog/*"
  to = "https://taskmateai-blog.netlify.app/blog/:splat"
  status = 200
  force = false
  
[[redirects]]
  from = "/blog"
  to = "https://taskmateai-blog.netlify.app/blog/"
  status = 200
  force = false
```

### ステップ5: 検証項目

```
✅ ビルドが成功する
✅ https://[site-name].netlify.app/blog/ でアクセス可能
✅ 記事詳細ページが表示される（例: /blog/posts/perfect-task-management-with-ai）
✅ 画像が正しく表示される
✅ CSS/JSが正しく読み込まれる
✅ メインサイトからのリダイレクトが動作する
✅ robots.txt にアクセス可能
✅ sitemap.xml が生成されている
```

## 🔧 トラブルシューティング

### ビルドエラー: "Module not found"
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 エラー: ページが見つからない
- basePath が正しく設定されているか確認（/blog）
- next.config.ts の output: 'export' を確認
- アセットパスが /blog/_next/... になっているか確認

### CSS が読み込まれない
- Build settings の Publish directory が "out" になっているか確認
- ブラウザのキャッシュをクリア
- Netlify のデプロイログで CSS ファイルが生成されているか確認

## 📚 参考資料

- NETLIFY_DEPLOY_GUIDE.md - 完全デプロイガイド（308行）
- MAIN_SITE_NETLIFY_TOML.md - メインサイト設定例（231行）
- next.config.ts - Next.js 設定
- package.json - 依存関係とスクリプト

## ✅ 完了条件

1. GitHub に全コミットがプッシュされている
2. Netlify サイトが作成され、自動デプロイが有効
3. https://[site-name].netlify.app/blog/ でブログにアクセス可能
4. 全ページ（12ページ）が正しく表示される
5. メインサイトからのリダイレクトが設定されている
6. 検証項目が全て ✅

## 🌟 現在の状態

- ✅ コード完成（緑テーマ、パフォーマンス最適化済み）
- ✅ ビルド成功（12ページ、/out ディレクトリ生成済み）
- ✅ ローカルテスト完了（http://localhost:3000/blog/）
- ⏳ GitHub プッシュ待ち
- ⏳ Netlify デプロイ待ち

## 📞 担当者

- AI Agent: Claude Code + Miyabi
- リポジトリ: IKEMENLTD/TaskMate-SEO
- ブランチ: main

---

**作成日**: 2025年10月20日  
**優先度**: 高  
**見積もり時間**: 30〜60分
