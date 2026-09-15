import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Engineering Magazine' };
export default function MagazinePage() {
  return (
    <StubPage
      eyebrow="Publications"
      title="Engineering in Somalia Magazine"
      description="The IES Engineering in Somalia Magazine - technical articles, industry insights and IES updates."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Magazine' },
      ]}
    />
  );
}
