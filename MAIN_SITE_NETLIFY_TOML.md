# メインサイト用 netlify.toml 設定

## 📍 配置場所
このファイルを **メインサイト（taskmateai.net）のリポジトリのルートディレクトリ** に配置してください。

## 📝 設定内容

```toml
# メインサイト（taskmateai.net）用 Netlify設定

[build]
  # メインサイトのビルドコマンド（既存の設定に合わせて調整）
  command = "npm run build"
  publish = "dist"  # または "out" / "build" など、メインサイトの設定に合わせる

# ========================
# ブログサイトへのリダイレクト
# ========================

[[redirects]]
  # /blog へのアクセスをブログサイトへプロキシ
  from = "/blog"
  to = "https://taskmateai-blog.netlify.app"
  status = 200
  force = true

[[redirects]]
  # /blog/* 配下すべてをブログサイトへプロキシ
  from = "/blog/*"
  to = "https://taskmateai-blog.netlify.app/:splat"
  status = 200
  force = true

# ========================
# セキュリティヘッダー
# ========================

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

## 🔧 設定の説明

### リダイレクトルール

#### ルール1: `/blog` へのアクセス
```toml
[[redirects]]
  from = "/blog"
  to = "https://taskmateai-blog.netlify.app"
  status = 200
  force = true
```

- **from**: `/blog` - ユーザーがアクセスするURL
- **to**: `https://taskmateai-blog.netlify.app` - ブログサイトのURL（実際のNetlify URLに変更）
- **status**: `200` - プロキシとして動作（URLバーは変わらない）
- **force**: `true` - 既存ファイルより優先

#### ルール2: `/blog/*` 配下すべて
```toml
[[redirects]]
  from = "/blog/*"
  to = "https://taskmateai-blog.netlify.app/:splat"
  status = 200
  force = true
```

- **`:splat`**: ワイルドカード部分をそのまま転送
- 例: `/blog/posts/example` → `https://taskmateai-blog.netlify.app/posts/example`

### Status コードの違い

| Status | 動作 | URLバー | SEO |
|--------|------|---------|-----|
| **200** | プロキシ | `taskmateai.net/blog` のまま | ◎ 最適 |
| **301** | 永久リダイレクト | `taskmateai-blog.netlify.app` に変わる | ○ 可 |
| **302** | 一時リダイレクト | `taskmateai-blog.netlify.app` に変わる | △ 非推奨 |

**推奨: status = 200** を使用してください。

---

## 🚀 適用手順

### ステップ1: ファイルの配置
1. メインサイトのリポジトリをクローンまたは開く
2. ルートディレクトリに `netlify.toml` を作成
3. 上記の設定をコピー&ペースト

### ステップ2: ブログサイトのURLを更新
```toml
# この部分を実際のブログサイトのURLに変更
to = "https://taskmateai-blog.netlify.app"
```

**変更例:**
- サイト名を変更した場合: `https://your-custom-name.netlify.app`
- カスタムドメインを設定した場合: `https://blog.taskmateai.net`

### ステップ3: GitHubにプッシュ
```bash
git add netlify.toml
git commit -m "Add blog redirect configuration"
git push origin main
```

### ステップ4: Netlifyで自動デプロイ
- プッシュ後、Netlifyが自動でデプロイを開始
- 約2-3分で設定が反映

### ステップ5: 動作確認
```bash
# ブラウザでアクセス
https://taskmateai.net/blog/

# 以下が表示されればOK:
# - ブログサイトのトップページ
# - URLは taskmateai.net/blog のまま
```

---

## ✅ チェックリスト

### 設定前
- [ ] メインサイトの既存 `netlify.toml` を確認
- [ ] ブログサイトのNetlify URLを取得
- [ ] バックアップを取る

### 設定後
- [ ] `netlify.toml` をルートに配置
- [ ] ブログサイトのURLを正しく設定
- [ ] GitHubにプッシュ
- [ ] Netlifyでデプロイ完了を確認
- [ ] `https://taskmateai.net/blog/` にアクセスしてテスト

---

## 🔍 トラブルシューティング

### ❌ `/blog` にアクセスしても404エラー
**原因:** リダイレクトルールが反映されていない

**解決策:**
1. Netlify ダッシュボード → メインサイトを選択
2. 「Deploys」タブで最新のデプロイを確認
3. `netlify.toml` がデプロイされているか確認

### ❌ リダイレクトループが発生
**原因:** ブログサイト側にも同じリダイレクトルールがある

**解決策:**
- ブログサイトの `netlify.toml` には **リダイレクトルールを入れない**
- メインサイトのみに設定

### ❌ URLが `taskmateai-blog.netlify.app` に変わってしまう
**原因:** `status = 301` または `302` になっている

**解決策:**
```toml
status = 200  # 必ず 200 にする
```

---

## 📊 期待される結果

### 正常動作時
```
ユーザーのアクセス: https://taskmateai.net/blog/
                ↓
     Netlify プロキシ (status 200)
                ↓
  実際の表示: https://taskmateai-blog.netlify.app
                ↓
      URLバーは変わらない
  表示: https://taskmateai.net/blog/
```

### SEOの利点
- **ドメイン統一**: `taskmateai.net` ドメインで評価される
- **リンクジュース**: メインサイトとブログが連携
- **ユーザー体験**: URLが変わらず、シームレス

---

## 📌 重要な注意事項

### 1. ブログサイトには設定不要
ブログサイト（TaskMateブログ）の `netlify.toml` には：
```toml
[build]
  command = "npm run build"
  publish = "out"

# リダイレクトルールは不要！
```

### 2. カスタムドメイン使用時
カスタムドメイン（`blog.taskmateai.net`）を使う場合：
```toml
[[redirects]]
  from = "/blog/*"
  to = "https://blog.taskmateai.net/:splat"  # カスタムドメインに変更
  status = 200
  force = true
```

### 3. 既存の `netlify.toml` がある場合
- 既存の設定を **上書きせず追加** する
- `[[redirects]]` セクションを既存ファイルの最後に追加

---

## 📚 参考リンク

- [Netlify Redirects 公式ドキュメント](https://docs.netlify.com/routing/redirects/)
- [Netlify Proxy Redirects](https://docs.netlify.com/routing/redirects/redirect-options/#proxy-redirects)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**設定完了後、`https://taskmateai.net/blog/` でブログが表示されます！** 🎉
