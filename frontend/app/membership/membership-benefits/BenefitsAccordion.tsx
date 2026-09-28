'use client';

import { useState } from 'react';
import type { GradeBenefit } from './page';

interface Props {
  items: GradeBenefit[];
}

export const BenefitsAccordion = ({ items }: Props) => {
  // Auto-open the first item by default
  const [openIndex, setOpenIndex] = useState<string | null>(
    items.length > 0 ? items[0].index : null,
  );

  const toggle = (index: string) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openIndex === item.index;
        return (
          <div
            key={item.index}
            className="overflow-hidden rounded-lg border border-[#035CB3]/20 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(item.index)}
              aria-expanded={isOpen}
              className={
                'flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors ' +
                'bg-[#035CB3] text-white hover:bg-[#48C184]'
              }
            >
              <span className="flex items-center gap-3">
                <span className="text-sm font-bold">
                  {item.index} {item.grade}
                </span>
                {item.postnominal && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {item.postnominal}
                  </span>
                )}
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xl font-bold leading-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[#035CB3]/15 bg-white p-6">
                <p className="mb-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                  {item.description}
                </p>
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#035CB3]">
                  Benefits:
                </p>
                <ul className="flex flex-col gap-2">
                  {item.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                    >
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
