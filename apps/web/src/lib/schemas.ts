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

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  bio: z.string(),
  githubUrl: z.string().nullable(),
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