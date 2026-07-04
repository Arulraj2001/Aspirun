'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { Check, ShieldAlert, Sparkles, Clock, Calendar, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Plan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  description: string;
}

export default function PricingPage() {
  const router = useRouter();
  
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '111e4567-e89b-12d3-a456-426614174001',
      name: 'Monthly Pass',
      duration_months: 1,
      price: 199,
      description: 'Perfect for revision and attempting immediate targeted sectional mock tests.'
    },
    {
      id: '222e4567-e89b-12d3-a456-426614174002',
      name: '6 Months Pass (Semester)',
      duration_months: 6,
      price: 599,
      description: 'Best choice for serious aspirants targeting upcoming seasonal examinations.'
    },
    {
      id: '333e4567-e89b-12d3-a456-426614174003',
      name: 'Annual Pass (Yearly)',
      duration_months: 12,
      price: 999,
      description: 'Unlimited access to all resources, plans, and quizzes for complete peace of mind.'
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<{ name: string; ends_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    setIsConfigured(configured);

    const loadSubscriptionAndPlans = async () => {
      if (configured) {
        try {
          // 1. Fetch dynamic subscription plans
          const { data: plansData } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('status', 'active')
            .order('price', { ascending: true });
            
          if (plansData && plansData.length > 0) {
            setPlans(plansData.map(p => ({
              id: p.id,
              name: p.name,
              duration_months: p.duration_months,
              price: Number(p.price),
              description: p.description
            })));
          }

          // 2. Fetch logged-in user subscription pass status
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: sub } = await supabase
              .from('student_subscriptions')
              .select('*, subscription_plans(name)')
              .eq('user_id', session.user.id)
              .eq('status', 'active')
              .gt('ends_at', new Date().toISOString())
              .maybeSingle();

            if (sub) {
              const planName = (sub.subscription_plans as any)?.name || 'Pro Pass';
              setActiveSubscription({
                name: planName,
                ends_at: sub.ends_at
              });
            }
          }
        } catch (err) {
          console.error('Failed to load pricing information:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Simulation Fallback
        const savedSub = localStorage.getItem('simulated_subscription');
        if (savedSub) {
          const sub = JSON.parse(savedSub);
          if (sub.status === 'active' && new Date(sub.ends_at) > new Date()) {
            setActiveSubscription({
              name: sub.name,
              ends_at: sub.ends_at
            });
          }
        }
        setLoading(false);
      }
    };

    loadSubscriptionAndPlans();
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    if (isConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?message=Please%20login%20to%20continue%20with%20purchasing.&redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
    } else {
      const role = localStorage.getItem('simulated_role') || 'guest';
      if (role === 'guest') {
        router.push(`/login?message=Please%20login%20to%20continue%20with%20purchasing.&redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    
    // In simulation mode, mock active subscription immediately
    if (!isConfigured && selectedPlan) {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + selectedPlan.duration_months);
      
      const newSub = {
        name: selectedPlan.name,
        starts_at: new Date().toISOString(),
        ends_at: expiry.toISOString(),
        status: 'active'
      };
      
      localStorage.setItem('simulated_subscription', JSON.stringify(newSub));
      setActiveSubscription({
        name: selectedPlan.name,
        ends_at: expiry.toISOString()
      });
    }
  };

  const features = [
    'Unlock 150+ Premium Mock Tests & Quizzes',
    'Full access to all Exam Syllabus Roadmaps',
    'Downloadable PDF study guides & reading materials',
    'Interactive community forums with doubts solutions',
    'Real-time percentile rankings and test analysis',
    'Priority WhatsApp support for doubts clearing'
  ];

  return (
    <Container size="xl" className="py-8 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-650 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
          Pricing Plans
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight leading-none mt-2">
          Unlock Aspirav Pro Pass
        </h1>
        <p className="text-xs md:text-sm text-surface-500 font-bold max-w-lg mx-auto leading-relaxed">
          Choose a comprehensive membership pass to gain absolute access to all premium quizzes, study planners, notes, and preparation tools.
        </p>
      </div>

      {/* Expiry Banner */}
      {activeSubscription && (
        <Card className="max-w-xl mx-auto border-brand-200 bg-brand-50/20 text-center p-5 rounded-3xl flex flex-col items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-500 animate-pulse" />
          <h4 className="text-xs md:text-sm font-black text-surface-850">
            You have an active {activeSubscription.name}!
          </h4>
          <p className="text-[10px] font-semibold text-surface-450 uppercase">
            Pass Expiration: {new Date(activeSubscription.ends_at).toLocaleDateString('en-IN', { dateStyle: 'long' })} ({Math.max(0, Math.ceil((new Date(activeSubscription.ends_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} Days Remaining)
          </p>
        </Card>
      )}

      {/* Grid of pricing plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isBestValue = plan.duration_months === 6;
          
          return (
            <Card 
              key={plan.id} 
              className={`flex flex-col justify-between p-6 md:p-8 rounded-3xl border transition-all ${
                isBestValue 
                  ? 'border-brand-500 ring-1 ring-brand-500 relative shadow-2xl md:scale-[1.03] bg-white' 
                  : 'border-surface-200 shadow-sm hover:border-surface-300'
              }`}
            >
              {isBestValue && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Recommended Plan
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-surface-900 uppercase tracking-wide">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-surface-450 font-bold leading-normal mt-1 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-surface-100">
                  <span className="text-2xl md:text-4xl font-black text-surface-900">₹{plan.price}</span>
                  <span className="text-xs text-surface-450 font-extrabold uppercase">
                    / {plan.duration_months} {plan.duration_months === 1 ? 'Month' : 'Months'}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5 text-xs text-surface-650 font-semibold leading-relaxed">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="p-0.5 bg-brand-50 text-brand-600 rounded-md shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-100">
                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  variant={isBestValue ? 'primary' : 'outline'} 
                  className="w-full justify-center text-xs font-black rounded-2xl"
                  size="md"
                >
                  Choose {plan.name.split(' ')[0]}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Safety info */}
      <div className="max-w-2xl mx-auto p-4 bg-surface-50 border border-surface-150 rounded-2xl flex items-start gap-2.5 text-[10px] md:text-xs font-bold text-surface-500 leading-normal">
        <ShieldAlert className="h-5 w-5 text-surface-450 shrink-0 mt-0.5" />
        <p>
          UPI Payment Protection: All transaction logs are securely audited. To unlock your pass, submit the 12-digit transaction ID (UTR) correctly. Rejection notes will be visible inside your billing dashboard if UTR matching fails.
        </p>
      </div>

      {showPaymentModal && selectedPlan && (
        <PaymentModal
          contentType="subscription"
          contentId={selectedPlan.id}
          contentTitle={selectedPlan.name}
          amount={selectedPlan.price}
          onClose={() => setShowPaymentModal(false)}
          onSubmitSuccess={handlePaymentSuccess}
        />
      )}
    </Container>
  );
}
