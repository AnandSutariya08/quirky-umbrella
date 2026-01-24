export type MeetingType = 'discovery' | 'strategy' | 'consultation';

export interface MeetingTypeOption {
  id: MeetingType;
  name: string;
  duration: number; // in minutes
  description: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Availability {
  id?: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00" format
  endTime: string; // "17:00" format
  isAvailable: boolean;
}

export interface Booking {
  id?: string;
  meetingType: MeetingType;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  companyName?: string;
  message?: string;
  scheduledDate: Date;
  scheduledTime: string; // "09:00" format
  timezone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  forwardedTo?: string; // Email or name of person booking is forwarded to
  adminNotes?: string; // Admin's internal notes
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingSettings {
  id?: string;
  timezone: string; // Default timezone
  slotDuration: number; // minutes (default 30)
  bufferTime: number; // minutes between meetings (default 15)
  advanceBookingDays: number; // How many days in advance (default 30)
  workingDays: number[]; // [1,2,3,4,5] = Mon-Fri
  availability: Availability[];
  blockedDates: string[]; // ISO date strings
  createdAt?: Date;
  updatedAt?: Date;
}
