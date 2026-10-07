import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

interface NavigationActionsProps {
  className?: string;
  align?: 'row' | 'stack';
}

// Sized to match the desktop nav links so both sit on the same text line.
const desktopSize = 'h-9 rounded-lg px-3 text-[13.5px] leading-none';

export const NavigationActions = ({ className, align = 'row' }: NavigationActionsProps) => (
  <div
    className={cn(
      'flex items-center gap-1 whitespace-nowrap',
      align === 'stack' && 'w-full flex-col items-stretch',
      className,
    )}
  >
    <Button
      href={site.cta.secondary.href}
      variant="ghost"
      size="sm"
      className={cn(align === 'stack' ? 'justify-center' : desktopSize)}
    >
      {site.cta.secondary.label}
    </Button>
    <Button
      href={site.cta.primary.href}
      variant="primary"
      size="sm"
      className={cn(align === 'stack' ? 'justify-center' : desktopSize)}
    >
      {site.cta.primary.label}
    </Button>
  </div>
);
