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

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be at most 2000 characters'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

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