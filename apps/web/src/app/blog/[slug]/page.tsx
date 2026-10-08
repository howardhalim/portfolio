import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/api';
import { formatDate } from '@/lib/format';

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  return post
    ? { title: post.title, description: post.summary }
    : { title: 'Post not found' };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="px-6 pb-24 pt-32">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← All posts
        </Link>
        <p className="mt-6 text-sm text-zinc-500">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-50">{post.title}</h1>
        <p className="mt-4 text-lg text-zinc-400">{post.summary}</p>
        <div className="mt-10 whitespace-pre-line leading-7 text-zinc-300">{post.content}</div>
      </article>
    </main>
  );
}