'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  description: string;
  status: 'active' | 'inactive';
}

export default function AdminSubscriptionSettingsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    setIsConfigured(configured);

    const loadPlans = async () => {
      if (configured) {
        try {
          const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .order('price', { ascending: true });

          if (error) throw error;
          if (data) {
            setPlans(data.map(p => ({
              id: p.id,
              name: p.name,
              duration_months: p.duration_months,
              price: Number(p.price),
              description: p.description || '',
              status: p.status as 'active' | 'inactive'
            })));
          }
        } catch (err) {
          console.error("Failed to load subscription plans from Supabase:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // Simulation Fallback
        const saved = localStorage.getItem('subscription_plans_db');
        let data: SubscriptionPlan[] = [];
        if (saved) {
          data = JSON.parse(saved);
        } else {
          data = [
            {
              id: '111e4567-e89b-12d3-a456-426614174001',
              name: 'Monthly Pass',
              duration_months: 1,
              price: 199,
              description: 'Complete access to all premium mocks, plan roadmaps, and PDF study files for 1 month.',
              status: 'active'
            },
            {
              id: '222e4567-e89b-12d3-a456-426614174002',
              name: '6 Months Pass (Semester)',
              duration_months: 6,
              price: 599,
              description: 'Complete access to all premium mocks, plan roadmaps, and PDF study files for 6 months.',
              status: 'active'
            },
            {
              id: '333e4567-e89b-12d3-a456-426614174003',
              name: 'Annual Pass (Yearly)',
              duration_months: 12,
              price: 999,
              description: 'Complete access to all premium mocks, plan roadmaps, and PDF study files for 12 months.',
              status: 'active'
            }
          ];
          localStorage.setItem('subscription_plans_db', JSON.stringify(data));
        }
        setPlans(data);
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handlePlanChange = (index: number, field: keyof SubscriptionPlan, value: any) => {
    setPlans(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    if (isConfigured) {
      try {
        // Save each plan to Supabase
        const promises = plans.map(plan => 
          supabase
            .from('subscription_plans')
            .update({
              name: plan.name,
              duration_months: plan.duration_months,
              price: plan.price,
              description: plan.description,
              status: plan.status
            })
            .eq('id', plan.id)
        );

        const results = await Promise.all(promises);
        const hasError = results.some(r => r.error);
        if (hasError) {
          throw new Error("One or more update operations failed inside Supabase.");
        }

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err: any) {
        console.error("Failed to save changes:", err);
        alert(`Error updating subscription packages: ${err.message}`);
      }
    } else {
      localStorage.setItem('subscription_plans_db', JSON.stringify(plans));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Syncing subscription package lists...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-6">
      {/* Back link */}
      <div className="mb-2">
        <Link href="/admin/settings" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Safety Settings
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Subscription Plan Manager
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Modify pricing packages, descriptions, and activation states for student passes.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="h-4.5 w-4.5" /> Subscription configurations successfully updated!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {plans.map((plan, index) => (
            <Card key={plan.id} className="border border-surface-200 p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xs font-black uppercase text-surface-850 tracking-wider">
                  Tier {index + 1}: {plan.name || 'Unnamed Package'}
                </h3>
                <span className="text-[10px] text-surface-400 font-extrabold uppercase">
                  ID: {plan.id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Plan Name"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Price (INR)"
                    type="number"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(index, 'price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Select
                    label="Plan Availability Status"
                    value={plan.status}
                    onChange={(e) => handlePlanChange(index, 'status', e.target.value as 'active' | 'inactive')}
                    options={[
                      { value: 'active', label: 'Active (Visible on checkout)' },
                      { value: 'inactive', label: 'Disabled (Hidden)' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <Input
                    label="Duration (Months)"
                    type="number"
                    value={plan.duration_months}
                    onChange={(e) => handlePlanChange(index, 'duration_months', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Textarea
                    label="Plan Description Details"
                    value={plan.description}
                    onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
                    placeholder="Short description of the package inclusions..."
                    rows={2}
                    required
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" size="md" icon={<Save className="h-4.5 w-4.5" />}>
            Save All Changes
          </Button>
        </div>
      </form>
    </Container>
  );
}
