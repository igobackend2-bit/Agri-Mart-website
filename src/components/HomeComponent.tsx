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
import { getBanners, getHomeOverrides, getComplexOverrides, getCategoryMeta, getCustomCategories, getAgriEvents, pageText } from '../siteConfig';
import { detectLocation, getSavedLocation } from '../storeData';
import { FarmStories, LiveTrialFields, IgoEcosystemCarousel } from './HomeAdaptedFeatures';
import { CorporateTrustStrip, FarmingWeatherAdvisory, ShopByCropGrid, FarmInfrastructureServices, CropDoctorConsultation, TopAgriBrandsCarousel } from './HomeExtensions';
import IgoGroupBand from './IgoGroupBands';
import IgoVerticalsSlider from './IgoVerticalsSlider';
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
  'native-foods-millets': { icon: Wheat, text: 'Native Foods & Millets', count: 'Native Range', desc: 'Millets, spices, dry fruits, cold-pressed oils, honey & jaggery — chemical-free', bg: 'bg-amber-50 text-amber-700', images: [
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
  // Blog article reader modal (opens the full post when "Read" is clicked).
  const [readingPost, setReadingPost] = useState<(typeof SEED_POSTS)[number] | null>(null);

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



  // Category rail — customized groupings as requested
  const RAIL_GROUPS = [
    { label: 'Vegetables', slug: 'vegetables', matchCats: ['Vegetables'], customImg: '/images/categories/Vegetables.png' },
    { label: 'Fruits', slug: 'fruits', matchCats: ['Fruits'], customImg: '/images/categories/Fruits.png' },
    { label: 'Seeds', slug: 'seeds', matchCats: ['Vegetable Seeds', 'Fruit Seeds', 'Field Seeds', 'Flower Seeds'], customImg: '/images/categories/Seeds.png' },
    { label: 'Fertilizers', slug: 'all-fertilizers', matchCats: ['Liquid Fertilizers', 'Powder Fertilizers', 'Chemical Fertilizers', 'Organic Fertilizers'], customImg: '/images/categories/Fertilizers.jpeg' },
    { label: 'Plants', slug: 'plants', matchCats: ['Indoor Plants', 'Outdoor Plants & Trees'], customImg: '/images/categories/Plants.jpeg' },
    { label: 'Valluvam Products', slug: 'valluvam-products', matchCats: ['Native Foods & Millets', 'Valluvam'], customImg: '/images/categories/Valluvam.jpeg' },
    { label: 'Equipments', slug: 'equipment', matchCats: ['Precision Tools & Equipments', 'Nursery Tools', 'Farm Tools & Implements'], customImg: '/images/categories/Equipments.jpeg' },
    { label: 'Greenhouse & Polyhouse', slug: 'greenhouse-polyhouse', matchCats: ['Greenhouse & Polyhouse'], customImg: '/catalog/Images/polyhouse/Poly Film.jpg' }
  ];

  const catMeta = getCategoryMeta();
  const baseCats: [string, { text: string; images: string[] }][] = RAIL_GROUPS.map((group) => {
    return [group.slug, { text: group.label, images: [group.customImg] }];
  });
  // Admin-created custom categories show on the rail even before they have products.
  const customCats: [string, { text: string; images: string[] }][] = getCustomCategories()
    .filter((c) => !RAIL_GROUPS.some(g => g.label === c.name || g.matchCats.includes(c.name)) && !catMeta[c.name]?.hidden)
    .map((c) => {
      const rep = products.find((p) => p.category === c.name && p.images && p.images[0]);
      const img = (c.image && c.image.trim()) ? c.image : (rep ? rep.images[0] : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=240&q=75&fit=crop');
      return [c.slug, { text: c.name, images: [img] }];
    });
  const ALL_CATS: [string, { text: string; images: string[] }][] = [...baseCats, ...customCats];

  const DEFAULT_HERO_SLIDES = [
    {
      img: '', // background video used for all default slides
      badge: 'IGO AGRITECH FARMS',
      title: lang === 'en' ? 'India\'s Premier Agri Engineering Brand' : 'இந்தியாவின் முன்னணி வேளாண் பொறியியல் நிறுவனம்',
      sub: lang === 'en' ? 'Pioneering sustainable agriculture with turnkey Polyhouse construction, precision Hydroponics, and full-scale farm infrastructure.' : 'பாலிகவுஸ் அமைப்பு மற்றும் ஹைட்ரோபோனிக்ஸ் விவசாயத்தில் நிபுணத்துவம்',
      btn: 'Explore Engineering', btnAction: 'greenhouse-polyhouse', color: 'from-emerald-950/85 via-emerald-900/50 to-transparent'
    },
    {
      img: '',
      badge: 'GOVT SUBSIDY UPTO 90%',
      title: lang === 'en' ? 'Smart Irrigation for Indian Soils' : 'சொட்டு நீர்ப்பாசன கருவிகள்',
      sub: lang === 'en' ? 'Up to 90% govt subsidy support · customized kits for every farm size · free expert installation guidance' : 'அரசு மானியம் · அனைத்து பண்ணை அளவுகளும் · இலவச நிறுவல் வழிகாட்டுதல்',
      btn: 'Explore Irrigation', btnAction: 'irrigation-systems', color: 'from-cyan-950/85 via-cyan-900/50 to-transparent'
    },
    {
      img: '',
      badge: 'ORGANIC FARMING',
      title: lang === 'en' ? 'Grow Naturally. Harvest Better.' : 'இயற்கையாக வளர்க்கவும். உயர்ந்த விலை பெறவும்.',
      sub: lang === 'en' ? 'Vermicompost, neem oil, Trichoderma & bio-stimulants — your complete organic toolkit for maximum yields' : 'மண்புழு உரம் · வேப்ப எண்ணெய் · உயிரியல் உரங்கள் · முழுமையான இயற்கை தொகுப்பு',
      btn: 'Shop Organic Range', btnAction: 'organic-natural-farming', color: 'from-green-950/85 via-green-900/50 to-transparent'
    },
    {
      img: '',
      badge: 'MACHINERY & TOOLS',
      title: lang === 'en' ? 'Built for Indian Fields & Farmers' : 'விவசாய கருவிகள் & இயந்திரங்கள்',
      sub: lang === 'en' ? 'Heavy-duty power weeders, seed drills, and battery sprayers designed for diverse Indian agricultural conditions' : 'யந்திர களை கருவிகள் · விதை பயிர்கருவிகள் · பேட்டரி தெளிப்பான்கள்',
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

  const dailyOffers = getOverrideProducts("Today's Offer", []);

  const todaysOffers = getOverrideProducts("Freshly Arrived", [...products].sort((a, b) => {
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

      {/* ── DYNAMIC PREMIUM HERO CAROUSEL ────────────────── */}
      <div className="relative overflow-hidden bg-slate-900 min-h-[450px] sm:min-h-[500px] flex items-center">
        {/* Background brand video */}
        <video autoPlay muted loop playsInline poster="/images/agri_farm_bg.png"
          className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/videos/igo-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/35 z-[1]" />
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {slide.img && (
              (/\.(mp4|webm|ogg)(\?|$)/i.test(slide.img) || slide.img.startsWith('data:video'))
                ? <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src={slide.img} />
                : <img src={slide.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {slide.img && <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/30" />}
            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 h-full flex flex-col justify-center">
              <div className="max-w-2xl mt-12">
                {slide.badge && <span className="inline-block bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-lg">
                  {slide.badge}
                </span>}
                {slide.title && <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-5 drop-shadow-md">
                  {slide.title}
                </h1>}
                {slide.sub && <p className="text-white/90 text-sm sm:text-base font-medium mb-8 max-w-xl leading-relaxed">
                  {slide.sub}
                </p>}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleCategoryClick(slide.btnAction)}
                    className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 font-black text-sm px-8 py-4 rounded-xl shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                  >
                    {slide.btn}
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('cat-rail');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-xl transition"
                  >
                    Explore Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Hero search removed — customers use the search bar in the header. */}

        {/* Slider Controls */}
        <div className="absolute bottom-28 left-6 sm:left-8 z-20 flex gap-2">
          {HERO_SLIDES.length > 1 && HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-8 bg-[#E8A020]' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      <CorporateTrustStrip />
      <FarmingWeatherAdvisory />

      {/* ── WHY IGO AGRI MART (marketplace intro, group-backed) ────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-6 mt-10">
        <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-200">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative z-10 bg-white">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-[#1B6B3A]/10 text-[#1B6B3A] text-[11px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 border border-emerald-100 w-fit">
                <Sprout className="h-4 w-4" /> {pageText('home', 'card1_badge', 'Genuine Inputs · Pan-India Delivery')}
              </span>

              <h2 className="font-display font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1]">
                {pageText('home', 'card1_title1', 'Why farmers shop at')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B6B3A] to-emerald-600">{pageText('home', 'card1_title2', 'IGO Agri Mart')}</span>
              </h2>

              <p className="text-base text-slate-600 leading-relaxed mt-6">
                {pageText('home', 'card1_p1', "Shop thousands of 100% genuine farm products in one place — seeds, fertilizers, crop protection, bio-inputs, tools, gardening and animal care — sourced directly from India's most trusted agri brands.")}
              </p>

              <p className="text-base text-slate-600 leading-relaxed mt-4">
                {pageText('home', 'card1_p2', 'Compare prices, read real farmer reviews and order in a tap, with fast doorstep delivery, fair transparent pricing and free expert crop advice on every purchase. No middlemen, no fakes, no hidden charges.')}
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center shadow-sm">
                    <Award className="h-5 w-5 text-[#1B6B3A]" />
                  </div>
                  <div className="h-12 w-12 rounded-full border-2 border-white bg-amber-50 flex items-center justify-center shadow-sm relative z-10">
                    <BadgeCheck className="h-5 w-5 text-[#E8A020]" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Recognized Excellence</p>
                  <p className="text-sm font-bold text-slate-800">MSME Awards 2024 - Best Agri-Consulting Brand</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative bg-emerald-950 overflow-hidden flex flex-col justify-center p-8 sm:p-12 md:p-16">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E8A020 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A020]/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="relative z-10">
                <h3 className="font-display font-black text-white text-xl md:text-2xl mb-8 flex items-center gap-3">
                  <span className="h-1 w-8 bg-[#E8A020] rounded-full"></span>
                  {pageText('home', 'card1_panel_title', 'The Agri Mart Advantage')}
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                  {[
                    { n: pageText('home', 'adv1_n', '5,000+'), l: pageText('home', 'adv1_l', 'Products Listed') },
                    { n: pageText('home', 'adv2_n', '100%'), l: pageText('home', 'adv2_l', 'Genuine Inputs') },
                    { n: pageText('home', 'adv3_n', '28+'), l: pageText('home', 'adv3_l', 'Crop Categories') },
                    { n: pageText('home', 'adv4_n', '24 hr'), l: pageText('home', 'adv4_l', 'Order Dispatch') },
                    { n: pageText('home', 'adv5_n', '7-Day'), l: pageText('home', 'adv5_l', 'Easy Returns') },
                    { n: pageText('home', 'adv6_n', '4.8/5'), l: pageText('home', 'adv6_l', 'Farmer Rating') },
                  ].map((s) => (
                    <div key={s.l} className="group/stat cursor-default">
                      <div className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-[#E8A020] to-amber-200 group-hover/stat:scale-105 transition-transform origin-left">
                        {s.n}
                      </div>
                      <div className="text-[10px] sm:text-xs text-emerald-200/80 uppercase tracking-[0.15em] mt-2 font-semibold flex items-center gap-2">
                        {s.l}
                        <span className="h-[1px] w-4 bg-emerald-800 transition-all group-hover/stat:w-8 group-hover/stat:bg-[#E8A020]"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Live Trial Fields section removed per request */}

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

      {/* Shop by Crop grid removed per request */}

      {/* ── CATEGORIES (Swiggy "best options" style — floating images) ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">
            Shop our all categories
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
          className="flex flex-row overflow-x-auto scrollbar-none gap-4 sm:gap-6 lg:justify-between w-full pb-4 snap-x"
        >
          {ALL_CATS.map(([id, cat]) => (
            <button
              key={id}
              onClick={() => handleCategoryClick(id)}
              className="snap-start flex flex-col items-center gap-2.5 group cursor-pointer shrink-0"
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

      
      {/* ── WHY FARMERS TRUST IGO (CUSTOMER FOCUS) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-6">
        <div className="bg-gradient-to-br from-[#1B6B3A] to-emerald-900 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#E8A020] text-emerald-950 text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6">
                {pageText('home', 'card2_badge', 'Your Trusted Farm Partner')}
              </span>
              <h2 className="font-display font-black text-white text-3xl sm:text-4xl leading-tight mb-4">
                {pageText('home', 'card2_title1', 'Everything your farm needs.')} <br/>
                <span className="text-emerald-300">{pageText('home', 'card2_title2', 'Delivered directly to you.')}</span>
              </h2>
              <p className="text-emerald-50 text-base leading-relaxed mb-8 max-w-lg">
                {pageText('home', 'card2_intro', 'IGO AgriMart connects farmers directly with top brands. We eliminate middlemen to guarantee 100% genuine inputs, fair prices, and expert agronomy support right when you need it.')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: pageText('home', 'trust1_t', '100% Certified Products'), desc: pageText('home', 'trust1_d', 'No fakes. Quality guaranteed.') },
                  { title: pageText('home', 'trust2_t', 'Free Agronomy Help'), desc: pageText('home', 'trust2_d', 'Expert advice on WhatsApp.') },
                  { title: pageText('home', 'trust3_t', 'Transparent Pricing'), desc: pageText('home', 'trust3_d', 'Best prices, zero hidden fees.') },
                  { title: pageText('home', 'trust4_t', 'Fast Farm Delivery'), desc: pageText('home', 'trust4_d', 'Direct to your village.') }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                    <div className="h-2 w-2 rounded-full bg-[#E8A020] mt-2 shrink-0"></div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-emerald-200 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/20">
              <img src={pageText('home', 'card2_image', '/images/happy_indian_farmer.png')} alt="Happy Indian Farmer" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TODAY'S OFFER ────────────────────────────────────────── */}
      {dailyOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6 bg-[#f0fdf4] rounded-2xl shadow-sm mb-6 border border-emerald-100">
          <SectionHeader
            title="Today's Offer ⚡"
            sub="Best prices available today."
            onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
          />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none h-scroll">
            {dailyOffers.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
          </div>
        </section>
      )}

      {/* ── BEST SELLING (BigHaat-style) ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Best Sellings"
          sub="The inputs Indian farmers reorder most — proven quality, honest prices."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {bestSellers.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>

      {/* ── IGO BAND 1: GROUP ECOSYSTEM ──────────────────────────────── */}
      <IgoGroupBand variant="fresh" />

      {/* ── FRESHLY ARRIVED (TODAY'S SELECTION) ──────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title={"Freshly Arrived ⚡"}
          sub="Just-harvested produce and newly stocked inputs — dispatched the same day."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none h-scroll">
          {todaysOffers.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>

      {/* ── PREMIUM ENGINEERING INFRASTRUCTURE (IGO group capability) ──── */}
      <div className="mt-10 mb-12 relative z-20">
        <FarmInfrastructureServices />
      </div>

      {/* ── COMBO KITS & DEALS SECTION — removed per request ─────────── */}
      {false && (
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Combo Kits & Deals"
          sub="Pre-packed agri kits for fast setup and higher crop returns."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {comboDeals.map((kit) => (
            <div key={kit.id} className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group flex flex-col">
              <div className="absolute top-0 right-0 bg-[#E8A020] text-emerald-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10 shadow-sm">
                Save 33%
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-slate-900 text-[15px] leading-tight group-hover:text-emerald-700 transition-colors">{kit.name}</h3>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">{kit.description}</p>
                <div className="mt-auto space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Included Items:</div>
                  {kit.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium">
                      <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="font-display font-black text-2xl text-slate-900">₹{kit.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-slate-400 line-through">₹{(kit.mrp || kit.price * 1.5).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Combo Deal</div>
                  </div>
                  <button
                    onClick={() => { alert(`Add ${kit.name} combo to cart from the category page.`); setCurrentPage('category'); }}
                    className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-[12px] font-bold px-5 py-3 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1.5"
                  >
                    View Kit <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── SHOP BY CROP (BigHaat-style circular) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader
          title={'Shop By Crop 🌾'}
          sub="Curated input bundles matched to your crop and its growth stage."
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

      {/* Popular Agri Brands section removed per request. */}

      {/* ── IGO BAND 2: OUR OWN FARMS ────────────────────────────────── */}
      <IgoGroupBand variant="seeds" />

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

      {/* ── ADVERTISEMENT BANNERS ──────────────────────────────────── */}
      {(pageText('home', 'ad1_url', '') || pageText('home', 'ad2_url', '') || pageText('home', 'ad3_url', '')) && (
        <section className="max-w-7xl mx-auto px-4 py-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(slot => {
              const url = pageText('home', `ad${slot}_url`, '');
              if (!url) return null;
              const type = pageText('home', `ad${slot}_type`, 'image');
              const link = pageText('home', `ad${slot}_link`, '#');
              return (
                <div key={slot} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-slate-100 group cursor-pointer" onClick={() => { if(link !== '#') { window.open(link, '_blank'); } }}>
                  {type === 'video' ? (
                    <video src={url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" autoPlay muted loop playsInline />
                  ) : (
                    <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={`Ad ${slot}`} loading="lazy" />
                  )}
                  <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Ad</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── IGO BAND 3: AWARDS / SINCE 2013 ──────────────────────────── */}
      <IgoGroupBand variant="garden" />

      {/* ── URBAN & BALCONY GARDENING SECTION ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-100">
        <SectionHeader
          title="Urban & Balcony Gardening 🪴"
          sub="Everything for a thriving balcony, terrace or home garden."
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

      {/* ── IGO BAND 4: FINTECH & FARM LOANS ─────────────────────────── */}
      <IgoGroupBand variant="trending" />

      {/* ── TRENDING PRODUCTS (BigHaat-style) ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6">
        <SectionHeader
          title="Trending Products 🔥"
          sub="This week's most-loved products across Indian farms."
          onViewAll={() => { setSelectedCategory(null); setCurrentPage('category'); }}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {trendingProducts.map((p) => (<div key={p.id} className="contents">{renderProductCard(p)}</div>))}
        </div>
      </section>

      {/* Authorized Dealer / Top Brands carousel removed per request */}

      <div className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <CropDoctorConsultation />
      </div>



      {/* ── FARMER'S KNOWLEDGE & ADVISORY HUB ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
        <SectionHeader
          title={pageText('home', 'hub_title', "Farmer's Knowledge & Advisory Hub 📖")}
          sub={pageText('home', 'hub_sub', "Expert guides, disease alerts, and best practices.")}
          onViewAll={() => (setCurrentPage as (p: string) => void)('blog')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SEED_POSTS.slice(0, 3).map((basePost, idx) => {
            const i = idx + 1;
            const post = {
              ...basePost,
              title: pageText('home', `hub_post${i}_title`, basePost.title),
              excerpt: pageText('home', `hub_post${i}_desc`, basePost.excerpt),
              image: pageText('home', `hub_post${i}_img`, basePost.image),
              category: pageText('home', `hub_post${i}_cat`, basePost.category),
              author: pageText('home', `hub_post${i}_author`, basePost.author),
            };
            return (
            <div key={post.id} onClick={() => setReadingPost(post)}
              className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition group cursor-pointer flex flex-col">
              <div className="h-40 w-full overflow-hidden shrink-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4 bg-slate-50 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{post.category}</span>
                  <span className="text-[10px] text-slate-500">{post.readTime}</span>
                </div>
                <h4 className="font-display font-black text-slate-800 text-base leading-tight mb-2 group-hover:text-[#1B6B3A] transition">{post.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-700">By {post.author}</span>
                  <button onClick={(e) => { e.stopPropagation(); setReadingPost(post); }} className="text-[#1B6B3A] font-bold text-xs hover:underline flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Full article reader modal */}
        {readingPost && (
          <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReadingPost(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-52 sm:h-64 bg-slate-100">
                <img src={readingPost.image} alt={readingPost.title} className="w-full h-full object-cover" />
                <button onClick={() => setReadingPost(null)} className="absolute top-3 right-3 h-9 w-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow text-lg font-bold">✕</button>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wide">{readingPost.category}</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{readingPost.readTime}</span>
                </div>
                <h2 className="font-display font-black text-slate-900 text-2xl sm:text-3xl leading-tight tracking-tight">{readingPost.title}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-2">By {readingPost.author} · {new Date(readingPost.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <div className="mt-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">{readingPost.content}</div>
                {readingPost.tags && readingPost.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {readingPost.tags.map((tg) => (
                      <span key={tg} className="text-[10px] font-bold text-[#1B6B3A] bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">#{tg}</span>
                    ))}
                  </div>
                )}
                <button onClick={() => setReadingPost(null)} className="mt-7 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-black px-5 py-2.5 rounded-lg transition">Close Article</button>
              </div>
            </div>
          </div>
        )}
      </section>

      


      {/* ── WHY CHOOSE IGO AGRI MART? (Premium Dark Design) ───────────────────────────────── */}
      <section className="relative bg-slate-900 py-20 overflow-hidden rounded-[2.5rem] mx-2 sm:mx-4 my-12 shadow-2xl">
        {/* Cinematic AI Background */}
        <div className="absolute inset-0 w-full h-full group">
          {(pageText('home', 'trust_bg', '') || '/images/trust_bg_premium.png') && (
            <img src={pageText('home', 'trust_bg', '/images/trust_bg_premium.png')} alt="IGO Farm View" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        {/* Abstract glowing shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1B6B3A]/30 blur-[100px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E8A020]/20 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 bg-[#1B6B3A] text-emerald-100 border border-emerald-800/50 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-5 shadow-lg">
              <ShieldCheck className="h-4 w-4 text-[#E8A020]" /> {pageText('home', 'trust_badge', 'The IGO Advantage')}
            </span>
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl tracking-tight leading-tight">
              {pageText('home', 'trust_title1', "Why India's Farmers")} <br /> <span className="text-[#E8A020]">{pageText('home', 'trust_title2', 'Trust IGO')}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-5 max-w-lg mx-auto leading-relaxed">
              {pageText('home', 'trust_sub', 'From genuine seeds to expert agronomy, we provide everything you need for a profitable harvest under one roof.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/80 hover:border-[#E8A020]/30 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-150 group-hover:rotate-12 group-hover:-translate-y-2 group-hover:translate-x-2 pointer-events-none">
                    <Icon className="h-40 w-40 text-white" />
                  </div>
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_-10px_rgba(232,160,32,0.4)] transition-all duration-500 border border-slate-600/50 relative z-10`}>
                    <Icon className={`h-6 w-6 text-[#E8A020]`} />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3 relative z-10">{pageText('home', `trustpt${i + 1}_t`, point.title)}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed relative z-10">{pageText('home', `trustpt${i + 1}_d`, point.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAR (photographic background) ───────────────────────── */}
      <section className="relative text-white py-12 mb-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&q=70&fit=crop" alt=""
          className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#0B3D22]/85" />
        <div className="relative max-w-7xl mx-auto px-4">
          <h3 className="text-center font-display font-black text-lg mb-6 tracking-wider uppercase text-emerald-100">
            {pageText('home', 'statbar_title', "INDIA'S COMPLETE AGRICULTURAL PLATFORM")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: pageText('home', 'statbar1_n', '27'), label: pageText('home', 'statbar1_l', 'IGO Brands') },
              { num: pageText('home', 'statbar2_n', '5,000+'), label: pageText('home', 'statbar2_l', 'Farmers Served') },
              { num: pageText('home', 'statbar3_n', '10,000+'), label: pageText('home', 'statbar3_l', 'Products') },
              { num: pageText('home', 'statbar4_n', '36 States'), label: pageText('home', 'statbar4_l', 'Pan-India Delivery') },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-black text-3xl sm:text-4xl text-[#E8A020]">{s.num}</div>
                <div className="text-xs sm:text-sm text-emerald-100 mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      
      {/* ── B2B BULK TRADE INQUIRY (FarmerShrine + FarmLyx-style) ───── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-[#1B6B3A] to-emerald-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block bg-[#E8A020] text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3">{pageText('home', 'b2b_badge', 'B2B / Wholesale')}</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight mb-2">
                {pageText('home', 'b2b_title', 'Need to Buy in Bulk?')}
              </h2>
              <p className="text-emerald-100 text-sm max-w-md">
                {pageText('home', 'b2b_desc', 'We supply directly to FPOs, cooperatives, retailers, and institutions across Tamil Nadu & India. Get competitive wholesale pricing, credit terms & dedicated account manager.')}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {(pageText('home', 'b2b_tags', 'FPOs & Co-ops, Retailers, Exporters, Institutions, Agri Startups')).split(',').map(tag => (
                  <span key={tag.trim()} className="text-[10px] font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{tag.trim()}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => window.open(`https://wa.me/${pageText('home', 'wa_phone', '917397785803')}?text=Hello%20IGO,%20I%20want%20bulk%20wholesale%20pricing`)}
                className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg transition hover:-translate-y-0.5 min-h-[48px] text-center"
              >
                💬 {pageText('home', 'b2b_btn1', 'WhatsApp for Bulk Quote')}
              </button>
              <button
                onClick={() => (setCurrentPage as (p: string) => void)('contact')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition min-h-[48px] text-center"
              >
                📋 {pageText('home', 'b2b_btn2', 'Submit Inquiry Form')}
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
              <div className="font-bold text-sm">{pageText('home', 'wa_title', 'Order directly via WhatsApp!')}</div>
              <div className="text-xs text-emerald-200">
                {pageText('home', 'wa_desc1', 'Send requirements to')} <strong className="text-white">+{pageText('home', 'wa_phone', '917397785803')}</strong> {pageText('home', 'wa_desc2', '— instant reply')}
              </div>
            </div>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/${pageText('home', 'wa_phone', '917397785803')}?text=Hello%20IGO%20Agri%20Market,%20I%20want%20to%20order`)}
            className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 text-xs font-black px-6 py-3 rounded-xl shadow transition shrink-0 uppercase"
          >
            {pageText('home', 'wa_btn', 'Order via WhatsApp')}
          </button>
        </div>
      </section>

      {/* ── THE 26 VERTICALS OF IGO (Ecosystem Slider) ───────────────── */}
      <IgoVerticalsSlider />

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


    </div>
  );
}
