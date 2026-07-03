'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockExams, mockMaterials } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function AdminMaterialsListPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    let saved = localStorage.getItem('materials_db');
    if (!saved) {
      localStorage.setItem('materials_db', JSON.stringify(mockMaterials));
      saved = JSON.stringify(mockMaterials);
    }
    const data = JSON.parse(saved);
    setTimeout(() => {
      setMaterials(data);
    }, 0);
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this study material permanently?');
    if (!confirmDelete) return;

    const updated = materials.filter((m) => m.id !== id);
    localStorage.setItem('materials_db', JSON.stringify(updated));
    setMaterials(updated);
    
    setAlertMsg('Material deleted successfully.');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to admin dashboard */}
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
      </div>

      <SectionHeader
        title="Manage Study Materials"
        subtitle="Catalog revision notes, PDF sheets, practice sets, or video tutorials for student study planners."
        action={
          <Link href="/admin/materials/new">
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              Create Material
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

      {materials.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Study Materials Loaded</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Click &quot;Create Material&quot; to catalog your first revision notes.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto border border-surface-200 rounded-2xl bg-white shadow-xs">
          <table className="min-w-full divide-y divide-surface-150 text-left text-xs font-semibold text-surface-650">
            <thead className="bg-surface-50 text-[10px] text-surface-450 uppercase font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-150 bg-white">
              {materials.map((m) => {
                const exam = mockExams.find((e) => e.id === m.examId);
                
                return (
                  <tr key={m.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-surface-900 max-w-xs truncate">
                      {m.title}
                    </td>
                    <td className="px-6 py-4">{exam?.code || 'All Exams'}</td>
                    <td className="px-6 py-4">{m.subject}</td>
                    <td className="px-6 py-4 uppercase text-[10px] font-extrabold">
                      {m.category}
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
                        <Link href={`/materials/${m.slug || m.id}`} title="Preview">
                          <Button size="sm" variant="ghost" className="p-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/materials/${m.id}/edit`} title="Edit">
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
