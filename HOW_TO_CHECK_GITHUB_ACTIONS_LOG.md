# 📋 GitHub Actionsのログ確認手順（完全ガイド）

**作成日**: 2025-10-28
**目的**: なぜ記事が自動生成されていないのか確認する

---

## 🎯 確認する内容

以下の3つを確認します：

1. **GitHub Actionsが実行されているか**
2. **記事生成スクリプトが成功しているか**
3. **API Keyが正しく渡されているか**

---

## 📱 手順1: GitHubにアクセス

### 1-1. ブラウザでGitHubを開く

```
https://github.com/IKEMENLTD/TaskMate-SEO
```

### 1-2. ログインする

- GitHubアカウントでログイン
- リポジトリが表示されることを確認

---

## 🔍 手順2: Actionsタブを開く

### 2-1. 上部のタブメニューから「Actions」をクリック

```
Code | Issues | Pull requests | Actions | Projects | ...
                                  ↑
                              ここをクリック
```

### 2-2. ワークフロー一覧を確認

左側のサイドバーに以下が表示されます：

```
All workflows
├─ Auto Generate and Publish Blog Article  ← これをクリック
```

---

## 📊 手順3: 最新の実行ログを確認

### 3-1. 実行履歴を見る

画面に表示される実行履歴：

```
Run #8  ✓  Scheduled  main  30s ago
Run #7  ✓  Scheduled  main  1 day ago
Run #6  ✓  Scheduled  main  2 days ago
...
```

### 3-2. 最新の実行（Run #8）をクリック

---

## 🔎 手順4: 詳細ログを確認

### 4-1. ジョブをクリック

```
generate-and-publish
├─ Build
   ├─ Set up job             ✓
   ├─ Checkout repository    ✓
   ├─ Setup Node.js          ✓
   ├─ Install dependencies   ✓
   ├─ Generate new article   ✓ ← これをクリック
   ├─ Check for changes      ✓
   ├─ Configure Git          -
   ├─ Commit and push        -
   └─ Notify success         ✓
```

### 4-2. 「Generate new article」のログを読む

展開されたログに以下のような内容が表示されます：

#### ✅ 正常なパターン（記事が生成された場合）

```
Run node scripts/generate-article.js
🤖 ===============================================
🤖 TaskMate Blog - Auto Article Generator
🤖 ===============================================

📅 Target date: 2025-10-28

📖 Analyzing existing articles...
✅ Style analysis complete

🎯 Selecting next topic...
✅ Topic selected: 給与計算ミスをゼロにする方法

✍️  Generating article with Claude API...
🤖 Calling Claude API to generate article...
✅ Article generated successfully
✅ Article saved successfully!
📝 File: payroll-error-prevention-calculation.md

🎉 Article generation completed successfully!
🎉 ===============================================
```

#### ❌ 異常なパターン1（API Keyが設定されていない）

```
Run node scripts/generate-article.js
🤖 ===============================================
🤖 TaskMate Blog - Auto Article Generator
🤖 ===============================================

❌ ANTHROPIC_API_KEY is not set
Please set it in GitHub Secrets
```

#### ❌ 異常なパターン2（記事が既に存在する）

```
Run node scripts/generate-article.js
🤖 ===============================================
🤖 TaskMate Blog - Auto Article Generator
🤖 ===============================================

📅 Target date: 2025-10-28

ℹ️  Article for 2025-10-28 already exists
Skipping generation to avoid duplicates
```

#### ❌ 異常なパターン3（トピックがない）

```
Run node scripts/generate-article.js
🤖 ===============================================
🤖 TaskMate Blog - Auto Article Generator
🤖 ===============================================

📅 Target date: 2025-10-28

🎯 Selecting next topic...
⚠️  No available topics remaining
Please add more topics to scripts/article-topics.json
```

---

## 🎯 手順5: 次のステップを確認

### 5-1. 「Check for changes」のログを確認

「Generate new article」の次のステップをクリック：

```
├─ Generate new article   ✓
├─ Check for changes      ✓ ← これをクリック
```

#### ✅ 正常なパターン（記事が生成された）

```
Run if git diff --quiet...
✅ New article generated successfully
```

#### ❌ 異常なパターン（記事が生成されなかった）

```
Run if git diff --quiet...
ℹ️  No new article generated (may already exist for today)
```

---

## 📋 確認すべきポイント（チェックリスト）

実行ログを見て、以下をチェックしてください：

### ✅ GitHub Actionsが実行されている
- [ ] Run #8 以降の実行がある
- [ ] 実行時刻が毎日 UTC 0:00 頃（JST 9:00）
- [ ] ステータスが ✓（成功）

### ✅ スクリプトが起動している
- [ ] 「Generate new article」ステップが実行されている
- [ ] 「🤖 TaskMate Blog - Auto Article Generator」が表示されている

