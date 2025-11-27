import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';

export default function Home() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* 背景動画 */}
        <div className="absolute inset-0 z-0 opacity-[0.1]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/TOPMOVIE.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-8 animate-fade-in-up backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            AI時代の新しい働き方を探求する
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up animation-delay-100">
            <span className="block text-white mb-2">AIと共創する</span>
            <span className="text-gradient">知的生産の未来</span>
          </h1>
          <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
            TaskMateAIは、最新のAIツール活用法とタスク管理のベストプラクティスを発信する
            テックブログです。あなたの生産性を次のレベルへ。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link
              href="#featured"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-emerald-600 border border-transparent rounded-xl hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              最新記事を読む
            </Link>
            <a
              href="https://taskmateai.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-emerald-300 transition-all duration-200 bg-emerald-900/20 border border-emerald-500/30 rounded-xl hover:bg-emerald-900/40 hover:text-emerald-200 hover:-translate-y-1 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              公式サイトへ
              <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* 装飾的な背景要素 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      </section>

      {/* プログラミング初心者向け特集 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Beginner <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Recommended</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              プログラミングを始めたばかりのあなたへ。<br />
              技術よりも大切な「マインドセット」と「最初の一歩」について。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.filter(post => [
              'beginner-error-ten-times-normal',
              'beginner-error-mindset-first-truth',
              'beginner-perfect-code-myth'
            ].includes(post.slug)).map((post, index) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="glass-card rounded-2xl p-0 group block h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                  {/* 画像のプレースホルダー */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-slate-900/50 flex items-center justify-center">
                    <span className="text-4xl">🔰</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-emerald-400 text-sm font-medium px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/20">
                      Beginner
                    </span>
                    <time className="text-slate-500 text-sm font-mono">{post.date}</time>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最新記事（Featured Post） */}
      {
        featuredPost && (
          <section id="featured" className="py-24 relative">
            <div className="absolute inset-0 bg-emerald-900/10 skew-y-3 transform origin-bottom-right pointer-events-none"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="glass-panel rounded-3xl p-8 md:p-12 border border-emerald-500/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-6 border border-emerald-500/30">
                      NEW ARRIVAL
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed line-clamp-3">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center gap-4 mb-8 text-sm text-slate-400">
                      <time dateTime={featuredPost.date} className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {featuredPost.date}
                      </time>
                    </div>
                    <Link
                      href={`/posts/${featuredPost.slug}`}
                      className="inline-flex items-center px-6 py-3 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:-translate-y-1"
                    >
                      記事を読む
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20 relative group">
                      <Image
                        src="/img-cio.png"
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-slate-900/40 mix-blend-multiply z-10"></div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-500/20 rounded-full blur-xl animate-pulse-slow animation-delay-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* 最近の記事一覧 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Recent Articles</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full">
                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                  <Image
                    src={index % 2 === 0 ? "/img-ai-tools.png" : "/img-beginner.png"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-sm">
                      Article
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-slate-400 mb-3 space-x-2">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
                      <span className="text-xs text-slate-300 font-medium">TaskMate編集部</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 z-0"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            あなたの生産性を<br className="md:hidden" />最大化しよう
          </h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            TaskMateAIの最新情報や限定コンテンツをお届けします。<br />
            今すぐニュースレターに登録して、AI活用術をマスターしましょう。
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-emerald-500/30 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
            />
            <button
              type="button"
              className="px-8 py-3 font-bold text-emerald-900 bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-900/20"
            >
              登録する
            </button>
          </form>
          <p className="text-emerald-200/60 text-xs mt-4">
            ※いつでも解除可能です。プライバシーポリシーをご確認ください。
          </p>
        </div>
      </section>
    </div >
  );
}
