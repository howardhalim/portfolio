'use client';

import { useState, type FormEvent } from 'react';
import { submitContact } from '@/app/contact/actions';
import { contactFormSchema, toFieldErrors } from '@/lib/schemas';

type Status = 'idle' | 'submitting' | 'success';

const inputClass =
  'mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-400 focus:outline-none';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const parsed = contactFormSchema.safeParse({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setStatus('submitting');

    const result = await submitContact(parsed.data);

    if (result.ok) {
      form.reset();
      setStatus('success');
      return;
    }

    setFieldErrors(result.fieldErrors ?? {});
    setFormError(result.message);
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="font-medium text-zinc-50">Thanks, your message was sent.</p>
        <p className="mt-2 text-sm text-zinc-400">I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          className={inputClass}
        />
        {fieldErrors.name && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          className={inputClass}
        />
        {fieldErrors.email && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={Boolean(fieldErrors.message)}
          className={inputClass}
        />
        {fieldErrors.message && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {fieldErrors.message}
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
        disabled={status === 'submitting'}
        className="rounded-md bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}