'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteAdminBlogPost, saveAdminBlogPost, type SaveFailure } from '@/lib/admin-api';
import { blogPostFormSchema, toFieldErrors, type BlogPostFormInput } from '@/lib/schemas';

export async function saveBlogPostAction(
  id: number | null,
  input: BlogPostFormInput,
): Promise<SaveFailure | undefined> {
  const parsed = blogPostFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please fix the highlighted fields.',
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const result = await saveAdminBlogPost(id, parsed.data);

  if (!result.ok) {
    return result;
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(
  id: number,
): Promise<{ ok: false; message: string } | undefined> {
  const result = await deleteAdminBlogPost(id);

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}