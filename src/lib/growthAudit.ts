import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { GrowthAuditSubmission } from '@/types/growthAudit';

const GROWTH_AUDIT_COLLECTION = 'growthAuditSubmissions';

const firestoreDb: typeof db = db;

export const growthAuditService = {
  // Submit a new growth audit
  async submit(submission: Omit<GrowthAuditSubmission, 'id' | 'submittedAt' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const docRef = await addDoc(collection(firestoreDb, GROWTH_AUDIT_COLLECTION), {
        ...submission,
        submittedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting growth audit:', error);
      throw error;
    }
  },

  // Get all submissions
  async getAll(): Promise<GrowthAuditSubmission[]> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const q = query(
        collection(firestoreDb, GROWTH_AUDIT_COLLECTION),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as GrowthAuditSubmission[];
    } catch (error) {
      console.error('Error fetching growth audit submissions:', error);
      throw error;
    }
  },

  // Get a single submission by ID
  async getById(id: string): Promise<GrowthAuditSubmission | null> {
    try {
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized.');
      }

      const docRef = doc(firestoreDb, GROWTH_AUDIT_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        submittedAt: docSnap.data().submittedAt?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as GrowthAuditSubmission;
    } catch (error) {
      console.error('Error fetching growth audit submission:', error);
      throw error;
    }
  },
};
