'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { GraduationCap } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      // Silent redirect — no alert popups
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/student/dashboard')}`);
    }
  }, [isLoading, isLoggedIn, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-4">
        <div className="p-3 bg-brand-500 rounded-2xl animate-pulse">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2 text-center">
          <div className="h-4 w-40 bg-surface-200 rounded-lg animate-pulse mx-auto" />
          <div className="h-3 w-28 bg-surface-100 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Render nothing while redirect is in-flight
    return null;
  }

  return <>{children}</>;
}
