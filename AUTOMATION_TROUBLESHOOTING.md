# 🚨 自動化システムのトラブルシューティングガイド

## 問題: GitHub Actionsのcronが実行されない

### 発生日時
2025-10-23: cronスケジュールが設定されているが、自動実行されなかった

---

## 根本原因

### 1. GitHub Actionsのscheduled workflowsの既知の制限

**問題**:
- 新規追加されたワークフローは「次のスケジュール時刻」まで待機
- しかし、実際には最初の数回は実行されないケースが多い
- 低頻度のリポジトリ（コミット頻度が低い）では実行がスキップされる
- 60日間コミットがないリポジトリでは自動的に無効化される

**GitHub公式ドキュメント**:
> Scheduled workflows run on the latest commit on the default or base branch. The shortest interval you can run scheduled workflows is once every 5 minutes.
> **Note**: The schedule event can be delayed during periods of high loads of GitHub Actions workflow runs. High load times include the start of every hour. To decrease the chance of delay, schedule your workflow to run at a different time of the hour.

**追加の既知の問題**:
- 低頻度リポジトリではcronが「最適化」のためにスキップされることがある
- フォークされたリポジトリではデフォルトで無効化される
- private リポジトリでは無料プランで月2,000分の制限がある

### 2. 初回実行の遅延

**問題**:
ワークフローファイルを追加した直後は、GitHub Actionsの内部で「スケジュール登録」に時間がかかる。

**症状**:
- ワークフローファイルは存在する
- 手動実行（workflow_dispatch）は成功する
- **しかしcronが実行されない**

---

## 解決策

### ✅ 実施済み（2025-10-23）

#### 1. ワークフローファイルに`push`トリガーを追加
```yaml
on:
  schedule:
    - cron: '0 0 * * *'

  # 追加: ワークフロー更新時に即座に有効化
  push:
    branches:
      - main
    paths:
      - '.github/workflows/auto-publish.yml'

  workflow_dispatch:
```

**効果**: ワークフローファイルをプッシュした瞬間に1度実行され、cronが確実に「登録」される

#### 2. 10/23の記事を手動生成
- タイトル: 「手入力ミスで年間50万円の損失を防ぐ｜データ入力を自動化する3つの方法」
- 文字数: 21,378文字
- コミット: `9ea5996`

---

### 🔄 もし明日（10/24）も動作しなかった場合

#### オプション1: 毎日手動でトリガーする（非推奨）

GitHub Web UIから手動実行：
1. https://github.com/IKEMENLTD/TaskMate-SEO/actions
2. "Auto Generate and Publish Blog Article" を選択
3. "Run workflow" をクリック
4. 日付を指定（例: 2025-10-24）
5. "Run workflow" をクリック

**問題点**: 完全自動化ではない

#### オプション2: cronの時刻を変更する

GitHub Actionsのcronは、毎時0分（UTC X:00）に高負荷になり、実行が遅延・スキップされる。

**推奨時刻**: UTC 0:15 = JST 9:15
```yaml
schedule:
  - cron: '15 0 * * *'  # UTC 0:15 = JST 9:15
```

#### オプション3: 外部サービスからWebhookでトリガー

**GitHub Repository Dispatch**を使用:
1. Personal Access Tokenを作成（`repo`スコープ）
2. 外部cronサービス（例: cron-job.org）から毎日APIを叩く

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/IKEMENLTD/TaskMate-SEO/dispatches \
  -d '{"event_type":"daily_article_generation"}'
```

ワークフローに追加:
```yaml
on:
  repository_dispatch:
    types: [daily_article_generation]
```

#### オプション4: GitHub Actionsの問題として報告

GitHubサポートに連絡し、scheduled workflowsが実行されない理由を確認。

---

## 確認方法

### 1. GitHub Actionsの実行履歴を確認
```
https://github.com/IKEMENLTD/TaskMate-SEO/actions
```

**確認ポイント**:
- "Scheduled" として実行されているか
- 実行時刻がUTC 0:00頃か
- 成功しているか

### 2. 新しいコミットを確認
```bash
cd "/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ"
git pull
git log --oneline | grep "Auto-publish"
```

**期待される結果**:
```
🤖 Auto-publish: New article for 2025-10-24
```

### 3. 本番サイトを確認
```
https://blog.taskmateai.net/
```

新しい記事（10/24）が表示されているか確認

---

## モニタリング方法

### 毎日確認すべきこと（午前10時頃）

1. **GitHub Actionsの実行状態**
   - https://github.com/IKEMENLTD/TaskMate-SEO/actions
   - 最新の実行が「Scheduled」で成功しているか

2. **本番サイトの更新**
   - https://blog.taskmateai.net/
   - 今日の日付の記事が表示されているか

3. **トピックリストの残数**
   - 42記事分のトピックが準備済み（10/23 - 11/14）
   - 残り日数を把握

---

## 長期的な改善策

### 1. より信頼性の高いスケジューリング

**Vercel Cron Jobs**（推奨）:
- Next.jsプロジェクトに最適
- GitHub Actionsより信頼性が高い
- 無料プランで利用可能

**実装方法**:
1. Vercelにデプロイ
2. `vercel.json`にcron設定
3. APIルート（`/api/generate-article`）を作成
4. Vercel Cronから毎日トリガー

### 2. 複数の冗長化

- GitHub Actions（メイン）
- Vercel Cron（バックアップ1）
- cron-job.org（バックアップ2）

3つのうち1つでも動作すれば記事が生成される。

### 3. 通知システムの追加

**Slack通知**:
記事生成の成功・失敗をSlackに通知

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 今後の予定

### 短期（1週間）
- [ ] 明日（10/24）の自動実行を確認
- [ ] 1週間連続で正常動作するか監視
- [ ] もし問題があればオプション2（cronの時刻変更）を実施

### 中期（1ヶ月）
- [ ] 42記事分のトピックをすべて消化（11/14まで）
- [ ] 追加トピックの準備（次の30-50記事）
- [ ] 記事の品質を確認し、プロンプトを調整

### 長期（3ヶ月）
- [ ] Vercel Cronへの移行を検討
- [ ] 複数の冗長化システムの実装
- [ ] 通知システムの追加

---

## 連絡先

問題が発生した場合:
1. このドキュメントのトラブルシューティングを実行
2. GitHub Issuesで報告
3. 必要に応じてGitHubサポートに連絡

---

**最終更新**: 2025-10-23
**作成者**: Claude Code
