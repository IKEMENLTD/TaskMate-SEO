const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function optimizeArticle(filePath, targetChars = 12000) {
  const fullPath = path.join(__dirname, '..', filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');

  const currentChars = content.length;
  console.log(`\n📝 現在の文字数: ${currentChars}文字`);
  console.log(`🎯 目標文字数: ${targetChars}文字`);
  console.log(`📊 削減目標: ${currentChars - targetChars}文字 (${Math.round((1 - targetChars/currentChars) * 100)}%削減)\n`);

  const prompt = `あなたは優秀な編集者です。以下のブログ記事を、内容の質と価値を保ちながら、**約${targetChars}文字**に最適化してください。

# 記事の現状
- 現在の文字数: ${currentChars}文字
- 目標文字数: 約${targetChars}文字
- 削減目標: 約${currentChars - targetChars}文字

# 最適化の指針

## 必ず保持すべき要素
1. **frontmatter（YAML部分）** - そのまま保持
2. **記事の核心的なメッセージ**
3. **具体的な数値データ** - 説得力の源
4. **TaskMateへの導線** - ビジネス上重要

## 削減すべき要素
1. **成功事例を3つ→2つに** - 最も効果的な2つのみ残す
2. **失敗パターンを5つ→3つに** - 最も重要な3つに絞る
3. **TaskMateフレームワークを5つ→3つに** - 核心的な3つに絞る
4. **各セクションの冗長な説明を簡潔化**
5. **重複する内容の統合**

## 文体・トーンの維持
- 共感的で具体的なトーン
- 読者への問いかけスタイル
- 太字・引用・リストの活用
- カラフルスタイリング（<span class="text-teal">など）の保持

## 構成
既存の記事構成を基本的に維持しつつ、各セクションを簡潔化してください。

---

# 元の記事

${content}

---

# 出力形式

完全なMarkdownファイルとして出力してください。frontmatterから本文まで、そのまま保存できる形式で。
余計な説明は一切不要です。`;

  console.log('🤖 Claude APIで最適化中...\n');

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

    const optimized = message.content[0].text;
    console.log('✅ 最適化完了\n');

    // ファイルに保存
    fs.writeFileSync(fullPath, optimized, 'utf-8');

    const newChars = optimized.length;
    console.log(`📊 最適化結果:`);
    console.log(`  - 削減前: ${currentChars}文字`);
    console.log(`  - 削減後: ${newChars}文字`);
    console.log(`  - 削減量: ${currentChars - newChars}文字 (${Math.round((1 - newChars/currentChars) * 100)}%削減)`);
    console.log(`  - 目標達成: ${newChars <= targetChars * 1.1 ? '✅' : '⚠️  (もう少し削減が必要)'}\n`);

    return optimized;
  } catch (error) {
    console.error('❌ エラー:', error.message);
    throw error;
  }
}

// コマンドライン引数から対象ファイルを取得
const targetFile = process.argv[2] || 'content/posts/inventory.md';
const targetChars = parseInt(process.argv[3]) || 12000;

console.log('🔧 ===============================================');
console.log('🔧 記事最適化スクリプト');
console.log('🔧 ===============================================');
console.log(`📁 対象ファイル: ${targetFile}`);

optimizeArticle(targetFile, targetChars)
  .then(() => {
    console.log('🎉 処理完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 処理失敗:', error);
    process.exit(1);
  });
