// ─────────────────────────────────────────────────────────────────────────────
// Store data layer: makes admin changes + customer actions persistent and
// connected across the whole site (main pages, profile, admin panel).
//  • Catalog overlay  — admin add/edit/delete/stock changes survive reload
//                       and show on the main site; orders decrement stock.
//  • Local orders     — every order is mirrored locally so the customer
//                       profile and the admin Orders tab always work.
//  • Profile inbox    — admin messages + order status updates appear in the
//                       customer's profile inbox.
//  • Sounds           — order-success chime and admin low-stock alert.
// ─────────────────────────────────────────────────────────────────────────────
import { Product, Order } from './types';

const K_OVERRIDES = 'igo_catalog_overrides';   // { [id]: Partial<Product> }
const K_CUSTOM = 'igo_catalog_custom';         // Product[] added by admin
const K_DELETED = 'igo_catalog_deleted';       // string[] ids
const K_ORDERS = 'igo_local_orders';           // Order[]
const K_INBOX = 'igo_profile_inbox';           // InboxMessage[]
const K_LASTADDR = 'igo_last_address';

export const CATALOG_CHANGED_EVENT = 'igo-catalog-changed';

function read<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function write(k: string, v: any) { localStorage.setItem(k, JSON.stringify(v)); }
function emitCatalogChanged() { try { window.dispatchEvent(new Event(CATALOG_CHANGED_EVENT)); } catch { } }

