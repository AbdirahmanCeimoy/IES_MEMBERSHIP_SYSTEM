import Image from 'next/image';

export interface Partner {
  name: string;
  href: string;
  scope?: string;
  logo?: string;
}

export const PartnerCard = ({ partner }: { partner: Partner }) => (
  <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#035CB3]/40 hover:shadow-md">
    {partner.logo && (
      <div className="relative flex h-32 w-full items-center justify-center bg-slate-50 p-4">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={160}
          height={100}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )}
    <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 p-4">
      <p className="text-sm font-semibold leading-snug text-[#022D5A]">
        {partner.name}
      </p>
      <div className="mt-auto pt-2">
        <a
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#48C184]"
        >
          Visit Website
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  </div>
);
