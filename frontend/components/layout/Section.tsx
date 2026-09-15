import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SiteContainer } from './SiteContainer';

type SectionSpacing = 'compact' | 'default' | 'relaxed';
type SectionTone = 'default' | 'muted' | 'primary' | 'dark';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: SectionSpacing;
  tone?: SectionTone;
  contain?: boolean;
  id?: string;
}

const spacingMap: Record<SectionSpacing, string> = {
  compact: 'py-4 sm:py-6',
  default: 'py-8 sm:py-12',
  relaxed: 'py-12 sm:py-16 lg:py-20',
};

const toneMap: Record<SectionTone, string> = {
  default: 'bg-white',
  muted: 'bg-slate-50',
  primary: 'bg-[#0047AB] text-white',
  dark: 'bg-[#082B55] text-white',
};

export const Section = ({
  children,
  className,
  spacing = 'default',
  tone = 'default',
  contain = true,
  id,
}: SectionProps) => (
  <section id={id} className={cn(spacingMap[spacing], toneMap[tone], className)}>
    {contain ? <SiteContainer>{children}</SiteContainer> : children}
  </section>
);
