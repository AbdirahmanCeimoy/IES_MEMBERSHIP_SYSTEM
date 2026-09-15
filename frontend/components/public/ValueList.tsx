import { cn } from '@/lib/cn';

interface ValueListProps {
  items: string[];
  className?: string;
}

export const ValueList = ({ items, className }: ValueListProps) => (
  <ul className={cn('flex flex-col gap-2', className)}>
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0047AB]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);
