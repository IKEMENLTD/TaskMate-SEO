import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">TaskMateAI ブログ</h1>
        <p className="text-gray-600 mb-8">
          タスク管理とAIに関する最新情報をお届けします
        </p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <article className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                <h2 className="text-2xl font-semibold mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.description}
                </p>
                <span className="text-sm text-gray-500">{post.date}</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
