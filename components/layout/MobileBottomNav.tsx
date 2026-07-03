'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, BookOpen, Award, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');

  // Sync state with localStorage to check if student is logged in
  useEffect(() => {
    const handleStorageChange = () => {
      const savedRole = localStorage.getItem('simulated_role') as 'guest' | 'student' | 'admin';
      if (savedRole) {
        setRole(savedRole);
      }
    };

    handleStorageChange();

    const interval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(interval);
  }, []);

  if (role !== 'student') return null;

  const navItems = [
    { label: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/student/tasks', icon: CheckSquare },
    { label: 'Plan', href: '/student/my-plan', icon: BookOpen },
    { label: 'Tests', href: '/mock-tests', icon: Award },
    { label: 'Me', href: '/student/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-200 pb-safe-bottom shadow-lg">
      <nav className="flex justify-around items-center h-14 md:h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                isActive ? 'text-brand-500' : 'text-surface-450 hover:text-surface-700'
              }`}
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6 mb-0.5" />
              <span className="text-[9px] md:text-[10px] font-bold tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
