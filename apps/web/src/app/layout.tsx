import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { getProfile } from '@/lib/api';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return { title: 'Portfolio' };

  return {
    title: { default: `${profile.name} | ${profile.title}`, template: `%s | ${profile.name}` },
    description: profile.tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 font-sans text-zinc-100 antialiased">
        {profile && <Nav name={profile.name} />}
        {children}
        {profile && <Footer name={profile.name} githubUrl={profile.githubUrl} />}
      </body>
    </html>
  );
}