'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, GraduationCap, ArrowRight, UserCheck, ShieldAlert, ChevronDown, User, LogOut } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showDropdown) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown-wrapper')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showDropdown]);

  // Sync simulated role from localStorage and Supabase session
  useEffect(() => {
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

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

    // Sync from active Supabase session
    let unsubscribe: (() => void) | undefined;
    if (isConfigured) {
      const syncSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          const dbRole = (profile?.role || 'student') as 'student' | 'admin';
          localStorage.setItem('simulated_role', dbRole);
          setRole(dbRole);
        }
      };
      syncSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          const dbRole = (profile?.role || 'student') as 'student' | 'admin';
          localStorage.setItem('simulated_role', dbRole);
          setRole(dbRole);
        } else {
          // No active session: fallback to guest unless manually simulating student/admin
          const savedRole = localStorage.getItem('simulated_role') as 'guest' | 'student' | 'admin';
          if (savedRole !== 'student' && savedRole !== 'admin') {
            localStorage.setItem('simulated_role', 'guest');
            setRole('guest');
          }
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (pathname && (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/admin-login')) {
    return null;
  }

  const handleLogout = async () => {
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.setItem('simulated_role', 'guest');
    localStorage.removeItem('simulated_profile');
    setRole('guest');
    router.push('/');
  };

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
    { label: 'Pricing', href: '/pricing' },
    { label: 'Community', href: '/community' },
    { label: 'Current Affairs', href: '/current-affairs' },
    { label: 'Guidance', href: '/guidance' },
  ];

  const studentNavLinks = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Study Planner', href: '/study-planner' },
    { label: 'Mock Tests', href: '/mock-tests' },
    { label: 'Materials', href: '/materials' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Community', href: '/community' },
    { label: 'Current Affairs', href: '/current-affairs' },
    { label: 'Guidance', href: '/guidance' },
  ];

  const studentProfileLinks = [
    { label: 'My Profile', href: '/student/profile' },
    { label: 'My Study Plan', href: '/student/my-plan' },
    { label: 'My Tasks', href: '/student/tasks' },
    { label: 'My Payments', href: '/student/profile#billing' },
    { label: 'My Mock Results', href: '/student/mock-results' },
    { label: 'Saved Materials', href: '/student/saved-materials' },
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
              /* User Profile Dropdown */
              <div className="relative profile-dropdown-wrapper">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl text-sm font-black text-surface-700 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="h-6.5 w-6.5 bg-brand-500 text-white rounded-lg flex items-center justify-center font-extrabold text-xs">
                    S
                  </span>
                  <span>My Account</span>
                  <ChevronDown className={`h-4 w-4 text-surface-450 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-surface-100 mb-1">
                      <p className="text-xs font-black text-surface-850 truncate">Siddharth Mishra</p>
                      <p className="text-[10px] font-semibold text-surface-450 truncate">aspirant@aspirav.in</p>
                    </div>

                    {role === 'student' && studentProfileLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-surface-650 hover:bg-brand-50/50 hover:text-brand-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}

                    {role === 'admin' && (
                      <Link
                        href="/admin/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-surface-650 hover:bg-brand-50/50 hover:text-brand-700 transition-colors"
                      >
                        Global Settings
                      </Link>
                    )}

                    <div className="border-t border-surface-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-black text-danger-650 hover:bg-danger-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              /* Mobile Student Links Panel */
              <div className="space-y-3">
                {role === 'student' && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase text-surface-400 tracking-wider px-2">Account Management</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {studentProfileLinks.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-2 bg-surface-50 border border-surface-150 hover:bg-brand-50/20 text-xs font-bold text-surface-700 hover:text-brand-700 rounded-xl transition-all"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-center text-danger-600 border-danger-200 hover:bg-danger-50"
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
