#!/usr/bin/env node
/**
 * 初心者向け記事7本を2段階で完全生成するスクリプト
 * 前半と後半を別々に生成し、結合することで完全な記事を作成
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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

async function generateArticlePart1(title, description, date, slug) {
  const prompt = `タイトル: ${title}
説明: ${description}

上記のテーマで、TaskMate AIブログ記事の【前半部分】を書いてください。

## 前半に含める内容:
1. **太字の問いかけ**で開始
2. 初心者の悩みに共感（2-3段落）
3. 問題の深掘り（具体例）
4. TaskMateとは？（LINE→AIがGASコード生成→自動化）
5. 具体的な自動化例の紹介（Before/After）

## スタイル:
- SVGアイコン使用: <img src="/icons/lightbulb.svg" alt="説明" class="inline-icon" width="20" height="20" />
- 画像: Unsplash URL 1枚
- 絵文字は使用しない
- 偽統計データ禁止

## 出力形式:
\`\`\`markdown
---
title: '${title}'
date: "${date}"
description: "${description}"
slug: "${slug}"
keywords: ["初心者", "マインドセット", "TaskMate", "Google Apps Script", "LINE", "自動化"]
---

**「問いかけ」**

[導入...]

![](https://images.unsplash.com/...)

## 問題の深掘り

[内容...]

## TaskMateとは？

[説明...]

### 具体例：[タイトル]

**Before（手作業の場合）:**
- [状況]
- [問題点]
- **所要時間: X分/日**

**After（TaskMateで自動化）:**

TaskMateにこう送ります：
\`\`\`

**重要**: "TaskMateにこう送ります："まで書いて終了してください。後半で続きを書きます。`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

async function generateArticlePart2(title, description, part1Content) {
  const prompt = `以下は記事の前半部分です：

${part1Content}

---

この記事の【後半部分】を書いてください。前半の最後は"TaskMateにこう送ります："で終わっています。

## 後半に含める内容:
1. ユーザーがTaskMateに送る具体的なメッセージ例（コードブロック）
2. 返ってくるGASコード例（10-20行、コメント付き）
3. コードの説明
4. 実行結果（自動化の効果）
5. まとめ（3-4段落）
6. CTA: TaskMate公式LINE

## スタイル:
- 絵文字は使用しない
- 偽統計データ禁止
- SVGアイコン使用可

## 出力形式（前半からの続き）:
\`\`\`markdown
「具体的な依頼内容を日本語で書く」
\`\`\`

すると、このようなGASコードが返ってきます：

\`\`\`javascript
function automate() {
  // コメント
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート名');
  const data = sheet.getRange('A2:B').getValues();

  // 処理内容
  data.forEach(function(row) {
    // ロジック
  });

  Logger.log('完了');
}
\`\`\`

**コードの説明:**

このコードは以下を行います：
1. [説明1]
2. [説明2]
3. [説明3]

**実行結果:**

<img src="/icons/check.svg" alt="チェック" class="inline-icon" width="20" height="20" /> **効果:**
- Before: 手作業で X分/日
- After: 自動化で Y秒、月間 Z時間の削減

## まとめ

[まとめ3-4段落...]

**今すぐTaskMateを始めませんか？**

TaskMate公式LINEアカウント:
https://line.me/R/ti/p/@356uysad

友だち追加後、「こういう作業を自動化したい」と送るだけで、すぐに使えるGASコードが返ってきます。
\`\`\`

**重要**: 必ず最後のCTAまで完全に書いてください！`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

function extractMarkdown(text) {
  const match = text.match(/```markdown\n([\s\S]+?)\n```/);
  if (match) {
    return match[1].trim();
  } else if (text.includes('---\n') && text.includes('title:')) {
    return text.trim();
  } else {
    return text.trim();
  }
}

function removeEmojis(text) {
  // 絵文字を削除（ただしSVGアイコンは保持）
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}

async function rewriteArticle(filename) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`記事生成: ${filename}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

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

  console.log(`  タイトル: ${title}`);
  console.log(`  日付: ${date}\n`);

  try {
    // ステップ1: 前半生成
    console.log(`  [1/2] 前半部分を生成中...`);
    const part1Raw = await generateArticlePart1(title, description, date, slug);
    const part1 = extractMarkdown(part1Raw);
    console.log(`  ✓ 前半完了 (${(part1.length / 1000).toFixed(1)}KB)`);

    // 5秒待機
    await new Promise(resolve => setTimeout(resolve, 5000));

    // ステップ2: 後半生成
    console.log(`  [2/2] 後半部分を生成中...`);
    const part2Raw = await generateArticlePart2(title, description, part1);
    let part2 = extractMarkdown(part2Raw);

    // 後半がfrontmatterから始まっている場合は、本文のみ抽出
    if (part2.startsWith('---')) {
      const bodyMatch = part2.match(/---\n[\s\S]+?\n---\n([\s\S]+)/);
      if (bodyMatch) {
        part2 = bodyMatch[1].trim();
      }
    }

    console.log(`  ✓ 後半完了 (${(part2.length / 1000).toFixed(1)}KB)`);

    // ステップ3: 結合
    let fullArticle = part1 + '\n\n' + part2;

    // 絵文字を削除
    fullArticle = removeEmojis(fullArticle);

    // ファイルに保存
    fs.writeFileSync(filepath, fullArticle, 'utf-8');

    console.log(`  ✓ 記事完成！`);
    console.log(`  総サイズ: ${(fullArticle.length / 1000).toFixed(1)}KB`);
    console.log(`  行数: ${fullArticle.split('\n').length}行`);

    return { filename, success: true, size: fullArticle.length, lines: fullArticle.split('\n').length };

  } catch (error) {
    console.error(`  ✗ エラー: ${error.message}`);
    return { filename, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   TaskMate Blog - 2段階記事生成システム v2.0       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`\n対象記事数: ${ARTICLES_TO_REWRITE.length}本\n`);

  const results = [];

  for (const filename of ARTICLES_TO_REWRITE) {
    const result = await rewriteArticle(filename);
    results.push(result);

    // 次の記事まで10秒待機
    if (filename !== ARTICLES_TO_REWRITE[ARTICLES_TO_REWRITE.length - 1]) {
      console.log('\n  ⏸  10秒待機...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // 結果サマリー
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                   生成結果サマリー                    ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✓ 成功: ${successful}本`);
  console.log(`✗ 失敗: ${failed}本\n`);

  if (successful > 0) {
    console.log('【成功した記事】');
    results.filter(r => r.success).forEach(r => {
      console.log(`  ✓ ${r.filename}`);
      console.log(`    サイズ: ${(r.size / 1000).toFixed(1)}KB, 行数: ${r.lines}行`);
    });
  }

  if (failed > 0) {
    console.log('\n【失敗した記事】');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ✗ ${r.filename}: ${r.error}`);
    });
  }

  console.log('\n✓ 全記事の生成が完了しました！\n');
}

main().catch(err => {
  console.error('\n✗ 致命的エラー:', err.message);
  process.exit(1);
});
