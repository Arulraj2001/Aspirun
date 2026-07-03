'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockPlans, mockMaterials, mockMockTests } from '@/data/mockData';
import { Task, StudyMaterial, MockTest, StudyPlan } from '@/types';
import { Plus, Trash2, ArrowLeft, Calendar, CheckSquare } from 'lucide-react';

export default function AdminTasksPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  
  // Tasks list for selected plan
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for New Task
  const [dayNumber, setDayNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Quant' | 'Reasoning' | 'English' | 'GK' | 'General Studies'>('General Studies');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [linkedMaterialId, setLinkedMaterialId] = useState('');
  const [linkedMockTestId, setLinkedMockTestId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load plans
    const savedPlans = localStorage.getItem('plans_db') || JSON.stringify(mockPlans);
    const parsedPlans = JSON.parse(savedPlans);

    // Load materials and tests for linking
    const savedMat = localStorage.getItem('materials_db') || JSON.stringify(mockMaterials);
    const savedMocks = localStorage.getItem('mock_tests_db') || JSON.stringify(mockMockTests);

    setTimeout(() => {
      setPlans(parsedPlans);
      setMaterials(JSON.parse(savedMat));
      setMockTests(JSON.parse(savedMocks));
      if (parsedPlans.length > 0) {
        setSelectedPlanId(parsedPlans[0].id);
      }
      setLoading(false);
    }, 0);
  }, []);

  // Sync tasks list when selected plan changes
  useEffect(() => {
    if (!selectedPlanId) return;

    const savedTasks = localStorage.getItem(`tasks_plan_${selectedPlanId}`);
    let list: Task[] = [];
    if (savedTasks) {
      list = JSON.parse(savedTasks);
    } else {
      // Seed default tasks for demo conforming exactly to types/index.ts Task schema
      list = [
        {
          id: 'task-seed-1',
          planId: selectedPlanId,
          dayNumber: 1,
          title: 'Read Preamble and Basic Polity Handout notes',
          description: 'Read Preamble and Basic Polity Handout notes',
          estimatedMinutes: 60,
          status: 'pending',
          category: 'General Studies'
        },
        {
          id: 'task-seed-2',
          planId: selectedPlanId,
          dayNumber: 1,
          title: 'Attempt Polity Constitutional background speed test',
          description: 'Attempt Polity Constitutional background speed test',
          estimatedMinutes: 30,
          status: 'pending',
          category: 'General Studies'
        },
        {
          id: 'task-seed-3',
          planId: selectedPlanId,
          dayNumber: 2,
          title: 'Read Fundamental Rights Articles 12 to 18 Handout',
          description: 'Read Fundamental Rights Articles 12 to 18 Handout',
          estimatedMinutes: 45,
          status: 'pending',
          category: 'General Studies'
        }
      ];
      localStorage.setItem(`tasks_plan_${selectedPlanId}`, JSON.stringify(list));
    }
    setTimeout(() => {
      setTasks(list);
    }, 0);
  }, [selectedPlanId]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedPlanId) return;

    setIsSubmitting(true);

    const newTask: Task = {
      id: `task-cust-${Date.now()}`,
      planId: selectedPlanId,
      dayNumber,
      title,
      description: title,
      estimatedMinutes,
      status: 'pending',
      category,
      // Optional metadata hooks
      materialId: linkedMaterialId || undefined,
      mockTestId: linkedMockTestId || undefined
    };

    const updated = [...tasks, newTask].sort((a, b) => a.dayNumber - b.dayNumber);
    localStorage.setItem(`tasks_plan_${selectedPlanId}`, JSON.stringify(updated));
    setTasks(updated);

    // Clear form
    setTitle('');
    setLinkedMaterialId('');
    setLinkedMockTestId('');

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Task registered to plan schedule checklist.');
    }, 400);
  };

  const handleDeleteTask = (id: string) => {
    if (!confirm('Are you sure you want to remove this day task?')) return;
    const updated = tasks.filter((t) => t.id !== id);
    localStorage.setItem(`tasks_plan_${selectedPlanId}`, JSON.stringify(updated));
    setTasks(updated);
    alert('Task deleted.');
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back link */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Plan Tasks Configurator
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Build day-by-day task checklists and link corresponding reference handouts.
          </p>
        </div>

        <Select
          label="Select Target Planner Roadmap"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          options={plans.map((p) => ({ value: p.id, label: p.title }))}
          className="max-w-xs shrink-0"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing tasks matrices...</p>
        </div>
      ) : !selectedPlanId ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <p className="text-xs text-surface-450 italic">No study plan registered. Create a plan first.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form to Add Task */}
          <div className="lg:col-span-1">
            <Card className="border border-surface-200">
              <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 flex items-center gap-1">
                <Plus className="h-4.5 w-4.5" /> Add Task to Schedule
              </h3>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Day Number"
                    type="number"
                    value={dayNumber}
                    onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                    required
                  />
                  <Input
                    label="Duration (Mins)"
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
                    required
                  />
                </div>

                <Input
                  label="Task Description statement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Articles 19-22 Fundamental Rights"
                  required
                />

                <Select
                  label="Task Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'Quant' | 'Reasoning' | 'English' | 'GK' | 'General Studies')}
                  options={[
                    { value: 'Quant', label: 'Quant / Mathematics' },
                    { value: 'Reasoning', label: 'Reasoning / Mental Ability' },
                    { value: 'English', label: 'English Comprehension' },
                    { value: 'GK', label: 'General Knowledge' },
                    { value: 'General Studies', label: 'General Studies' }
                  ]}
                />

                <Select
                  label="Link Handout Material (Optional)"
                  value={linkedMaterialId}
                  onChange={(e) => setLinkedMaterialId(e.target.value)}
                  options={[
                    { value: '', label: 'No Handout Linked' },
                    ...materials.map((m) => ({ value: m.id, label: `[${m.category}] ${m.title}` }))
                  ]}
                />

                <Select
                  label="Link Speed Quiz (Optional)"
                  value={linkedMockTestId}
                  onChange={(e) => setLinkedMockTestId(e.target.value)}
                  options={[
                    { value: '', label: 'No Speed Quiz Linked' },
                    ...mockTests.map((t) => ({ value: t.id, label: `[${t.totalQuestions} Qs] ${t.title}` }))
                  ]}
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
                  Add Checklist Task
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: List of existing tasks */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="h-5 w-5 text-brand-650" />
              Syllabus Day Schedule ({tasks.length} Tasks)
            </h3>

            {tasks.length === 0 ? (
              <Card className="text-center py-12 border border-surface-200 bg-surface-50/20">
                <p className="text-xs text-surface-450 italic">No tasks configured for this roadmap. Add one on the left!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="border border-surface-200 bg-white hover:border-brand-100 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Day {task.dayNumber}
                          </span>
                          <span className="text-[10px] font-black uppercase text-surface-500 bg-surface-100 px-2 py-0.5 rounded">
                            {task.category}
                          </span>
                          <span className="text-[10px] font-semibold text-surface-400">
                            {task.estimatedMinutes} Mins study time
                          </span>
                        </div>

                        <h4 className="text-xs md:text-sm font-black text-surface-850 leading-snug">
                          {task.title}
                        </h4>

                        {/* Linked files hooks summary */}
                        <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-surface-450">
                          {task.materialId && (
                            <span className="text-brand-650 bg-brand-50/40 border border-brand-100/50 px-2 py-0.5 rounded">
                              Linked Handout: {materials.find((m) => m.id === task.materialId)?.title || 'PDF Guide'}
                            </span>
                          )}
                          {task.mockTestId && (
                            <span className="text-orange-650 bg-orange-50/40 border border-orange-100/50 px-2 py-0.5 rounded">
                              Linked Quiz: {mockTests.find((t) => t.id === task.mockTestId)?.title || 'Speed Test'}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        className="h-8 w-8 p-0 shrink-0"
                        onClick={() => handleDeleteTask(task.id)}
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
      )}
    </Container>
  );
}
