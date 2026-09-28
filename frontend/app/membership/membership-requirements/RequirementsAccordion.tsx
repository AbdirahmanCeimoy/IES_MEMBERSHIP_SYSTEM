'use client';

import { useState } from 'react';
import type { RequirementItem } from './page';

interface Props {
  items: RequirementItem[];
}

export const RequirementsAccordion = ({ items }: Props) => {
  // Auto-open the first item by default
  const [openIndex, setOpenIndex] = useState<string | null>(
    items.length > 0 ? items[0].title : null,
  );

  const toggle = (index: string) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openIndex === item.title;
        return (
          <div
            key={item.title}
            className="overflow-hidden rounded-lg border border-[#035CB3]/20 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(item.title)}
              aria-expanded={isOpen}
              className={
                'flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors ' +
                'bg-[#035CB3] text-white hover:bg-[#48C184]'
              }
            >
              <span className="text-sm font-bold">{item.title}</span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xl font-bold leading-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[#035CB3]/15 bg-white p-6">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Below are the mandatory application requirements needed to be registered in this category:
                </p>
                <ul className="flex flex-col gap-2">
                  {item.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                    >
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#48C184]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3AA870]">
                  Application Fee: {item.fee}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
