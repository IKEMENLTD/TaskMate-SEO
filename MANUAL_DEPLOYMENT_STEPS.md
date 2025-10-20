# 📋 TaskMate Blog 手動デプロイ手順書

## ⚠️ 状況説明

**問題**: GitHub Personal Access Token (PAT) が `SeiSato0829` アカウントに紐付いているため、`IKEMENLTD` 組織のリポジトリへのプッシュ権限がありません。

**エラーメッセージ**:
```
remote: Permission to IKEMENLTD/TaskMate-SEO.git denied to SeiSato0829.
fatal: unable to access 'https://github.com/IKEMENLTD/TaskMate-SEO.git/': The requested URL returned error: 403
```

**解決策**: 以下の手順で手動デプロイを完了してください。

---

## 🎯 完了済みの作業

✅ **コード完成**:
- 緑テーマ実装
- パフォーマンス最適化
- CSS デザインパターン追加
- 記事文字数調整（6,000字以下）

✅ **設定ファイル作成**:
- `netlify.toml` - Netlify ビルド設定
- `DEPLOYMENT_ISSUE.md` - Issue テンプレート
- `NETLIFY_DEPLOY_GUIDE.md` - 完全デプロイガイド
- `MAIN_SITE_NETLIFY_TOML.md` - メインサイト設定

✅ **ローカルコミット完了**:
```
7e5253e Add Netlify configuration and deployment issue template
f4ddbf3 Fix static export issues and add comprehensive deploy guides
4228e8c Complete blog redesign with green theme and performance optimization
```

✅ **ビルドテスト成功**:
- 12ページ静的エクスポート完了
- `/out` ディレクトリ生成済み

---

## 📝 手動デプロイ手順（5ステップ）

### ステップ1: GitHub への Push（権限設定が必要）

#### オプションA: GitHub Desktop を使用（推奨）

