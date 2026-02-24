'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type {
  Service,
  ServiceDeliverable,
  ProcessStep,
  IndustryUseCase,
  FAQ,
} from '@/types/service';
import ImageUpload from './ImageUpload';

interface ServiceFormNewProps {
  service: Service | null;
  onSave: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ServiceFormNew = ({ service, onSave, onCancel }: ServiceFormNewProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    imageUrl: '',
    whatIsIt: {
      title: 'What Are Workflow Automations?',
      content: '',
    },
    deliverables: {
      title: 'What Our Workflow Automations Deliver',
      items: [{ text: '' }],
    },
    approach: {
      title: 'Our Approach',
      content: '',
      processTitle: 'Our process includes',
      processSteps: [{ text: '' }],
    },
    useCases: {
      title: 'Workflow Automation Use Cases Across Industries',
      industries: [{ title: '', items: [''] }],
    },
    cta: {
      title: 'Ready to Automate Smarter?',
      content: '',
      buttonText: 'Book a Workflow Automation Consultation',
    },
    faqs: [{ question: '', answer: '' }],
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        slug: service.slug,
        tagline: service.tagline,
        description: service.description,
        imageUrl: service.imageUrl || '',
        whatIsIt: service.whatIsIt,
        deliverables: service.deliverables,
        approach: service.approach,
        useCases: service.useCases,
        cta: service.cta,
        faqs: service.faqs,
        isActive: service.isActive,
      });
    }
  }, [service]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        items: [...prev.deliverables.items, { text: '' }],
      },
    }));
  };

  const removeDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        items: prev.deliverables.items.filter((_, i) => i !== index),
      },
    }));
  };

  const updateDeliverable = (index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        items: prev.deliverables.items.map((item, i) => (i === index ? { text } : item)),
      },
    }));
  };

  const addProcessStep = () => {
    setFormData((prev) => ({
      ...prev,
      approach: {
        ...prev.approach,
        processSteps: [...prev.approach.processSteps, { text: '' }],
      },
    }));
  };

  const removeProcessStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      approach: {
        ...prev.approach,
        processSteps: prev.approach.processSteps.filter((_, i) => i !== index),
      },
    }));
  };

  const updateProcessStep = (index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      approach: {
        ...prev.approach,
        processSteps: prev.approach.processSteps.map((step, i) => (i === index ? { text } : step)),
      },
    }));
  };

  const addIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: [...prev.useCases.industries, { title: '', items: [''] }],
      },
    }));
  };

  const removeIndustry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: prev.useCases.industries.filter((_, i) => i !== index),
      },
    }));
  };

  const updateIndustry = (index: number, field: 'title' | 'items', value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: prev.useCases.industries.map((industry, i) =>
          i === index ? { ...industry, [field]: value } : industry
        ),
      },
    }));
  };

  const addIndustryItem = (industryIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: prev.useCases.industries.map((industry, i) =>
          i === industryIndex ? { ...industry, items: [...industry.items, ''] } : industry
        ),
      },
    }));
  };

  const removeIndustryItem = (industryIndex: number, itemIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: prev.useCases.industries.map((industry, i) =>
          i === industryIndex
            ? { ...industry, items: industry.items.filter((_, j) => j !== itemIndex) }
            : industry
        ),
      },
    }));
  };

  const updateIndustryItem = (industryIndex: number, itemIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      useCases: {
        ...prev.useCases,
        industries: prev.useCases.industries.map((industry, i) =>
          i === industryIndex
            ? {
                ...industry,
                ...industry,
                items: industry.items.map((item, j) => (j === itemIndex ? value : item)),
              }
            : industry
        ),
      },
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty items
    const cleanedData = {
      ...formData,
      deliverables: {
        ...formData.deliverables,
        items: formData.deliverables.items.filter((item) => item.text.trim()),
      },
      approach: {
        ...formData.approach,
        processSteps: formData.approach.processSteps.filter((step) => step.text.trim()),
      },
      useCases: {
        ...formData.useCases,
        industries: formData.useCases.industries
          .map((industry) => ({
            ...industry,
            items: industry.items.filter((item) => item.trim()),
          }))
          .filter((industry) => industry.title.trim() && industry.items.length > 0),
      },
      faqs: formData.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
    };

    // Validate manually to get errors synchronously
    const validationErrors: Record<string, string> = {};

    if (!cleanedData.title.trim()) validationErrors.title = 'Title is required';
    if (!cleanedData.slug.trim()) validationErrors.slug = 'Slug is required';
    if (!cleanedData.tagline.trim()) validationErrors.tagline = 'Tagline is required';
    if (!cleanedData.description.trim()) validationErrors.description = 'Description is required';
    if (!cleanedData.whatIsIt.content.trim())
      validationErrors.whatIsIt = 'What Is It content is required';
    if (cleanedData.deliverables.items.length === 0)
      validationErrors.deliverables = 'At least one deliverable is required';
    if (!cleanedData.approach.content.trim())
      validationErrors.approach = 'Approach content is required';
    if (cleanedData.approach.processSteps.length === 0)
      validationErrors.processSteps = 'At least one process step is required';
    if (cleanedData.useCases.industries.length === 0)
      validationErrors.useCases = 'At least one industry use case is required';
    if (!cleanedData.cta.content.trim()) validationErrors.cta = 'CTA content is required';
    if (cleanedData.faqs.length === 0) validationErrors.faqs = 'At least one FAQ is required';

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      onSave(cleanedData);
    } else {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const errorElement =
          document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(`#${firstErrorField}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-neutral-md p-8">
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[2rem] shadow-neutral-xl border border-border overflow-hidden animate-slide-up">
      <div className="p-8 border-b border-border sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black font-heading text-foreground tracking-tight">
            {service ? 'Refine Service' : 'Design New Service'}
          </h2>
          <button
            onClick={onCancel}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-all press-scale border border-border"
            title="Close"
          >
            <Icon name="XMarkIcon" size={28} className="text-foreground" />
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-12 max-h-[calc(100vh-200px)] overflow-y-auto scroll-smooth"
      >
        {/* Basic Information */}
        <section className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="DocumentTextIcon" size={24} className="text-primary" />
            </div>
            <h3 className="text-2xl font-black font-heading text-foreground">
              Core Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all ${
                    errors.title ? 'border-error' : 'border-border hover:border-primary/50'
                  }`}
                  placeholder="e.g., Workflow Automations"
                />
                {errors.title && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.title}
                </p>}
              </div>

              <div className="group">
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
                  Slug <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground font-mono text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all ${
                    errors.slug ? 'border-error' : 'border-border hover:border-primary/50'
                  }`}
                  placeholder="workflow-automations"
                />
                {errors.slug && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.slug}
                </p>}
                <p className="mt-2 text-xs font-bold text-primary/60 bg-primary/5 px-3 py-1 rounded-full inline-block">
                  URL: /services/{formData.slug || 'service-slug'}
                </p>
              </div>
            </div>

            <div className="lg:pl-8 lg:border-l border-border/50">
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onUploadComplete={(url) => handleChange('imageUrl', url)}
                onImageRemove={() => handleChange('imageUrl', '')}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
              Tagline <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all ${
                errors.tagline ? 'border-error' : 'border-border hover:border-primary/50'
              }`}
              placeholder="Intelligent Systems That Run Your Business"
            />
            {errors.tagline && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.tagline}
            </p>}
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none ${
                errors.description ? 'border-error' : 'border-border hover:border-primary/50'
              }`}
              placeholder="Main description paragraph..."
            />
            {errors.description && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.description}
            </p>}
          </div>

          <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm w-fit">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-6 h-6 text-primary rounded-lg border-2 border-border focus:ring-primary transition-all cursor-pointer"
            />
            <label htmlFor="isActive" className="text-base font-black text-foreground cursor-pointer select-none">
              Visible to Visitors
            </label>
          </div>
        </section>

        {/* Concept Section */}
        <section className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="QuestionMarkCircleIcon" size={24} className="text-primary" />
            </div>
            <h3 className="text-2xl font-black font-heading text-foreground">
              Core Concept
            </h3>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Section Title</label>
            <input
              type="text"
              value={formData.whatIsIt.title}
              onChange={(e) => handleNestedChange('whatIsIt', 'title', e.target.value)}
              className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
              Detailed Content <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.whatIsIt.content}
              onChange={(e) => handleNestedChange('whatIsIt', 'content', e.target.value)}
              rows={6}
              className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none ${
                errors.whatIsIt ? 'border-error' : 'border-border hover:border-primary/50'
              }`}
              placeholder="Explain the service in detail..."
            />
            {errors.whatIsIt && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.whatIsIt}
            </p>}
          </div>
        </section>

        {/* Deliverables Section */}
        <section className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="CheckCircleIcon" size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black font-heading text-foreground">
                Key Deliverables
              </h3>
            </div>
            <button
              type="button"
              onClick={addDeliverable}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-[1.02] hover:shadow-xl transition-all press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={18} />
              Add Item
            </button>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Section Title</label>
            <input
              type="text"
              value={formData.deliverables.title}
              onChange={(e) => handleNestedChange('deliverables', 'title', e.target.value)}
              className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
            />
          </div>

          <div className="space-y-4">
            {formData.deliverables.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 group/item">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  className="flex-1 px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all group-hover/item:border-primary/30"
                  placeholder="e.g., Real-time data synchronization"
                />
                {formData.deliverables.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="p-4 text-error hover:bg-error/10 rounded-2xl transition-all"
                  >
                    <Icon name="TrashIcon" size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.deliverables && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.deliverables}
          </p>}
        </section>

        {/* Approach Section */}
        <section className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="LightBulbIcon" size={24} className="text-primary" />
            </div>
            <h3 className="text-2xl font-black font-heading text-foreground">
              Strategic Approach
            </h3>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Section Title</label>
            <input
              type="text"
              value={formData.approach.title}
              onChange={(e) => handleNestedChange('approach', 'title', e.target.value)}
              className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
              Strategy Overview <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.approach.content}
              onChange={(e) => handleNestedChange('approach', 'content', e.target.value)}
              rows={6}
              className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none ${
                errors.approach ? 'border-error' : 'border-border hover:border-primary/50'
              }`}
              placeholder="Describe the overall strategy..."
            />
            {errors.approach && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.approach}
            </p>}
          </div>

          <div className="space-y-6 pt-8 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="group flex-1 mr-4">
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">Process List Header</label>
                <input
                  type="text"
                  value={formData.approach.processTitle}
                  onChange={(e) => handleNestedChange('approach', 'processTitle', e.target.value)}
                  className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
                />
              </div>
              <button
                type="button"
                onClick={addProcessStep}
                className="mt-6 px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl font-black text-sm hover:scale-[1.02] hover:shadow-xl transition-all press-scale flex items-center gap-2"
              >
                <Icon name="PlusIcon" size={18} />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {formData.approach.processSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 group/step">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-primary flex-shrink-0 border border-border">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => updateProcessStep(index, e.target.value)}
                    className="flex-1 px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all group-hover/step:border-primary/30"
                    placeholder="e.g., Discovery & Infrastructure Analysis"
                  />
                  {formData.approach.processSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProcessStep(index)}
                      className="p-4 text-error hover:bg-error/10 rounded-2xl transition-all"
                    >
                      <Icon name="TrashIcon" size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Cases */}
        <section className="space-y-8 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="BriefcaseIcon" size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black font-heading text-foreground">
                Industry Specifics
              </h3>
            </div>
            <button
              type="button"
              onClick={addIndustry}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-[1.02] hover:shadow-xl transition-all press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={18} />
              Add Vertical
            </button>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Section Title</label>
            <input
              type="text"
              value={formData.useCases.title}
              onChange={(e) => handleNestedChange('useCases', 'title', e.target.value)}
              className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {formData.useCases.industries.map((industry, indIdx) => (
              <div key={indIdx} className="p-8 bg-card rounded-[2rem] border-2 border-border/50 space-y-6 relative group/ind shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Vertical Name</label>
                    <input
                      type="text"
                      value={industry.title}
                      onChange={(e) => updateIndustry(indIdx, 'title', e.target.value)}
                      className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
                      placeholder="e.g., Global E-commerce"
                    />
                  </div>
                  {formData.useCases.industries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIndustry(indIdx)}
                      className="mt-6 p-4 text-error hover:bg-error/10 rounded-2xl transition-all"
                    >
                      <Icon name="TrashIcon" size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">Applications</label>
                    <button
                      type="button"
                      onClick={() => addIndustryItem(indIdx)}
                      className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <Icon name="PlusIcon" size={14} />
                      Add App
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {industry.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2 group/item">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateIndustryItem(indIdx, itemIdx, e.target.value)}
                          className="flex-1 px-4 py-3 bg-muted/30 border-2 border-border rounded-xl text-foreground font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all group-hover/item:border-primary/30"
                          placeholder="Application detail..."
                        />
                        {industry.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIndustryItem(indIdx, itemIdx)}
                            className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                          >
                            <Icon name="XMarkIcon" size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Conversion */}
        <section className="space-y-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8 rounded-[2rem] border-2 border-primary/20 transition-all hover:border-primary/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Icon name="MegaphoneIcon" size={24} />
            </div>
            <h3 className="text-2xl font-black font-heading text-foreground">
              Conversion Focus
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">Primary CTA Header</label>
              <input
                type="text"
                value={formData.cta.title}
                onChange={(e) => handleNestedChange('cta', 'title', e.target.value)}
                className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">Button Text</label>
              <input
                type="text"
                value={formData.cta.buttonText}
                onChange={(e) => handleNestedChange('cta', 'buttonText', e.target.value)}
                className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
              Impact Statement <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.cta.content}
              onChange={(e) => handleNestedChange('cta', 'content', e.target.value)}
              rows={3}
              className={`w-full px-5 py-4 bg-background border-2 rounded-2xl text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none ${
                errors.cta ? 'border-error' : 'border-border hover:border-primary/50'
              }`}
              placeholder="A compelling reason for them to click..."
            />
            {errors.cta && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.cta}
            </p>}
          </div>
        </section>

        {/* FAQ Management */}
        <section className="space-y-8 bg-muted/30 p-8 rounded-[2rem] border border-border/50 transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black font-heading text-foreground">
                Knowledge Hub
              </h3>
            </div>
            <button
              type="button"
              onClick={addFAQ}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:scale-[1.02] hover:shadow-xl transition-all press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={18} />
              Add FAQ
            </button>
          </div>

          <div className="space-y-6">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-8 bg-card rounded-[2rem] border-2 border-border/50 space-y-4 relative group/faq shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/40">Entry #{index + 1}</span>
                  {formData.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                    >
                      <Icon name="TrashIcon" size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50"
                  placeholder="The user's burning question..."
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-muted/30 border-2 border-border rounded-2xl text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:border-primary/50 resize-none"
                  placeholder="The clear, expert resolution..."
                />
              </div>
            ))}
          </div>
          {errors.faqs && <p className="mt-2 text-sm font-bold text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.faqs}
          </p>}
        </section>

        {/* Final Actions */}
        <div className="pt-12 border-t border-border/50 flex flex-col sm:flex-row items-center justify-end gap-6 pb-12">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-12 py-5 bg-muted text-foreground rounded-[1.5rem] font-black text-xl hover:bg-muted/70 transition-all press-scale"
          >
            Abandon Edits
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-16 py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black text-xl shadow-2xl hover:scale-[1.02] hover:shadow-primary/30 transition-all press-scale"
          >
            {service ? 'Commit Updates' : 'Launch Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormNew;
