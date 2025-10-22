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

      {/* 注目記事セクション */}
      {featuredPost && (
        <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="gradient-text">注目の記事</span>
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
