import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  contentHtml?: string;
}

export function getAllPosts(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // date フィールドを安全に処理
    let dateValue = '2024-01-01'; // デフォルト値
    if (matterResult.data.date) {
      if (typeof matterResult.data.date === 'string') {
        dateValue = matterResult.data.date;
      } else if (matterResult.data.date.toISOString) {
        dateValue = matterResult.data.date.toISOString().split('T')[0];
      }
    }

    return {
      slug,
      title: matterResult.data.title || '',
      date: dateValue,
      description: matterResult.data.description || '',
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // date フィールドを安全に処理
  let dateValue = '2024-01-01'; // デフォルト値
  if (matterResult.data.date) {
    if (typeof matterResult.data.date === 'string') {
      dateValue = matterResult.data.date;
    } else if (matterResult.data.date.toISOString) {
      dateValue = matterResult.data.date.toISOString().split('T')[0];
    }
  }

  return {
    slug,
    title: matterResult.data.title || '',
    date: dateValue,
    description: matterResult.data.description || '',
    contentHtml,
  };
}
