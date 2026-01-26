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

    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Raw form data:', formData);

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

    console.log('Cleaned data:', cleanedData);

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

    console.log('Validation errors:', validationErrors);
    console.log('Has errors:', Object.keys(validationErrors).length > 0);

    if (Object.keys(validationErrors).length === 0) {
      console.log('✓ Validation passed! Calling onSave...');
      setErrors({});
      onSave(cleanedData);
    } else {
      console.log('✗ Validation failed with errors:', validationErrors);
      setErrors(validationErrors);

      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      console.log('Scrolling to first error field:', firstErrorField);
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
    <div className="bg-card rounded-lg shadow-neutral-md">
      <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            {service ? 'Edit Service' : 'Create New Service'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            title="Close"
          >
            <Icon name="XMarkIcon" size={24} className="text-foreground" />
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        {/* Basic Information */}
        <section className="space-y-4 border-b border-border pb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="DocumentTextIcon" size={24} className="text-primary" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.title ? 'border-error' : 'border-border'
                }`}
                placeholder="e.g., Workflow Automations"
              />
              {errors.title && <p className="mt-1 text-sm text-error">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.slug ? 'border-error' : 'border-border'
                }`}
                placeholder="workflow-automations"
              />
              {errors.slug && <p className="mt-1 text-sm text-error">{errors.slug}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                URL: /services/{formData.slug || 'service-slug'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tagline <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                errors.tagline ? 'border-error' : 'border-border'
              }`}
              placeholder="Intelligent Systems That Run Your Business"
            />
            {errors.tagline && <p className="mt-1 text-sm text-error">{errors.tagline}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors.description ? 'border-error' : 'border-border'
              }`}
              placeholder="Main description paragraph..."
            />
            {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">
              Active (Service will appear in navbar)
            </label>
          </div>
        </section>

        {/* What Is It Section */}
        <section className="space-y-4 border-b border-border pb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="QuestionMarkCircleIcon" size={24} className="text-primary" />
            What Is It Section
          </h3>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Section Title</label>
            <input
              type="text"
              value={formData.whatIsIt.title}
              onChange={(e) => handleNestedChange('whatIsIt', 'title', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.whatIsIt.content}
              onChange={(e) => handleNestedChange('whatIsIt', 'content', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors.whatIsIt ? 'border-error' : 'border-border'
              }`}
              placeholder="Explain what this service is..."
            />
            {errors.whatIsIt && <p className="mt-1 text-sm text-error">{errors.whatIsIt}</p>}
          </div>
        </section>

        {/* Deliverables Section */}
        <section className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={24} className="text-primary" />
              Deliverables
            </h3>
            <button
              type="button"
              onClick={addDeliverable}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm-md press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={16} />
              Add Deliverable
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Section Title</label>
            <input
              type="text"
              value={formData.deliverables.title}
              onChange={(e) => handleNestedChange('deliverables', 'title', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div className="space-y-3">
            {formData.deliverables.items.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="e.g., Faster execution with minimal manual intervention"
                />
                {formData.deliverables.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="p-3 text-error hover:bg-error/10 rounded-md transition-smooth"
                  >
                    <Icon name="TrashIcon" size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.deliverables && <p className="text-sm text-error">{errors.deliverables}</p>}
        </section>

        {/* Approach Section */}
        <section className="space-y-4 border-b border-border pb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="LightBulbIcon" size={24} className="text-primary" />
            Approach
          </h3>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Section Title</label>
            <input
              type="text"
              value={formData.approach.title}
              onChange={(e) => handleNestedChange('approach', 'title', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.approach.content}
              onChange={(e) => handleNestedChange('approach', 'content', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors.approach ? 'border-error' : 'border-border'
              }`}
              placeholder="Describe your approach..."
            />
            {errors.approach && <p className="mt-1 text-sm text-error">{errors.approach}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Process Title</label>
            <input
              type="text"
              value={formData.approach.processTitle}
              onChange={(e) => handleNestedChange('approach', 'processTitle', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Process Steps <span className="text-error">*</span>
              </label>
              <button
                type="button"
                onClick={addProcessStep}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm-md press-scale flex items-center gap-2"
              >
                <Icon name="PlusIcon" size={16} />
                Add Step
              </button>
            </div>

            {formData.approach.processSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => updateProcessStep(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="e.g., Workflow and automation mapping across core operations"
                />
                {formData.approach.processSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="p-3 text-error hover:bg-error/10 rounded-md transition-smooth"
                  >
                    <Icon name="TrashIcon" size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.processSteps && <p className="text-sm text-error">{errors.processSteps}</p>}
        </section>

        {/* Use Cases Section */}
        <section className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icon name="BuildingOfficeIcon" size={24} className="text-primary" />
              Industry Use Cases
            </h3>
            <button
              type="button"
              onClick={addIndustry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm-md press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={16} />
              Add Industry
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Section Title</label>
            <input
              type="text"
              value={formData.useCases.title}
              onChange={(e) => handleNestedChange('useCases', 'title', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div className="space-y-6">
            {formData.useCases.industries.map((industry, industryIndex) => (
              <div key={industryIndex} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="text"
                    value={industry.title}
                    onChange={(e) => updateIndustry(industryIndex, 'title', e.target.value)}
                    className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth font-medium"
                    placeholder="Industry name (e.g., eCommerce & D2C)"
                  />
                  {formData.useCases.industries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIndustry(industryIndex)}
                      className="p-3 text-error hover:bg-error/10 rounded-md transition-smooth"
                    >
                      <Icon name="TrashIcon" size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pl-4">
                  {industry.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateIndustryItem(industryIndex, itemIndex, e.target.value)
                        }
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth text-sm"
                        placeholder="Use case item..."
                      />
                      {industry.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIndustryItem(industryIndex, itemIndex)}
                          className="p-2 text-error hover:bg-error/10 rounded-md transition-smooth"
                        >
                          <Icon name="XMarkIcon" size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIndustryItem(industryIndex)}
                    className="px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-smooth flex items-center gap-2"
                  >
                    <Icon name="PlusIcon" size={14} />
                    Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.useCases && <p className="text-sm text-error">{errors.useCases}</p>}
        </section>

        {/* CTA Section */}
        <section className="space-y-4 border-b border-border pb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="ArrowRightIcon" size={24} className="text-primary" />
            Call to Action
          </h3>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">CTA Title</label>
            <input
              type="text"
              value={formData.cta.title}
              onChange={(e) => handleNestedChange('cta', 'title', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CTA Content <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.cta.content}
              onChange={(e) => handleNestedChange('cta', 'content', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors.cta ? 'border-error' : 'border-border'
              }`}
              placeholder="Call to action message..."
            />
            {errors.cta && <p className="mt-1 text-sm text-error">{errors.cta}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Button Text</label>
            <input
              type="text"
              value={formData.cta.buttonText}
              onChange={(e) => handleNestedChange('cta', 'buttonText', e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>
        </section>

        {/* FAQs Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icon name="QuestionMarkCircleIcon" size={24} className="text-primary" />
              Frequently Asked Questions
            </h3>
            <button
              type="button"
              onClick={addFAQ}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm-md press-scale flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={16} />
              Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth font-medium"
                      placeholder="Question..."
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                      placeholder="Answer..."
                    />
                  </div>
                  {formData.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="p-3 text-error hover:bg-error/10 rounded-md transition-smooth"
                    >
                      <Icon name="TrashIcon" size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.faqs && <p className="text-sm text-error">{errors.faqs}</p>}
        </section>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border sticky bottom-0 bg-card">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            {service ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormNew;
