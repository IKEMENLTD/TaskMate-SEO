import { getPostData, getAllPosts } from '@/lib/posts';
import Link from 'next/link';

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

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← ブログ一覧に戻る
        </Link>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-8">{post.date}</p>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </article>
      </div>
    </main>
  );
}
