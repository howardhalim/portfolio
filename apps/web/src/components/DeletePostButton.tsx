'use client';

import { useState } from 'react';
import { deleteBlogPostAction } from '@/app/admin/blog/actions';

export function DeletePostButton({ id, title }: { id: number; title: string }) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError(null);

    const result = await deleteBlogPostAction(id);

    if (!result) {
      return;
    }

    setError(result.message);
    setDeleting(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={deleting}
        className="rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-700 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? 'Deleting...' : 'Delete post'}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}