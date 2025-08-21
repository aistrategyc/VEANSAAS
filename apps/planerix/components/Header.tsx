'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/features', label: 'Features' },
  { href: '/modules', label: 'Modules' },
  { href: '/platform', label: 'Platform' },
  { href: '/ai-agents', label: 'AI Agents' },
  { href: '/automation', label: 'Automation' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/pricing', label: 'Pricing' },
];

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.planerix.com';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const loginUrl = `${APP_ORIGIN}/login`;
  const registerUrl = `${APP_ORIGIN}/register`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-2xl font-bold">Liderix</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`transition-colors ${
                  pathname === i.href ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {i.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Внешние ссылки на web-enterprise */}
            <Link
              href={loginUrl}
              prefetch={false}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={registerUrl}
              prefetch={false}
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign up
            </Link>
            <Link
              href="/#contact"
              className="bg-blue-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-blue-400 transition-all duration-300 transform hover:scale-105"
            >
              Request access
            </Link>
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-4 space-y-4">
            {NAV.map((i) => (
              <Link key={i.href} href={i.href} className="block text-gray-700 hover:text-gray-900 transition-colors">
                {i.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href={loginUrl} prefetch={false} className="block text-gray-700">
              Sign in
            </Link>
            <Link href={registerUrl} prefetch={false} className="block text-gray-700">
              Sign up
            </Link>
            <Link
              href="/#contact"
              className="block text-center bg-blue-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-blue-400 transition-all duration-300"
            >
              Request access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}