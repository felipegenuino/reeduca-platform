import { requireCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from './components/AdminShell';

export const metadata = {
  title: 'Admin | Reeduca Fisio',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireCurrentUser();

  if (profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminShell>{children}</AdminShell>;
}
