# メインサイト（taskmateai.net）側のnetlify.toml設定

メインサイトのプロジェクトルートに以下の設定を追加してください。

## メインサイトのnetlify.toml

```toml
# メインサイト側のnetlify.toml（既存の設定に追加）

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

## 注意点

1. `taskmateai-blog.netlify.app` の部分は、実際にNetlifyでブログをデプロイした後の正しいURLに変更してください
2. カスタムドメインを設定している場合は、そのURLに変更してください
3. `status = 200` はプロキシとして動作し、URLバーには `/blog` が表示されたままになります
4. `force = true` は、他のルールよりも優先してこのリダイレクトを適用します

## デプロイ手順

1. ブログプロジェクト（taskmateai-blog）をGitHubにプッシュ
2. NetlifyでブログプロジェクトをデプロイしてURLを取得
3. メインサイトのnetlify.tomlに上記の設定を追加
4. メインサイトを再デプロイ
5. `https://taskmateai.net/blog` でブログにアクセスできることを確認
