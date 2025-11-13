import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative gradient-green-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* 背景動画 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.12 }}
        >
          <source src="/TOPMOVIE.mp4" type="video/mp4" />
        </video>
        <div className="relative container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">TaskMateAI ブログ</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed">
              タスク管理の効率化とAI活用に関する最新情報をお届けします
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#featured"
                className="btn-primary"
              >
                最新記事を読む
              </Link>
              <a
                href="https://taskmateai.net"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                TaskMateAIを見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* プログラミング初心者向け特集セクション */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 gradient-green rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">初心者が最初に読むべき記事</span>
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              エラーに悩む全てのプログラミング初心者へ。挫折しないための必読記事をご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* 記事1: 完璧なコードなんて存在しない */}
            <Link href="/posts/beginner-perfect-code-myth">
              <article className="group article-card h-full flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-transparent hover:border-emerald-400">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                    必読
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    完璧なコードなんて存在しない
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-4 flex-1 text-sm leading-relaxed">
                    完璧主義の不安を解消。&quot;動けばOK&quot;から始める実践的プログラミングのマインドセットを学びます。
                  </p>
                  <div className="inline-flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:gap-2 gap-1 transition-all mt-auto">
                    今すぐ読む
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>

            {/* 記事2: エラーが出た…もうダメだと思ったあなたへ */}
            <Link href="/posts/beginner-error-mindset-first-truth">
              <article className="group article-card h-full flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-transparent hover:border-emerald-400">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                    必読
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    エラーが出た…もうダメだと思ったあなたへ
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-4 flex-1 text-sm leading-relaxed">
                    エラーへの恐怖を克服。初心者が最初に知るべきプログラミングの真実をお伝えします。
                  </p>
                  <div className="inline-flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:gap-2 gap-1 transition-all mt-auto">
                    今すぐ読む
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>

            {/* 記事3: エラー10回は普通です */}
            <Link href="/posts/beginner-error-ten-times-normal">
              <article className="group article-card h-full flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-transparent hover:border-emerald-400">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                    必読
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    エラー10回は普通です
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-4 flex-1 text-sm leading-relaxed">
                    ベテランエンジニアも毎日エラーと戦っている現実。エラーは成長の証です。
                  </p>
                  <div className="inline-flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:gap-2 gap-1 transition-all mt-auto">
                    今すぐ読む
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">
              この3つの記事を読めば、エラーが怖くなくなります
            </p>
          </div>
        </div>
      </section>

      {/* おすすめ記事セクション - CIO記事 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">おすすめ記事</span>
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              中小企業のDX推進に必読。月1万円でCIOを常駐させる革新的な方法をご紹介します。
            </p>
          </div>

          <Link href="/posts/cio-taskmate-automation-2025-11-11">
            <article className="group article-card h-full flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-transparent hover:border-purple-400">
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                  おすすめ
                </span>
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                  【2025年版】月1万円でCIO（最高情報責任者）を常駐させる方法｜中小企業のDX革命
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-6 flex-1 text-base leading-relaxed">
                  年収800万円〜1,200万円のCIOを月1万円で実現。TaskMateなら、プログラミング不要でスプレッドシート業務を完全自動化。売上集計、在庫管理、月次レポートが自動化される3つの実例を徹底解説します。
                </p>
                <div className="inline-flex items-center text-[var(--color-primary)] font-semibold text-base group-hover:gap-3 gap-2 transition-all mt-auto">
                  続きを読む
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* 最新記事セクション */}
      {featuredPost && (
        <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="gradient-text">最新記事</span>
            </h2>
            <Link href={`/posts/${featuredPost.slug}`}>
              <article className="group article-card glass-card-hover">
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge-green pulse-green">
                    NEW
                  </span>
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-4 text-sm text-[var(--color-text-secondary)]">
                    <time dateTime={featuredPost.date} className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {featuredPost.date}
                    </time>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                    {featuredPost.description}
                  </p>
                  <div className="inline-flex items-center text-[var(--color-primary)] font-semibold group-hover:gap-3 gap-2 transition-all">
                    続きを読む
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* 最近の記事セクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="gradient-text">最近の記事</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
                <article
                  className="group article-card h-full flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3 text-sm text-[var(--color-text-secondary)]">
                      <time dateTime={post.date} className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {post.date}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-3 flex-1">
                      {post.description}
                    </p>
                    <div className="inline-flex items-center text-[var(--color-primary)] font-medium text-sm group-hover:gap-2 gap-1 transition-all mt-auto">
                      続きを読む
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 gradient-green text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, transparent 48%, white 48%, white 52%, transparent 52%)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">タスク管理を次のレベルへ</h2>
          <p className="text-xl mb-8 opacity-90">
            TaskMateAIで、あなたの生産性を最大化しましょう
          </p>
          <a
            href="https://taskmateai.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-[var(--color-primary)] font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all hover:scale-105"
          >
            今すぐ始める
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
