import { notFound } from 'next/navigation';
import { GradeRequirementsClient } from './GradeRequirementsClient';
import { gradeRequirements, type GradeCode } from '@/data/grade-requirements';

const isGradeCode = (value: string): value is GradeCode =>
  ['STUDENT', 'GRADUATE', 'ASSOCIATE', 'CORPORATE', 'SENIOR', 'FELLOW', 'GRAD_TECHNICIAN', 'GRAD_TECHNOLOGIST'].includes(value);

export function generateStaticParams() {
  return Object.keys(gradeRequirements).map((code) => ({ grade: code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;
  const upper = grade.toUpperCase();
  if (!isGradeCode(upper)) return { title: 'Membership Requirements' };
  return { title: `${gradeRequirements[upper].label} - Requirements` };
}

export default async function GradeRequirementsPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = await params;
  const upper = grade.toUpperCase();
  if (!isGradeCode(upper)) return notFound();
  const spec = gradeRequirements[upper];
  return <GradeRequirementsClient spec={spec} />;
}