### ❌ 問題を特定する

以下のどれが表示されているか確認：

#### パターンA: API Keyエラー
```
❌ ANTHROPIC_API_KEY is not set
```
→ **対処法**: GitHub Secretsを設定する（後述）

#### パターンB: 記事が既に存在
```
ℹ️  Article for 2025-10-28 already exists
```
→ **対処法**: 既存記事の日付を確認（バグの可能性）

#### パターンC: トピックがない
```
⚠️  No available topics remaining
```
→ **対処法**: トピックリストを追加

#### パターンD: その他のエラー
```
❌ Error occurred during article generation
```
→ **対処法**: エラーメッセージを確認して対応

---

## 🔧 対処法：GitHub Secretsを設定する

### 問題が「API Keyエラー」だった場合

#### ステップ1: Settingsタブを開く

```
Code | Issues | Pull requests | Actions | Settings
                                           ↑
                                       ここをクリック
```

#### ステップ2: Secrets and variablesを開く

左側のメニューから：

```
Security
├─ Secrets and variables
   ├─ Actions  ← ここをクリック
```

#### ステップ3: Secretsを確認

画面に表示される内容：

```
Repository secrets

ANTHROPIC_API_KEY  Updated X days ago  Update | Remove
```

**確認ポイント**:
- `ANTHROPIC_API_KEY` が存在するか
- 最終更新日が最近か

#### ステップ4: Secretsを再設定（必要な場合）

1. **既存のSecretを削除**（オプション）
   - `ANTHROPIC_API_KEY` の右側の「Remove」をクリック

2. **新しいSecretを追加**
   - 右上の「New repository secret」をクリック
   - Name: `ANTHROPIC_API_KEY`
   - Secret: `あなたのAnthropic API Keyを入力`
   - 「Add secret」をクリック

---

## 🧪 手順6: 手動テスト実行

### 6-1. Actionsタブに戻る

```
Code | Issues | Pull requests | Actions
                                  ↑
                              ここをクリック
```

### 6-2. ワークフローを選択

```
All workflows
├─ Auto Generate and Publish Blog Article  ← これをクリック
```

### 6-3. 手動実行

右上の「Run workflow」ボタンをクリック：

```
┌─────────────────────────────────┐
│ Run workflow                     │
│                                  │
│ Branch: main                     │
│                                  │
│ 記事の日付 (YYYY-MM-DD, 空欄で今日) │
│ [           ]                    │
│                                  │
│ トピック指定（オプション）            │
│ [           ]                    │
│                                  │
│ [Run workflow]                   │
└─────────────────────────────────┘
```

日付を空欄のまま「Run workflow」をクリック

### 6-4. 実行結果を確認

30秒後にページを更新して、新しい実行が追加されているか確認：

```
Run #9  ✓  workflow_dispatch  main  just now  ← 新しい実行
Run #8  ✓  Scheduled          main  30s ago
```

Run #9をクリックして、ログを確認（手順4と同じ）

---

## 📊 結果の解釈

### ケース1: 手動実行で記事が生成された

**原因**:
- scheduled実行に問題がある
- cronの時刻設定ミス

**対処法**:
- `.github/workflows/auto-publish.yml`のcron設定を確認

### ケース2: 手動実行でもAPI Keyエラー

**原因**:
- GitHub Secretsが正しく設定されていない

**対処法**:
- Secretsを再設定（手順5-4）

### ケース3: 手動実行で「記事が既に存在」

**原因**:
- スクリプトのバグ
- 日付チェックロジックのミス

**対処法**:
- スクリプトのデバッグが必要

---

## 📞 サポート

### 確認した内容を共有してください

以下の情報をメモして、次の対応に役立ててください：

```
【確認結果】
1. GitHub Actionsの実行回数: ___回
2. 最新実行の時刻: ____年__月__日 __:__
3. 「Generate new article」のログ内容:
   - [ ] ✅ 記事生成成功
   - [ ] ❌ API Keyエラー
   - [ ] ℹ️ 記事が既に存在
   - [ ] ⚠️ トピックがない
   - [ ] その他: _______________

4. 手動実行の結果:
   - [ ] まだ試していない
   - [ ] ✅ 成功
   - [ ] ❌ 失敗（理由: _______）
```

---

## 🎯 次のステップ

確認結果に応じて、以下を実施してください：

### API Keyエラーの場合
→ GitHub Secretsを再設定（手順5）

### 記事が既に存在の場合
→ スクリプトのバグ修正が必要

### トピックがないの場合
→ トピックリストを追加

### その他のエラーの場合
→ エラーメッセージを共有してください

---

**最終更新**: 2025-10-28
**作成者**: Claude Code
