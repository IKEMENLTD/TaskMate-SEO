import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 mr-3 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="TaskMateAI Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              TaskMate<span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              ホーム
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/posts" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              記事一覧
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="https://taskmateai.net" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              公式サイト
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="https://taskmateai.net"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              無料で始める
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-slate-300 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
