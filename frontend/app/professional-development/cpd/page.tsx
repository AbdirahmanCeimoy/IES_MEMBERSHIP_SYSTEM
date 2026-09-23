import { StubPage } from '@/components/public/StubPage';

export const metadata = { title: 'Continuing Professional Development' };

export default function CPDPage() {
  return (
    <StubPage
      eyebrow="Professional Development"
      title="Continuing Professional Development (CPD)"
      description="IES organizes professional development programmes, technical workshops, and training courses to support lifelong learning and keep members aligned with emerging technologies, industry standards and best engineering practices."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: '/professional-development' },
        { label: 'CPD' },
      ]}
      note="IES DECISION REQUIRED - the CPD framework, credit rules and 2026 calendar will be published here once approved."
    />
  );
}
