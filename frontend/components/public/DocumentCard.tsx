import { Card } from '@/components/ui/Card';

export interface DocumentItem {
  title: string;
  description?: string;
  href: string;
  type?: string;
}

export const DocumentCard = ({ doc }: { doc: DocumentItem }) => (
  <Card className="flex items-start gap-3" padded interactive>
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#035CB3]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="flex flex-col gap-1">
      <a href={doc.href} className="text-sm font-semibold text-[#022D5A] hover:text-[#035CB3]">
        {doc.title}
      </a>
      {doc.description && <p className="text-xs text-slate-600">{doc.description}</p>}
      {doc.type && <span className="text-[10px] uppercase tracking-widest text-slate-500">{doc.type}</span>}
    </div>
  </Card>
);
