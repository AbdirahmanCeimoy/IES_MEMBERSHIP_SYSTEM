import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export default function INWEDRootAliasPage() {
  redirect(routes.events.annualEvents.internationalWomenInEngineeringDay.root);
}