import type { Metadata } from 'next';
import AdminLoginInteractive from './components/AdminLoginInteractive';

export const metadata: Metadata = {
  title: 'Admin Login - Quirky Umbrella',
  description: 'Secure authentication for administrative access to Quirky Umbrella admin panel.',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-6">
      <AdminLoginInteractive />
    </div>
  );
}