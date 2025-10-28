const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Claude APIクライアントを初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 既存記事を分析してスタイルを学習
function analyzeExistingArticles() {
  const postsDir = path.join(__dirname, '../content/posts');

  if (!fs.existsSync(postsDir)) {
    console.error('❌ Posts directory not found:', postsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .slice(-3); // 最新3記事を参照

  if (files.length === 0) {
    console.error('❌ No existing articles found');
    process.exit(1);
  }

  console.log(`📖 Analyzing ${files.length} recent articles:`, files.join(', '));

  const articles = files.map(file => {
    return fs.readFileSync(path.join(postsDir, file), 'utf-8');
  });

  return articles.join('\n\n---\n\n');
}

// 今日の日付を取得（または環境変数から）
function getTargetDate() {
  if (process.env.INPUT_DATE) {
    return process.env.INPUT_DATE;
  }

  // 日本時間（JST: UTC+9）で日付を取得
  const now = new Date();
  const jstOffset = 9 * 60; // JST is UTC+9
  const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);

  const year = jstTime.getFullYear();
  const month = String(jstTime.getMonth() + 1).padStart(2, '0');
  const day = String(jstTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 使用済みトピックをチェック
function getUsedTopics() {
  const postsDir = path.join(__dirname, '../content/posts');
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'));

  const used = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    // タイトルを抽出
    const match = content.match(/^title:\s*"(.+)"$/m);
    if (match) {
      used.add(match[1]);
    }
    // slugも抽出
    const slugMatch = content.match(/^slug:\s*"(.+)"$/m);
    if (slugMatch) {
      used.add(slugMatch[1]);
    }
  });

  return used;
}

// 既に今日の記事が存在するかチェック
function checkIfTodayArticleExists(targetDate) {
  const postsDir = path.join(__dirname, '../content/posts');
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    // クォートあり/なし両方に対応
    const dateMatch = content.match(/^date:\s*"?([^"\n]+)"?$/m);
    if (dateMatch && dateMatch[1] === targetDate) {
      console.log(`✅ Article for ${targetDate} already exists: ${file}`);
      return true;
    }
  }

  return false;
}

// 次のトピックを選択
function selectNextTopic() {
  const topicsFile = path.join(__dirname, 'article-topics.json');

  if (!fs.existsSync(topicsFile)) {
    console.error('❌ Topics file not found:', topicsFile);
    return null;
  }

  const topics = JSON.parse(fs.readFileSync(topicsFile, 'utf-8'));
  const usedTopics = getUsedTopics();

  // 未使用のトピックを探す
  const availableTopics = topics.filter(t => {
    return !usedTopics.has(t.title) && !usedTopics.has(t.slug);
  });

  if (availableTopics.length === 0) {
    console.log('⚠️  All predefined topics have been used');
    return null;
  }

  // 最初の未使用トピックを返す
  return availableTopics[0];
}

// Claude APIで記事を生成
async function generateArticle(topic, existingStyle, targetDate) {
  console.log('🤖 Calling Claude API to generate article...');

  const prompt = `あなたはTaskMateAIブログの専門記事ライターです。

# 指示
以下のスタイルと**完全に同じ品質・構成・トーン**で、新しいブログ記事を生成してください。

## トピック情報
- **タイトル**: ${topic.title}
- **説明**: ${topic.description}
- **キーワード**: ${topic.keywords.join(', ')}
- **スラッグ**: ${topic.slug}

## 記事の日付
${targetDate}

## 厳守すべき要件

### 文字数と構成
- **文字数**: 5,000-6,500文字（必須）
- **構成**: 既存記事と完全に同じパターン
  1. 問題提起（共感から始まる）
  2. なぜ〜が重要なのか（課題の深掘り）
  3. AIがもたらす革命的メリット（5つ程度）
  4. 実践ステップ（5-7ステップ）
  5. 具体的なフレームワーク・事例
  6. よくある失敗パターンと対策
  7. 成功事例（具体的な数値付き）
  8. まとめ（3つのアクション）

### スタイル統一
- **冒頭**: 必ず太字の問いかけで始める（例：**「〜で悩んでいませんか？」**）
- **統計データ**: 各セクションに具体的な数値を含める
- **表やリスト**: 適切に使用して読みやすく
- **成功事例**: 架空の企業・人物で具体的に（Before/After数値必須）
- **トーン**: 共感的だが具体的、楽観的だが現実的

### SEO最適化
- **タイトル**: 【2025年版】などのブラケット付き
- **見出し**: h2, h3を適切に使用
- **内部リンク**: 不要（既存記事にはないため）
- **キーワード**: 自然に含める

## 既存記事のスタイル参考

${existingStyle}

## 出力形式

必ず以下の形式で、完全なMarkdownファイルとして出力してください。
frontmatterのYAML部分とMarkdown本文のみを出力し、余計な説明は一切含めないでください。

\`\`\`markdown
---
title: "${topic.title}"
date: "${targetDate}"
description: "${topic.description}"
slug: "${topic.slug}"
---

[ここから本文を開始]

**「〜で悩んでいませんか？」**

[本文続き...]
\`\`\`

それでは、上記の要件を厳守して記事を生成してください。`;

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

    const response = message.content[0].text;
    console.log('✅ Article generated successfully');
    return response;

  } catch (error) {
    console.error('❌ Claude API Error:', error.message);
    throw error;
  }
}

