'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Home,
  Target,
  ListChecks,
  BarChart,
  Megaphone,
  Users,
  PieChart,
  Calendar,
  BrainCircuit,
  Settings,
  HelpCircle,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

const MAIN: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/okr', label: 'OKR', icon: Target },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/crm', label: 'CRM', icon: BarChart },
  { href: '/marketing', label: 'Marketing', icon: Megaphone, badge: 'New' },
  { href: '/ads', label: 'Ads', icon: Megaphone },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: PieChart },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/ai', label: 'AI', icon: BrainCircuit },
];

const FOOTER: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // активность роутинга
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));

  // ширина и паддинги панелей
  const wide = isHovered;
  const asideWidth = wide ? 'w-64 px-3 md:px-4' : 'w-[56px] px-2';
  const align = wide ? 'items-start' : 'items-center';

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        // сдвигаем ниже фиксированного хедера (~64px)
        'fixed left-0 z-40 h-[calc(100vh-64px)] top-16',
        'border-r border-gray-200 bg-white/80 backdrop-blur-md shadow-sm',
        'transition-all duration-300 ease-out',
        'flex flex-col overflow-hidden',
        asideWidth,
      ].join(' ')}
      aria-label="Primary navigation"
    >
      {/* Основная навигация */}
      <nav className={`mt-3 flex flex-col gap-1 ${align} overflow-y-auto`}>
        {MAIN.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            expanded={wide}
          />
        ))}
      </nav>

      {/* Нижний блок */}
      <div className={`mt-auto pt-4 pb-3 border-t border-gray-100 ${align}`}>
        {FOOTER.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            expanded={wide}
          />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  expanded,
}: {
  item: NavItem;
  active: boolean;
  expanded: boolean;
}) {
  const Icon = item.icon;

  const className = useMemo(
    () =>
      [
        'group relative w-full rounded-lg',
        'transition-colors duration-200',
        'flex items-center gap-3',
        expanded ? 'px-3 py-2' : 'px-2 py-2 justify-center',
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-100'
          : 'text-gray-700 hover:bg-gray-100/70',
      ].join(' '),
    [expanded, active]
  );

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={active ? 'page' : undefined}
      title={!expanded ? item.label : undefined} // тултип при свёрнутом
    >
      <Icon
        className={active ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}
        size={18}
        aria-hidden="true"
      />
      {expanded && (
        <span className="text-sm truncate">
          {item.label}{' '}
          {item.badge && (
            <span className="ml-2 align-middle text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {item.badge}
            </span>
          )}
        </span>
      )}

      {/* Акцентная полоса слева (в расширенном виде) */}
      {expanded && active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded bg-blue-600" />
      )}
    </Link>
  );
}