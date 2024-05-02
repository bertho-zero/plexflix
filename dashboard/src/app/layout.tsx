import type { Viewport } from 'next'
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Plexflix',
  description: '',
};

export default async function RootLayout({ children, ...rest }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        {/*<meta name="viewport" content="" />*/}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
