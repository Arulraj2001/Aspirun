'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

interface PaymentSettings {
  payment_mode: 'on' | 'off';
  upi_id: string;
  upi_name: string;
  qr_code_image: string;
  payment_instructions: string;
  support_whatsapp: string;
  default_access_after_approval: boolean;
}

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    payment_mode: 'off',
    upi_id: 'studysetu@upi',
    upi_name: 'StudySetu Education Private Limited',
    qr_code_image: '',
    payment_instructions: '1. Scan QR code or copy official UPI ID.\n2. Pay the amount shown.\n3. Copy the 12-digit UPI Transaction ID / UTR and paste it here.',
    support_whatsapp: '+91 9876543210',
    default_access_after_approval: true
  });

  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('payment_settings');
    let parsedSettings = null;
    if (saved) {
      parsedSettings = JSON.parse(saved);
    }
    setTimeout(() => {
      if (parsedSettings) {
        setSettings(parsedSettings);
      }
      setLoading(false);
    }, 0);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('payment_settings', JSON.stringify(settings));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    alert('B2B billing specifications saved successfully.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Syncing billing credentials...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-6">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          UPI Payment Settings
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Toggle payment lock screens on premium content and modify static merchant IDs.
        </p>
      </div>

      <Card className="border border-surface-200">
        <form onSubmit={handleSave} className="space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-success-50 border border-success-150 text-success-700 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
              <ShieldCheck className="h-4.5 w-4.5" /> Payment configuration saved!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Global Payment Gate Lock (ON/OFF)"
              value={settings.payment_mode}
              onChange={(e) => setSettings({ ...settings, payment_mode: e.target.value as 'on' | 'off' })}
              options={[
                { value: 'off', label: 'OFF (Everything is FREE, no lock screen appears)' },
                { value: 'on', label: 'ON (Access blocks premium items with UPI modal)' }
              ]}
            />
            <Select
              label="Auto Grant Access On Approval"
              value={settings.default_access_after_approval ? 'true' : 'false'}
              onChange={(e) => setSettings({ ...settings, default_access_after_approval: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'Enabled (User gets content ownership rows auto-generated)' },
                { value: 'false', label: 'Disabled (Requires manual SQL grants)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Merchant UPI ID"
              value={settings.upi_id}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              placeholder="e.g. studysetu@upi"
              required
            />
            <Input
              label="Official Merchant Display Name"
              value={settings.upi_name}
              onChange={(e) => setSettings({ ...settings, upi_name: e.target.value })}
              placeholder="e.g. StudySetu Education Private Limited"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Static Qr Code Image URL (Optional)"
              value={settings.qr_code_image}
              onChange={(e) => setSettings({ ...settings, qr_code_image: e.target.value })}
              placeholder="Leave empty to auto-generate based on UPI ID"
            />
            <Input
              label="Support WhatsApp Number"
              value={settings.support_whatsapp}
              onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>

          <Textarea
            label="Payment Modal Instructions"
            value={settings.payment_instructions}
            onChange={(e) => setSettings({ ...settings, payment_instructions: e.target.value })}
            placeholder="Scan, pay and submit transactional reference ID..."
            rows={4}
            required
          />

          <div className="flex justify-end pt-4 border-t mt-6">
            <Button type="submit" icon={<Save className="h-4.5 w-4.5" />}>
              Save Specifications
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
