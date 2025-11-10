const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 残り3記事
const articles = [
  {
    date: '2024-11-09',
    slug: 'overtime-payroll-error-prevention',
    mainKeyword: '残業代 給与計算 ミス防止',
    title: '【2024年版】残業代の給与計算ミスを防ぐ自動化システム｜労務トラブルを未然に防ぐ',
    relatedKeywords: ['残業代', '給与計算', 'ミス防止', '労務', '自動化']
  },
  {
    date: '2024-11-09',
    slug: 'inventory-management-inventory-calculation',
    mainKeyword: '適正在庫 管理方法',
    title: '【2024年版】適正在庫を自動計算する方法｜過剰在庫と欠品を防ぐデータドリブン在庫管理',
    relatedKeywords: ['適正在庫', '在庫管理', '自動計算', '発注点', '安全在庫']
  },
  {
    date: '2024-11-10',
    slug: 'employee-shift-automation',
    mainKeyword: '従業員 シフト 自動',
    title: '【2024年版】従業員のシフト管理を自動化する方法｜人員配置の最適化と工数削減',
    relatedKeywords: ['従業員', 'シフト', '自動化', '人員配置', 'シフト管理']
  }
];

function createPrompt(articleInfo) {
  return `TaskMateAIブログの記事を作成してください。

記事情報:
- キーワード: ${articleInfo.mainKeyword}
- タイトル: ${articleInfo.title}
- 日付: ${articleInfo.date}
- slug: ${articleInfo.slug}

【必須構成】
1. frontmatter（YAML）
2. メタ情報（最終更新日、調査データ取得日、執筆者）
3. 【3行まとめ】（□で3項目、具体的な数値含む）
4. 第1セクション：問いかけで始まる導入（<span class="text-teal">で読者の声3つ）
5. 第2セクション：なぜ今必要なのか（理由2-3個）
6. TaskMate独自調査データ（表形式、具体的な数値）
7. 専門家の評価（3名の引用）
8. メイン解説（ツール紹介、事例、Before/After）
9. FAQ（Q&A 5個）
10. まとめ（今日から始められる3ステップ）
11. CTA（TaskMate公式LINE）

【スタイル】
- 絵文字禁止、SVGアイコン禁止
- テキスト記号のみ（■、□、【】、※）
- <span class="text-teal">と<span class="text-underline">使用
- 断定的な文体（「〜です」「〜できます」）
- 具体的な数値を10個以上
- Unsplash画像を5枚以上
- 最低3,000文字以上

記事を作成してください。`;
}

async function regenerateArticle(articleInfo, index, total) {
  console.log(`\n[${index + 1}/${total}] 記事を再生成中: ${articleInfo.title}`);
  console.log(`  - 日付: ${articleInfo.date}`);
  console.log(`  - キーワード: ${articleInfo.mainKeyword}`);

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: createPrompt(articleInfo)
      }]
    });

    let content = '';

    for await (const messageStreamEvent of stream) {
      if (messageStreamEvent.type === 'content_block_delta' &&
          messageStreamEvent.delta.type === 'text_delta') {
        content += messageStreamEvent.delta.text;
        process.stdout.write('.');
      }
    }

    console.log('');

    if (content.startsWith('```markdown\n')) {
      content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```\n')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const postsDir = path.join(__dirname, '..', 'content', 'posts');
    const filePath = path.join(postsDir, `${articleInfo.slug}.md`);

    fs.writeFileSync(filePath, content, 'utf-8');

    console.log(`  ✅ 記事を保存しました: ${articleInfo.slug}.md`);
    console.log(`  📊 文字数: ${content.length}文字`);

    return { success: true, slug: articleInfo.slug, length: content.length };
  } catch (error) {
    console.log('');
    console.error(`  ❌ エラーが発生しました: ${error.message}`);
    return { success: false, slug: articleInfo.slug, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('📝 残り3記事を完成させます');
  console.log('='.repeat(70));
  console.log(`総記事数: ${articles.length}件\n`);

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const result = await regenerateArticle(articles[i], i, articles.length);
    results.push(result);

    if (i < articles.length - 1) {
      console.log(`  ⏳ 5秒待機中...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 結果サマリー');
  console.log('='.repeat(70));

  const successCount = results.filter(r => r.success).length;
  const totalChars = results.filter(r => r.success).reduce((sum, r) => sum + (r.length || 0), 0);
  const avgChars = successCount > 0 ? Math.round(totalChars / successCount) : 0;

  console.log(`✅ 成功: ${successCount}/${articles.length}件`);
  console.log(`❌ 失敗: ${articles.length - successCount}件`);
  console.log(`📝 総文字数: ${totalChars.toLocaleString()}文字`);
  console.log(`📊 平均文字数: ${avgChars.toLocaleString()}文字/記事`);

  if (successCount === articles.length) {
    console.log('\n🎉 全記事の再生成が完了しました！');
  }
}

main();
