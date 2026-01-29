'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Award,
  User,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@reeduca/ui';

const navigation = [
  { label: 'Início', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Meus Cursos', href: '/dashboard/cursos', icon: BookOpen },
  { label: 'Progresso', href: '/dashboard/progresso', icon: TrendingUp },
  { label: 'Certificados', href: '/dashboard/certificados', icon: Award },
];

const bottomNavigation = [
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: (typeof navigation)[0] }) => (
    <Link
      href={item.href}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
        isActive(item.href)
          ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--accent-foreground))]'
          : 'text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/50'
      )}
    >
      <item.icon className="w-[18px] h-[18px] shrink-0" />
      {item.label}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-md bg-[hsl(var(--primary))] flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
        </div>
        <span className="font-semibold text-[15px] text-[hsl(var(--sidebar-foreground))]">
          Reeduca Fisio
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-3 space-y-0.5 border-t border-[hsl(var(--sidebar-border))] pt-3">
        {bottomNavigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/8 transition-colors duration-150 w-full">
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 h-14 bg-[hsl(var(--sidebar))]/95 backdrop-blur-sm border-b border-[hsl(var(--sidebar-border))] flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-[hsl(var(--sidebar-foreground))]" />
          ) : (
            <Menu className="w-5 h-5 text-[hsl(var(--sidebar-foreground))]" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[hsl(var(--primary))] flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <span className="font-semibold text-sm text-[hsl(var(--sidebar-foreground))]">
            Reeduca
          </span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-[220px] bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))] transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="lg:pl-[220px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
