'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ShieldAlert, Check, Copy, HelpCircle } from 'lucide-react';

interface PaymentModalProps {
  contentType: 'study_plan' | 'material' | 'mock_test';
  contentId: string;
  contentTitle: string;
  amount: number;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  contentType,
  contentId,
  contentTitle,
  amount,
  onClose,
  onSubmitSuccess
}) => {
  const [upiId, setUpiId] = useState('studysetu@upi');
  const [upiName, setUpiName] = useState('StudySetu Education Private Limited');
  const [qrCode, setQrCode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [supportPhone, setSupportPhone] = useState('+91 9876543210');

  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Load payment settings
    const savedSettings = localStorage.getItem('payment_settings');
    let settings = {
      upi_id: 'studysetu@upi',
      upi_name: 'StudySetu Education Private Limited',
      qr_code_image: '',
      payment_instructions: '1. Scan QR code or copy official UPI ID.\n2. Pay the amount shown.\n3. Copy the 12-digit UPI Transaction ID / UTR and paste it here.',
      support_whatsapp: '+91 9876543210'
    };
    if (savedSettings) {
      settings = JSON.parse(savedSettings);
    }

    const payUrl = `upi://pay?pa=${settings.upi_id}&pn=${encodeURIComponent(settings.upi_name)}&am=${amount}&cu=INR`;
    const defaultQR = settings.qr_code_image || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payUrl)}`;

    setTimeout(() => {
      setUpiId(settings.upi_id);
      setUpiName(settings.upi_name);
      setInstructions(settings.payment_instructions);
      setSupportPhone(settings.support_whatsapp);
      setQrCode(defaultQR);
    }, 0);
  }, [amount]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim() || transactionId.trim().length < 8) {
      alert('Please enter a valid UPI Transaction / UTR ID.');
      return;
    }

    setIsSubmitting(true);

    const newRequest = {
      id: `pay-req-${Date.now()}`,
      user: 'Siddharth Mishra',
      username: 'siddharth_99',
      contentType,
      contentId,
      contentTitle,
      amount,
      upiTransactionId: transactionId,
      screenshot,
      notes,
      status: 'pending',
      adminNote: '',
      dateCreated: new Date().toISOString()
    };

    const savedReqs = localStorage.getItem('payment_requests_db') || '[]';
    const allReqs = JSON.parse(savedReqs);
    allReqs.push(newRequest);
    localStorage.setItem('payment_requests_db', JSON.stringify(allReqs));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Payment submission logged. Your access will be unlocked once verification is approved by study administrator.');
      onSubmitSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <Card className="max-w-md w-full bg-white border border-surface-200 shadow-2xl rounded-3xl p-6 relative my-8">
        
        {/* Warning Badge banner */}
        <div className="mb-4 p-3 bg-danger-50 border border-danger-150 rounded-2xl flex items-start gap-2 text-[10px] md:text-xs font-bold text-danger-700 leading-relaxed">
          <ShieldAlert className="h-5 w-5 text-danger-650 shrink-0 mt-0.5" />
          <p>
            WARNING: Pay only to the official UPI ID shown on this website. Guard against phishing scams.
          </p>
        </div>

        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div>
            <span className="text-[9px] font-black text-brand-650 uppercase tracking-widest block">Manual Verification</span>
            <h3 className="text-base md:text-lg font-black text-surface-900 leading-tight">Unlock Premium Content</h3>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-surface-450 hover:text-surface-650 cursor-pointer">
            Cancel
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          
          {/* Content summary */}
          <div className="p-3 bg-surface-50 border rounded-xl flex justify-between items-center text-xs font-bold text-surface-700">
            <div>
              <p className="text-[10px] text-surface-400 font-bold uppercase">{contentType.replace('_', ' ')}</p>
              <p className="text-surface-850 font-black line-clamp-1">{contentTitle}</p>
            </div>
            <span className="text-sm font-black text-brand-650 shrink-0">₹{amount}</span>
          </div>

          {/* QR code and scan info */}
          <div className="flex flex-col items-center gap-3 py-2">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrCode} alt="UPI QR Code" className="h-44 w-44 object-contain border p-2 rounded-2xl bg-white" />
            ) : (
              <div className="h-44 w-44 bg-surface-100 flex items-center justify-center rounded-2xl">
                <p className="text-[10px] text-surface-400">Loading QR...</p>
              </div>
            )}
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-surface-450 uppercase">Scan QR Code or Pay to UPI ID</p>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-xs font-black text-surface-800">{upiId}</span>
                <button onClick={handleCopyUPI} className="p-1 text-surface-450 hover:text-brand-650 rounded cursor-pointer">
                  {copied ? <Check className="h-3.5 w-3.5 text-success-650" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[10px] font-semibold text-surface-500 italic">UPI Account Holder: {upiName}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-3.5 bg-surface-50 border rounded-2xl text-[11px] font-semibold text-surface-550 space-y-1">
            <span className="font-extrabold uppercase text-surface-700 block mb-0.5">Instructions:</span>
            <p className="whitespace-pre-line leading-relaxed">{instructions}</p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2 border-t">
            <Input
              label="UPI Transaction ID / UTR (12 digits)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 617283940123"
              required
            />

            <div>
              <label className="block text-xs font-bold text-surface-650 mb-1.5">
                Upload Payment Screenshot (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="w-full text-xs text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              />
              {screenshot && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={screenshot} alt="Screenshot Preview" className="h-24 object-contain mt-2 border rounded" />
              )}
            </div>

            <Textarea
              label="Additional Notes / Email ID"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please approve access fast. My registered email is siddharth@studysetu.co.in"
              rows={2}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting} className="flex-1 justify-center">
                Submit Request
              </Button>
              <a href={`https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button type="button" variant="outline" className="h-full flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" /> Support
                </Button>
              </a>
            </div>
          </form>

        </div>

      </Card>
    </div>
  );
};
