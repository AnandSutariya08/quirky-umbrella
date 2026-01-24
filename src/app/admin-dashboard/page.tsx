import type { Metadata } from 'next';
import AdminLayout from '@/components/common/AdminLayout';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Dashboard - Quirky Umbrella Admin',
  description: 'Admin dashboard with overview and analytics for your website.',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardInteractive />
    </AdminLayout>
  );
}
