import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetIntel - Production-Ready Network Intelligence SaaS',
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
      <body className={`${inter.className} min-h-screen bg-[#090D16] text-[#E2E8F0] flex flex-col antialiased relative overflow-x-hidden`}>
        {/* Glowing background highlights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none -z-10" />

        {/* Global Navigation Header */}
        <header className="border-b border-white/5 bg-[#0D1321]/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo / Brand */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 opacity-70 blur-sm group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-8 h-8 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-[#A5B4FC] bg-clip-text text-transparent">
                  NetIntel<span className="text-cyan-400 font-semibold">.SaaS</span>
                </span>
              </Link>

              {/* Navigation Links */}
              <nav className="flex space-x-1 sm:space-x-4">
                <Link href="/" className="px-3.5 py-1.5 rounded-lg text-sm font-medium hover:text-white hover:bg-white/5 transition-all duration-200">
                  Dashboard
                </Link>
                <Link href="/history" className="px-3.5 py-1.5 rounded-lg text-sm font-medium hover:text-white hover:bg-white/5 transition-all duration-200">
                  History
                </Link>
                <Link href="/analytics" className="px-3.5 py-1.5 rounded-lg text-sm font-medium hover:text-white hover:bg-white/5 transition-all duration-200">
                  Analytics
                </Link>
              </nav>

              {/* User badge */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  System Live
                </div>
                <div className="h-8 w-px bg-white/10" />
                <span className="text-xs text-slate-400 font-medium font-mono">guest-user-123</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 bg-[#0D1321]/40 py-6 mt-12 text-center text-xs text-slate-500">
          <p>© 2026 NetIntel SaaS. Powered by LibreSpeed Network Engine. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
