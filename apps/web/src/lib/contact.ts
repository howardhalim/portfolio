import { API_BASE_URL } from './api';
import { apiValidationErrorSchema, type ContactFormInput } from './schemas';

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR = 'Something went wrong. Please try again later.';

export async function submitContactMessage(input: ContactFormInput): Promise<ContactResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    if (response.status === 201) {
      return { ok: true };
    }

    if (response.status === 400) {
      const body = apiValidationErrorSchema.safeParse(await response.json());
      return {
        ok: false,
        message: 'Please fix the highlighted fields.',
        fieldErrors: body.success ? body.data.errors : undefined,
      };
    }

    console.error(`POST /api/contact failed with status ${response.status}`);
    return { ok: false, message: GENERIC_ERROR };
  } catch (error) {
    console.error('Failed to send the contact message to the API', error);
    return { ok: false, message: GENERIC_ERROR };
  }
}