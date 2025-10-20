# TaskMateAI ブログ - Netlifyデプロイ完全ガイド

## 📋 目次
1. [デプロイ前の確認事項](#デプロイ前の確認事項)
2. [GitHubへのプッシュ](#githubへのプッシュ)
3. [Netlifyでの新規サイト作成](#netlifyでの新規サイト作成)
4. [メインサイトのリダイレクト設定](#メインサイトのリダイレクト設定)
5. [デプロイ後の確認](#デプロイ後の確認)

---

## デプロイ前の確認事項

### ✅ 完了している設定
- [x] Next.js 15.5.5 プロジェクトの構築
- [x] `basePath: '/blog'` の設定
- [x] `output: 'export'` による Static Export
- [x] 緑系統一のデザイン適用
- [x] パフォーマンス最適化
- [x] レスポンシブ対応
- [x] SEO最適化（メタデータ、構造化データ）
- [x] 記事の作成（3記事）

### 📦 プロジェクト構成
```
TaskMateブログ/
├── content/posts/          # マークダウン記事
│   ├── ai-time-management-2025.md
│   ├── perfect-task-management-with-ai.md
│   └── team-productivity-guide-2025.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── posts/[slug]/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── posts.ts
├── netlify.toml           # Netlify設定
└── next.config.ts         # Next.js設定
```

---

## GitHubへのプッシュ

### 1. 変更のコミット（完了済み）

現在のコミット状態：
```bash
git log -1 --oneline
# 4228e8c Complete blog redesign with green theme and performance optimization
```

### 2. GitHubへプッシュ

**方法A: GitHub Desktop を使用（推奨）**
1. GitHub Desktop を開く
2. リポジトリ: `IKEMENLTD/TaskMate-SEO` を選択
3. 「Push origin」ボタンをクリック

**方法B: コマンドライン**
```bash
# GitHub CLIでログイン
gh auth login

# プッシュ
git push origin main
```

**方法C: Personal Access Token を使用**
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/IKEMENLTD/TaskMate-SEO.git
git push origin main
```

---

## Netlifyでの新規サイト作成

### 1. Netlifyダッシュボードにアクセス
https://app.netlify.com にログイン

### 2. 新規サイトを作成
1. **「Add new site」** → **「Import an existing project」** をクリック
2. **「GitHub」** を選択
3. リポジトリ **「IKEMENLTD/TaskMate-SEO」** を選択

### 3. ビルド設定

**重要: 以下の設定を入力してください**

| 項目 | 設定値 |
|------|--------|
| **Branch to deploy** | `main` |
| **Base directory** | (空欄のまま) |
| **Build command** | `npm run build` |
| **Publish directory** | `out` |

**環境変数の設定（必要に応じて）：**
- Node.js バージョン: `18` 以上
  ```
  NODE_VERSION=18
  ```

### 4. デプロイ開始
「Deploy site」ボタンをクリック

### 5. サイト名の変更（オプション）
1. デプロイ完了後、**「Site settings」** に移動
2. **「Site information」** → **「Change site name」**
3. 例: `taskmateai-blog` に変更
4. URL: `https://taskmateai-blog.netlify.app` で公開

---

## メインサイトのリダイレクト設定

### 📌 重要: メインサイトとブログを連携

メインサイト（taskmateai.net）からブログサイトへのリダイレクトを設定します。

### メインサイトの `netlify.toml` に追加

メインサイトのリポジトリの **ルートディレクトリ** に `netlify.toml` を作成・編集：

```toml
# メインサイトの netlify.toml

[[redirects]]
  from = "/blog"
  to = "https://taskmateai-blog.netlify.app"
  status = 200
  force = true

[[redirects]]
  from = "/blog/*"
  to = "https://taskmateai-blog.netlify.app/:splat"
  status = 200
  force = true
```

**設定の説明：**
- `status = 200`: プロキシ（URL変更なし）
- `force = true`: 既存のファイルより優先
- `:splat`: `/blog/posts/example` → ブログサイトの `/posts/example` にマッピング

### カスタムドメイン設定（taskmateai.net を使用する場合）

1. Netlifyダッシュボード → ブログサイトを選択
2. **「Domain settings」** → **「Add custom domain」**
3. `blog.taskmateai.net` を入力
4. DNS設定に従って、Aレコードまたは CNAMEレコードを追加

---

## デプロイ後の確認

### 1. ビルドステータスの確認
Netlifyダッシュボードで「Deploys」タブを確認：
- ✅ **Published**: デプロイ成功
- ⚠️ **Failed**: エラーログを確認

### 2. サイトの動作確認

**ブログサイト単体:**
```
https://taskmateai-blog.netlify.app/
```

**確認ポイント:**
- [ ] トップページが正しく表示される
- [ ] ヘッダーが緑のグラデーション
- [ ] 記事一覧が表示される
- [ ] 記事詳細ページが開く
- [ ] レスポンシブデザインが動作
- [ ] CSSが正しく適用されている

**メインサイト経由（リダイレクト設定後）:**
```
https://taskmateai.net/blog/
```

### 3. パフォーマンスの確認

**Lighthouse スコアの確認:**
1. Chrome DevTools を開く（F12）
2. 「Lighthouse」タブを選択
3. 「Analyze page load」を実行

**目標スコア:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### 4. SEOの確認

**Google Search Console に登録:**
1. https://search.google.com/search-console にアクセス
2. 「プロパティを追加」
3. `taskmateai.net/blog` を登録
4. サイトマップを送信: `https://taskmateai.net/blog/sitemap.xml`

---

## トラブルシューティング

### ❌ ビルドエラー: `Module not found`
**原因:** 依存関係のインストール失敗

**解決策:**
```bash
# ローカルでビルドテスト
npm ci
npm run build

# エラーが出なければ、node_modules を削除してリトライ
rm -rf node_modules package-lock.json
npm install
```

### ❌ デプロイ成功したが、ページが表示されない
**原因:** `publish directory` の設定ミス

**解決策:**
1. Netlify ダッシュボード → 「Site settings」
2. 「Build & deploy」 → 「Continuous deployment」
3. 「Publish directory」を `out` に変更

### ❌ CSSが適用されない
**原因:** `basePath` の設定とアセットパスの不一致

**解決策:**
`next.config.ts` を確認:
```typescript
const nextConfig: NextConfig = {
  basePath: '/blog',
  assetPrefix: '/blog',  // この行があることを確認
  output: 'export',
}
```

### ❌ `/blog` にアクセスしても404エラー
**原因:** メインサイトのリダイレクト設定が未実施

**解決策:**
メインサイトの `netlify.toml` にリダイレクト設定を追加（上記参照）

---

## 継続的な運用

### 記事の追加・更新手順
1. `content/posts/` に新しいマークダウンファイルを作成
2. フロントマター（title, date, description, slug）を記述
3. 記事内容を執筆
4. ローカルで確認: `npm run dev`
5. コミット: `git add . && git commit -m "Add new article"`
6. プッシュ: `git push origin main`
7. Netlify が自動でデプロイ

### 自動デプロイの仕組み
- **main ブランチにプッシュ** → Netlify が自動検知
- **ビルド実行** → デプロイ
- **約2-3分で公開**

---

## チェックリスト

### デプロイ前
- [ ] すべての記事を確認
- [ ] ローカルでビルドが成功する（`npm run build`）
- [ ] GitHubにプッシュ済み

### Netlify設定
- [ ] ビルドコマンド: `npm run build`
- [ ] Publish directory: `out`
- [ ] サイト名を変更（オプション）

### デプロイ後
- [ ] ブログサイトが正常に表示される
- [ ] すべての記事が読める
- [ ] レスポンシブデザインが動作
- [ ] メインサイトからのリダイレクトが動作
- [ ] Google Search Console に登録

---

## サポートリソース

### 公式ドキュメント
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)

### 参考URL
- メインサイト: https://taskmateai.net
- GitHub リポジトリ: https://github.com/IKEMENLTD/TaskMate-SEO

---

**🎉 デプロイ完了後、`https://taskmateai.net/blog/` でブログが公開されます！**
