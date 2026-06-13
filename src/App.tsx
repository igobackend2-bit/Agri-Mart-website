import { useState, useEffect, useRef, useCallback } from 'react';
import { auth } from './firebase';
import { fetchProducts, fetchUserProfile, saveUserProfile } from './dbHelper';
import { getNotification } from './siteConfig';
import { applyCatalogOverlay, CATALOG_CHANGED_EVENT } from './storeData';
import { Product, CartItem, UserProfile, Service } from './types';
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS } from './seedData';
import { ShoppingCart, X, CheckCircle, ArrowRight } from 'lucide-react';

// Component imports
import Header from './components/Header';
import HomeComponent from './components/HomeComponent';
import CategoryComponent from './components/CategoryComponent';
import ProductDetailComponent from './components/ProductDetailComponent';
import CartComponent from './components/CartComponent';
import CheckoutComponent from './components/CheckoutComponent';
import AccountComponent from './components/AccountComponent';
import AuthComponent from './components/AuthComponent';
import AdminGatekeeper from './components/AdminGatekeeper';
import ServicesComponent from './components/ServicesComponent';
import ServicesDetailComponent from './components/ServicesDetailComponent';
import FarmLoansComponent from './components/FarmLoansComponent';
import AcademyComponent from './components/AcademyComponent';
import BlogComponent from './components/BlogComponent';
import AboutComponent from './components/AboutComponent';
import ContactComponent from './components/ContactComponent';
import CropDoctorComponent from './components/CropDoctorComponent';
import PartnerPortalComponent from './components/PartnerPortalComponent';
import KnowledgeHubComponent from './components/KnowledgeHubComponent';
import AIAssistantWidget from './components/AIAssistantWidget';
import Footer from './components/Footer';
import OrderTrackingComponent from './components/OrderTrackingComponent';
import AgriEventsComponent from './components/AgriEventsComponent';

// ── Cart Toast notification ───────────────────────────────────────────────────
interface CartToastProps {
  product: Product;
  qty: number;
  onClose: () => void;
  onViewCart: () => void;
}

function CartToast({ product, qty, onClose, onViewCart }: CartToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 30);
    // Auto-dismiss after 4s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  const handleViewCart = () => {
    setVisible(false);
    setTimeout(() => { onClose(); onViewCart(); }, 200);
  };

  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'fixed',
        top: '80px',
        right: '16px',
        zIndex: 9999,
        width: '320px',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Green top bar */}
        <div className="bg-[#1B6B3A] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-white" />
            <span className="text-white text-xs font-black uppercase tracking-wider">Added to Cart!</span>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product row */}
        <div className="flex items-center gap-3 p-4">
          <img
            src={product.images?.[0] || '/catalog/nursery-essentials/Pots.png'}
            alt={product.name}
            className="h-14 w-14 object-cover rounded-xl border border-slate-100 shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{product.brand}</p>
            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mt-0.5 leading-snug">{product.displayName || product.name}</h4>
            <p className="text-xs text-[#1B6B3A] font-bold mt-1">
              {qty} x &#8377;{product.price} = &#8377;{qty * product.price}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={handleViewCart}
            className="flex-1 bg-[#1B6B3A] hover:bg-emerald-900 text-white font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>View Cart</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Success Popup ───────────────────────────────────────────────────────
interface OrderSuccessProps {
  orderId: string;
  onClose: () => void;
  onTrack: () => void;
  onHome: () => void;
}

export function OrderSuccessPopup({ orderId, onClose, onTrack, onHome }: OrderSuccessProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-bounce-once">
        {/* Green header */}
        <div className="bg-[#1B6B3A] px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-white font-black text-xl tracking-tight">Order Placed!</h2>
          <p className="text-emerald-200 text-xs mt-1 font-medium">Your farming order is confirmed</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Order ID</p>
            <p className="font-black text-[#1B6B3A] text-lg mt-1 tracking-wider">{orderId}</p>
          </div>
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Our team will confirm your order within 30 minutes.
            You will receive updates on WhatsApp.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onTrack}
              className="flex-1 bg-[#1B6B3A] text-white font-black text-xs py-3 rounded-xl hover:bg-emerald-900 transition"
            >
              Track Order
            </button>
            <button
              onClick={onHome}
              className="flex-1 bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── URL helpers: only /admin has a real URL; everything else lives at / ──────
function pageFromPath(): string {
  return window.location.pathname.replace(/\/+$/, '') === '/admin' ? 'admin' : 'home';
}

