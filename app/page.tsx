import Link from 'next/link';
import HomeClient from '@/components/HomeClient';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-blue-600 text-white grid place-items-center font-bold">in</div>
            <h1 className="text-xl font-semibold">LinkedIn Post Agent</h1>
          </div>
          <nav className="text-sm text-gray-600 flex items-center gap-4">
            <Link href="https://www.linkedin.com/" target="_blank" className="hover:text-gray-900">LinkedIn</Link>
            <Link href="https://vercel.com" target="_blank" className="hover:text-gray-900">Vercel</Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <HomeClient />
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-500">Built for creating engaging LinkedIn posts.</footer>
    </main>
  );
}
