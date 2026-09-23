import type { ReactNode } from 'react';
import { AdminShell } from './AdminShell';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
