import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, Category, Brand, Order, UserProfile, Review, Address, ServiceLead } from './types';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } from './seedData';

// Safe Collection references
const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BRANDS_COL = 'brands';
const ORDERS_COL = 'orders';
const USERS_COL = 'users';
const REVIEWS_COL = 'reviews';

/**
 * Automatically populates the database with realistic sample items if the database is empty.
 */
export async function seedDatabaseIfNeeded() {
  try {
    const pSnap = await getDocs(query(collection(db, PRODUCTS_COL), limit(1)));
    if (pSnap.empty) {
      console.log('Firestore is empty. Commencing background seed injection...');
      const batch = writeBatch(db);

      // Seed Brands
      for (const b of SEED_BRANDS) {
        const bRef = doc(db, BRANDS_COL, b.id);
        batch.set(bRef, b);
      }

      // Seed Categories
      for (const cat of SEED_CATEGORIES) {
        const catRef = doc(db, CATEGORIES_COL, cat.id);
        batch.set(catRef, cat);
      }

      // Seed Products
      for (const p of SEED_PRODUCTS) {
        const pRef = doc(db, PRODUCTS_COL, p.id);
        batch.set(pRef, p);
      }

      await batch.commit();
      console.log('Seeding transaction successfully committed!');
    }
  } catch (error) {
    console.error('Failed to seed firestore database auto-setup:', error);
  }
}

/**
 * Fetch all products, optionally filtered on category, search string, brand, and problem type
 */
export async function fetchProducts(filters?: {
  categorySlug?: string;
  searchQuery?: string;
  brand?: string;
  problemFilter?: string;
  priceMin?: number;
  priceMax?: number;
}): Promise<Product[]> {
  const path = PRODUCTS_COL;
  try {
    const ref = collection(db, path);
    // Query constraints
    let q = query(ref);
    
    // We fetch everything and filter down in-memory for flexible multi-field filtering, 
    // avoiding complex multi-field composite indexing issues during evaluation.
    const snap = await getDocs(q);
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));

    if (filters) {
      if (filters.categorySlug) {
        const targetSlug = filters.categorySlug.toLowerCase();
        items = items.filter(x => x.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === targetSlug || x.category.toLowerCase() === targetSlug);
      }
      if (filters.searchQuery) {
        const sq = filters.searchQuery.toLowerCase();
        items = items.filter(x => 
          x.name.toLowerCase().includes(sq) || 
          x.brand.toLowerCase().includes(sq) || 
          x.description.toLowerCase().includes(sq) ||
          x.category.toLowerCase().includes(sq)
        );
      }
      if (filters.brand) {
        items = items.filter(x => x.brand.toLowerCase() === filters.brand?.toLowerCase());
      }
      if (filters.problemFilter) {
        items = items.filter(x => x.problemFilter === filters.problemFilter);
      }
      if (filters.priceMin !== undefined) {
        items = items.filter(x => x.price >= (filters.priceMin || 0));
      }
      if (filters.priceMax !== undefined) {
        items = items.filter(x => x.price <= (filters.priceMax || 999999));
      }
    }
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

/**
 * Fetch a single product by its unique slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const path = PRODUCTS_COL;
  try {
    const q = query(collection(db, path), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

/**
 * Fetch distinct categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const path = CATEGORIES_COL;
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return SEED_CATEGORIES;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return SEED_CATEGORIES;
  }
}

/**
 * Fetch distinct brands
 */
export async function fetchBrands(): Promise<Brand[]> {
  const path = BRANDS_COL;
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return SEED_BRANDS;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return SEED_BRANDS;
  }
}

/**
 * Place a shopping order
 */
export async function placeOrder(order: Order): Promise<void> {
  const path = `${ORDERS_COL}/${order.id}`;
  try {
    await setDoc(doc(db, ORDERS_COL, order.id), order);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch orders for a specific user
 */
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const path = ORDERS_COL;
  try {
    const q = query(collection(db, path), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
  } catch (err) {
    // If ordering failed because index isn't built yet, fail back gracefully without orderby
    try {
      const qFallback = query(collection(db, path), where('userId', '==', userId));
      const snapF = await getDocs(qFallback);
      const items = snapF.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      // Sort in memory
      return items.sort((a, b) => b.id.localeCompare(a.id));
    } catch {
      handleFirestoreError(err, OperationType.GET, path);
      return [];
    }
  }
}

/**
 * Fetch order by ID
 */
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    const d = await getDoc(doc(db, ORDERS_COL, orderId));
    if (!d.exists()) return null;
    return { id: d.id, ...d.data() } as Order;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

/**
 * Cancel an order
 */
export async function cancelUserOrder(orderId: string): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    await updateDoc(doc(db, ORDERS_COL, orderId), { status: 'Cancelled' });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COL}/${uid}`;
  try {
    const d = await getDoc(doc(db, USERS_COL, uid));
    if (!d.exists()) return null;
    return d.data() as UserProfile;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

/**
 * Save user profile
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `${USERS_COL}/${profile.uid}`;
  try {
    await setDoc(doc(db, USERS_COL, profile.uid), profile, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Toggle Wishlist item
 */
export async function toggleWishlistItem(uid: string, productId: string, currentWishlist: string[]): Promise<string[]> {
  const path = `${USERS_COL}/${uid}`;
  const existIndex = currentWishlist.indexOf(productId);
  let updatedList = [...currentWishlist];
  if (existIndex > -1) {
    updatedList.splice(existIndex, 1);
  } else {
    updatedList.push(productId);
  }
  try {
    await updateDoc(doc(db, USERS_COL, uid), { wishlist: updatedList });
    return updatedList;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    return currentWishlist;
  }
}

/**
 * Fetch reviews for a specific product
 */
export async function fetchReviews(productId: string): Promise<Review[]> {
  const path = REVIEWS_COL;
  try {
    const q = query(collection(db, path), where('productId', '==', productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

/**
 * Create a new review
 */
export async function addReview(review: Review): Promise<void> {
  const path = `${REVIEWS_COL}/${review.id}`;
  try {
    await setDoc(doc(db, REVIEWS_COL, review.id), review);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// --- ADMIN SPECIFIC ENDPOINTS ---

/**
 * Fetch all orders (Admin only)
 */
export async function adminFetchAllOrders(): Promise<Order[]> {
  const path = ORDERS_COL;
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

/**
 * Update order status (Admin only)
 */
export async function adminUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    await updateDoc(doc(db, ORDERS_COL, orderId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Put or edit a product document (Admin only)
 */
export async function adminAddOrUpdateProduct(product: Product): Promise<void> {
  const path = `${PRODUCTS_COL}/${product.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete a product document (Admin only)
 */
export async function adminDeleteProduct(productId: string): Promise<void> {
  const path = `${PRODUCTS_COL}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Alias exports for administrative components integration
export {
  adminFetchAllOrders as fetchAllOrders,
  adminUpdateOrderStatus as updateOrderStatus,
  adminAddOrUpdateProduct as addProduct,
  adminDeleteProduct as deleteProduct,
  seedDatabaseIfNeeded as seedProducts
};

const SERVICE_LEADS_COL = 'serviceLeads';

/**
 * Place a professional service lead request (anyone can submit)
 */
export async function placeServiceLead(lead: ServiceLead): Promise<void> {
  const path = `${SERVICE_LEADS_COL}/${lead.id}`;
  try {
    await setDoc(doc(db, SERVICE_LEADS_COL, lead.id), lead);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch all service leads (Admin only)
 */
export async function adminFetchAllServiceLeads(): Promise<ServiceLead[]> {
  const path = SERVICE_LEADS_COL;
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceLead));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

