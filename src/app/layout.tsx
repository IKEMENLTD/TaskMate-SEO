import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "TaskMateAI ブログ - AIとタスク管理の情報メディア",
    template: "%s | TaskMateAI ブログ"
  },
  description: "タスク管理の効率化とAI活用に関する最新情報をお届けするブログです。生産性向上のヒントやテクニックを定期的に発信しています。",
  keywords: ["TaskMateAI", "タスク管理", "AI", "生産性", "効率化", "タイムマネジメント", "仕事術"],
  authors: [{ name: "TaskMateAI Team" }],
  creator: "TaskMateAI",
  publisher: "TaskMateAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://taskmateai.net/blog'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TaskMateAI ブログ - AIとタスク管理の情報メディア",
    description: "タスク管理の効率化とAI活用に関する最新情報をお届けするブログです",
    url: 'https://taskmateai.net/blog',
    siteName: 'TaskMateAI ブログ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TaskMateAI ブログ",
    description: "タスク管理の効率化とAI活用に関する最新情報",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'TaskMateAI ブログ',
    description: 'タスク管理とAIに関する情報メディア',
    url: 'https://taskmateai.net/blog',
    publisher: {
      '@type': 'Organization',
      name: 'TaskMateAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://taskmateai.net/logo.png'
      }
    },
    inLanguage: 'ja-JP',
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/blog/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
