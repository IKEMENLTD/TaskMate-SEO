# 🤖 自動記事生成システム - セットアップガイド

## 📋 概要

このシステムは、GitHub Actionsを使用して**毎日自動的に**ブログ記事を生成し、Netlifyにデプロイします。

### システム構成

```
GitHub Actions (毎日午前9時に自動実行)
    ↓
Claude API で記事生成 (6,000文字のSEO最適化記事)
    ↓
GitHubにコミット & プッシュ
    ↓
Netlify 自動デプロイ
```

---

## 🔧 セットアップ手順

### ステップ1: GitHub Secrets の設定

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/IKEMENLTD/TaskMate-SEO
   ```

2. **Settings タブをクリック**

3. 左サイドバーの **Secrets and variables** → **Actions** をクリック

4. **New repository secret** をクリック

5. **シークレットを追加**:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Secret**: あなたのClaude APIキー

   ```
   sk-ant-api03-...（あなたのAPIキー）
   ```

6. **Add secret** をクリック

✅ これでGitHub Actionsからclaude APIを呼び出せるようになりました！

---

### ステップ2: GitHub Actionsの有効化確認

1. GitHubリポジトリの **Actions** タブをクリック

2. 以下のワークフローが表示されることを確認:
   ```
   Auto Generate and Publish Blog Article
   ```

3. もし「Actions are disabled」と表示されたら:
   - **I understand my workflows, go ahead and enable them** をクリック

---

### ステップ3: 手動テスト実行

1. **Actions** タブ → **Auto Generate and Publish Blog Article** を選択

2. 右側の **Run workflow** ボタンをクリック

3. **Run workflow** (緑のボタン) をクリック

4. 実行開始！（約2-3分で完了）

5. 結果を確認:
   - ✅ 緑のチェックマーク = 成功
   - ❌ 赤いバツマーク = 失敗（ログを確認）

---

## ⏰ 自動実行スケジュール

### デフォルト設定

- **毎日午前9時（日本時間）に自動実行**
- UTC 0:00 = JST 9:00

### スケジュール変更方法

`.github/workflows/auto-publish.yml` の以下の部分を編集:

```yaml
schedule:
  - cron: '0 0 * * *'  # UTC 0:00 = JST 9:00
```

#### 例：毎日午前6時に変更

```yaml
schedule:
  - cron: '0 21 * * *'  # UTC 21:00 = JST 6:00
```

#### 例：週3回（月・水・金の午前9時）に変更

```yaml
schedule:
  - cron: '0 0 * * 1,3,5'  # 月・水・金のUTC 0:00
```

---

## 📝 トピック管理

### トピックリストの確認

`scripts/article-topics.json` に30個のトピックが用意されています。

### トピックを追加する方法

1. `scripts/article-topics.json` を編集

2. 以下の形式で追加:

```json
{
  "title": "【2025年版】タイトル｜サブタイトル",
  "description": "記事の説明文（SEO用）",
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "slug": "url-slug-name-2025"
}
```

3. GitHubにプッシュ

✅ 次回の自動実行から新しいトピックが使用されます！

---

## 🎮 使い方

### 自動実行（推奨）

**何もしなくてOK！**

- 毎日午前9時に自動的に記事が生成されます
- GitHubに自動コミット
- Netlifyが自動デプロイ

### 手動実行

1. GitHub → **Actions** タブ
2. **Auto Generate and Publish Blog Article** を選択
3. **Run workflow** をクリック
4. オプション設定（任意）:
   - **日付**: 特定の日付の記事を生成（例: 2025-10-25）
   - **トピック**: 指定は現在未対応（空欄でOK）
5. **Run workflow** をクリック

---

## 📊 モニタリング

### 実行履歴の確認

GitHub → **Actions** タブで全ての実行履歴を確認可能:

- ✅ 緑色 = 成功
- 🟡 黄色 = 実行中
- ❌ 赤色 = 失敗

### ログの確認

1. 実行結果をクリック
2. **generate-and-publish** ジョブをクリック
3. 各ステップのログを確認

### 失敗時の対応

**よくある失敗原因**:

1. **API キーが設定されていない**
   - GitHub Secrets を確認

2. **トピックが全て使い切られた**
   - `article-topics.json` にトピックを追加

3. **既に今日の記事が存在する**
   - 正常動作（重複防止）

4. **Claude API のエラー**
   - API キーの有効性を確認
   - レート制限を確認

---

## 🔔 通知設定（オプション）

### メール通知

GitHub Actionsが失敗すると、自動でメール通知が届きます。

### Slack通知を追加

`.github/workflows/auto-publish.yml` に以下を追加:

```yaml
- name: Notify Slack
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '✅ 新しい記事が公開されました！'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

GitHub Secrets に `SLACK_WEBHOOK` を追加してください。

---

## 🛠️ トラブルシューティング

### Q1: ワークフローが実行されない

**確認事項**:
- GitHub Actions が有効になっているか
- cronスケジュールが正しいか
- リポジトリが Public か（Private の場合は有料プラン必要）

### Q2: 記事が生成されない

**確認事項**:
- `ANTHROPIC_API_KEY` が設定されているか
- トピックリストに未使用のトピックがあるか
- Claude API の利用制限に達していないか

### Q3: Netlify にデプロイされない

**確認事項**:
- GitHub への push が成功しているか
- Netlify とGitHub の連携が有効か
- Netlify のビルド設定が正しいか

### Q4: 記事の品質が低い

**改善方法**:
- `scripts/generate-article.js` のプロンプトを調整
- `temperature` パラメータを調整（現在: 0.7）
- より多くの既存記事を参照するように変更

---

## 📈 カスタマイズ

### 記事の文字数を変更

`scripts/generate-article.js` の以下の部分を編集:

```javascript
- **文字数**: 5,000-6,500文字（必須）
```

### 記事のトーンを変更

プロンプトの「スタイル統一」セクションを編集して、
より専門的、カジュアル、ビジネスライクなど、好みのトーンに調整できます。

### 複数記事の同時生成

`.github/workflows/auto-publish.yml` に以下を追加:

```yaml
strategy:
  matrix:
    count: [1, 2, 3]  # 1日3記事生成
```

---

## 💰 コスト

### GitHub Actions

- **Public リポジトリ**: 完全無料
- **Private リポジトリ**: 月2,000分まで無料

### Claude API

- **Sonnet 4.5**: 約$0.30-0.50/記事
- **月30記事**: 約$9-15
- **年間**: 約$108-180

### Netlify

- **Free プラン**: 月300ビルド分まで無料
- **現在の使用量**: 月30ビルド程度

**合計月額コスト**: 約$9-15（記事生成のみ）

---

## 📚 関連ファイル

```
.github/workflows/auto-publish.yml    # GitHub Actions設定
scripts/generate-article.js           # 記事生成スクリプト
scripts/article-topics.json           # トピックリスト
content/posts/*.md                    # 生成された記事
```

---

## ✅ セットアップ完了チェックリスト

- [ ] GitHub Secrets に `ANTHROPIC_API_KEY` を設定
- [ ] GitHub Actions が有効化されている
- [ ] 手動テスト実行が成功
- [ ] トピックリストを確認
- [ ] 自動実行スケジュールを確認
- [ ] Netlify との連携を確認

**全てチェックが付いたら、セットアップ完了です！🎉**

---

## 🆘 サポート

問題が発生した場合:

1. GitHub Actions のログを確認
2. このガイドのトラブルシューティングを確認
3. GitHub Issues で報告

---

**Happy Blogging! 🚀**
