import { useState, useEffect } from 'react';
import {
  Search,
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
  Percent,
  Carrot,
  Droplets,
  Zap,
  Tag,
  Wheat,
  Home,
  TreePine,
  Shovel,
  Package,
  FlaskConical,
  Wrench,
  Star,
  BadgeCheck,
  RefreshCw,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import { Product, Category, Brand } from '../types';
import { SEED_CATEGORIES, SEED_BRANDS, CROP_KITS, SUBSIDY_INFO, SEED_POSTS } from '../seedData';
import { translations, LanguageDict } from '../translation';
import { getBanners, getHomeOverrides, getComplexOverrides } from '../siteConfig';
import { detectLocation, getSavedLocation } from '../storeData';
import { FarmStories, LiveTrialFields, IgoEcosystemCarousel } from './HomeAdaptedFeatures';

// Extended items for categories
// Maps the real product catalog's categories (sourced from Crop Care, Farmer Factory
// and Nursery image libraries — see realCatalogData.generated.ts) to nav/hero styling.
const CATEGORY_MAP: Record<string, any> = {
  'greenhouse-polyhouse': { icon: Home, text: 'Greenhouse & Polyhouse', count: '32 Components', desc: 'Complete polyhouse build kit - GI structure pipes, shade nets, foundation & Jain drip irrigation', bg: 'bg-teal-50 text-teal-700', images: [
    '/catalog/irrigation-systems/water-pipes.webp',
    '/catalog/nursery-essentials/shade-net.jpg',
    '/catalog/irrigation-systems/drip-irrigation.webp'
  ] },
  'seeds-saplings': { icon: Sprout, text: 'Seeds & Saplings', count: '70+ Varieties', desc: 'Field, vegetable, fruit & flower seeds — certified and germination-tested', bg: 'bg-emerald-50 text-emerald-700', images: [
    '/catalog/crop-care/Field%20Seeds/Groundnut.webp',
    '/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp',
    '/catalog/crop-care/Field%20Seeds/Paddy.webp',
    '/catalog/crop-care/Field%20Seeds/Wheat%20Seed.webp'
  ] },
  'fertilizers': { icon: Leaf, text: 'Fertilizers', count: '110+ Products', desc: 'Chemical, organic, liquid & micronutrient feeds for every crop stage', bg: 'bg-green-50 text-green-700', images: [
    '/catalog/crop-care/Chemical%20Fertilizers/Ammonium%20Nitrate.webp',
    '/catalog/crop-care/Chemical%20Fertilizers/Ammonium%20Sulphate.webp',
    '/catalog/crop-care/Chemical%20Fertilizers/Calcium%20Ammonium%20Nitrate%20(CAN).webp',
    '/catalog/crop-care/Chemical%20Fertilizers/DAP%20(Di-Ammonium%20Phosphate).webp'
  ] },
  'bioproducts': { icon: Activity, text: 'Bioproducts', count: 'Organic Range', desc: 'Compost, vermicompost & natural soil conditioners', bg: 'bg-blue-50 text-blue-700', images: [
    '/catalog/crop-care/Organic%20Fertilizers/Bio%20Composer.webp',
    '/catalog/crop-care/Organic%20Fertilizers/CoCo%20Peat.webp',
    '/catalog/crop-care/Organic%20Fertilizers/Cow%20Dung.webp',
    '/catalog/crop-care/Organic%20Fertilizers/Kitchen%20Waste%20Compost.webp'
  ] },
  'fresh-farm-produce': { icon: Carrot, text: 'Fresh Farm Produce', count: 'Same-Day Dispatch', desc: 'Vine-ripened veggies & fruits picked fresh from Farmers Factory partner farms', bg: 'bg-rose-50 text-rose-700', images: [
    '/catalog/farmer-factory-fruits/BananaElakki.jfif',
    '/catalog/farmer-factory-fruits/BananaKarpooravalli.jfif',
    '/catalog/farmer-factory-fruits/BananaNendhiram.jfif',
    '/catalog/farmer-factory-fruits/BananaPoovan.jfif'
  ] },
  'native-foods-millets': { icon: Wheat, text: 'Native Foods & Millets', count: 'Valluvam Range', desc: 'Millets, spices, dry fruits, cold-pressed oils, honey & jaggery — chemical-free', bg: 'bg-amber-50 text-amber-700', images: [
    '/catalog/farmer-factory-valluvam/BarnyardMillet.jpg',
    '/catalog/farmer-factory-valluvam/BrowntopMillet.jpg',
    '/catalog/farmer-factory-valluvam/Cardamom.jpg',
    '/catalog/farmer-factory-valluvam/CashewNutsWhole.jpg'
  ] },
  'indoor-plants': { icon: Home, text: 'Indoor Plants', count: 'Greenhouse Grown', desc: 'Air-purifying houseplants delivered pot-ready from IGO Greenhouse', bg: 'bg-teal-50 text-teal-700', images: [
    '/catalog/nursery-indoor/AglaonemaHybridLipstickwithWhitePot.webp',
    '/catalog/nursery-indoor/Aloe.webp',
    '/catalog/nursery-indoor/Anthurium.jpg',
    '/catalog/nursery-indoor/Areca_Palm.webp'
  ] },
  'outdoor-plants-trees': { icon: TreePine, text: 'Outdoor Plants & Trees', count: 'Field-Ready Saplings', desc: 'Hardy saplings and ornamentals for gardens, avenues & farm borders', bg: 'bg-lime-50 text-lime-700', images: [
    '/catalog/nursery-outdoor/AONAL.jpg',
    '/catalog/nursery-outdoor/ARJUN.jpg',
    '/catalog/nursery-outdoor/Adenium.jpg',
    '/catalog/nursery-outdoor/BANYAN.jfif'
  ] },
  'nursery-garden-essentials': { icon: Shovel, text: 'Nursery & Garden Essentials', count: 'Tools & Accessories', desc: 'Pots, trays, tools and accessories for nursery & home gardening', bg: 'bg-stone-50 text-stone-700', images: [
    '/catalog/nursery-essentials/12pcs%20Plant%20Support%20Plant%20Stake%20Half%20Round%20Plant%20Support%20Ring%20Garden%20Flower%20Supp.jpg',
    '/catalog/nursery-essentials/1pc%20Eco-Friendly%20Biodegradable%20Grafting%20Tape%20Graft%20Membrane%20Gardening%20Bind%20Belt%20Plant%20Grafting.jpg',
    '/catalog/nursery-essentials/9%20DIY%20Vertical%20Gardens%20for%20Better%20Herbs.jpg',
    '/catalog/nursery-essentials/96%20Pcs%204%20Inch%20Round%20Nursery%20Pots%20And%208%20Pcs%2012%20Cell%20Plant%20Starter%20Trays%20Thick%20Stu.jpg'
  ] },
  // ── New categories (June 2026 audit) — images via Unsplash CDN ──
  'irrigation-systems': {
    icon: Droplets,
    text: 'Irrigation Systems',
    count: '24+ Products',
    desc: 'Drip kits, sprinkler systems, micro-irrigation components & fittings for every farm size',
    bg: 'bg-cyan-50 text-cyan-700',
    badge: 'NEW',
    badgeColor: 'bg-cyan-500',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&q=75&fit=crop'
    ]
  },
  'organic-natural-farming': {
    icon: Leaf,
    text: 'Organic & Bio Inputs',
    count: '32+ Products',
    desc: 'Vermicompost, neem oil, pheromone traps, Trichoderma, bio-inoculants — NPOP certified',
    bg: 'bg-green-50 text-green-800',
    badge: 'HOT',
    badgeColor: 'bg-green-600',
    images: [
      'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1585454028886-1a1c9a3bc3d2?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=75&fit=crop'
    ]
  },
  'post-harvest-storage': {
    icon: Package,
    text: 'Post-Harvest & Storage',
    count: '18+ Products',
    desc: 'Hermetic grain bags, packing crates, post-harvest treatments & grading supplies',
    bg: 'bg-orange-50 text-orange-700',
    badge: 'NEW',
    badgeColor: 'bg-orange-500',
    images: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1603048588665-791ca98d4e9f?w=400&q=75&fit=crop'
    ]
  },
  'animal-husbandry': {
    icon: Beef,
    text: 'Animal Husbandry',
    count: '40+ Products',
    desc: 'Poultry, cattle, goat & aquaculture feed, OTC vet supplements, silage additives',
    bg: 'bg-amber-50 text-amber-700',
    badge: 'NEW',
    badgeColor: 'bg-amber-500',
    images: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=75&fit=crop'
    ]
  },
  'soil-health': {
    icon: FlaskConical,
    text: 'Soil Health',
    count: '22+ Products',
    desc: 'DIY soil test kits, gypsum, lime, bio-inoculants — Rhizobium, PSB, Azospirillum',
    bg: 'bg-yellow-50 text-yellow-700',
    badge: 'NEW',
    badgeColor: 'bg-yellow-500',
    images: [
      'https://images.unsplash.com/photo-1585435421671-0c16764628f0?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1591086429011-4b1d8571ca2e?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=75&fit=crop'
    ]
  },
  'farm-tools-implements': {
    icon: Wrench,
    text: 'Farm Tools & Implements',
    count: '35+ Products',
    desc: 'Power weeders, seed drills, sprayers, harvesting tools & manual farm implements',
    bg: 'bg-slate-50 text-slate-700',
    badge: 'NEW',
    badgeColor: 'bg-slate-500',
    images: [
      'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&q=75&fit=crop',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&q=75&fit=crop'
    ]
  }
};

