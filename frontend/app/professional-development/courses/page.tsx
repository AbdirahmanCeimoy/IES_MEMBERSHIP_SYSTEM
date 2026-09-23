import { StubPage } from '@/components/public/StubPage';
export const metadata = { title: 'CPD Courses' };
export default function CoursesPage() {
  return (
    <StubPage
      eyebrow="Courses"
      title="CPD Courses"
      description="Short, focused CPD courses designed to strengthen specific technical and professional skills."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: '/professional-development' },
        { label: 'Courses' },
      ]}
    />
  );
}
