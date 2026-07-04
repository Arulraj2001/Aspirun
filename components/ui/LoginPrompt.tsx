import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface LoginPromptProps {
  /** What the user was trying to do */
  action?: string;
  /** Current path to return to after login */
  redirectPath?: string;
  /** Visual style — inline (inside a card) or modal-like */
  variant?: 'inline' | 'card';
  className?: string;
}

export function LoginPrompt({
  action = 'continue',
  redirectPath,
  variant = 'inline',
  className = '',
}: LoginPromptProps) {
  const loginHref = redirectPath
    ? `/login?redirect=${encodeURIComponent(redirectPath)}`
    : '/login';

  const registerHref = redirectPath
    ? `/register?redirect=${encodeURIComponent(redirectPath)}`
    : '/register';

  if (variant === 'card') {
    return (
      <div className={`bg-white border border-brand-200 rounded-2xl p-6 text-center shadow-sm ${className}`}>
        <div className="mx-auto mb-4 w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
          <Lock className="h-6 w-6 text-brand-500" />
        </div>
        <h3 className="text-base font-black text-surface-900 mb-1.5">
          Login Required
        </h3>
        <p className="text-xs font-semibold text-surface-500 mb-5 leading-relaxed max-w-xs mx-auto">
          Create a free account or sign in to {action}. It only takes 30 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href={loginHref}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
          <Link href={registerHref}>
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              Register Free
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Inline variant — compact banner
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-brand-50 border border-brand-200 rounded-2xl ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-100 rounded-xl shrink-0">
          <Lock className="h-4 w-4 text-brand-600" />
        </div>
        <div>
          <p className="text-xs font-black text-surface-900">Login required to {action}</p>
          <p className="text-[10px] font-semibold text-surface-500">
            Join free — no credit card needed
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Link href={loginHref}>
          <Button variant="outline" size="sm" className="text-xs h-8">
            Sign In
          </Button>
        </Link>
        <Link href={registerHref}>
          <Button variant="primary" size="sm" className="text-xs h-8">
            Register Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
