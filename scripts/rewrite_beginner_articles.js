#!/usr/bin/env node
/**
 * 初心者向け記事7本を高品質にリライトするスクリプト
 *
 * 要件:
 * - beginner-perfect-code-myth.md と同レベルの品質
 * - 偽統計データを削除
 * - TaskMateの本質（LINE→GAS生成→スプレッドシート自動化）を正確に反映
 * - 具体的なGASコード例を含める
 * - バイブコーディングマインドセットを全面に
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// リライト対象の記事リスト
const ARTICLES_TO_REWRITE = [
  'beginner-error-mindset-first-truth.md',
  'beginner-no-talent-myth-failure-path.md',
  'beginner-error-ten-times-normal.md',
  'beginner-question-skill-power.md',
  'beginner-success-small-wins.md',
  'beginner-restart-without-guilt.md',
  'beginner-no-comparison-own-pace.md'
];

const POSTS_DIR = path.join(__dirname, '../content/posts');

// 参照記事（完璧な品質基準）
const REFERENCE_ARTICLE = fs.readFileSync(
  path.join(POSTS_DIR, 'beginner-perfect-code-myth.md'),
  'utf-8'
);

async function rewriteArticle(filename) {
  console.log(`\n📝 Rewriting: ${filename}`);

  const filepath = path.join(POSTS_DIR, filename);
  const originalContent = fs.readFileSync(filepath, 'utf-8');

  // frontmatterを抽出
  const frontmatterMatch = originalContent.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    throw new Error(`No frontmatter found in ${filename}`);
  }

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
  const dateMatch = frontmatter.match(/date:\s*["'](.+?)["']/);
  const descriptionMatch = frontmatter.match(/description:\s*["'](.+?)["']/);
  const slugMatch = frontmatter.match(/slug:\s*["'](.+?)["']/);

  if (!titleMatch || !dateMatch || !descriptionMatch || !slugMatch) {
    throw new Error(`Invalid frontmatter in ${filename}`);
  }

  const title = titleMatch[1];
  const date = dateMatch[1];
  const description = descriptionMatch[1];
  const slug = slugMatch[1];

  console.log(`  Title: ${title}`);
  console.log(`  Date: ${date}`);

  const prompt = `あなたはTaskMate AIブログの専門ライターです。以下の記事を、参照記事と**完全に同じ品質レベル**にリライトしてください。

# リライト対象記事のタイトル
${title}

# リライト対象記事の説明
${description}

# 参照記事（完璧な品質基準）
${REFERENCE_ARTICLE}

---

## 厳守すべき要件

### 1. 内容の正確性
- **偽統計データは絶対に使わない**（例: 「78%が挫折」「73%が完璧主義」など）
- TaskMateの本質を正確に説明:
  - TaskMateは「LINE経由でGASコードを生成するサービス」
  - ユーザーは「日本語で依頼 → AIがGASコード生成 → スプレッドシートに貼り付け → 自動化完成」
  - プログラミング学習ツールではなく、**業務自動化ツール**

### 2. バイブコーディングマインドセット
- 「完璧なコードを書く技術」ではなく「やりたいことを言葉にする力」を強調
- 「動けばOK」マインドセットを全面に
- エラーや失敗を恐れない姿勢を伝える

### 3. 具体例の充実
- **具体的なGASコード例を1つ以上含める**（例: 売上集計、在庫管理、請求書作成など）
- TaskMateを使った実践例を示す
- Before/After の具体的な変化を数値で示す（時間短縮など）

### 4. 記事構成
参照記事と同じパターン:
1. 共感する問いかけで始める（太字）
2. 課題の深掘り
3. TaskMateがもたらす解決策
4. 具体的なステップ・事例
5. 実践方法
6. まとめ + CTA（TaskMate公式LINE）

### 5. スタイル統一
- **冒頭**: 必ず太字の問いかけ
- **見出し**: H2, H3を適切に使用
- **SVGアイコン**: 絵文字ではなく、\`<img src="/icons/xxx.svg" alt="xxx" class="inline-icon" width="20" height="20" />\` を使用
- **画像**: Unsplash画像URLを含める（記事テーマに合った画像）
- **LINE公式リンク**: https://line.me/R/ti/p/@356uysad を必ず含める

### 6. 文字数
5,000〜6,500文字

---

## 出力形式

以下の形式で、完全なMarkdownファイルとして出力してください。frontmatterのYAML部分とMarkdown本文のみを出力し、余計な説明は一切含めないでください。

\`\`\`markdown
---
title: '${title}'
date: "${date}"
description: "${description}"
slug: "${slug}"
keywords: ["初心者", "マインドセット", "TaskMate", "Google Apps Script", "LINE", "自動化"]
---

[ここから本文を開始]

**「〜で悩んでいませんか？」**

[本文続き...]
\`\`\`

それでは、上記の要件を厳守してリライトしてください。`;

  console.log(`  ⏳ Calling Claude API...`);

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

    // Markdownコンテンツを抽出
    let content;
    const match = response.match(/```markdown\n([\s\S]+?)\n```/);
    if (match) {
      content = match[1].trim();
    } else if (response.includes('---\n') && response.includes('title:')) {
      content = response.trim();
    } else {
      throw new Error('Could not extract markdown content');
    }

    // 絵文字をSVGに置換
    const EMOJI_TO_SVG = {
      '📝': '<img src="/icons/note.svg" alt="ノート" class="inline-icon" width="20" height="20" />',
      '💡': '<img src="/icons/lightbulb.svg" alt="アイデア" class="inline-icon" width="20" height="20" />',
      '📊': '<img src="/icons/chart.svg" alt="グラフ" class="inline-icon" width="20" height="20" />',
      '📍': '<img src="/icons/pin.svg" alt="ポイント" class="inline-icon" width="20" height="20" />',
      '⏱️': '<img src="/icons/clock.svg" alt="時計" class="inline-icon" width="20" height="20" />',
      '⏱': '<img src="/icons/clock.svg" alt="時計" class="inline-icon" width="20" height="20" />',
      '🚀': '<img src="/icons/rocket.svg" alt="ロケット" class="inline-icon" width="20" height="20" />',
      '✅': '<img src="/icons/check.svg" alt="チェック" class="inline-icon" width="20" height="20" />',
      '❌': '<img src="/icons/x.svg" alt="バツ" class="inline-icon" width="20" height="20" />'
    };

    for (const [emoji, svg] of Object.entries(EMOJI_TO_SVG)) {
      content = content.replaceAll(emoji, svg);
    }

    // ファイルに保存
    fs.writeFileSync(filepath, content, 'utf-8');

    console.log(`  ✅ Successfully rewritten!`);
    console.log(`  📊 Size: ${(content.length / 1000).toFixed(1)}KB`);

    return { filename, success: true, size: content.length };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { filename, success: false, error: error.message };
  }
}

async function main() {
  console.log('🤖 ===============================================');
  console.log('🤖 TaskMate Blog - Beginner Article Rewriter');
  console.log('🤖 ===============================================');
  console.log(`\n📁 Total articles to rewrite: ${ARTICLES_TO_REWRITE.length}\n`);

  const results = [];

  for (const filename of ARTICLES_TO_REWRITE) {
    const result = await rewriteArticle(filename);
    results.push(result);

    // Rate limiting: 少し待機
    console.log('  ⏸️  Waiting 5 seconds before next rewrite...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(60));
  console.log('📊 REWRITE SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed articles:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }

  console.log('\n✅ All rewrites completed!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
