'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, GraduationCap, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');

  // Sync simulated role from localStorage
  useEffect(() => {
    const syncRole = () => {
      const savedRole = localStorage.getItem('simulated_role') as 'guest' | 'student' | 'admin';
      if (savedRole) {
        setRole((prev) => {
          if (prev !== savedRole) {
            return savedRole;
          }
          return prev;
        });
      }
    };
    syncRole();
    const interval = setInterval(syncRole, 800);
    return () => clearInterval(interval);
  }, []);

  if (pathname && (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/admin-login')) {
    return null;
  }

  const changeRole = (newRole: 'guest' | 'student' | 'admin') => {
    setRole(newRole);
    localStorage.setItem('simulated_role', newRole);
    
    // Redirect logically to make testing smoother
    if (newRole === 'admin') {
      router.push('/admin/dashboard');
    } else if (newRole === 'student') {
      router.push('/student/dashboard');
    } else {
      router.push('/');
    }
  };

  const publicNavLinks = [
    { label: 'Study Planner', href: '/study-planner' },
    { label: 'Today’s Tasks', href: '/today' },
    { label: 'Mock Tests', href: '/mock-tests' },
    { label: 'Materials', href: '/materials' },
    { label: 'Community', href: '/community' },
    { label: 'Current Affairs', href: '/current-affairs' },
    { label: 'Guidance', href: '/guidance' },
  ];

  const studentNavLinks = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'My Plan', href: '/student/my-plan' },
    { label: 'Tasks', href: '/student/tasks' },
    { label: 'Mock Results', href: '/student/mock-results' },
    { label: 'Saved Materials', href: '/student/saved-materials' },
    { label: 'Community', href: '/student/community' },
    { label: 'Profile', href: '/student/profile' },
  ];

  const adminNavLinks = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Planner Portal', href: '/study-planner' },
    { label: 'Community Portal', href: '/community' },
  ];

  const getLinks = () => {
    if (role === 'admin') return adminNavLinks;
    if (role === 'student') return studentNavLinks;
    return publicNavLinks;
  };

  const links = getLinks();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-surface-200">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="p-2 bg-brand-500 rounded-xl text-white shadow-sm shadow-brand-500/20 group-hover:bg-brand-600 transition-colors">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-xl font-black text-surface-900 tracking-tight">
              Aspira<span className="text-brand-500">v</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-bold transition-colors hover:text-brand-650 ${
                    isActive ? 'text-brand-500' : 'text-surface-650'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {role === 'guest' ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeRole('guest')}
              >
                Log Out
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 focus:outline-none cursor-pointer"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden border-t border-surface-150 bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top duration-250 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-bold transition-colors ${
                    isActive ? 'text-brand-500' : 'text-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2 border-t border-surface-100 pt-4">
            {role === 'guest' ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => { changeRole('guest'); setIsOpen(false); }}
              >
                Log Out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
