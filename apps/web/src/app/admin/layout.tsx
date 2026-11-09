import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isAdminEnabled } from '@/lib/admin-config';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminEnabled()) {
    notFound();
  }

  return <>{children}</>;
}
