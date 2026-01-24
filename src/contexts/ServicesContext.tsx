'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { servicesService } from '@/lib/services';
import type { Service } from '@/types/service';

interface ServicesContextType {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider = ({ children }: ServicesProviderProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeServices = await servicesService.getActive();
      setServices(activeServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        isLoading,
        error,
        refreshServices: fetchServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
