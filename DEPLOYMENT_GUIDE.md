# TaskMateAI ブログ - デプロイメントガイド

このガイドでは、TaskMateAI ブログをGitHubにプッシュし、Netlifyにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Netlifyアカウント
- Git CLIがインストールされていること

## ステップ1: GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンをクリック→「New repository」
3. リポジトリ設定:
   - Repository name: `taskmateai-blog`
   - Description: "TaskMateAI公式ブログ - タスク管理とAIに関する情報メディア"
   - Public または Private を選択
   - **重要**: "Add a README file"、".gitignore"、"license"は**チェックしない**（既に作成済み）
4. 「Create repository」をクリック

## ステップ2: GitHubにプッシュ

リポジトリ作成後、表示されるコマンドを参考に以下を実行:

```bash
cd /mnt/c/Users/ooxmi/Downloads/taskmateai-blog

# リモートリポジトリを追加（URLは自分のものに変更）
git remote add origin https://github.com/[あなたのユーザー名]/taskmateai-blog.git

# プッシュ
git push -u origin main
```

認証が必要な場合は、GitHubの個人アクセストークン(PAT)を使用してください。

## ステップ3: Netlifyでサイトをデプロイ

### 3-1. Netlifyにログインしてサイトを追加

1. [Netlify](https://app.netlify.com)にログイン
2. 「Add new site」→「Import an existing project」をクリック
3. 「Deploy with GitHub」を選択
4. GitHubアカウントと連携（初回のみ）
5. `taskmateai-blog`リポジトリを選択

### 3-2. ビルド設定

以下の設定を確認・入力:

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `out`

設定を確認したら「Deploy site」をクリック

### 3-3. デプロイの待機

初回デプロイには数分かかります。デプロイログを確認して、エラーがないことを確認してください。

### 3-4. サイト名の変更（オプション）

1. 「Site settings」→「General」→「Site details」
2. 「Change site name」をクリック
3. サイト名を入力（例: `taskmateai-blog`）
4. 保存

これで `https://taskmateai-blog.netlify.app` でアクセスできるようになります。

## ステップ4: メインサイトとの連携

メインサイト（taskmateai.net）のプロジェクトで、以下の設定を追加します。

### 4-1. メインサイトのnetlify.tomlを編集

メインサイトのプロジェクトルートにある`netlify.toml`に以下を追加:

```toml
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

**注意**: `taskmateai-blog.netlify.app` の部分は、実際のNetlify URLに変更してください。

### 4-2. メインサイトを再デプロイ

メインサイトのnetlify.tomlを更新した後、変更をコミットしてGitHubにプッシュすると、自動的に再デプロイされます。

```bash
cd [メインサイトのディレクトリ]
git add netlify.toml
git commit -m "Add blog redirect configuration"
git push origin main
```

## ステップ5: 動作確認

1. `https://taskmateai.net/blog` にアクセス
2. ブログのホームページが表示されることを確認
3. 記事リンクをクリックして、個別記事が表示されることを確認
4. URLバーに `/blog` が表示されたままであることを確認

## ステップ6: カスタムドメイン設定（オプション）

独自ドメインを使用する場合:

1. Netlify ダッシュボード→「Domain settings」
2. 「Add custom domain」をクリック
3. ドメインを入力して設定を完了
4. DNSレコードを設定（ガイドに従う）

## トラブルシューティング

### ビルドエラーが発生する

- Netlifyのビルドログを確認
- ローカルで `npm run build` を実行してエラーを特定
- Node.jsのバージョンが18以上であることを確認

### `/blog` にアクセスしてもブログが表示されない

- メインサイトのnetlify.tomlの設定を確認
- リダイレクトのURLが正しいか確認
- Netlifyでメインサイトが再デプロイされたか確認

### スタイルが崩れる

- `basePath` の設定を確認（next.config.ts）
- 画像やCSSのパスが正しいか確認

## 記事の追加・更新

新しい記事を追加する場合:

1. `content/posts/` に新しい`.md`ファイルを作成
2. フロントマターを追加
3. コミットしてプッシュ
4. Netlifyが自動的に再デプロイ

## まとめ

これで、TaskMateAI ブログが `https://taskmateai.net/blog` で公開されました！

定期的に記事を更新して、SEOパフォーマンスを向上させましょう。

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Netlify ドキュメント](https://docs.netlify.com/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Markdown ガイド](https://www.markdownguide.org/)
