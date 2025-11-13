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
    // タイトルを抽出（クォートあり/なし両対応）
    const match = content.match(/^title:\s*["']?(.+?)["']?$/m);
    if (match) {
      used.add(match[1].trim());
    }
    // slugも抽出（クォートあり/なし両対応）
    const slugMatch = content.match(/^slug:\s*["']?(.+?)["']?$/m);
    if (slugMatch) {
      used.add(slugMatch[1].trim());
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

// Claude APIで新しいトピックを自動生成
async function generateNewTopic(usedTopics) {
  console.log('🎯 Generating new topic using Claude API...');

  const usedTopicsList = Array.from(usedTopics).slice(0, 20).join('\n- ');

  const prompt = `あなたはTaskMateブログの編集長です。中小企業向けの業務自動化に関する新しいブログ記事のトピックを1つ提案してください。

【TaskMateについて】
- プログラミング不要で業務自動化できるツール
- スプレッドシート、在庫管理、勤怠管理、売上管理などを自動化
- 月1万円から利用可能
- 中小企業・個人事業主向け

【既に使用済みのトピック（重複禁止）】
${usedTopicsList}

【要件】
1. タイトルは60文字以内
2. 2025年版の最新情報として作成
3. 具体的な数字（時間削減率、費用など）を含める
4. ターゲット：中小企業の経営者・現場担当者
5. SEOキーワードを3つ含める

【出力形式（JSON）】
{
  "title": "【2025年版】○○を△△する方法｜具体的な数字を含むキャッチーなタイトル",
  "description": "150文字程度の説明文。SEOキーワードを自然に含める。",
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "業務自動化", "TaskMate"],
  "slug": "half-width-alphanumeric-slug"
}

JSONのみを出力してください。`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0].text.trim();
    // JSONブロックから抽出（```json ... ``` の場合に対応）
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response');
    }

    const newTopic = JSON.parse(jsonMatch[0]);
    console.log('✅ New topic generated:', newTopic.title);

    // 生成したトピックをJSONファイルに追加
    const topicsFile = path.join(__dirname, 'article-topics.json');
    const topics = JSON.parse(fs.readFileSync(topicsFile, 'utf-8'));
    topics.push(newTopic);
    fs.writeFileSync(topicsFile, JSON.stringify(topics, null, 2), 'utf-8');
    console.log('💾 New topic saved to article-topics.json');

    return newTopic;
  } catch (error) {
    console.error('❌ Failed to generate new topic:', error.message);
    return null;
  }
}

// フォールバックトピック（API失敗時の緊急用）
function getFallbackTopic(index) {
  const fallbackTopics = [
    {
      title: "【2025年版】業務効率化で残業を50%削減した中小企業の実例｜今すぐできる5つの施策",
      description: "業務効率化により残業時間を大幅削減した中小企業の実例を紹介。プログラミング不要で実践できる5つの施策を具体的に解説します。",
      keywords: ["業務効率化", "残業削減", "中小企業", "自動化", "TaskMate"],
      slug: "efficiency-overtime-reduction-sme"
    },
    {
      title: "【2025年版】スプレッドシート管理の限界を超える｜月10万円で実現する完全自動化",
      description: "スプレッドシートでの管理業務を完全自動化する方法を解説。手作業によるミスとストレスから解放される具体的な手順を紹介します。",
      keywords: ["スプレッドシート", "自動化", "業務管理", "効率化", "TaskMate"],
      slug: "spreadsheet-automation-complete"
    },
    {
      title: "【2025年版】在庫管理の自動化で欠品を90%削減｜リアルタイム管理の実現方法",
      description: "在庫管理を自動化し、欠品や過剰在庫を削減する方法を解説。リアルタイムで在庫状況を把握できるシステムの構築手順を紹介します。",
      keywords: ["在庫管理", "自動化", "欠品削減", "リアルタイム", "TaskMate"],
      slug: "inventory-automation-stockout-reduction"
    },
    {
      title: "【2025年版】売上集計を毎日5分で完了｜複数店舗の売上を自動統合する方法",
      description: "複数店舗の売上データを自動集計し、日次レポートを瞬時に生成する方法を解説。経営判断を迅速化する実践的な手順を紹介します。",
      keywords: ["売上集計", "自動化", "複数店舗", "日次レポート", "TaskMate"],
      slug: "sales-aggregation-multi-store-automation"
    },
    {
      title: "【2025年版】勤怠管理の完全自動化｜タイムカード不要で給与計算まで一括処理",
      description: "勤怠管理から給与計算までを完全自動化する方法を解説。タイムカードや手入力が不要になる具体的なシステム構築手順を紹介します。",
      keywords: ["勤怠管理", "自動化", "給与計算", "タイムカード", "TaskMate"],
      slug: "attendance-payroll-full-automation"
    },
    {
      title: "【2025年版】請求書発行を自動化して月20時間削減｜ミスゼロの請求業務を実現",
      description: "請求書発行業務を自動化し、作成時間とミスを大幅削減する方法を解説。プログラミング不要で実践できる具体的な手順を紹介します。",
      keywords: ["請求書", "自動化", "業務削減", "ミスゼロ", "TaskMate"],
      slug: "invoice-automation-error-free"
    },
    {
      title: "【2025年版】顧客管理をExcelから卒業｜購買履歴の自動分析でリピート率30%向上",
      description: "顧客管理をExcelから自動化システムに移行し、リピート率を向上させる方法を解説。購買履歴の自動分析による具体的な施策を紹介します。",
      keywords: ["顧客管理", "Excel", "自動化", "リピート率", "TaskMate"],
      slug: "crm-excel-migration-repeat-rate"
    },
    {
      title: "【2025年版】発注業務の自動化で在庫コスト20%削減｜最適な発注タイミングを自動判定",
      description: "発注業務を自動化し、在庫コストを削減する方法を解説。需要予測に基づく最適な発注タイミングの自動判定手順を紹介します。",
      keywords: ["発注業務", "自動化", "在庫コスト", "需要予測", "TaskMate"],
      slug: "ordering-automation-inventory-cost-reduction"
    },
    {
      title: "【2025年版】日報作成を5分で完了｜自動集計で報告業務から解放される方法",
      description: "日報作成を自動化し、報告業務の時間を大幅削減する方法を解説。データ自動集計により5分で完了する具体的な手順を紹介します。",
      keywords: ["日報", "自動化", "業務削減", "報告業務", "TaskMate"],
      slug: "daily-report-5min-automation"
    },
    {
      title: "【2025年版】シフト管理の自動化で調整時間80%削減｜希望シフトの自動調整を実現",
      description: "シフト管理を自動化し、調整業務を大幅削減する方法を解説。従業員の希望を考慮した自動シフト作成の具体的な手順を紹介します。",
      keywords: ["シフト管理", "自動化", "調整削減", "希望シフト", "TaskMate"],
      slug: "shift-management-auto-adjustment"
    }
  ];

  return fallbackTopics[index % fallbackTopics.length];
}

// 次のトピックを選択（完全自動化版）
async function selectNextTopic() {
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

  if (availableTopics.length > 0) {
    console.log(`📋 Using predefined topic (${availableTopics.length} remaining)`);
    return availableTopics[0];
  }

  // 定義済みトピックが枯渇 → Claude APIで自動生成
  console.log('⚠️  All predefined topics used. Generating new topic automatically...');
  const newTopic = await generateNewTopic(usedTopics);

  if (newTopic) {
    return newTopic;
  }

  // API失敗時のフォールバック
  console.log('⚠️  API failed. Using fallback topic...');
  const fallbackIndex = topics.length;
  const fallbackTopic = getFallbackTopic(fallbackIndex);

  // フォールバックトピックも保存
  topics.push(fallbackTopic);
  fs.writeFileSync(topicsFile, JSON.stringify(topics, null, 2), 'utf-8');
  console.log('💾 Fallback topic saved to article-topics.json');

  return fallbackTopic;
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
      max_tokens: 8000,  // タイムアウト回避のため最適化
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
    const selectedTopics = new Set(); // 同じループ内で重複選択を防ぐ

    for (let i = 0; i < articlesToGenerate; i++) {
      console.log(`\n🎯 Generating LLM-optimized article ${existingCount + i + 1}/${ARTICLES_PER_DAY} for ${targetDate}...`);

      // 次のトピックを選択（async対応）
      console.log('🎯 Selecting next topic...');
      let topic = await selectNextTopic();

      // 既に選択済みのトピックをスキップ
      while (topic && selectedTopics.has(topic.slug)) {
        console.log(`⚠️  Topic ${topic.slug} already selected in this run, selecting another...`);
        topic = await selectNextTopic();
      }

      if (!topic) {
        console.log('❌ Failed to select topic (this should never happen with fallback)');
        if (generatedCount === 0) {
          process.exit(1);
        }
        break;
      }

      console.log(`✅ Topic selected: ${topic.title}\n`);
      selectedTopics.add(topic.slug); // 選択済みに追加

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
