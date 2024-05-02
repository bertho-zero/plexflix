import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getSettings } from '@/lib/settings';

const COOKIE_NAME = 'plexflix-jwt-token';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request) {
  const settings = getSettings();
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
  }

  try {
    jwt.verify(token.value, settings.main.jwtSecret);
    return NextResponse.json({ isLogged: true });
  } catch {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
  }
}

export async function POST(request: Request) {
  const settings = getSettings();
  const body = await request.json();

  if (!settings.main.password?.length) {
    return NextResponse.json({ error: 'Password sign-in is disabled.' }, { status: 500 });
  }
  if (!body.password) {
    return NextResponse.json({ error: 'You must provide a password.' }, { status: 500 });
  }

  if (body.password !== settings.main.password) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
  }

  try {
    const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7d
    const token = jwt.sign(
      { exp },
      settings.main.jwtSecret,
    );

    const response = NextResponse.json({ token });
    response.cookies.set(COOKIE_NAME, token, { expires: exp * 1000 });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Cannot generate JWT token.' }, { status: 500 });
  }
}
