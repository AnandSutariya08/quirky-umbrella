import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import { servicesService } from '@/lib/services';
import ServiceDetail from './components/ServiceDetail';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Generate static params for all active services
export async function generateStaticParams() {
  try {
    const services = await servicesService.getAll();
    const activeServices = services.filter((service) => service.isActive);
    
    return activeServices.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for services:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await servicesService.getBySlug(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.title} - Quirky Umbrella`,
    description: service.tagline,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await servicesService.getBySlug(params.slug);

  if (!service || !service.isActive) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        <ServiceDetail service={service} />
      </main>
      <ClientFooter />
    </div>
  );
}
