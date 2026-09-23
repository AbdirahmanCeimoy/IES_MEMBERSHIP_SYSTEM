import { Button } from '@/components/ui/Button';
import { Section } from '@/components/layout/Section';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: 'primary' | 'muted' | 'default';
}

export const CTASection = ({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  tone = 'primary',
}: CTASectionProps) => (
  <Section tone={tone} spacing="relaxed">
    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-widest text-[#48C184]">
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && <p className="max-w-2xl text-sm text-blue-50">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href={primaryHref} variant="accent">
          {primaryLabel}
        </Button>
        {secondaryLabel && secondaryHref && (
          <Button
            href={secondaryHref}
            variant="ghost"
            className="border border-white/40 text-white hover:bg-white/10"
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  </Section>
);
