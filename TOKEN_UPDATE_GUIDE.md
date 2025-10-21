# 🔑 GitHub Personal Access Token の更新ガイド

## ⚠️ 問題

現在のPersonal Access Tokenに `workflow` スコープがないため、GitHub Actions ファイルをプッシュできません。

## ✅ 解決方法

### ステップ1: 既存のTokenを更新

1. **GitHub にアクセス**
   ```
   https://github.com/settings/tokens
   ```

2. **既存のToken「TaskMate Blog Deployment」を探す**
   - リストから該当のTokenを見つける

3. **Edit (編集) をクリック**

4. **スコープに `workflow` を追加**
   - ✅ `workflow` にチェックを入れる
   - 説明: Update GitHub Action workflow files

5. **Update token** をクリック

6. **新しいTokenをコピー** (再表示されます)

7. **Git remoteを更新**:
   ```bash
   cd "/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ"

   # 現在のremoteを削除
   git remote remove origin

   # 新しいTokenでremoteを追加
   git remote add origin https://新しいToken@github.com/IKEMENLTD/TaskMate-SEO.git

   # プッシュ
   git push -u origin main
   ```

---

### または: 新しいTokenを作成

既存のTokenを編集できない場合は、新しいTokenを作成します：

1. **GitHub Token設定ページ**
   ```
   https://github.com/settings/tokens
   ```

2. **Generate new token (classic)** をクリック

3. **設定**:
   - **Note**: `TaskMate Blog Automation`
   - **Expiration**: No expiration (または1年)
   - **スコープ**:
     - ✅ `repo` (フルアクセス)
     - ✅ `workflow` (重要！)

4. **Generate token** をクリック

5. **Tokenをコピー** (二度と表示されません！)

6. **Git remoteを更新**:
   ```bash
   cd "/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ"

   git remote set-url origin https://新しいToken@github.com/IKEMENLTD/TaskMate-SEO.git

   git push -u origin main
   ```

---

## 🔒 `workflow` スコープが必要な理由

GitHub Actionsのワークフローファイル (`.github/workflows/*.yml`) を作成・編集するには、
セキュリティ上の理由で明示的に `workflow` スコープの許可が必要です。

これにより、悪意のあるスクリプトが勝手にワークフローを変更できないようになっています。

---

## ✅ 確認方法

Tokenが正しく設定されているか確認:

```bash
cd "/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ"
git push
```

成功すれば、以下のように表示されます:
```
To https://github.com/IKEMENLTD/TaskMate-SEO.git
   557b630..a4a3678  main -> main
```

---

**この手順が完了したら、私に教えてください！次のステップに進みます。** 🚀
