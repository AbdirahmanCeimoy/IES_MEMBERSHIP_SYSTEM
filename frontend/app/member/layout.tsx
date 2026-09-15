import type { ReactNode } from 'react';
import { MemberShell } from './MemberShell';

export const metadata = { title: 'Member Dashboard' };

export default function MemberLayout({ children }: { children: ReactNode }) {
  return <MemberShell>{children}</MemberShell>;
}
