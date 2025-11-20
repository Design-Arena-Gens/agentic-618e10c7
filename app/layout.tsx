import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkedIn Post Agent',
  description: 'Generate high-performing LinkedIn posts with control over tone, hooks, and CTAs.',
  metadataBase: new URL('https://agentic-618e10c7.vercel.app'),
  openGraph: {
    title: 'LinkedIn Post Agent',
    description: 'Generate high-performing LinkedIn posts with control over tone, hooks, and CTAs.',
    url: 'https://agentic-618e10c7.vercel.app',
    siteName: 'LinkedIn Post Agent',
    images: [],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
