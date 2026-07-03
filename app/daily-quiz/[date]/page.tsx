'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, AlertTriangle, PlayCircle, Award } from 'lucide-react';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export default function DailyQuizEnginePage() {
  const params = useParams();
  const dateKey = params.date as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate 10 standard Polity & History questions
    const mockQs: QuizQuestion[] = [
      {
        id: 'dq-1',
        text: 'Who among the following was the Chairman of the Drafting Committee of the Indian Constitution?',
        options: ['Dr. B.R. Ambedkar', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
        correctOption: 'A',
        explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly.'
      },
      {
        id: 'dq-2',
        text: 'Which Article of the Indian Constitution guarantees Right to Equality?',
        options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
        correctOption: 'B',
        explanation: 'Article 14 guarantees equality before the law and equal protection of the laws within the territory of India.'
      },
      {
        id: 'dq-3',
        text: 'The concept of Directive Principles of State Policy is borrowed from which country?',
        options: ['USA', 'USSR', 'Ireland', 'Australia'],
        correctOption: 'C',
        explanation: 'DPSP is borrowed from the Irish Constitution of 1937, which had copied it from the Spanish Constitution.'
      },
      {
        id: 'dq-4',
        text: 'Who has the authority to declare a National Emergency in India?',
        options: ['The Prime Minister', 'The President', 'The Chief Justice', 'The Parliament'],
        correctOption: 'B',
        explanation: 'Under Article 352, the President of India can declare a National Emergency on the written recommendation of the Cabinet.'
      },
      {
        id: 'dq-5',
        text: 'Which Constitutional Amendment is known as the "Mini-Constitution"?',
        options: ['42nd Amendment', '44th Amendment', '73rd Amendment', '86th Amendment'],
        correctOption: 'A',
        explanation: 'The 42nd Amendment Act of 1976 is called the Mini-Constitution due to the large number of changes it introduced.'
      },
      {
        id: 'dq-6',
        text: 'Which High Court has the largest jurisdiction in terms of states/UTs covered?',
        options: ['Guwahati High Court', 'Bombay High Court', 'Calcutta High Court', 'Madras High Court'],
        correctOption: 'A',
        explanation: 'Guwahati High Court has territorial jurisdiction over Assam, Nagaland, Mizoram, and Arunachal Pradesh.'
      },
      {
        id: 'dq-7',
        text: 'Who was the first Governor-General of independent India?',
        options: ['C. Rajagopalachari', 'Lord Mountbatten', 'Dr. Rajendra Prasad', 'Lord William Bentinck'],
        correctOption: 'B',
        explanation: 'Lord Mountbatten served as the first Governor-General of independent India until June 1948.'
      },
      {
        id: 'dq-8',
        text: 'Under which Article can the President\'s Rule be imposed in a State?',
        options: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
        correctOption: 'B',
        explanation: 'Article 356 deals with the imposition of President\'s Rule in a state in case of failure of constitutional machinery.'
      },
      {
        id: 'dq-9',
        text: 'The Seventh Schedule of the Constitution of India contains lists related to:',
        options: ['Languages', 'Anti-defection law', 'Distribution of power between Union & States', 'Panchayati Raj'],
        correctOption: 'C',
        explanation: 'The Seventh Schedule divides legislative powers into Union List, State List, and Concurrent List.'
      },
      {
        id: 'dq-10',
        text: 'Which tier of local government was constitutionalized by the 73rd Amendment Act?',
        options: ['Municipal Corporations', 'Panchayati Raj Institutions', 'Cantonment Boards', 'Town Area Committees'],
        correctOption: 'B',
        explanation: 'The 73rd Constitutional Amendment Act of 1992 constitutionalized the Panchayati Raj system at village, block, and district levels.'
      }
    ];

    setTimeout(() => {
      setQuestions(mockQs);
      
      // Sync check if user has previously completed this quiz
      const attempts = JSON.parse(localStorage.getItem('daily_quiz_attempts') || '{}');
      const prevAttempt = attempts[dateKey];
      if (prevAttempt) {
        setIsSubmitted(true);
        setScore(prevAttempt.score);
      }
      setLoading(false);
    }, 0);
  }, [dateKey]);

  const handleSelectOption = (qId: string, choice: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: choice }));
  };

  const handleSubmitQuiz = () => {
    // Check if user answered all 10 questions
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < 10) {
      if (!confirm(`You have only answered ${answeredCount}/10 questions. Do you want to submit?`)) {
        return;
      }
    }

    let calculatedScore = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        calculatedScore++;
      }
    });

    // Save attempt logs
    const attempts = JSON.parse(localStorage.getItem('daily_quiz_attempts') || '{}');
    attempts[dateKey] = {
      score: calculatedScore,
      total: 10
    };
    localStorage.setItem('daily_quiz_attempts', JSON.stringify(attempts));

    // Update study streak tracker
    const streak = parseInt(localStorage.getItem('study_streak_count') || '5');
    localStorage.setItem('study_streak_count', String(streak + 1));

    setScore(calculatedScore);
    setIsSubmitted(true);
    alert('Daily Quiz submitted successfully. Study streak updated (+1)!');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-semibold">Configuring quiz sheets...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back Link */}
      <div className="mb-2">
        <Link href="/daily-quiz" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes Calendar
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-brand-650 font-black uppercase tracking-widest bg-brand-50 border px-2.5 py-0.5 rounded">
            Daily Challenge
          </span>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight leading-snug mt-2">
            Daily Quiz: {dateKey}
          </h1>
        </div>

        {isSubmitted && (
          <Card className="p-4 bg-success-50 border border-success-200 flex items-center gap-3">
            <Award className="h-8 w-8 text-success-700 animate-bounce" />
            <div>
              <p className="text-xs text-success-850 font-black">Quiz Attempt Completed!</p>
              <p className="text-sm font-black text-success-900 mt-0.5">Score: {score}/10</p>
            </div>
          </Card>
        )}
      </div>

      {/* Main engine list */}
      <div className="max-w-4xl space-y-8">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctOption;

          return (
            <Card key={q.id} className={`border ${
              isSubmitted
                ? isCorrect
                  ? 'border-success-300 bg-success-50/5'
                  : 'border-danger-200 bg-danger-50/5'
                : 'border-surface-200'
            }`}>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-[10px] font-black text-brand-650 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-xs md:text-sm font-black text-surface-850 leading-relaxed">
                    {q.text}
                  </h4>

                  {/* Options select grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt, oIdx) => {
                      const optCode = ['A', 'B', 'C', 'D'][oIdx] as 'A' | 'B' | 'C' | 'D';
                      const isOptionSelected = userChoice === optCode;

                      let btnStyle = 'border-surface-200 bg-white text-surface-700';
                      if (isOptionSelected) {
                        btnStyle = 'border-brand-500 bg-brand-50/20 text-brand-700 font-extrabold';
                      }
                      if (isSubmitted) {
                        if (optCode === q.correctOption) {
                          btnStyle = 'border-success-500 bg-success-50/30 text-success-800 font-black';
                        } else if (isOptionSelected) {
                          btnStyle = 'border-danger-500 bg-danger-50/30 text-danger-800 font-black';
                        }
                      }

                      return (
                        <button
                          key={optCode}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optCode)}
                          className={`w-full text-left p-3 border rounded-xl text-xs flex justify-between items-center transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optCode === q.correctOption && <Check className="h-4.5 w-4.5 text-success-700" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card displayed once submitted */}
                  {isSubmitted && (
                    <div className="mt-5 p-3.5 bg-surface-50 border rounded-xl space-y-1.5">
                      <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${
                        isCorrect ? 'text-success-700' : 'text-danger-650'
                      }`}>
                        {isCorrect ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                      </span>
                      <p className="text-[11px] md:text-xs font-semibold text-surface-550 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {/* Submit action block */}
        {!isSubmitted && (
          <div className="flex justify-end mt-8">
            <Button size="lg" onClick={handleSubmitQuiz} icon={<PlayCircle className="h-5 w-5" />}>
              Submit Daily Quiz
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
