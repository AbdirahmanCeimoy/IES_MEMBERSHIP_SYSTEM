'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { site } from '@/config/site';

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'contact' | 'report';
}

const modalConfig = {
  contact: {
    title: 'Send Us a Message',
    subtitle: 'Fill out the form below and we\'ll respond as soon as possible.',
    successMessage: 'Thank you for reaching out. Our team will get back to you as soon as possible.',
    messagePlaceholder: 'Project description or your inquiry...',
    categories: ['General Inquiry', 'Membership', 'Finance', 'IES Programs', 'Other Inquiry'],
  },
  report: {
    title: 'Report Violations by Filling the Form',
    subtitle: '',
    successMessage: 'Your report has been submitted. Our team will review it and take appropriate action.',
    messagePlaceholder: 'Describe the violation or concern in detail...',
    categories: ['General Inquiry', 'Membership', 'Finance', 'IES Programs', 'Other Inquiry'],
  },
};

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ContactFormModal = ({ open, onClose, mode = 'contact' }: ContactFormModalProps) => {
  const config = modalConfig[mode];
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isMember, setIsMember] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameRef.current?.focus(), 100);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      category: formData.get('category') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      regNumber: isMember ? (formData.get('regNumber') as string) : undefined,
      isMember,
      type: mode,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 px-4 pt-16 pb-10 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'report' ? 'Report violations' : 'Contact form'}
    >
      <div className="relative w-full max-w-4xl animate-[slideUp_0.3s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#48C184]/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#48C184" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {mode === 'report' ? 'Report Submitted!' : 'Message Sent!'}
            </h3>
            <p className="max-w-sm text-sm text-slate-500">{config.successMessage}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg bg-[#035CB3] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#024A8F]"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            {/* Left: Get in Touch info */}
            <div className="border-b border-slate-100 bg-slate-50 p-8 md:border-b-0 md:border-r">
              <h2 className="text-xl font-bold text-slate-800">Get in Touch</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Reach out to us directly or fill out the form, and we&apos;ll get back to you as soon as possible.
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/8">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Office Address</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{site.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/8">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Phone Numbers</p>
                    <div className="mt-1 flex flex-col text-sm text-slate-500">
                      {site.contact.phones.map((phone) => (
                        <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-[#035CB3]">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/8">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Email Address</p>
                    <div className="mt-1 flex flex-col text-sm text-slate-500">
                      <a href={`mailto:${site.contact.generalEmail}`} className="transition-colors hover:text-[#035CB3]">{site.contact.generalEmail}</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/8">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Working Hours</p>
                    <p className="mt-1 text-sm text-slate-500">{site.contact.workingDays}</p>
                    <p className="text-sm text-slate-500">{site.contact.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#022D5A]">{config.title}</h3>
              {config.subtitle && <p className="mt-1 text-sm text-slate-500">{config.subtitle}</p>}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isMember}
                    onChange={(e) => setIsMember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#035CB3] focus:ring-[#035CB3]/30"
                  />
                  <span className="text-sm font-medium text-slate-700">I am an IES Member</span>
                </label>

                {isMember && (
                  <input
                    name="regNumber"
                    type="text"
                    required
                    placeholder="Enter Membership Registration Number (e.g; IES-00350)"
                    className="w-full rounded-lg border border-slate-200 bg-amber-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                  />
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    ref={nameRef}
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Your Email Address"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <select
                      name="category"
                      required
                      defaultValue=""
                      className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                    >
                      <option value="" disabled>
                        {mode === 'report' ? 'Violation Type' : 'Inquiry Category'}
                      </option>
                      {config.categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="Subject"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                  />
                </div>

                <textarea
                  name="message"
                  rows={4}
                  placeholder={config.messagePlaceholder}
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20"
                />

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Attach Document (Optional)</p>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-500">
                    <span className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">
                      Choose File
                    </span>
                    <input type="file" name="attachment" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" />
                    <span className="text-xs text-slate-400">PDF, Word, or Images (Max 5MB)</span>
                  </label>
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600">Something went wrong. Please try again or email us at {site.contact.generalEmail}.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all',
                    status === 'sending'
                      ? 'cursor-not-allowed bg-[#035CB3]/60'
                      : 'bg-[#035CB3] hover:bg-[#024A8F] hover:shadow-lg',
                  )}
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'SUBMIT'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
