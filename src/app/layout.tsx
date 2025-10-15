import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskMateAI ブログ - AIとタスク管理の情報メディア",
  description: "タスク管理の効率化とAI活用に関する最新情報をお届けするブログです",
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
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
