import { z } from 'zod';

export const projectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  repoUrl: z.string().nullable(),
  liveUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const projectListSchema = z.array(projectSchema);

export const profileLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  bio: z.string(),
  about: z.string(),
  githubUrl: z.string().nullable(),
  links: z.array(profileLinkSchema),
});

export type Profile = z.infer<typeof profileSchema>;

export const skillSchema = z.object({
  name: z.string(),
});

export type Skill = z.infer<typeof skillSchema>;

export const skillListSchema = z.array(skillSchema);

export const blogPostSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  publishedAt: z.string(),
});

export type BlogPostSummary = z.infer<typeof blogPostSummarySchema>;

export const blogPostSummaryListSchema = z.array(blogPostSummarySchema);

export const blogPostSchema = blogPostSummarySchema.extend({
  content: z.string(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

export const apiValidationErrorSchema = z.object({
  errors: z.record(z.string(), z.string()),
});

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form');
    if (!(field in result)) {
      result[field] = issue.message;
    }
  }
  return result;
}

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
  expiresInSeconds: z.number(),
});

export const adminIdentitySchema = z.object({
  username: z.string(),
  roles: z.array(z.string()),
});

export const adminBlogPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  published: z.boolean(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AdminBlogPost = z.infer<typeof adminBlogPostSchema>;

export const adminBlogPostListSchema = z.array(adminBlogPostSchema);

export const blogPostFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be at most 255 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  summary: z
    .string()
    .trim()
    .min(1, 'Summary is required')
    .max(1000, 'Summary must be at most 1000 characters'),
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(50000, 'Content must be at most 50000 characters'),
  published: z.boolean(),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;