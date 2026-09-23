'use client';

import { useState, type FormEvent } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';

const disciplines = [
  'Civil',
  'Mechanical',
  'Electrical',
  'Computer',
  'Chemical',
  'Petroleum',
  'Architectural',
  'Telecommunications',
  'Environmental',
  'Other',
] as const;

const inputClasses =
  'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm ' +
  'placeholder:text-slate-400 focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]';

const labelClasses = 'block text-sm font-medium text-[#022D5A]';

export default function SubmitCVPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    console.log('CV submission:', data);
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Talent Pool"
        title="Submit CV"
        description="Add your CV to the IES talent repository so employers and partner organizations can find you."
      />
      <Section>
        <SectionHeading eyebrow="Your details" title="CV Submission Form" />

        {submitted ? (
          <Card padded className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-[#022D5A]">Thank you!</h3>
            <p className="mt-2 text-sm text-slate-600">
              Your CV has been submitted successfully. IES will review your submission and add it to the talent repository.
            </p>
          </Card>
        ) : (
          <Card padded className="mt-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                <input id="fullName" name="fullName" type="text" required className={inputClasses} placeholder="e.g. Mohamed Ali" />
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input id="email" name="email" type="email" required className={inputClasses} placeholder="you@example.com" />
              </div>

              <div>
                <label htmlFor="phone" className={labelClasses}>Phone</label>
                <input id="phone" name="phone" type="tel" required className={inputClasses} placeholder="+252 XX XXX XXXX" />
              </div>

              <div>
                <label htmlFor="discipline" className={labelClasses}>Engineering Discipline</label>
                <select id="discipline" name="discipline" required className={inputClasses}>
                  <option value="">Select a discipline</option>
                  {disciplines.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="experience" className={labelClasses}>Years of Experience</label>
                <input id="experience" name="experience" type="number" min={0} max={60} required className={inputClasses} placeholder="e.g. 5" />
              </div>

              <div>
                <label htmlFor="cv" className={labelClasses}>Upload CV</label>
                <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#035CB3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#022D5A]" />
                <p className="mt-1 text-xs text-slate-500">Accepted formats: PDF, DOC, DOCX (max 5 MB)</p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[#035CB3] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#022D5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3] focus-visible:ring-offset-2"
              >
                Submit CV
              </button>
            </form>
          </Card>
        )}
      </Section>
    </>
  );
}
