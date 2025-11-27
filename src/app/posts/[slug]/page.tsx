import { getPostData, getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['TaskMateAI Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = await getPostData(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'TaskMateAI',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TaskMateAI',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* パンくずナビゲーション */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-slate-900 font-medium" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* 記事ヘッダー */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900" style={{ wordBreak: 'keep-all', lineBreak: 'strict', overflowWrap: 'break-word' }}>
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-slate-500">
              <time dateTime={post.date} className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.date}
              </time>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                TaskMateAI Team
              </div>
            </div>
          </header>

          {/* 記事コンテンツ */}
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-8 sm:px-6 sm:py-10 md:px-16 md:py-14 shadow-xl shadow-slate-200/50 mb-12">
            <div
              className="markdown-content-light"
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            />
          </div>

          {/* ソーシャルシェア */}
          <div className="flex items-center justify-center gap-4 mb-12 pb-12 border-b border-slate-200">
            <span className="text-slate-600 font-medium">この記事をシェア:</span>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://taskmateai.net/blog/posts/' + slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Twitter でシェア"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://taskmateai.net/blog/posts/' + slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook でシェア"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 戻るリンク */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-emerald-500 transform hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              記事一覧に戻る
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