1. **GitHub Desktop を開く**
   - [GitHub Desktop](https://desktop.github.com/) をインストール済みの場合

2. **リポジトリを追加**
   - File → Add Local Repository
   - パス: `C:\Users\music-020\Downloads\TaskMateブログ\TaskMateブログ`

3. **プッシュ**
   - "Push origin" ボタンをクリック
   - 認証が求められたら、IKEMENLTD 組織へのアクセス権限があるアカウントでログイン

#### オプションB: Windows PowerShell で実行

```powershell
# ディレクトリ移動
cd "C:\Users\music-020\Downloads\TaskMateブログ\TaskMateブログ"

# リモート URL を確認
git remote -v

# プッシュ（認証ダイアログが表示される）
git push origin main
```

#### オプションC: GitHub Personal Access Token を更新

1. **新しい PAT を作成**:
   - https://github.com/settings/tokens にアクセス
   - "Generate new token (classic)" をクリック
   - スコープ: `repo`（全権限）
   - 組織: **IKEMENLTD へのアクセスを許可**

2. **環境変数を更新**:
```bash
export GITHUB_TOKEN="新しいトークン"
```

3. **プッシュ**:
```bash
git remote set-url origin https://新しいトークン@github.com/IKEMENLTD/TaskMate-SEO.git
git push origin main
```

---

### ステップ2: Netlify サイト作成

1. **Netlify にログイン**
   - https://app.netlify.com/

2. **新しいサイトを作成**
   - "Add new site" → "Import an existing project"

3. **GitHub と連携**
   - "Deploy with GitHub" を選択
   - リポジトリ: `IKEMENLTD/TaskMate-SEO`
   - ブランチ: `main`

4. **ビルド設定**
   ```
   Build command: npm run build
   Publish directory: out
   ```

5. **環境変数** (不要 - 静的サイトのため)

6. **Deploy site** をクリック

---

### ステップ3: デプロイ確認

1. **ビルドログを確認**
   - デプロイが完了するまで 2〜5 分待つ
   - ビルドログでエラーがないか確認

2. **期待されるビルド出力**:
   ```
   ✓ Generating static pages (12/12)
   Route (app)                              Size     First Load JS
   ┌ ○ /blog                                1.23 kB        87.2 kB
   ├ ○ /blog/posts/[slug]                   2.34 kB        92.1 kB
   └ ○ /blog/robots.txt                     0 B            0 B
   └ ○ /blog/sitemap.xml                    0 B            0 B
   ```

3. **サイト URL を確認**
   - 例: `https://taskmateai-blog.netlify.app/`
   - または: `https://[your-site-name].netlify.app/`

---

### ステップ4: サイトの動作確認

以下の URL でアクセスして確認:

#### ✅ 確認項目

```
□ トップページ
  → https://[site-name].netlify.app/blog/

□ 記事詳細ページ
  → https://[site-name].netlify.app/blog/posts/perfect-task-management-with-ai
  → https://[site-name].netlify.app/blog/posts/ai-time-management-2025
  → https://[site-name].netlify.app/blog/posts/team-productivity-guide-2025

□ robots.txt
  → https://[site-name].netlify.app/blog/robots.txt

□ sitemap.xml
  → https://[site-name].netlify.app/blog/sitemap.xml

□ デザイン確認
  → 緑色テーマが適用されている
  → ヘッダーが固定されていない
  → CSS が正しく読み込まれている
  → 画像が表示される

□ パフォーマンス
  → ページの読み込みが高速（3秒以内）
  → コンソールエラーがない
```

---

### ステップ5: メインサイトのリダイレクト設定

メインサイト（`taskmateai.net`）がどこでホストされているかによって設定方法が異なります。

#### A. メインサイトも Netlify の場合

1. **メインサイトの Netlify ダッシュボードを開く**

2. **netlify.toml を編集**
   - リポジトリに移動
   - `netlify.toml` ファイルを開く

3. **リダイレクトルールを追加**:
   ```toml
   [[redirects]]
     from = "/blog/*"
     to = "https://[blog-site-name].netlify.app/blog/:splat"
     status = 200
     force = false
     
   [[redirects]]
     from = "/blog"
     to = "https://[blog-site-name].netlify.app/blog/"
     status = 200
     force = false
   ```

4. **コミット & プッシュ**
   - 変更をコミット
   - メインサイトが自動再デプロイされる

#### B. メインサイトが別のホスティング（Vercel, AWS, etc.）の場合

**Vercel**:
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/blog/:path*",
      "destination": "https://[blog-site-name].netlify.app/blog/:path*"
    }
  ]
}
```

**Apache (.htaccess)**:
```apache
RewriteEngine On
RewriteRule ^blog/(.*)$ https://[blog-site-name].netlify.app/blog/$1 [P,L]
```

**Nginx**:
```nginx
location /blog/ {
    proxy_pass https://[blog-site-name].netlify.app/blog/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 🎉 完了確認

すべて完了したら、以下を確認:

```
✅ GitHub に全コミットがプッシュされている
✅ Netlify サイトがデプロイされている
✅ https://[site-name].netlify.app/blog/ でブログが表示される
✅ 全ページが正しく動作する
✅ メインサイトから /blog へアクセスできる（オプション）
```

---

## 🔧 トラブルシューティング

### エラー: Build failed

**原因**: 依存関係のインストール失敗

**解決策**:
1. Netlify のビルド設定で `NPM_FLAGS = "--legacy-peer-deps"` を設定
2. Node.js バージョンを 20 に設定: `NODE_VERSION = "20"`

### エラー: 404 Not Found

**原因**: basePath の設定ミス

**解決策**:
1. `next.config.ts` で `basePath: '/blog'` を確認
2. `output: 'export'` を確認

### エラー: CSS が読み込まれない

**原因**: Publish directory の設定ミス

**解決策**:
- Netlify の設定で Publish directory を `out` に設定

---

## 📚 参考ドキュメント

- `NETLIFY_DEPLOY_GUIDE.md` - 完全デプロイガイド（308行）
- `MAIN_SITE_NETLIFY_TOML.md` - メインサイト設定例（231行）
- `DEPLOYMENT_ISSUE.md` - Issue テンプレート
- `netlify.toml` - このプロジェクトの Netlify 設定

---

## 💡 次のステップ（オプション）

デプロイ完了後、以下を検討してください:

1. **カスタムドメイン設定**
   - Netlify ダッシュボード → Domain settings
   - `blog.taskmateai.net` などのサブドメインを設定

2. **HTTPS 設定**
   - Netlify は自動的に Let's Encrypt で HTTPS を設定

3. **継続的デプロイ**
   - GitHub に push するたびに自動デプロイされる（すでに設定済み）

4. **パフォーマンス監視**
   - Netlify Analytics を有効化
   - Google Analytics を追加（オプション）

---

**作成日**: 2025年10月20日  
**ステータス**: デプロイ準備完了（GitHub push 待ち）  
**リポジトリ**: IKEMENLTD/TaskMate-SEO  
**ブランチ**: main
