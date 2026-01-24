import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Booking, BookingSettings, Availability } from '@/types/booking';

const BOOKINGS_COLLECTION = 'bookings';
const SETTINGS_COLLECTION = 'bookingSettings';

const firestoreDb: typeof db = db;

export const bookingsService = {
  // Create a new booking
  async create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      // Check for conflicts
      const conflicts = await this.checkConflict(
        booking.scheduledDate,
        booking.scheduledTime,
        booking.meetingType
      );

      if (conflicts.length > 0) {
        throw new Error('This time slot is already booked. Please select another time.');
      }

      // Remove undefined values - Firestore doesn't accept them
      const bookingData: any = {
        meetingType: booking.meetingType,
        attendeeName: booking.attendeeName,
        attendeeEmail: booking.attendeeEmail,
        scheduledDate: Timestamp.fromDate(booking.scheduledDate),
        scheduledTime: booking.scheduledTime,
        timezone: booking.timezone,
        status: booking.status,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Only add optional fields if they have values
      if (booking.attendeePhone) {
        bookingData.attendeePhone = booking.attendeePhone;
      }
      if (booking.companyName) {
        bookingData.companyName = booking.companyName;
      }
      if (booking.message) {
        bookingData.message = booking.message;
      }
      if (booking.forwardedTo) {
        bookingData.forwardedTo = booking.forwardedTo;
      }
      if (booking.adminNotes) {
        bookingData.adminNotes = booking.adminNotes;
      }

      const docRef = await addDoc(collection(firestoreDb, BOOKINGS_COLLECTION), bookingData);

      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Check for booking conflicts
  async checkConflict(
    date: Date,
    time: string,
    meetingType: string,
    excludeId?: string
  ): Promise<Booking[]> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      // Get all bookings for the same date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(firestoreDb, BOOKINGS_COLLECTION),
        where('scheduledDate', '>=', Timestamp.fromDate(startOfDay)),
        where('scheduledDate', '<=', Timestamp.fromDate(endOfDay)),
        where('status', '==', 'confirmed')
      );

      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          scheduledDate: doc.data().scheduledDate?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Booking[];

      // Filter by time and exclude current booking if editing
      return bookings.filter(
        (booking) =>
          booking.scheduledTime === time &&
          booking.id !== excludeId &&
          booking.status === 'confirmed'
      );
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return [];
    }
  },

  // Get all bookings
  async getAll(): Promise<Booking[]> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const q = query(
        collection(firestoreDb, BOOKINGS_COLLECTION),
        orderBy('scheduledDate', 'desc')
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get bookings for a specific date range
  async getByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      // Get all bookings in date range (not just confirmed) - we'll filter by status in the component
      const q = query(
        collection(firestoreDb, BOOKINGS_COLLECTION),
        where('scheduledDate', '>=', Timestamp.fromDate(startDate)),
        where('scheduledDate', '<=', Timestamp.fromDate(endDate)),
        orderBy('scheduledDate', 'asc')
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings by date range:', error);
      throw error;
    }
  },

  // Get a single booking by ID
  async getById(id: string): Promise<Booking | null> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const docRef = doc(firestoreDb, BOOKINGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        scheduledDate: docSnap.data().scheduledDate?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Update a booking
  async update(id: string, updates: Partial<Booking>): Promise<void> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const bookingRef = doc(firestoreDb, BOOKINGS_COLLECTION, id);
      
      // Check if document exists before updating
      const docSnap = await getDoc(bookingRef);
      if (!docSnap.exists()) {
        throw new Error(`Booking with ID ${id} does not exist. It may have been deleted.`);
      }

      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      // Only include defined fields (not undefined)
      // Firestore doesn't accept undefined values
      if (updates.meetingType !== undefined) updateData.meetingType = updates.meetingType;
      if (updates.attendeeName !== undefined) updateData.attendeeName = updates.attendeeName;
      if (updates.attendeeEmail !== undefined) updateData.attendeeEmail = updates.attendeeEmail;
      if (updates.attendeePhone !== undefined && updates.attendeePhone !== null) {
        updateData.attendeePhone = updates.attendeePhone;
      } else if (updates.attendeePhone === null) {
        updateData.attendeePhone = deleteField();
      }
      if (updates.companyName !== undefined && updates.companyName !== null) {
        updateData.companyName = updates.companyName;
      } else if (updates.companyName === null) {
        updateData.companyName = deleteField();
      }
      if (updates.message !== undefined && updates.message !== null) {
        updateData.message = updates.message;
      } else if (updates.message === null) {
        updateData.message = deleteField();
      }
      if (updates.scheduledTime !== undefined) updateData.scheduledTime = updates.scheduledTime;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.forwardedTo !== undefined && updates.forwardedTo !== null) {
        updateData.forwardedTo = updates.forwardedTo;
      } else if (updates.forwardedTo === null) {
        updateData.forwardedTo = deleteField();
      }
      if (updates.adminNotes !== undefined && updates.adminNotes !== null) {
        updateData.adminNotes = updates.adminNotes;
      } else if (updates.adminNotes === null) {
        updateData.adminNotes = deleteField();
      }

      if (updates.scheduledDate) {
        updateData.scheduledDate = Timestamp.fromDate(updates.scheduledDate);
      }

      await updateDoc(bookingRef, updateData);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Cancel a booking
  async cancel(id: string): Promise<void> {
    await this.update(id, { status: 'cancelled' });
  },

  // Approve a booking (change from pending to confirmed)
  async approve(id: string): Promise<void> {
    await this.update(id, { status: 'confirmed' });
  },

  // Mark booking as completed
  async complete(id: string): Promise<void> {
    await this.update(id, { status: 'completed' });
  },

  // Forward/reschedule a booking
  async forward(id: string, forwardedTo: string, newDate?: Date, newTime?: string, adminNotes?: string): Promise<void> {
    const updateData: any = {
      forwardedTo,
      adminNotes,
    };
    
    if (newDate && newTime) {
      updateData.scheduledDate = newDate;
      updateData.scheduledTime = newTime;
    }
    
    await this.update(id, updateData);
  },

  // Delete a booking
  async delete(id: string): Promise<void> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const bookingRef = doc(firestoreDb, BOOKINGS_COLLECTION, id);
      await deleteDoc(bookingRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Get booking settings
  async getSettings(): Promise<BookingSettings | null> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const q = query(collection(firestoreDb, SETTINGS_COLLECTION), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Return default settings
        return {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          slotDuration: 30,
          bufferTime: 15,
          advanceBookingDays: 30,
          workingDays: [1, 2, 3, 4, 5], // Mon-Fri
          availability: [],
          blockedDates: [],
        };
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as BookingSettings;
    } catch (error) {
      console.error('Error fetching booking settings:', error);
      return null;
    }
  },

  // Update booking settings
  async updateSettings(settings: Partial<BookingSettings>): Promise<void> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const currentSettings = await this.getSettings();

      if (currentSettings?.id) {
        const settingsRef = doc(firestoreDb, SETTINGS_COLLECTION, currentSettings.id);
        await updateDoc(settingsRef, {
          ...settings,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Create new settings
        await addDoc(collection(firestoreDb, SETTINGS_COLLECTION), {
          ...settings,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error updating booking settings:', error);
      throw error;
    }
  },
};
