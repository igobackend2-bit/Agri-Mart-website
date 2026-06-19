import React, { useState, useEffect, useRef } from 'react';
// Full admin control panel — products, orders, inventory, coupons, content, settings
import {
  ShoppingBag, Tag, Users, Trash2, Plus, Edit3,
  Search, RefreshCw, DollarSign,
  AlertTriangle, TrendingUp, Image, Shield,
  CheckCircle, LayoutDashboard,
  Archive, PieChart, Gift, Monitor, Wrench, LogOut, KeyRound, Bell, Inbox, Download, Store, ExternalLink, Upload
} from 'lucide-react';
import { Product, Order, Category, Brand } from '../types';
import {
  fetchAllOrders, updateOrderStatus, seedProducts,
  deleteProduct, addProduct, clearAndReseedProducts, fetchUserProfile, appendOrderMessage
} from '../dbHelper';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import { VisitorLead, LeadStatus, LeadSource, fetchAllLeads, setLeadStatus, removeLead, downloadLeadsCsv } from '../leads';
import {
  persistProductUpsert, persistProductDelete, persistStockSet, refillAllStocks,
  getLocalOrders, updateLocalOrderStatus, saveLocalOrder, sendInboxMessage, playAdminAlertSound, playLowStockSound, playOutOfStockSound, mergeOrdersByStatus
} from '../storeData';
import {
  getSettings, saveSettings as persistSettings,
  getMarqueeLines, saveMarqueeLines,
  getCoupons, saveCoupons,
  getBanners, saveBanners, HeroBanner,
  getNotification, setNotification, clearNotification,
  changeAdminPassword,
  getHomeOverrides, saveHomeOverrides, HomeOverrides,
  getComplexOverrides, saveComplexOverrides, ComplexOverrides,
  getSiteImages, saveSiteImages, SiteImages,
  getCategoryMeta, saveCategoryMeta, CategoryMeta,
  getCustomCategories, saveCustomCategories, CustomCategory,
  getComboConfig, saveComboConfig, ComboConfig,
  getAgriEvents, saveAgriEvents, AgriEvent,
  getSellers, saveSellers, Seller
} from '../siteConfig';

interface AdminComponentProps {
  lang: 'en' | 'ta';
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: Category[];
  brands: Brand[];
  onLogout?: () => void;
  setCurrentPage?: (p: string) => void;
}

type AdminTab = 'Dashboard' | 'Orders' | 'Leads' | 'Products' | 'Inventory' | 'Customers' | 'Sellers' | 'Reports' | 'Coupons' | 'Content' | 'Settings';

interface CouponData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiry: string;
  usageLimit: number;
  active: boolean;
}

const TAB_CONFIG: { id: AdminTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-emerald-600' },
  { id: 'Orders', label: 'Orders', icon: ShoppingBag, color: 'text-blue-600' },
  { id: 'Leads', label: 'Visitor Leads', icon: Inbox, color: 'text-rose-600' },
  { id: 'Products', label: 'Products', icon: Tag, color: 'text-violet-600' },
  { id: 'Inventory', label: 'Inventory', icon: Archive, color: 'text-orange-600' },
  { id: 'Customers', label: 'Customers', icon: Users, color: 'text-cyan-600' },
  { id: 'Sellers', label: 'Sellers', icon: Store, color: 'text-emerald-600' },
  { id: 'Reports', label: 'Reports', icon: PieChart, color: 'text-pink-600' },
  { id: 'Coupons', label: 'Coupons', icon: Gift, color: 'text-amber-600' },
  { id: 'Content', label: 'Content', icon: Monitor, color: 'text-teal-600' },
  { id: 'Settings', label: 'Settings', icon: Wrench, color: 'text-slate-600' },
];

