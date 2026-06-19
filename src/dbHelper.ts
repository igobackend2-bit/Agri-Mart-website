// ─────────────────────────────────────────────────────────────────────────────
// Data layer — backed by Supabase (anon key + RLS). See supabase_schema.sql and
// SUPABASE_SETUP.md. Transactional data (profiles, orders, reviews, service
// leads, wishlist) lives in Supabase. Products/categories/brands are served from
// the in-code seed catalog (they are large and already bundled with the app).
//
// User identity (uid) still comes from the existing sign-in (Firebase anonymous).
// The same uid is stored as `user_id` on every Supabase row.
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';
import { Product, Category, Brand, Order, UserProfile, Review, ServiceLead } from './types';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } from './seedData';

// Tables
const T_PROFILES = 'profiles';
const T_ORDERS = 'orders';
const T_REVIEWS = 'reviews';
const T_LEADS = 'service_leads';

function logErr(scope: string, error: unknown) {
  if (error) console.error(`[Supabase:${scope}]`, error);
}

// ── Products / Categories / Brands (served from the in-code catalog) ──────────
export async function seedDatabaseIfNeeded(): Promise<void> {
  // No-op: the catalog ships with the app. Kept for backwards compatibility.
  return;
}

export async function fetchProducts(filters?: {
  categorySlug?: string;
  searchQuery?: string;
  brand?: string;
  problemFilter?: string;
  priceMin?: number;
  priceMax?: number;
}): Promise<Product[]> {
  let items = [...SEED_PRODUCTS];
  if (filters) {
    if (filters.categorySlug) {
      const target = filters.categorySlug.toLowerCase();
      items = items.filter(
        x =>
          x.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === target ||
          x.category.toLowerCase() === target,
      );
    }
    if (filters.searchQuery) {
      const sq = filters.searchQuery.toLowerCase();
      items = items.filter(
        x =>
          x.name.toLowerCase().includes(sq) ||
          x.brand.toLowerCase().includes(sq) ||
          x.description.toLowerCase().includes(sq) ||
          x.category.toLowerCase().includes(sq),
      );
    }
    if (filters.brand) items = items.filter(x => x.brand.toLowerCase() === filters.brand?.toLowerCase());
    if (filters.problemFilter) items = items.filter(x => x.problemFilter === filters.problemFilter);
    if (filters.priceMin !== undefined) items = items.filter(x => x.price >= (filters.priceMin || 0));
    if (filters.priceMax !== undefined) items = items.filter(x => x.price <= (filters.priceMax || 999999));
  }
  return items;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return SEED_PRODUCTS.find(p => p.slug === slug) || null;
}

export async function fetchCategories(): Promise<Category[]> {
  return SEED_CATEGORIES;
}

export async function fetchBrands(): Promise<Brand[]> {
  return SEED_BRANDS;
}

