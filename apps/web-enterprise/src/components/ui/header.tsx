'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Menu, Search, Bell, Calendar, MessageSquare, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronsUpDown } from 'lucide-react'
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import { CompanyAPI } from '@/lib/api/company';

type HeaderProps = {
  /** Опционально: хендлер для открытия мобильного сайдбара */
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!user) {
          setCompanyName(null);
          return;
        }
        const company = await CompanyAPI.getCurrentCompany();
        if (isMounted) setCompanyName(company?.name ?? null);
      } catch {
        if (isMounted) setCompanyName(null);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Бургер (моб.) */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Логотип */}
          <Link href="/dashboard" className="flex items-center space-x-2 select-none">
            <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-2xl font-bold">Liderix</span>
          </Link>

          {/* Поиск (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="flex items-center w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-md">
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Правый блок действий */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('/calendar')}
                  aria-label="Calendar"
                  title="Calendar"
                >
                  <Calendar size={18} className="text-gray-600" />
                </button>

                <button
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('/ai/chat')}
                  aria-label="AI Chat"
                  title="AI Chat"
                >
                  <MessageSquare size={18} className="text-gray-600" />
                </button>

                <div className="relative">
                  <button
                    className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell size={18} className="text-gray-600" />
                  </button>
                  <span className="absolute -top-1 -right-1 bg-blue-300 text-xs font-bold rounded-full px-[6px] text-black">
                    5
                  </span>
                </div>

                {/* User/Org dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 transition-colors"
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(user.full_name || user.email || '?')
                            .split(' ')
                            .map((s) => s[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start leading-tight max-w-[180px]">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {user.full_name || user.email}
                        </span>
                        {companyName ? (
                          <span className="text-xs text-gray-500 truncate" title={companyName}>
                            {companyName}
                          </span>
                        ) : null}
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-gray-500 hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {(user.full_name || user.email || '?')
                              .split(' ')
                              .map((s) => s[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium leading-tight truncate">
                            {user.full_name || user.email}
                          </div>
                          {companyName ? (
                            <div className="text-xs text-gray-500 truncate" title={companyName}>
                              {companyName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Профиль</span>
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/organization')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Организация</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Настройки</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await logout();
                        } catch {
                          // ignore; state handled in useAuth
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Выйти</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Unauthenticated: show quick links */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Поиск (mobile) */}
      <div className="px-4 md:px-6 pb-3 lg:hidden">
        <div className="flex items-center w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-md">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>
    </header>
  );
}