// ── Catalog overlay ──────────────────────────────────────────────────────────
export function applyCatalogOverlay(seed: Product[]): Product[] {
  const overrides = read<Record<string, Partial<Product>>>(K_OVERRIDES, {});
  const custom = read<Product[]>(K_CUSTOM, []);
  const deleted = new Set(read<string[]>(K_DELETED, []));
  const merged = seed
    .filter(p => !deleted.has(p.id))
    .map(p => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
  return [...custom.filter(p => !deleted.has(p.id)), ...merged];
}

export function persistProductUpsert(p: Product, isNew: boolean): void {
  if (isNew) {
    const custom = read<Product[]>(K_CUSTOM, []);
    write(K_CUSTOM, [p, ...custom.filter(x => x.id !== p.id)]);
  } else {
    const custom = read<Product[]>(K_CUSTOM, []);
    if (custom.some(x => x.id === p.id)) {
      write(K_CUSTOM, custom.map(x => x.id === p.id ? p : x));
    } else {
      const ov = read<Record<string, Partial<Product>>>(K_OVERRIDES, {});
      ov[p.id] = p;
      write(K_OVERRIDES, ov);
    }
  }
  emitCatalogChanged();
}

export function persistProductDelete(id: string): void {
  const deleted = read<string[]>(K_DELETED, []);
  if (!deleted.includes(id)) { deleted.push(id); write(K_DELETED, deleted); }
  emitCatalogChanged();
}

export function persistStockSet(id: string, stock: number): void {
  const ov = read<Record<string, Partial<Product>>>(K_OVERRIDES, {});
  ov[id] = { ...(ov[id] || {}), stock: Math.max(0, stock) };
  write(K_OVERRIDES, ov);
  // also update custom products if applicable
  const custom = read<Product[]>(K_CUSTOM, []);
  if (custom.some(x => x.id === id)) write(K_CUSTOM, custom.map(x => x.id === id ? { ...x, stock: Math.max(0, stock) } : x));
  emitCatalogChanged();
}

/** Decrement stock for ordered items (called on order placement). */
export function decrementStocks(items: { productId: string; quantity: number }[], current: Product[]): void {
  const ov = read<Record<string, Partial<Product>>>(K_OVERRIDES, {});
  const custom = read<Product[]>(K_CUSTOM, []);
  items.forEach(it => {
    const prod = current.find(p => p.id === it.productId);
    if (!prod) return;
    const next = Math.max(0, (prod.stock ?? 0) - it.quantity);
    const ci = custom.findIndex(x => x.id === it.productId);
    if (ci > -1) custom[ci] = { ...custom[ci], stock: next };
    else ov[it.productId] = { ...(ov[it.productId] || {}), stock: next };
  });
  write(K_OVERRIDES, ov);
  write(K_CUSTOM, custom);
  emitCatalogChanged();
}

/** Admin one-click: refill every product's stock to the given level (default 200). */
export function refillAllStocks(seed: Product[], level = 200): void {
  const ov = read<Record<string, Partial<Product>>>(K_OVERRIDES, {});
  seed.forEach(p => { ov[p.id] = { ...(ov[p.id] || {}), stock: level }; });
  write(K_OVERRIDES, ov);
  write(K_CUSTOM, read<Product[]>(K_CUSTOM, []).map(p => ({ ...p, stock: level })));
  emitCatalogChanged();
}

// ── Local order mirror ───────────────────────────────────────────────────────
export function saveLocalOrder(order: Order): void {
  const orders = read<Order[]>(K_ORDERS, []);
  write(K_ORDERS, [order, ...orders.filter(o => o.id !== order.id)]);
}

export function getLocalOrders(): Order[] {
  return read<Order[]>(K_ORDERS, []);
}

export function updateLocalOrderStatus(orderId: string, status: Order['status']): void {
  write(K_ORDERS, read<Order[]>(K_ORDERS, []).map(o => o.id === orderId ? { ...o, status } : o));
}

// ── Saved delivery details (auto-fill for repeat orders) ────────────────────
export interface SavedAddress {
  name: string; phone: string; email?: string;
  addressLine: string; city: string; district?: string; pincode: string;
}
export function saveLastAddress(a: SavedAddress): void { write(K_LASTADDR, a); }
export function getLastAddress(): SavedAddress | null { return read<SavedAddress | null>(K_LASTADDR, null); }

// ── Profile inbox ────────────────────────────────────────────────────────────
export interface InboxMessage {
  id: string;
  createdAt: string;
  toEmail: string;        // '' or 'all' = every customer on this device
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
}

export function sendInboxMessage(input: { toEmail?: string; title: string; body: string; orderId?: string }): void {
  const msgs = read<InboxMessage[]>(K_INBOX, []);
  msgs.unshift({
    id: 'msg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    toEmail: (input.toEmail || 'all').toLowerCase(),
    title: input.title,
    body: input.body,
    orderId: input.orderId,
    read: false,
  });
  write(K_INBOX, msgs.slice(0, 200));
}

export function getInbox(email?: string | null): InboxMessage[] {
  const e = (email || '').toLowerCase();
  return read<InboxMessage[]>(K_INBOX, []).filter(m => m.toEmail === 'all' || m.toEmail === '' || (e && m.toEmail === e));
}

export function markInboxRead(email?: string | null): void {
  const e = (email || '').toLowerCase();
  write(K_INBOX, read<InboxMessage[]>(K_INBOX, []).map(m =>
    (m.toEmail === 'all' || m.toEmail === '' || (e && m.toEmail === e)) ? { ...m, read: true } : m));
}

export function unreadInboxCount(email?: string | null): number {
  return getInbox(email).filter(m => !m.read).length;
}

// ── Sounds (WebAudio, no asset files needed) ─────────────────────────────────
function tone(ctx: AudioContext, freq: number, start: number, dur: number, vol = 0.18) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
}

/** Happy rising chime — played when the customer places an order. */
export function playOrderSuccessSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    tone(ctx, 523.25, 0, 0.18);     // C5
    tone(ctx, 659.25, 0.14, 0.18);  // E5
    tone(ctx, 783.99, 0.28, 0.30);  // G5
  } catch { /* audio unavailable */ }
}

/** Urgent double-beep — played in admin when stock is low / out. */
export function playAdminAlertSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    tone(ctx, 880, 0, 0.12, 0.15);
    tone(ctx, 880, 0.2, 0.12, 0.15);
  } catch { /* audio unavailable */ }
}

// ── Location detection (browser geolocation + free reverse geocoding) ───────
export interface DetectedLocation { city: string; district?: string; pincode?: string; }

export function detectLocation(): Promise<DetectedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return; }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const j = await res.json();
        const loc: DetectedLocation = {
          city: j.city || j.locality || j.principalSubdivision || 'Your area',
          district: j.principalSubdivision || undefined,
          pincode: j.postcode || undefined,
        };
        localStorage.setItem('igo_cx_location', JSON.stringify(loc));
        resolve(loc);
      } catch { reject(new Error('Could not resolve address')); }
    }, () => reject(new Error('Location permission denied')), { timeout: 10000 });
  });
}

export function getSavedLocation(): DetectedLocation | null {
  return read<DetectedLocation | null>('igo_cx_location', null);
}
