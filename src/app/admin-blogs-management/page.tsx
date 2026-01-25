import type { Metadata } from 'next';
import AdminLayout from '@/components/common/AdminLayout';
import BlogsManagementInteractive from './components/BlogsManagementInteractive';

export const metadata: Metadata = {
  title: 'Blogs Management - Quirky Umbrella Admin',
  description: 'Manage blog posts with comprehensive publishing workflows, SEO optimization tools, and advanced content editing capabilities for Quirky Umbrella.',
};

export default function AdminBlogsManagementPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-6 py-8">
          <BlogsManagementInteractive />
        </div>
      </div>
    </AdminLayout>
  );
}