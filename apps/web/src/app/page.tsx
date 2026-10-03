import { About } from '@/components/About';
import { ContactCta } from '@/components/ContactCta';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { Hero } from '@/components/Hero';
import { Skills } from '@/components/Skills';
import { getProfile } from '@/lib/api';

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
    <main>
      <Hero name={profile.name} title={profile.title} tagline={profile.tagline} />
      <FeaturedProjects />
      <About bio={profile.bio} />
      <Skills />
      <ContactCta />
    </main>
  );
}