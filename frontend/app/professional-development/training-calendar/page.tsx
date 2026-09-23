import { StubPage } from '@/components/public/StubPage';
export const metadata = { title: 'Training Calendar' };
export default function TrainingCalendarPage() {
  return (
    <StubPage
      eyebrow="Training"
      title="IES Training Calendar 2026"
      description="Structured training programmes offered by IES throughout the year."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: '/professional-development' },
        { label: 'Training Calendar' },
      ]}
    />
  );
}
