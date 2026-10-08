import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/api';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back home
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-50">Blog</h1>
        <p className="mt-2 text-zinc-400">Notes on what I&apos;m building and learning.</p>

        {posts.length > 0 ? (
          <ul className="mt-10 divide-y divide-zinc-900">
            {posts.map((post) => (
              <li key={post.slug} className="py-6">
                <p className="text-sm text-zinc-500">{formatDate(post.publishedAt)}</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-50">
                  <Link href={`/blog/${post.slug}`} className="hover:text-indigo-300">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-zinc-400">{post.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-sm text-zinc-500">No posts yet.</p>
        )}
      </div>
    </main>
  );
}