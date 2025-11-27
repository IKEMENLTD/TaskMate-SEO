'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';

export default function PostsPage() {
    const allPosts = getAllPosts();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter posts based on search and category
    const filteredPosts = useMemo(() => {
        return allPosts.filter(post => {
            const matchesSearch = searchQuery === '' ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'all' ||
                (selectedCategory === 'beginner' && post.slug.includes('beginner')) ||
                (selectedCategory === 'automation' && (post.slug.includes('automation') || post.slug.includes('gas'))) ||
                (selectedCategory === 'ai' && post.slug.includes('ai'));

            return matchesSearch && matchesCategory;
        });
    }, [allPosts, searchQuery, selectedCategory]);

    const categories = [
        { id: 'all', label: 'すべて', count: allPosts.length },
        { id: 'beginner', label: '初心者向け', count: allPosts.filter(p => p.slug.includes('beginner')).length },
        { id: 'automation', label: '業務自動化', count: allPosts.filter(p => p.slug.includes('automation') || p.slug.includes('gas')).length },
        { id: 'ai', label: 'AI活用', count: allPosts.filter(p => p.slug.includes('ai')).length },
    ];

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

                {/* Search and Filter Section */}
                <div className="glass-panel rounded-2xl p-6 mb-12 border border-emerald-500/20">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="記事を検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-4 pl-12 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedCategory === category.id
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                                    }`}
                            >
                                {category.label}
                                <span className="ml-2 text-xs opacity-70">({category.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-slate-400 text-sm">
                    {filteredPosts.length}件の記事が見つかりました
                </div>

                {/* Articles Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
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
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
                            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">記事が見つかりませんでした</h3>
                        <p className="text-slate-400 mb-6">検索条件を変更してみてください</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors"
                        >
                            フィルターをリセット
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
