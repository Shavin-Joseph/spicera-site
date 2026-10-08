import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

const PRODUCTS_COLLECTION = 'products';

/**
 * Real-time listener for products.
 * If collection is empty, gracefully falls back to DEFAULT_PRODUCTS.
 */
export const subscribeProducts = (onData, onError) => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const products = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onData(products, false); // false = from firestore
        } else {
          // If firestore collection is empty, fallback to default products
          onData(DEFAULT_PRODUCTS, true); // true = isFallback
        }
      },
      (error) => {
        console.warn('Firestore subscription notice (using local catalog fallback):', error.message);
        if (onError) onError(error);
        // Fallback safely to default products so the site never crashes
        onData(DEFAULT_PRODUCTS, true);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Error initiating products subscription:', err);
    onData(DEFAULT_PRODUCTS, true);
    return () => {};
  }
};

/**
 * Upload an image file to Firebase Storage.
 * Falls back to Base64 dataURL if Firebase Storage is not enabled yet or encounters CORS.
 */
export const uploadProductImage = async (file) => {
  if (!file) return null;

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `products/${Date.now()}_${cleanFileName}`;
    const storageReference = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (storageError) {
    console.warn('Firebase Storage direct upload failed, creating base64 fallback:', storageError);
    // Convert file to Base64 data URL so user can still add product images immediately
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};

/**
 * Add a new product to Firestore
 */
export const addProduct = async (productData, imageFile = null) => {
  let imageUrl = productData.image || '/saffron-hero.png';

  if (imageFile) {
    const uploadedUrl = await uploadProductImage(imageFile);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  const payload = {
    ...productData,
    image: imageUrl,
    inStock: productData.inStock !== false,
    featured: Boolean(productData.featured),
    currency: productData.currency || 'Rs.',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update an existing product in Firestore
 */
export const updateProduct = async (productId, updatedData, imageFile = null) => {
  let imageUrl = updatedData.image;

  if (imageFile) {
    const uploadedUrl = await uploadProductImage(imageFile);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  const payload = {
    ...updatedData,
    image: imageUrl,
    inStock: updatedData.inStock !== false,
    featured: Boolean(updatedData.featured),
    currency: updatedData.currency || 'Rs.',
    updatedAt: serverTimestamp()
  };

  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, payload);
  return { id: productId, ...payload };
};

/**
 * Delete a product from Firestore
 */
export const deleteProduct = async (productId, imageUrl = null) => {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(productRef);

  // Attempt to delete image from storage if it was a stored URL
  if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (e) {
      // Storage deletion failure should not block document deletion
      console.warn('Could not delete storage image:', e.message);
    }
  }

  return true;
};

/**
 * Seed default products into Firestore so the database is populated with one click
 */
export const seedDefaultProductsToFirestore = async () => {
  const batch = writeBatch(db);

  for (const item of DEFAULT_PRODUCTS) {
    const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
    const { id, ...dataWithoutId } = item;
    batch.set(newDocRef, {
      ...dataWithoutId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
  return true;
};
