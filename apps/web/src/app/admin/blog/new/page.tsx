import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogPostForm } from '@/components/BlogPostForm';

export const metadata: Metadata = { title: 'New post' };

export default function NewBlogPostPage() {
  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/blog" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Blog posts
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-50">New post</h1>
        <BlogPostForm />
      </div>
    </main>
  );
}