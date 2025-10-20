import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--background-secondary)] mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランドセクション */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg gradient-text">
                TaskMateAI ブログ
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-secondary)] max-w-md mb-4">
              タスク管理の効率化とAI活用に関する最新情報をお届けするブログです。生産性向上のヒントやテクニックを定期的に発信しています。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* リンク集1 */}
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-4">コンテンツ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  記事一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  人気記事
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  カテゴリー
                </Link>
              </li>
            </ul>
          </div>

          {/* リンク集2 */}
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-4">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://taskmateai.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  TaskMateAI
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[var(--foreground-secondary)]">
            <p>© {currentYear} TaskMateAI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Made with{' '}
              <span className="text-red-500" aria-label="love">
                ❤️
              </span>{' '}
              using Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
