import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Service } from '@/types/service';

// Type assertion to ensure db is properly typed
const firestoreDb: Firestore = db;

const SERVICES_COLLECTION = 'services';

export const servicesService = {
  // Create a new service
  async create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating service with data:', service);

      if (!firestoreDb) {
        throw new Error(
          'Firestore database is not initialized. Please check your Firebase configuration.'
        );
      }

      const docRef = await addDoc(collection(firestoreDb, SERVICES_COLLECTION), {
        ...service,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log('Service created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update a service
  async update(id: string, service: Partial<Service>): Promise<void> {
    const docRef = doc(firestoreDb, SERVICES_COLLECTION, id);
    await updateDoc(docRef, {
      ...service,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete a service
  async delete(id: string): Promise<void> {
    const docRef = doc(firestoreDb, SERVICES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get all services
  async getAll(): Promise<Service[]> {
    const q = query(collection(firestoreDb, SERVICES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Service[];
  },

  // Get active services only
  async getActive(): Promise<Service[]> {
    const q = query(
      collection(firestoreDb, SERVICES_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Service[];
  },

  // Get a service by slug
  async getBySlug(slug: string): Promise<Service | null> {
    const q = query(collection(firestoreDb, SERVICES_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Service;
  },

  // Get a service by ID
  async getById(id: string): Promise<Service | null> {
    const docRef = doc(firestoreDb, SERVICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Service;
  },
};
