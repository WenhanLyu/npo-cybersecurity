import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'VA NPO Inspector',
  description: 'VA NPO Inspector',
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang={'en'}>
      <body className={inter.className}>{children}</body>
      </html>
  );
}
