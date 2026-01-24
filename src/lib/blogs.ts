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
} from 'firebase/firestore';
import { db } from './firebase';
import type { Blog } from '@/types/blog';

const BLOGS_COLLECTION = 'blogs';

// Type assertion to ensure db is properly typed
const firestoreDb: typeof db = db;

export const blogsService = {
  // Create a new blog
  async create(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
    try {
      console.log('Creating blog with data:', blog);
      
      if (!firestoreDb) {
        throw new Error('Firestore database is not initialized. Please check your Firebase configuration.');
      }

      const docRef = await addDoc(collection(firestoreDb, BLOGS_COLLECTION), {
        ...blog,
        views: 0,
        likes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedDate: blog.publishedDate ? Timestamp.fromDate(blog.publishedDate) : null,
        scheduledDate: blog.scheduledDate ? Timestamp.fromDate(blog.scheduledDate) : null,
      });
      
      console.log('Blog created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Update a blog
  async update(id: string, blog: Partial<Blog>): Promise<void> {
    try {
      const docRef = doc(firestoreDb, BLOGS_COLLECTION, id);
      const updateData: any = {
        ...blog,
        updatedAt: Timestamp.now(),
      };
      
      if (blog.publishedDate) {
        updateData.publishedDate = Timestamp.fromDate(blog.publishedDate);
      }
      if (blog.scheduledDate) {
        updateData.scheduledDate = Timestamp.fromDate(blog.scheduledDate);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Delete a blog
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(firestoreDb, BLOGS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Get all blogs
  async getAll(): Promise<Blog[]> {
    try {
      const q = query(collection(firestoreDb, BLOGS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishedDate: doc.data().publishedDate?.toDate(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Blog[];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get published blogs only
  async getPublished(): Promise<Blog[]> {
    try {
      const q = query(
        collection(firestoreDb, BLOGS_COLLECTION),
        where('status', '==', 'published'),
        orderBy('publishedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishedDate: doc.data().publishedDate?.toDate(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Blog[];
    } catch (error) {
      console.error('Error fetching published blogs:', error);
      throw error;
    }
  },

  // Get featured blogs
  async getFeatured(): Promise<Blog[]> {
    try {
      const q = query(
        collection(firestoreDb, BLOGS_COLLECTION),
        where('status', '==', 'published'),
        where('isFeatured', '==', true),
        orderBy('publishedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishedDate: doc.data().publishedDate?.toDate(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Blog[];
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      throw error;
    }
  },

  // Get a blog by slug
  async getBySlug(slug: string): Promise<Blog | null> {
    try {
      const q = query(collection(firestoreDb, BLOGS_COLLECTION), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        publishedDate: doc.data().publishedDate?.toDate(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Blog;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  // Get a blog by ID
  async getById(id: string): Promise<Blog | null> {
    try {
      const docRef = doc(firestoreDb, BLOGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return {
        id: docSnap.id,
        ...docSnap.data(),
        publishedDate: docSnap.data().publishedDate?.toDate(),
        scheduledDate: docSnap.data().scheduledDate?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Blog;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(firestoreDb, BLOGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw - views increment is not critical
    }
  },
};