// Markdownからコンテンツを抽出
function extractMarkdownContent(response) {
  // ```markdown ... ``` の中身を抽出
  const match = response.match(/```markdown\n([\s\S]+?)\n```/);
  if (match) {
    return match[1].trim();
  }

  // マッチしない場合は、レスポンス全体をチェック
  // frontmatterが含まれていればそのまま使用
  if (response.includes('---\n') && response.includes('title:')) {
    return response.trim();
  }

  console.error('⚠️  Could not extract markdown content from response');
  return response.trim();
}

// メイン処理
async function main() {
  try {
    console.log('🤖 ===============================================');
    console.log('🤖 TaskMate Blog - Auto Article Generator');
    console.log('🤖 ===============================================\n');

    // 0. API Keyチェック
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY is not set');
      console.error('Please set it in GitHub Secrets');
      process.exit(1);
    }

    // 1. 日付を確認
    const targetDate = getTargetDate();
    console.log(`📅 Target date: ${targetDate}\n`);

    // 2. 既に今日の記事が存在するかチェック
    if (checkIfTodayArticleExists(targetDate)) {
      console.log(`ℹ️  Article for ${targetDate} already exists`);
      console.log('Skipping generation to avoid duplicates');
      process.exit(0);
    }

    // 3. 既存記事のスタイルを分析
    console.log('📖 Analyzing existing articles...');
    const existingStyle = analyzeExistingArticles();
    console.log('✅ Style analysis complete\n');

    // 4. 次のトピックを選択
    console.log('🎯 Selecting next topic...');
    const topic = selectNextTopic();

    if (!topic) {
      console.log('⚠️  No available topics remaining');
      console.log('Please add more topics to scripts/article-topics.json');
      process.exit(0);
    }

    console.log(`✅ Topic selected: ${topic.title}\n`);

    // 5. 記事を生成
    console.log('✍️  Generating article with Claude API...');
    console.log('This may take 30-60 seconds...\n');
    const articleResponse = await generateArticle(topic, existingStyle, targetDate);

    // 6. Markdownコンテンツを抽出
    const content = extractMarkdownContent(articleResponse);

    // 7. ファイル名を生成
    const filename = `${topic.slug}.md`;
    const filepath = path.join(__dirname, '../content/posts', filename);

    // 8. ファイルが既に存在するかチェック
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  File already exists: ${filename}`);
      console.log('Skipping to avoid overwrite');
      process.exit(0);
    }

    // 9. ファイルを保存
    fs.writeFileSync(filepath, content, 'utf-8');

    console.log('✅ Article saved successfully!');
    console.log(`📝 File: ${filename}`);
    console.log(`📍 Path: content/posts/${filename}`);
    console.log(`📊 Size: ${(content.length / 1000).toFixed(1)}KB\n`);

    console.log('🎉 ===============================================');
    console.log('🎉 Article generation completed successfully!');
    console.log('🎉 ===============================================');

  } catch (error) {
    console.error('\n❌ ===============================================');
    console.error('❌ Error occurred during article generation');
    console.error('❌ ===============================================');
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { main, generateArticle, selectNextTopic };
