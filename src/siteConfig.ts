// ─────────────────────────────────────────────────────────────────────────────
// Site-wide configuration helper.
// Everything the Admin panel edits is stored here (localStorage) and read by
// the live site (Header marquee, Home hero banners, Cart coupons/GST/delivery,
// site notification bar, admin password).
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  freeDeliveryAbove: number;
  deliveryCharge: number;
  gstPercent: number;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
}

export interface AdminCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiry: string;       // yyyy-mm-dd or ''
  usageLimit: number;
  active: boolean;
}

export interface HeroBanner {
  img: string;
  badge: string;
  title: string;
  sub: string;
  btn: string;
  btnAction: string;    // category slug to open
}

export interface SiteNotification {
  text: string;
  ts: number;
  active: boolean;
}

// Defaults match the site's current live behaviour.
export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'IGO Agri Mart',
  phone: '+91 73977 85803',
  email: 'igobackend3@gmail.com',
  address: 'Chengalpattu & Chennai HQ, Tamil Nadu',
  freeDeliveryAbove: 1300,
  deliveryCharge: 120,
  gstPercent: 18,
  instagramUrl: '',
  facebookUrl: '',
  whatsappNumber: '917397785803',
};

export const DEFAULT_MARQUEE: string[] = [
  'Free Delivery on orders above Rs.1,300',
  'Seeds • Fertilizers • Equipment • Pesticides',
  'Trusted by 10,000+ Farmers across India',
  'Genuine Products • Best Prices • Fast Delivery',
];

const KEYS = {
  settings: 'igo_settings',
  marquee: 'igo_marquee',
  coupons: 'igo_coupons',
  banners: 'igo_banners',
  notification: 'igo_notification',
  homeOverrides: 'igo_home_overrides',
  siteImages: 'igo_site_images',
  pageContent: 'igo_page_content',
  categoryMeta: 'igo_category_meta',
  customCategories: 'igo_custom_categories',
  combos: 'igo_combo_offers',
  adminPwdHash: 'igo_admin_pwd_hash',
  adminSession: 'igo_admin_session',
} as const;

// Admin-defined "Frequently Bought Together" combo offers. Matched to a product
// by name so they survive catalog rebuilds.
export interface ComboOffer {
  mainName: string;     // main product name
  partnerName: string;  // partner product name
  price: number;        // combo bundle price (admin set; defaults to sum of the two)
}

