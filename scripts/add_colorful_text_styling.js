const fs = require('fs');
const path = require('path');
const glob = require('glob');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const files = glob.sync('*.md', { cwd: postsDir });

console.log(`🎨 カラフルテキスト装飾を追加します（${files.length}件の記事）\n`);
console.log('='.repeat(80));

let totalChanges = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let changeCount = 0;

  // 修正前のコンテンツを保存
  const originalContent = content;

  // ========================================
  // パターン1: 「〇〇:」形式の項目名をティール色に
  // ========================================
  // 例: **データ取得部分:** → <span class="text-teal">**データ取得部分:**</span>

  const labelPatterns = [
    // ティール色適用対象（説明・プロセス系）
    /\*\*(コードの説明|データ取得部分|日付計算|集計処理|前週比計算|メール送信|具体的にどんな場面|どういう部分|修正が必要|やりたいこと|問題を解決|自動化したい|困っていること):(\*\*)/g,
  ];

  labelPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, '<span class="text-teal">$1:</span>');
      changeCount += matches.length;
      modified = true;
    }
  });

  // ========================================
  // パターン2: 「実行結果」「成功」「完了」をグリーン色に
  // ========================================
  const successPatterns = [
    /\*\*(実行結果|成功|完了|達成|解決|動いた):(\*\*)/g,
    /\*\*(〇|✅|✓)\*\*/g, // チェックマークもグリーン
  ];

  successPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, '<span class="text-success">$1</span>');
      changeCount += matches.length;
      modified = true;
    }
  });

  // ========================================
  // パターン3: 記事タイトル（## 見出し）に下線
  // ========================================
  // Markdown内の## で始まる大見出しに下線を追加
  const h2Pattern = /^## (.+)$/gm;
  const h2Matches = content.match(h2Pattern);

  if (h2Matches) {
    content = content.replace(h2Pattern, (match, title) => {
      // すでにspanが含まれている場合はスキップ
      if (title.includes('<span')) {
        return match;
      }
      return `## <span class="text-underline">${title}</span>`;
    });
    changeCount += h2Matches.length;
    modified = true;
  }

  // ========================================
  // パターン4: 強調されたフレーズをティール色に
  // ========================================
  // 例: **「エラーばかりで、まともなコードが書けない...」**
  const emphasisPattern = /\*\*「([^」]+)」\*\*/g;
  const emphasisMatches = content.match(emphasisPattern);

  if (emphasisMatches) {
    content = content.replace(emphasisPattern, '<span class="text-teal">**「$1」**</span>');
    changeCount += emphasisMatches.length;
    modified = true;
  }

  // ========================================
  // パターン5: 💡 で始まる見出しをティール色に
  // ========================================
  const lightbulbPattern = /^### (💡 .+)$/gm;
  const lightbulbMatches = content.match(lightbulbPattern);

  if (lightbulbMatches) {
    content = content.replace(lightbulbPattern, (match, title) => {
      if (title.includes('<span')) {
        return match;
      }
      return `### <span class="text-teal">${title}</span>`;
    });
    changeCount += lightbulbMatches.length;
    modified = true;
  }

  // ========================================
  // 保存
  // ========================================
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalChanges += changeCount;
    console.log(`  ✅ ${file}: ${changeCount}箇所に装飾追加\n`);
  } else {
    console.log(`  ⏭️  ${file}: 修正不要\n`);
  }
});

console.log('='.repeat(80));
console.log(`\n🎉 完了！合計${totalChanges}箇所にカラフルテキスト装飾を追加しました`);
console.log('✨ スクリーンショットと同じビジュアルスタイルが適用されました\n');
