import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { fetchProducts, fetchUserProfile, saveUserProfile, seedProducts } from './dbHelper';
import { Product, CartItem, UserProfile, Service } from './types';
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS } from './seedData';

// Component imports
import Header from './components/Header';
import HomeComponent from './components/HomeComponent';
import CategoryComponent from './components/CategoryComponent';
import ProductDetailComponent from './components/ProductDetailComponent';
import CartComponent from './components/CartComponent';
import CheckoutComponent from './components/CheckoutComponent';
import AccountComponent from './components/AccountComponent';
import AdminComponent from './components/AdminComponent';

// New specialized sub-module views
import ServicesComponent from './components/ServicesComponent';
import ServicesDetailComponent from './components/ServicesDetailComponent';
import FarmLoansComponent from './components/FarmLoansComponent';
import AcademyComponent from './components/AcademyComponent';
import BlogComponent from './components/BlogComponent';
import AboutComponent from './components/AboutComponent';
import ContactComponent from './components/ContactComponent';

export default function App() {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Inventories database states
  const [products, setProducts] = useState<Product[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart and Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Coupon State
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Sync Products from Firestore
  const loadInventory = async () => {
    setIsInventoryLoading(true);
    try {
      let fetched = await fetchProducts();
      // If Firestore is completely empty, fall back to offline static SEED_PRODUCTS to prevent startup write errors
      if (!fetched || fetched.length === 0) {
        console.log("Empty Firestore database detected. Loading static SEED_PRODUCTS offline fallback.");
        fetched = SEED_PRODUCTS;
      }
      setProducts(fetched || []);
    } catch (err) {
      console.error("Could not fetch Firestore products (using mock parameters):", err);
      setProducts(SEED_PRODUCTS);
    } finally {
      setIsInventoryLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Sync Wishlist with User Profile
  useEffect(() => {
    if (userProfile) {
      setWishlist(userProfile.wishlist || []);
    } else {
      setWishlist([]);
    }
  }, [userProfile]);

  // Sync local cart from LocalStorage
  useEffect(() => {
    const cached = localStorage.getItem('igo_agrimart_cart_cache');
    if (cached) {
      try {
        setCart(JSON.parse(cached));
      } catch (e) {
        console.error("Cart retrieval breakdown");
      }
    }
  }, []);

  // Write Cart cache to disk
  const persistCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('igo_agrimart_cart_cache', JSON.stringify(newCart));
  };

  const addToCart = (prod: Product, qTyped: number = 1) => {
    const freshCart = [...cart];
    const existingIdx = freshCart.findIndex(item => item.product.id === prod.id);

    if (existingIdx > -1) {
      freshCart[existingIdx].quantity += qTyped;
    } else {
      freshCart.push({
        id: 'cart-' + Math.random().toString(36).substring(2, 9),
        product: prod,
        quantity: qTyped
      });
    }
    persistCart(freshCart);
    alert(`Added ${qTyped} unit(s) of "${prod.name}" successfully to your shopping basket!`);
  };

  const toggleWishlist = async (productId: string) => {
    if (!auth.currentUser) {
      alert("Please sign in with Google in the top-right header to save items on your wishlist permanently!");
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

  // Render view router switcher
  return (
    <div className="min-h-screen bg-[#F7F9F4] text-slate-800 font-sans flex flex-col justify-between">
      <div>
        <Header
          lang={lang}
          setLang={setLang}
          cartCount={totalCartCount}
          wishlistCount={wishlist.length}
          setCurrentPage={setCurrentPage}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />

        {isInventoryLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="h-10 w-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Connecting with IGO Chennai Headquarters database...
            </p>
          </div>
        ) : (
          <main className="pb-16 min-h-[500px]">
            {currentPage === 'home' && (
              <HomeComponent
                lang={lang}
                products={products}
                categories={SEED_CATEGORIES}
                setCurrentPage={setCurrentPage}
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

            {currentPage === 'admin' && (
              <AdminComponent
                lang={lang}
                products={products}
                setProducts={setProducts}
                categories={SEED_CATEGORIES}
                brands={SEED_BRANDS}
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
              <BlogComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'about' && (
              <AboutComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'contact' && (
              <ContactComponent
                lang={lang}
                setCurrentPage={setCurrentPage}
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
