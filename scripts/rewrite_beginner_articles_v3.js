#!/usr/bin/env node
/**
 * 初心者向け記事7本を3段階で完全生成するスクリプト v3.0
 *
 * 【根本的改善点】
 * 1. 各Partに明確な文字数目標を設定（1500-2000文字/Part）
 * 2. 終了マーカーを厳密に指定
 * 3. "詳細に書け"という明示的な指示
 * 4. max_tokensを各Part 6000に設定（余裕を持たせる）
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

/**
 * Part 1: Frontmatter + 導入 + TaskMate説明
 * 目標: 1500-2000文字
 */
async function generatePart1(title, description, date, slug) {
  const prompt = `あなたはTaskMate AIブログのプロライターです。以下のテーマで記事の【Part 1】を書いてください。

タイトル: ${title}
説明: ${description}
日付: ${date}
スラッグ: ${slug}

【Part 1に含める内容】（必ず全て含めること）
1. Frontmatter（YAML形式）
2. **太字の問いかけ**で開始（例: **「エラーが出て諦めていませんか？」**）
3. 初心者の悩みに共感する導入（3-4段落、具体的なエピソード含む）
4. Unsplash画像 1枚
5. ## 問題の深掘り（見出し + 3-4段落）
6. 具体的な失敗例・困っている状況の描写（2-3段落）
7. ## TaskMateとは？（見出し + 4-5段落）
   - LINEで日本語で依頼するだけでGASコード生成
   - 仕組みの説明（3ステップ）
   - なぜ初心者に最適か

【重要な制約】
- 絵文字は一切使用しない（SVGアイコンのみ使用可）
- 偽統計データ禁止
- 目標文字数: 1500-2000文字（必ず達成すること）
- Part 1は「## TaskMateとは？」セクションが完全に終わった直後で終了
- "### 具体例："や"TaskMateにこう送ります"は書かない

【終了マーカー】
Part 1の最後は必ず次の文章で終わること：
「それでは、具体的にどのように使うのか、実例を見てみましょう。」

【出力形式】
\`\`\`markdown
---
title: '${title}'
date: "${date}"
description: "${description}"
slug: "${slug}"
keywords: ["初心者", "マインドセット", "TaskMate", "Google Apps Script", "LINE", "自動化"]
---

[本文...]

それでは、具体的にどのように使うのか、実例を見てみましょう。
\`\`\`

**必ず1500-2000文字を書いてください。短く終わらせないこと！**`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 6000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

/**
 * Part 2: 具体例 + GASコード + 説明
 * 目標: 1800-2200文字
 */
async function generatePart2(title, description, part1Content) {
  const prompt = `あなたはTaskMate AIブログのプロライターです。以下は記事の【Part 1】です：

${part1Content}

---

この記事の【Part 2】を書いてください。Part 1の続きです。

【Part 2に含める内容】（必ず全て含めること）
1. ### 具体例：[タイトル]（見出し）
2. **Before（手作業の場合）:** の詳細説明
   - 具体的な作業内容（5-6項目）
   - 所要時間の明記
   - 困っている点の強調
3. **After（TaskMateで自動化）:** の説明
4. TaskMateにこう送ります：（引用ブロック内に具体的な依頼文）
5. 返ってくるGASコードの例（20-30行、コメント付き）
6. **コードの説明:** セクション（箇条書きで3-5項目）
7. **実行結果:** セクション
   - Before/Afterの比較
   - 時間削減効果の数値
   - その他のメリット（2-3項目）

【重要な制約】
- 絵文字は一切使用しない（SVGアイコンのみ可）
- GASコードは必ず20-30行書くこと（短すぎない！）
- コードには日本語コメントを必ず付ける
- 目標文字数: 1800-2200文字（必ず達成すること）
- Part 2は「**実行結果:**」セクションが完全に終わった直後で終了

【終了マーカー】
Part 2の最後は必ず次の文章で終わること：
「このように、TaskMateを使えば、プログラミング知識がなくても実用的な自動化を実現できます。」

【出力形式】
Part 1からの続きとして、以下の形式で出力：

\`\`\`markdown
### 具体例：[タイトル]

**Before（手作業の場合）:**
[詳細...]

**After（TaskMateで自動化）:**

TaskMateにこう送ります：

\`\`\`
[具体的な依頼文]
\`\`\`

すると、このようなGASコードが返ってきます：

\`\`\`javascript
function automate() {
  // [20-30行のコード]
}
\`\`\`

**コードの説明:**

[箇条書き...]

**実行結果:**

[詳細...]

このように、TaskMateを使えば、プログラミング知識がなくても実用的な自動化を実現できます。
\`\`\`

**必ず1800-2200文字を書いてください。GASコードは20-30行必須！**`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 6000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

/**
 * Part 3: まとめ + CTA
 * 目標: 1000-1500文字
 */
async function generatePart3(title, description, part1And2Content) {
  const prompt = `あなたはTaskMate AIブログのプロライターです。以下は記事のPart 1とPart 2です：

${part1And2Content}

---

この記事の【Part 3（最終部分）】を書いてください。

【Part 3に含める内容】（必ず全て含めること）
1. ## まとめ（見出し）
2. まとめ本文（4-5段落）
   - この記事で伝えたかったこと
   - 初心者へのエンコーラジメント
   - 最初の一歩を踏み出す勇気づけ
   - バイブコーディングマインドの強調
3. TaskMate公式LINEへのCTA
   - **今すぐTaskMateを始めませんか？** という見出し
   - LINEリンク: https://line.me/R/ti/p/@356uysad
   - 友だち追加後の使い方ガイダンス

【重要な制約】
- 絵文字は一切使用しない（SVGアイコンのみ可）
- 目標文字数: 1000-1500文字（必ず達成すること）
- Part 3で記事は完全に終了
- 最後は必ずTaskMate LINE CTAで締める

【出力形式】
Part 1とPart 2の続きとして、以下の形式で出力：

\`\`\`markdown
## まとめ

[4-5段落のまとめ...]

**今すぐTaskMateを始めませんか？**

TaskMate公式LINEアカウント:
https://line.me/R/ti/p/@356uysad

友だち追加後、「こういう作業を自動化したい」と送るだけで、すぐに使えるGASコードが返ってきます。

[最後の一押し...]
\`\`\`

**必ず1000-1500文字を書いてください。まとめは4-5段落必須！**`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 6000,
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
    // マークダウンブロックなしでそのまま返す
    return text.trim();
  }
}

function removeEmojis(text) {
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
    // Part 1: 導入〜TaskMate説明
    console.log(`  [1/3] Part 1（導入〜TaskMate説明）生成中...`);
    const part1Raw = await generatePart1(title, description, date, slug);
    const part1 = extractMarkdown(part1Raw);
    console.log(`  ✓ Part 1完了 (${(part1.length / 1000).toFixed(1)}KB, ${part1.split('\n').length}行)`);

    // 5秒待機
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Part 2: 具体例 + GASコード
    console.log(`  [2/3] Part 2（具体例+GASコード）生成中...`);
    const part2Raw = await generatePart2(title, description, part1);
    let part2 = extractMarkdown(part2Raw);

    // Part 2がfrontmatterから始まっている場合は本文のみ抽出
    if (part2.startsWith('---')) {
      const bodyMatch = part2.match(/---\n[\s\S]+?\n---\n([\s\S]+)/);
      if (bodyMatch) {
        part2 = bodyMatch[1].trim();
      }
    }

    console.log(`  ✓ Part 2完了 (${(part2.length / 1000).toFixed(1)}KB, ${part2.split('\n').length}行)`);

    // 5秒待機
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Part 3: まとめ + CTA
    console.log(`  [3/3] Part 3（まとめ+CTA）生成中...`);
    const part1And2 = part1 + '\n\n' + part2;
    const part3Raw = await generatePart3(title, description, part1And2);
    let part3 = extractMarkdown(part3Raw);

    // Part 3がfrontmatterから始まっている場合は本文のみ抽出
    if (part3.startsWith('---')) {
      const bodyMatch = part3.match(/---\n[\s\S]+?\n---\n([\s\S]+)/);
      if (bodyMatch) {
        part3 = bodyMatch[1].trim();
      }
    }

    console.log(`  ✓ Part 3完了 (${(part3.length / 1000).toFixed(1)}KB, ${part3.split('\n').length}行)`);

    // 結合
    let fullArticle = part1 + '\n\n' + part2 + '\n\n' + part3;

    // 絵文字を削除
    fullArticle = removeEmojis(fullArticle);

    // ファイルに保存
    fs.writeFileSync(filepath, fullArticle, 'utf-8');

    const totalLines = fullArticle.split('\n').length;
    console.log(`  ✓ 記事完成！`);
    console.log(`  総サイズ: ${(fullArticle.length / 1000).toFixed(1)}KB`);
    console.log(`  総行数: ${totalLines}行`);

    // 完全性チェック
    const hasCTA = fullArticle.includes('https://line.me/R/ti/p/@356uysad');
    const hasCode = fullArticle.includes('```javascript') || fullArticle.includes('```js');
    const hasSummary = fullArticle.includes('## まとめ') || fullArticle.includes('##まとめ');

    if (!hasCTA || !hasCode || !hasSummary) {
      console.log(`  ⚠ 警告: 記事が不完全の可能性`);
      console.log(`    - CTA: ${hasCTA ? '✓' : '✗'}`);
      console.log(`    - コード: ${hasCode ? '✓' : '✗'}`);
      console.log(`    - まとめ: ${hasSummary ? '✓' : '✗'}`);
    }

    return {
      filename,
      success: true,
      size: fullArticle.length,
      lines: totalLines,
      complete: hasCTA && hasCode && hasSummary
    };

  } catch (error) {
    console.error(`  ✗ エラー: ${error.message}`);
    return { filename, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   TaskMate Blog - 3段階記事生成システム v3.0       ║');
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
  const complete = results.filter(r => r.success && r.complete).length;
  const incomplete = results.filter(r => r.success && !r.complete).length;

  console.log(`✓ 成功: ${successful}本`);
  console.log(`✗ 失敗: ${failed}本`);
  console.log(`✓ 完全: ${complete}本`);
  console.log(`⚠ 不完全: ${incomplete}本\n`);

  if (successful > 0) {
    console.log('【成功した記事】');
    results.filter(r => r.success).forEach(r => {
      const status = r.complete ? '✓' : '⚠';
      console.log(`  ${status} ${r.filename}`);
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
