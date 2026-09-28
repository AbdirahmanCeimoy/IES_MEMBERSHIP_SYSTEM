import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export default function MembershipPage() {
  redirect(routes.membership.becomeMember);
}
