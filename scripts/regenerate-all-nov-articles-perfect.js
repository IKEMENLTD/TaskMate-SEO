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

async function regenerateArticle(articleInfo, index, total) {
  console.log(`\n[${ index + 1}/${total}] 記事を再生成中: ${articleInfo.title}`);
  console.log(`  - 日付: ${articleInfo.date}`);
  console.log(`  - キーワード: ${articleInfo.mainKeyword}`);

  const prompt = `あなたはTaskMateAIブログの専門記事ライターです。

# 【最重要】既存記事の形式に完全準拠

以下の記事情報に基づいて、高品質なブログ記事を作成してください。

## 記事情報
- メインキーワード: ${articleInfo.mainKeyword}
- タイトル: ${articleInfo.title}
- 日付: ${articleInfo.date}
- slug: ${articleInfo.mainKeyword}
- 関連キーワード: ${articleInfo.relatedKeywords.join(', ')}

# 【絶対厳守】記事構造テンプレート

## frontmatter（YAML形式）
\`\`\`yaml
---
title: "${articleInfo.title}"
date: "${articleInfo.date}"
description: "${articleInfo.mainKeyword}を自動化して業務効率を劇的に改善する方法を解説。[簡潔な説明文を生成]"
slug: "${articleInfo.slug}"
keywords: ["${articleInfo.mainKeyword}", "${articleInfo.relatedKeywords.join('", "')}"]
---
\`\`\`

## メタ情報（frontmatter直後、必須）
\`\`\`
最終更新日: ${articleInfo.date}
調査データ取得日: 2024年10月
執筆: TaskMate開発チーム（[領域]実績[X]年、累計導入企業[Y]社以上）


---
\`\`\`

## 【3行まとめ】（必須）
\`\`\`markdown
## 【3行まとめ】

□ [具体的な効果1：数値データを含む]
□ [具体的な効果2：投資対効果やROIを明示]
□ [具体的な効果3：導入の容易さや即効性を強調]

---
\`\`\`

## 第1セクション：問いかけで始める導入部
\`\`\`markdown
## <span class="text-underline">「[読者の悩みを代弁する問いかけ]」で悩んでいませんか？</span>

![イメージ画像](https://images.unsplash.com/photo-XXXXX?w=800&h=400&fit=crop)

<span class="text-teal">**「[読者の心の声1]」**</span>
<span class="text-teal">**「[読者の心の声2]」**</span>
<span class="text-teal">**「[読者の心の声3]」**</span>

そんな悩みを抱えていませんか？

[問題の深刻さを統計データで示す。具体的な調査名と数値を含める]

![関連画像](https://images.unsplash.com/photo-YYYYY?w=1200&q=80)

---

### <span class="text-teal">[問題の本質を示す小見出し]</span>

[問題の核心を説明。具体的な金額や損失を示す]

---

### [失敗パターンや現状の課題]

[2-3つの典型的な失敗パターンを列挙]

**パターン1：[失敗例1]** - [説明]

**パターン2：[失敗例2]** - [説明]

この記事では、**[解決策の概要]**を、実際の導入事例とともに詳しく解説します。

難しい専門知識は不要。実際に、これらの方法を導入した企業では、**[具体的な成果：数値]**しています。

---
\`\`\`

## 第2セクション：なぜ今必要なのか
\`\`\`markdown
## <span class="text-underline">なぜ今、[テーマ]が必須なのか</span>

### <span class="text-teal">理由1：[理由のタイトル]</span>

[理由の詳細説明。統計データや調査結果を含める]

具体的な事例や数値を示す。

### <span class="text-teal">理由2：[理由のタイトル]</span>

[理由の詳細説明]

**[サブ項目]：**
- 箇条書き1
- 箇条書き2
- 箇条書き3

---
\`\`\`

## TaskMate独自調査データ（必須、記事中盤に配置）
\`\`\`markdown
---

## TaskMate独自調査データ：[テーマ]の実測効果

【調査概要】
- 調査期間: 2024年8月〜10月
- 調査対象: [N]社（従業員5-50名の[業種]）
- 調査方法: [テーマ]導入前後6ヶ月間の実測データ比較

【主要結果】
| 業務項目 | 導入前 | 導入後 | 削減率 |
|----------|--------|--------|--------|
| [項目1] | [数値] | [数値] | XX% |
| [項目2] | [数値] | [数値] | XX% |
| [項目3] | [数値] | [数値] | XX% |
| [項目4] | [数値] | [数値] | XX% |

【業種別の改善効果】
- [業種1]（[N]社）：[指標] [数値]→[数値]（X.X倍）
- [業種2]（[N]社）：[指標] [数値]→[数値]（XX%短縮）
- [業種3]（[N]社）：[指標] [数値]%→[数値]%（XX%削減）

出典: TaskMate株式会社 2024年10月調査レポート「[調査タイトル]」

---
\`\`\`

## 専門家の評価（必須、調査データの直後）
\`\`\`markdown
## 専門家の評価

> 「[専門家のコメント1：実務的な視点からの評価]」
> — [名前1]氏 [肩書1]（[専門分野]、[実績]）

> 「[専門家のコメント2：技術的な視点からの評価]」
> — [名前2]氏 [肩書2]（[専門分野]、著書『[書籍名]』）

> 「[専門家のコメント3：経営的な視点からの評価]」
> — [名前3]氏 [肩書3]（[専門分野]、企業指導実績[N]社以上）

---
\`\`\`

## メイン解説セクション
\`\`\`markdown
## <span class="text-underline">[メインテーマの解説]</span>

### <span class="text-teal">[サブテーマ1]</span>

[詳細な説明]

### 実例：[具体的な事例タイトル]

[事例の詳細]

**自動化前：** [Before の状況]

**[ツール名]導入後：** [Afterの状況]（**所要時間：[数値]**）

「[担当者の声]」と担当者。

### <span class="text-teal">[サブテーマ2]</span>

**主な機能：**
- [機能1]
- [機能2]
- [機能3]

**メリット：**
- [メリット1]
- [メリット2]
- [メリット3]

**デメリット：**
- [デメリット1]
- [デメリット2]

---
\`\`\`

## よくある質問（FAQ）（必須、記事後半に配置）
\`\`\`markdown
## よくある質問（FAQ）

### Q1: [よくある質問1]
A: [明確で具体的な回答。数値やステップを含める]

### Q2: [よくある質問2]
A: [明確で具体的な回答。コストや期間を明示]

### Q3: [よくある質問3]
A: [明確で具体的な回答。具体例を挙げる]

### Q4: [よくある質問4]
A: [明確で具体的な回答。規模感を示す]

### Q5: [よくある質問5]
A: [明確で具体的な回答。完璧でなくても改善できることを強調]

---
\`\`\`

## まとめセクション
\`\`\`markdown
## <span class="text-underline">まとめ：[テーマ]で実現する未来</span>

この記事でご紹介した[テーマ]は、単なる「効率化」ではありません。

[より大きな価値や変化を説明]

**今日から始められること：**

1. **[ステップ1]** - [説明]
2. **[ステップ2]** - [説明]
3. **[ステップ3]** - [説明]

[具体的な数値効果のまとめ]

「[テーマ]なんて、自分には関係ない」

そう思っていた人ほど、導入後に「もっと早くやればよかった」と言います。

今日が、あなたの業務を変える第一歩です。

---
\`\`\`

## CTA（Call To Action）
\`\`\`markdown
## <span class="text-underline">TaskMate 公式LINE：お問い合わせはこちら</span>

この記事でご紹介した自動化を今すぐ始めませんか？

TaskMateの公式LINEでは、あなたの業務に最適な自動化プランを無料でご相談いただけます。プログラミング知識は一切不要。日本語で「こんなことできる？」と聞くだけで、AIが最適なソリューションを提案します。

**まずはお気軽にご相談ください**

**[TaskMate 公式LINE：お問い合わせはこちら](https://taskmateai.net/t/pio8hwhejjhy)**

---
\`\`\`

# 【絶対禁止事項】

1. **絵文字は一切使用禁止** - 📊、💰、⏱️、🎯などのUnicode絵文字は絶対に使わない
2. **SVGアイコンは一切使用禁止** - <img src="/icons/*"> タグは絶対に使わない
3. **テキスト記号のみ使用** - ■、□、【】、※などのテキスト記号のみ使用可能
4. **<span>タグの使用** - 色付きテキストは <span class="text-teal"> と <span class="text-underline"> のみ使用
5. **断定的な文体** - 「〜かもしれません」「〜と思われます」は禁止。「〜です」「〜できます」を使用

# 記事の品質要件

1. **文字数**: 最低3,000文字以上（15,000文字程度が理想）
2. **見出し構造**: h2を5-8個、各h2配下にh3を2-4個
3. **具体的な数値**: 必ず10個以上の具体的な数値データを含める
4. **実例**: 最低3つの具体的な事例を含める
5. **画像**: Unsplashの画像URLを5枚以上含める
6. **調査データ**: 実在の調査機関名と年次を含める（例：経済産業省2024年調査）

# 記事のトーン＆ボイス

- **親しみやすく、でもプロフェッショナル**: 読者に寄り添いながら、信頼できる情報を提供
- **具体的で実践的**: 抽象的な説明ではなく、今日から使える情報を
- **前向きで励ます**: 「難しそう」と思っている読者の背中を押す
- **データドリブン**: 感覚ではなく、数字と事実で語る

それでは、上記の要件を100%満たした、読者の心を動かす記事を作成してください。`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 24000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let content = message.content[0].text;

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
    console.error(`  ❌ エラーが発生しました: ${error.message}`);
    return { success: false, slug: articleInfo.slug, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('📝 11/04-11/10の13記事を完全再生成します');
  console.log('='.repeat(70));
  console.log(`総記事数: ${articles.length}件`);
  console.log(`予想所要時間: 約${Math.ceil(articles.length * 2)}分\n`);

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const result = await regenerateArticle(articles[i], i, articles.length);
    results.push(result);

    // API制限を考慮して、各記事の間に3秒待機
    if (i < articles.length - 1) {
      console.log(`  ⏳ 3秒待機中...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 再生成結果サマリー');
  console.log('='.repeat(70));

  const successCount = results.filter(r => r.success).length;
  const totalChars = results.filter(r => r.success).reduce((sum, r) => sum + (r.length || 0), 0);
  const avgChars = Math.round(totalChars / successCount);

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
