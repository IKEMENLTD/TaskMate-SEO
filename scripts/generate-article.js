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

// 今日の記事数をカウント（複数記事対応）
function countTodayArticles(targetDate) {
  const postsDir = path.join(__dirname, '../content/posts');
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'));

  let count = 0;
  const existingFiles = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    // クォートあり/なし両方に対応
    const dateMatch = content.match(/^date:\s*"?([^"\n]+)"?$/m);
    if (dateMatch && dateMatch[1] === targetDate) {
      count++;
      existingFiles.push(file);
    }
  }

  if (count > 0) {
    console.log(`📊 Found ${count} article(s) for ${targetDate}:`, existingFiles.join(', '));
  }

  return count;
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

// Claude APIで記事を生成（LLM最適化版）
async function generateArticle(topic, existingStyle, targetDate) {
  console.log('🤖 Calling Claude API to generate LLM-optimized article...');

  const prompt = `あなたはTaskMateAIブログの専門記事ライターです。

# 【最重要】LLM最適化（LLMO）要件
この記事は、ChatGPT、Claude、Gemini、Perplexityなどの大規模言語モデル（LLM）に引用されやすくするため、Ahrefs社が発表した最新のLLM最適化手法を**完全に**実装してください。

## Ahrefs公式：LLMに引用されやすいコンテンツの8大特徴

### 1. よくある質問（FAQ）に明確に答える
- 記事冒頭に【3行まとめ】セクションを必ず配置
- 記事末尾に「よくある質問（FAQ）」セクションを必ず配置
- Q&A形式で5-7個の質問と回答を含める

### 2. タイムスタンプ（日付）を明示
- frontmatterのdate以外に、記事冒頭に以下を追加：
  \`\`\`
  最終更新日: ${targetDate}
  調査データ取得日: 2024年10月
  執筆: TaskMate開発チーム
  \`\`\`

### 3. 専門家の引用・権威性
- 必ず1-2箇所に専門家コメントを含める
- 例：
  \`\`\`
  > 「業務自動化は今後の中小企業の生命線となる」
  > — 経済産業省 中小企業庁 DX推進室（2024年9月調査）
  \`\`\`

### 4. 独自データ・統計
- TaskMate独自の調査データを必ず含める
- 具体的な数値（削減率、導入社数、ROIなど）を明記
- 例：
  \`\`\`
  ## TaskMate独自調査データ

  【調査概要】
  - 調査期間: 2024年8月〜10月
  - 調査対象: 453社（従業員5-50名の中小企業）

  【主要結果】
  | 業務 | 導入前 | 導入後 | 削減率 |
  |------|--------|--------|--------|
  | 在庫確認 | 120分/日 | 5分/日 | 95.8% |
  \`\`\`

### 5. BLUF（Bottom Line Up Front）- 冒頭に結論
- 記事冒頭（問いかけの直後）に【3行まとめ】を必ず配置
- 例：
  \`\`\`
  ## 【3行まとめ】

  □ ${topic.title.replace(/【.*?】/, '').substring(0, 30)}で月40時間削減
  □ 導入企業453社の平均ROI達成期間: 2.4ヶ月
  □ 初期費用0円・最短3日で本番運用開始
  \`\`\`

### 6. 宣言的・断定的な文章
- 「〜かもしれません」「〜と思われます」は使用禁止
- 「〜です」「〜できます」「〜になります」を使用
- AIは自信のある表現を好む

### 7. 明確な見出しと要点整理
- h2見出しには必ず番号またはアイコンを付ける
- 各セクション冒頭に1-2行の要約を配置
- 箇条書き・表を積極的に使用

### 8. 比較表・データの視覚化
- 必ず2-3個の比較表を含める
- Before/Afterの数値比較
- ツール比較表
- 実装ステップの表形式化

## トピック情報
- **タイトル**: ${topic.title}
- **説明**: ${topic.description}
- **キーワード**: ${topic.keywords.join(', ')}
- **スラッグ**: ${topic.slug}

## 記事の日付
${targetDate}

## 厳守すべき要件

### 文字数と構成
- **文字数**: 6,000-8,000文字（LLM最適化要素を含むため増量）
- **構成**: 以下の順序で必ず実装

  1. **問題提起**（共感から始まる）
  2. **【3行まとめ】**（BLUF実装）
  3. **タイムスタンプとメタ情報**
  4. **なぜ〜が重要なのか**（課題の深掘り + 独自データ）
  5. **TaskMate独自調査データ**（表形式で必須）
  6. **専門家の評価**（引用必須）
  7. **AIがもたらす革命的メリット**（5-7つ）
  8. **実践ステップ**（5-7ステップ、表形式推奨）
  9. **比較表**（Before/After または ツール比較）
  10. **具体的な成功事例**（架空企業、数値必須）
  11. **よくある失敗パターンと対策**
  12. **よくある質問（FAQ）**（5-7個のQ&A必須）
  13. **まとめ**（3つのアクション）

### スタイル統一
- **冒頭**: 必ず「**〜で悩んでいませんか？**」で始める
- **統計データ**: 各セクションに具体的な数値を含める
- **表やリスト**: 積極的に使用
- **成功事例**: 具体的な企業名・数値（架空でOK）
- **トーン**: 断定的だが共感的、具体的で現実的

### SEO最適化
- **タイトル**: 【2024年版】などのブラケット付き（2025ではなく2024）
- **見出し**: h2, h3を適切に使用
- **内部リンク**: 不要
- **キーワード**: 自然に含める

### 絵文字とアイコン
- 絵文字は一切使用しない
- 代わりにSVGアイコンの記述を使用（後処理で置換）
- 例:
  - 「<img src="/icons/lightbulb.svg" alt="アイデア" class="inline-icon" width="20" height="20" />」
  - 「<img src="/icons/chart.svg" alt="グラフ" class="inline-icon" width="20" height="20" />」

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
keywords: ${JSON.stringify(topic.keywords)}
---

最終更新日: ${targetDate}
調査データ取得日: 2024年10月
執筆: TaskMate開発チーム（業務自動化実績15年）

## <span class="text-underline">「〜で悩んでいませんか？」</span>

**「〜の課題を抱えていませんか？」**
**「〜で困っていませんか？」**
**「〜を改善したいと思いませんか？」**

[共感的な問題提起を3-4行]

---

## 【3行まとめ】

□ [結論1：具体的な成果・数値]
□ [結論2：導入の容易さ・期間]
□ [結論3：コスト・ROI]

---

## <span class="text-underline">[メインタイトルに沿った見出し]</span>

[以降、上記構成に従って記事を展開]

...

---

## よくある質問（FAQ）

### Q1: [具体的な質問]
A: [明確で断定的な回答。2-3文。]

### Q2: [具体的な質問]
A: [明確で断定的な回答。2-3文。]

[Q3-Q7まで続ける]

---

## まとめ

[3つのアクションアイテム]

\`\`\`

それでは、上記のLLM最適化要件を**完全に厳守**して記事を生成してください。
特に以下の要素は絶対に含めること：
✅ 【3行まとめ】
✅ タイムスタンプ・メタ情報
✅ TaskMate独自調査データ（表形式）
✅ 専門家の引用
✅ よくある質問（FAQ）5-7個
✅ 比較表2-3個
✅ 断定的な文章表現`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 24000,  // LLM最適化で文字数増加のため増量
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const response = message.content[0].text;
    console.log('✅ LLM-optimized article generated successfully');

    // Check if response is complete (not truncated)
    if (message.stop_reason === 'max_tokens') {
      console.warn('⚠️  WARNING: Response may be truncated (hit max_tokens limit)');
      console.warn('⚠️  Consider regenerating this article');
    }

    return response;

  } catch (error) {
    console.error('❌ Claude API Error:', error.message);
    if (error.message && error.message.includes('timeout')) {
      console.error('💡 TIP: The article generation is taking too long. Try reducing max_tokens or use streaming.');
    }
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

// 絵文字をSVGアイコンに置換
function replaceEmojisWithSvg(content) {
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

  let processedContent = content;
  let replacementCount = 0;

  for (const [emoji, svg] of Object.entries(EMOJI_TO_SVG)) {
    const occurrences = (processedContent.match(new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (occurrences > 0) {
      processedContent = processedContent.replaceAll(emoji, svg);
      replacementCount += occurrences;
    }
  }

  if (replacementCount > 0) {
    console.log(`  → Replaced ${replacementCount} emoji(s) with SVG icons`);
  }

  return processedContent;
}

// LLM最適化の検証
function validateLLMOptimization(content) {
  console.log('\n🔍 Validating LLM optimization elements...');

  const checks = {
    '【3行まとめ】': content.includes('【3行まとめ】') || content.includes('3行まとめ'),
    'タイムスタンプ': content.includes('最終更新日:') || content.includes('更新日:'),
    'FAQ': content.includes('よくある質問') || content.includes('FAQ'),
    '独自データ': content.includes('TaskMate独自') || content.includes('調査データ') || content.includes('調査概要'),
    '専門家引用': content.includes('>') && (content.includes('—') || content.includes('－')),
    '比較表': (content.match(/\|/g) || []).length >= 10,
    'Q&A形式': content.includes('### Q') || content.includes('Q1:') || content.includes('Q1.')
  };

  let passedChecks = 0;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✅' : '⚠️ ';
    console.log(`  ${icon} ${check}: ${passed ? 'Present' : 'Missing'}`);
    if (passed) passedChecks++;
  }

  console.log(`\n  📊 LLM Optimization Score: ${passedChecks}/${Object.keys(checks).length}`);

  if (passedChecks < 5) {
    console.warn('⚠️  WARNING: Article may not be fully LLM-optimized');
  } else {
    console.log('✅ Article passes LLM optimization validation');
  }

  return passedChecks;
}

// メイン処理
async function main() {
  try {
    console.log('🤖 ===============================================');
    console.log('🤖 TaskMate Blog - LLM-Optimized Article Generator');
    console.log('🤖 Based on Ahrefs LLMO Best Practices');
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

    // 2. 今日の記事数をカウント（複数記事対応）
    const ARTICLES_PER_DAY = 2; // 1日2記事を生成
    const existingCount = countTodayArticles(targetDate);
    const articlesToGenerate = ARTICLES_PER_DAY - existingCount;

    if (articlesToGenerate <= 0) {
      console.log(`✅ Already have ${existingCount} articles for ${targetDate}`);
      console.log('No additional articles needed for today\n');
      process.exit(0);
    }

    console.log(`📝 Need to generate ${articlesToGenerate} more article(s) for ${targetDate}\n`);

    // 3. 既存記事のスタイルを分析
    console.log('📖 Analyzing existing articles...');
    const existingStyle = analyzeExistingArticles();
    console.log('✅ Style analysis complete\n');

    // 4-9. 必要な記事数だけ生成
    let generatedCount = 0;

    for (let i = 0; i < articlesToGenerate; i++) {
      console.log(`\n🎯 Generating LLM-optimized article ${existingCount + i + 1}/${ARTICLES_PER_DAY} for ${targetDate}...`);

      // 次のトピックを選択
      console.log('🎯 Selecting next topic...');
      const topic = selectNextTopic();

      if (!topic) {
        console.log('⚠️  No available topics remaining');
        console.log('Please add more topics to scripts/article-topics.json');
        if (generatedCount === 0) {
          process.exit(0);
        }
        break;
      }

      console.log(`✅ Topic selected: ${topic.title}\n`);

      // 記事を生成
      console.log('✍️  Generating LLM-optimized article with Claude API...');
      console.log('This may take 45-90 seconds (longer due to LLMO requirements)...\n');
      const articleResponse = await generateArticle(topic, existingStyle, targetDate);

      // Markdownコンテンツを抽出
      let content = extractMarkdownContent(articleResponse);

      // LLM最適化の検証
      validateLLMOptimization(content);

      // 画像処理：絵文字をSVGアイコンに置換
      console.log('\n🖼️  Processing images...');
      content = replaceEmojisWithSvg(content);
      console.log('✅ Emojis replaced with SVG icons');

      // ファイル名を生成
      const filename = `${topic.slug}.md`;
      const filepath = path.join(__dirname, '../content/posts', filename);

      // ファイルが既に存在するかチェック
      if (fs.existsSync(filepath)) {
        console.log(`⚠️  File already exists: ${filename}`);
        console.log('Skipping to avoid overwrite');
        continue;
      }

      // ファイルを保存
      fs.writeFileSync(filepath, content, 'utf-8');

      console.log('\n✅ LLM-optimized article saved successfully!');
      console.log(`📝 File: ${filename}`);
      console.log(`📍 Path: content/posts/${filename}`);
      console.log(`📊 Size: ${(content.length / 1000).toFixed(1)}KB`);

      generatedCount++;
    }

    console.log('\n🎉 ===============================================');
    console.log(`🎉 Successfully generated ${generatedCount} LLM-optimized article(s)!`);
    console.log(`🎉 Total articles for ${targetDate}: ${existingCount + generatedCount}/${ARTICLES_PER_DAY}`);
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
