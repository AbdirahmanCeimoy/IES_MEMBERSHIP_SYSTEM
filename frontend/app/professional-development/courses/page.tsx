import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'CPD Courses' };
export default function CoursesPage() {
  return (
    <StubPage
      eyebrow="Courses"
      title="CPD Courses"
      description="Short, focused CPD courses designed to strengthen specific technical and professional skills."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: routes.professionalDevelopment.root },
        { label: 'Courses' },
      ]}
    />
  );
}
