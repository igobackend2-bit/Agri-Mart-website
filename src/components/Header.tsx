import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Globe, 
  CheckCircle, 
  Award,
  Mic
} from 'lucide-react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { clearSession } from '../session';
import { fetchProducts, saveUserProfile, fetchUserProfile } from '../dbHelper';
import { Product, UserProfile } from '../types';
import { getMarqueeLines } from '../siteConfig';
import { detectLocation, getSavedLocation } from '../storeData';
import { translations, LanguageDict } from '../translation';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  lang: 'en' | 'ta';
  setLang: (l: 'en' | 'ta') => void;
  cartCount: number;
  wishlistCount: number;
  setCurrentPage: (p: string) => void;
  setSelectedCategory: (c: string | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (u: UserProfile | null) => void;
}

export default function Header({
  lang,
  setLang,
  cartCount,
  wishlistCount,
  setCurrentPage,
  setSelectedCategory,
  setSelectedProduct,
  searchQuery,
  setSearchQuery,
  userProfile,
  setUserProfile
}: HeaderProps) {
  const t: LanguageDict = translations[lang];
  const [cxLoc, setCxLoc] = useState(() => getSavedLocation());
  const [locBusy, setLocBusy] = useState(false);
  const handleDetectLoc = async () => {
    if (locBusy) return;
    setLocBusy(true);
    try { setCxLoc(await detectLocation()); }
    catch { alert('Please allow location access to detect your delivery area.'); }
    finally { setLocBusy(false); }
  };
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch custom user profile or bootstrap initial (Google sign-in path)
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          const bootstrapped: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'Farmer Guest',
            email: user.email || '',
            phone: user.phoneNumber || '',
            role: user.email === 'igobackend2@gmail.com' ? 'admin' : 'customer',
            addresses: [],
            wishlist: []
          };
          await saveUserProfile(bootstrapped);
          setUserProfile(bootstrapped);
        }
      }
      // Do NOT clear the profile when Firebase has no user — the app also
      // supports a local (phone OTP / dev) session managed in App.tsx.
    });

    // Load products for search autocomplete features
    fetchProducts().then(setAllProducts).catch(console.error);

    return () => unsubscribe();
  }, [setUserProfile]);

  // Click outside to hide search suggestions
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // Sync suggestion matches on query write
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSearchSuggestions(false);
      return;
    }
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.brand.toLowerCase().includes(val.toLowerCase()) ||
      p.category.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 6);
    setSuggestions(filtered);
    setShowSearchSuggestions(true);
  };

  const executeGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const executeLogout = async () => {
    try { await signOut(auth); } catch { /* ignore — may be a local session */ }
    clearSession();
    setUserProfile(null);
    setCurrentPage('home');
  };

  const selectSuggestedProduct = (p: Product) => {
    setSelectedProduct(p);
    setShowSearchSuggestions(false);
    setSearchQuery('');
    setCurrentPage('product');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchSuggestions(false);
      setCurrentPage('category');
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Announcement Bar */}
      <div className="bg-[#1B6B3A] text-[#F7F9F4] text-xs py-1.5 px-4 text-center font-medium tracking-wide border-b border-[#248F4E]">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2 text-center">
          <span className="mx-auto block text-center w-full sm:-mr-2 truncate sm:whitespace-normal">{getMarqueeLines().join('  |  ')}</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="bg-white py-3.5 px-4 sm:px-6 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            onClick={() => {
              setCurrentPage('home');
              setSelectedCategory(null);
              setSearchQuery('');
            }}
          >
            <div className="h-10 w-10 bg-[#1B6B3A] text-white rounded-lg flex items-center justify-center font-bold text-xl tracking-tight shadow-sm border border-[#248F4E]">
              I
            </div>
            <div>
              <h1 id="logo-title" className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg tracking-wider leading-none">
                IGO AGRI MARKET
              </h1>
              <p className="text-[9px] font-medium text-[#E8A020] tracking-widest uppercase mt-0.5">
                Chengalpattu & Chennai H.Q.
              </p>
            </div>
          </div>

          {/* Deliver-to location chip (Swiggy/Zepto-style) */}
          <button
            onClick={(e) => { e.stopPropagation(); handleDetectLoc(); }}
            className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-[#F7F9F4] hover:border-[#1B6B3A] transition text-left shrink-0"
            title="Detect my delivery location"
          >
            <span className="text-base leading-none">📍</span>
            <span>
              <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Deliver to</span>
              <span className="block text-[11px] font-black text-[#1B6B3A] leading-tight max-w-[120px] truncate">
                {locBusy ? 'Detecting...' : cxLoc ? (cxLoc.city + (cxLoc.pincode ? ' ' + cxLoc.pincode : '')) : 'Detect location'}
              </span>
            </span>
          </button>

          {/* Autocomplete Search Bar */}
          <div ref={searchRef} className="hidden md:block relative w-56 lg:w-72 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#F7F9F4] text-[#1a1a1a] pl-4 pr-10 py-2 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-1 focus:ring-[#1B6B3A] transition"
              />
              <button 
                type="button" 
                onClick={() => {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRecognition) {
                    alert("Voice search is not supported in your browser.");
                    return;
                  }
                  const recognition = new SpeechRecognition();
                  recognition.lang = lang === 'en' ? 'en-IN' : 'ta-IN';
                  recognition.interimResults = false;
                  recognition.start();
                  recognition.onresult = (event: any) => {
                    const transcript = String(event.results[0][0].transcript || '').replace(/\.$/, '').trim();
                    if (!transcript) return;
                    // Fill the box, show suggestions, AND open the results page.
                    handleSearchChange(transcript);
                    setShowSearchSuggestions(false);
                    setCurrentPage('category');
                  };
                  recognition.onerror = (e: any) => {
                    if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
                      alert('Please allow microphone access in your browser to use voice search.');
                    }
                  };
                }}
                className="absolute right-10 top-2.5 text-slate-400 hover:text-[#1B6B3A] transition"
                title="Voice Search"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-[#1B6B3A] transition">
                <Search className="h-4.5 w-4.5" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSearchSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto custom-scroll">
                <div className="p-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">
                  Quick Search Suggestions
                </div>
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => selectSuggestedProduct(p)}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-[#F7F9F4] cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} alt={p.name} className="h-8 w-8 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-[#1B6B3A] font-medium">
                          {p.isIgoOwn ? 'IGO Group Brand' : 'Partner Brand'} • {p.brand}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900">₹{p.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls Action Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Tamil Language Toggle Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#F7F9F4] text-[#1B6B3A] hover:bg-[#e9eee3] text-xs font-bold rounded-full transition border border-slate-100"
              title="Change language / தமிழ்"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell userProfile={userProfile} setCurrentPage={setCurrentPage} />

            {/* Wishlist Button */}
            <button
              onClick={() => setCurrentPage('account')}
              className="relative p-1.5 text-slate-600 hover:text-[#D94F3D] transition"
              title={t.wishlist}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D94F3D] text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setCurrentPage('cart')} 
              className="relative p-1.5 text-slate-600 hover:text-[#1B6B3A] transition"
              title={t.cart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8A020] text-slate-950 text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Auth Portal */}
            <div className="hidden sm:block">
              {userProfile ? (
                <div className="flex items-center gap-3">
                  {/* Dashboard Route */}
                  <button
                    onClick={() => setCurrentPage('account')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#1B6B3A] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>{userProfile?.role === 'admin' ? 'Admin Board' : t.myAccount}</span>
                  </button>

                  {userProfile?.role === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="bg-red-50 text-[#D94F3D] border border-red-200 text-[10px] font-extrabold uppercase px-2 py-1.5 rounded-md flex items-center gap-1 hover:bg-red-100 shadow-sm transition"
                    >
                      <Award className="h-3 w-3" />
                      Admin Control
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm border border-[#248F4E]"
                >
                  {t.login}
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-1 sm:hidden text-slate-600 hover:text-[#1B6B3A]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="block md:hidden bg-white px-4 pb-3 pt-1 border-b border-[#e2e8f0]">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#F7F9F4] text-[#1a1a1a] pl-4 pr-10 py-2 rounded-lg text-xs border border-slate-200 focus:outline-none"
          />
          <button type="submit" className="absolute right-3 top-2 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* Desktop Sub-Navigation Bar */}
      <div className="hidden md:block bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-300 select-none">
          <div className="flex gap-5 items-center py-2.5">



            {/* Custom Interactive Module Pages */}
            <span 
              onClick={() => setCurrentPage('farm-loans')}
              className="hover:text-emerald-400 text-teal-300 font-bold normal-case cursor-pointer transition py-0.5 flex items-center gap-1"
            >
              <span>%</span>
              <span>{lang === 'ta' ? 'விவசாய கடன்கள்' : 'Farm Loans'}</span>
            </span>
            <span 
              onClick={() => setCurrentPage('academy')}
              className="hover:text-emerald-400 text-teal-300 font-bold normal-case cursor-pointer transition py-0.5 flex items-center gap-1"
            >
              <span>🎓</span>
              <span>IGO Academy</span>
            </span>
            <span 
              onClick={() => setCurrentPage('services')}
              className="hover:text-[#E8A020] text-amber-200 font-bold normal-case cursor-pointer transition py-0.5 flex items-center gap-1"
            >
              <span>★</span>
              <span>Expert Services</span>
            </span>
            <span 
              onClick={() => setCurrentPage('blog')}
              className="hover:text-white cursor-pointer transition normal-case font-medium py-0.5"
            >
              Advices Blog
            </span>
          </div>

          <div className="flex gap-4 items-center font-mono text-[10px] normal-case text-slate-400 py-2.5">
            <span 
              onClick={() => setCurrentPage('about')}
              className="hover:text-white cursor-pointer transition"
            >
              About IGO
            </span>
            <span>•</span>
            <span 
              onClick={() => setCurrentPage('contact')}
              className="hover:text-white cursor-pointer transition"
            >
              Contact Support
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-indigo-100 p-4 shadow-xl z-50 space-y-3.5">
          {/* Quick Sub-Categories and Custom pages under mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wide border-b border-slate-100 pb-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); setSelectedCategory('seeds-saplings'); setCurrentPage('category'); }}
              className="text-left py-1.5 px-2.5 bg-slate-50 rounded hover:bg-[#1B6B3A]/10 text-slate-800"
            >
              🌱 Seeds
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setSelectedCategory('fertilizers'); setCurrentPage('category'); }}
              className="text-left py-1.5 px-2.5 bg-slate-50 rounded hover:bg-[#1B6B3A]/10 text-slate-800"
            >
              🧪 Fertilizers
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setSelectedCategory('crop-protection'); setCurrentPage('category'); }}
              className="text-left py-1.5 px-2.5 bg-slate-50 rounded hover:bg-[#1B6B3A]/10 text-slate-800"
            >
              🛡️ Crop Protection
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setSelectedCategory('irrigation-systems'); setCurrentPage('category'); }}
              className="text-left py-1.5 px-2.5 bg-slate-50 rounded hover:bg-[#1B6B3A]/10 text-slate-800"
            >
              💧 Irrigation
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentPage('farm-loans'); }}
              className="text-left py-1.5 px-2.5 bg-amber-50 text-amber-900 rounded flex items-center gap-1"
            >
              <span>%</span> <span>Farm Loans</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentPage('academy'); }}
              className="text-left py-1.5 px-2.5 bg-teal-50 text-teal-800 rounded flex items-center gap-1"
            >
              <span>🎓</span> <span>IGO Academy</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setCurrentPage('services'); }}
              className="text-left col-span-2 py-2 px-2.5 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded font-extrabold flex items-center gap-1.5"
            >
              <span>★</span> <span>Expert Services</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {userProfile ? (
              <>
                <div className="pb-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-800">{userProfile.name}</div>
                  <div className="text-[10px] text-slate-400">{userProfile.email}</div>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); setCurrentPage('account'); }}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1B6B3A] py-1"
                >
                  <User className="h-4 w-4" />
                  <span>{t.myAccount}</span>
                </button>

                {userProfile?.role === 'admin' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCurrentPage('admin'); }}
                    className="flex items-center gap-2 text-xs font-extrabold text-[#D94F3D] py-1"
                  >
                    <Award className="h-4 w-4" />
                    <span>Admin Controls (Product/Orders)</span>
                  </button>
                )}

              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setCurrentPage('auth'); }}
                className="w-full bg-[#1B6B3A] hover:bg-[#134D29] text-white text-xs font-bold py-2 px-4 rounded-lg text-center"
              >
                {t.login}
              </button>
            )}

            {/* Mobile Language Switcher Segmented Row */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1.5 bg-slate-50/50 -mx-4 -mb-4 p-4 rounded-b-lg">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span>🌐</span>
                <span>Language / மொழி</span>
              </span>
              <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-inner">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition cursor-pointer ${
                    lang === 'en' ? 'bg-[#1B6B3A] text-white shadow' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('ta')}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition cursor-pointer ${
                    lang === 'ta' ? 'bg-[#1B6B3A] text-white shadow' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
