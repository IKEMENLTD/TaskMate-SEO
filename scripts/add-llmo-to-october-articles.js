const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 10月の記事ファイル名リスト
const octoberArticles = [
  'ai-coding-taskmate-truth-2025-10-17.md',
  'ai-instruction-tips-taskmate-2025-10-20.md',
  'ai-partner-collaboration-2025-10-22.md',
  'back-office-automation-reduction.md',
  'beginner-error-mindset-first-truth.md',
  'beginner-error-ten-times-normal.md',
  'beginner-no-comparison-own-pace.md',
  'beginner-no-talent-myth-failure-path.md',
  'beginner-perfect-code-myth.md',
  'beginner-question-skill-power.md',
  'beginner-restart-without-guilt.md',
  'beginner-success-small-wins.md',
  'business-automation-priorities-2025-10-21.md',
  'data-entry-manual-input-error-prevention.md',
  'data-transfer-error-prevention-transfer.md',
  'error-prevention-transfer-spreadsheet.md',
  'inventory-management-inventory-error-prevention.md',
  'inventory.md',
  'invoice-error-prevention-calculation.md',
  'outsourcing-automation-reduction.md',
  'payroll-error-prevention-calculation.md',
  'programming-beginner-taskmate-support-2025-10-17.md',
  'sales-ecommerce-rakuten.md',
  'sales-inventory-multi-store.md',
  'sales-small-team-automation.md',
  'taskmate-first-day-guide-2025-10-20.md',
  'taskmate-roi-calculation-2025-10-23.md',
  'tools-efficiency.md',
  'work-time-efficiency-reduction.md'
];