// ── Site-wide notification bar (sent from Admin → Content) ───────────────────
function NotificationBar() {
  const [notif, setNotif] = useState(() => getNotification());
  const [dismissed, setDismissed] = useState(() =>
    notif ? sessionStorage.getItem('igo_notif_dismissed') === String(notif.ts) : true
  );
  useEffect(() => { setNotif(getNotification()); }, []);
  if (!notif || dismissed) return null;
  return (
    <div className="bg-[#E8A020] text-emerald-950 px-4 py-2 flex items-center justify-center gap-3 text-xs font-bold">
      <span className="text-center">{notif.text}</span>
      <button
        onClick={() => { sessionStorage.setItem('igo_notif_dismissed', String(notif.ts)); setDismissed(true); }}
        className="shrink-0 hover:bg-amber-500/40 rounded-full p-0.5" aria-label="Dismiss notification">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── First-visit welcome / login prompt ────────────────────────────────────────
function WelcomePrompt({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.55)' }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative px-6 py-7 text-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=70&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D22]/92 to-[#1B6B3A]/88" />
          <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white z-10"><X className="h-5 w-5" /></button>
          <div className="relative h-14 w-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-[#1B6B3A] mx-auto mb-3 shadow-lg">I</div>
          <h2 className="relative text-white font-black text-xl tracking-tight">Welcome to IGO Agri Mart</h2>
          <p className="relative text-emerald-200 text-xs mt-1">India's trusted farm supplies marketplace</p>
        </div>
        <div className="p-6 space-y-3">
          {[
            '🚜 835+ genuine agri products at best prices',
            '⚡ Same-day dispatch, pan-India delivery',
            '🎁 Member-only offers & order tracking',
          ].map((b, i) => <p key={i} className="text-xs font-bold text-slate-600">{b}</p>)}
          <button onClick={onLogin}
            className="w-full bg-[#1B6B3A] hover:bg-emerald-950 text-white font-black text-sm py-3.5 rounded-2xl transition mt-2">
            Login / Sign Up — it's free
          </button>
          <button onClick={onClose} className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs py-1">
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [currentPage, setCurrentPageRaw] = useState<string>(pageFromPath);

  // Keep the browser URL in sync: /admin for the admin panel, / for the rest.
  const setCurrentPage = useCallback((page: string) => {
    const want = page === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== want) {
      window.history.pushState({ page }, '', want);
    }
    setCurrentPageRaw(page);
  }, []);

  // First-visit login prompt (shown once per device, after a short delay)
  const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('igo_welcome_shown') || pageFromPath() === 'admin') return;
    const t = setTimeout(() => {
      if (!auth.currentUser) setShowWelcome(true);
      localStorage.setItem('igo_welcome_shown', '1');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  // Browser back/forward support for /admin <-> /
  useEffect(() => {
    const onPop = () => setCurrentPageRaw(pageFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Cart toast state
  const [cartToast, setCartToast] = useState<{ product: Product; qty: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable callbacks so CartToast's useEffect doesn't re-run on every App render
  // (Firebase auth listener re-renders App frequently, which would reset the 30ms slide-in timer)
  const closeCartToast = useCallback(() => setCartToast(null), []);
  const viewCartHandler = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('cart');
    setPageKey(k => k + 1);
  }, []);

  const loadInventory = () => {
    // Seed catalog + persistent admin overlay (add/edit/delete/stock changes).
    setProducts(applyCatalogOverlay(SEED_PRODUCTS));
    setIsInventoryLoading(false);
  };

  useEffect(() => { loadInventory(); }, []);

  // Live-refresh products when admin edits catalog or an order decrements stock
  useEffect(() => {
    const onCatalogChange = () => setProducts(applyCatalogOverlay(SEED_PRODUCTS));
    window.addEventListener(CATALOG_CHANGED_EVENT, onCatalogChange);
    return () => window.removeEventListener(CATALOG_CHANGED_EVENT, onCatalogChange);
  }, []);

  useEffect(() => {
    if (userProfile) {
      setWishlist(userProfile.wishlist || []);
    } else {
      setWishlist([]);
    }
  }, [userProfile]);

  useEffect(() => {
    const cached = localStorage.getItem('igo_agrimart_cart_cache');
    if (cached) {
      try { setCart(JSON.parse(cached)); } catch (e) { /* ignore */ }
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          if (profile) setUserProfile(profile);
        } catch { /* ignore */ }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const persistCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('igo_agrimart_cart_cache', JSON.stringify(newCart));
  };

  const addToCart = (prod: Product, qTyped: number = 1) => {
    setCart(prev => {
      const freshCart = [...prev];
      const existingIdx = freshCart.findIndex(item => item.product.id === prod.id);
      if (existingIdx > -1) {
        freshCart[existingIdx].quantity += qTyped;
      } else {
        freshCart.push({
          id: 'cart-' + Math.random().toString(36).substring(2, 9),
          product: prod,
          quantity: qTyped,
        });
      }
      localStorage.setItem('igo_agrimart_cart_cache', JSON.stringify(freshCart));
      return freshCart;
    });

    // Show toast - reset if already showing
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setCartToast({ product: prod, qty: qTyped });
  };

  const toggleWishlist = async (productId: string) => {
    if (!auth.currentUser) {
      setCartToast(null);
      alert('Please sign in with Google to save wishlist items!');
      return;
    }
    let nextWishlist = [...wishlist];
    if (nextWishlist.includes(productId)) {
      nextWishlist = nextWishlist.filter(id => id !== productId);
    } else {
      nextWishlist.push(productId);
    }
    setWishlist(nextWishlist);
    if (userProfile) {
      const revisedProfile = { ...userProfile, wishlist: nextWishlist };
      setUserProfile(revisedProfile);
      await saveUserProfile(revisedProfile);
    }
  };

  const totalCartCount = cart.reduce((tot, item) => tot + item.quantity, 0);

  const [pageKey, setPageKey] = useState(0);
  const navigateTo = (page: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    setPageKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {currentPage !== 'admin' && <NotificationBar />}
        {currentPage !== 'admin' && (
        <Header
          lang={lang}
          setLang={setLang}
          cartCount={totalCartCount}
          wishlistCount={wishlist.length}
          setCurrentPage={navigateTo}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
        )}

        {isInventoryLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="h-10 w-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Connecting with IGO Chennai Headquarters database...
            </p>
          </div>
        ) : (
          <main key={pageKey} className="pb-16 min-h-[500px] page-enter">

            {currentPage === 'home' && (
              <HomeComponent
                lang={lang}
                products={products}
                categories={SEED_CATEGORIES}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setCurrentPage={navigateTo}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                addToCart={addToCart}
              />
            )}

            {currentPage === 'category' && (
              <CategoryComponent
                lang={lang}
                products={products}
                categories={SEED_CATEGORIES}
                brands={SEED_BRANDS}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                setCurrentPage={setCurrentPage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addToCart={addToCart}
              />
            )}

            {currentPage === 'product' && selectedProduct && (
              <ProductDetailComponent
                lang={lang}
                product={selectedProduct}
                allProducts={products}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                setCurrentPage={setCurrentPage}
                setSelectedProduct={setSelectedProduct}
              />
            )}

            {currentPage === 'cart' && (
              <CartComponent
                lang={lang}
                cart={cart}
                setCart={persistCart}
                setCurrentPage={setCurrentPage}
                couponDiscount={couponDiscount}
                setCouponDiscount={setCouponDiscount}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutComponent
                lang={lang}
                cart={cart}
                setCart={persistCart}
                setCurrentPage={setCurrentPage}
                couponDiscount={couponDiscount}
                setCouponDiscount={setCouponDiscount}
              />
            )}

            {currentPage === 'account' && (
              <AccountComponent
                lang={lang}
                allProducts={products}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                setCurrentPage={setCurrentPage}
                setSelectedProduct={setSelectedProduct}
                addToCart={addToCart}
              />
            )}

            {currentPage === 'auth' && (
              <AuthComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'admin' && (
              <AdminGatekeeper
                lang={lang}
                products={products}
                setProducts={setProducts}
                categories={SEED_CATEGORIES}
                brands={SEED_BRANDS}
                setCurrentPage={navigateTo}
              />
            )}

            {currentPage === 'services' && (
              <ServicesComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
                setSelectedService={setSelectedService}
              />
            )}

            {currentPage === 'services-detail' && (
              <ServicesDetailComponent
                lang={lang}
                selectedService={selectedService}
                setCurrentPage={setCurrentPage}
                userProfile={userProfile}
              />
            )}

            {currentPage === 'farm-loans' && (
              <FarmLoansComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
                userProfile={userProfile}
              />
            )}

            {currentPage === 'academy' && (
              <AcademyComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
                userProfile={userProfile}
              />
            )}

            {currentPage === 'blog' && (
              <BlogComponent lang={lang} setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'about' && (
              <AboutComponent lang={lang} setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'contact' && (
              <ContactComponent lang={lang} setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'crop-doctor' && (
              <CropDoctorComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
                allProducts={products}
                setSelectedProduct={setSelectedProduct}
              />
            )}

            {currentPage === 'partners' && (
              <PartnerPortalComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
                userProfile={userProfile}
              />
            )}

            {currentPage === 'knowledge-hub' && (
              <KnowledgeHubComponent lang={lang} setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'events' && (
              <AgriEventsComponent lang={lang} setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'track' && (
              <OrderTrackingComponent setCurrentPage={navigateTo} />
            )}

          </main>
        )}
      </div>

      {currentPage !== 'admin' && <Footer setCurrentPage={navigateTo} setSelectedCategory={setSelectedCategory} />}
      {currentPage !== 'admin' && <AIAssistantWidget lang={lang} />}

      {/* First-visit login prompt */}
      {showWelcome && currentPage !== 'admin' && (
        <WelcomePrompt
          onLogin={() => { setShowWelcome(false); navigateTo('auth'); }}
          onClose={() => setShowWelcome(false)}
        />
      )}

      {/* Cart Toast */}
      {cartToast && (
        <CartToast
          product={cartToast.product}
          qty={cartToast.qty}
          onClose={closeCartToast}
          onViewCart={viewCartHandler}
        />
      )}
    </div>
  );
}
