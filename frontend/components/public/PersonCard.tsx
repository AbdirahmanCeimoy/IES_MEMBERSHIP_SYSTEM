import { Card } from '@/components/ui/Card';

export interface Person {
  name: string;
  role: string;
  organization?: string;
  initials?: string;
  email?: string;
}

interface PersonCardProps {
  person: Person;
}

const deriveInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

export const PersonCard = ({ person }: PersonCardProps) => {
  const initials = person.initials ?? deriveInitials(person.name);
  return (
    <Card className="flex items-start gap-4" padded>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0047AB]">
        {initials}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-[#082B55]">{person.name}</p>
        <p className="text-xs text-slate-600">{person.role}</p>
        {person.organization && (
          <p className="text-xs text-slate-500">{person.organization}</p>
        )}
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="mt-1 text-xs text-[#0047AB] hover:underline"
          >
            {person.email}
          </a>
        )}
      </div>
    </Card>
  );
};
