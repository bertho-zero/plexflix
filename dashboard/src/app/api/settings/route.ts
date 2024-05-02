import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const settings = getSettings();

  console.log('settings', settings);

  return NextResponse.json(settings);
}
