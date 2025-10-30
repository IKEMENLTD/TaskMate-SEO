const fs = require('fs');
const path = require('path');
const glob = require('glob');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const files = glob.sync('*.md', { cwd: postsDir });

console.log(`🔥 AI臭を完全に削除します（${files.length}件の記事）\n`);
console.log('=' .repeat(80));

let totalChanges = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let changeCount = 0;

  // 修正前のコンテンツを保存
  const originalContent = content;

  // ========================================
  // 修正1: インラインアイコンタグを完全削除
  // ========================================
  const iconPattern = /<img src="\/icons\/[^"]*" alt="[^"]*" class="inline-icon"[^>]*>/g;
  const iconMatches = content.match(iconPattern);
  if (iconMatches) {
    content = content.replace(iconPattern, '');
    changeCount += iconMatches.length;
    modified = true;
    console.log(`  🗑️  ${file}: インラインアイコン${iconMatches.length}個削除`);
  }

  // ========================================
  // 修正2: タイトルから太字マークダウン削除
  // ========================================
  const titlePattern = /^title: '(\*\*[^*]+\*\*[^']*)'$/gm;
  const titleMatch = content.match(titlePattern);
  if (titleMatch) {
    content = content.replace(titlePattern, (match, titleContent) => {
      // **を削除
      const cleanTitle = titleContent.replace(/\*\*/g, '');
      return `title: '${cleanTitle}'`;
    });
    changeCount++;
    modified = true;
    console.log(`  ✏️  ${file}: タイトルから太字削除`);
  }

  // ========================================
  // 修正3: ### 見出しから絵文字を削除（## は残す）
  // ========================================
  const lines = content.split('\n');
  const newLines = [];
  let emojiRemovedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ### 見出しのみ処理（## は処理しない）
    if (line.match(/^### /)) {
      // 絵文字パターンをチェック
      const emojiPattern = /^### [📍📝💡📊🎯✅⚡🔧🚀💰⏰🎉] (.+)$/;
      const match = line.match(emojiPattern);

      if (match) {
        // 絵文字を削除して見出しテキストのみ残す
        newLines.push(`### ${match[1]}`);
        emojiRemovedCount++;
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  if (emojiRemovedCount > 0) {
    content = newLines.join('\n');
    changeCount += emojiRemovedCount;
    modified = true;
    console.log(`  🎨 ${file}: ### 見出しから絵文字${emojiRemovedCount}個削除`);
  }

  // ========================================
  // 修正4: 連続する太字文の間に空行を追加
  // ========================================
  const lines2 = content.split('\n');
  const newLines2 = [];

  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i];
    const nextLine = i < lines2.length - 1 ? lines2[i + 1] : '';

    newLines2.push(line);

    // 現在の行が太字で終わり、次の行も太字で始まる場合
    if (line.match(/\*\*[^*]+\*\*\s*$/) && nextLine.match(/^\*\*[^*]+\*\*/)) {
      // 空行を挿入
      newLines2.push('');
    }
  }

  const spacingAddedCount = newLines2.length - lines2.length;
  if (spacingAddedCount > 0) {
    content = newLines2.join('\n');
    changeCount += spacingAddedCount;
    modified = true;
    console.log(`  📏 ${file}: 自然な空行${spacingAddedCount}箇所追加`);
  }

  // ========================================
  // 修正5: 過剰な --- 区切りを削除
  // ========================================
  // 3つ以上連続する --- を2つに減らす
  const excessiveDividers = content.match(/(\n---\n){3,}/g);
  if (excessiveDividers) {
    content = content.replace(/(\n---\n){3,}/g, '\n---\n\n---\n');
    changeCount += excessiveDividers.length;
    modified = true;
    console.log(`  ✂️  ${file}: 過剰な区切り線を削減`);
  }

  // ========================================
  // 修正6: 不自然な強調パターンの修正
  // ========================================
  // **2日**、**50人** のような数字強調を自然な文脈のみに
  // 1文に3個以上の太字がある場合、数字の太字を削除
  const lines3 = content.split('\n');
  const newLines3 = [];
  let boldReductionCount = 0;

  for (let i = 0; i < lines3.length; i++) {
    let line = lines3[i];

    // 1行の太字カウント
    const boldMatches = line.match(/\*\*[^*]+\*\*/g);

    if (boldMatches && boldMatches.length >= 4) {
      // 太字が多すぎる場合、数字+単位の太字を削除
      line = line.replace(/\*\*(\d+(?:時間|日|週間|ヶ月|%|円|人|回|行))\*\*/g, '$1');
      boldReductionCount++;
    }

    newLines3.push(line);
  }

  if (boldReductionCount > 0) {
    content = newLines3.join('\n');
    changeCount += boldReductionCount;
    modified = true;
    console.log(`  🎯 ${file}: 過剰な太字を削減（${boldReductionCount}行）`);
  }

  // ========================================
  // 保存
  // ========================================
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalChanges += changeCount;
    console.log(`  ✅ ${file}: ${changeCount}箇所修正完了\n`);
  } else {
    console.log(`  ⏭️  ${file}: 修正不要\n`);
  }
});

console.log('=' .repeat(80));
console.log(`\n🎉 完了！合計${totalChanges}箇所のAI臭を削除しました`);
console.log('✨ これで人間が書いたような自然なブログになります\n');
