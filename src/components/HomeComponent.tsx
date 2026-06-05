import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Leaf, 
  ShieldAlert, 
  Activity, 
  Hammer, 
  Cpu, 
  Beef, 
  Flower2, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  HeadphonesIcon, 
  Award, 
  CornerDownRight, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Percent
} from 'lucide-react';
import { Product, Category, Brand } from '../types';
import { SEED_CATEGORIES, SEED_BRANDS, CROP_KITS, SUBSIDY_INFO } from '../seedData';
import { translations, LanguageDict } from '../translation';

// Extended items for categories
const CATEGORY_MAP: Record<string, any> = {
  'seeds-saplings': { icon: Sprout, text: 'Seeds & Saplings', count: '10K+ Products', desc: 'Hybrid and OP seed selection', bg: 'bg-emerald-50 text-emerald-700' },
  'fertilizers': { icon: Leaf, text: 'Fertilizers', count: '5K+ Options', desc: 'NPK, Micronutrient and Liquid mineral feeds', bg: 'bg-green-50 text-green-700' },
  'crop-care': { icon: ShieldAlert, text: 'Crop Care', count: '8K+ Products', desc: 'Fungicides, insect defenses, and weed removers', bg: 'bg-red-50 text-red-700' },
  'bioproducts': { icon: Activity, text: 'Bioproducts', count: '4K+ Products', desc: 'Seaweed catalysts & Rhizobium bio-nutrients', bg: 'bg-blue-50 text-blue-700' },
  'farm-implements': { icon: Hammer, text: 'Farm Implements', count: '1,200+ Machines', desc: 'Cutters, earth augers, high-pressure sprayers', bg: 'bg-indigo-50 text-indigo-700' },
  'farm-automation': { icon: Cpu, text: 'Farm Automation', count: '650+ Systems', desc: 'Sensors, mist control valves, drone services', bg: 'bg-cyan-50 text-cyan-700' },
  'protein-cuts': { icon: Beef, text: 'Protein Cuts', count: 'Fresh Daily', desc: 'Pasteur country chicken, premium mutton, bay seafood', bg: 'bg-orange-50 text-orange-700' },
  'garden-care': { icon: Flower2, text: 'Garden Care', count: '3K+ Products', desc: 'Balcony potting soil, vermicompost humics', bg: 'bg-lime-50 text-lime-700' }
};

const ADDITIONAL_NAV = [
  { text: 'Farm Loans', slug: 'farm-loans', icon: FileText, desc: 'Government schemes', bg: 'bg-amber-50 text-amber-700' },
  { text: 'IGO Academy', slug: 'igo-academy', icon: GraduationCap, desc: 'Training classes', bg: 'bg-teal-50 text-teal-700' }
];