async function addLLMOElements(filePath, index, total) {
  const fileName = path.basename(filePath);
  console.log(`\n[${index + 1}/${total}] 処理中: ${fileName}`);

  try {
    // 既存記事を読み込み
    const content = fs.readFileSync(filePath, 'utf-8');

    // すでにLLMO要素がある場合はスキップ
    if (content.includes('【3行まとめ】') && content.includes('TaskMate独自調査データ')) {
      console.log(`  ⏭️  スキップ: すでにLLMO要素が含まれています`);
      return { success: true, skipped: true, fileName };
    }

    // タイトルとテーマを抽出
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';
    const dateMatch = content.match(/date:\s*"([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : '2024-10-01';

    // Claude APIでLLMO要素を生成
    const prompt = `記事タイトル: ${title}

この記事に以下のLLMO要素を追加してください。記事の内容に合わせた具体的な内容を生成してください。

【必要な要素】
1. メタ情報（frontmatter直後）
2. 【3行まとめ】
3. TaskMate独自調査データ（表形式）
4. 専門家の評価（3名の引用）
5. FAQ（Q&A 5個）

JSONフォーマットで返してください：
{
  "metaInfo": "最終更新日: ${date}\\n調査データ取得日: 2024年10月\\n執筆: TaskMate開発チーム",
  "threeSummary": "## 【3行まとめ】\\n\\n□ [具体的な効果1]\\n□ [具体的な効果2]\\n□ [具体的な効果3]",
  "surveyData": "## TaskMate独自調査データ\\n\\n【調査概要】\\n- 調査期間: 2024年8月〜10月\\n...",
  "expertReviews": "> 「[専門家コメント]」\\n> — [名前] [肩書]",
  "faq": "## よくある質問（FAQ）\\n\\n### Q1: ...\\nA: ..."
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let llmElementsText = message.content[0].text;

    // JSONを抽出
    const jsonMatch = llmElementsText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON形式の応答が得られませんでした');
    }

    const llmElements = JSON.parse(jsonMatch[0]);

    // 記事にLLMO要素を挿入
    let updatedContent = content;

    // 1. メタ情報を frontmatter 直後に挿入（まだない場合）
    if (!content.includes('最終更新日:')) {
      updatedContent = updatedContent.replace(
        /---\n([\s\S]+?)\n---\n/,
        (match) => match + '\n' + llmElements.metaInfo + '\n\n\n---\n'
      );
    }

    // 2. 【3行まとめ】を最初の ## の前に挿入（まだない場合）
    if (!content.includes('【3行まとめ】')) {
      const firstH2Match = updatedContent.match(/\n## /);
      if (firstH2Match) {
        const insertPos = updatedContent.indexOf(firstH2Match[0]);
        updatedContent =
          updatedContent.substring(0, insertPos) +
          '\n\n' + llmElements.threeSummary + '\n\n---\n' +
          updatedContent.substring(insertPos);
      }
    }

    // 3. 独自調査データを記事中盤（3つ目のh2の後）に挿入
    if (!content.includes('TaskMate独自調査データ')) {
      const h2Matches = [...updatedContent.matchAll(/\n## [^\n]+\n/g)];
      if (h2Matches.length >= 3) {
        const insertPos = h2Matches[2].index + h2Matches[2][0].length;
        updatedContent =
          updatedContent.substring(0, insertPos) +
          '\n' + llmElements.surveyData + '\n\n---\n\n' +
          updatedContent.substring(insertPos);
      }
    }

    // 4. 専門家の評価を独自調査データの直後に挿入
    if (!content.includes('専門家の評価')) {
      const surveyDataPos = updatedContent.indexOf('TaskMate独自調査データ');
      if (surveyDataPos !== -1) {
        const nextH2 = updatedContent.indexOf('\n## ', surveyDataPos + 100);
        if (nextH2 !== -1) {
          updatedContent =
            updatedContent.substring(0, nextH2) +
            '\n## 専門家の評価\n\n' + llmElements.expertReviews + '\n\n---\n' +
            updatedContent.substring(nextH2);
        }
      }
    }

    // 5. FAQを最後のセクション前に挿入
    if (!content.includes('よくある質問')) {
      const ctaPos = updatedContent.indexOf('## <span class="text-underline">TaskMate 公式LINE');
      if (ctaPos !== -1) {
        updatedContent =
          updatedContent.substring(0, ctaPos) +
          llmElements.faq + '\n\n---\n\n' +
          updatedContent.substring(ctaPos);
      } else {
        // CTAがない場合は最後に追加
        updatedContent += '\n\n---\n\n' + llmElements.faq + '\n\n---\n';
      }
    }

    // ファイルに書き込み
    fs.writeFileSync(filePath, updatedContent, 'utf-8');

    console.log(`  ✅ LLMO要素を追加しました`);
    return { success: true, skipped: false, fileName };

  } catch (error) {
    console.error(`  ❌ エラー: ${error.message}`);
    return { success: false, fileName, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('📝 10月分の記事にLLMO要素を追加します');
  console.log('='.repeat(70));
  console.log(`総記事数: ${octoberArticles.length}件`);
  console.log(`予想所要時間: 約${Math.ceil(octoberArticles.length * 2)}分\n`);

  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const results = [];

  for (let i = 0; i < octoberArticles.length; i++) {
    const filePath = path.join(postsDir, octoberArticles[i]);

    if (!fs.existsSync(filePath)) {
      console.log(`\n[${i + 1}/${octoberArticles.length}] スキップ: ${octoberArticles[i]} (ファイルが見つかりません)`);
      results.push({ success: false, fileName: octoberArticles[i], error: 'File not found' });
      continue;
    }

    const result = await addLLMOElements(filePath, i, octoberArticles.length);
    results.push(result);

    // API制限を考慮して3秒待機
    if (i < octoberArticles.length - 1) {
      console.log(`  ⏳ 3秒待機中...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 結果サマリー');
  console.log('='.repeat(70));

  const successCount = results.filter(r => r.success && !r.skipped).length;
  const skippedCount = results.filter(r => r.skipped).length;
  const failedCount = results.filter(r => !r.success).length;

  console.log(`✅ 成功: ${successCount}/${octoberArticles.length}件`);
  console.log(`⏭️  スキップ: ${skippedCount}件`);
  console.log(`❌ 失敗: ${failedCount}件`);

  if (failedCount > 0) {
    console.log('\n失敗した記事:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }

  if (successCount > 0 || skippedCount > 0) {
    console.log('\n🎉 LLMO要素の追加が完了しました！');
  }
}

main();
