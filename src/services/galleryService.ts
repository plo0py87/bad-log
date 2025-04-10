import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GalleryItem } from '../types/gallery';

// Collection name
const COLLECTION_NAME = 'gallery_items';

// Add a new gallery item
export const addGalleryItem = async (item: Omit<GalleryItem, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return null;
  }
};

// Get all gallery items
export const getAllGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const items: GalleryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        category: data.category || '',
        date: data.date || '',
        url: data.url || '' 
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting gallery items:', error);
    return [];
  }
};

// Get a specific gallery item by ID
export const getGalleryItemById = async (id: string): Promise<GalleryItem | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        category: data.category || '',
        date: data.date || ''
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting gallery item:', error);
    return null;
  }
};

// Update a gallery item
export const updateGalleryItem = async (id: string, data: Partial<GalleryItem>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return false;
  }
};

// Delete a gallery item
export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return false;
  }
};
