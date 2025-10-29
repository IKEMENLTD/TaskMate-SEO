const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'beginner-no-talent-myth-failure-path.md',
    // 連続画像を削除して、適切な位置に再配置
    removeImages: [
      '![チーム作業の様子](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60)'
    ],
    addImages: [
      {
        after: 'さらに、プログラミングのエラーメッセージは英語で表示されることが多く、何が問題なのかを理解すること自体が難題です。「Syntax Error」「Undefined」「Null Reference」といった専門用語は、初心者にとっては暗号のようなもの。エラーの意味を調べるだけで数時間かかり、本来やりたかった作業は一向に進まないという悪循環に陥ります。',
        insert: '\n\n![チーム作業の様子](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60)'
      }
    ],
    linkFix: {
      old: '👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**',
      new: '**[👉 TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-error-ten-times-normal.md',
    removeImages: [
      '![エラーメッセージに向き合う開発者](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60)'
    ],
    addImages: [
      {
        after: 'さらに、「エラーは悪いもの」という固定観念があります。学校教育では「間違えないこと」が評価される傾向があり、その影響でエラーが出ること自体を失敗と捉えてしまいます。しかし、プログラミングにおいてエラーは「失敗」ではなく「フィードバック」なのです。',
        insert: '\n\n![エラーメッセージに向き合う開発者](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60)'
      }
    ],
    linkFix: {
      old: '👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**',
      new: '**[👉 TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-success-small-wins.md',
    removeImages: [
      '![成功を喜ぶ様子](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60)'
    ],
    addImages: [
      {
        after: '心理学の研究でも、小さな成功体験の積み重ねが自己効力感を高め、最終的に大きな目標達成につながることが証明されています。ゲームのレベルアップシステムが人を夢中にさせるのも、この「小さな達成感」の連続が楽しさを生み出すからです。プログラミング学習でも、同じ原理を活用できます。',
        insert: '\n\n![成功を喜ぶ様子](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60)'
      }
    ],
    linkFix: {
      old: '👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**',
      new: '**[👉 TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-no-comparison-own-pace.md',
    removeImages: [
      '![マイペースで学習する様子](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60)'
    ],
    addImages: [
      {
        after: 'さらに、オンラインの学習コミュニティでは、成功事例ばかりが目立ちます。「3ヶ月でエンジニア転職成功！」「副業で月10万円達成！」といった華々しい報告を見ると、自分の遅い進捗が恥ずかしく感じられ、質問することすら躊躇してしまいます。本来は学びの場であるはずのコミュニティが、かえってプレッシャーの源になっているのです。',
        insert: '\n\n![マイペースで学習する様子](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60)'
      }
    ],
    linkFix: {
      old: '👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**',
      new: '**[👉 TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  }
];

const postsDir = path.join(__dirname, '..', 'content', 'posts');

fixes.forEach(fix => {
  const filePath = path.join(postsDir, fix.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 連続した画像を削除
  if (fix.removeImages) {
    fix.removeImages.forEach(img => {
      // 画像の前後の空行も含めて削除
      const patterns = [
        `\n\n${img}\n\n`,
        `\n\n${img}`,
        `${img}\n\n`
      ];
      patterns.forEach(pattern => {
        if (content.includes(pattern)) {
          content = content.replace(pattern, '\n\n');
          console.log(`✅ ${fix.file}: 連続画像削除成功`);
        }
      });
    });
  }

  // 新しい位置に画像を追加
  if (fix.addImages) {
    fix.addImages.forEach(img => {
      if (content.includes(img.after) && !content.includes(img.insert.trim())) {
        content = content.replace(img.after, img.after + img.insert);
        console.log(`✅ ${fix.file}: 画像再配置成功`);
      }
    });
  }

  // LINEリンク修正 - 絵文字も含めて全体をクリッカブルに
  if (fix.linkFix && content.includes(fix.linkFix.old)) {
    content = content.replace(fix.linkFix.old, fix.linkFix.new);
    console.log(`✅ ${fix.file}: LINEリンク修正成功`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${fix.file}: 完了\n`);
});

console.log('🎉 全記事の修正が完了しました！');
console.log('📝 変更内容:');
console.log('  - 連続画像を削除し、適切な位置に再配置');
console.log('  - LINEリンクを「👉 TaskMate 公式LINEはこちら」全体がクリッカブルに修正');