interface HomeComponentProps {
  lang: 'en' | 'ta';
  products: Product[];
  categories: Category[];
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin') => void;
  setSelectedCategory: (c: string | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  addToCart: (p: Product) => void;
}

export default function HomeComponent({
  lang,
  products,
  categories,
  setCurrentPage,
  setSelectedCategory,
  setSelectedProduct,
  addToCart
}: HomeComponentProps) {
  const t: LanguageDict = translations[lang];
  const [activeTab, setActiveTab] = useState<'All' | 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Tools'>('All');
  const [subsidyQuery, setSubsidyQuery] = useState('');
  const [selectedSubsidyIndex, setSelectedSubsidyIndex] = useState<number | null>(null);

  // Filter Best Sellers
  const getFilteredBestSellers = () => {
    let list = [...products].sort((a, b) => b.reviewCount - a.reviewCount); // Popularity sorting
    if (activeTab === 'All') return list.slice(0, 8);
    if (activeTab === 'Seeds') return list.filter(p => p.category === 'Seeds & Saplings').slice(0, 8);
    if (activeTab === 'Fertilizers') return list.filter(p => p.category === 'Fertilizers').slice(0, 8);
    if (activeTab === 'Pesticides') return list.filter(p => p.category === 'Crop Care').slice(0, 8);
    if (activeTab === 'Tools') return list.filter(p => p.category === 'Farm Implements').slice(0, 8);
    return list.slice(0, 8);
  };

  const handleCategoryClick = (slug: string) => {
    if (slug === 'farm-loans') {
      // Trigger smooth scroll down to Loans widget, or set Category
      const el = document.getElementById('subsidy-widget');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (slug === 'igo-academy') {
      alert("Welcome to IGO Academy!\nTraining and workshops in kanathur headquarter. Classes on Organic farming, Hydroponics, and Drone controls starting soon. Call 7397785803 for schedules.");
    } else {
      setSelectedCategory(slug);
      setCurrentPage('category');
    }
  };

  const handleBrandPillClick = (brandName: string) => {
    setSelectedCategory(null);
    setSelectedCategory(`brand:${brandName}`);
    setCurrentPage('category');
  };

  // Safe Unsplash categories backgrounds
  return (
    <div>
      {/* 2. Page Navigation Links Menu */}
      <nav className="bg-[#1B6B3A]/95 text-[#F7F9F4] text-xs sm:text-sm border-b border-[#248F4E] shadow-inner select-none overflow-x-auto whitespace-nowrap scrollbar-none sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between min-h-[46px] gap-6">
          <div className="flex items-center gap-6">
            {SEED_CATEGORIES.map((cat) => {
              const item = CATEGORY_MAP[cat.id];
              const IconComp = item?.icon || Sprout;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-1.5 py-3 hover:text-[#E8A020] transition font-semibold"
                >
                  <IconComp className="h-4 w-4" />
                  <span>{lang === 'ta' && cat.name === 'Seeds & Saplings' ? 'விதைகள்' : cat.name}</span>
                </button>
              );
            })}
            
            {/* Extended Nav Items */}
            {ADDITIONAL_NAV.map((nav, i) => {
              const IconComp = nav.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryClick(nav.slug)}
                  className="flex items-center gap-1.5 py-3 text-[#E8A020] hover:scale-105 transition font-bold"
                >
                  <IconComp className="h-4 w-4" />
                  <span>{nav.text}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-emerald-200 font-bold hidden lg:flex items-center gap-1.5 uppercase tracking-wider bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
            <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping"></span>
            Chennai Agri Hub Live
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section className="relative bg-emerald-950 text-white min-h-[380px] sm:min-h-[460px] flex items-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80" 
            alt="Tamil nadu green farms background" 
            className="w-full h-full object-cover select-none"
          />
        </div>

        {/* Dynamic Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10 text-[#F7F9F4] fill-current">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
          </svg>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center items-start w-full">
          <div className="bg-emerald-900/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest text-[#E8A020] mb-4 flex items-center gap-1.5 border border-emerald-700 select-none">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            IGO GROUP OF COMPANIES
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-2xl">
            {lang === 'en' ? "India's Centralized Agricultural Marketplace" : "விவசாயிகளுக்கான மத்திய சந்தை"}
          </h2>
          <p className="font-sans text-sm sm:text-lg text-emerald-100 max-w-xl mt-3 leading-relaxed">
            {t.tagline}. Direct logistics delivery, certified products, local Chennai customer expert helpdesk.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-8">
            <button
              onClick={() => handleCategoryClick('seeds-saplings')}
              className="bg-[#E8A020] hover:bg-[#d49119] text-emerald-950 font-bold text-sm px-7 py-3 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Shop Seeds Now</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('subsidy-widget');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-lg justify-center hover:-translate-y-0.5 transition flex items-center gap-1.5 border border-emerald-600/50 cursor-pointer"
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Explore Subsidy Info</span>
            </button>
          </div>

          {/* Hero Statistics Counters Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 tracking-tight bg-emerald-900/80 backdrop-blur-md p-6 rounded-xl border border-emerald-800 mt-12 w-full max-w-4xl shadow-2xl">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E8A020] font-display">27 Brands</div>
              <div className="text-[11px] sm:text-xs text-emerald-100 uppercase tracking-widest mt-1">1 Conglomerate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E8A020] font-display">10,000+</div>
              <div className="text-[11px] sm:text-xs text-emerald-100 uppercase tracking-widest mt-1">Verified Products</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E8A020] font-display">36 States</div>
              <div className="text-[11px] sm:text-xs text-emerald-100 uppercase tracking-widest mt-1">PAN India Delivery</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E8A020] font-display">5,000+</div>
              <div className="text-[11px] sm:text-xs text-emerald-100 uppercase tracking-widest mt-1">Registered Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar with 5 items */}
      <section className="bg-white py-6 border-b border-slate-100 select-none">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">100% Genuine</div>
              <div className="text-[10px] text-slate-400">Direct warehouse dispatch</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">COD Delivery</div>
              <div className="text-[10px] text-slate-400">Available across all pin codes</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center shrink-0">
              <HeadphonesIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Expert Support</div>
              <div className="text-[10px] text-slate-400">Call Chennai desk 7397785803</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Govt Licensed</div>
              <div className="text-[10px] text-slate-400">Valid agri inputs certified</div>
            </div>
          </div>
          <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-full flex items-center justify-center shrink-0">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Easy Returns</div>
              <div className="text-[10px] text-slate-400">7 Days seed replacement policy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Category Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-display font-extrabold text-[#1B6B3A] text-2xl tracking-tight">
              {t.shopByCategory}
            </h3>
            <p className="text-xs text-slate-400 tracking-wide mt-1">
              Select certified inputs designed for highly productive yields
            </p>
          </div>
          <div className="h-0.5 bg-slate-200/50 flex-1 ml-6 hidden sm:block max-w-sm"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {SEED_CATEGORIES.map((cat) => {
            const mapped = CATEGORY_MAP[cat.id] || { text: cat.name, count: 'Products', bg: 'bg-emerald-50 text-emerald-700', icon: Sprout };
            const IconComp = mapped.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white border border-slate-100 rounded-xl p-5 hover:border-[#1B6B3A] hover:shadow-lg transition cursor-pointer select-none relative overflow-hidden group"
              >
                <div className={`h-11 w-11 rounded-lg ${mapped.bg} flex items-center justify-center mb-4 transition group-hover:scale-110`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-[#1a1a1a] text-sm group-hover:text-[#1B6B3A]">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">{filteredProductCount(products, cat.name)} Products</p>
                
                {/* Micro chevron */}
                <span className="absolute bottom-4 right-4 text-slate-300 group-hover:text-[#1B6B3A] transition">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            );
          })}

          {/* Additional static category items requested in Pages lists */}
          {ADDITIONAL_NAV.map((nav, i) => {
            const IconComp = nav.icon;
            return (
              <div
                key={i}
                onClick={() => handleCategoryClick(nav.slug)}
                className="bg-emerald-950 border border-emerald-800 text-white rounded-xl p-5 hover:border-[#E8A020] hover:shadow-lg transition cursor-pointer select-none relative overflow-hidden group"
              >
                <div className="h-11 w-11 rounded-lg bg-[#E8A020] text-emerald-950 flex items-center justify-center mb-4 transition group-hover:scale-110">
                  <IconComp className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-white text-sm group-hover:text-[#E8A020]">
                  {nav.text}
                </h4>
                <p className="text-[11px] text-emerald-300 mt-1">{nav.desc}</p>
                <span className="absolute bottom-4 right-4 text-[#E8A020]">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Sections */}
      <section className="bg-slate-50 py-12 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display font-extrabold text-[#1B6B3A] text-2xl tracking-tight">
                {lang === 'en' ? 'Featured Best Sellers' : 'சிறந்த விற்பனை பொருட்கள்'}
              </h3>
              <p className="text-xs text-slate-400 tracking-wide mt-1">
                Highest rated inputs and machineries favored by over 5000+ farmers in Tamil Nadu
              </p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition select-none cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#1B6B3A] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getFilteredBestSellers().map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
              >
                <div className="cursor-pointer" onClick={() => { setSelectedProduct(p); setCurrentPage('product'); }}>
                  {/* Image with brand absolute overlay */}
                  <div className="relative h-44 bg-slate-100">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    {p.isIgoOwn && (
                      <span className="absolute top-2 left-2 bg-[#1B6B3A] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-600">
                        IGO Brand
                      </span>
                    )}
                    {p.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-[#D94F3D] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        {p.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <div className="text-[10px] uppercase text-[#E8A020] font-bold tracking-widest leading-none">
                      {p.brand}
                    </div>
                    <h5 className="font-display font-bold text-slate-800 text-sm line-clamp-2 mt-1 min-h-[40px] hover:text-[#1B6B3A]">
                      {p.name}
                    </h5>

                    {/* Standard Rating Stars */}
                    <div className="flex items-center gap-1 mt-2.5">
                      <div className="flex text-yellow-400 text-xs">★ ★ ★ ★ ★</div>
                      <span className="text-[10px] text-slate-400 font-medium">({p.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Add Button row */}
                <div className="px-4 pb-4 pt-1 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
                  <div>
                    <div className="text-xs text-slate-400 line-through leading-none">₹{p.mrp}</div>
                    <div className="font-display font-black text-[#1a1a1a] text-base leading-tight">₹{p.price}</div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(p);
                    }}
                    className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-xs font-bold px-3 py-2 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IGO Own Brands Section */}
      <section className="bg-[#1B6B3A] text-white py-14 overflow-hidden relative">
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-800 rounded-full blur-3xl opacity-30 select-none"></div>
        <div className="max-w-7xl mx-auto px-4 z-10 relative">
          <div className="max-w-xl mb-10">
            <span className="text-[#E8A020] text-xs font-bold uppercase tracking-widest bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded">
              27 Conglomerate Brands
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3.5xl tracking-tight mt-4">
              {t.ownBrandsTitle}
            </h3>
            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              Serving organic, mechanical, and informational farming solutions directly under Chennai headquarters. Click any brand to see custom products.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {SEED_BRANDS.filter(b => b.type === 'igo_own').map((b) => (
              <button
                key={b.id}
                onClick={() => handleBrandPillClick(b.name)}
                className="bg-emerald-950/50 hover:bg-[#E8A020] hover:text-[#1B6B3A] border border-emerald-800 text-emerald-100 font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-sm group select-none cursor-pointer"
              >
                <Award className="h-3.5 w-3.5 text-[#E8A020] group-hover:text-[#1B6B3A]" />
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Third party Brand partners scroll bar strip */}
      <section className="bg-slate-100 py-8 border-b border-t border-slate-200 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest pl-3 mb-6">
            {t.partnerBrands}
          </h4>
          
          {/* Brand Partner Ticker list container */}
          <div className="flex justify-center items-center gap-8 sm:gap-14 flex-wrap opacity-65 grayscale hover:grayscale-0 transition duration-500">
            {SEED_BRANDS.filter(b => b.type === 'third_party').map((b, i) => (
              <span 
                key={i} 
                onClick={() => handleBrandPillClick(b.name)}
                className="font-display font-extrabold text-[#1B6B3A]/80 text-sm sm:text-base cursor-pointer hover:text-[#1B6B3A] transition tracking-wide"
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner grid + Subsidy / Loans Finder (subsidy info widget) */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bundle Solutions Promo Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 sm:p-8 shadow-md flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 bg-green-50 rounded-full scale-125 translate-x-12 -translate-y-12 shrink-0 z-0"></div>
          
          <div className="relative z-10">
            <span className="bg-red-50 text-[#D94F3D] border border-red-100 font-black text-[10px] uppercase px-2.5 py-1 rounded">
              Save up to 33% Combo Offer
            </span>
            <h4 className="font-display font-black text-slate-800 text-lg sm:text-xl tracking-tight mt-5">
              Crop Solution Kits
            </h4>
            <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
              We package professional bundles containing compatible seed arrays, soluble foliars, and bio-defenses to simplify disease defense and boost germination rates in single tubs!
            </p>

            {/* Render Crop solution kits */}
            <div className="space-y-4 mt-6">
              {CROP_KITS.map((kit) => (
                <div key={kit.id} className="border-b border-dashed border-slate-100 pb-3 last:border-0">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h5 className="font-semibold text-xs text-slate-800">{kit.name}</h5>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{kit.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 line-through">₹{kit.mrp}</div>
                      <div className="text-xs font-black text-[#1B6B3A]">₹{kit.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Trigger Add specific kit to cart (simulate adding combo elements or placeholder)
                      alert(`Successfully added ${kit.name} discount combo to Cart!`);
                      // Simulate injecting a product representing this kit
                    }}
                    className="text-[10px] font-bold text-[#E8A020] hover:text-[#1B6B3A] flex items-center gap-1 mt-2.5"
                  >
                    <span>Instant Order Combo</span>
                    <CornerDownRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Government Subsidy Finder Widget (integrated Farm Loans) */}
        <div id="subsidy-widget" className="bg-emerald-950 text-[#F7F9F4] p-6 sm:p-8 rounded-xl shadow-xl flex flex-col justify-between border border-emerald-800">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-5 w-5 bg-[#E8A020] rounded-full text-emerald-950 flex items-center justify-center font-bold text-xs">
                ₹
              </span>
              <span className="text-xs font-bold text-[#E8A020] uppercase tracking-wider">
                Authorized Gov Subsidy Portal
              </span>
            </div>
            
            <h4 id="subsidy-header" className="font-display font-black text-white text-lg sm:text-xl tracking-tight leading-snug">
              Government Agri Subsidy Finder
            </h4>
            <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
              Under PMKSY and State initiatives, buy mechanized implements (STIHL cutters, earth drills) or automate greenhouse drip rigs with up to 50% instant capital subsidy refunds.
            </p>

            {/* Interactive Search Tool */}
            <div className="mt-6">
              <label className="text-[11px] font-bold text-[#E8A020] block uppercase tracking-wide">
                Key-in Item Category or Drill Tools:
              </label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  value={subsidyQuery}
                  onChange={(e) => {
                    setSubsidyQuery(e.target.value);
                    setSelectedSubsidyIndex(null);
                  }}
                  placeholder="e.g. Drip, Cutters, Organic"
                  className="bg-emerald-900 border border-emerald-700 rounded-lg p-2 flex-1 text-xs text-white focus:outline-none focus:border-[#E8A020]"
                />
                <button
                  onClick={() => {
                    const matchIdx = SUBSIDY_INFO.findIndex(x => 
                      x.applicableFor.toLowerCase().includes(subsidyQuery.toLowerCase()) ||
                      x.schemeName.toLowerCase().includes(subsidyQuery.toLowerCase())
                    );
                    setSelectedSubsidyIndex(matchIdx > -1 ? matchIdx : 0);
                  }}
                  className="bg-[#E8A020] hover:bg-[#cf8e18] text-emerald-950 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Find
                </button>
              </div>
            </div>

            {/* Selection display */}
            <div className="mt-5 bg-emerald-900/50 border border-emerald-800 p-4 rounded-lg min-h-[90px]">
              {selectedSubsidyIndex !== null ? (
                <div>
                  <div className="text-xs font-bold text-white leading-normal">
                    {SUBSIDY_INFO[selectedSubsidyIndex].schemeName}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-emerald-300">Subsidy Value</div>
                      <div className="text-sm font-black text-[#E8A020]">{SUBSIDY_INFO[selectedSubsidyIndex].subsidyAmount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-emerald-300">Partner Channel</div>
                      <div className="text-xs font-medium text-white">{SUBSIDY_INFO[selectedSubsidyIndex].authorizedProvider}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-emerald-300 flex items-center justify-center h-full italic">
                  Key in "Drip" or "Organic" above to extract matching schemes
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-900 flex justify-between items-center bg-emerald-900/40 p-3 rounded-lg">
            <div className="text-[11px] text-emerald-200">
              Need assistance? Book IGO expert consultation
            </div>
            <button
              onClick={() => {
                window.open(`https://wa.me/917397785803?text=Hello%20IGO%20Agri%20Market,%20I%20want%20to%20apply%20for%20Govt%20Subsidy%20schemes%20under%20PMKSY`);
              }}
              className="text-xs hover:text-white text-[#E8A020] underline font-bold"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp Ordering Strip */}
      <section className="bg-emerald-900 text-white py-6 border-b border-[#248F4E] select-none shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg animate-bounce">
              💬
            </div>
            <div>
              <h5 className="font-display font-semibold text-white text-sm sm:text-base leading-none">
                {lang === 'en' ? 'Tired of Online Checkouts? Order directly with WhatsApp!' : 'தட்டச்சு செய்ய வேண்டுமா? நேரடி வாட்ஸ்அப் ஆர்டர்!'}
              </h5>
              <p className="text-xs text-emerald-200 mt-1">
                Just send your crop requirements snapshot to <strong className="text-white">+91 7397785803</strong>. Instant delivery!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.open(`https://wa.me/917397785803?text=Hello%20IGO%20Agri%20Market,%20I%20want%20to%20order%20seeds%20and%20fertilizer%20crops%20solutions%20to%20my%20address.`);
            }}
            className="bg-[#E8A020] hover:bg-[#cf8e18] text-emerald-950 text-xs font-extrabold px-6 py-3 rounded-lg shadow hover:-translate-y-0.5 transition shrink-0 select-none cursor-pointer"
          >
            ORDER VIA WHATSAPP
          </button>
        </div>
      </section>

      {/* Footer view */}
      <footer className="bg-emerald-950 text-emerald-100 py-12 border-t border-emerald-900 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 select-none">
              <div className="h-8 w-8 bg-[#E8A020] text-emerald-950 font-black rounded-lg flex items-center justify-center text-lg">I</div>
              <span className="font-display font-extrabold text-white text-base tracking-widest">{t.logoText}</span>
            </div>
            <p className="text-xs text-emerald-300 leading-relaxed">
              India's central agri-conglomerate gateway of 27 brands, direct factory logistical delivery and government certified agritechs.
            </p>
            <p className="text-[10px] text-emerald-400 mt-4">
              © 2026 IGO Group of Companies. All Rights Reserved.
            </p>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Corporate Headquarters
            </h6>
            <div className="space-y-3 text-xs text-emerald-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#E8A020] shrink-0 mt-0.5" />
                <span>{t.footerAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-[#E8A020]" />
                <span>+91 {t.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#E8A020]" />
                <span>{t.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Featured 27 Brands
            </h6>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-400">
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('IGO Precision Farming')}>IGO Precision Farming</span>
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('IGO Farm Automation')}>IGO Farm Automation</span>
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('IGO Protein Cuts')}>IGO Protein Cuts</span>
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('IGO Bio Solutions')}>IGO Bio Solutions</span>
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('IGO Seeds')}>IGO Seeds</span>
              <span className="hover:text-white cursor-pointer" onClick={() => handleBrandPillClick('Farmers Factory')}>Farmers Factory</span>
            </div>
          </div>

          <div>
            <h6 className="font-display font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Disclaimer & License
            </h6>
            <p className="text-[11px] text-emerald-400 leading-relaxed">
              Agri-input licenses issued by Chennai Directorate of Agriculture. Usage of chemical pesticides is governed under the Insecticide Rules, 1971. Read directions before seeding or spraying.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function filteredProductCount(all: Product[], categoryName: string): number {
  return all.filter(p => p.category === categoryName).length;
}