// Quick search suggestion chips
const QUICK_SEARCH_CHIPS: { en: string; ta: string }[] = [
  { en: 'Tomato seeds', ta: 'தக்காளி விதைகள்' },
  { en: 'NPK fertilizer', ta: 'NPK உரம்' },
  { en: 'Neem oil', ta: 'வேப்ப எண்ணெய்' },
  { en: 'Drip irrigation', ta: 'சொட்டு நீர்ப்பாசனம்' },
  { en: 'Fresh vegetables', ta: 'புதிய காய்கறிகள்' },
  { en: 'Vermicompost', ta: 'மண்புழு உரம்' },
  { en: 'Poultry feed', ta: 'கோழி தீவனம்' },
  { en: 'Organic compost', ta: 'இயற்கை உரம்' }
];

// Trust / Why-Choose-Us data
const TRUST_POINTS = [
  { icon: BadgeCheck, title: 'Govt. Licensed Inputs', desc: 'All chemical inputs CIB&RC registered. Organic products NPOP certified.', color: 'text-emerald-600' },
  { icon: Truck, title: 'Express Farm Delivery', desc: '90-min express delivery to select Chennai/Chengalpattu pin codes. Pan-India shipping.', color: 'text-blue-600' },
  { icon: RefreshCw, title: 'Easy Returns & Support', desc: '7-day hassle-free return policy. WhatsApp support 7 days a week.', color: 'text-purple-600' },
  { icon: ShieldCheck, title: '100% Genuine Products', desc: 'Direct brand partnerships. Zero counterfeit products — verified batch numbers.', color: 'text-amber-600' },
  { icon: Users, title: '5,000+ Farmer Trust', desc: 'Serving Tamil Nadu\'s farming community since 2019. 4.8★ average rating.', color: 'text-rose-600' },
  { icon: Star, title: 'Agronomy Expert Help', desc: 'Free crop advisory with every purchase above ₹1,000 via WhatsApp.', color: 'text-cyan-600' }
];

const ADDITIONAL_NAV = [
  { text: 'Farm Loans', slug: 'farm-loans', icon: FileText, desc: 'Government schemes', bg: 'bg-amber-50 text-amber-700' },
  { text: 'IGO Academy', slug: 'igo-academy', icon: GraduationCap, desc: 'Training classes', bg: 'bg-teal-50 text-teal-700' }
];

// ── Live Commodity Price Ticker data (FarmerShrine-inspired) ───────
const COMMODITY_TICKERS = [
  { emoji: '🌾', name: 'Paddy (Sona Masuri)', price: '₹2,180/qtl', change: '+1.2%', up: true },
  { emoji: '🌽', name: 'Maize', price: '₹1,820/qtl', change: '-0.5%', up: false },
  { emoji: '🥜', name: 'Groundnut', price: '₹5,640/qtl', change: '+2.1%', up: true },
  { emoji: '🫘', name: 'Black Gram (Urad)', price: '₹8,900/qtl', change: '+0.8%', up: true },
  { emoji: '🧅', name: 'Onion (Nashik)', price: '₹1,250/qtl', change: '-3.2%', up: false },
  { emoji: '🍅', name: 'Tomato', price: '₹890/qtl', change: '+5.4%', up: true },
  { emoji: '🌶️', name: 'Green Chilli', price: '₹2,400/qtl', change: '+1.9%', up: true },
  { emoji: '🥥', name: 'Coconut', price: '₹180/unit', change: '-0.3%', up: false },
  { emoji: '🫙', name: 'Coriander Seed', price: '₹6,800/qtl', change: '+3.7%', up: true },
  { emoji: '🧄', name: 'Garlic', price: '₹3,200/qtl', change: '-1.1%', up: false },
  { emoji: '🌿', name: 'Turmeric', price: '₹12,400/qtl', change: '+4.3%', up: true },
  { emoji: '🫚', name: 'Sesame', price: '₹14,200/qtl', change: '+0.6%', up: true },
];

// ── Market Intelligence Prices (AGRA.global style) ────────────────
const MARKET_PRICES = [
  { commodity: 'Paddy (Fine)', price: '₹2,180', msp: '₹2,183', trend: '+1.2%', signal: 'BUY', up: true },
  { commodity: 'Groundnut', price: '₹5,640', msp: '₹5,850', trend: '+2.1%', signal: 'HOLD', up: true },
  { commodity: 'Maize', price: '₹1,820', msp: '₹2,090', trend: '-0.5%', signal: 'WATCH', up: false },
  { commodity: 'Black Gram', price: '₹8,900', msp: '₹7,400', trend: '+0.8%', signal: 'SELL', up: true },
  { commodity: 'Turmeric', price: '₹12,400', msp: '—', trend: '+4.3%', signal: 'BUY', up: true },
  { commodity: 'Tomato', price: '₹890', msp: '—', trend: '+5.4%', signal: 'HOT', up: true },
];

// ── Upcoming Agri Events (KisaanTrade-inspired) ───────────────────
const AGRI_EVENTS = [
  { name: 'AGRI INTEX 2026', city: 'Coimbatore', date: 'Jul 9–11, 2026', type: 'Trade Expo', emoji: '🏭', color: 'bg-emerald-50 border-emerald-200' },
  { name: 'India Horti Expo 2026', city: 'Hosur, TN', date: 'Jun 19–20, 2026', type: 'Horticulture', emoji: '🌸', color: 'bg-pink-50 border-pink-200' },
  { name: 'UNITED AGRITECH 2026', city: 'Madurai, TN', date: 'Sep 18–19, 2026', type: 'AgriTech', emoji: '🤖', color: 'bg-cyan-50 border-cyan-200' },
  { name: 'CII AgroTech India 2026', city: 'Chandigarh', date: 'Nov 20–23, 2026', type: 'National', emoji: '🌾', color: 'bg-amber-50 border-amber-200' },
  { name: 'Kisan Agri & Agro Tech', city: 'Vijayawada', date: 'Jun 26–27, 2026', type: 'Farmer Meet', emoji: '🚜', color: 'bg-blue-50 border-blue-200' },
  { name: 'Agri Asia 2026', city: 'Gandhinagar, GJ', date: 'Sep 11–13, 2026', type: 'International', emoji: '🌏', color: 'bg-violet-50 border-violet-200' },
];

