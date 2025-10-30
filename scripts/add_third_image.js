const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'beginner-no-talent-myth-failure-path.md',
    addImage: {
      after: 'この作業に毎週30分〜40分かかり、月曜の朝の貴重な時間が奪われていました。さらに、祝日で月曜が休みの場合は火曜に送り忘れたり、出張中に送れなかったりと、継続性の面でも課題がありました。',
      insert: '\n\n![業務効率化のイメージ](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60)'
    }
  },
  {
    file: 'beginner-error-ten-times-normal.md',
    addImage: {
      after: 'さらに、「エラーは悪いもの」という固定観念があります。学校教育では「間違えないこと」が評価される傾向があり、その影響でエラーが出ること自体を失敗と捉えてしまいます。しかし、プログラミングにおいてエラーは「失敗」ではなく「フィードバック」なのです。',
      insert: '\n\n![エラーメッセージに向き合う開発者](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60)'
    }
  },
  {
    file: 'beginner-success-small-wins.md',
    addImage: {
      after: '心理学の研究でも、小さな成功体験の積み重ねが自己効力感を高め、最終的に大きな目標達成につながることが証明されています。ゲームのレベルアップシステムが人を夢中にさせるのも、この「小さな達成感」の連続が楽しさを生み出すからです。プログラミング学習でも、同じ原理を活用できます。',
      insert: '\n\n![成功を喜ぶ様子](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60)'
    }
  },
  {
    file: 'beginner-no-comparison-own-pace.md',
    addImage: {
      after: 'さらに、オンラインの学習コミュニティでは、成功事例ばかりが目立ちます。「3ヶ月でエンジニア転職成功！」「副業で月10万円達成！」といった華々しい報告を見ると、自分の遅い進捗が恥ずかしく感じられ、質問することすら躊躇してしまいます。本来は学びの場であるはずのコミュニティが、かえってプレッシャーの源になっているのです。',
      insert: '\n\n![マイペースで学習する様子](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60)'
    }
  }
];

const postsDir = path.join(__dirname, '..', 'content', 'posts');

fixes.forEach(fix => {
  const filePath = path.join(postsDir, fix.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 3枚目の画像を追加
  if (fix.addImage && content.includes(fix.addImage.after)) {
    // 既に画像が存在しないか確認
    if (!content.includes(fix.addImage.insert.trim())) {
      content = content.replace(fix.addImage.after, fix.addImage.after + fix.addImage.insert);
      console.log(`✅ ${fix.file}: 3枚目の画像追加成功`);
    } else {
      console.log(`ℹ️ ${fix.file}: 3枚目の画像は既に存在します`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('\n🎉 全記事に3枚目の画像を追加しました！');
