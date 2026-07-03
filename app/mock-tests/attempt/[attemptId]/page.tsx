'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Question, MockResult, MockTest } from '@/types';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default function MockAttemptReviewPage({ params }: PageProps) {
  const router = useRouter();
  const { attemptId } = use(params);
  
  const [result, setResult] = useState<MockResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // 1. Load attempts list
    const savedResults = localStorage.getItem('mockMockResults') || '[]';
    const results: MockResult[] = JSON.parse(savedResults);
    const item = results.find((r) => r.id === attemptId);

    // 2. Load answers sheet
    const savedAnswers = localStorage.getItem(`attempt_answers_${attemptId}`) || '{}';
    const parsedAnswers = JSON.parse(savedAnswers);

    // 3. Load Questions list
    const savedQs = localStorage.getItem('questions_db') || '[]';
    const allQuestions: Question[] = JSON.parse(savedQs);

    setTimeout(() => {
      if (item) {
        setResult(item);
        
        // Fetch test profile to find exam subjects
        const savedTests = localStorage.getItem('mock_tests_db') || '[]';
        const tests: MockTest[] = JSON.parse(savedTests);
        const testMatch = tests.find((t) => t.id === item.mockTestId);
        
        let testQs = allQuestions.filter(
          (q) => q.subject.toLowerCase() === (testMatch?.subject || '').toLowerCase()
        );
        if (testQs.length === 0) {
          testQs = allQuestions; // fallback
        }
        setQuestions(testQs);
        setAnswers(parsedAnswers);
      }
      setLoading(false);
    }, 0);
  }, [attemptId]);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Analyzing scorecard...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Compiling mock result statistics and explanations.</p>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Result Log Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t find an attempt matching &quot;{attemptId}&quot;.</p>
        <Link href="/mock-tests">
          <Button>Back to Mock Tests</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/mock-tests" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to mock tests catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detailed Questions Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-base font-black text-surface-850 uppercase tracking-wider">
            Review Questions Sheet & Solutions
          </h3>

          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctOption;
            const isUnattempted = !userAns;

            return (
              <Card key={q.id} className="border border-surface-200 bg-white space-y-4">
                
                {/* Header info */}
                <div className="flex justify-between items-center gap-2 border-b border-surface-150 pb-2.5">
                  <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    Question {idx + 1}
                  </span>
                  
                  {isUnattempted ? (
                    <span className="text-[10px] font-black text-surface-450 bg-surface-100 px-2 py-0.5 rounded border border-surface-150 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Unattempted
                    </span>
                  ) : isCorrect ? (
                    <span className="text-[10px] font-black text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-100 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Correct (+{q.marks})
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-danger-600 bg-danger-50 px-2 py-0.5 rounded border border-danger-150 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Incorrect (-{q.negativeMarks})
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h4 className="text-xs md:text-sm font-black text-surface-850 leading-relaxed">
                  {q.questionText}
                </h4>

                {/* Options list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  {[
                    { key: 'A', value: q.optionA },
                    { key: 'B', value: q.optionB },
                    { key: 'C', value: q.optionC },
                    { key: 'D', value: q.optionD },
                  ].map((opt) => {
                    const isOptionCorrect = q.correctOption === opt.key;
                    const isOptionSelected = userAns === opt.key;
                    
                    let optClass = 'border-surface-200 text-surface-650 bg-white';
                    if (isOptionCorrect) {
                      optClass = 'border-success-500 bg-success-50/20 text-success-900 font-extrabold ring-1 ring-success-500';
                    } else if (isOptionSelected) {
                      optClass = 'border-danger-500 bg-danger-50/20 text-danger-900 font-extrabold ring-1 ring-danger-500';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-center gap-3 p-3 border rounded-xl text-xs md:text-sm transition-all ${optClass}`}
                      >
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                          isOptionCorrect 
                            ? 'bg-success-600 text-white' 
                            : isOptionSelected 
                            ? 'bg-danger-600 text-white' 
                            : 'bg-surface-100 text-surface-500'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="mt-4 pt-4 border-t border-surface-150 bg-surface-50 p-3 rounded-xl">
                  <h5 className="text-[10px] font-black uppercase text-brand-650 tracking-wider">Solution Explanation:</h5>
                  <p className="text-xs text-surface-550 leading-relaxed font-semibold mt-1">
                    {q.explanation || 'No detailed written analysis cataloged for this conceptual question.'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Scorecard Stats Summary */}
        <div className="space-y-6">
          <Card className="border border-surface-200 bg-gradient-to-b from-brand-50/20 to-white">
            <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-150 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-brand-650" />
              Scorecard Analysis
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                <span>Marks Obtained</span>
                <span className="text-brand-600 font-extrabold text-base">{result.score} / {result.totalMarks}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                <span>Attempt Accuracy</span>
                <span className="text-surface-850 font-extrabold">{result.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                <span>Time Spent</span>
                <span className="text-surface-850 font-extrabold">{result.timeTakenMinutes} Mins</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                <span>Comparative Percentile</span>
                <span className="text-success-600 font-extrabold">{result.percentile}%</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-150 flex flex-col gap-2">
              <Link href="/mock-tests">
                <Button variant="primary" className="w-full justify-center text-xs">
                  Attempt Another Mock
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </Container>
  );
}
