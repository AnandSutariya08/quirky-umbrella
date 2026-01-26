import type { Metadata } from 'next';
import AdminLayout from '@/components/common/AdminLayout';
import IndustriesManagementInteractive from './components/IndustriesManagementInteractive';

export const metadata: Metadata = {
  title: 'Industries Management - Quirky Umbrella Admin',
  description:
    'Manage industry content, SEO settings, and publication status with advanced editing tools and comprehensive content lifecycle management.',
};

export default function AdminIndustriesManagementPage() {
  return (
    <AdminLayout>
      <IndustriesManagementInteractive />
    </AdminLayout>
  );
}
