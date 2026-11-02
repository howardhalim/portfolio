import type { Metadata } from 'next';
import Link from 'next/link';
import { listAdminBlogPosts } from '@/lib/admin-api';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Manage blog' };

export default async function AdminBlogPage() {
  const posts = await listAdminBlogPosts();

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Admin
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Blog posts</h1>
          <Link
            href="/admin/blog/new"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            New post
          </Link>
        </div>

        {posts === null ? (
          <p className="mt-10 text-sm text-red-400">
            Could not load the posts. Check that the API is running and reload.
          </p>
        ) : posts.length === 0 ? (
          <p className="mt-10 text-sm text-zinc-500">No posts yet.</p>
        ) : (
          <ul className="mt-10 divide-y divide-zinc-900">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="block truncate font-medium text-zinc-100 hover:text-indigo-300"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    /{post.slug} · updated {formatDate(post.updatedAt)}
                  </p>
                </div>
                <span
                  className={
                    post.published
                      ? 'shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400'
                      : 'shrink-0 rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400'
                  }
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}