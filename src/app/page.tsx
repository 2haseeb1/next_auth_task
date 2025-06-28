// src/app/page.tsx
// This is now a Server Component.

import HeroSection from '@/components/home/HeroSection';
import { auth } from '@/lib/auth.server'; // <<<--- CORRECTED IMPORT for auth
import type { Session } from '@/types/auth'; // <<<--- CORRECTED IMPORT for Session type
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to SparkBoard - Your Idea Management Hub',
  description: 'SparkBoard helps you manage and track your ideas, projects, and tasks with ease.',
};

export default async function Home() {
  const session: Session | null = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <HeroSection session={session} />
    </main>
  );
}