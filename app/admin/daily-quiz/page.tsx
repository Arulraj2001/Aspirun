'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export default function AdminDailyQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [text, setText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Sync default daily quiz questions
    const saved = localStorage.getItem('daily_quiz_configured_questions');
    let data: QuizQuestion[] = [];
    if (saved) {
      data = JSON.parse(saved);
    } else {
      // 3 default questions as seed
      data = [
        {
          id: 'dq-seed-1',
          text: 'Who among the following was the Chairman of the Drafting Committee of the Indian Constitution?',
          options: ['Dr. B.R. Ambedkar', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
          correctOption: 'A',
          explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly.'
        },
        {
          id: 'dq-seed-2',
          text: 'Which Article of the Indian Constitution guarantees Right to Equality?',
          options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
          correctOption: 'B',
          explanation: 'Article 14 guarantees equality before the law and equal protection of the laws within the territory of India.'
        }
      ];
      localStorage.setItem('daily_quiz_configured_questions', JSON.stringify(data));
    }
    
    setTimeout(() => {
      setQuestions(data);
      setLoading(false);
    }, 0);
  }, []);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim() || !explanation.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    const newQ: QuizQuestion = {
      id: `dq-cust-${Date.now()}`,
      text,
      options: [optA, optB, optC, optD],
      correctOption,
      explanation
    };

    const updated = [...questions, newQ];
    localStorage.setItem('daily_quiz_configured_questions', JSON.stringify(updated));
    setQuestions(updated);

    // Clear form
    setText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectOption('A');
    setExplanation('');

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Question added to daily quiz bank.');
    }, 400);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    const updated = questions.filter((q) => q.id !== id);
    localStorage.setItem('daily_quiz_configured_questions', JSON.stringify(updated));
    setQuestions(updated);
    alert('Question deleted.');
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <a href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </a>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          Daily Quiz Configurator
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Add or delete multiple choice questions for the daily student challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form to add question */}
        <div className="lg:col-span-1">
          <Card className="border border-surface-200">
            <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 flex items-center gap-1">
              <Plus className="h-4.5 w-4.5" /> Add Question to Bank
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <Textarea
                label="Question Statement"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the question text..."
                rows={3}
                required
              />

              <Input
                label="Option A"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                required
              />
              <Input
                label="Option B"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                required
              />
              <Input
                label="Option C"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                required
              />
              <Input
                label="Option D"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                required
              />

              <Select
                label="Correct Option"
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value as 'A' | 'B' | 'C' | 'D')}
                options={[
                  { value: 'A', label: 'Option A' },
                  { value: 'B', label: 'Option B' },
                  { value: 'C', label: 'Option C' },
                  { value: 'D', label: 'Option D' }
                ]}
              />

              <Textarea
                label="Explanation Statement"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Provide details on correct options..."
                rows={3}
                required
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
                Add Question
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: List of current questions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider">
            Active Question Bank ({questions.length})
          </h3>

          {loading ? (
            <p className="text-xs text-surface-450 font-bold">Loading active bank...</p>
          ) : questions.length === 0 ? (
            <Card className="text-center py-12 border border-surface-200 bg-surface-50/20">
              <p className="text-xs text-surface-450 italic">No questions currently in the daily quiz bank.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <Card key={q.id} className="border border-surface-200">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <h4 className="text-xs md:text-sm font-black text-surface-800 leading-snug">
                        Q{qIdx + 1}: {q.text}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-surface-600">
                        <p>A: {q.options[0]}</p>
                        <p>B: {q.options[1]}</p>
                        <p>C: {q.options[2]}</p>
                        <p>D: {q.options[3]}</p>
                      </div>

                      <div className="pt-2 border-t text-[10px] text-brand-650 font-black uppercase">
                        Correct Option: {q.correctOption}
                      </div>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </Container>
  );
}
