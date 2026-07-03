'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockExams } from '@/data/mockData';
import { MockTest } from '@/types';
import { Plus, Edit2, Trash2, AlertCircle, ArrowLeft, CheckCircle, Eye } from 'lucide-react';

export default function AdminMockTestsListPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mock_tests_db') || '[]';
    const parsed = JSON.parse(saved);
    setTimeout(() => {
      setMockTests(parsed);
    }, 0);
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this mock test permanently?');
    if (!confirmDelete) return;

    const updated = mockTests.filter((m) => m.id !== id);
    localStorage.setItem('mock_tests_db', JSON.stringify(updated));
    setMockTests(updated);

    setAlertMsg('Mock test deleted successfully.');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
      </div>

      <SectionHeader
        title="Manage Mock Tests & Quizzes"
        subtitle="Catalog speed quizzes, topic checkups, sectional mocks, or full-length paper simulators."
        action={
          <Link href="/admin/mock-tests/new">
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              Create Mock Test
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

      {mockTests.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200 bg-surface-50/20">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Mock Tests Loaded</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Click &quot;Create Mock Test&quot; to catalog your first test module.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto border border-surface-200 rounded-2xl bg-white shadow-xs">
          <table className="min-w-full divide-y divide-surface-150 text-left text-xs font-semibold text-surface-650">
            <thead className="bg-surface-50 text-[10px] text-surface-450 uppercase font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Test Title</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Format / Type</th>
                <th className="px-6 py-4">Total Qs / Marks</th>
                <th className="px-6 py-4">Access</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-150 bg-white">
              {mockTests.map((m) => {
                const exam = mockExams.find((e) => e.id === m.examId);
                return (
                  <tr key={m.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-surface-900 max-w-xs truncate">
                      {m.title}
                    </td>
                    <td className="px-6 py-4">{exam?.code || 'All Exams'}</td>
                    <td className="px-6 py-4">{m.subject}</td>
                    <td className="px-6 py-4 uppercase text-[10px] font-extrabold">
                      {m.testType || 'sectional'}
                    </td>
                    <td className="px-6 py-4">
                      {m.totalQuestions} Qs / {m.totalMarks} Marks
                    </td>
                    <td className="px-6 py-4">
                      {m.isFree ? (
                        <span className="text-[10px] text-success-700 bg-success-50 border border-success-100 px-2 py-0.5 rounded font-black">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded font-black">
                          {m.price ? `₹${m.price}` : 'PREMIUM'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        m.status === 'draft' ? 'bg-surface-150 text-surface-500' : 'bg-success-50 text-success-700 border border-success-100'
                      }`}>
                        {m.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/mock-tests/${m.slug || m.id}`} title="Preview">
                          <Button size="sm" variant="ghost" className="p-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/mock-tests/${m.id}/edit`} title="Edit">
                          <Button size="sm" variant="outline" className="p-2">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDelete(m.id)}
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
