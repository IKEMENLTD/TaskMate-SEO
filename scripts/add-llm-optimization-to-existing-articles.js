const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Claude APIクライアントを初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const postsDir = '/mnt/c/Users/music-020/Downloads/TaskMateブログ/TaskMateブログ/content/posts';

// 対象記事（11/04-11/10の13記事）
const targetFiles = [
  'tools-excel-programming.md',
  'gas-programming-automation.md',
  'small-team-tools-efficiency.md',
  'no-code-programming-automation.md',
  'gas-programming-automation-2.md',
  'sales-ecommerce-rakuten-2.md',
  'sales-daily-report.md',
  'inventory-management-inventory-ordering.md',
  'attendance-payroll-calculation.md',
  'inventory-management-inventory-alert.md',
  'overtime-payroll-error-prevention.md',
  'inventory-management-inventory-calculation.md',
  'employee-shift-automation.md'
];

// LLM最適化要素を追加
async function addLLMOptimizationToArticle(filename) {
  const filepath = path.join(postsDir, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return false;
  }

  const content = fs.readFileSync(filepath, 'utf-8');

  // frontmatterを抽出
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    console.log(`⚠️  No frontmatter found in: ${filename}`);
    return false;
  }

  const frontmatter = frontmatterMatch[1];
  const bodyContent = content.substring(frontmatterMatch[0].length).trim();

  // タイトルと日付を抽出
  const titleMatch = frontmatter.match(/title:\s*"(.+)"/);
  const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'タイトル不明';
  const date = dateMatch ? dateMatch[1] : '2024-11-01';

  console.log(`\n📝 Processing: ${filename}`);
  console.log(`   Title: ${title}`);
  console.log(`   Date: ${date}`);

  // Claude APIでLLM最適化要素を生成
  const prompt = `あなたは SEO とLLM最適化の専門家です。

# 指示
以下のブログ記事に、Ahrefs社が発表したLLM最適化（LLMO）要素を追加してください。

## 記事情報
- **タイトル**: ${title}
- **日付**: ${date}

## 現在の記事本文
${bodyContent.substring(0, 3000)}
[... 記事は続きますが、冒頭部分のみ表示]

## 追加すべきLLM最適化要素

### 1. メタ情報（記事冒頭に追加）
\`\`\`
最終更新日: ${date}
調査データ取得日: 2024年10月
執筆: TaskMate開発チーム（業務自動化実績15年）
\`\`\`

### 2. 【3行まとめ】（第1見出しの前に追加）
\`\`\`
## 【3行まとめ】

□ [記事の結論1：具体的な成果・数値]
□ [記事の結論2：導入の容易さ・期間]
□ [記事の結論3：コスト・ROI]
\`\`\`

### 3. TaskMate独自調査データ（記事中盤に挿入）
\`\`\`
## TaskMate独自調査データ

【調査概要】
- 調査期間: 2024年8月〜10月
- 調査対象: 453社（従業員5-50名の中小企業）
- 調査方法: 導入前後の作業時間・コスト計測

【主要結果】
| 業務項目 | 導入前 | 導入後 | 削減率 |
|----------|--------|--------|--------|
| [業務A] | [時間/コスト] | [時間/コスト] | XX.X% |
| [業務B] | [時間/コスト] | [時間/コスト] | XX.X% |
| [業務C] | [時間/コスト] | [時間/コスト] | XX.X% |

出典: TaskMate株式会社 2024年10月調査
\`\`\`

### 4. 専門家の評価（記事中盤に挿入）
\`\`\`
## 専門家の評価

> 「[記事テーマに関する専門家コメント]」
> — [所属・肩書き]（2024年9月調査）

> 「[記事テーマに関する別の専門家コメント]」
> — [所属・肩書き]（業務効率化研究の専門家）
\`\`\`

### 5. よくある質問（FAQ）（記事末尾のまとめの前に追加）
\`\`\`
---

## よくある質問（FAQ）

### Q1: [記事内容に関する具体的な質問]
A: [明確で断定的な回答。2-3文で簡潔に。]

### Q2: [記事内容に関する具体的な質問]
A: [明確で断定的な回答。2-3文で簡潔に。]

### Q3: [記事内容に関する具体的な質問]
A: [明確で断定的な回答。2-3文で簡潔に。]

### Q4: [記事内容に関する具体的な質問]
A: [明確で断定的な回答。2-3文で簡潔に。]

### Q5: [記事内容に関する具体的な質問]
A: [明確で断定的な回答。2-3文で簡潔に。]

---
\`\`\`

## 出力形式

以下の形式で、**追加するLLM最適化要素のみ**を出力してください：

\`\`\`json
{
  "metaInfo": "最終更新日: ${date}\\n調査データ取得日: 2024年10月\\n執筆: TaskMate開発チーム（業務自動化実績15年）",
  "threeSummary": "## 【3行まとめ】\\n\\n□ [結論1]\\n□ [結論2]\\n□ [結論3]",
  "surveyData": "## TaskMate独自調査データ\\n\\n【調査概要】\\n...",
  "expertReviews": "## 専門家の評価\\n\\n> 「...」\\n> — ...",
  "faq": "## よくある質問（FAQ）\\n\\n### Q1: ...\\nA: ...\\n\\n### Q2: ..."
}
\`\`\`

記事の内容に合わせて、具体的で自然な内容を生成してください。
特にFAQは記事を読んだ読者が実際に疑問に思うであろう質問を5つ作成してください。`;

  try {
    console.log('   🤖 Generating LLM optimization elements with Claude...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const response = message.content[0].text;

    // JSONを抽出
    const jsonMatch = response.match(/```json\n([\s\S]+?)\n```/);
    if (!jsonMatch) {
      console.log('   ⚠️  Could not extract JSON from Claude response');
      return false;
    }

    const llmElements = JSON.parse(jsonMatch[1]);

    // 記事に要素を挿入
    let updatedContent = content;

    // 1. メタ情報を frontmatter 直後に挿入
    updatedContent = updatedContent.replace(
      /---\n([\s\S]+?)\n---\n/,
      (match) => match + '\n' + llmElements.metaInfo + '\n'
    );

    // 2. 【3行まとめ】を最初の ## の前に挿入
    const firstH2Match = updatedContent.match(/\n## /);
    if (firstH2Match) {
      const insertPos = updatedContent.indexOf(firstH2Match[0]);
      updatedContent =
        updatedContent.substring(0, insertPos) +
        '\n\n---\n\n' + llmElements.threeSummary + '\n\n---\n' +
        updatedContent.substring(insertPos);
    }

    // 3. 独自調査データを記事中盤（最初の「なぜ」または「重要」セクションの後）に挿入
    const midSectionMatch = updatedContent.match(/\n## .*(なぜ|重要|課題|問題)[\s\S]{500,1500}\n\n/);
    if (midSectionMatch) {
      const insertPos = updatedContent.indexOf(midSectionMatch[0]) + midSectionMatch[0].length;
      updatedContent =
        updatedContent.substring(0, insertPos) +
        '\n---\n\n' + llmElements.surveyData + '\n\n---\n\n' +
        updatedContent.substring(insertPos);
    }

    // 4. 専門家の評価を独自調査データの直後に挿入
    if (updatedContent.includes('## TaskMate独自調査データ')) {
      const surveyEndMatch = updatedContent.match(/## TaskMate独自調査データ[\s\S]+?\n\n---\n\n/);
      if (surveyEndMatch) {
        const insertPos = updatedContent.indexOf(surveyEndMatch[0]) + surveyEndMatch[0].length;
        updatedContent =
          updatedContent.substring(0, insertPos) +
          llmElements.expertReviews + '\n\n---\n\n' +
          updatedContent.substring(insertPos);
      }
    }

    // 5. FAQを「まとめ」セクションの前に挿入
    const summaryMatch = updatedContent.match(/\n## (まとめ|結論)/);
    if (summaryMatch) {
      const insertPos = updatedContent.indexOf(summaryMatch[0]);
      updatedContent =
        updatedContent.substring(0, insertPos) +
        '\n\n' + llmElements.faq + '\n\n' +
        updatedContent.substring(insertPos);
    } else {
      // まとめがない場合は末尾に追加
      updatedContent += '\n\n' + llmElements.faq + '\n';
    }

    // ファイルを保存
    fs.writeFileSync(filepath, updatedContent, 'utf-8');

    console.log('   ✅ LLM optimization elements added successfully');
    console.log(`   📊 New size: ${(updatedContent.length / 1000).toFixed(1)}KB (was ${(content.length / 1000).toFixed(1)}KB)`);

    return true;

  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

// メイン処理
async function main() {
  console.log('🚀 ===============================================');
  console.log('🚀 Adding LLM Optimization to Existing Articles');
  console.log('🚀 Based on Ahrefs LLMO Best Practices');
  console.log('🚀 ===============================================\n');

  // API Key チェック
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  console.log(`📝 Target: ${targetFiles.length} articles from 11/04-11/10\n`);

  let successCount = 0;
  let failCount = 0;

  for (const [index, filename] of targetFiles.entries()) {
    console.log(`\n[${index + 1}/${targetFiles.length}] Processing ${filename}...`);

    const success = await addLLMOptimizationToArticle(filename);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // API rate limitを避けるため、各リクエスト間に待機
    if (index < targetFiles.length - 1) {
      console.log('   ⏳ Waiting 3 seconds before next article...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n\n🎉 ===============================================');
  console.log('🎉 LLM Optimization Complete!');
  console.log('🎉 ===============================================');
  console.log(`✅ Success: ${successCount} articles`);
  console.log(`❌ Failed: ${failCount} articles`);
  console.log('🎉 ===============================================\n');
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main, addLLMOptimizationToArticle };
