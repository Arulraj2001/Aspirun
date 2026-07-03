import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <Container size="md" className="py-16 md:py-24 text-center space-y-6">
      <Card className="border border-surface-200 p-8 md:p-12 space-y-6 bg-white shadow-xl rounded-3xl">
        <span className="p-4 bg-brand-50 border border-brand-100 text-brand-600 rounded-3xl inline-flex animate-bounce">
          <HelpCircle className="h-10 w-10" />
        </span>
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight">
            404 - Page Not Found
          </h1>
          <p className="text-xs md:text-sm text-surface-500 font-semibold max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
          <Link href="/">
            <Button variant="primary" className="w-full sm:w-auto justify-center flex items-center gap-1.5 font-bold">
              <Home className="h-4.5 w-4.5" /> Return Home
            </Button>
          </Link>
          <Link href="/study-planner">
            <Button variant="outline" className="w-full sm:w-auto justify-center flex items-center gap-1.5 font-bold">
              <ArrowLeft className="h-4.5 w-4.5" /> Study Planners
            </Button>
          </Link>
        </div>
      </Card>
    </Container>
  );
}
