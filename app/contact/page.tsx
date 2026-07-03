'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight">
          Contact <span className="text-brand-500">Aspirav</span>
        </h1>
        <p className="text-sm md:text-base text-surface-550 max-w-xl mx-auto font-semibold">
          Have doubts about syllabus roadmaps, transaction approval, or general queries? Speak to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <Card className="border border-surface-200 text-center flex flex-col items-center p-6 space-y-3">
          <div className="p-3 bg-brand-50 rounded-full text-brand-600">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-xs md:text-sm font-black text-surface-850">Email Support</h3>
          <p className="text-[11px] text-surface-500 font-semibold leading-relaxed">
            support@aspirav.co.in<br />
            (Average response: 2 hours)
          </p>
        </Card>

        <Card className="border border-surface-200 text-center flex flex-col items-center p-6 space-y-3">
          <div className="p-3 bg-success-50 rounded-full text-success-650">
            <Phone className="h-5 w-5" />
          </div>
          <h3 className="text-xs md:text-sm font-black text-surface-850">WhatsApp Helpline</h3>
          <p className="text-[11px] text-surface-500 font-semibold leading-relaxed">
            +91 98765 43210<br />
            (Billing & activation queries)
          </p>
        </Card>

        <Card className="border border-surface-200 text-center flex flex-col items-center p-6 space-y-3">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-xs md:text-sm font-black text-surface-850">Registered Office</h3>
          <p className="text-[11px] text-surface-500 font-semibold leading-relaxed">
            Noida Sector 62, Uttar Pradesh,<br />
            Pin - 201301, India
          </p>
        </Card>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8">
        <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-6">
          Send Us a Message
        </h3>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Your message has been sent successfully. Support team will email you soon.'); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Your Name" placeholder="e.g. Siddharth Mishra" required />
            <Input label="Email Address" type="email" placeholder="e.g. name@domain.com" required />
          </div>
          
          <Input label="Subject / Query Reason" placeholder="e.g. Study planner access lock or payment proof check" required />
          
          <Textarea label="Detailed Message Description" rows={4} placeholder="Type your concerns here..." required />
          
          <div className="flex justify-end pt-2">
            <Button type="submit" icon={<Send className="h-4.5 w-4.5" />}>
              Send Support Query
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
