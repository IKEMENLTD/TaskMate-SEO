const fs = require('fs');
const path = require('path');
const glob = require('glob');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const files = glob.sync('*.md', { cwd: postsDir });

console.log(`🎨 サイト全体の記事（${files.length}件）に視覚的装飾を追加します...\n`);

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // パターン1: ## 見出しの前に --- を追加（既にある場合はスキップ）
  const lines = content.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    // ## 見出しの場合
    if (line.startsWith('## ') && !line.includes('TaskMateにこう送ります')) {
      // 前の行が --- でなく、かつ空行でもない場合
      if (prevLine.trim() !== '---' && prevLine.trim() !== '') {
        newLines.push('');
        newLines.push('---');
        newLines.push('');
      }
      newLines.push(line);
      modified = true;
    }
    // ### 見出しに絵文字を追加
    else if (line.startsWith('### ') && !line.match(/^### [📍📝💡📊🎯✅⚡🔧🚀💰⏰🎉]/)) {
      // 見出しの内容に基づいて適切な絵文字を選択
      let emoji = '💡';
      const title = line.substring(4).trim();

      if (title.includes('実例') || title.includes('事例') || title.includes('ケース')) {
        emoji = '📍';
      } else if (title.includes('方法') || title.includes('手順') || title.includes('やり方')) {
        emoji = '📝';
      } else if (title.includes('結果') || title.includes('成果') || title.includes('効果')) {
        emoji = '📊';
      } else if (title.includes('ポイント') || title.includes('コツ') || title.includes('秘訣')) {
        emoji = '🎯';
      } else if (title.includes('成功') || title.includes('達成') || title.includes('完成')) {
        emoji = '✅';
      } else if (title.includes('問題') || title.includes('エラー') || title.includes('失敗')) {
        emoji = '⚡';
      } else if (title.includes('解決') || title.includes('対策') || title.includes('改善')) {
        emoji = '🔧';
      } else if (title.includes('始め') || title.includes('最初') || title.includes('第一')) {
        emoji = '🚀';
      } else if (title.includes('コスト') || title.includes('費用') || title.includes('価格')) {
        emoji = '💰';
      } else if (title.includes('時間') || title.includes('期間') || title.includes('スピード')) {
        emoji = '⏰';
      } else if (title.includes('まとめ') || title.includes('結論')) {
        emoji = '🎉';
      }

      newLines.push(`### ${emoji} ${title}`);
      modified = true;
    }
    else {
      newLines.push(line);
    }
  }

  content = newLines.join('\n');

  // パターン2: 重要なフレーズを太字に変換
  const importantPhrases = [
    'プログラミング経験ゼロでも大丈夫',
    '完璧なコードなんて存在しない',
    'エラーは成長の証',
    'エラーが出るのは普通のこと',
    '自分のペースで進めばいい',
    '比較する必要はない',
    '小さな成功を積み重ねる',
    '才能なんて関係ない',
    '質問することは恥ずかしくない',
    'やり直すことは悪いことじゃない',
    '一歩ずつ進めばいい',
    'あなたは一人じゃない',
    '今日から始められる',
    '失敗から学ぶ',
    '諦めなければ必ず前進できる'
  ];

  importantPhrases.forEach(phrase => {
    // 既に太字になっていない場合のみ変換
    const regex = new RegExp(`(?<!\\*)${phrase}(?!\\*)`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, `**${phrase}**`);
      modified = true;
    }
  });

  // パターン3: 数字や具体的な成果を太字に
  const numberPatterns = [
    /(\d+)時間/g,
    /(\d+)日/g,
    /(\d+)週間/g,
    /(\d+)ヶ月/g,
    /(\d+)%/g,
    /(\d+)円/g,
    /(\d+)人/g,
    /(\d+)回/g,
    /(\d+)行/g
  ];

  numberPatterns.forEach(pattern => {
    content = content.replace(pattern, (match) => {
      // 既に太字や見出しの中にある場合はスキップ
      if (match.includes('**') || match.includes('#')) {
        return match;
      }
      return `**${match}**`;
    });
    modified = true;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${file}: 装飾を追加しました`);
  } else {
    console.log(`  ⏭️  ${file}: 変更なし`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🎉 全ての初心者向け記事に視覚的装飾を追加しました！');
console.log('='.repeat(60));
