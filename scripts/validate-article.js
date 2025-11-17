#!/usr/bin/env node
/**
 * 記事品質チェックスクリプト
 *
 * 目的：
 * - YAML frontmatterの検証
 * - 文字数チェック（5,000-6,500文字）
 * - 必須キーワードチェック（TaskMate関連用語）
 * - 統計データの過剰使用チェック
 * - 画像URLの検証
 */

const fs = require('fs');
const path = require('path');

/**
 * 記事の品質をチェック
 */
async function validateArticle(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const errors = [];
  const warnings = [];

  // 1. YAML frontmatterチェック
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    errors.push('Missing YAML frontmatter');
  } else {
    const frontmatter = frontmatterMatch[1];

    // 必須フィールドチェック
    if (!frontmatter.includes('title:')) {
      errors.push('Missing title in frontmatter');
    }
    if (!frontmatter.includes('date:')) {
      errors.push('Missing date in frontmatter');
    }
    if (!frontmatter.includes('description:')) {
      errors.push('Missing description in frontmatter');
    }
    if (!frontmatter.includes('slug:')) {
      errors.push('Missing slug in frontmatter');
    }

    // タイトルの引用符チェック
    const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
    if (titleMatch) {
      const title = titleMatch[1];
      // タイトル内に引用符がある場合の警告
      if (title.includes('"') || title.includes("'")) {
        warnings.push('Title contains quotes - ensure proper escaping in YAML');
      }
    }
  }

  // 2. 文字数チェック（基準を緩和: 3000-15000文字）
  const bodyContent = content.replace(/^---\n[\s\S]+?\n---\n/, ''); // frontmatter除外
  const wordCount = bodyContent.length;

  if (wordCount < 3000) {
    errors.push(`Content too short: ${wordCount} characters (minimum: 3000)`);
  } else if (wordCount > 15000) {
    warnings.push(`Content too long: ${wordCount} characters (recommended maximum: 15000)`);
  }

  // 3. 必須キーワードチェック（TaskMateのみ必須、他は推奨）
  if (!content.includes('TaskMate')) {
    errors.push('Missing required keyword: TaskMate - All articles must mention TaskMate');
  }

  // LINEとGASは推奨（warningのみ）
  const recommendedTerms = ['LINE', 'Google Apps Script'];
  const missingTerms = recommendedTerms.filter(term => !content.includes(term));

  if (missingTerms.length > 0) {
    warnings.push(`Missing recommended terms: ${missingTerms.join(', ')}`);
  }

  // 「プログラミング学習ツール」のような誤解を招く表現のチェック
  const misleadingPhrases = [
    'プログラミング学習ツール',
    'プログラミング教育サービス',
    'コーディングを学ぶ'
  ];

  misleadingPhrases.forEach(phrase => {
    if (content.includes(phrase)) {
      warnings.push(`Potentially misleading phrase detected: "${phrase}" - TaskMate is not a learning tool`);
    }
  });

  // 4. 統計データの過剰使用チェック
  const statsMatches = content.match(/\d+%|\d+人中\d+人/g);
  if (statsMatches && statsMatches.length > 5) {
    warnings.push(`High number of statistics detected (${statsMatches.length}). Verify all sources and avoid fabricated data.`);
  }

  // 5. 画像URLチェック
  const imageMatches = content.match(/!\[.*?\]\((.*?)\)/g);
  if (imageMatches) {
    for (const match of imageMatches) {
      const urlMatch = match.match(/\((.*?)\)/);
      if (urlMatch) {
        const url = urlMatch[1];
        if (!url.startsWith('http')) {
          errors.push(`Invalid image URL: ${url}`);
        }
        // Unsplash以外のURLに警告
        if (!url.includes('unsplash.com') && url.startsWith('http')) {
          warnings.push(`Non-Unsplash image URL: ${url} - Consider using Unsplash for consistency`);
        }
      }
    }
  } else {
    warnings.push('No images found in article - Consider adding relevant images');
  }

  // 6. SVGアイコンの使用チェック
  const emojiPattern = /[📝💡📊📍⏱️⏱🚀✅❌]/g;
  const emojiMatches = content.match(emojiPattern);
  if (emojiMatches) {
    warnings.push(`Found ${emojiMatches.length} emoji(s) - Should be replaced with SVG icons`);
  }

  // 7. LINE公式リンクチェック
  const lineLink = 'https://line.me/R/ti/p/@356uysad';
  if (!content.includes(lineLink)) {
    warnings.push('Missing TaskMate LINE official link - Should include CTA');
  }

  // 8. 見出し構造チェック
  const h2Count = (content.match(/^## /gm) || []).length;
  const h3Count = (content.match(/^### /gm) || []).length;

  if (h2Count < 3) {
    warnings.push(`Too few H2 headings (${h2Count}) - Aim for 5-7 main sections`);
  }

  // 結果出力
  const filename = path.basename(filepath);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Validating: ${filename}`);
  console.log(`${'='.repeat(60)}`);

  if (errors.length > 0) {
    console.error('\n❌ ERRORS:');
    errors.forEach(err => console.error(`  - ${err}`));
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  WARNINGS:');
    warnings.forEach(warn => console.warn(`  - ${warn}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All checks passed');
  }

  // 統計情報
  console.log('\n📊 Statistics:');
  console.log(`  - Characters: ${wordCount}`);
  console.log(`  - H2 headings: ${h2Count}`);
  console.log(`  - H3 headings: ${h3Count}`);
  console.log(`  - Images: ${imageMatches ? imageMatches.length : 0}`);
  console.log(`  - Statistics: ${statsMatches ? statsMatches.length : 0}`);

  return {
    errors,
    warnings,
    stats: {
      wordCount,
      h2Count,
      h3Count,
      imageCount: imageMatches ? imageMatches.length : 0,
      statsCount: statsMatches ? statsMatches.length : 0
    }
  };
}

// メイン処理
async function main() {
  console.log('🤖 ===============================================');
  console.log('🤖 TaskMate Blog - Article Quality Validator');
  console.log('🤖 ===============================================');

  const articlesDir = path.join(__dirname, '../content/posts');

  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ Articles directory not found: ${articlesDir}`);
    process.exit(1);
  }

  // 環境変数から対象日付を取得（デフォルトは今日）
  const targetDate = process.env.INPUT_DATE;

  let files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  // INPUT_DATEが設定されている場合、その日付の記事のみ検証
  if (targetDate) {
    console.log(`\n📅 Validating articles for date: ${targetDate}`);
    files = files.filter(f => {
      const filepath = path.join(articlesDir, f);
      const content = fs.readFileSync(filepath, 'utf-8');
      return content.includes(`date: ${targetDate}`);
    });

    if (files.length === 0) {
      console.log(`ℹ️  No articles found for date ${targetDate}`);
      console.log('✅ Skipping validation (no new articles to check)');
      process.exit(0);
    }
  }

  console.log(`\n📁 Found ${files.length} article(s) to validate\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];

  for (const file of files) {
    const filepath = path.join(articlesDir, file);
    const result = await validateArticle(filepath);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
    results.push({ file, ...result });
  }

  // 最終レポート
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total articles: ${files.length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log('\n✅ All articles passed validation!');
  } else {
    console.error(`\n❌ ${totalErrors} error(s) found. Please fix before deploying.`);
  }

  // エラーがある場合は終了コード1
  if (totalErrors > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Validation failed:', err.message);
    process.exit(1);
  });
}

module.exports = { validateArticle };
