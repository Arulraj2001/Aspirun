'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  CreditCard,
  Bookmark,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

const PUBLIC_NAV = [
  { label: 'Study Planner', href: '/study-planner' },
  { label: 'Mock Tests', href: '/mock-tests' },
  { label: 'Materials', href: '/materials' },
  { label: 'Current Affairs', href: '/current-affairs' },
  { label: 'Guidance', href: '/guidance' },
  { label: 'Community', href: '/community' },
];

const STUDENT_DROPDOWN = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Study Plan', href: '/student/my-plan', icon: BookOpen },
  { label: 'My Tasks', href: '/student/tasks', icon: FileText },
  { label: 'Mock Results', href: '/student/mock-results', icon: Award },
  { label: 'Saved Materials', href: '/student/saved-materials', icon: Bookmark },
  { label: 'Billing', href: '/student/profile#billing', icon: CreditCard },
  { label: 'Profile', href: '/student/profile', icon: User },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [pathname]);

  // Hide header on admin and auth pages
  if (
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/admin-login'
  ) {
    return null;
  }

  const handleLogout = async () => {
    setShowDropdown(false);
    setIsOpen(false);
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    // Clear any simulation state
    localStorage.removeItem('simulated_role');
    localStorage.removeItem('simulated_profile');
    router.push('/');
    router.refresh();
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'A';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-surface-200/80 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.88)' }}>
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="p-2 bg-brand-500 rounded-xl text-white shadow-sm shadow-brand-500/20 group-hover:bg-brand-600 transition-colors">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-surface-900 tracking-tight">
              Aspira<span className="text-brand-500">v</span>
            </span>
          </Link>

          {/* Desktop Nav — same links for all visitors */}
          <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
            {PUBLIC_NAV.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-bold transition-colors hover:text-brand-600 ${
                    isActive ? 'text-brand-500' : 'text-surface-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Area */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isLoading ? (
              // Loading skeleton
              <div className="h-8 w-24 bg-surface-100 rounded-xl animate-pulse" />
            ) : isLoggedIn ? (
              /* Logged-in user avatar dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl text-sm font-bold text-surface-700 transition-colors cursor-pointer"
                >
                  <span className="h-7 w-7 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                    {initials}
                  </span>
                  <span className="max-w-[100px] truncate">
                    {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-surface-400 transition-transform duration-200 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-surface-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="px-4 py-2.5 border-b border-surface-100 mb-1">
                      <p className="text-xs font-black text-surface-850 truncate">
                        {user?.fullName || 'Aspirant'}
                      </p>
                      <p className="text-[10px] font-semibold text-surface-400 truncate">
                        {user?.email}
                      </p>
                      {user?.role && user.role !== 'student' && (
                        <span className="text-[9px] font-black uppercase text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          {user.role}
                        </span>
                      )}
                    </div>

                    {/* Student links */}
                    {(user?.role === 'student' || user?.role === 'admin') && STUDENT_DROPDOWN.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-surface-650 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                          <Icon className="h-3.5 w-3.5 text-surface-400" />
                          {item.label}
                        </Link>
                      );
                    })}

                    {/* Admin link */}
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-black text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-black text-danger-600 hover:bg-danger-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest CTA */
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Register Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-surface-150 bg-white px-4 py-5 shadow-xl animate-in slide-in-from-top duration-200">

          {/* Nav links */}
          <nav className="flex flex-col gap-1 mb-5">
            {PUBLIC_NAV.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth area */}
          <div className="border-t border-surface-100 pt-4 space-y-3">
            {isLoggedIn ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-1 mb-3">
                  <span className="h-9 w-9 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-black text-surface-850">
                      {user?.fullName || 'Aspirant'}
                    </p>
                    <p className="text-[10px] text-surface-400 font-semibold truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Quick links grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {STUDENT_DROPDOWN.slice(0, 6).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-surface-50 border border-surface-150 hover:bg-brand-50 hover:border-brand-200 text-xs font-bold text-surface-700 hover:text-brand-700 rounded-xl transition-all"
                      >
                        <Icon className="h-3.5 w-3.5 text-surface-400" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-center text-danger-600 border-danger-200 hover:bg-danger-50 mt-2"
                  onClick={handleLogout}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Register Free →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
