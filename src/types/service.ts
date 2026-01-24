export interface ServiceDeliverable {
  text: string;
}

export interface ProcessStep {
  text: string;
}

export interface IndustryUseCase {
  title: string;
  items: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  whatIsIt: {
    title: string;
    content: string;
  };
  deliverables: {
    title: string;
    items: ServiceDeliverable[];
  };
  approach: {
    title: string;
    content: string;
    processTitle: string;
    processSteps: ProcessStep[];
  };
  useCases: {
    title: string;
    industries: IndustryUseCase[];
  };
  cta: {
    title: string;
    content: string;
    buttonText: string;
  };
  faqs: FAQ[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}
