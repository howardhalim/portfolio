'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { saveBlogPostAction } from '@/app/admin/blog/actions';
import { blogPostFormSchema, toFieldErrors, type AdminBlogPost } from '@/lib/schemas';
import Link from 'next/link';

const inputClass =
  'mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400 focus:outline-none';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-200">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function BlogPostForm({ post }: { post?: AdminBlogPost }) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = blogPostFormSchema.safeParse({ slug, title, summary, content, published });

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const result = await saveBlogPostAction(post?.id ?? null, parsed.data);

    if (!result) {
      return;
    }

    setFieldErrors(result.fieldErrors ?? {});
    setFormError(result.message);
    setSubmitting(false);
  }

  const slugHint =
    post?.published && slug !== post.slug
      ? 'Warning: this post is published. Changing the slug changes its URL and breaks existing links.'
      : `Used in the URL: /blog/${slug || 'your-slug'}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      <Field label="Title" htmlFor="title" error={fieldErrors.title}>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          className={inputClass}
        />
      </Field>

      <Field label="Slug" htmlFor="slug" error={fieldErrors.slug} hint={slugHint}>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setSlugEdited(true);
          }}
          aria-invalid={Boolean(fieldErrors.slug)}
          className={inputClass}
        />
      </Field>

      <Field label="Summary" htmlFor="summary" error={fieldErrors.summary}>
        <textarea
          id="summary"
          rows={3}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          aria-invalid={Boolean(fieldErrors.summary)}
          className={inputClass}
        />
      </Field>

      <Field label="Content" htmlFor="content" error={fieldErrors.content}>
        <textarea
          id="content"
          rows={16}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          aria-invalid={Boolean(fieldErrors.content)}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-3 text-sm text-zinc-200">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900"
        />
        Published (visible on the public blog)
      </label>

      {formError && (
        <p role="alert" className="text-sm text-red-400">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : post ? 'Save changes' : 'Create post'}
        </button>
        <Link href="/admin/blog" className="text-sm text-zinc-400 hover:text-zinc-100">
          Cancel
        </Link>
      </div>
    </form>
  );
}