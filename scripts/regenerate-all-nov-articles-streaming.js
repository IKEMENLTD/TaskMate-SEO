const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 13記事の詳細情報
const articles = [
  // 11/04
  {
    date: '2024-11-04',
    slug: 'tools-excel-programming',
    mainKeyword: 'エクセル 自動化 ツール',
    title: '【2024年版】エクセル業務を自動化する5つのツール｜プログラミング不要で実現する効率化',
    relatedKeywords: ['エクセル', '自動化', 'マクロ', 'VBA', 'GAS']
  },
  {
    date: '2024-11-04',
    slug: 'gas-programming-automation',
    mainKeyword: 'GAS 自動化 プログラミング',
    title: '【2024年版】GAS導入を成功させる完全ガイド｜プログラミング知識ゼロから始める業務自動化',
    relatedKeywords: ['GAS', '自動化', 'プログラミング', 'スプレッドシート', 'Gmail']
  },
  // 11/05
  {
    date: '2024-11-05',
    slug: 'small-team-tools-efficiency',
    mainKeyword: '少人数 業務効率化 ツール',
    title: '【2024年版】中小企業向け業務効率化ツール10選｜少人数チームで最大の成果を出す方法',
    relatedKeywords: ['少人数', '業務効率化', 'ツール', '中小企業', 'チーム']
  },
  {
    date: '2024-11-05',
    slug: 'no-code-programming-automation',
    mainKeyword: 'ノーコード 自動化 プログラミング',
    title: '【2024年版】ノーコードで業務自動化を実現｜プログラミング不要で始める効率化ガイド',
    relatedKeywords: ['ノーコード', '自動化', 'プログラミング不要', 'Zapier', 'Make']
  },
  // 11/06
  {
    date: '2024-11-06',
    slug: 'gas-programming-automation-2',
    mainKeyword: 'GAS 自動化 プログラミング',
    title: '【2024年版】GASで実現する業務自動化の実践例15選｜コピペで使えるコード付き',
    relatedKeywords: ['GAS', '自動化', 'プログラミング', 'コード', 'スクリプト']
  },
  {
    date: '2024-11-06',
    slug: 'sales-ecommerce-rakuten-2',
    mainKeyword: '楽天 在庫管理 売上',
    title: '【2024年版】楽天の在庫管理を自動化して売上を伸ばす方法｜EC事業者必見の効率化術',
    relatedKeywords: ['楽天', '在庫管理', '売上', 'EC', '自動化']
  },
  // 11/07
  {
    date: '2024-11-07',
    slug: 'sales-daily-report',
    mainKeyword: '売上 日報 自動',
    title: '【2024年版】売上日報を自動化する3つの方法｜毎日の集計作業から解放される実践ガイド',
    relatedKeywords: ['売上', '日報', '自動化', '集計', 'レポート']
  },
  {
    date: '2024-11-07',
    slug: 'inventory-management-inventory-ordering',
    mainKeyword: '在庫管理 発注 自動',
    title: '【2024年版】在庫管理の発注を自動化する完全ガイド｜適正在庫を保つ仕組み作り',
    relatedKeywords: ['在庫管理', '発注', '自動化', '適正在庫', '発注点']
  },
  // 11/08
  {
    date: '2024-11-08',
    slug: 'attendance-payroll-calculation',
    mainKeyword: '勤怠 給与計算 自動',
    title: '【2024年版】勤怠から給与計算を自動化する方法｜人事労務の業務時間を70%削減',
    relatedKeywords: ['勤怠', '給与計算', '自動化', '人事', '労務']
  },
  {
    date: '2024-11-08',
    slug: 'inventory-management-inventory-alert',
    mainKeyword: '在庫管理 アラート 通知',
    title: '【2024年版】在庫アラートを自動化して欠品を防ぐ方法｜リアルタイム通知システムの構築',
    relatedKeywords: ['在庫管理', 'アラート', '通知', '欠品', '自動化']
  },
  // 11/09
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
  // 11/10
  {
    date: '2024-11-10',
    slug: 'employee-shift-automation',
    mainKeyword: '従業員 シフト 自動',
    title: '【2024年版】従業員のシフト管理を自動化する方法｜人員配置の最適化と工数削減',
    relatedKeywords: ['従業員', 'シフト', '自動化', '人員配置', 'シフト管理']
  }
];

// 簡潔なプロンプト（トークン削減版）
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
    // ストリーミングAPIを使用
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

    // ストリーミングレスポンスを受信
    for await (const messageStreamEvent of stream) {
      if (messageStreamEvent.type === 'content_block_delta' &&
          messageStreamEvent.delta.type === 'text_delta') {
        content += messageStreamEvent.delta.text;
        // 進捗表示
        process.stdout.write('.');
      }
    }

    console.log(''); // 改行

    // Markdown のコードブロックを削除
    if (content.startsWith('```markdown\n')) {
      content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```\n')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // ファイルパス
    const postsDir = path.join(__dirname, '..', 'content', 'posts');
    const filePath = path.join(postsDir, `${articleInfo.slug}.md`);

    // ファイルに書き込み
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log(`  ✅ 記事を保存しました: ${articleInfo.slug}.md`);
    console.log(`  📊 文字数: ${content.length}文字`);

    return { success: true, slug: articleInfo.slug, length: content.length };
  } catch (error) {
    console.log(''); // 改行
    console.error(`  ❌ エラーが発生しました: ${error.message}`);
    return { success: false, slug: articleInfo.slug, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('📝 11/04-11/10の13記事を完全再生成します（ストリーミング版）');
  console.log('='.repeat(70));
  console.log(`総記事数: ${articles.length}件`);
  console.log(`予想所要時間: 約${Math.ceil(articles.length * 3)}分\n`);

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const result = await regenerateArticle(articles[i], i, articles.length);
    results.push(result);

    // API制限を考慮して、各記事の間に5秒待機
    if (i < articles.length - 1) {
      console.log(`  ⏳ 5秒待機中...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 再生成結果サマリー');
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
  } else {
    console.log('\n⚠️ 一部の記事で失敗がありました。');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.slug}: ${r.error}`);
    });
  }
}

main();
