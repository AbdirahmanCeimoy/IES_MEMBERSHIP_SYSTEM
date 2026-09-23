import { Section } from '@/components/layout/Section';
import { CVTable } from './CVTable';

export const metadata = { title: 'View CVs' };

export default function ViewCVsPage() {
  return (
    <Section>
      <CVTable />
    </Section>
  );
}
