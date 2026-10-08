'use server';

import { submitContactMessage, type ContactResult } from '@/lib/contact';
import { contactFormSchema, toFieldErrors, type ContactFormInput } from '@/lib/schemas';

export async function submitContact(input: ContactFormInput): Promise<ContactResult> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please fix the highlighted fields.',
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  return submitContactMessage(parsed.data);
}