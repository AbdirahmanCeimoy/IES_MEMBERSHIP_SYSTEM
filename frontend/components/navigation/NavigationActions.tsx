import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

interface NavigationActionsProps {
  className?: string;
  align?: 'row' | 'stack';
}

export const NavigationActions = ({ className, align = 'row' }: NavigationActionsProps) => (
  <div
    className={cn(
      'flex items-center gap-2',
      align === 'stack' && 'w-full flex-col items-stretch',
      className,
    )}
  >
    <Button
      href={site.cta.secondary.href}
      variant="ghost"
      size="sm"
      className={cn(align === 'stack' && 'justify-center')}
    >
      {site.cta.secondary.label}
    </Button>
    <Button
      href={site.cta.primary.href}
      variant="primary"
      size="sm"
      className={cn(align === 'stack' && 'justify-center')}
    >
      {site.cta.primary.label}
    </Button>
  </div>
);
