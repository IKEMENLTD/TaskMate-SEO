import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';

export default function PostsPage() {
    const allPosts = getAllPosts();

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        記事<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">一覧</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        TaskMateAIの全記事を検索・閲覧できます。<br />
                        業務効率化やAI活用のヒントを見つけてください。
                    </p>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-slate-400 text-sm">
                    {allPosts.length}件の記事
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPosts.map((post) => (
                        <Link
                            href={`/posts/${post.slug}`}
                            key={post.slug}
                            className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                <Image
                                    src={post.slug.includes('beginner') ? "/img-beginner.png" :
                                        post.slug.includes('ai') ? "/img-ai-tools.png" : "/img-cio.png"}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-sm">
                                        {post.slug.includes('beginner') ? '初心者向け' :
                                            post.slug.includes('ai') ? 'AI活用' : '業務効率化'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-xs text-slate-400 mb-3">
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {post.date}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                    {post.description}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
                                        <span className="text-xs text-slate-300 font-medium">TaskMate編集部</span>
                                    </div>
                                    <svg className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
