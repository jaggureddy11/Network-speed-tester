import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NST for TAB',
  description: 'Track download speed, upload speed, ping, and jitter with real-time analytics and AI-driven connection insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Load LibreSpeed core script before the page mounts */}
        <Script src="/librespeed/speedtest.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-[#334155] flex flex-col antialiased relative overflow-x-hidden`}>
        
        {/* Global Navigation Header */}
        <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo / Brand */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 border border-blue-700 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  NST<span className="text-blue-600 font-semibold"> for TAB</span>
                </span>
              </Link>

              {/* Navigation Links */}
              <nav className="flex space-x-1 sm:space-x-4">
                <Link href="/" className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-150">
                  Dashboard
                </Link>
                <Link href="/history" className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-150">
                  History
                </Link>
                <Link href="/analytics" className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-150">
                  Analytics
                </Link>
              </nav>

              {/* User badge */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  System Live
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <span className="text-xs text-slate-500 font-medium font-mono">guest-user-123</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <p>© 2026 NST for TAB. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
