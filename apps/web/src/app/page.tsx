import type { Metadata } from 'next';
import { About } from '@/components/About';
import { ContactCta } from '@/components/ContactCta';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Skills } from '@/components/Skills';
import { getProfile } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return { title: profile ? `${profile.name} | ${profile.title}` : 'Portfolio' };
}

export default async function Home() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-zinc-400">
          Profile unavailable. Check that the API is running and reload.
        </p>
      </main>
    );
  }

  return (
    <>
      <Nav name={profile.name} />
      <main>
        <Hero name={profile.name} title={profile.title} tagline={profile.tagline} />
        <FeaturedProjects />
        <About bio={profile.bio} />
        <Skills />
        <ContactCta />
      </main>
      <Footer name={profile.name} githubUrl={profile.githubUrl} />
    </>
  );
}