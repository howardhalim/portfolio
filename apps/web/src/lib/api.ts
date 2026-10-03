import { profileSchema, projectListSchema, projectSchema, type Profile, type Project } from './schemas';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8080';

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, { cache: 'no-store' });

    if (!response.ok) {
      console.error(`GET /api/profile failed with status ${response.status}`);
      return null;
    }

    return profileSchema.parse(await response.json());
  } catch (error) {
    console.error('Failed to fetch the profile from the API', error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, { cache: 'no-store' });

    if (!response.ok) {
      console.error(`GET /api/projects failed with status ${response.status}`);
      return [];
    }

    return projectListSchema.parse(await response.json());
  } catch (error) {
    console.error('Failed to fetch projects from the API', error);
    return [];
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`GET /api/projects/${slug} failed with status ${response.status}`);
      }
      return null;
    }

    return projectSchema.parse(await response.json());
  } catch (error) {
    console.error(`Failed to fetch project "${slug}" from the API`, error);
    return null;
  }
}