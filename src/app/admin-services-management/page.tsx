import type { Metadata } from 'next';
import AdminLayout from '@/components/common/AdminLayout';
import ServicesManagementInteractive from './components/ServicesManagementInteractive';

export const metadata: Metadata = {
  title: 'Services Management - Quirky Umbrella Admin',
  description: 'Manage service offerings with comprehensive CRUD operations, rich text editing, and SEO optimization tools for your corporate website.',
};

export default function AdminServicesManagementPage() {
  return (
    <AdminLayout>
      <ServicesManagementInteractive />
    </AdminLayout>
  );
}