const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 正しいLINEリンク形式
const CORRECT_FORMAT = '👉 **[TaskMate 公式LINE：お問い合わせはこちら](https://taskmateai.net/t/pio8hwhejjhy)**';

// 修正が必要なパターンのリスト
const patterns = [
  // パターン1: beginner記事の古い形式
  {
    regex: /\*\*\[👉 TaskMate 公式LINEはこちら\]\(https:\/\/line\.me\/R\/ti\/p\/@356uysad\)\*\*/g,
    name: 'beginner記事の古い形式'
  },
  // パターン2: 絵文字が外にある形式
  {
    regex: /👉 \*\*\[TaskMate 公式LINEはこちら\]\(https:\/\/line\.me\/R\/ti\/p\/@356uysad\)\*\*/g,
    name: '絵文字が外にある形式'
  },
  // パターン3: 旧LINEアカウント形式
  {
    regex: /TaskMate公式LINEアカウント:\s*\nhttps:\/\/line\.me\/R\/ti\/p\/@356uysad/g,
    name: '旧LINEアカウント形式'
  }
];

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const files = glob.sync('*.md', { cwd: postsDir });

let totalFixed = 0;
let filesModified = 0;

console.log('🔍 全記事のLINEリンクを統一します...\n');

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let fixCount = 0;

  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      content = content.replace(pattern.regex, CORRECT_FORMAT);
      fixCount += matches.length;
      modified = true;
      console.log(`  ✅ ${file}: ${pattern.name}を修正 (${matches.length}箇所)`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    totalFixed += fixCount;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 修正完了！`);
console.log(`📊 統計:`);
console.log(`  - 修正したファイル数: ${filesModified}件`);
console.log(`  - 修正箇所の合計: ${totalFixed}箇所`);
console.log('\n✨ すべてのLINEリンクが以下の形式に統一されました:');
console.log(`   ${CORRECT_FORMAT}`);
console.log('='.repeat(60));
