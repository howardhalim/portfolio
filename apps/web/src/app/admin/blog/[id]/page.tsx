import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPostForm } from '@/components/BlogPostForm';
import { DeletePostButton } from '@/components/DeletePostButton';
import { getAdminBlogPost } from '@/lib/admin-api';

export const metadata: Metadata = { title: 'Edit post' };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const post = await getAdminBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/blog" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Blog posts
        </Link>
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Edit post</h1>
          {post.published && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              View on site →
            </Link>
          )}
        </div>

        <BlogPostForm post={post} />

        <div className="mt-12 border-t border-zinc-900 pt-8">
          <DeletePostButton id={post.id} title={post.title} />
        </div>
      </div>
    </main>
  );
}