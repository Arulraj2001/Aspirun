'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuizItem {
  dateKey: string;
  displayDate: string;
  totalQuestions: number;
  durationMinutes: number;
  subject: string;
}

export default function DailyQuizListingPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [attempts, setAttempts] = useState<Record<string, { score: number; total: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Generate 5 days of daily quizzes up to today (2026-07-03)
    const baseDate = new Date('2026-07-03');
    const items: QuizItem[] = [];
    
    for (let i = 0; i < 5; i++) {
      const target = new Date(baseDate);
      target.setDate(baseDate.getDate() - i);
      const year = target.getFullYear();
      const month = String(target.getMonth() + 1).padStart(2, '0');
      const day = String(target.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const displayStr = target.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      items.push({
        dateKey,
        displayDate: displayStr,
        totalQuestions: 10,
        durationMinutes: 10,
        subject: i % 2 === 0 ? 'Polity & Governance' : 'History & General Awareness'
      });
    }

    // 2. Load attempts from local storage
    const attemptsSaved = JSON.parse(localStorage.getItem('daily_quiz_attempts') || '{}');

    setTimeout(() => {
      setQuizzes(items);
      setAttempts(attemptsSaved);
      setLoading(false);
    }, 0);
  }, []);

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      <SectionHeader
        title="Daily 10-Question GK Quizzes"
        subtitle="Attempt daily micro speed quizzes to verify your current affairs and static syllabus retention."
      />

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-semibold animate-pulse">Syncing quiz calendars...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const attempt = attempts[quiz.dateKey];
            const isCompleted = !!attempt;

            return (
              <Card key={quiz.dateKey} className="border border-surface-200 bg-white flex flex-col justify-between hover:border-brand-200 transition-colors">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                      {quiz.subject}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed ({attempt.score}/{attempt.total})
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug flex items-center gap-1.5">
                    <Calendar className="h-4.5 w-4.5 text-surface-400" />
                    Quiz for {quiz.dateKey}
                  </h3>
                  <p className="text-xs text-surface-450 font-semibold mt-1">
                    {quiz.displayDate}
                  </p>
                  <p className="text-[11px] text-surface-500 font-bold mt-3">
                    {quiz.totalQuestions} Questions &bull; {quiz.durationMinutes} Minutes
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-100 mt-5 flex justify-end">
                  <Link href={`/daily-quiz/${quiz.dateKey}`}>
                    <Button size="sm" variant={isCompleted ? 'ghost' : 'primary'} icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                      {isCompleted ? 'Reattempt Quiz' : 'Start Quiz'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
