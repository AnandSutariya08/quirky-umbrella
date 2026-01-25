'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { growthAuditService } from '@/lib/growthAudit';
import type { Question } from '@/types/growthAudit';

// Marketing-related questions
export const questions: Question[] = [
  {
    id: 'q1',
    question: 'What is your primary marketing goal?',
    type: 'single',
    options: ['Increase brand awareness', 'Generate more leads', 'Improve customer retention', 'Drive sales revenue', 'Expand market reach'],
    required: true,
  },
  {
    id: 'q2',
    question: 'Which marketing channels are you currently using? (Select all that apply)',
    type: 'multiple',
    options: ['Social Media', 'Email Marketing', 'Content Marketing', 'SEO/SEM', 'Paid Advertising', 'Influencer Marketing', 'Events/Webinars', 'Other'],
    required: true,
  },
  {
    id: 'q3',
    question: 'What is your current monthly marketing budget?',
    type: 'single',
    options: ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $50,000', 'Over $50,000', 'Not sure'],
    required: true,
  },
  {
    id: 'q4',
    question: 'What are your biggest marketing challenges? (Select all that apply)',
    type: 'multiple',
    options: ['Limited budget', 'Lack of expertise', 'Measuring ROI', 'Generating quality leads', 'Content creation', 'Staying competitive', 'Technology integration', 'Team resources'],
    required: true,
  },
  {
    id: 'q5',
    question: 'How do you currently measure marketing success?',
    type: 'text',
    required: true,
  },
  {
    id: 'q6',
    question: 'What is your target audience size?',
    type: 'single',
    options: ['Local/Regional', 'National', 'International', 'Global', 'Not defined yet'],
    required: true,
  },
  {
    id: 'q7',
    question: 'Which tools or platforms do you use for marketing? (Select all that apply)',
    type: 'multiple',
    options: ['CRM System', 'Email Marketing Platform', 'Social Media Management', 'Analytics Tools', 'Marketing Automation', 'Content Management System', 'None', 'Other'],
    required: true,
  },
  {
    id: 'q8',
    question: 'What is your average customer acquisition cost (CAC)?',
    type: 'text',
    required: false,
  },
  {
    id: 'q9',
    question: 'How would you rate your current marketing ROI?',
    type: 'single',
    options: ['Excellent - High ROI', 'Good - Positive ROI', 'Average - Break even', 'Poor - Negative ROI', 'Not measured'],
    required: true,
  },
  {
    id: 'q10',
    question: 'What specific areas would you like to improve in your marketing strategy?',
    type: 'text',
    required: true,
  },
];

export default function GrowthAuditForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    message: '',
  });
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && !answer.trim())) {
          newErrors[question.id] = 'This question is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await growthAuditService.submit({
        ...formData,
        answers,
      });
      
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setCurrentStep(1);
        setFormData({ name: '', email: '', mobile: '', companyName: '', message: '' });
        setAnswers({});
        setErrors({});
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="growth-audit" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-soft" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '800ms' }} />
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-warm-lg border border-border p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] opacity-25 animate-shimmer" />
              <div className="text-center py-12">
                <Icon name="CheckCircleIcon" size={64} className="text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  We've received your growth audit submission and will get back to you soon with personalized insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="growth-audit" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-soft" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '800ms' }} />
      </div>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-down">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get Your Free Growth Audit
            </h2>
            <p className="text-lg text-muted-foreground">
              Answer a few questions and get personalized marketing insights
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-warm-lg border border-border p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] opacity-20 animate-shimmer" />
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep} of 2
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentStep === 1 ? 'Your Details' : 'Marketing Questions'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
            </div>

            {currentStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleStep1Change}
                      className={`w-full px-4 py-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth ${
                        errors.name ? 'border-error' : 'border-border'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleStep1Change}
                      className={`w-full px-4 py-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth ${
                        errors.email ? 'border-error' : 'border-border'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-foreground mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    One Line Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    required
                    value={formData.message}
                    onChange={handleStep1Change}
                    className={`w-full px-4 py-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none ${
                      errors.message ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Tell us about your growth goals or just say hello..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-error">{errors.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-aurora px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-warm-md hover:shadow-warm-xl press-scale flex items-center gap-2 focus-ring"
                  >
                    Next
                    <Icon name="ArrowRightIcon" size={20} />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-b border-border pb-6 last:border-0">
                    <label className="block text-lg font-semibold text-foreground mb-4">
                      {index + 1}. {question.question}
                      {question.required && <span className="text-error ml-1">*</span>}
                    </label>
                    
                    {question.type === 'single' && question.options && (
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted cursor-pointer transition-smooth"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-foreground">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'multiple' && question.options && (
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted cursor-pointer transition-smooth"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={(answers[question.id] as string[] || []).includes(option)}
                              onChange={(e) => {
                                const current = (answers[question.id] as string[] || []);
                                const updated = e.target.checked
                                  ? [...current, option]
                                  : current.filter((v) => v !== option);
                                handleAnswerChange(question.id, updated);
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary rounded"
                            />
                            <span className="text-foreground">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'text' && (
                      <textarea
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none ${
                          errors[question.id] ? 'border-error' : 'border-border'
                        }`}
                        placeholder="Type your answer here..."
                      />
                    )}

                    {errors[question.id] && (
                      <p className="mt-2 text-sm text-error">{errors[question.id]}</p>
                    )}
                  </div>
                ))}

                {errors.submit && (
                  <div className="p-4 bg-error/10 border border-error rounded-md">
                    <p className="text-sm text-error">{errors.submit}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-aurora px-8 py-4 bg-card/70 backdrop-blur-sm border border-border text-foreground rounded-md font-medium text-lg shadow-neutral hover:shadow-neutral-lg press-scale flex items-center gap-2 focus-ring"
                  >
                    <Icon name="ArrowLeftIcon" size={20} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-aurora px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-warm-md hover:shadow-warm-xl press-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-ring"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon name="CheckCircleIcon" size={20} />
                        Submit Growth Audit
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
