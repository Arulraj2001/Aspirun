'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LoadingState } from '@/components/ui/LoadingState';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Award, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  FileSpreadsheet, 
  HelpCircle, 
  FileEdit, 
  Globe, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('student');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
      
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            alert('Please login to continue.');
            router.push(`/admin-login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
          }
          
          // Get profile role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const roleStr = (profile?.role || 'student').toLowerCase();
          setUserRole(roleStr);
          const currentPath = window.location.pathname;

          if (roleStr === 'moderator') {
            if (currentPath.startsWith('/admin/community') || currentPath.startsWith('/admin/reports')) {
              setAuthorized(true);
            } else {
              alert('Access Denied. Moderators only have access to Community Moderation panels.');
              router.push('/student/dashboard');
              return;
            }
          } else if (roleStr !== 'admin') {
            alert('Access Denied. You do not have permission to view this page.');
            router.push('/student/dashboard');
            return;
          } else {
            setAuthorized(true);
          }
        } catch (err) {
          console.error('Supabase admin check failed, falling back:', err);
          checkSimulatedAuth();
        }
      } else {
        checkSimulatedAuth();
      }
      
      setLoading(false);
    };

    const checkSimulatedAuth = () => {
      const roleStr = (localStorage.getItem('simulated_role') || 'guest').toLowerCase();
      setUserRole(roleStr);
      const currentPath = window.location.pathname;

      if (roleStr === 'guest') {
        alert('Please login to continue.');
        router.push(`/admin-login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (roleStr === 'moderator') {
        if (currentPath.startsWith('/admin/community') || currentPath.startsWith('/admin/reports') || currentPath === '/admin/dashboard') {
          setAuthorized(true);
        } else {
          alert('Access Denied. Moderators only have access to Community Moderation panels.');
          router.push('/student/dashboard');
        }
      } else if (roleStr !== 'admin') {
        alert('Access Denied. You do not have permission to view this page.');
        router.push('/student/dashboard');
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    localStorage.setItem('simulated_role', 'guest');
    localStorage.removeItem('simulated_muted');
    localStorage.removeItem('simulated_banned');

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut failed:', err);
      }
    }
    router.push('/');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'moderator'] },
    { label: 'Exams Portal', href: '/admin/exams', icon: Award, roles: ['admin'] },
    { label: 'Study Planners', href: '/admin/study-plans', icon: BookOpen, roles: ['admin'] },
    { label: 'Day Tasks', href: '/admin/tasks', icon: CheckSquare, roles: ['admin'] },
    { label: 'Study Materials', href: '/admin/materials', icon: FileText, roles: ['admin'] },
    { label: 'Mock Tests', href: '/admin/mock-tests', icon: FileSpreadsheet, roles: ['admin'] },
    { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle, roles: ['admin'] },
    { label: 'Guidance Blogs', href: '/admin/blogs', icon: FileEdit, roles: ['admin'] },
    { label: 'Current Affairs', href: '/admin/current-affairs', icon: Globe, roles: ['admin'] },
    { label: 'Student Directory', href: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'Billing Queue', href: '/admin/payments', icon: CreditCard, roles: ['admin'] },
    { label: 'Doubt Reports', href: '/admin/reports', icon: AlertTriangle, roles: ['admin', 'moderator'] },
    { label: 'Platform Safety', href: '/admin/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingState message="Verifying administrator credentials..." />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex bg-surface-50 text-surface-900 relative">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-900 text-white fixed inset-y-0 left-0 z-30 border-r border-surface-800">
        <div className="p-4 border-b border-surface-800 flex items-center gap-2 shrink-0">
          <span className="p-1.5 bg-danger-600 rounded-lg text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-base font-black tracking-tight">
            Setu<span className="text-danger-500">Console</span>
          </span>
        </div>
        
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  isActive 
                    ? 'bg-danger-600 text-white shadow-md shadow-danger-600/20' 
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-surface-800 space-y-1.5 shrink-0 bg-surface-900">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-black text-surface-300 hover:bg-surface-800 hover:text-white rounded-xl transition-colors"
          >
            <Globe className="h-4 w-4 shrink-0 text-brand-400" />
            Visit Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-black text-surface-300 hover:bg-danger-900/40 hover:text-danger-400 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Absolute Overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-surface-900 text-white h-full z-10 shadow-2xl">
            <div className="p-5 border-b border-surface-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="p-1.5 bg-danger-600 rounded-lg text-white">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="text-base font-black tracking-tight">Console</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-surface-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      isActive 
                        ? 'bg-danger-600 text-white' 
                        : 'text-surface-300 hover:bg-surface-800'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-800 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black text-surface-300 hover:bg-surface-800 hover:text-white rounded-xl transition-colors"
              >
                <Globe className="h-4.5 w-4.5 shrink-0 text-brand-400" />
                Visit Website
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black text-surface-300 hover:bg-danger-900/40 hover:text-danger-400 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-surface-200 sticky top-0 z-20 shadow-sm">
          <span className="flex items-center gap-2">
            <span className="p-1.5 bg-danger-600 rounded-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-base font-black text-surface-900 tracking-tight">SetuConsole</span>
          </span>
          <button onClick={() => setMobileOpen(true)} className="p-2 text-surface-600 hover:bg-surface-100 rounded-xl">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
