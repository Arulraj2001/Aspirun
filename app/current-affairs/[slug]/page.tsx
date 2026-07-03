'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCurrentAffairs, mockPlans } from '@/data/mockData';
import { CurrentAffairsItem, StudyPlan } from '@/types';
import { Calendar, ArrowLeft, HelpCircle, Check } from 'lucide-react';

interface MockMCQ {
  id: string;
  question: string;
  options: string[];
  correct: number; // index of correct option
  explanation: string;
}

export default function CurrentAffairsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [item, setItem] = useState<CurrentAffairsItem | null>(null);
  const [relatedPlans, setRelatedPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // States for interactive MCQs
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1. Fetch current affairs database
    const saved = localStorage.getItem('current_affairs_db') || '[]';
    const allItems: CurrentAffairsItem[] = JSON.parse(saved).length > 0 ? JSON.parse(saved) : mockCurrentAffairs;
    const found = allItems.find((ca) => ca.slug === slug || ca.id === slug);

    let plans: StudyPlan[] = [];
    if (found) {
      // Load related study plans matching general exams or categories
      const targetExam = found.category.includes('Economy') || found.category.includes('International') ? 'exam-upsc' : 'exam-ssc';
      plans = mockPlans.filter((p) => p.examId === targetExam).slice(0, 2);
    }

    setTimeout(() => {
      if (found) {
        setItem(found);
        setRelatedPlans(plans);
      }
      setLoading(false);
    }, 0);
  }, [slug]);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-semibold">Syncing bulletin details...</p>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Bulletin Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We could not locate this current affairs post in our database.</p>
        <Link href="/current-affairs">
          <Button>Back to Bulletins</Button>
        </Link>
      </Container>
    );
  }

  // Pre-generate simulated key highlights summary points
  const points = [
    `Formalizes next-generation collaborative frameworks aligning bilateral strategic autonomy programs.`,
    `Aims to solve supply chain dependencies, creating resilient technology nodes across partner markets.`,
    `Establishes dedicated funding schemes and joint academic-industrial committees for periodic safety audits.`
  ];

  // Pre-generate dynamic mock MCQs related to current affairs
  const mcqs: MockMCQ[] = [
    {
      id: 'q-ca-1',
      question: `Which national regulator or agency was primarily concerned in the context of this bilateral/domestic announcement?`,
      options: ['Reserve Bank of India (RBI)', 'ISRO Space Research Board', 'Ministry of External Affairs', 'NITI Aayog Planning Cell'],
      correct: item.category === 'Economy' ? 0 : item.category === 'Science & Tech' ? 1 : 2,
      explanation: `Based on the article context, the primary policy guidelines were authorized and executed by the matching sector leadership.`
    },
    {
      id: 'q-ca-2',
      question: `What is the core target threshold timeline mapped for strategic self-reliance benchmarks?`,
      options: ['By the end of Year 2026', 'Targeting Year 2028-2030 projections', 'Extended to Year 2035', 'Immediate baseline enforcement'],
      correct: 1,
      explanation: `Most government strategic frameworks align deliverables with 2028-2030 timeline structures to allow execution scale.`
    }
  ];

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (submitted[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuestion = (qId: string) => {
    if (selectedAnswers[qId] === undefined) {
      alert('Please select an option before submitting.');
      return;
    }
    setSubmitted((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back link */}
      <div className="mb-2">
        <Link href="/current-affairs" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Daily Bulletins
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bulletin Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                {item.category}
              </span>
              <span className="text-xs font-bold text-surface-450 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Date: {new Date(item.date).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl md:text-4.5xl font-black text-surface-900 leading-tight">
              {item.title}
            </h1>

            {/* Content summary points */}
            <Card className="border border-surface-200 bg-surface-50/30">
              <h3 className="text-xs font-black text-surface-850 uppercase tracking-widest mb-3">
                Key Summary Highlights
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-xs md:text-sm font-semibold text-surface-650">
                {points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </Card>

            <div
              className="text-xs md:text-sm font-semibold text-surface-700 leading-relaxed space-y-4 pt-4 border-t border-surface-150 current-affairs-article-content"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>

          {/* Related MCQs */}
          <div className="space-y-4 border-t pt-8">
            <h2 className="text-base md:text-lg font-black text-surface-850 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="h-5 w-5 text-brand-600" />
              Related Practice Questions (MCQs)
            </h2>

            <div className="space-y-6">
              {mcqs.map((q) => {
                const choice = selectedAnswers[q.id];
                const isCorrectChoice = choice === q.correct;
                const hasSubmitted = submitted[q.id];

                return (
                  <Card key={q.id} className="border border-surface-200 bg-white">
                    <h4 className="text-xs md:text-sm font-black text-surface-850 leading-snug">
                      {q.question}
                    </h4>

                    <div className="mt-4 space-y-2">
                      {q.options.map((opt, oIdx) => {
                        let btnClass = 'border-surface-200 bg-white text-surface-700';
                        if (choice === oIdx) {
                          btnClass = 'border-brand-500 bg-brand-50/20 text-brand-700 font-extrabold';
                        }
                        if (hasSubmitted) {
                          if (oIdx === q.correct) {
                            btnClass = 'border-success-500 bg-success-50/20 text-success-800 font-black';
                          } else if (choice === oIdx) {
                            btnClass = 'border-danger-500 bg-danger-50/20 text-danger-800 font-black';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={hasSubmitted}
                            onClick={() => handleOptionSelect(q.id, oIdx)}
                            className={`w-full text-left p-3 border rounded-xl text-xs flex justify-between items-center transition-colors cursor-pointer ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {hasSubmitted && oIdx === q.correct && <Check className="h-4.5 w-4.5 text-success-700" />}
                          </button>
                        );
                      })}
                    </div>

                    {!hasSubmitted ? (
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" onClick={() => handleSubmitQuestion(q.id)}>
                          Submit Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-surface-50 border rounded-xl text-[11px] md:text-xs font-semibold text-surface-550 leading-relaxed">
                        <span className={`font-black uppercase block mb-1 ${isCorrectChoice ? 'text-success-700' : 'text-danger-650'}`}>
                          {isCorrectChoice ? 'Correct Answer!' : 'Incorrect Answer'}
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Planner Recommendations */}
        <div className="space-y-6">
          
          <Card className="border border-surface-200 bg-white">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-brand-650" />
              Related Study Plans
            </h3>

            <div className="space-y-3">
              {relatedPlans.map((plan) => (
                <div key={plan.id} className="p-3 bg-surface-50 border rounded-xl flex flex-col gap-1 hover:border-surface-300 transition-colors">
                  <h4 className="text-xs font-black text-surface-850 line-clamp-1 leading-snug">{plan.title}</h4>
                  <p className="text-[10px] text-surface-450 font-bold">{plan.durationDays} Days &bull; {plan.difficulty}</p>
                  <Link href={`/study-planner/${plan.examId.replace('exam-', '')}/${plan.slug || plan.id}`} className="mt-1.5 self-start">
                    <span className="text-[10px] font-black text-brand-650 hover:underline">
                      Explore Curriculum &rarr;
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
          
        </div>

      </div>
    </Container>
  );
}
