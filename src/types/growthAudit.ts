export type QuestionType = 'single' | 'multiple' | 'text';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // For single and multiple choice
  required: boolean;
}

export interface GrowthAuditSubmission {
  id?: string;
  // Step 1: User Details
  name: string;
  email: string;
  mobile?: string;
  companyName?: string;
  message: string;

  // Step 2: Answers
  answers: Record<string, string | string[]>;

  // Metadata
  submittedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
