'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockExams } from '@/data/mockData';
import { Question } from '@/types';
import { Plus, Edit2, Trash2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminQuestionsListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    // Load questions from local storage or initialize
    const saved = localStorage.getItem('questions_db') || '[]';
    const parsed = JSON.parse(saved);
    setTimeout(() => {
      setQuestions(parsed);
    }, 0);
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this question permanently?');
    if (!confirmDelete) return;

    const updated = questions.filter((q) => q.id !== id);
    localStorage.setItem('questions_db', JSON.stringify(updated));
    setQuestions(updated);

    setAlertMsg('Question deleted successfully.');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
      </div>

      <SectionHeader
        title="Manage Question Bank"
        subtitle="Catalog and audit questions to populate sectional tests or daily revision quizzes."
        action={
          <Link href="/admin/questions/new">
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              Create Question
            </Button>
          </Link>
        }
      />

      {alertMsg && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 text-success-850 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle className="h-4.5 w-4.5 text-success-600" />
          <span>{alertMsg}</span>
        </div>
      )}

      {questions.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">Question Bank Empty</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Click &quot;Create Question&quot; to add your first quiz item.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto border border-surface-200 rounded-2xl bg-white shadow-xs">
          <table className="min-w-full divide-y divide-surface-150 text-left text-xs font-semibold text-surface-650">
            <thead className="bg-surface-50 text-[10px] text-surface-450 uppercase font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Question Text</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Correct</th>
                <th className="px-6 py-4">Marks / Neg</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-150 bg-white">
              {questions.map((q) => {
                const exam = mockExams.find((e) => e.id === q.examId);
                return (
                  <tr key={q.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-surface-900 max-w-sm truncate">
                      {q.questionText}
                    </td>
                    <td className="px-6 py-4">{exam?.code || 'All Exams'}</td>
                    <td className="px-6 py-4">{q.subject}</td>
                    <td className="px-6 py-4 text-brand-650 font-black">Option {q.correctOption}</td>
                    <td className="px-6 py-4">
                      +{q.marks} / -{q.negativeMarks}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        q.status === 'draft' ? 'bg-surface-150 text-surface-500' : 'bg-success-50 text-success-700 border border-success-100'
                      }`}>
                        {q.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/questions/${q.id}/edit`} title="Edit">
                          <Button size="sm" variant="outline" className="p-2">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDelete(q.id)}
                          size="sm"
                          variant="ghost"
                          className="p-2 text-danger-600 hover:bg-danger-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