// ── Orders (Supabase) ─────────────────────────────────────────────────────────
export async function placeOrder(order: Order): Promise<void> {
  const { error } = await supabase.from(T_ORDERS).insert({
    id: order.id,
    user_id: order.userId,
    status: order.status,
    total: order.totalAmount,
    phone: order.phone || null,
    created_at: typeof order.createdAt === 'string' ? order.createdAt : new Date().toISOString(),
    data: order,
  });
  logErr('placeOrder', error);
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from(T_ORDERS)
    .select('data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  logErr('fetchUserOrders', error);
  return (data || []).map(r => r.data as Order);
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase.from(T_ORDERS).select('data').eq('id', orderId).maybeSingle();
  logErr('fetchOrderById', error);
  return data ? (data.data as Order) : null;
}

export async function cancelUserOrder(orderId: string): Promise<void> {
  const { data } = await supabase.from(T_ORDERS).select('data').eq('id', orderId).maybeSingle();
  const updated = data ? { ...(data.data as Order), status: 'Cancelled' as Order['status'] } : null;
  const { error } = await supabase
    .from(T_ORDERS)
    .update({ status: 'Cancelled', data: updated })
    .eq('id', orderId);
  logErr('cancelUserOrder', error);
}

// Append an admin → customer message to the order itself. Because orders sync
// per-user from Supabase, this reaches the customer reliably across devices
// (unlike the shared local inbox which different devices overwrite).
export async function appendOrderMessage(orderId: string, body: string): Promise<void> {
  const { data } = await supabase.from(T_ORDERS).select('data').eq('id', orderId).maybeSingle();
  if (!data) return;
  const order: any = data.data || {};
  const messages = Array.isArray(order.messages) ? order.messages : [];
  messages.push({ id: 'amsg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), body, createdAt: new Date().toISOString() });
  const updated = { ...order, messages };
  const { error } = await supabase.from(T_ORDERS).update({ data: updated }).eq('id', orderId);
  logErr('appendOrderMessage', error);
}

// ── User profiles (Supabase + local mirror) ───────────────────────────────────
// A local mirror guarantees the profile persists and is always retrievable even
// if the Supabase `profiles` table isn't set up yet — so the customer always
// sees their account after signing up.
const LOCAL_PROFILES = 'igo_local_profiles';
function readLocalProfiles(): Record<string, UserProfile> {
  try { return JSON.parse(localStorage.getItem(LOCAL_PROFILES) || '{}'); } catch { return {}; }
}
function writeLocalProfile(p: UserProfile): void {
  try {
    const m = readLocalProfiles();
    m[p.uid] = p;
    localStorage.setItem(LOCAL_PROFILES, JSON.stringify(m));
  } catch { /* ignore */ }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase.from(T_PROFILES).select('data').eq('uid', uid).maybeSingle();
    logErr('fetchUserProfile', error);
    if (data && data.data) {
      writeLocalProfile(data.data as UserProfile);
      return data.data as UserProfile;
    }
  } catch { /* fall through to local */ }
  return readLocalProfiles()[uid] || null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  writeLocalProfile(profile); // always mirror locally first
  try {
    const { error } = await supabase.from(T_PROFILES).upsert(
      {
        uid: profile.uid,
        email: profile.email || null,
        phone: profile.phone || null,
        role: profile.role,
        data: profile,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'uid' },
    );
    logErr('saveUserProfile', error);
  } catch { /* offline — local mirror already saved */ }
}

export async function toggleWishlistItem(
  uid: string,
  productId: string,
  currentWishlist: string[],
): Promise<string[]> {
  const idx = currentWishlist.indexOf(productId);
  const updated = [...currentWishlist];
  if (idx > -1) updated.splice(idx, 1);
  else updated.push(productId);

  const existing = await fetchUserProfile(uid);
  if (existing) {
    await saveUserProfile({ ...existing, wishlist: updated });
  }
  return updated;
}

// ── Reviews (Supabase) ────────────────────────────────────────────────────────
export async function fetchReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase.from(T_REVIEWS).select('data').eq('product_id', productId);
  logErr('fetchReviews', error);
  return (data || []).map(r => r.data as Review);
}

export async function addReview(review: Review): Promise<void> {
  const { error } = await supabase.from(T_REVIEWS).insert({
    id: review.id,
    product_id: review.productId,
    user_id: review.userId,
    data: review,
    created_at: new Date().toISOString(),
  });
  logErr('addReview', error);
}

// ── Service leads (Supabase) ──────────────────────────────────────────────────
export async function placeServiceLead(lead: ServiceLead): Promise<void> {
  const { error } = await supabase.from(T_LEADS).insert({
    id: lead.id,
    status: lead.status,
    data: lead,
    created_at: new Date().toISOString(),
  });
  logErr('placeServiceLead', error);
}

export async function adminFetchAllServiceLeads(): Promise<ServiceLead[]> {
  const { data, error } = await supabase
    .from(T_LEADS)
    .select('data')
    .order('created_at', { ascending: false });
  logErr('adminFetchAllServiceLeads', error);
  return (data || []).map(r => r.data as ServiceLead);
}

// ── Admin endpoints (Supabase) ────────────────────────────────────────────────
export async function adminFetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(T_ORDERS)
    .select('data')
    .order('created_at', { ascending: false });
  logErr('adminFetchAllOrders', error);
  return (data || []).map(r => r.data as Order);
}

export async function adminUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const { data } = await supabase.from(T_ORDERS).select('data').eq('id', orderId).maybeSingle();
  const updated = data ? { ...(data.data as Order), status } : null;
  const { error } = await supabase.from(T_ORDERS).update({ status, data: updated }).eq('id', orderId);
  logErr('adminUpdateOrderStatus', error);
}

// Product admin writes persist via the local catalog overlay (storeData.ts).
// These remain no-ops on the backend so the admin UI keeps working unchanged.
export async function adminAddOrUpdateProduct(_product: Product): Promise<void> {
  return;
}
export async function adminDeleteProduct(_productId: string): Promise<void> {
  return;
}
export async function clearAndReseedProducts(): Promise<{ deleted: number; seeded: number }> {
  return { deleted: 0, seeded: SEED_PRODUCTS.length };
}

// Alias exports for existing component imports
export {
  adminFetchAllOrders as fetchAllOrders,
  adminUpdateOrderStatus as updateOrderStatus,
  adminAddOrUpdateProduct as addProduct,
  adminDeleteProduct as deleteProduct,
  seedDatabaseIfNeeded as seedProducts,
};
