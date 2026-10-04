import { notFound, redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export default async function INWEDYearAliasPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  if (year !== '2025' && year !== '2026') notFound();

  redirect(`${routes.events.annualEvents.internationalWomenInEngineeringDay.root}/${year}`);
}