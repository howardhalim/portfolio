'use client';

import { useState, type FormEvent } from 'react';
import { loginAction } from '@/app/admin/actions';
import { adminLoginSchema, toFieldErrors } from '@/lib/schemas';

const inputClass =
  'mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400 focus:outline-none';

export function LoginForm({ expired }: { expired: boolean }) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(
    expired ? 'Your session expired. Please sign in again.' : null,
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const parsed = adminLoginSchema.safeParse({
      username: String(data.get('username') ?? ''),
      password: String(data.get('password') ?? ''),
    });

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const result = await loginAction(parsed.data);

    setFormError(result.message);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          aria-invalid={Boolean(fieldErrors.username)}
          className={inputClass}
        />
        {fieldErrors.username && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {fieldErrors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(fieldErrors.password)}
          className={inputClass}
        />
        {fieldErrors.password && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red-400">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}