import { Card } from '@/components/ui/Card';

export interface Partner {
  name: string;
  href: string;
  scope?: string;
}

export const PartnerCard = ({ partner }: { partner: Partner }) => (
  <Card className="flex flex-col gap-1" padded interactive>
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-semibold text-[#082B55] hover:text-[#0047AB]"
    >
      {partner.name}
    </a>
    {partner.scope && <p className="text-xs text-slate-500">{partner.scope}</p>}
    <p className="mt-1 truncate text-[11px] text-slate-500">{partner.href}</p>
  </Card>
);
