import { headers } from 'next/headers';
import SetupPage from '@/components/Setup';

async function getIsLogged() {
  const response = await fetch('http://localhost:3000/api/auth', {
    headers: new Headers({
      cookie: headers().get('cookie') ?? '',
    }),
  });

  if (!response.ok) return false;
  const body = await response.json();

  return body.isLogged ?? false;
}

export default async function Setup() {
  const isLogged = await getIsLogged();

  return <SetupPage isLogged={isLogged} />;
};
