const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'beginner-no-talent-myth-failure-path.md',
    images: [
      { after: '![プログラミング学習のイメージ](https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60)', insert: '\n\n![チーム作業の様子](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60)' },
      { after: 'この一連の作業に毎週30分〜40分かかり、月曜の朝の貴重な時間が奪われていました。さらに、祝日で月曜が休みの場合は火曜に送り忘れたり、出張中に送れなかったりと、継続性の面でも課題がありました。', insert: '\n\n![業務効率化のイメージ](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60)' }
    ],
    linkFix: {
      old: '**今すぐTaskMateを始めませんか？**\n\nTaskMate公式LINEアカウント:  \nhttps://line.me/R/ti/p/@356uysad',
      new: '**今すぐTaskMateを始めませんか？**\n\n👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-error-ten-times-normal.md',
    images: [
      { after: '![プログラミング学習のイメージ](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60)', insert: '\n\n![エラーメッセージに向き合う開発者](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60)' },
      { after: 'この一連の作業に毎週約30分かかり、しかも金曜日の忙しい時間帯に行わなければなりません。「また報告書か…」とため息をつきながら、本来やるべき業務を中断して報告作業に取り組む。そんな週末が続いていました。さらに困るのは、急な会議や外出で金曜日に作業できなかった場合、週明けに「報告が遅れました」と謝罪しなければならないことです。', insert: '\n\n![スケジュール管理のイメージ](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60)' }
    ],
    linkFix: {
      old: '**今すぐTaskMateを始めませんか？**\n\nTaskMate公式LINEアカウント:  \nhttps://line.me/R/ti/p/@356uysad',
      new: '**今すぐTaskMateを始めませんか？**\n\n👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-success-small-wins.md',
    images: [
      { after: '![プログラミング学習のイメージ](https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60)', insert: '\n\n![成功を喜ぶ様子](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60)' },
      { after: 'この作業に毎週30分〜40分かかり、月曜の朝の貴重な時間が奪われていました。さらに、祝日で月曜が休みの場合は火曜に送り忘れたり、出張中に送れなかったりと、継続性の面でも課題がありました。', insert: '\n\n![データ分析のイメージ](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60)' }
    ],
    linkFix: {
      old: '**今すぐTaskMateを始めませんか？**\n\nTaskMate公式LINEアカウント:  \nhttps://line.me/R/ti/p/@356uysad',
      new: '**今すぐTaskMateを始めませんか？**\n\n👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  },
  {
    file: 'beginner-no-comparison-own-pace.md',
    images: [
      { after: '![プログラミング学習のイメージ](https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60)', insert: '\n\n![マイペースで学習する様子](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60)' },
      { after: 'この作業には毎週約90分かかり、月曜日の朝の貴重な時間が失われています。さらに、手作業のため転記ミスが発生することもあり、後から修正が必要になることも少なくありません。「もっと効率化できないだろうか」と思いながらも、プログラミングの知識がないため、どうすればいいのかわからず、毎週同じ作業を繰り返していました。', insert: '\n\n![売上グラフのイメージ](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60)' }
    ],
    linkFix: {
      old: '**今すぐTaskMateを始めませんか？**\n\nTaskMate公式LINEアカウント:\nhttps://line.me/R/ti/p/@356uysad',
      new: '**今すぐTaskMateを始めませんか？**\n\n👉 **[TaskMate 公式LINEはこちら](https://line.me/R/ti/p/@356uysad)**'
    }
  }
];

const postsDir = path.join(__dirname, '..', 'content', 'posts');

fixes.forEach(fix => {
  const filePath = path.join(postsDir, fix.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 画像を追加
  fix.images.forEach(img => {
    if (content.includes(img.after)) {
      content = content.replace(img.after, img.after + img.insert);
      console.log(`✅ ${fix.file}: 画像追加成功`);
    }
  });

  // LINEリンク修正
  if (fix.linkFix && content.includes(fix.linkFix.old)) {
    content = content.replace(fix.linkFix.old, fix.linkFix.new);
    console.log(`✅ ${fix.file}: LINEリンク修正成功`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${fix.file}: 完了\n`);
});

console.log('🎉 全記事の修正が完了しました！');
