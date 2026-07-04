'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Mail, Phone, MapPin, Send, ChevronDown, ChevronUp, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'How do I access the daily study plan after registration?',
    a: 'After registering or logging in, go to the Study Planner section, select your target exam, and choose a plan. Once enrolled, your daily tasks will appear on your Student Dashboard every morning.',
  },
  {
    q: 'Is Aspirav completely free to use?',
    a: 'Yes! The core features — daily study checklists, community forum, current affairs, basic mock tests, and most study materials — are 100% free. We offer an optional Pro subscription for premium content like full-length mock test series, PDF notes, and priority doubt support.',
  },
  {
    q: 'How long does payment verification take?',
    a: 'After submitting your UPI transaction ID and screenshot, our team manually verifies payment within 2–6 hours on working days. Once approved, your account is upgraded instantly. You can track the status in your Profile → Billing section.',
  },
  {
    q: 'Can I change my target exam after registration?',
    a: 'Absolutely. Go to Profile → Edit Profile Details and update your Target Government Exam. Your study plan recommendations will update automatically based on your new selection.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Click "Forgot Password" on the login page and enter your registered email address. You will receive a password reset link within 2 minutes. Check your spam folder if it does not arrive in your inbox.',
  },
  {
    q: 'How do I report a community post that violates guidelines?',
    a: 'Click the report icon on any thread or reply in the community forum. Provide a brief reason, and our moderation team will review within 24 hours. Serious violations are acted upon immediately.',
  },
  {
    q: 'Can I use Aspirav content in Hindi?',
    a: 'Yes! Aspirav supports both Hindi and English. Update your Preferred Language in the Profile settings to receive bilingual content, and certain study materials and quiz explanations are available in Hindi.',
  },
  {
    q: 'What exams does Aspirav currently cover?',
    a: 'We currently cover UPSC Civil Services (IAS/IPS), SSC CGL, RRB NTPC (Railway Non-Technical), and IBPS PO (Public Sector Banks). More exams including SBI PO, UPPSC, and State PSC exams are coming soon.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <Container size="lg" className="py-10 md:py-16 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight">
            Contact <span className="text-brand-500">Aspirav</span>
          </h1>
          <p className="text-sm md:text-base text-surface-550 max-w-xl mx-auto font-semibold">
            Questions about study plans, payment verification, or account issues? We typically respond within 2 hours.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border border-surface-200 bg-white shadow-sm text-center flex flex-col items-center p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-surface-850">Email Support</h3>
            <a
              href="mailto:support@aspirav.co.in"
              className="text-xs text-brand-600 font-bold hover:underline"
            >
              support@aspirav.co.in
            </a>
            <p className="text-[11px] text-surface-450 font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Avg response: 2 hours
            </p>
          </Card>

          <Card className="border border-surface-200 bg-white shadow-sm text-center flex flex-col items-center p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="p-3 bg-success-50 rounded-2xl text-success-600">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-surface-850">WhatsApp Helpline</h3>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-success-600 font-bold hover:underline"
            >
              +91 98765 43210
            </a>
            <p className="text-[11px] text-surface-450 font-semibold">
              Billing & payment queries
            </p>
          </Card>

          <Card className="border border-surface-200 bg-white shadow-sm text-center flex flex-col items-center p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-surface-850">Office</h3>
            <p className="text-xs text-surface-550 font-semibold leading-relaxed text-center">
              Noida Sector 62,<br />
              Uttar Pradesh — 201301, India
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <Card className="border border-surface-200 bg-white shadow-sm p-6 md:p-8">
            <h2 className="text-base font-black text-surface-900 mb-5 flex items-center gap-2">
              <Send className="h-5 w-5 text-brand-500" />
              Send a Support Request
            </h2>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="p-3 bg-success-50 rounded-full w-fit mx-auto">
                  <Send className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="font-black text-surface-900">Message Sent!</h3>
                <p className="text-sm text-surface-500 font-semibold">
                  Our team will respond to your email within 2 business hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Your Name" placeholder="Siddharth Mishra" required />
                  <Input label="Email Address" type="email" placeholder="name@gmail.com" required />
                </div>
                <Input label="Subject" placeholder="e.g. Payment verification query" required />
                <Textarea
                  label="Message"
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={submitting}
                    icon={<Send className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* FAQs */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-surface-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-500" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-surface-200 rounded-2xl bg-white overflow-hidden hover:border-brand-200 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <span className="text-xs font-black text-surface-800 leading-relaxed">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="h-4 w-4 text-brand-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-surface-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-xs text-surface-550 font-semibold leading-relaxed border-t border-surface-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-surface-400 font-semibold pt-2">
              Can&apos;t find your answer?{' '}
              <Link href="mailto:support@aspirav.co.in" className="text-brand-600 font-black hover:underline">
                Email us directly
              </Link>
              {' '}and we&apos;ll help within 2 hours.
            </p>
          </div>

        </div>
      </Container>
    </>
  );
}
