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

  const prompt = `タイトル: ${title}
説明: ${description}

上記のテーマで、TaskMate AIブログの完全な記事を書いてください。

# 必須要素（すべて含めること）:

## 記事構成（この順序で）:
1. **太字の問いかけで始める**（例: **「エラーが出て諦めていませんか？」**）
2. 初心者の悩みに共感する導入（2-3段落）
3. TaskMateとは何か（LINE→GASコード生成→自動化）
4. **具体的な自動化例**（例: 在庫管理、売上集計など）
5. TaskMateへの依頼例（「〜を自動化したい」）
6. **完全なGASコード例**（コメント付きで10-20行）
7. コードの説明（何をしているか）
8. 実行結果（Before: 手作業30分 → After: 自動化1分）
9. まとめ（3-4段落）
10. **CTA: TaskMate公式LINE** https://line.me/R/ti/p/@356uysad

## スタイル:
- SVGアイコン: \`<img src="/icons/lightbulb.svg" alt="アイデア" class="inline-icon" width="20" height="20" />\`
- 画像: Unsplash URL 1-2枚
- 見出し: H2(##), H3(###)を適切に使用
- 偽統計データ禁止

## 出力形式（この形式で出力）:
\`\`\`markdown
---
title: '${title}'
date: "${date}"
description: "${description}"
slug: "${slug}"
keywords: ["初心者", "マインドセット", "TaskMate", "Google Apps Script", "LINE", "自動化"]
---

**「...問いかけ...」**

[本文...]

## TaskMateとは？

[説明...]

### 具体例：[タイトル]

[Before/After...]

TaskMateにこう送ります：

\`\`\`
「[具体的な依頼内容]」
\`\`\`

すると、このようなGASコードが返ってきます：

\`\`\`javascript
function automate() {
  // [コメント]
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('data');
  // [実装...]
}
\`\`\`

[コードの説明...]

**実行結果**

- Before: [手作業の状況]
- After: [自動化後の状況]

## まとめ

[まとめ3-4段落...]

**今すぐTaskMateを始めませんか？**

LINE公式アカウントはこちら:
https://line.me/R/ti/p/@356uysad
\`\`\`

**重要**: 記事は最後のCTAまで完全に書くこと。途中で終わらないこと！`;

  console.log(`  ⏳ Calling Claude API...`);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16384,
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

    // 絵文字を削除（SVGアイコンは保持）
    content = content.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

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