interface HomeComponentProps {
  lang: 'en' | 'ta';
  products: Product[];
  categories: Category[];
  setCurrentPage: (p: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  addToCart: (p: Product) => void;
}

export default function HomeComponent({
  lang,
  products,
  categories,
  searchQuery,
  setSearchQuery,
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
    const list = [...products].sort((a, b) => b.reviewCount - a.reviewCount); // Popularity sorting
    if (activeTab === 'All') return list.slice(0, 8);
    if (activeTab === 'Seeds') return list.filter(p => normalizeCategory(p.category).includes('seed')).slice(0, 8);
    if (activeTab === 'Fertilizers') return list.filter(p => normalizeCategory(p.category).includes('fertilizer')).slice(0, 8);
    if (activeTab === 'Pesticides') return list.filter(p => normalizeCategory(p.category).includes('crop') || normalizeCategory(p.problemFilter || '').includes('pest')).slice(0, 8);
    if (activeTab === 'Tools') return list.filter(p => normalizeCategory(p.category).includes('tool') || normalizeCategory(p.category).includes('implement')).slice(0, 8);
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
    setSelectedCategory(`brand:${brandName}`);
    setCurrentPage('category');
  };

  const normalizeCategory = (value: string) => value.toLowerCase().replace(/ & /g, ' ').replace(/-/g, ' ').trim();

  const [heroSlide, setHeroSlide] = useState(0);
  const [cxLoc, setCxLoc] = useState(() => getSavedLocation());
  const [locBusy, setLocBusy] = useState(false);
  const handleHeroDetectLoc = async () => {
    if (locBusy) return;
    setLocBusy(true);
    try { setCxLoc(await detectLocation()); }
    catch { alert('Please allow location access to set your delivery area.'); }
    finally { setLocBusy(false); }
  };

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 12), 4000);
    return () => clearInterval(timer);
  }, []);



  // Category rail — built from the REAL catalog so every tile has a real image
  // and only categories that actually have products are shown (no empty circles).
  const CAT_ORDER = [
    'Vegetables', 'Fruits', 'Valluvam Products',
    'Vegetable Seeds', 'Fruit Seeds', 'Field Seeds', 'Flower Seeds',
    'Liquid Fertilizers', 'Powder Fertilizers', 'Chemical Fertilizers', 'Organic Fertilizers',
    'Indoor Plants', 'Outdoor Plants & Trees',
  ];
  const ALL_CATS: [string, { text: string; images: string[] }][] = CAT_ORDER
    .filter((name) => products.some((p) => p.category === name))
    .map((name) => {
      const rep = products.find((p) => p.category === name && p.images && p.images[0]);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return [slug, { text: name, images: rep ? [rep.images[0]] : [] }];
    });

  const DEFAULT_HERO_SLIDES = [
    {
      img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=90&fit=crop',
      badge: 'UPTO 40% OFF',
      title: lang === 'en' ? 'Everything Your Farm Needs. Delivered Fast.' : 'உங்கள் பண்ணைக்கு தேவையான அனைத்தும். வேகமாக டெலிவரி.',
      sub: lang === 'en' ? 'Certified seeds, fertilizers, crop protection & equipment — 835+ products, same-day dispatch from regional hubs' : '835+ விவசாயப் பொருட்கள் · அதே நாள் அனுப்புதல் · சான்றளிக்கப்பட்ட தரம்',
      btn: 'Shop Best Sellers', btnAction: 'seeds-saplings', color: 'from-emerald-950/85 via-emerald-900/50 to-transparent'
    },
    {
      img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=90&fit=crop',
      badge: 'GOVT SUBSIDY UPTO 90%',
      title: lang === 'en' ? 'Smart Drip & Sprinkler Irrigation' : 'சொட்டு நீர்ப்பாசன கருவிகள்',
      sub: lang === 'en' ? 'Up to 90% govt subsidy support · kits for every farm size · free installation guidance from our experts' : 'அரசு மானியம் · அனைத்து பண்ணை அளவுகளும் · இலவச நிறுவல் வழிகாட்டுதல்',
      btn: 'Explore Irrigation', btnAction: 'irrigation-systems', color: 'from-cyan-950/85 via-cyan-900/50 to-transparent'
    },
    {
      img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=90&fit=crop',
      badge: 'UPTO 30% OFF',
      title: lang === 'en' ? 'Grow Naturally. Earn Premium Prices.' : 'இயற்கையாக வளர்க்கவும். உயர்ந்த விலை பெறவும்.',
      sub: lang === 'en' ? 'Vermicompost, neem oil, Trichoderma, bio-stimulants & pheromone traps — the complete organic toolkit' : 'மண்புழு உரம் · வேப்ப எண்ணெய் · உயிரியல் உரங்கள் · முழுமையான இயற்கை தொகுப்பு',
      btn: 'Shop Organic Range', btnAction: 'organic-natural-farming', color: 'from-green-950/85 via-green-900/50 to-transparent'
    },
    {
      img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1920&q=90&fit=crop',
      badge: 'UPTO 25% OFF',
      title: lang === 'en' ? 'Professional Farm Tools & Machinery' : 'விவசாய கருவிகள் & இயந்திரங்கள்',
      sub: lang === 'en' ? 'Power weeders, seed drills, battery sprayers & precision hand tools — built for Indian field conditions' : 'யந்திர களை கருவிகள் · விதை பயிர்கருவிகள் · பேட்டரி தெளிப்பான்கள்',
      btn: 'Shop Equipment', btnAction: 'farm-tools-implements', color: 'from-amber-950/85 via-amber-900/50 to-transparent'
    },
  ];

  // Admin-managed hero banners (Admin -> Content) override the defaults
  const adminBanners = getBanners();
  const GRADIENTS = ['from-emerald-950/80 to-emerald-800/40', 'from-cyan-950/80 to-cyan-800/40', 'from-amber-950/80 to-amber-800/40'];
  const HERO_SLIDES = adminBanners.length > 0
    ? adminBanners.map((b, i) => ({
        img: b.img,
        badge: b.badge || 'IGO Agri Mart',
        title: b.title,
        sub: b.sub || '',
        btn: b.btn || 'Shop Now',
        btnAction: b.btnAction || 'seeds-saplings',
        color: GRADIENTS[i % GRADIENTS.length],
      }))
    : DEFAULT_HERO_SLIDES;
  const activeSlide = heroSlide % HERO_SLIDES.length;

  const NATIONAL_FEATURES = [
    {
      icon: Truck,
      title: 'Pan-India Dispatch',
      detail: 'Shipping from regional warehouses to every major pincode in India.',
      color: 'bg-emerald-50 text-emerald-800'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Agri Products',
      detail: 'Seeds, fertilizers, tools and organic inputs from trusted farming brands.',
      color: 'bg-slate-50 text-slate-800'
    },
    {
      icon: Sparkles,
      title: 'Instant Reorder',
      detail: 'Repeat farm essentials with one tap and maintain crop schedules.',
      color: 'bg-amber-50 text-amber-800'
    }
  ];

  const homeOverrides = getHomeOverrides();
  const complexOverrides = getComplexOverrides();

  const popularBrands = complexOverrides.brands.length > 0 ? complexOverrides.brands : SEED_BRANDS.slice(0, 8);

  // Shop-by-Crop tiles built from REAL catalog images (no external/broken images).
  const CROP_ITEMS = complexOverrides.crops.length > 0 ? complexOverrides.crops : (() => {
    const list: { name: string; img: string; slug: string }[] = [];
    const pushFrom = (cat: string, slug: string, max: number) => {
      for (const p of products.filter((pp) => pp.category === cat && pp.images && pp.images[0])) {
        if (list.filter((x) => x.slug === slug).length >= max) break;
        if (!list.some((x) => x.name === p.displayName)) {
          list.push({ name: p.displayName || p.name, img: p.images[0], slug });
        }
      }
    };
    pushFrom('Vegetables', 'vegetables', 8);
    pushFrom('Fruits', 'fruits', 6);
    return list.slice(0, 14);
  })();

  const getOverrideProducts = (sectionName: string, defaultProducts: Product[]) => {
    const overrideIds = homeOverrides[sectionName];
    if (overrideIds && overrideIds.length > 0) {
      const selected = overrideIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
      if (selected.length > 0) return selected;
    }
    return defaultProducts;
  };

  const todaysOffers = getOverrideProducts("Today's Selection", [...products].sort((a, b) => {
    const da = a.mrp > 0 ? Math.round((1 - a.price / a.mrp) * 100) : 0;
    const db = b.mrp > 0 ? Math.round((1 - b.price / b.mrp) * 100) : 0;
    return db - da;
  }).slice(0, 12));

  const bestSellers = getOverrideProducts("Best Selling", [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 12));
  const trendingProducts = getOverrideProducts("Trending Products", [...products].filter(p => p.rating >= 4.2).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 12));
  const comboDeals = complexOverrides.kits.length > 0 ? complexOverrides.kits : CROP_KITS.slice(0, 3);

  const renderProductCard = (p: typeof products[0]) => {
    const disc = p.mrp > 0 ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    const savings = p.mrp > p.price ? p.mrp - p.price : 0;
    const isHighDemand = p.reviewCount > 300;
    return (
      <div
        className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex-shrink-0 w-[155px] sm:w-[185px] md:w-[200px]"
        onClick={() => { setSelectedProduct(p); setCurrentPage('product'); }}
      >
        <div className="relative bg-slate-50 h-[125px] sm:h-[145px] md:h-[160px]">
          <img
            src={p.images?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=70&fit=crop'}
            alt={p.name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
          {p.stock === 0 ? (
            <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full">OUT OF STOCK</span>
            </span>
          ) : p.stock < 20 ? (
            <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">
              Only {p.stock} left
            </span>
          ) : null}
          {disc > 0 && (
            <span className="absolute top-2 left-2 bg-[#E8A020] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
              {disc}% OFF
            </span>
          )}
          <button
            className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition"
            onClick={e => { e.stopPropagation(); }}
          >♡</button>
          {p.rating > 0 && (
            <span className="absolute bottom-2 left-2 bg-[#1B6B3A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {p.rating.toFixed(1)} ★ | {p.reviewCount}
            </span>
          )}
          {p.stock > 0 && (
            <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest bg-white/90 text-[#1B6B3A] border border-emerald-100 rounded-full px-2 py-0.5">
              Fast Dispatch
            </span>
          )}
          {isHighDemand && (
            <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
              🔥 High Demand
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="text-xs font-bold text-slate-800 leading-tight line-clamp-2" style={{ minHeight: '2.5rem' }}>
            {(p.displayName || p.name).replace(/^IGO AgriMart\s+/i, '')}
          </div>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="font-black text-base text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
            {p.mrp > p.price && (
              <span className="text-[11px] text-slate-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
          {savings > 0 && (
            <div className="text-[11px] text-green-600 font-semibold mt-0.5">
              Save ₹{savings.toLocaleString('en-IN')}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="font-medium">Size</span>
            <select
              className="border border-slate-200 rounded px-1.5 py-0.5 text-[11px] flex-1 bg-white cursor-pointer"
              onClick={e => e.stopPropagation()}
            >
              <option>{p.unit || '1 unit'}</option>
            </select>
          </div>
          <button
            className="mt-2 w-full bg-[#1B6B3A] hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition transform active:scale-95 hover:scale-[1.02]"
            onClick={e => { e.stopPropagation(); addToCart(p); }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, sub, onViewAll }: { title: string; sub?: string; onViewAll: () => void }) => (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="font-display font-black text-slate-800 text-xl sm:text-2xl leading-tight">{title}</h2>
        {sub && <p className="text-slate-500 text-sm mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={onViewAll}
        className="text-[#1B6B3A] hover:text-emerald-700 text-sm font-semibold border border-[#1B6B3A]/30 px-3 py-1 rounded-lg hover:bg-emerald-50 transition shrink-0 ml-4 mt-1"
      >
        View All
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page nav is now global in Header.tsx (shown on every page). */}

      {/* ── HERO BAND (Zepto/Blinkit-style q-commerce) ────────────────── */}
      <div className="relative overflow-hidden bg-[#0B3D22]">
        <img
          src="/images/home_hero_bg.png"
          alt="Modern Agricultural Farm"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/90" />
        <div className="absolute -top-24 -right-24 h-80 w-80 bg-lime-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-96 w-96 bg-emerald-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-10 sm:pb-14 text-center">
          {/* Delivery promise pill */}
          <span className="inline-flex items-center gap-1.5 bg-lime-300 text-emerald-950 text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-lime-400/30 mb-5 hero-content-in">
            <Zap className="h-3.5 w-3.5" /> Same-day dispatch · Pan-India delivery
          </span>

          <h1 className="font-display font-black text-white text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] tracking-tight mb-7 sm:mb-9 max-w-3xl mx-auto">
            Fresh produce, seeds, plants & farm inputs<br className="hidden sm:block" />
            {' '}delivered across Tamil Nadu. <span className="text-lime-300">Order in minutes.</span>
          </h1>

          {/* Swiggy-style location + search combo bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { setSelectedCategory(null); setCurrentPage('category'); } }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-stretch bg-white rounded-2xl shadow-2xl shadow-emerald-950/40 p-1.5 sm:p-2 gap-1.5">
              <button
                type="button"
                onClick={handleHeroDetectLoc}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 rounded-xl hover:bg-slate-50 transition border-r border-slate-100 shrink-0 max-w-[96px] sm:max-w-[190px]"
                title="Detect my location"
              >
                <MapPin className="h-4 w-4 text-[#1B6B3A] shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">
                  {locBusy ? 'Detecting...' : cxLoc ? cxLoc.city : 'Set location'}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 rotate-90 shrink-0" />
              </button>
              <div className="flex items-center flex-1 min-w-0">
                <Search className="h-5 w-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for "tomato seeds", "drip kit", "neem oil"'
                  className="flex-1 bg-transparent px-2.5 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none min-w-0"
                />
              </div>
              <button type="submit"
                className="bg-[#1B6B3A] hover:bg-emerald-950 text-white font-black text-xs sm:text-sm px-5 sm:px-7 rounded-xl transition shrink-0">
                Search
              </button>
            </div>
          </form>

          {/* Quick category chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
              { label: '🥬 Vegetables', cat: 'vegetables' },
              { label: '🍎 Fruits', cat: 'fruits' },
              { label: '🌱 Vegetable Seeds', cat: 'vegetable-seeds' },
              { label: '🍯 Valluvam', cat: 'valluvam-products' },
              { label: '🪴 Plants', cat: 'indoor-plants' },
            ].map((c) => (
              <button key={c.cat} onClick={() => handleCategoryClick(c.cat)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-full transition">
                {c.label}
              </button>
            ))}
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8 mt-7 text-emerald-100/80 text-[11px] sm:text-xs font-bold">
            <span className="flex items-center gap-1.5"><Package className="h-4 w-4 text-lime-300" /> Farm-fresh produce</span>
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-lime-300" /> 100% genuine</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-lime-300" /> Pan-India delivery</span>
          </div>
        </div>
      </div>

      {/* ── USP STRIP (assurance cards) ─────────────── */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Truck, t: 'Free Delivery', d: 'On orders above ₹1,300', tint: 'bg-emerald-50 text-emerald-700' },
            { icon: ShieldCheck, t: '100% Genuine', d: 'Direct from brands', tint: 'bg-blue-50 text-blue-700' },
            { icon: RefreshCw, t: 'Easy Returns', d: '7-day return policy', tint: 'bg-amber-50 text-amber-700' },
            { icon: HeadphonesIcon, t: 'Expert Help', d: 'Free crop advisory', tint: 'bg-rose-50 text-rose-700' },
          ].map((u, i) => (
            <div key={i} className="card-lift bg-white border border-slate-200 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
              <div className={'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ' + u.tint}>
                <u.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800 leading-tight">{u.t}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{u.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES (Swiggy "best options" style — floating images) ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">
            Shop our best agri categories
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              aria-label="Scroll categories left"
              onClick={() => document.getElementById('cat-rail')?.scrollBy({ left: -560, behavior: 'smooth' })}
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              aria-label="Scroll categories right"
              onClick={() => document.getElementById('cat-rail')?.scrollBy({ left: 560, behavior: 'smooth' })}
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          id="cat-rail"
          className="no-scrollbar grid grid-rows-2 grid-flow-col auto-cols-[120px] sm:auto-cols-[150px] lg:auto-cols-[170px] gap-x-5 gap-y-7 overflow-x-auto pb-2 snap-x"
          style={{ scrollbarWidth: 'none' }}
        >
          {ALL_CATS.map(([id, cat]) => (
            <button
              key={id}
              onClick={() => handleCategoryClick(id)}
              className="snap-start flex flex-col items-center gap-2.5 group cursor-pointer"
            >
              <div className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <img
                  src={cat.images?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=240&q=75&fit=crop'}
                  alt={cat.text}
                  className="w-full h-full object-cover rounded-full shadow-[0_18px_28px_-16px_rgba(15,23,42,0.45)]"
                  loading="lazy"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 text-center leading-tight group-hover:text-[#1B6B3A]">
                {cat.text}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── BEST SELLING (BigHaat-style) ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Best Selling"
          sub="Best prices available today."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {bestSellers.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>

      {/* ── FRESHLY ARRIVED (TODAY'S SELECTION) ──────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title={"Freshly Arrived / Today's Selection ⚡"}
          sub="Best prices available today on fresh harvest."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none h-scroll">
          {todaysOffers.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>

      {/* ── COMBO KITS & DEALS SECTION ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Combo Kits & Deals"
          sub="Pre-packed agri kits for fast setup and higher crop returns."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comboDeals.map((kit) => (
            <div key={kit.id} className="border border-slate-200 rounded-3xl p-5 hover:shadow-lg transition bg-slate-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-black text-slate-900 text-lg leading-tight">{kit.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-snug">{kit.description}</p>
                </div>
                <span className="text-xs uppercase font-black tracking-[0.18em] bg-[#E8A020] text-emerald-950 px-2 py-1 rounded-full">Kit</span>
              </div>
              <div className="mt-4 text-slate-500 text-[11px] space-y-2">
                {kit.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1B6B3A]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Deal Price</div>
                  <div className="font-display font-black text-xl text-slate-900">₹{kit.price.toLocaleString('en-IN')}</div>
                </div>
                <button
                  onClick={() => { alert(`Add ${kit.name} combo to cart from the category page.`); setCurrentPage('category'); }}
                  className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition"
                >
                  View Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CROP (BigHaat-style circular) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader
          title={'Shop By Crop 🌾'}
          sub="Get solutions customised for your crops."
          onViewAll={() => { setSelectedCategory('seeds-saplings'); setCurrentPage('category'); }}
        />
        <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 scrollbar-none">
          {CROP_ITEMS.map((crop, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(crop.slug)}
              className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 group cursor-pointer"
            >
              <div className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-[#1B6B3A] group-hover:shadow-md transition-all bg-slate-100" style={{ width: '3.5rem', height: '3.5rem' }}>
                <img
                  src={crop.img}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 group-hover:text-[#1B6B3A] whitespace-nowrap">{crop.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── TOP AGRI BRANDS (Instamart-style brand picker) ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader
          title="Popular Agri Brands"
          sub="Trusted farm brands for seeds, crop care and organic inputs."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popularBrands.map((brand) => (
            <button
              key={brand.id || brand.name}
              onClick={() => handleBrandPillClick(brand.name)}
              className="rounded-2xl border border-slate-200 p-4 text-left hover:border-[#1B6B3A] hover:bg-emerald-50 transition"
            >
              <div className="text-[11px] uppercase text-slate-500 tracking-[0.15em] font-bold">Brand</div>
              <div className="mt-2 font-display font-black text-slate-900 text-sm leading-tight">{brand.name}</div>
              <div className="mt-2 text-[11px] text-slate-500">Shop quality agronomy essentials</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── SEEDS SECTION ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <SectionHeader
          title="Seeds 🌱"
          sub="Quality Seeds, Proven Results"
          onViewAll={() => handleCategoryClick('seeds-saplings')}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {getOverrideProducts('Seeds', products.filter(p => normalizeCategory(p.category) === 'seeds saplings')).slice(0, 10).map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
          {getOverrideProducts('Seeds', products.filter(p => normalizeCategory(p.category) === 'seeds saplings')).length === 0 &&
            products.slice(0, 10).map(p => renderProductCard(p))
          }
        </div>
      </section>

      {/* ── ORGANIC & BIO INPUTS SECTION ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <SectionHeader
          title="Organic & Bio Inputs ♻️"
          sub="Farm naturally. Grow abundantly."
          onViewAll={() => handleCategoryClick('organic-natural-farming')}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {getOverrideProducts('Organic & Bio Inputs', products.filter(p => normalizeCategory(p.category).includes('organic') || normalizeCategory(p.category).includes('bio') || normalizeCategory(p.category) === 'organic natural farming')).slice(0, 10).map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
          {getOverrideProducts('Organic & Bio Inputs', products.filter(p => normalizeCategory(p.category).includes('organic') || normalizeCategory(p.category).includes('bio') || normalizeCategory(p.category) === 'organic natural farming')).length === 0 &&
            products.slice(10, 20).map(p => renderProductCard(p))
          }
        </div>
      </section>

      {/* ── URBAN & BALCONY GARDENING SECTION ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-100">
        <SectionHeader
          title="Urban & Balcony Gardening 🪴"
          sub="Everything you need for your home garden oasis."
          onViewAll={() => handleCategoryClick('urban-balcony-gardening')}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {getOverrideProducts('Urban & Balcony Gardening', products.filter(p => normalizeCategory(p.category) === 'urban balcony gardening')).slice(0, 10).map((p) => (
            <div key={p.id} className="contents">{renderProductCard(p)}</div>
          ))}
          {getOverrideProducts('Urban & Balcony Gardening', products.filter(p => normalizeCategory(p.category) === 'urban balcony gardening')).length === 0 &&
            products.slice(20, 30).map(p => renderProductCard(p))
          }
        </div>
      </section>

      {/* ── ANIMAL HUSBANDRY SECTION ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <SectionHeader
          title="Animal Husbandry Essentials 🐄"
          sub="Stock the livestock and aquaculture supplies farmers trust."
          onViewAll={() => handleCategoryClick('animal-husbandry')}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {getOverrideProducts('Animal Husbandry Essentials', products.filter(p => normalizeCategory(p.category) === 'animal husbandry')).slice(0, 10).map((p) => (
            <div key={p.id} className="contents">{renderProductCard(p)}</div>
          ))}
          {getOverrideProducts('Animal Husbandry Essentials', products.filter(p => normalizeCategory(p.category) === 'animal husbandry')).length === 0 &&
            products.slice(0, 10).map(p => renderProductCard(p))
          }
        </div>
      </section>

      {/* ── PRECISION TOOLS & EQUIPMENTS SECTION ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <SectionHeader
          title="Precision Tools & Equipments 🚜"
          sub="High-grade sprayers, pruners, and farm automation gear."
          onViewAll={() => handleCategoryClick('precision-tools-equipments')}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {getOverrideProducts('Precision Tools & Equipments', products.filter(p => normalizeCategory(p.category) === 'precision tools equipments')).slice(0, 10).map((p) => (
            <div key={p.id} className="contents">{renderProductCard(p)}</div>
          ))}
          {getOverrideProducts('Precision Tools & Equipments', products.filter(p => normalizeCategory(p.category) === 'precision tools equipments')).length === 0 &&
            products.slice(30, 40).map(p => renderProductCard(p))
          }
        </div>
      </section>

      {/* ── TRENDING PRODUCTS (BigHaat-style) ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Trending Products 🔥"
          sub="Farmer favorites this week."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {trendingProducts.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>


      {/* ── LIVE COMMODITY PRICE TICKER (FarmerShrine-style) ───────────── */}
      <div className="bg-emerald-950 border-b border-emerald-900 overflow-hidden py-2.5">
        <div className="ticker-track flex items-center gap-10 w-max">
          {[...COMMODITY_TICKERS, ...COMMODITY_TICKERS].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-xs text-emerald-100 whitespace-nowrap shrink-0">
              <span>{t.emoji}</span>
              <span className="font-semibold">{t.name}</span>
              <span className="text-white font-black">{t.price}</span>
              <span className={t.up ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                {t.up ? '▲' : '▼'} {t.change}
              </span>
              <span className="text-emerald-700">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── AGRO DELIVERY BENEFITS (INSTAMART-STYLE) ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NATIONAL_FEATURES.map((item) => (
            <div key={item.title} className={`rounded-3xl border border-slate-200 p-5 flex items-start gap-4 ${item.color}`}>
              <div className="p-3 rounded-2xl bg-white shadow-sm">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-slate-900 text-sm">{item.title}</h3>
                <p className="text-[12px] text-slate-500 mt-2">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IGO WORKS ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Browse professional agri products',
              desc: 'Find inputs by crop, pest, livestock or farm process through curated categories.',
              icon: Truck
            },
            {
              title: 'Place secure orders instantly',
              desc: 'Checkout with transparent pricing, farm-grade quality, and fast dispatch options.',
              icon: ShieldCheck
            },
            {
              title: 'Receive support from agronomists',
              desc: 'Access expert product advice, delivery status and return support seamlessly.',
              icon: HeadphonesIcon
            }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center justify-center rounded-3xl bg-[#E8A020]/15 p-4 text-[#1B6B3A] mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SMART SEARCH AND QUICK ACTIONS ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1B6B3A]">
                Farm Marketplace
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 max-w-2xl leading-tight">
                Discover the right agri input, tool or livestock product for your farm.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl">
                Search IGO's professional catalog by crop, brand, or use case. Get instant results and delivery-friendly offers across India.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedCategory(null);
                setCurrentPage('category');
              }}
              className="space-y-3"
            >
              <label htmlFor="home-search" className="sr-only">Search products</label>
              <div className="flex gap-2">
                <input
                  id="home-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for seeds, fertilizers, livestock feed, irrigation kits..."
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1B6B3A] focus:ring-2 focus:ring-[#1B6B3A]/20"
                />
                <button
                  type="submit"
                  className="rounded-3xl bg-[#1B6B3A] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-emerald-950"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {['Paddy Seeds', 'Drip Irrigation', 'Goat Feed', 'Neem Oil', 'Hydroponic Tower'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      setSelectedCategory(null);
                      setCurrentPage('category');
                    }}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 hover:border-[#1B6B3A] hover:bg-emerald-50/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FARM STORIES ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <FarmStories />
      </section>

      {/* ── LIVE STREAMS & ECOSYSTEM ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <LiveTrialFields />
        <IgoEcosystemCarousel />
      </section>

      {/* ── SUBSIDY FINDER ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Solution Kits */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-50 text-[#D94F3D] border border-red-100 font-black text-[10px] uppercase px-2.5 py-1 rounded">Save up to 33% Combo</span>
            </div>
            <h4 className="font-display font-black text-slate-800 text-lg mb-1">Crop Solution Kits</h4>
            <p className="text-xs text-slate-400 mb-4">Professional bundles with seeds, inputs & bio-defences</p>
            <div className="space-y-3">
              {CROP_KITS.map((kit) => (
                <div key={kit.id} className="border-b border-dashed border-slate-100 pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-slate-800">{kit.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{kit.description}</div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-[10px] text-slate-400 line-through">₹{kit.mrp}</div>
                      <div className="text-xs font-black text-[#1B6B3A]">₹{kit.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Added ${kit.name} combo to Cart!`)}
                    className="text-[10px] font-bold text-[#E8A020] hover:text-[#1B6B3A] flex items-center gap-1 mt-1.5 transition"
                  >
                    <CornerDownRight className="h-3 w-3" />
                    Instant Order Combo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Govt Subsidy Finder */}
          <div id="subsidy-widget" className="bg-emerald-950 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-5 w-5 bg-[#E8A020] rounded-full flex items-center justify-center font-bold text-xs text-emerald-950">₹</span>
              <span className="text-xs font-bold text-[#E8A020] uppercase tracking-wider">Gov Subsidy Portal</span>
            </div>
            <h4 className="font-display font-black text-white text-lg mb-1">Government Agri Subsidy Finder</h4>
            <p className="text-xs text-emerald-200 mb-4 leading-relaxed">
              Buy drip systems, implements & organic inputs with up to 50% subsidy under PMKSY.
            </p>
            <label className="text-[11px] font-bold text-[#E8A020] block uppercase tracking-wide mb-1.5">
              Search by category or scheme:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={subsidyQuery}
                onChange={(e) => { setSubsidyQuery(e.target.value); setSelectedSubsidyIndex(null); }}
                placeholder="e.g. Drip, Cutters, Organic"
                className="bg-emerald-900 border border-emerald-700 rounded-lg px-3 py-2 flex-1 text-xs text-white placeholder-emerald-400 focus:outline-none focus:border-[#E8A020]"
              />
              <button
                onClick={() => {
                  const idx = SUBSIDY_INFO.findIndex(x =>
                    x.applicableFor.toLowerCase().includes(subsidyQuery.toLowerCase()) ||
                    x.schemeName.toLowerCase().includes(subsidyQuery.toLowerCase())
                  );
                  setSelectedSubsidyIndex(idx > -1 ? idx : 0);
                }}
                className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 text-xs font-bold px-4 py-2 rounded-lg transition"
              >Find</button>
            </div>
            <div className="mt-4 bg-emerald-900/50 border border-emerald-800 p-4 rounded-xl min-h-[80px]">
              {selectedSubsidyIndex !== null ? (
                <div>
                  <div className="text-xs font-bold text-white">{SUBSIDY_INFO[selectedSubsidyIndex].schemeName}</div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <div className="text-[9px] uppercase text-emerald-300">Subsidy</div>
                      <div className="text-sm font-black text-[#E8A020]">{SUBSIDY_INFO[selectedSubsidyIndex].subsidyAmount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-emerald-300">Provider</div>
                      <div className="text-xs text-white">{SUBSIDY_INFO[selectedSubsidyIndex].authorizedProvider}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 italic flex items-center justify-center h-full">
                  Type "Drip" or "Organic" to find matching schemes
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-900 flex justify-between items-center">
              <span className="text-[11px] text-emerald-300">Need help? Book IGO expert consultation</span>
              <button
                onClick={() => window.open('https://wa.me/917397785803?text=Hello%20IGO,%20subsidy%20query')}
                className="text-xs text-[#E8A020] hover:text-white font-bold transition"
              >Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKET INTELLIGENCE / PRICE TRACKER (AGRA.global-style) ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader
          title="📊 Live Agri Price Tracker"
          sub="Tamil Nadu APMC mandis · MSP rates · Updated daily"
          onViewAll={() => (setCurrentPage as (p: string) => void)('events')}
        />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B6B3A] text-white text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Commodity</th>
                  <th className="text-right px-4 py-3">Market Price</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">MSP 2026</th>
                  <th className="text-right px-4 py-3">24h Change</th>
                  <th className="text-center px-4 py-3">Signal</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_PRICES.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs sm:text-sm">{row.commodity}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-900 text-xs sm:text-sm">{row.price}<span className="text-slate-400 font-normal text-[10px]">/qtl</span></td>
                    <td className="px-4 py-3 text-right text-slate-500 text-xs hidden sm:table-cell">{row.msp}</td>
                    <td className={`px-4 py-3 text-right font-bold text-xs sm:text-sm ${row.up ? 'text-green-600' : 'text-red-500'}`}>
                      {row.up ? '▲' : '▼'} {row.trend}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        row.signal === 'BUY' ? 'bg-green-100 text-green-700' :
                        row.signal === 'SELL' ? 'bg-red-100 text-red-600' :
                        row.signal === 'HOT' ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>{row.signal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>⚠ Indicative prices. Verify at local APMC before trading.</span>
            <span className="text-[#1B6B3A] font-semibold cursor-pointer hover:underline" onClick={() => (setCurrentPage as (p: string) => void)('events')}>View Full Market Report →</span>
          </div>
        </div>
      </section>

      {/* ── FARMER'S KNOWLEDGE & ADVISORY HUB ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
        <SectionHeader
          title="Farmer's Knowledge & Advisory Hub 📖"
          sub="Expert guides, disease alerts, and best practices."
          onViewAll={() => (setCurrentPage as (p: string) => void)('events')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SEED_POSTS.slice(0, 3).map((post) => (
            <div key={post.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition group">
              <div className="h-40 w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{post.category}</span>
                  <span className="text-[10px] text-slate-500">{post.readTime}</span>
                </div>
                <h4 className="font-display font-black text-slate-800 text-base leading-tight mb-2 group-hover:text-[#1B6B3A] transition">{post.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-700">By {post.author}</span>
                  <button className="text-[#1B6B3A] font-bold text-xs hover:underline flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR (photographic background) ───────────────────────── */}
      <section className="relative text-white py-12 mb-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&q=70&fit=crop" alt=""
          className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#0B3D22]/85" />
        <div className="relative max-w-7xl mx-auto px-4">
          <h3 className="text-center font-display font-black text-lg mb-6 tracking-wider uppercase text-emerald-100">
            INDIA'S COMPLETE AGRICULTURAL PLATFORM
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '27', label: 'IGO Brands' },
              { num: '5,000+', label: 'Farmers Served' },
              { num: '10,000+', label: 'Products' },
              { num: '36 States', label: 'Pan-India Delivery' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-black text-3xl sm:text-4xl text-[#E8A020]">{s.num}</div>
                <div className="text-xs sm:text-sm text-emerald-100 mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING AGRI EVENTS (KisaanTrade-style) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader
          title="🗓 Upcoming Agri Events"
          sub="Trade shows, farmer meets & expo near you"
          onViewAll={() => (setCurrentPage as (p: string) => void)('events')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {AGRI_EVENTS.map((ev, i) => (
            <div
              key={i}
              className={`border rounded-xl p-3 cursor-pointer hover:shadow-md transition-all ${ev.color}`}
              onClick={() => (setCurrentPage as (p: string) => void)('events')}
            >
              <div className="text-2xl mb-1.5">{ev.emoji}</div>
              <div className="text-[10px] font-black text-slate-700 uppercase tracking-wide leading-tight mb-1">{ev.name}</div>
              <div className="text-[10px] text-slate-500">{ev.city}</div>
              <div className="text-[10px] font-bold text-[#1B6B3A] mt-1">{ev.date}</div>
              <span className="inline-block mt-1.5 text-[9px] font-bold bg-white/70 text-slate-600 px-1.5 py-0.5 rounded-full border border-slate-200">{ev.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── B2B BULK TRADE INQUIRY (FarmerShrine + FarmLyx-style) ───── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-[#1B6B3A] to-emerald-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block bg-[#E8A020] text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3">B2B / Wholesale</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight mb-2">
                Need to Buy in Bulk?
              </h2>
              <p className="text-emerald-100 text-sm max-w-md">
                We supply directly to FPOs, cooperatives, retailers, and institutions across Tamil Nadu &amp; India. Get competitive wholesale pricing, credit terms &amp; dedicated account manager.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['FPOs & Co-ops', 'Retailers', 'Exporters', 'Institutions', 'Agri Startups'].map(tag => (
                  <span key={tag} className="text-[10px] font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => window.open('https://wa.me/917397785803?text=Hello%20IGO,%20I%20want%20bulk%20wholesale%20pricing')}
                className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition hover:-translate-y-0.5 min-h-[48px] text-center"
              >
                💬 WhatsApp for Bulk Quote
              </button>
              <button
                onClick={() => (setCurrentPage as (p: string) => void)('contact')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition min-h-[48px] text-center"
              >
                📋 Submit Inquiry Form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP STRIP ────────────────────────────────────────────── */}
      <section className="bg-emerald-900 text-white py-5 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-green-500 rounded-full flex items-center justify-center text-xl font-black shadow-lg animate-bounce shrink-0">
              💬
            </div>
            <div>
              <div className="font-bold text-sm">Order directly via WhatsApp!</div>
              <div className="text-xs text-emerald-200">
                Send requirements to <strong className="text-white">+91 7397785803</strong> — instant reply
              </div>
            </div>
          </div>
          <button
            onClick={() => window.open('https://wa.me/917397785803?text=Hello%20IGO%20Agri%20Market,%20I%20want%20to%20order')}
            className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 text-xs font-black px-6 py-3 rounded-xl shadow transition shrink-0"
          >
            ORDER VIA WHATSAPP
          </button>
        </div>
      </section>

      {/* ── OUR BRANDS CAROUSEL (Farmers Factory Style) ─── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight">Our Brands</h2>
            </div>
            <button
              onClick={() => (setCurrentPage as (p: string) => void)('igo-groups')}
              className="text-[#1B6B3A] font-bold text-sm hover:underline"
            >
              View All Directory &rarr;
            </button>
          </div>

          {/* Auto-scrolling brand marquee (pauses on hover) */}
          <div className="brand-marquee-wrap overflow-hidden">
            <div className="brand-marquee-track flex gap-6 w-max pb-8" style={{ animation: 'brandmarquee 80s linear infinite' }}>
              {(() => {
                const DIV = [
                  { logo: "/images/Brands/8.jpg", logoText: "IGO AGRI TECHFARMS", subtitle: "CORE BUSINESS", title: "IGO Agritech Farms", desc: "Leading agricultural engineering and infrastructure development for modern tech-enabled farming across India.", status: "active" },
                  { logo: "/images/Brands/20.jpg", logoText: "FARMERS FACTORY", subtitle: "PROCESSING & MFG", title: "Farmers Factory", desc: "State-of-the-art food processing and manufacturing delivering pure, fresh, organic products directly to consumers.", status: "active" },
                  { logo: "/images/Brands/7.jpg", logoText: "VALLUVAM", subtitle: "AGRI CONSULTANCY", title: "Valluvam", desc: "Expert agricultural consultancy providing strategic guidance, research, and sustainable farming methodologies.", status: "active" },
                  { logo: "/images/Brands/10.jpg", logoText: "PROTEIN CUTS", subtitle: "FARM-TO-TABLE", title: "Protein Cuts", desc: "Premium quality, ethically sourced protein products from our trusted network directly to your kitchen.", status: "active" },
                  { logo: "/images/Brands/14.jpg", logoText: "IGO NURSERY", subtitle: "PLANT PROPAGATION", title: "IGO Nursery", desc: "Premium polyhouse-grown plants, saplings and AgriTech greenery delivered across India.", status: "active" },
                  { logo: "/images/Brands/6.jpg", logoText: "IGO AGRI MART", subtitle: "DISTRIBUTION", title: "IGO Agri Mart", desc: "Seeds, fertilizers, plants and farm essentials — the agri-distribution network for every farmer.", status: "active" },
                  { logo: "/images/Brands/12.jpg", logoText: "PALM CAFE", subtitle: "F&B", title: "Palm Cafe", desc: "Farm-to-cafe dining showcasing fresh produce through healthy, sustainable culinary creations.", status: "active" },
                  { logo: "/images/Brands/11.jpg", logoText: "IGO EXPORTS", subtitle: "TRADE", title: "IGO Exports & Imports", desc: "Connecting Indian agri products to global markets and bringing world-class inputs to India.", status: "active" },
                  { logo: "/images/Brands/15.jpg", logoText: "IGO MART", subtitle: "RETAIL", title: "IGO Mart", desc: "Supermarket chain offering quality products at accessible prices for everyday consumers.", status: "active" },
                  { logo: "/images/Brands/17.jpg", logoText: "IGO FINANCIAL", subtitle: "FINTECH", title: "IGO Financial Services", desc: "Financial support and micro-finance for farmers and agriculture entrepreneurs across India.", status: "active" },
                  { logo: "/images/Brands/24.jpg", logoText: "FARMGATE MANDI", subtitle: "PROCUREMENT", title: "IGO Farmgate Mandi", desc: "Direct procurement empowering farmers to sell produce at fair market prices from the farm gate.", status: "active" },
                  { logo: "/images/Brands/13.jpg", logoText: "IGO ACADEMY", subtitle: "EDUCATION", title: "IGO Academy", desc: "Training and education programs empowering the next generation of modern farmers.", status: "active" },
                  { logo: "/images/Brands/21.jpg", logoText: "IGO CROP CARE", subtitle: "AGRI INPUT", title: "IGO Crop Care", desc: "Organic pest control and sustainable crop-protection inputs for healthier, higher-yield farming.", status: "soon" },
                  { logo: "/images/Brands/16.jpg", logoText: "IGO FARM LOANS", subtitle: "FINANCE", title: "IGO Farm Loans & Subsidy", desc: "Facilitating loans, government subsidies and grants for farmers across India.", status: "soon" },
                  { logo: "/images/Brands/2.jpg", logoText: "FARM AUTOMATION", subtitle: "TECHNOLOGY", title: "IGO Farm Automation", desc: "IoT, drones and automated systems delivering precision agriculture across India.", status: "soon" },
                  { logo: "/images/Brands/3.jpg", logoText: "IGO AGRI ESTATES", subtitle: "REAL ESTATE", title: "IGO Agri Estates", desc: "Sustainable agricultural land development and farm-estate management.", status: "soon" },
                  { logo: "/images/Brands/19.jpg", logoText: "FARM FACTORIES", subtitle: "INFRASTRUCTURE", title: "IGO Farm Factories", desc: "Next-generation agricultural processing facilities for maximum yield and minimum waste.", status: "soon" },
                  { logo: "/images/Brands/18.jpg", logoText: "IGO FRANCHISE", subtitle: "FRANCHISE", title: "IGO Franchise", desc: "Expanding our successful agricultural models through franchise partnership opportunities.", status: "soon" },
                  { logo: "/images/Brands/4.jpg", logoText: "IGO COSMETICS", subtitle: "LIFESTYLE", title: "IGO Natural Cosmetics", desc: "Premium organic beauty and personal care crafted from naturally-sourced farm ingredients.", status: "soon" },
                  { logo: "/images/Brands/22.jpg", logoText: "IGO PHARMA", subtitle: "HEALTHCARE", title: "IGO Organic Pharmacy", desc: "Integrating traditional medicinal plants with modern pharmaceutical standards.", status: "soon" },
                  { logo: "/images/Brands/23.jpg", logoText: "IGO FOUNDATION", subtitle: "FOUNDATION", title: "IGO Tech Farming Scientist", desc: "Research and education foundation advancing agri-science for the next generation of tech farming.", status: "soon" },
                  { logo: "/images/Brands/25.jpg", logoText: "IGO WEALTH", subtitle: "INVESTMENT", title: "IGO Wealth Management", desc: "Financial advisory tailored for agricultural investments and rural wealth generation.", status: "soon" },
                ];
                return [...DIV, ...DIV];
              })().map((brand, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[270px] sm:w-[300px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
                  onClick={() => (setCurrentPage as (p: string) => void)('igo-groups')}
                >
                  {/* Logo on top */}
                  <div className="relative bg-slate-50/50 p-8 flex items-center justify-center border-b border-slate-100 h-44">
                    {brand.status === 'soon' && (
                      <span className="absolute top-3 right-3 bg-[#E8A020] text-slate-900 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Coming Soon</span>
                    )}
                    <div className="bg-white w-36 h-36 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-center p-1 overflow-hidden">
                      <img
                        src={brand.logo}
                        alt={brand.title}
                        loading="lazy"
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; const s = e.currentTarget.nextElementSibling as HTMLElement | null; if (s) s.style.display = 'block'; }}
                      />
                      <span style={{ display: 'none' }} className="font-black text-[#1B6B3A] leading-tight text-sm uppercase">{brand.logoText}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <span className="text-[10px] font-black text-[#E8A020] tracking-widest uppercase mb-2">{brand.subtitle}</span>
                    <h3 className="font-display font-black text-lg text-slate-900 mb-3">{brand.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{brand.desc}</p>
                    <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-slate-100/60 ${brand.status === 'soon' ? 'text-slate-400' : 'text-[#E8A020]'}`}>
                      <span>{brand.status === 'soon' ? 'Coming Soon' : 'Active Division'}</span>
                      <span className="text-lg leading-none">&rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes brandmarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .brand-marquee-wrap:hover .brand-marquee-track { animation-play-state: paused; }
          `}</style>
        </div>
      </section>

      {/* ── APP DOWNLOAD BANNER (KisaanTrade-style) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-4">
        <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&q=70&fit=crop" alt=""
            className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-emerald-950/70" />
          <div className="relative z-10 text-center sm:text-left">
            <span className="inline-block bg-[#E8A020] text-slate-900 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3">Coming Soon</span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight mb-1">Get the IGO AgriMart App</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Order seeds, fertilizers &amp; equipment. Track deliveries. Get crop advisory — all from your phone.
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {['Order Tracking', 'Crop Doctor', 'Price Alerts', 'Tamil Support'].map(f => (
                <span key={f} className="text-[10px] font-bold text-slate-300 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => alert('IGO AgriMart App — launching soon! Register interest via WhatsApp: +91 7397785803')}
              className="flex items-center gap-2 bg-white text-slate-900 font-black text-sm px-5 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition min-h-[48px]"
            >
              <span className="text-xl">▶</span>
              <div className="text-left">
                <div className="text-[9px] font-normal text-slate-500">Available on</div>
                <div className="text-sm font-black">Google Play</div>
              </div>
            </button>
            <button
              onClick={() => alert('IGO AgriMart App — launching soon! Register interest via WhatsApp: +91 7397785803')}
              className="flex items-center gap-2 bg-white text-slate-900 font-black text-sm px-5 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition min-h-[48px]"
            >
              <span className="text-xl"></span>
              <div className="text-left">
                <div className="text-[9px] font-normal text-slate-500">Download on</div>
                <div className="text-sm font-black">App Store</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">Farmer Stories</span>
          <h2 className="font-extrabold text-2xl text-slate-800">Trusted by 10,000+ Farmers</h2>
          <p className="text-slate-400 text-sm mt-1">Real results from farmers across Tamil Nadu and beyond</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Murugan S.", location: "Villupuram, Tamil Nadu", crop: "Paddy & Sugarcane", rating: 5, text: "IGO Agri Mart changed how I buy inputs. I get certified seeds and organic fertilizers delivered to my village within 2 days. Quality is exceptional and prices are 15% lower than local shops.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" },
            { name: "Lakshmi R.", location: "Coimbatore, Tamil Nadu", crop: "Flowers & Vegetables", rating: 5, text: "As a small farmer, I always struggled with fake pesticides. Through IGO, every product is genuine with batch numbers. The Crop Doctor feature helped me identify disease in my roses and fix it quickly.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&q=80" },
            { name: "Rajan K.", location: "Madurai, Tamil Nadu", crop: "Cotton & Groundnut", rating: 5, text: "Ordered drip irrigation from IGO Agri Mart with government subsidy support. The team helped with PMKSY paperwork. Saved Rs.45,000 on installation. My water usage dropped by 40%. Highly recommend!", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(item.rating)].map((_, j) => (
                  <span key={j} className="text-[#E8A020] text-sm">&#9733;</span>
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <img src={item.img} alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"; }} />
                <div>
                  <div className="font-extrabold text-slate-800 text-sm">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.location}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">&#127806; {item.crop}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function filteredProductCount(products: any[], category: string): number {
  return products.filter(p => p.category === category).length;
}
