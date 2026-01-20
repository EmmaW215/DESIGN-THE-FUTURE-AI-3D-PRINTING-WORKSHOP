
export type CourseLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Level 3 Advanced Workshop';

export interface CourseSession {
  id: string;
  level: CourseLevel;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
  isWorkshop?: boolean;
}

export interface RegistrationData {
  studentName: string;
  parentContact: string;
  sessionId: string;
}

export interface PaymentOption {
  title: string;
  price: string;
  level: CourseLevel;
  sessions: string;
  paymentLink?: string; // Stripe Payment Link URL
}
