'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';

import { MockResult } from '@/types';
import { Award, Percent, BarChart, Calendar, ChevronRight, AlertCircle } from 'lucide-react';

export default function StudentMockResults() {
  const [results, setResults] = useState<MockResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mockMockResults') || '[]';
    const parsed: MockResult[] = JSON.parse(saved);
    
    setTimeout(() => {
      setResults(parsed);
    }, 0);
  }, []);

  // Compute aggregate indicators
  const totalMocks = results.length;
  const avgAccuracy = totalMocks > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.accuracy, 0) / totalMocks) 
    : 0;
  const avgPercentile = totalMocks > 0
    ? parseFloat((results.reduce((acc, curr) => acc + curr.percentile, 0) / totalMocks).toFixed(1))
    : 0;

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Mock Test Analytics & Scorecards"
        subtitle="Detailed analysis of your performance metrics across subject sectional mocks and full tests."
      />

      {/* Analytics stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Average Accuracy"
          value={`${avgAccuracy}%`}
          icon={<Percent className="h-5 w-5 text-brand-650" />}
          description="Correct options selection ratio"
        />
        <StatCard
          title="Average Percentile"
          value={`${avgPercentile}%`}
          icon={<BarChart className="h-5 w-5 text-success-650" />}
          description="Performance compared to serious peers"
        />
        <StatCard
          title="Total Mock Tests"
          value={String(totalMocks)}
          icon={<Award className="h-5 w-5 text-orange-500" />}
          description="Assessment response sheets submitted"
        />
      </div>

      <h3 className="text-base md:text-lg font-black text-surface-850 mb-4">
        Assessment History logs
      </h3>

      {results.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Attempts Logged</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Head over to the mock tests index to start your first speed quiz.</p>
          <Link href="/mock-tests" className="mt-4 inline-block">
            <Button size="sm">Go to mock Tests</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id} className="border border-surface-200 hover:border-surface-300 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                    Mock Scorecard
                  </span>
                  <h4 className="text-sm md:text-base font-black text-surface-900 mt-1.5 leading-snug">
                    {result.mockTestTitle}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-bold text-surface-450 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(result.dateAttempted).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>&bull;</span>
                    <span>Time Expended: {result.timeTakenMinutes} Mins</span>
                  </div>
                </div>

                {/* Score stats block */}
                <div className="flex flex-wrap items-center gap-4 justify-between lg:justify-end w-full lg:w-auto">
                  <div className="grid grid-cols-4 gap-4 md:gap-6 bg-surface-50 p-3.5 rounded-2xl border border-surface-150 text-center shrink-0 min-w-[280px]">
                    <div>
                      <p className="text-[9px] text-surface-400 font-extrabold uppercase mb-0.5">Score</p>
                      <p className="text-xs font-extrabold text-surface-800">{result.score} / {result.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-brand-500 font-extrabold uppercase mb-0.5">Accuracy</p>
                      <p className="text-xs font-extrabold text-brand-650">{result.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-success-600 font-extrabold uppercase mb-0.5">Percentile</p>
                      <p className="text-xs font-extrabold text-success-700">{result.percentile}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-orange-650 font-extrabold uppercase mb-0.5">Rank</p>
                      <p className="text-xs font-extrabold text-orange-650">{result.rank}</p>
                    </div>
                  </div>

                  <Link href={`/mock-tests/result/${result.id}`} className="shrink-0 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="w-full justify-center" icon={<ChevronRight className="h-4 w-4" />} iconPosition="right">
                      View Analytics
                    </Button>
                  </Link>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
