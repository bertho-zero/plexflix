import { redirect } from 'next/navigation';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

async function getSettings() {
  const res = await fetch('http://localhost:3000/api/settings');

  if (!res.ok) {
    throw new Error('Failed to fetch settings')
  }

  return res.json();
}

export default async function Home() {
  const settings = await getSettings();

  // if (!settings.initialized) {
  //   return redirect('/setup');
  // }

  return <HomePage />;
}