export default function AdminComponent({ lang, products, setProducts, categories, brands, onLogout, setCurrentPage }: AdminComponentProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [slotFilter, setSlotFilter] = useState<string>('All');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  // Global combo offer (Frequently Bought Together) — one partner product + a
  // discount % shown alongside ANY product the customer views.
  const [comboCfg, setComboCfg] = useState<ComboConfig>(() => getComboConfig());

  // Seller submissions (vendors who want to sell on the site).
  const [sellers, setSellers] = useState<Seller[]>(() => getSellers());
  const updateSeller = (id: string, patch: Partial<Seller>) => {
    const next = getSellers().map((s) => (s.id === id ? { ...s, ...patch } : s));
    saveSellers(next); setSellers(next);
  };
  const removeSeller = (id: string) => {
    if (!window.confirm('Remove this seller submission?')) return;
    const next = getSellers().filter((s) => s.id !== id);
    saveSellers(next); setSellers(next);
  };
  const readSellerImage = (file: File | undefined, cb: (url: string) => void) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => cb(ev.target?.result as string);
    r.readAsDataURL(file);
  };

  // Upcoming Agri Events editor.
  const [events, setEvents] = useState<AgriEvent[]>(() => getAgriEvents());
  const [newEvent, setNewEvent] = useState<AgriEvent>({ name: '', city: '', date: '', type: 'Trade Expo', emoji: '🏭' });
  const handleAddEvent = () => {
    if (!newEvent.name.trim() || !newEvent.city.trim() || !newEvent.date.trim()) { alert('Please fill event name, city and date.'); return; }
    const next = [...events, { ...newEvent, name: newEvent.name.trim(), city: newEvent.city.trim(), date: newEvent.date.trim() }];
    setEvents(next); saveAgriEvents(next);
    setNewEvent({ name: '', city: '', date: '', type: 'Trade Expo', emoji: '🏭' });
  };
  const handleRemoveEvent = (idx: number) => {
    const next = events.filter((_, i) => i !== idx);
    setEvents(next); saveAgriEvents(next);
  };
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [custSearch, setCustSearch] = useState('');
  const [leads, setLeads] = useState<VisitorLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState<'All' | LeadSource>('All');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'All' | LeadStatus>('All');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [adminMsg, setAdminMsg] = useState('');
  // Real customer profile (looked up by the order's userId) so the modal shows the
  // actual buyer — not a stale name saved in the delivery address.
  const [modalProfile, setModalProfile] = useState<any>(null);
  useEffect(() => {
    setModalProfile(null);
    if (viewOrder?.userId) {
      fetchUserProfile(viewOrder.userId).then((p) => { if (p) setModalProfile(p); }).catch(() => { /* ignore */ });
    }
  }, [viewOrder]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [invSearch, setInvSearch] = useState('');

  const [coupons, setCoupons] = useState<CouponData[]>(() => getCoupons());
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState<CouponData>({
    code: '', type: 'percentage', value: 10, minOrder: 500, expiry: '', usageLimit: 100, active: true
  });

  const [marqueeLines, setMarqueeLines] = useState<string[]>(() => getMarqueeLines());
  const [editingMarquee, setEditingMarquee] = useState(false);
  const [marqueeInput, setMarqueeInput] = useState('');

  const [settings, setSettings] = useState<Record<string, any>>(() => getSettings());

  // Hero banners (shown on the homepage slider)
  const [banners, setBanners] = useState<HeroBanner[]>(() => {
    const stored = getBanners();
    while (stored.length < 3) stored.push({ img: '', badge: '', title: '', sub: '', btn: 'Shop Now', btnAction: 'seeds-saplings' });
    return stored.slice(0, 3);
  });

  // Homepage Section Overrides
  const [homeOverrides, setHomeOverrides] = useState<HomeOverrides>(() => getHomeOverrides());
  const [complexOverrides, setComplexOverrides] = useState<ComplexOverrides>(() => getComplexOverrides());
  const [activeOverrideSection, setActiveOverrideSection] = useState<string>('');
  const [overrideForm, setOverrideForm] = useState<any>({});

  // Editable site images (Image Manager)
  const SITE_IMAGE_SLOTS: { key: string; label: string; hint: string }[] = [
    { key: 'login_bg', label: 'Login Page Background', hint: 'Full-screen image behind the login/sign-up form' },
  ];
  const [siteImages, setSiteImagesState] = useState<SiteImages>(() => getSiteImages());
  const saveSiteImagesHandler = () => {
    saveSiteImages(siteImages);
    alert('Site images saved. They now apply across the website.');
  };
  // Read ANY image from the computer and auto-resize/compress it so it's small
  // enough to store — no size limit on the original file.
  const readImageFile = async (file: File | undefined, onLoad: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please choose an image file.'); return; }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage.from('Images').upload(filePath, file, { upsert: false });
      
      if (error) {
        console.error('Upload Error:', error);
        alert('Failed to upload image. Please check Supabase policies.');
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(filePath);
      onLoad(publicUrl);
    } catch (err) {
      console.error(err);
      alert('Network or Supabase Error during upload.');
    }
  };

  // Category Manager — edit each homepage category's label + tile image
  const [categoryMeta, setCategoryMetaState] = useState<CategoryMeta>(() => getCategoryMeta());
  const saveCategoryMetaHandler = () => {
    saveCategoryMeta(categoryMeta);
    alert('Categories saved. Labels and images now apply on the homepage.');
  };
  const setCatField = (name: string, field: 'label' | 'image' | 'hidden', value: any) => {
    setCategoryMetaState({ ...categoryMeta, [name]: { ...(categoryMeta[name] || {}), [field]: value } });
  };
  // Add brand-new categories
  const [customCats, setCustomCats] = useState<CustomCategory[]>(() => getCustomCategories());
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const addCustomCategory = () => {
    const name = newCatName.trim();
    if (!name) { alert('Enter a category name.'); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (customCats.some((c) => c.name.toLowerCase() === name.toLowerCase()) || categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert('That category already exists.'); return;
    }
    const next = [...customCats, { name, slug, image: newCatImage.trim() }];
    setCustomCats(next);
    saveCustomCategories(next);
    setNewCatName(''); setNewCatImage('');
    alert(`Category "${name}" added. It now appears on the homepage and in the product form. Add products to it from the Products tab.`);
  };
  const removeCustomCategory = (slug: string) => {
    const next = customCats.filter((c) => c.slug !== slug);
    setCustomCats(next);
    saveCustomCategories(next);
  };

  // Site notification
  const [notifInput, setNotifInput] = useState('');
  const [activeNotif, setActiveNotif] = useState(() => getNotification());

  // Admin password change
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Seeds & Saplings', subcategory: '', brand: 'IGO Seeds',
    price: 350, mrp: 450, discount: 22,
    images: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
    description: '', stock: 120, problemFilter: 'Growth Boosters',
    unit: '', dosage: '', crops: '', isOrganic: false, expiryDate: '', origin: '', batchNumber: '', moq: 1,
    usage: '', composition: ''
  });

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      let all: Order[] = [];
      try { all = await fetchAllOrders(); } catch { }
      const local = getLocalOrders();
      setOrders(mergeOrdersByStatus(all, local));
    } catch (err) { console.error(err); }
    finally { setIsLoadingOrders(false); }
  };

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setCustomers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    } catch { setCustomers([]); }
    finally { setLoadingCustomers(false); }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try { setLeads(await fetchAllLeads()); } catch { }
    finally { setLoadingLeads(false); }
  };

  const handleLeadStatus = async (id: string, status: LeadStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    try { await setLeadStatus(id, status); } catch { }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    setLeads(leads.filter(l => l.id !== id));
    try { await removeLead(id); } catch { }
  };

  useEffect(() => { loadOrders(); loadLeads(); loadCustomers(); }, []);

  // Audible stock alert when the admin opens the Dashboard or Inventory tab.
  // Tying it to a tab click means there is a user gesture, so the browser allows
  // the sound to play (audio on page-load is blocked by autoplay policy). Urgent
  // siren for OUT of stock + gentle warning for LOW stock — both play when both
  // conditions exist.
  useEffect(() => {
    if (activeTab !== 'Dashboard' && activeTab !== 'Inventory' && activeTab !== 'Products') return;
    const out = products.filter(p => p.stock === 0).length;
    const low = products.filter(p => p.stock > 0 && p.stock < 20).length;
    if (out > 0) playOutOfStockSound();
    if (low > 0) setTimeout(() => playLowStockSound(), out > 0 ? 1100 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'Customers') loadCustomers();
    if (activeTab === 'Reports') loadOrders();
    if (activeTab === 'Leads') loadLeads();
  }, [activeTab]);

  // ── Live auto-refresh every 5s — but PAUSE while the admin is editing ─────────
  // "Editing" = any form/modal open OR the cursor is in an input/select/textarea.
  // Refresh is silent (no spinner) so it never disrupts the admin's work, and it
  // resumes automatically the moment editing finishes.
  const editingRef = useRef(false);
  editingRef.current = !!(
    viewOrder || showProductForm || showCouponForm || editingMarquee ||
    activeOverrideSection
  );
  useEffect(() => {
    const silentRefresh = async () => {
      let all: Order[] = [];
      try { all = await fetchAllOrders(); } catch { /* offline — keep local */ }
      setOrders(mergeOrdersByStatus(all, getLocalOrders()));
      try { setLeads(await fetchAllLeads()); } catch { /* ignore */ }
    };
    const id = setInterval(() => {
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName || '');
      if (editingRef.current || typing) return; // don't refresh mid-edit
      silentRefresh();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const STATUS_INBOX_TEXT: Record<string, string> = {
    Confirmed: 'has been confirmed ✅. We are preparing your items.',
    Dispatched: 'has been packed and shipped 🚚. It is on the way to you.',
    Delivered: 'has been delivered 🎉. Thank you for shopping with IGO Agri Mart!',
    Cancelled: 'has been cancelled. Amount paid (if any) will be refunded.',
    Placed: 'has been received and is awaiting confirmation.',
  };

  const handleStatusChange = async (orderId: string, nextStatus: Order['status']) => {
    try { await updateOrderStatus(orderId, nextStatus); } catch { }
    updateLocalOrderStatus(orderId, nextStatus);
    const order = orders.find(o => o.id === orderId);
    // Persist the FULL order (with new status) to the local mirror so the change
    // always survives a refresh and shows on the customer's order page, even if
    // this order wasn't already cached on the admin's device.
    if (order) { try { saveLocalOrder({ ...order, status: nextStatus }); } catch { } }
    sendInboxMessage({
      toEmail: order?.deliveryAddress?.email || 'all',
      title: 'Order ' + orderId + ' — ' + nextStatus,
      body: 'Hi ' + (order?.deliveryAddress?.name || 'customer') + ', your order ' + orderId + ' ' + (STATUS_INBOX_TEXT[nextStatus] || 'status updated to ' + nextStatus + '.'),
      orderId,
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '', category: 'Seeds & Saplings', subcategory: '', brand: 'IGO Seeds',
      price: 350, mrp: 450, discount: 22,
      images: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
      description: '', stock: 120, problemFilter: 'Growth Boosters',
      unit: '', dosage: '', crops: '', isOrganic: false, expiryDate: '', origin: '', batchNumber: '', moq: 1,
      usage: '', composition: ''
    });
    setEditingProductId(null);
  };

  const startEditProduct = (p: Product) => {
    setNewProduct({
      name: p.name, category: p.category, subcategory: p.subcategory || '', brand: p.brand,
      price: p.price, mrp: p.mrp, discount: p.discount || 0,
      images: (p.images || []).join('\n'), description: p.description || '', stock: p.stock,
      problemFilter: p.problemFilter || 'Growth Boosters',
      unit: p.unit || '', dosage: p.dosage || '', crops: (p.crops || []).join(', '),
      isOrganic: !!p.isOrganic, expiryDate: p.expiryDate || '', origin: p.origin || '',
      batchNumber: p.batchNumber || '', moq: p.moq || 1,
      usage: p.usage || '', composition: p.composition || ''
    });
    setEditingProductId(p.id);
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStock = async (prodId: string, stock: number) => {
    const target = products.find(p => p.id === prodId);
    if (!target) return;
    const updated = { ...target, stock: Math.max(0, stock) };
    persistStockSet(prodId, updated.stock);
    setProducts(products.map(p => p.id === prodId ? updated : p));
    try { await addProduct(updated); } catch { }
  };

  const handleRefillAll = () => {
    if (!window.confirm('Refill ALL products to 200 units of stock?')) return;
    refillAllStocks(products, 200);
    setProducts(products.map(p => ({ ...p, stock: 200 })));
    alert('Done! Every product is refilled to 200 units.');
  };

  // ── Global combo offer (Frequently Bought Together) ────────────────────────
  const handleSaveCombo = () => {
    if (!comboCfg.partnerName) { alert('Pick the offer product to bundle with every item.'); return; }
    const pct = Math.max(0, Math.min(90, Number(comboCfg.percentOff) || 0));
    const next = { ...comboCfg, percentOff: pct, enabled: true };
    setComboCfg(next); saveComboConfig(next);
    alert('Combo offer saved! "' + next.partnerName + '" now shows with every product at ' + pct + '% off the combined price.');
  };
  const handleDisableCombo = () => {
    const next = { ...comboCfg, enabled: false };
    setComboCfg(next); saveComboConfig(next);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) { alert('Product name is required.'); return; }
    const subcategory = newProduct.subcategory.trim() || newProduct.category;
    // Support multiple gallery images — one URL/data-URI per line.
    const imageList = (newProduct.images || '').split('\n').map(s => s.trim()).filter(Boolean);

    // Editing an existing product
    if (editingProductId) {
      const existing = products.find(p => p.id === editingProductId);
      if (existing) {
        const updated: Product = {
          ...existing,
          name: newProduct.name, category: newProduct.category, subcategory,
          brand: newProduct.brand, price: Number(newProduct.price), mrp: Number(newProduct.mrp),
          discount: Number(newProduct.discount) || Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100),
          images: imageList.length ? imageList : existing.images,
          description: newProduct.description || existing.description,
          usage: newProduct.usage || existing.usage,
          composition: newProduct.composition || existing.composition,
          stock: Number(newProduct.stock), problemFilter: newProduct.problemFilter,
          unit: newProduct.unit || undefined, dosage: newProduct.dosage || undefined,
          crops: newProduct.crops ? newProduct.crops.split(',').map(c => c.trim()).filter(Boolean) : undefined,
          isOrganic: newProduct.isOrganic, expiryDate: newProduct.expiryDate || undefined,
          origin: newProduct.origin || undefined, batchNumber: newProduct.batchNumber || undefined,
          moq: Number(newProduct.moq) || undefined,
        };
        try { await addProduct(updated); } catch { }
        persistProductUpsert(updated, false);
        setProducts(products.map(p => p.id === editingProductId ? updated : p));
        setShowProductForm(false);
        resetProductForm();
        alert('Product updated: ' + updated.name);
      }
      return;
    }

    const created: Product = {
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProduct.name, category: newProduct.category, subcategory,
      brand: newProduct.brand, price: Number(newProduct.price), mrp: Number(newProduct.mrp),
      discount: Number(newProduct.discount) || Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100),
      images: imageList.length ? imageList : ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80'],
      description: newProduct.description || 'Premium quality agricultural input.',
      rating: 4.8, reviewCount: 1, stock: Number(newProduct.stock),
      problemFilter: newProduct.problemFilter,
      usage: newProduct.usage || 'As directed on label.',
      composition: newProduct.composition || 'As per specification.',
      isIgoOwn: brands.find(x => x.name === newProduct.brand)?.type === 'igo_own' || false,
      unit: newProduct.unit || undefined, dosage: newProduct.dosage || undefined,
      crops: newProduct.crops ? newProduct.crops.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      isOrganic: newProduct.isOrganic, expiryDate: newProduct.expiryDate || undefined,
      origin: newProduct.origin || undefined, batchNumber: newProduct.batchNumber || undefined,
      moq: Number(newProduct.moq) || undefined
    };
    try { await addProduct(created); } catch { }
    persistProductUpsert(created, true);
    setProducts([created, ...products]);
    setShowProductForm(false);
    resetProductForm();
    alert('Product added: ' + created.name);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(prodId); } catch { }
    persistProductDelete(prodId);
    setProducts(products.filter(p => p.id !== prodId));
  };

  const saveCoupon = () => {
    if (!newCoupon.code.trim()) { alert('Coupon code is required.'); return; }
    const updated = [...coupons.filter(c => c.code !== newCoupon.code.toUpperCase()), { ...newCoupon, code: newCoupon.code.toUpperCase() }];
    setCoupons(updated);
    saveCoupons(updated);
    setShowCouponForm(false);
    setNewCoupon({ code: '', type: 'percentage', value: 10, minOrder: 500, expiry: '', usageLimit: 100, active: true });
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    setCoupons(updated);
    saveCoupons(updated);
  };

  const toggleCoupon = (code: string) => {
    const updated = coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
    setCoupons(updated);
    saveCoupons(updated);
  };

  const saveMarquee = () => {
    const lines = marqueeInput.split('\n').map(l => l.trim()).filter(Boolean);
    setMarqueeLines(lines);
    saveMarqueeLines(lines);
    setEditingMarquee(false);
  };

  const saveSettings = () => {
    persistSettings(settings as any);
    alert('Settings saved! Delivery, GST and store details now apply across the site.');
  };

  const handleSaveBanners = () => {
    const valid = banners.filter(b => b.img.trim() && b.title.trim());
    saveBanners(valid);
    alert(valid.length > 0
      ? valid.length + ' custom hero banner(s) saved. The homepage slider now shows your banners.'
      : 'No complete banners (image + title required) — homepage will show the default slider.');
  };

  const updateBanner = (i: number, field: keyof HeroBanner, value: string) => {
    setBanners(banners.map((b, idx) => idx === i ? { ...b, [field]: value } : b));
  };

  const handleSendNotification = () => {
    if (!notifInput.trim()) { alert('Enter a notification message first.'); return; }
    setNotification(notifInput.trim());
    setActiveNotif(getNotification());
    setNotifInput('');
    alert('Notification is now live on the site (top bar).');
  };

  const handleClearNotification = () => {
    clearNotification();
    setActiveNotif(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdMsg({ ok: false, text: 'New passwords do not match.' });
      return;
    }
    const result = await changeAdminPassword(pwdForm.current, pwdForm.next);
    if (result.ok) {
      setPwdMsg({ ok: true, text: 'Password changed successfully. Use the new password on your next login.' });
      setPwdForm({ current: '', next: '', confirm: '' });
    } else {
      setPwdMsg({ ok: false, text: result.error || 'Could not change password.' });
    }
  };

  const revenue = orders.filter(x => x.status !== 'Cancelled').reduce((s, x) => s + x.totalAmount, 0);
  const pendingOrders = orders.filter(x => x.status === 'Placed').length;
  const deliveredOrders = orders.filter(x => x.status === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 20);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const filteredOrders = orders.filter(o => {
    const q = orderSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q) ||
      (o.deliveryAddress?.name || '').toLowerCase().includes(q);
    const matchesSlot = slotFilter === 'All' || (o.deliverySlot || 'Standard (2–4 days)') === slotFilter;
    return matchesSearch && matchesSlot;
  });
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearchQuery.toLowerCase())
  );
  const inventoryProducts = products.filter(p => {
    if (stockFilter === 'low' && !(p.stock > 0 && p.stock < 20)) return false;
    if (stockFilter === 'out' && p.stock !== 0) return false;
    const q = invSearch.trim().toLowerCase();
    if (q && !(p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.id || '').toLowerCase().includes(q))) return false;
    return true;
  });

  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const filteredLeads = leads.filter(l => {
    if (leadSourceFilter !== 'All' && l.source !== leadSourceFilter) return false;
    if (leadStatusFilter !== 'All' && l.status !== leadStatusFilter) return false;
    const q = leadSearch.toLowerCase();
    if (!q) return true;
    return [l.name, l.phone, l.email, l.subject, l.message, l.source].some(v => (v || '').toLowerCase().includes(q));
  });
  const leadStatusColor = (st: string) => ({
    New: 'bg-rose-50 text-rose-700 border-rose-200',
    Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
    Converted: 'bg-green-50 text-green-700 border-green-200',
    Closed: 'bg-slate-100 text-slate-500 border-slate-200',
  }[st] || 'bg-slate-50 text-slate-700 border-slate-200');

  const statusColor = (s: string) => ({
    Placed: 'bg-blue-50 text-blue-700 border-blue-200',
    Confirmed: 'bg-amber-50 text-amber-700 border-amber-200',
    Dispatched: 'bg-purple-50 text-purple-700 border-purple-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
  }[s] || 'bg-slate-50 text-slate-700 border-slate-200');

  const categoryRevenue: Record<string, number> = {};
  orders.filter(o => o.status !== 'Cancelled').forEach(o =>
    o.items?.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'Other';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.price * item.quantity;
    })
  );
  const topCategories = Object.entries(categoryRevenue).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const imgFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=80&q=80';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-[#F7F9F4] to-amber-50/40">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-gradient-to-r from-[#0B3D22] to-[#1B6B3A] rounded-2xl px-5 py-4 shadow-lg shadow-emerald-900/20">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-lime-300" />
          </div>
          <div>
            <h2 className="font-display font-black text-white text-lg sm:text-xl leading-none tracking-tight">Admin Control Panel</h2>
            <p className="text-[11px] text-emerald-100/80 mt-1.5 font-medium">{products.length} products &middot; {orders.length} orders total</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {setCurrentPage && (
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-lg font-bold transition">
              <Store className="h-3.5 w-3.5" /> View Store
            </button>
          )}
          <button onClick={() => { loadOrders(); loadLeads(); }} className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-lg font-bold transition">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-white bg-rose-500/90 hover:bg-rose-500 px-3.5 py-2 rounded-lg font-bold transition shadow-sm">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap bg-white border border-slate-200 rounded-2xl p-2 mb-6 shadow-sm">
        {TAB_CONFIG.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#1B6B3A] text-white shadow-md shadow-emerald-900/20' : 'text-slate-500 hover:text-[#1B6B3A] hover:bg-emerald-50'
            }`}>
            <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-white' : ''}`} />
            {tab.label}
            {tab.id === 'Orders' && pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingOrders}</span>
            )}
            {tab.id === 'Inventory' && outOfStockProducts.length > 0 && (
              <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{outOfStockProducts.length}</span>
            )}
            {tab.id === 'Leads' && newLeadsCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{newLeadsCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: 'Rs.' + revenue.toLocaleString('en-IN'), icon: DollarSign, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', sub: 'All-time non-cancelled', tab: 'Orders' },
              { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-700 border-blue-200', sub: pendingOrders + ' pending', tab: 'Orders' },
              { label: 'Products', value: products.length, icon: Tag, color: 'bg-violet-50 text-violet-700 border-violet-200', sub: outOfStockProducts.length + ' out of stock', tab: 'Products' },
              { label: 'Delivered', value: deliveredOrders, icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200', sub: orders.filter(o=>o.status==='Dispatched').length + ' in transit', tab: 'Orders' },
            ].map((kpi, i) => (
              <div 
                key={i} 
                onClick={() => setActiveTab(kpi.tab as AdminTab)}
                className={'border rounded-xl p-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all ' + kpi.color}
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="h-5 w-5 opacity-70" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{kpi.label}</span>
                </div>
                <div className="text-2xl font-black">{kpi.value}</div>
                <div className="text-[11px] mt-1 opacity-60">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
            <div className="space-y-2">
              {outOfStockProducts.length > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span className="text-sm font-bold text-red-700">{outOfStockProducts.length} products are out of stock</span>
                  <button onClick={() => setActiveTab('Inventory')} className="ml-auto text-xs text-red-600 underline">View</button>
                </div>
              )}
              {lowStockProducts.length > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-bold text-amber-700">{lowStockProducts.length} products have low stock</span>
                  <button onClick={() => setActiveTab('Inventory')} className="ml-auto text-xs text-amber-600 underline">View</button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800">Recent Orders</h3>
              <button onClick={() => setActiveTab('Orders')} className="text-xs text-[#1B6B3A] font-bold hover:underline">View all</button>
            </div>
            {isLoadingOrders ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No orders yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>{['Order ID','Customer','Amount','Status','Update'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.slice(0, 8).map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700 text-[10px]">{o.id.slice(0, 12)}</td>
                        <td className="p-3">{o.deliveryAddress?.name || '-'}</td>
                        <td className="p-3 font-bold text-[#1B6B3A]">Rs.{o.totalAmount}</td>
                        <td className="p-3"><span className={'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + statusColor(o.status)}>{o.status}</span></td>
                        <td className="p-3">
                          <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as Order['status'])}
                            className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold">
                            {['Placed','Confirmed','Packed','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-sm text-[#1B6B3A] mb-1">Developer: Seed Database</h4>
            <p className="text-xs text-slate-400 mb-4">Populate Firestore with sample agri products if database is empty.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={async () => {
                if (!window.confirm('Seed products to Firestore? (Only runs if database is empty)')) return;
                try { await seedProducts(); alert('Database seeded!'); } catch { alert('Seeding complete.'); }
              }} className="bg-[#E8A020] text-emerald-950 font-black text-xs px-5 py-2.5 rounded-lg">
                Seed Products (if empty)
              </button>
              <button onClick={async () => {
                if (!window.confirm('WARNING: This will DELETE all existing Firestore products and replace with fresh catalog. Continue?')) return;
                try {
                  const result = await clearAndReseedProducts();
                  alert('Done! Deleted ' + result.deleted + ' old products. Seeded ' + result.seeded + ' fresh products. Reload the page now.');
                  window.location.reload();
                } catch { alert('Error during re-seed. Check console.'); }
              }} className="bg-red-600 text-white font-black text-xs px-5 py-2.5 rounded-lg">
                Force Clear + Re-seed
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Orders' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Order Management ({orders.length} total)</h3>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" value={orderSearchQuery} onChange={e => setOrderSearchQuery(e.target.value)}
                placeholder="Search ID, phone, name..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold outline-none" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Placed','Confirmed','Dispatched','Delivered','Cancelled'].map(s => (
              <span key={s} className={'px-3 py-1 rounded-full text-xs font-bold border ' + statusColor(s)}>
                {s}: {orders.filter(o => o.status === s).length}
              </span>
            ))}
          </div>
          {/* Orders by delivery slot — click a slot to filter the table below */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">Filter by delivery slot:</span>
            {(() => {
              const counts = orders.reduce((acc: Record<string, number>, o) => {
                const k = o.deliverySlot || 'Standard (2–4 days)';
                acc[k] = (acc[k] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              // Always show every slot option (even with 0 orders) so the admin
              // sees the full morning / midday / evening / standard breakdown.
              const ALL_SLOTS = ['Tomorrow, 6–9 AM', 'Tomorrow, 9 AM–12 PM', 'Tomorrow, 4–7 PM', 'Standard (2–4 days)'];
              const slotKeys = [...ALL_SLOTS, ...Object.keys(counts).filter(k => !ALL_SLOTS.includes(k))];
              const chips = [['All', orders.length] as [string, number], ...slotKeys.map(k => [k, counts[k] || 0] as [string, number])];
              return chips.map(([slot, count]) => {
                const active = slotFilter === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSlotFilter(slot)}
                    className={'px-3 py-1 rounded-full text-xs font-bold border transition ' +
                      (active ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'border-emerald-200 bg-emerald-50 text-[#1B6B3A] hover:border-emerald-300')}
                  >
                    {slot}: {count}
                  </button>
                );
              });
            })()}
            {orders.length === 0 && <span className="text-xs text-slate-400">No orders yet.</span>}
          </div>
          {isLoadingOrders ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading orders...</div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>{['Order ID','Customer','Items','Total','Payment','Delivery Slot','Status'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="py-10 text-center text-slate-400 italic">No orders found.</td></tr>
                  ) : filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/40">
                      <td className="p-3 font-mono font-bold text-[10px]">
                        <button onClick={() => { setViewOrder(o); setAdminMsg(''); }} className="text-[#1B6B3A] hover:underline font-black">{o.id}</button>
                      </td>
                      <td className="p-3">
                        <button onClick={() => { setViewOrder(o); setAdminMsg(''); }} className="text-left hover:underline">
                          <div className="font-black text-slate-900">{customers.find(c => c.uid === o.userId)?.name || o.deliveryAddress?.name}</div>
                          <div className="text-xs font-bold text-slate-800">{customers.find(c => c.uid === o.userId)?.email || o.deliveryAddress?.email || o.deliveryAddress?.city}</div>
                        </button>
                      </td>
                      <td className="p-3 min-w-[160px] max-w-[240px] align-top">
                        {o.items?.map((it, i) => (
                          <div key={i} className="text-[11px] text-slate-600 leading-snug">• {it.name} <span className="text-slate-400">x{it.quantity}</span></div>
                        ))}
                        {(!o.items || o.items.length === 0) && <span className="text-[10px] text-slate-400 italic">No items</span>}
                      </td>
                      <td className="p-3 font-bold text-[#1B6B3A] whitespace-nowrap align-top">Rs.{o.totalAmount}</td>
                      <td className="p-3 text-[10px] text-slate-500">{o.paymentMethod || 'COD'}</td>
                      <td className="p-3 align-top">
                        <span className="inline-block text-[10px] font-bold text-[#1B6B3A] bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg leading-tight">{o.deliverySlot || 'Standard (2–4 days)'}</span>
                      </td>
                      <td className="p-3">
                        <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as Order['status'])}
                          className={'border rounded px-2 py-1 text-[10px] font-bold focus:outline-none ' + statusColor(o.status)}>
                          {['Placed','Confirmed','Packed','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Leads' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Visitor Leads ({leads.length} total, {newLeadsCount} new)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" value={leadSearch} onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Search name, phone, message..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold outline-none" />
              </div>
              <button onClick={() => downloadLeadsCsv(filteredLeads)}
                className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <select value={leadSourceFilter} onChange={e => setLeadSourceFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
              {['All', 'Contact Form', 'Farm Loan', 'Expert Service', 'Partner Enquiry', 'Newsletter', 'Other'].map(o => <option key={o}>{o}</option>)}
            </select>
            {(['All', 'New', 'Contacted', 'Converted', 'Closed'] as const).map(st => (
              <button key={st} onClick={() => setLeadStatusFilter(st)}
                className={'px-3 py-1 rounded-full text-xs font-bold border transition ' + (leadStatusFilter === st ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                {st === 'All' ? 'All (' + leads.length + ')' : st + ' (' + leads.filter(l => l.status === st).length + ')'}
              </button>
            ))}
          </div>

          {loadingLeads ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading visitor leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No visitor leads yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Contact form, farm loan and expert service enquiries from the store will appear here automatically.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>{['Date', 'Source', 'Visitor', 'Contact', 'Subject / Message', 'Status', 'Action'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(l => (
                    <tr key={l.id} className={'hover:bg-slate-50/40 ' + (l.status === 'New' ? 'bg-rose-50/30' : '')}>
                      <td className="p-3 whitespace-nowrap text-[10px] text-slate-500">
                        {new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        <div className="text-slate-400">{new Date(l.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">{l.source}</span></td>
                      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">{l.name}</td>
                      <td className="p-3 whitespace-nowrap">
                        <a href={'tel:' + l.phone} className="font-bold text-[#1B6B3A] hover:underline block">{l.phone}</a>
                        {l.email && <span className="text-[10px] text-slate-400">{l.email}</span>}
                      </td>
                      <td className="p-3 max-w-[260px]">
                        {l.subject && <div className="font-bold text-slate-700 truncate">{l.subject}</div>}
                        {l.message && <div className="text-[10px] text-slate-500 line-clamp-2">{l.message}</div>}
                      </td>
                      <td className="p-3">
                        <select value={l.status} onChange={e => handleLeadStatus(l.id, e.target.value as LeadStatus)}
                          className={'border rounded px-2 py-1 text-[10px] font-bold focus:outline-none ' + leadStatusColor(l.status)}>
                          {['New', 'Contacted', 'Converted', 'Closed'].map(st => <option key={st}>{st}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteLead(l.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Products' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Product Catalog ({products.length} items)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" value={productSearchQuery} onChange={e => setProductSearchQuery(e.target.value)}
                  placeholder="Search products..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold outline-none" />
              </div>
              <button onClick={() => { if (showProductForm) { setShowProductForm(false); resetProductForm(); } else { resetProductForm(); setShowProductForm(true); } }}
                className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
          </div>

          {/* Global Combo Offer — "Frequently Bought Together" */}
          {(() => {
            const partner = products.find(p => p.name === comboCfg.partnerName);
            const pct = Math.max(0, Math.min(90, Number(comboCfg.percentOff) || 0));
            return (
            <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 space-y-3">
              <h4 className="font-extrabold text-xs text-[#B45309] uppercase tracking-widest">✨ Frequently Bought Together — Daily Combo Offer</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pick one <b>offer product</b> and a <b>discount %</b>. It shows alongside <b>every</b> product the
                customer views — no need to choose a main product. The combo price = (that product's price + offer
                product's price) − your %. Change the % any morning to run a fresh daily deal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select value={comboCfg.partnerName} onChange={e => setComboCfg({ ...comboCfg, partnerName: e.target.value })}
                  className="bg-white border rounded-lg p-2 text-xs font-bold sm:col-span-2">
                  <option value="">Offer product to bundle with everything…</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} — ₹{p.price}</option>)}
                </select>
                <div className="flex items-center gap-1.5 bg-white border rounded-lg px-2">
                  <input type="number" min={0} max={90} value={comboCfg.percentOff || ''} onChange={e => setComboCfg({ ...comboCfg, percentOff: Number(e.target.value) })}
                    placeholder="Discount" className="flex-1 p-2 text-xs font-bold outline-none w-full" />
                  <span className="text-xs font-black text-slate-500">% OFF</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button type="button" onClick={handleSaveCombo} className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition">Save / Update Offer</button>
                {comboCfg.enabled && <button type="button" onClick={handleDisableCombo} className="text-rose-500 hover:text-rose-700 text-xs font-bold px-3 py-2">Turn Off</button>}
                {comboCfg.enabled && partner && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                    Live: any product + <b>{partner.name}</b> at <b>{pct}% off</b> the combined price
                  </span>
                )}
                {comboCfg.enabled && !partner && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-3 py-1.5">Offer product not found — pick again.</span>
                )}
              </div>
            </div>
            );
          })()}

          {showProductForm && (
            <form onSubmit={handleCreateProduct} className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-2xl space-y-4">
              <h4 className="font-extrabold text-xs text-[#1B6B3A] uppercase tracking-widest pb-2 border-b border-slate-200">
                {editingProductId ? 'Edit Product' : 'New Product Details'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Product Name</label>
                  <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g. Tomato Hybrid Seeds 100g" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Subcategory</label>
                  <input type="text" value={newProduct.subcategory} onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})}
                    placeholder="Optional — defaults to category" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Brand</label>
                  <select value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold">
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Problem Filter</label>
                  <select value={newProduct.problemFilter} onChange={e => setNewProduct({...newProduct, problemFilter: e.target.value})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold">
                    {['Pest Control','Disease Control','Growth Boosters','Manures & Fertilizers'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">MRP (Rs.)</label>
                  <input type="number" required value={newProduct.mrp} onChange={e => setNewProduct({...newProduct, mrp: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Selling Price (Rs.)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Stock Quantity</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Unit Size</label>
                  <input type="text" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                    placeholder="e.g. 1kg, 500ml" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Product Gallery Images (first = main image)</label>
                  <div className="flex flex-col gap-2">
                    {(newProduct.images || '').split('\n').map((url, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={url}
                          onChange={e => {
                            const arr = (newProduct.images || '').split('\n');
                            arr[idx] = e.target.value;
                            setNewProduct({ ...newProduct, images: arr.join('\n') });
                          }}
                          placeholder={`Image URL ${idx + 1}`}
                          className="flex-1 bg-white border rounded-lg p-2.5 text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const arr = (newProduct.images || '').split('\n');
                            arr.splice(idx, 1);
                            setNewProduct({ ...newProduct, images: arr.join('\n') });
                          }}
                          className="bg-rose-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs hover:bg-rose-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setNewProduct({ ...newProduct, images: newProduct.images ? newProduct.images + '\n' : '\n' });
                        }}
                        className="bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold px-4 py-2.5 rounded-lg transition"
                      >
                        + Add Image URL Field
                      </button>
                      <label className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition whitespace-nowrap">
                        + Upload File
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => readImageFile(file, (url) => {
                            setNewProduct(prev => ({ ...prev, images: prev.images ? prev.images.trim() + '\n' + url : url }));
                          }));
                          e.currentTarget.value = '';
                        }} />
                      </label>
                    </div>
                  </div>
                  {/* Thumbnail previews of every image, with a remove button */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(newProduct.images || '').split('\n').map(s => s.trim()).filter(Boolean).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={url} alt={'Preview ' + (idx + 1)} className="h-16 w-16 object-cover rounded-lg border border-slate-200 shadow-sm" onError={(ev) => { (ev.target as HTMLImageElement).style.opacity = '0.3'; }} />
                        {idx === 0 && <span className="absolute -top-1.5 -left-1.5 bg-[#1B6B3A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">MAIN</span>}
                        <button type="button" title="Remove image"
                          onClick={() => setNewProduct(prev => {
                            const arr = (prev.images || '').split('\n').map(x => x.trim()).filter(Boolean);
                            arr.splice(idx, 1);
                            return { ...prev, images: arr.join('\n') };
                          })}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-black opacity-0 group-hover:opacity-100 transition">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Description <span className="text-slate-400 normal-case font-medium">(Product Overview tab)</span></label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    rows={2} className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Usage Instructions <span className="text-slate-400 normal-case font-medium">(Usage Instructions tab)</span></label>
                  <textarea value={newProduct.usage} onChange={e => setNewProduct({...newProduct, usage: e.target.value})}
                    rows={2} placeholder="e.g. Soak seeds 6 hours before sowing. Sow 1cm deep…" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Composition Details <span className="text-slate-400 normal-case font-medium">(Composition Details tab)</span></label>
                  <textarea value={newProduct.composition} onChange={e => setNewProduct({...newProduct, composition: e.target.value})}
                    rows={2} placeholder="e.g. 100% natural seeds, germination rate 90%…" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" checked={newProduct.isOrganic} onChange={e => setNewProduct({...newProduct, isOrganic: e.target.checked})}
                    className="h-4 w-4 accent-[#1B6B3A]" />
                  <label className="text-xs font-bold text-slate-700 cursor-pointer">Mark as Certified Organic</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-[#1B6B3A] text-white text-xs font-bold px-5 py-2.5 rounded-lg">
                  {editingProductId ? 'Save Changes' : 'Publish Product'}
                </button>
                <button type="button" onClick={() => { setShowProductForm(false); resetProductForm(); }} className="bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          {!showProductForm && (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>{['Image','Product','Category','Brand','Price','Stock','Actions'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/40">
                      <td className="p-3"><img src={p.images?.[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover border" onError={imgFallback} /></td>
                      <td className="p-3 max-w-[180px]">
                        <div className="font-bold text-slate-800 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400">SKU: {p.id.slice(0, 10)}</div>
                      </td>
                      <td className="p-3 text-[11px]">{p.category}</td>
                      <td className="p-3"><span className={'px-2 py-0.5 rounded text-[10px] font-bold ' + (p.isIgoOwn ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}>{p.brand}</span></td>
                      <td className="p-3"><div className="font-bold">Rs.{p.price}</div><div className="text-[10px] text-slate-400 line-through">Rs.{p.mrp}</div></td>
                      <td className="p-3 font-black" style={{ color: p.stock === 0 ? '#dc2626' : p.stock < 20 ? '#d97706' : '#16a34a' }}>{p.stock}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditProduct(p)} title="Edit product" className="p-1.5 text-slate-400 hover:text-[#1B6B3A] hover:bg-emerald-50 rounded-lg transition">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} title="Delete product" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Inventory' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Inventory Management</h3>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                <input value={invSearch} onChange={e => setInvSearch(e.target.value)}
                  placeholder="Search product, brand, SKU…"
                  className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-48 sm:w-60 outline-none focus:border-[#1B6B3A]" />
              </div>
              <button onClick={handleRefillAll}
                className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 text-xs font-black px-4 py-1.5 rounded-lg shadow-sm">
                ⟳ Refill All to 200
              </button>
              {(['all','low','out'] as const).map(f => (
                <button key={f} onClick={() => setStockFilter(f)}
                  className={'text-xs font-bold px-3 py-1.5 rounded-lg border transition ' + (stockFilter === f ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white border-slate-200 text-slate-600')}>
                  {f === 'all' ? 'All (' + products.length + ')' : f === 'low' ? 'Low (' + lowStockProducts.length + ')' : 'Out (' + outOfStockProducts.length + ')'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { count: products.filter(p=>p.stock>=20).length, label: 'In Stock', color: 'bg-green-50 border-green-200 text-green-700' },
              { count: lowStockProducts.length, label: 'Low Stock', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { count: outOfStockProducts.length, label: 'Out of Stock', color: 'bg-red-50 border-red-200 text-red-700' },
            ].map((c, i) => (
              <div key={i} className={'border rounded-xl p-4 ' + c.color}>
                <div className="text-2xl font-black">{c.count}</div>
                <div className="text-xs font-bold mt-1 opacity-70">{c.label}</div>
              </div>
            ))}
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                <tr>{['Product','Category','Brand','Unit','Stock','Status'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryProducts.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400 italic">No products match this filter.</td></tr>
                ) : inventoryProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/40">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={p.images?.[0]} alt="" className="h-8 w-8 rounded-lg object-cover border" onError={imgFallback} />
                        <div className="font-bold text-slate-800 max-w-[200px] truncate">{p.name}</div>
                      </div>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3">{p.unit || '-'}</td>
                    <td className="p-3">
                      <input
                        type="number" min={0} value={p.stock}
                        onChange={e => handleUpdateStock(p.id, Number(e.target.value))}
                        className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-black text-sm outline-none focus:border-[#1B6B3A]"
                        style={{ color: p.stock===0?'#dc2626':p.stock<20?'#d97706':'#16a34a' }}
                      />
                    </td>
                    <td className="p-3">
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (p.stock===0?'bg-red-50 text-red-700':p.stock<20?'bg-amber-50 text-amber-700':'bg-green-50 text-green-700')}>
                        {p.stock===0?'Out of Stock':p.stock<20?'Low Stock':'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Customers' && (() => {
        // Build a customer directory from real orders (name, email, phone, address,
        // order count, total spent, dates). This is the data customers actually leave.
        const map = new Map<string, any>();
        orders.forEach(o => {
          const a: any = o.deliveryAddress || {};
          const key = (a.email || a.phone || o.phone || o.userId || o.id || '').toString().toLowerCase();
          if (!key) return;
          if (!map.has(key)) {
            map.set(key, {
              id: key,
              name: a.name || 'Customer', email: a.email || '', phone: a.phone || o.phone || '',
              address: [a.addressLine1, a.addressLine2, a.city, a.state, a.pincode].filter(Boolean).join(', '),
              orders: [] as any[], total: 0,
            });
          }
          const c = map.get(key);
          c.orders.push(o);
          if (o.status !== 'Cancelled') c.total += (o.totalAmount || 0);
          if (!c.name || c.name === 'Customer') c.name = a.name || c.name;
          if (!c.email) c.email = a.email || c.email;
        });
        const all = Array.from(map.values()).sort((x, y) => y.total - x.total);
        const q = custSearch.trim().toLowerCase();
        const list = !q ? all : all.filter(c =>
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
          (c.phone || '').includes(q) || c.orders.some((o: any) => (o.id || '').toLowerCase().includes(q))
        );
        return (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Customers ({all.length})</h3>
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={custSearch} onChange={e => setCustSearch(e.target.value)}
                placeholder="Search by name, email, phone or order number…"
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
            </div>
          </div>
          {list.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">{q ? 'No customer matches your search.' : 'No customer orders yet.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((c, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center font-black shrink-0">{(c.name || 'C').charAt(0).toUpperCase()}</div>
                      <div>
                        <button type="button" onClick={() => setExpandedCustomer(expandedCustomer === c.id ? null : c.id)} className="font-black text-slate-800 text-sm hover:text-[#1B6B3A] hover:underline text-left transition">{c.name}</button>
                        {expandedCustomer === c.id && (
                          <div className="mt-1">
                            <div className="text-[11px] text-slate-500">{c.email || 'No email'} {c.phone ? '· ' + c.phone : ''}</div>
                            {c.address && <div className="text-[11px] text-slate-400 mt-0.5 max-w-md">{c.address}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                        <div className="font-black text-[#1B6B3A] text-sm">{c.orders.length}</div>
                        <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Orders</div>
                      </div>
                      <div className="text-center bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                        <div className="font-black text-amber-700 text-sm">Rs.{c.total.toLocaleString('en-IN')}</div>
                        <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Spent</div>
                      </div>
                    </div>
                  </div>
                  {expandedCustomer === c.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Tap an order for full details</div>
                      {c.orders.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || '')).map((o: any) => (
                        <button key={o.id} type="button" onClick={() => { setViewOrder(o); setAdminMsg(''); }}
                          className="w-full flex flex-wrap items-center justify-between gap-2 text-[11px] cursor-pointer hover:bg-emerald-50/60 -mx-2 px-2 py-1.5 rounded-lg transition text-left">
                          <span className="font-mono font-bold text-[#1B6B3A] hover:underline">{o.id}</span>
                          <span className="text-slate-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : ''}</span>
                          <span className="text-slate-500 truncate max-w-[160px]">{(o.items?.length || 0)} item{(o.items?.length || 0) === 1 ? '' : 's'}</span>
                          <span className={'px-2 py-0.5 rounded-full font-bold ' + statusColor(o.status)}>{o.status}</span>
                          <span className="font-black text-slate-700">Rs.{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        );
      })()}

      {activeTab === 'Sellers' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-slate-800">Seller Submissions & Approvals ({sellers.length})</h3>
          </div>
          <div className="space-y-4">
            {sellers.length === 0 ? (
              <div className="py-16 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
                <Store className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No seller submissions yet.</p>
              </div>
            ) : (
              [...sellers].sort((a, b) => (a.status === 'Pending' ? -1 : 1) - (b.status === 'Pending' ? -1 : 1)).map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {s.productImage ? <img src={s.productImage} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200" /> : <div className="h-14 w-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center"><Store className="h-6 w-6 text-slate-300" /></div>}
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{s.productName}</h4>
                        <p className="text-[11px] text-slate-500">{s.name} · {s.phone}</p>
                        <p className="text-[11px] text-slate-700 font-bold mt-0.5 flex items-center gap-1">Rs.{s.price.toLocaleString('en-IN')} · Qty {s.quantity}</p>
                      </div>
                    </div>
                    <span className={'text-[10px] font-black uppercase px-2 py-1 rounded-full border ' + 
                      (s.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                       s.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                       'bg-rose-50 text-rose-700 border-rose-200')
                    }>Listing: {s.status}</span>
                  </div>

                  <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700">
                    <span className="font-black text-slate-500 uppercase tracking-wide text-[9px] block mb-0.5">Seller's Payout Bank Details</span>
                    {s.bankDetails}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => updateSeller(s.id, { status: 'Approved' })} className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Approve Listing</button>
                    <button onClick={() => updateSeller(s.id, { status: 'Rejected' })} className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg">Reject Listing</button>
                    <button onClick={() => updateSeller(s.id, { paymentStatus: 'Requested' })} className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-3 py-1.5 rounded-lg">Ask Seller for Bank Details</button>
                    <label className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> {s.paymentProofImage ? 'Replace Proof of Payout' : 'Upload Proof of Payout'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => readSellerImage(e.target.files?.[0], (url) => updateSeller(s.id, { paymentProofImage: url, paymentStatus: 'Paid' }))} />
                    </label>
                    <button onClick={() => removeSeller(s.id)} className="text-slate-400 hover:text-rose-600 text-xs font-bold px-2">Delete Request</button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      defaultValue={s.adminMessage || ''}
                      onBlur={(e) => { if (e.target.value !== (s.adminMessage || '')) updateSeller(s.id, { adminMessage: e.target.value }); }}
                      placeholder="Type a direct reply to the seller (auto-saves on click away)..."
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500">Payout to Seller Status:</span>
                    <span className={'font-black px-2 py-0.5 rounded-full border ' + 
                      (s.paymentStatus === 'None' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                       s.paymentStatus === 'Requested' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                       'bg-emerald-50 text-emerald-700 border-emerald-200')
                    }>{s.paymentStatus === 'None' ? 'Pending' : s.paymentStatus}</span>
                    {s.paymentProofImage && <img src={s.paymentProofImage} alt="" className="h-10 rounded border border-slate-200" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800">Reports & Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: 'Rs.' + revenue.toLocaleString('en-IN'), icon: DollarSign, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { label: 'Avg Order Value', value: 'Rs.' + (orders.filter(o=>o.status!=='Cancelled').length ? Math.round(revenue/(orders.filter(o=>o.status!=='Cancelled').length||1)).toLocaleString('en-IN') : 0), icon: TrendingUp, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-violet-50 border-violet-200 text-violet-700' },
              { label: 'Products Listed', value: products.length, icon: Tag, color: 'bg-amber-50 border-amber-200 text-amber-700' },
            ].map((item, i) => (
              <div key={i} className={'border rounded-xl p-4 ' + item.color}>
                <item.icon className="h-5 w-5 opacity-60 mb-2" />
                <div className="text-2xl font-black">{item.value}</div>
                <div className="text-xs font-bold mt-1 opacity-70">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-4">Order Status Breakdown</h4>
            <div className="space-y-3">
              {['Placed','Confirmed','Dispatched','Delivered','Cancelled'].map(s => {
                const count = orders.filter(o => o.status === s).length;
                const pct = orders.length ? Math.round((count/orders.length)*100) : 0;
                const barColors: Record<string,string> = { Placed:'bg-blue-400', Confirmed:'bg-amber-400', Dispatched:'bg-purple-400', Delivered:'bg-green-500', Cancelled:'bg-red-400' };
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-bold text-slate-600 shrink-0">{s}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div className={'h-full ' + barColors[s] + ' rounded-full transition-all'} style={{ width: pct + '%' }} />
                    </div>
                    <div className="text-xs font-bold text-slate-700 w-20 text-right">{count} ({pct}%)</div>
                  </div>
                );
              })}
            </div>
          </div>
          {topCategories.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-4">Revenue by Category</h4>
              <div className="space-y-3">
                {topCategories.map(([cat, rev]) => {
                  const max = topCategories[0][1];
                  const pct = Math.round((rev/max)*100);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="w-40 text-xs font-bold text-slate-600 truncate shrink-0">{cat}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-[#1B6B3A] rounded-full" style={{ width: pct + '%' }} />
                      </div>
                      <div className="text-xs font-bold text-slate-700 w-24 text-right">Rs.{rev.toLocaleString('en-IN')}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-4">Products by Category</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(products.reduce((acc, p) => { acc[p.category] = (acc[p.category]||0)+1; return acc; }, {} as Record<string,number>))
                .sort((a,b)=>b[1]-a[1]).slice(0, 9).map(([cat, count]) => (
                <div key={cat} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <div className="font-bold text-slate-800 text-xs truncate">{cat}</div>
                  <div className="text-xl font-black text-[#1B6B3A] mt-1">{count}</div>
                  <div className="text-[10px] text-slate-400">products</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Coupons' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800">Coupons & Offers ({coupons.length})</h3>
            <button onClick={() => setShowCouponForm(!showCouponForm)}
              className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Coupon
            </button>
          </div>
          {showCouponForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-lg space-y-4">
              <h4 className="font-extrabold text-xs text-[#1B6B3A] uppercase tracking-widest">New Coupon</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Coupon Code</label>
                  <input type="text" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                    placeholder="e.g. KHARIF20" className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold uppercase" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Type</label>
                  <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Value</label>
                  <input type="number" value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Min Order (Rs.)</label>
                  <input type="number" value={newCoupon.minOrder} onChange={e => setNewCoupon({...newCoupon, minOrder: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Usage Limit</label>
                  <input type="number" value={newCoupon.usageLimit} onChange={e => setNewCoupon({...newCoupon, usageLimit: Number(e.target.value)})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expiry Date</label>
                  <input type="date" value={newCoupon.expiry} onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                    className="w-full bg-white border rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" checked={newCoupon.active} onChange={e => setNewCoupon({...newCoupon, active: e.target.checked})}
                    className="h-4 w-4 accent-[#1B6B3A]" />
                  <label className="text-xs font-bold text-slate-700">Active</label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveCoupon} className="bg-[#1B6B3A] text-white text-xs font-bold px-5 py-2.5 rounded-lg">Save Coupon</button>
                <button onClick={() => setShowCouponForm(false)} className="bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          {coupons.length === 0 ? (
            <div className="py-16 text-center">
              <Gift className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No coupons created yet</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>{['Code','Discount','Min Order','Limit','Expiry','Status','Action'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map(c => (
                    <tr key={c.code} className="hover:bg-slate-50/40">
                      <td className="p-3 font-mono font-black text-[#1B6B3A] text-sm">{c.code}</td>
                      <td className="p-3 font-bold">{c.type==='percentage'?c.value+'%':'Rs.'+c.value} off</td>
                      <td className="p-3">Rs.{c.minOrder}</td>
                      <td className="p-3">{c.usageLimit}</td>
                      <td className="p-3">{c.expiry || 'No expiry'}</td>
                      <td className="p-3">
                        <button onClick={() => toggleCoupon(c.code)} title="Click to toggle"
                          className={'px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer border ' + (c.active?'bg-green-50 text-green-700 border-green-200 hover:bg-green-100':'bg-red-50 text-red-700 border-red-200 hover:bg-red-100')}>
                          {c.active?'Active':'Inactive'}
                        </button>
                      </td>
                      <td className="p-3"><button onClick={() => deleteCoupon(c.code)} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Content' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800">Content Management</h3>

          {/* Upcoming Agri Events editor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-1">🗓 Upcoming Agri Events</h4>
            <p className="text-[11px] text-slate-400 mb-4">Add the trade shows, expos and farmer meets shown on the home page. While this list is empty, a built-in default set is shown.</p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-3">
              <input value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} placeholder="Event name" className="sm:col-span-2 bg-slate-50 border rounded-lg p-2 text-xs font-bold" />
              <input value={newEvent.city} onChange={e => setNewEvent({ ...newEvent, city: e.target.value })} placeholder="City" className="bg-slate-50 border rounded-lg p-2 text-xs font-bold" />
              <input value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="Date e.g. Jul 9-11, 2026" className="bg-slate-50 border rounded-lg p-2 text-xs font-bold" />
              <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="bg-slate-50 border rounded-lg p-2 text-xs font-bold">
                {['Trade Expo', 'Horticulture', 'AgriTech', 'National', 'Farmer Meet', 'International'].map(o => <option key={o}>{o}</option>)}
              </select>
              <input value={newEvent.emoji} onChange={e => setNewEvent({ ...newEvent, emoji: e.target.value })} placeholder="Emoji 🏭" maxLength={2} className="bg-slate-50 border rounded-lg p-2 text-xs font-bold text-center" />
            </div>
            <button onClick={handleAddEvent} className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition">+ Add Event</button>
            {events.length > 0 && (
              <div className="mt-4 space-y-1.5">
                {events.map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
                    <span className="font-bold text-slate-700 truncate">{ev.emoji} {ev.name} <span className="text-slate-400 font-medium">· {ev.city} · {ev.date} · {ev.type}</span></span>
                    <button onClick={() => handleRemoveEvent(idx)} className="text-rose-500 hover:text-rose-700 font-bold shrink-0 ml-2">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Manager — swap key site images by URL or /images/ path */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest">🖼️ Image Manager</h4>
              <button onClick={saveSiteImagesHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">
                Save Images
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Paste an image URL, or a path to a file in your /public folder (e.g. <code>/images/hero.png</code>). Leave blank to keep the built-in image.</p>
            <div className="space-y-4">
              {SITE_IMAGE_SLOTS.map((slot) => (
                <div key={slot.key} className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="sm:w-48 shrink-0">
                    <div className="text-xs font-black text-slate-700">{slot.label}</div>
                    <div className="text-[10px] text-slate-400">{slot.hint}</div>
                  </div>
                  <input
                    type="text"
                    value={siteImages[slot.key] || ''}
                    onChange={(e) => setSiteImagesState({ ...siteImages, [slot.key]: e.target.value })}
                    placeholder="https://…  or  /images/your-image.png"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]"
                  />
                  <label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />
                  </label>
                  {(siteImages[slot.key] || '').trim() && (
                    <img src={siteImages[slot.key]} alt="" className="h-12 w-20 object-cover rounded-md border border-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Category Manager — rename categories, change their tile image, or hide them */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest">🗂️ Category Manager</h4>
              <button onClick={saveCategoryMetaHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">
                Save Categories
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Rename a category, replace its homepage tile image (URL or /images/ path), or hide it. Leave blank to keep the default.</p>

            {/* Add a brand-new category */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 mb-4">
              <div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">➕ Add New Category</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name (e.g. Animal Husbandry)"
                  className="sm:w-56 bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                <input type="text" value={newCatImage} onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="Tile image URL or /images/cat.png (optional)"
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                <label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setNewCatImage(url))} />
                </label>
                <button onClick={addCustomCategory} className="bg-[#1B6B3A] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-950 transition shrink-0">Add Category</button>
              </div>
              {customCats.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {customCats.map((c) => (
                    <span key={c.slug} className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-[#1B6B3A] text-[11px] font-bold pl-2.5 pr-1.5 py-1 rounded-full">
                      {c.name}
                      <button onClick={() => removeCustomCategory(c.slug)} className="h-4 w-4 flex items-center justify-center rounded-full hover:bg-rose-100 text-rose-500" aria-label={`Remove ${c.name}`}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {categories.map((c) => {
                const m = categoryMeta[c.name] || {};
                return (
                  <div key={c.id} className="flex flex-col sm:flex-row gap-2 sm:items-center border-b border-slate-100 pb-3">
                    <div className="sm:w-40 shrink-0 text-xs font-black text-slate-700 truncate">{c.name}</div>
                    <input
                      type="text"
                      value={m.label || ''}
                      onChange={(e) => setCatField(c.name, 'label', e.target.value)}
                      placeholder="New label (optional)"
                      className="sm:w-44 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B6B3A]"
                    />
                    <input
                      type="text"
                      value={m.image || ''}
                      onChange={(e) => setCatField(c.name, 'image', e.target.value)}
                      placeholder="Image URL or /images/cat.png"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B6B3A]"
                    />
                    <label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setCatField(c.name, 'image', url))} />
                    </label>
                    {(m.image || '').trim() && <img src={m.image} alt="" className="h-9 w-9 object-cover rounded-full border border-slate-200" />}
                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">
                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, 'hidden', e.target.checked)} /> Hide
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest">Marquee Banner Text</h4>
              {!editingMarquee ? (
                <button onClick={() => { setEditingMarquee(true); setMarqueeInput(marqueeLines.join('\n')); }}
                  className="text-xs font-bold text-[#1B6B3A] flex items-center gap-1 hover:underline">
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveMarquee} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save</button>
                  <button onClick={() => setEditingMarquee(false)} className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">Cancel</button>
                </div>
              )}
            </div>
            {editingMarquee ? (
              <textarea value={marqueeInput} onChange={e => setMarqueeInput(e.target.value)} rows={6}
                placeholder="One line per marquee item..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono outline-none resize-none" />
            ) : (
              <div className="space-y-2">
                {marqueeLines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg text-xs text-slate-700">
                    <span className="text-slate-300 font-bold w-5">#{i+1}</span> {line}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest">Homepage Hero Banners</h4>
              <button onClick={handleSaveBanners} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save Banners</button>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Fill image URL + title to replace the default homepage slider. Leave all empty to keep defaults.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {banners.map((b, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                    <Image className="h-4 w-4 text-[#1B6B3A]" /> Banner Slot {i + 1}
                  </div>
                  {b.img ? (
                    <img src={b.img} alt={'Banner ' + (i+1) + ' preview'} className="w-full h-20 object-cover rounded-lg border"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold">No image yet</div>
                  )}
                  <input type="text" value={b.img} onChange={e => updateBanner(i, 'img', e.target.value)}
                    placeholder="Image URL (https://...)" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] outline-none focus:border-[#1B6B3A]" />
                  <input type="text" value={b.badge} onChange={e => updateBanner(i, 'badge', e.target.value)}
                    placeholder="Badge text (e.g. Mega Sale)" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] outline-none focus:border-[#1B6B3A]" />
                  <input type="text" value={b.title} onChange={e => updateBanner(i, 'title', e.target.value)}
                    placeholder="Headline" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold outline-none focus:border-[#1B6B3A]" />
                  <input type="text" value={b.sub} onChange={e => updateBanner(i, 'sub', e.target.value)}
                    placeholder="Sub-text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] outline-none focus:border-[#1B6B3A]" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={b.btn} onChange={e => updateBanner(i, 'btn', e.target.value)}
                      placeholder="Button text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] outline-none focus:border-[#1B6B3A]" />
                    <select value={b.btnAction} onChange={e => updateBanner(i, 'btnAction', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] outline-none focus:border-[#1B6B3A]">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  {b.img && (
                    <button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: '', badge: '', title: '', sub: '', btn: 'Shop Now', btnAction: 'seeds-saplings' } : x))}
                      className="text-[10px] text-red-500 font-bold hover:underline">Clear slot</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              Homepage Section Overrides
            </h4>
            <p className="text-[10px] text-slate-400 mb-4">Manually assign specific products to homepage sections. Leave a section empty to use the automatic dynamic products.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Select Section to Override</label>
                <select value={activeOverrideSection} onChange={e => setActiveOverrideSection(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-[#1B6B3A]">
                  <option value="">-- Choose a section --</option>
                  {['Best Selling', "Freshly Arrived", 'Combo Kits & Deals', 'Shop By Crop', 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'Popular Agri Brands', 'Brands', 'AgriMart Farmer Updates'].map(sec => (
                    <option key={sec} value={sec}>{sec} ({homeOverrides[sec]?.length || 0} items)</option>
                  ))}
                </select>
              </div>
              {activeOverrideSection && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="font-bold text-xs text-[#1B6B3A]">Override for {activeOverrideSection}</div>
                  
                  {activeOverrideSection === 'Combo Kits & Deals' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Kit Name</label><input type="text" value={overrideForm.name || ''} onChange={e => setOverrideForm({...overrideForm, name: e.target.value})} className="w-full border rounded p-2 text-xs" /></div>
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Price (₹)</label><input type="number" value={overrideForm.price || ''} onChange={e => setOverrideForm({...overrideForm, price: Number(e.target.value)})} className="w-full border rounded p-2 text-xs" /></div>
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">MRP (₹)</label><input type="number" value={overrideForm.mrp || ''} onChange={e => setOverrideForm({...overrideForm, mrp: Number(e.target.value)})} className="w-full border rounded p-2 text-xs" /></div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Image Upload</label>
                          <label className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded flex items-center justify-center cursor-pointer">
                            Upload File
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setOverrideForm({...overrideForm, image: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        </div>
                        <div className="col-span-2"><label className="text-[10px] text-slate-500 font-bold block mb-1">Description</label><input type="text" value={overrideForm.description || ''} onChange={e => setOverrideForm({...overrideForm, description: e.target.value})} className="w-full border rounded p-2 text-xs" /></div>
                        <div className="col-span-2"><label className="text-[10px] text-slate-500 font-bold block mb-1">Items (comma separated)</label><input type="text" value={overrideForm.items || ''} onChange={e => setOverrideForm({...overrideForm, items: e.target.value})} className="w-full border rounded p-2 text-xs" /></div>
                      </div>
                      <button onClick={() => {
                        const newKit = { id: 'kit-'+Date.now(), name: overrideForm.name||'', description: overrideForm.description||'', price: overrideForm.price||0, mrp: overrideForm.mrp||0, items: (overrideForm.items||'').split(',').map((s:string)=>s.trim()), image: overrideForm.image||'' };
                        const updated = {...complexOverrides, kits: [...complexOverrides.kits, newKit]};
                        setComplexOverrides(updated); saveComplexOverrides(updated); setOverrideForm({});
                      }} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded">Add Kit</button>
                      <div className="space-y-2 mt-3">
                        {complexOverrides.kits.map(k => (
                          <div key={k.id} className="flex items-center justify-between bg-white border p-2 rounded">
                            <div className="flex items-center gap-2"><img src={k.image} className="w-8 h-8 rounded border object-cover" /> <div className="text-xs font-bold">{k.name}</div></div>
                            <button onClick={() => { const u = {...complexOverrides, kits: complexOverrides.kits.filter(x => x.id !== k.id)}; setComplexOverrides(u); saveComplexOverrides(u); }} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeOverrideSection === 'Shop By Crop' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Crop Name</label><input type="text" value={overrideForm.name || ''} onChange={e => setOverrideForm({...overrideForm, name: e.target.value})} className="w-full border rounded p-2 text-xs" /></div>
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Category Slug</label><input type="text" value={overrideForm.slug || ''} onChange={e => setOverrideForm({...overrideForm, slug: e.target.value})} placeholder="e.g. seeds-saplings" className="w-full border rounded p-2 text-xs" /></div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Crop Image</label>
                          <label className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded flex items-center justify-center cursor-pointer">
                            Upload File
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setOverrideForm({...overrideForm, img: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                      <button onClick={() => {
                        const newCrop = { id: 'crop-'+Date.now(), name: overrideForm.name||'', slug: overrideForm.slug||'', img: overrideForm.img||'' };
                        const updated = {...complexOverrides, crops: [...complexOverrides.crops, newCrop]};
                        setComplexOverrides(updated); saveComplexOverrides(updated); setOverrideForm({});
                      }} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded">Add Crop</button>
                      <div className="space-y-2 mt-3">
                        {complexOverrides.crops.map(c => (
                          <div key={c.id} className="flex items-center justify-between bg-white border p-2 rounded">
                            <div className="flex items-center gap-2"><img src={c.img} className="w-8 h-8 rounded border object-cover" /> <div className="text-xs font-bold">{c.name}</div></div>
                            <button onClick={() => { const u = {...complexOverrides, crops: complexOverrides.crops.filter(x => x.id !== c.id)}; setComplexOverrides(u); saveComplexOverrides(u); }} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeOverrideSection === 'Brands' || activeOverrideSection === 'Popular Agri Brands' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Brand Name</label><input type="text" value={overrideForm.name || ''} onChange={e => setOverrideForm({...overrideForm, name: e.target.value})} className="w-full border rounded p-2 text-xs" /></div>
                        <div><label className="text-[10px] text-slate-500 font-bold block mb-1">Category Slug</label><input type="text" value={overrideForm.slug || ''} onChange={e => setOverrideForm({...overrideForm, slug: e.target.value})} placeholder="e.g. brand:brandname" className="w-full border rounded p-2 text-xs" /></div>
                      </div>
                      <button onClick={() => {
                        const newBrand = { id: 'brand-'+Date.now(), name: overrideForm.name||'', slug: overrideForm.slug||'' };
                        const updated = {...complexOverrides, brands: [...complexOverrides.brands, newBrand]};
                        setComplexOverrides(updated); saveComplexOverrides(updated); setOverrideForm({});
                      }} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded">Add Brand</button>
                      <div className="space-y-2 mt-3">
                        {complexOverrides.brands.map(b => (
                          <div key={b.id} className="flex items-center justify-between bg-white border p-2 rounded">
                            <div className="flex items-center gap-2"><div className="text-xs font-bold">{b.name}</div></div>
                            <button onClick={() => { const u = {...complexOverrides, brands: complexOverrides.brands.filter(x => x.id !== b.id)}; setComplexOverrides(u); saveComplexOverrides(u); }} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input type="text" id="override-product-id" placeholder="Type product NAME or SKU to add…"
                          className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-[#1B6B3A]" />
                        <button onClick={() => {
                          const input = document.getElementById('override-product-id') as HTMLInputElement;
                          const q = input.value.trim();
                          if (!q) return;
                          // Match by exact ID, SKU prefix (as shown in Products tab), or product name.
                          const match = products.find(p => p.id === q)
                            || products.find(p => p.id.toLowerCase().startsWith(q.toLowerCase()))
                            || products.find(p => p.name.toLowerCase().includes(q.toLowerCase()));
                          if (!match) { alert(`No product found for "${q}". Type the product name, or its SKU from the Products tab.`); return; }
                          const pid = match.id;
                          const current = homeOverrides[activeOverrideSection] || [];
                          if (current.includes(pid)) { input.value = ''; return; }
                          const updated = { ...homeOverrides, [activeOverrideSection]: [...current, pid] };
                          setHomeOverrides(updated);
                          saveHomeOverrides(updated);
                          input.value = '';
                        }} className="bg-[#1B6B3A] text-white px-4 py-2 rounded-lg text-xs font-bold">Add</button>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {(homeOverrides[activeOverrideSection] || []).length === 0 ? (
                          <div className="text-[10px] text-slate-400 italic py-2">No manual overrides. Showing dynamic products automatically.</div>
                        ) : (
                          (homeOverrides[activeOverrideSection] || []).map(pid => {
                            const p = products.find(x => x.id === pid);
                            return (
                              <div key={pid} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <img src={p?.images?.[0]} alt="" className="h-8 w-8 rounded object-cover border" onError={imgFallback} />
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-800">{p?.name || 'Unknown Product'}</div>
                                    <div className="text-[9px] text-slate-400 font-mono">{pid}</div>
                                  </div>
                                </div>
                                <button onClick={() => {
                                  const updatedList = homeOverrides[activeOverrideSection].filter(id => id !== pid);
                                  const updated = { ...homeOverrides, [activeOverrideSection]: updatedList };
                                  setHomeOverrides(updated);
                                  saveHomeOverrides(updated);
                                }} className="text-red-500 hover:text-red-700 p-1">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-[#E8A020]" /> Site Notification Bar
            </h4>
            {activeNotif && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <span className="text-xs font-bold text-amber-800 flex-1">Live now: "{activeNotif.text}"</span>
                <button onClick={handleClearNotification} className="text-[10px] text-red-600 font-bold hover:underline whitespace-nowrap">Remove</button>
              </div>
            )}
            <div className="flex gap-3">
              <input type="text" value={notifInput} onChange={e => setNotifInput(e.target.value)}
                placeholder="e.g. Kharif Season Sale starts tomorrow!"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:border-[#1B6B3A]" />
              <button onClick={handleSendNotification} className="bg-[#E8A020] text-emerald-950 text-xs font-bold px-5 py-2.5 rounded-lg whitespace-nowrap">Publish</button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Shows as a yellow bar at the top of the site for all visitors until removed.</p>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="space-y-6 max-w-2xl">
          <h3 className="font-extrabold text-sm text-slate-800">Store Settings</h3>
          {[
            { section: 'Store Information', fields: [
              { label: 'Store Name', key: 'storeName', type: 'text' },
              { label: 'Phone', key: 'phone', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Address', key: 'address', type: 'text' },
            ]},
            { section: 'Delivery & Tax (applies to Cart & Checkout)', fields: [
              { label: 'Free Delivery Above (Rs.)', key: 'freeDeliveryAbove', type: 'number' },
              { label: 'Delivery Charge (Rs.)', key: 'deliveryCharge', type: 'number' },
              { label: 'GST Percentage (%)', key: 'gstPercent', type: 'number' },
            ]},
            { section: 'Social Media', fields: [
              { label: 'Instagram URL', key: 'instagramUrl', type: 'url' },
              { label: 'Facebook URL', key: 'facebookUrl', type: 'url' },
              { label: 'WhatsApp Number', key: 'whatsappNumber', type: 'text' },
            ]},
          ].map(section => (
            <div key={section.section} className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-4">{section.section}</h4>
              <div className="space-y-4">
                {section.fields.map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{f.label}</label>
                    <input type={f.type} value={settings[f.key] || ''} onChange={e => setSettings({...settings, [f.key]: f.type==='number'?Number(e.target.value):e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:border-[#1B6B3A]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={saveSettings} className="bg-[#1B6B3A] text-white font-bold text-sm px-6 py-3 rounded-xl w-full">
            Save All Settings
          </button>

          <form onSubmit={handleChangePassword} className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-[#1B6B3A]" /> Security — Change Admin Password
            </h4>
            <p className="text-[10px] text-slate-400 mb-4">This password protects the /admin login page on this device/browser.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Current Password</label>
                <input type="password" required value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:border-[#1B6B3A]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">New Password (min 8 chars)</label>
                  <input type="password" required minLength={8} value={pwdForm.next} onChange={e => setPwdForm({ ...pwdForm, next: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:border-[#1B6B3A]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Confirm New Password</label>
                  <input type="password" required value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:border-[#1B6B3A]" />
                </div>
              </div>
              {pwdMsg && (
                <p className={'text-xs font-bold ' + (pwdMsg.ok ? 'text-green-600' : 'text-red-500')}>{pwdMsg.text}</p>
              )}
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg">
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── CUSTOMER 360 / ORDER DETAIL MODAL ─────────────────────────── */}
      {viewOrder && (() => {
        const actualCustomer = customers.find(c => c.uid === viewOrder.userId);
        const cEmail = (modalProfile?.email || actualCustomer?.email || viewOrder.deliveryAddress?.email || '').toLowerCase();
        const cName = modalProfile?.name || actualCustomer?.name || viewOrder.deliveryAddress?.name || '-';
        const cPhone = modalProfile?.phone || actualCustomer?.phone || viewOrder.phone || viewOrder.deliveryAddress?.phone || '';
        const customerOrders = orders.filter(o =>
          (cEmail && (o.deliveryAddress?.email || '').toLowerCase() === cEmail) ||
          (cPhone && (o.phone === cPhone || o.deliveryAddress?.phone === cPhone))
        );
        const totalSpent = customerOrders.filter(o => o.status !== 'Cancelled').reduce((sm, o) => sm + o.totalAmount, 0);
        return (
          <div className="fixed inset-0 z-[999] bg-slate-100 overflow-y-auto">
            <div className="bg-white w-full min-h-screen max-w-6xl mx-auto shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="bg-[#1B6B3A] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Order Details</p>
                  <h3 className="font-black text-lg font-mono">{viewOrder.id}</h3>
                </div>
                <button onClick={() => setViewOrder(null)} className="text-white/70 hover:text-white text-xl font-black px-2">✕</button>
              </div>

              <div className="p-6 space-y-5">
                {/* Customer card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest mb-3">Customer Profile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Name</span><span className="font-black text-slate-900 text-sm">{cName}</span></div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Phone</span><a href={'tel:' + cPhone} className="font-black text-[#1B6B3A]">{cPhone || '-'}</a></div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Email</span><span className="font-black text-slate-900 text-sm break-all">{cEmail || '-'}</span></div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Pincode</span><span className="font-bold text-slate-700">{viewOrder.deliveryAddress?.pincode || '-'}</span></div>
                    <div className="sm:col-span-2"><span className="text-slate-400 font-bold block text-[10px] uppercase">Full Address</span>
                      <span className="font-bold text-slate-700">
                        {[viewOrder.deliveryAddress?.addressLine1, viewOrder.deliveryAddress?.addressLine2, viewOrder.deliveryAddress?.city, viewOrder.deliveryAddress?.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Payment Method</span><span className="font-black text-slate-800">{viewOrder.paymentMethod || 'COD'}</span></div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Delivery Slot</span><span className="font-black text-[#1B6B3A]">{viewOrder.deliverySlot || 'Standard (2–4 days)'}</span></div>
                    <div><span className="text-slate-400 font-bold block text-[10px] uppercase">Coupon Applied</span><span className="font-black text-slate-800">{viewOrder.couponDiscount ? (viewOrder.couponDiscount < 100 ? viewOrder.couponDiscount + '% off' : 'Rs.' + viewOrder.couponDiscount + ' off') : 'None'}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      { v: customerOrders.length, l: 'Total Orders' },
                      { v: 'Rs.' + totalSpent.toLocaleString('en-IN'), l: 'Total Spent' },
                      { v: customerOrders.filter(o => o.status === 'Delivered').length, l: 'Delivered' },
                    ].map((st, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                        <div className="font-black text-[#1B6B3A] text-lg">{st.v}</div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{st.l}</div>
                      </div>
                    ))}
                  </div>
                  {customerOrders.length > 1 && (
                    <div className="mt-3 text-[10px] text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-slate-400">All orders: </span>
                      {customerOrders.map(o => o.id).join(', ')}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-200">Items in this order</div>
                  {viewOrder.items?.map((it, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0">
                      <img src={it.image} alt="" className="h-9 w-9 rounded-lg object-cover border" onError={imgFallback} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{it.name}</div>
                        <div className="text-[10px] text-slate-400">{it.brand} · Qty {it.quantity}</div>
                      </div>
                      <div className="text-xs font-black text-slate-700">Rs.{(it.price * it.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 bg-emerald-50">
                    <span className="text-xs font-bold text-slate-500">{viewOrder.paymentMethod || 'COD'} · {new Date(viewOrder.createdAt).toLocaleString('en-IN')}</span>
                    <span className="font-black text-[#1B6B3A]">Total Rs.{viewOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Status + message */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Update status:</span>
                  <select value={viewOrder.status}
                    onChange={e => { handleStatusChange(viewOrder.id, e.target.value as Order['status']); setViewOrder({ ...viewOrder, status: e.target.value as Order['status'] }); }}
                    className={'border rounded-lg px-3 py-1.5 text-xs font-bold ' + statusColor(viewOrder.status)}>
                    {['Placed','Confirmed','Dispatched','Delivered','Cancelled'].map(st => <option key={st}>{st}</option>)}
                  </select>
                  <span className="text-[10px] text-slate-400">Customer is notified in their profile inbox automatically.</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest mb-2">Send Message to Customer Inbox</h4>
                  {Array.isArray(viewOrder.messages) && viewOrder.messages.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                      {viewOrder.messages.map((m) => (
                        <div key={m.id} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700">
                          <span className="block">{m.body}</span>
                          <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea value={adminMsg} onChange={e => setAdminMsg(e.target.value)} rows={2}
                    placeholder="e.g. Your seeds batch is fresh stock from today's arrival — dispatching tomorrow morning."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#1B6B3A] resize-none" />
                  <button
                    onClick={() => {
                      const msg = adminMsg.trim();
                      if (!msg) return;
                      // 1) Local inbox (same-device) — instant.
                      sendInboxMessage({ toEmail: cEmail || 'all', title: 'Message about order ' + viewOrder.id, body: msg, orderId: viewOrder.id });
                      // 2) Attach to the order in Supabase so it reaches the customer
                      //    reliably across devices (the shared local inbox does not).
                      appendOrderMessage(viewOrder.id, msg).catch(() => { /* offline — local copy saved */ });
                      // 3) Update the local order mirror so it shows immediately.
                      try {
                        const existing = Array.isArray(viewOrder.messages) ? viewOrder.messages : [];
                        const withMsg = { ...viewOrder, messages: [...existing, { id: 'amsg-' + Date.now().toString(36), body: msg, createdAt: new Date().toISOString() }] };
                        saveLocalOrder(withMsg);
                        setViewOrder(withMsg);
                      } catch { /* ignore */ }
                      setAdminMsg('');
                      alert('Message sent to the customer — it will appear in their Inbox.');
                    }}
                    className="mt-2 bg-[#1B6B3A] text-white text-xs font-bold px-5 py-2 rounded-lg">
                    Send to Inbox
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
    </div>
  );
}
