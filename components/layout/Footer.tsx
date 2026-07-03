'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '../ui/Container';
import { GraduationCap, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname && (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/admin-login')) {
    return null;
  }

  const links = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Community Guidelines', href: '/community-guidelines' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Payment Policy', href: '/payment-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ];

  return (
    <footer className="w-full bg-white border-t border-surface-200 mt-auto py-8 md:py-12">
      <Container size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-6 border-b border-surface-100">
          
          {/* Column 1: Logo & Info */}
          <div className="flex flex-col items-start max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-brand-500 rounded-lg text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-black text-surface-900 tracking-tight">
                Aspira<span className="text-brand-500">v</span>
              </span>
            </Link>
            <p className="text-xs md:text-sm text-surface-500 font-semibold leading-relaxed">
              India&apos;s leading exam-wise daily study planner and doubt-clearing ecosystem for government exam aspirants. Master your goals day by day.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-surface-800 uppercase tracking-wider mb-2">Company</h4>
            <Link href="/about" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              About Us
            </Link>
            <Link href="/contact" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Contact Support
            </Link>
            <Link href="/disclaimer" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Legal Disclaimer
            </Link>
          </div>

          {/* Column 3: Trust & Policies */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-surface-800 uppercase tracking-wider mb-2">Policies & Safety</h4>
            <Link href="/privacy-policy" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Terms of Service
            </Link>
            <Link href="/community-guidelines" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Community Guidelines
            </Link>
            <Link href="/payment-policy" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Payment Policy
            </Link>
            <Link href="/refund-policy" className="text-xs md:text-sm text-surface-550 font-bold hover:text-brand-650 transition-colors w-max">
              Refund Policy
            </Link>
          </div>

        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-surface-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-450 font-bold text-center sm:text-left">
            &copy; {currentYear} Aspirav. All rights reserved. Made for Indian government exam aspirants.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-success-600 font-extrabold bg-success-50 border border-success-100 px-2 py-0.5 rounded-full">
              Safe & Secure Platform
            </span>
            <Link 
              href="/admin-login" 
              title="Admin Portal Access"
              className="text-surface-300 hover:text-brand-500 transition-colors p-1"
            >
              <Lock className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
