const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const articles = [
  { file: 'content/posts/tools-excel-programming.md', target: 8000 },
  { file: 'content/posts/gas-programming-automation.md', target: 8000 },
  { file: 'content/posts/small-team-tools-efficiency.md', target: 8000 },
  { file: 'content/posts/no-code-programming-automation.md', target: 8000 }
];

async function optimizeArticle(filePath, targetChars) {
  const fullPath = path.join('/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ', filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');

  const currentChars = content.length;
  console.log(`\n📝 ${path.basename(filePath)}`);
  console.log(`   現在: ${currentChars}文字`);
  console.log(`   目標: ${targetChars}文字`);

  if (currentChars >= targetChars * 0.9 && currentChars <= targetChars * 1.1) {
    console.log(`   ✅ すでに適切な範囲内です`);
    return content;
  }

  const prompt = `あなたは優秀な編集者です。以下のブログ記事を、内容の質と価値を保ちながら、**約${targetChars}文字**に最適化してください。

# 記事の現状
- 現在の文字数: ${currentChars}文字
- 目標文字数: 約${targetChars}文字

# 最適化の指針

## 必ず保持すべき要素
1. **frontmatter（YAML部分）** - そのまま保持
2. **記事の核心的なメッセージ**
3. **具体的な数値データ** - 説得力の源
4. **画像タグ** - すべて保持
5. **TaskMateへの導線** - ビジネス上重要

## 削減すべき要素（文字数が多い場合）
1. **成功事例を絞る** - 最も効果的なものだけ残す
2. **失敗パターンを絞る** - 最も重要なものに絞る
3. **各セクションの冗長な説明を簡潔化**
4. **重複する内容の統合**

## 追加すべき要素（文字数が少ない場合）
1. **具体的な事例を追加**
2. **実践的な手順を詳細化**
3. **よくある質問とその回答**
4. **成功のためのチェックリスト**

## 文体・トーンの維持
- 共感的で具体的なトーン
- 読者への問いかけスタイル
- 太字・引用・リストの活用
- カラフルスタイリング（<span class="text-teal">など）の保持
- 絵文字とSVGアイコンは使わない

## 構成
既存の記事構成を基本的に維持しつつ、各セクションを最適化してください。

---

# 元の記事

${content}

---

# 出力形式

完全なMarkdownファイルとして出力してください。frontmatterから本文まで、そのまま保存できる形式で。
余計な説明は一切不要です。`;

  console.log('   🤖 Claude APIで最適化中...');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let optimized = message.content[0].text;

    // マークダウンコードブロックで囲まれている場合は除去
    if (optimized.startsWith('```markdown\n')) {
      optimized = optimized.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (optimized.startsWith('```\n')) {
      optimized = optimized.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // ファイルに保存
    fs.writeFileSync(fullPath, optimized, 'utf-8');

    const newChars = optimized.length;
    console.log(`   ✅ 完了: ${newChars}文字 (${newChars > currentChars ? '+' : ''}${newChars - currentChars})`);

    return optimized;
  } catch (error) {
    console.error(`   ❌ エラー: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🔧 ===============================================');
  console.log('🔧 全記事最適化スクリプト');
  console.log('🔧 ===============================================');

  for (const article of articles) {
    await optimizeArticle(article.file, article.target);
  }

  console.log('\n🎉 すべての記事の最適化が完了しました！');
}

main().catch(error => {
  console.error('💥 処理失敗:', error);
  process.exit(1);
});