import { supabase } from './lib/supabase';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Write to localStorage immediately for instant UI response, then async sync to Supabase
async function writeWithSync(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
  try {
    await supabase.from('igo_kv_store').upsert({ key, value });
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

// ── Settings ─────────────────────────────────────────────────────────────────
export function getSettings(): SiteSettings {
  return { ...DEFAULT_SETTINGS, ...readJSON<Partial<SiteSettings>>(KEYS.settings, {}) };
}
export function saveSettings(s: SiteSettings): void {
  writeWithSync(KEYS.settings, s);
}

// ── Marquee ──────────────────────────────────────────────────────────────────
export function getMarqueeLines(): string[] {
  const lines = readJSON<string[]>(KEYS.marquee, DEFAULT_MARQUEE);
  return Array.isArray(lines) && lines.length > 0 ? lines : DEFAULT_MARQUEE;
}
export function saveMarqueeLines(lines: string[]): void {
  writeWithSync(KEYS.marquee, lines);
}

// ── Coupons ──────────────────────────────────────────────────────────────────
export function getCoupons(): AdminCoupon[] {
  return readJSON<AdminCoupon[]>(KEYS.coupons, []);
}
export function saveCoupons(coupons: AdminCoupon[]): void {
  writeWithSync(KEYS.coupons, coupons);
}

export interface CouponResult {
  ok: boolean;
  /** percentage (< 100) or fixed amount (>= 100) — matches existing cart logic */
  discount: number;
  message: string;
}

/** Validate a coupon code against admin-created coupons (plus built-in legacy codes). */
export function validateCoupon(code: string, subtotal: number): CouponResult {
  const c = code.trim().toUpperCase();
  const admin = getCoupons().find(x => x.code.toUpperCase() === c);
  if (admin) {
    if (!admin.active) return { ok: false, discount: 0, message: 'This coupon is currently inactive.' };
    if (admin.expiry && new Date(admin.expiry + 'T23:59:59') < new Date())
      return { ok: false, discount: 0, message: 'This coupon has expired.' };
    if (subtotal < admin.minOrder)
      return { ok: false, discount: 0, message: `This coupon is only valid for orders above ₹${admin.minOrder.toLocaleString('en-IN')}.` };
    const discount = admin.type === 'percentage' ? admin.value : admin.value;
    const label = admin.type === 'percentage' ? `${admin.value}% savings unlocked` : `₹${admin.value} flat discount applied`;
    return { ok: true, discount, message: `✓ Coupon ${admin.code} successfully applied! ${label}.` };
  }
  // First-order welcome discount (10% off) — advertised on the welcome popup
  if (c === 'WELCOME10') {
    return { ok: true, discount: 10, message: '✓ Welcome! WELCOME10 applied — 10% off your first order.' };
  }
  // Legacy built-in codes (kept for backwards compatibility)
  if (c === 'HARVEST20') {
    if (subtotal < 1000) return { ok: false, discount: 0, message: 'This coupon is only valid for orders above ₹1,000.' };
    return { ok: true, discount: 20, message: '✓ Coupon HARVEST20 successfully applied! 20% savings unlocked.' };
  }
  if (c === 'IGO500') {
    if (subtotal < 2500) return { ok: false, discount: 0, message: 'This coupon is only valid for orders above ₹2,500.' };
    return { ok: true, discount: 500, message: '✓ Coupon IGO500 successfully applied! ₹500 flat discount applied.' };
  }
  return { ok: false, discount: 0, message: '✗ Invalid coupon code.' };
}

// ── Hero banners ─────────────────────────────────────────────────────────────
export function getBanners(): HeroBanner[] {
  const banners = readJSON<HeroBanner[]>(KEYS.banners, []);
  return Array.isArray(banners) ? banners.filter(b => b && b.img && b.title) : [];
}
export function saveBanners(banners: HeroBanner[]): void {
  writeWithSync(KEYS.banners, banners);
}

// ── Site notification bar ────────────────────────────────────────────────────
export function getNotification(): SiteNotification | null {
  const n = readJSON<SiteNotification | null>(KEYS.notification, null);
  return n && n.active && n.text ? n : null;
}
export function setNotification(text: string): void {
  writeWithSync(KEYS.notification, { text, ts: Date.now(), active: true });
}
export function clearNotification(): void {
  localStorage.removeItem(KEYS.notification);
}

// ── Editable site images (admin "Image Manager") ────────────────────────────
// Named image slots the admin can override site-wide. Each component calls
// siteImage('slotKey', builtInFallback) so it shows the admin's image if set,
// otherwise the original. Syncs to Supabase like all other site config.
export type SiteImages = Record<string, string>;
export function getSiteImages(): SiteImages {
  return readJSON<SiteImages>(KEYS.siteImages, {});
}
export function saveSiteImages(images: SiteImages): void {
  writeWithSync(KEYS.siteImages, images);
}
export function siteImage(key: string, fallback: string): string {
  const v = getSiteImages()[key];
  return v && v.trim() ? v : fallback;
}

// ── Custom categories (admin adds brand-new categories) ─────────────────────
export interface CustomCategory { name: string; slug: string; image?: string; }
export function getCustomCategories(): CustomCategory[] {
  const list = readJSON<CustomCategory[]>(KEYS.customCategories, []);
  return Array.isArray(list) ? list.filter((c) => c && c.name) : [];
}
export function saveCustomCategories(list: CustomCategory[]): void {
  writeWithSync(KEYS.customCategories, list);
}

// ── Combo offers (admin "Frequently Bought Together") ────────────────────────
export function getCombos(): ComboOffer[] {
  const list = readJSON<ComboOffer[]>(KEYS.combos, []);
  return Array.isArray(list) ? list.filter((c) => c && c.mainName && c.partnerName) : [];
}
export function saveCombos(list: ComboOffer[]): void {
  writeWithSync(KEYS.combos, list);
}

// ── Category manager (admin edits each category's label + tile image) ────────
export type CategoryMeta = Record<string, { label?: string; image?: string; hidden?: boolean }>;
export function getCategoryMeta(): CategoryMeta {
  return readJSON<CategoryMeta>(KEYS.categoryMeta, {});
}
export function saveCategoryMeta(meta: CategoryMeta): void {
  writeWithSync(KEYS.categoryMeta, meta);
}

// ── Editable page text content (admin "Pages" editor) ────────────────────────
// Per-page key→value text store. Components call pageText('page','field',fallback).
export type PageContent = Record<string, Record<string, string>>;
export function getPageContent(): PageContent {
  return readJSON<PageContent>(KEYS.pageContent, {});
}
export function savePageContent(content: PageContent): void {
  writeWithSync(KEYS.pageContent, content);
}
export function pageText(page: string, field: string, fallback: string): string {
  const v = getPageContent()?.[page]?.[field];
  return v && v.trim() ? v : fallback;
}

// ── Homepage Overrides ───────────────────────────────────────────────────────
export type HomeOverrides = Record<string, string[]>;

export function getHomeOverrides(): HomeOverrides {
  return readJSON<HomeOverrides>(KEYS.homeOverrides, {});
}
export function saveHomeOverrides(overrides: HomeOverrides): void {
  writeWithSync(KEYS.homeOverrides, overrides);
}

// ── Complex Homepage Overrides (Kits, Crops, Brands) ─────────────────────────
export interface OverrideKit {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  items: string[];
  image: string;
}

export interface OverrideCrop {
  id: string;
  name: string;
  slug: string;
  img: string;
}

export interface OverrideBrand {
  id: string;
  name: string;
  slug: string;
}

export interface ComplexOverrides {
  kits: OverrideKit[];
  crops: OverrideCrop[];
  brands: OverrideBrand[];
}

export function getComplexOverrides(): ComplexOverrides {
  return readJSON<ComplexOverrides>('igo_complex_overrides', { kits: [], crops: [], brands: [] });
}
export function saveComplexOverrides(overrides: ComplexOverrides): void {
  writeWithSync('igo_complex_overrides', overrides);
}

// ── Admin password ───────────────────────────────────────────────────────────
// Default password (used until the admin changes it from Settings → Security):
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

async function hashText(text: string): Promise<string> {
  try {
    if (window.crypto?.subtle) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch { /* fall through */ }
  // Non-secure-context fallback (dev over plain http on LAN)
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return 'djb2:' + h.toString(16) + ':' + text.length;
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const stored = localStorage.getItem(KEYS.adminPwdHash);
  if (!stored) return input === DEFAULT_ADMIN_PASSWORD;
  return (await hashText(input)) === stored;
}

export async function changeAdminPassword(current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await verifyAdminPassword(current))) return { ok: false, error: 'Current password is incorrect.' };
  if (next.length < 8) return { ok: false, error: 'New password must be at least 8 characters.' };
  writeWithSync(KEYS.adminPwdHash, await hashText(next));
  return { ok: true };
}

// ── Admin session (survives page refresh on /admin within the same tab) ──────
export function isAdminSessionActive(): boolean {
  return sessionStorage.getItem(KEYS.adminSession) === '1';
}
export function startAdminSession(): void {
  sessionStorage.setItem(KEYS.adminSession, '1');
}
export function endAdminSession(): void {
  sessionStorage.removeItem(KEYS.adminSession);
}
