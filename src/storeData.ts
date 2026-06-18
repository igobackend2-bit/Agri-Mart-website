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

import { supabase } from './lib/supabase';

export async function syncWithSupabase() {
  try {
    const { data, error } = await supabase.from('igo_kv_store').select('key, value');
    if (error) {
      console.error('Failed to sync from Supabase', error);
      return;
    }
    if (data && data.length > 0) {
      data.forEach((row) => {
        localStorage.setItem(row.key, JSON.stringify(row.value));
      });
      // Emit event so UI refreshes
      emitCatalogChanged();
    }
  } catch (err) {
    console.error('Supabase sync error', err);
  }
}

function read<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function write(k: string, v: any) { 
  localStorage.setItem(k, JSON.stringify(v)); 
  // Fire and forget sync
  supabase.from('igo_kv_store').upsert({ key: k, value: v }).catch(err => console.error('Supabase error', err));
}
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

// Merge order lists by id, keeping the MOST-PROGRESSED status for each order so
// an admin's status change (local OR Supabase) always wins over a stale copy.
const STATUS_RANK: Record<string, number> = {
  Placed: 1, Confirmed: 2, Packed: 3, Shipped: 4, Dispatched: 4, Delivered: 5, Cancelled: 6,
};
export function mergeOrdersByStatus(...lists: Order[][]): Order[] {
  const map = new Map<string, Order>();
  for (const list of lists) {
    for (const o of list) {
      const cur = map.get(o.id);
      if (!cur) { map.set(o.id, o); continue; }
      const rNew = STATUS_RANK[o.status] || 0;
      const rCur = STATUS_RANK[cur.status] || 0;
      if (rNew >= rCur) map.set(o.id, { ...cur, ...o });
    }
  }
  return Array.from(map.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
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

// ── IGO Coins wallet (demo loyalty — earn on orders, redeem at checkout) ─────
// Real loyalty/ledger should move to the backend (Supabase) later; this is a
// per-device demo store so the feature is visible and testable now.
const K_WALLET = 'igo_wallet_coins';

export function getWalletCoins(): number {
  return read<number>(K_WALLET, 0);
}
/** Award coins (e.g. 2% of order value) and return the new balance. */
export function earnWalletCoins(amount: number): number {
  const next = Math.max(0, getWalletCoins() + Math.round(amount));
  write(K_WALLET, next);
  return next;
}
/** Redeem up to `max` coins; returns the number actually redeemed. */
export function redeemWalletCoins(max: number): number {
  const have = getWalletCoins();
  const used = Math.max(0, Math.min(have, Math.round(max)));
  write(K_WALLET, have - used);
  return used;
}

// ── Sounds (WebAudio, no asset files needed) ─────────────────────────────────
// Louder default volume + a punchier waveform so the sounds carry across a room.
function tone(ctx: AudioContext, freq: number, start: number, dur: number, vol = 0.6) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
}

/** Happy rising chime (LOUD) — played when the customer places an order. */
export function playOrderSuccessSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch { /* ignore */ } }
    tone(ctx, 523.25, 0, 0.22, 0.7);     // C5
    tone(ctx, 659.25, 0.16, 0.22, 0.7);  // E5
    tone(ctx, 783.99, 0.32, 0.32, 0.75); // G5
    tone(ctx, 1046.5, 0.5, 0.45, 0.65);  // C6 flourish
  } catch { /* audio unavailable */ }
}

/** Generic admin alert (kept for compatibility) — LOUD triple-beep. */
export function playAdminAlertSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch { /* ignore */ } }
    tone(ctx, 988, 0, 0.16, 0.8);
    tone(ctx, 988, 0.22, 0.16, 0.8);
    tone(ctx, 988, 0.44, 0.22, 0.8);
  } catch { /* audio unavailable */ }
}

/** LOW STOCK — gentle warning: two soft mid-tone beeps. */
export function playLowStockSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch { /* ignore */ } }
    tone(ctx, 587.33, 0, 0.2, 0.6);   // D5
    tone(ctx, 587.33, 0.26, 0.22, 0.6);
  } catch { /* audio unavailable */ }
}

/** OUT OF STOCK — urgent siren: loud alternating high/low, four sweeps. */
export function playOutOfStockSound(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch { /* ignore */ } }
    tone(ctx, 1108.73, 0, 0.16, 0.9);    // high
    tone(ctx, 740, 0.18, 0.16, 0.9);     // low
    tone(ctx, 1108.73, 0.36, 0.16, 0.9); // high
    tone(ctx, 740, 0.54, 0.28, 0.9);     // low (long)
  } catch { /* audio unavailable */ }
}

// ── Location detection (browser geolocation + free reverse geocoding) ───────
export interface DetectedLocation { city: string; district?: string; pincode?: string; state?: string; area?: string; }

export function detectLocation(): Promise<DetectedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Geolocation is not supported by this browser.')); return; }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const j = await res.json();
        // Dig through localityInfo for a postcode if the top-level one is missing.
        let pincode: string | undefined = j.postcode || undefined;
        const admin = (j.localityInfo && j.localityInfo.administrative) || [];
        if (!pincode) {
          const pc = [...admin, ...((j.localityInfo && j.localityInfo.informative) || [])]
            .map((a: any) => a && a.name)
            .find((n: any) => typeof n === 'string' && /^\d{6}$/.test(n.trim()));
          if (pc) pincode = pc.trim();
        }
        const loc: DetectedLocation = {
          city: j.city || j.locality || j.principalSubdivision || 'Your area',
          district: j.localityInfo?.administrative?.find((a: any) => a.adminLevel === 5 || a.adminLevel === 6)?.name || j.principalSubdivision || undefined,
          state: j.principalSubdivision || undefined,
          area: j.locality || j.city || undefined,
          pincode,
        };
        localStorage.setItem('igo_cx_location', JSON.stringify(loc));
        resolve(loc);
      } catch { reject(new Error('Could not look up your address. Please enter it manually.')); }
    }, (err) => {
      reject(new Error(err && err.code === 1
        ? 'Location permission was blocked. Allow location access in your browser and try again.'
        : 'Could not get your location. Please enter your address manually.'));
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  });
}

export function getSavedLocation(): DetectedLocation | null {
  return read<DetectedLocation | null>('igo_cx_location', null);
}
