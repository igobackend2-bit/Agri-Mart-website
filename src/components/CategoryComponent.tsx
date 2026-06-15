import { useState, useEffect } from 'react';
import {
  ChevronRight,
  SlidersHorizontal,
  Trash2,
  ExternalLink,
  Percent,
  Tag,
  Grid3X3,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { Product, Category, Brand } from '../types';
import { translations, LanguageDict } from '../translation';

interface CategoryComponentProps {
  lang: 'en' | 'ta';
  products: Product[];
  categories: Category[];
  brands: Brand[];
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addToCart: (p: Product) => void;
}

const PROBLEM_FILTERS = [
  'Pest Control',
  'Disease Control',
  'Growth Boosters',
  'Manures & Fertilizers'
];

export default function CategoryComponent({
  lang,
  products,
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  setSelectedProduct,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  addToCart
}: CategoryComponentProps) {
  const t: LanguageDict = translations[lang];

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Product Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const toggleCompare = (p: Product) => {
    if (compareList.find(x => x.id === p.id)) {
      setCompareList(compareList.filter(x => x.id !== p.id));
    } else {
      if (compareList.length >= 4) {
        alert("You can only compare up to 4 products at a time.");
        return;
      }
      setCompareList([...compareList, p]);
    }
  };

  // Distinct crops available across the current product set (for "Buy by Crop")
  const availableCrops = Array.from(new Set(products.flatMap(p => p.crops || []))).sort();

  // Parse if selectedCategory is actually a brand filter passed from Home (e.g., "brand:Syngenta")
  const isBrandOnlyFilter = selectedCategory && selectedCategory.startsWith('brand:');
  const activeBrandName = isBrandOnlyFilter ? selectedCategory.split('brand:')[1] : null;

  // Sync brand filter passed down
  useEffect(() => {
    if (activeBrandName) {
      setSelectedBrands([activeBrandName]);
    } else {
      setSelectedBrands([]);
    }
  }, [selectedCategory, activeBrandName]);

  // Compute category details
  const currentCategoryObj = categories.find(x => x.slug === selectedCategory);
  const categoryHeaderTitle = activeBrandName
    ? `Brand: ${activeBrandName}`
    : (searchQuery
      ? `Search Results for "${searchQuery}"`
      : (currentCategoryObj
          ? currentCategoryObj.name
          : (selectedCategory
              ? selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
              : 'All Farming Products'))
    );

  // Clear all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(50000);
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSelectedProblem(null);
    setSelectedCrop(null);
    setSearchQuery('');
    setSortBy('relevance');
    if (isBrandOnlyFilter) {
      setSelectedCategory(null);
    }
  };

  // Filter application pipeline
  const getFilteredProducts = () => {
    let result = [...products];

    // Category / Brand filter with ROLLUP for subcategory matching
    if (selectedCategory && !isBrandOnlyFilter) {
      const categoryName = selectedCategory.toLowerCase().replace(/-/g, ' ');
      const slugNorm = selectedCategory.toLowerCase();

      const ROLLUP: Record<string, string[]> = {
        'fertilizers': ['chemical fertilizers', 'organic fertilizers', 'liquid nutrients', 'powder & micronutrients', 'water soluble fertilizers', 'organic manures', 'micronutrients', 'bio-stimulants', 'organic bio-boosters', 'soil conditioners', 'bioproducts'],
        'seeds-saplings': ['vegetable seeds', 'herb seeds', 'microgreen seeds', 'leafy green seeds', 'tree seeds', 'field crops', 'fruit plants', 'flower seeds', 'flowering plants', 'seeds', 'plants & saplings', 'seeds & saplings'],
        'fresh-farm-produce': ['vegetables', 'fruits', 'exotic fruit plants', 'berry plants', 'fresh farm produce'],
        'outdoor-plants-trees': ['flowers', 'medicinal plants', 'fruit plants', 'exotic fruit plants', 'berry plants', 'outdoor plants & trees'],
        'nursery-garden-essentials': ['tools & accessories', 'garden tools', 'grow bags', 'coir pots', 'hanging baskets', 'balcony planters', 'self-watering pots', 'seedling trays', 'microgreen trays', 'farm tools & implements', 'hand tools', 'gardening products', 'nursery & garden essentials', 'pots & planters'],
        'hydroponic-systems': ['nft systems', 'nft channels', 'dwc systems', 'dutch bucket systems', 'compact systems', 'vertical grow towers', 'hobby systems', 'microgreen systems', 'ph & ec meters', 'hydroponic nutrients', 'grow lights', 'grow tents', 'full spectrum led', 'high power led', 'multi spectrum led', 'wall & panel grow lights', 'timers', 'hydroponic systems'],
        'native-foods-millets': ['valluvam native foods', 'native foods & millets', 'valluvam products', 'valluvam'],
        'irrigation-systems': ['submersible pumps', 'drip irrigation', 'sprinkler', 'irrigation', 'spray pumps', 'pump', 'pumps & irrigation', 'irrigation systems'],
        'animal-husbandry': ['cattle feed', 'poultry feed', 'goat shelter', 'fish farming', 'poultry supplements', 'mineral mixture', 'fodder', 'cattle', 'poultry', 'animal husbandry'],
        'crop-protection': ['insecticides', 'fungicides', 'herbicides', 'bio-pesticides', 'bio pesticides', 'bio-fungicides', 'seed treatment', 'crop protection', 'plant protection', 'pest defenders', 'disease & fungal shields', 'weed management', 'pest & disease shields'],
        'vegetables': ['vegetables', 'leafy greens'],
        'fruits': ['fruits'],
        'field-tools': ['tool', 'tools', 'sprayer', 'implement', 'pump', 'harvest', 'digging', 'irrigation'],
        'organic-natural-farming': ['organic & bio inputs', 'organic bio-boosters', 'bio-stimulants', 'cocopeat', 'coco peat'],
        'soil-health': ['soil conditioners', 'leca', 'perlite', 'vermiculite', 'pumice', 'lava rock', 'peat moss', 'soil health'],
        'grow-media': ['cocopeat', 'leca', 'perlite', 'vermiculite', 'pumice', 'lava rock', 'peat moss', 'germination media', 'grow media & substrates', 'grow media'],
        'farm-machinery': ['farm machinery', 'tractor', 'sprayer'],
        'farm-tools-implements': ['farm tools & implements', 'hand tools'],
        'indoor-plants': ['indoor plants'],
        'post-harvest-storage': ['post-harvest & storage'],
        'beekeeping': ['beekeeping'],
        'mushroom-farming': ['mushroom farming'],
        'fencing': ['fencing'],
        'packaging-materials': ['packaging materials'],
        'solar-agriculture': ['solar agriculture'],
        'precision-agriculture': ['precision agriculture'],
        'forestry': ['forestry'],
        'lab-testing': ['lab & testing'],
        'agricultural-services': ['agricultural services'],
        // Extra slugs from HomeComponent sticky nav + potential Header categories
        'bioproducts': ['organic & bio inputs', 'bio fertilizer', 'bioproducts', 'bio-stimulants', 'organic bio-boosters', 'bioproducts', 'bio inputs', 'natural farming'],
        'agri-tools': ['farm tools & implements', 'hand tools', 'garden tools', 'tools & accessories', 'agri tools'],
        'greenhouse': ['greenhouse', 'grow tents', 'poly house', 'shade net', 'grow lights', 'greenhouse & polyhouse'],
        'greenhouse-polyhouse': ['greenhouse & polyhouse', 'gi structure pipes', 'foundation materials', 'covering materials', 'polyhouse'],
        'hydroponics': ['nft systems', 'nft channels', 'dwc systems', 'dutch bucket systems', 'compact systems', 'vertical grow towers', 'hobby systems', 'hydroponic systems', 'hydroponic nutrients', 'ph & ec meters'],
        'livestock': ['cattle feed', 'poultry feed', 'goat shelter', 'fish farming', 'poultry supplements', 'mineral mixture', 'fodder', 'cattle', 'poultry', 'animal husbandry', 'livestock'],
        'plants-saplings': ['vegetable seeds', 'herb seeds', 'microgreen seeds', 'leafy green seeds', 'tree seeds', 'fruit plants', 'flower seeds', 'flowering plants', 'seeds', 'plants & saplings', 'seeds & saplings', 'plant', 'sapling'],
        'organic': ['organic & bio inputs', 'organic bio-boosters', 'bio-stimulants', 'cocopeat', 'coco peat', 'organic manures', 'organic natural farming', 'organic'],
      };

      const rollupSubs = ROLLUP[slugNorm] || [];

      result = result.filter(p => {
        const pCat = p.category.toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();
        return (
          pCat === categoryName ||
          pCat === slugNorm ||
          pCat.replace(/ & /g, '-').replace(/ /g, '-') === slugNorm ||
          rollupSubs.some(s => pCat === s || pSub === s || pCat.includes(s) || pSub.includes(s))
        );
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const sq = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(sq) ||
        p.brand.toLowerCase().includes(sq) ||
        p.category.toLowerCase().includes(sq)
      );
    }

    // Brands checkbox
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price range slider
    result = result.filter(p => p.price <= priceRange);

    // Rating selections
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // In stock status
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Min Discount
    if (minDiscount > 0) {
      result = result.filter(p => p.discount >= minDiscount);
    }

    // Shop by Problem
    if (selectedProblem) {
      result = result.filter(p => p.problemFilter === selectedProblem);
    }

    // Buy by Crop
    if (selectedCrop) {
      result = result.filter(p => (p.crops || []).includes(selectedCrop));
    }

    // Sorting implementations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.discount - a.discount); // Simulate newest
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const filteredItems = getFilteredProducts();

  const handleProductCardClick = (p: Product) => {
    setSelectedProduct(p);
    setCurrentPage('product');
  };

  // ── Category landing grid: shown when no category/search/brand is active ──
  const showCategoryLanding = !selectedCategory && !isBrandOnlyFilter && !searchQuery.trim();
  if (showCategoryLanding) {
    const CATEGORY_TILES: { emoji: string; label: string; slug: string; bg: string }[] = [
      { emoji: '🥬', label: 'Vegetables', slug: 'vegetables', bg: 'from-emerald-50 to-emerald-100' },
      { emoji: '🍎', label: 'Fruits', slug: 'fruits', bg: 'from-rose-50 to-rose-100' },
      { emoji: '🍯', label: 'Valluvam Products', slug: 'valluvam-products', bg: 'from-amber-50 to-amber-100' },
      { emoji: '🌱', label: 'Vegetable Seeds', slug: 'vegetable-seeds', bg: 'from-lime-50 to-lime-100' },
      { emoji: '🍉', label: 'Fruit Seeds', slug: 'fruit-seeds', bg: 'from-pink-50 to-pink-100' },
      { emoji: '🌾', label: 'Field Seeds', slug: 'field-seeds', bg: 'from-yellow-50 to-yellow-100' },
      { emoji: '🌸', label: 'Flower Seeds', slug: 'flower-seeds', bg: 'from-fuchsia-50 to-fuchsia-100' },
      { emoji: '💧', label: 'Liquid Fertilizers', slug: 'liquid-fertilizers', bg: 'from-sky-50 to-sky-100' },
      { emoji: '🧂', label: 'Powder Fertilizers', slug: 'powder-fertilizers', bg: 'from-cyan-50 to-cyan-100' },
      { emoji: '⚗️', label: 'Chemical Fertilizers', slug: 'chemical-fertilizers', bg: 'from-blue-50 to-blue-100' },
      { emoji: '♻️', label: 'Organic Fertilizers', slug: 'organic-fertilizers', bg: 'from-green-50 to-lime-100' },
      { emoji: '🪴', label: 'Indoor Plants', slug: 'indoor-plants', bg: 'from-teal-50 to-teal-100' },
      { emoji: '🌳', label: 'Outdoor Plants', slug: 'outdoor-plants-trees', bg: 'from-green-50 to-green-100' },
    ];
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 select-none mb-6">
          <span className="hover:text-[#1B6B3A] cursor-pointer font-medium" onClick={() => { setSelectedCategory(null); setSearchQuery(''); setCurrentPage('home'); }}>Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 font-bold">Shop by Category</span>
        </nav>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">Shop by Category</h1>
        <p className="text-slate-500 text-sm mt-1.5 mb-7">Pick a category to see all related products.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_TILES.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setSelectedCategory(c.slug); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`group bg-gradient-to-br ${c.bg} border border-white rounded-2xl p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex flex-col gap-2`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="font-black text-sm text-slate-800 leading-tight">{c.label}</span>
              <span className="text-[11px] font-bold text-[#1B6B3A] group-hover:translate-x-0.5 transition">Explore →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 select-none mb-6">
        <span className="hover:text-[#1B6B3A] cursor-pointer font-medium" onClick={() => { setSelectedCategory(null); setSearchQuery(''); setCurrentPage('home'); }}>
          Home
        </span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="hover:text-[#1B6B3A] cursor-pointer font-medium" onClick={() => { setSelectedCategory(null); resetFilters(); }}>
          Marketplace
        </span>
        {selectedCategory && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-800 font-bold max-w-[140px] truncate">
              {categoryHeaderTitle}
            </span>
          </>
        )}
      </nav>

      {/* Category header image placeholder card */}
      <div className="relative bg-emerald-950 text-white rounded-xl mb-8 p-6 sm:p-10 overflow-hidden min-h-[140px] sm:min-h-[180px] flex items-center shadow-md">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80"
            alt="Mountains fields background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 id="category-page-title" className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white leading-tight">
            {categoryHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2">
            Explore certified agritech supplies available for immediate dispatch to Chennai, South India, and across all 36 Indian states.
          </p>
        </div>
        <div className="absolute right-6 bottom-6 hidden md:block bg-emerald-900 border border-emerald-700/50 p-3 rounded-lg text-[#E8A020] animate-sway">
          <Sparkles className="h-6 w-6 inline mr-1" />
          <span className="text-xs font-bold font-display">IGO Quality Certify</span>
        </div>
      </div>

      {/* Main layout grid (Sidebar + Product grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Filters Sidebar — sticky, scrolls internally if tall; page scroll stays on the right grid */}
        <aside className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-xl space-y-6 h-fit lg:sticky lg:top-[150px] lg:max-h-[calc(100vh-170px)] lg:overflow-y-auto custom-scroll">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#1B6B3A]" />
              <span>Filters Sidebar</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-[#D94F3D] hover:underline flex items-center gap-1 cursor-pointer"
              title="Reset all search filters"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Shop by Category quick links */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Shop by Category:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { label: 'All', slug: null },
                { label: '🥬 Vegetables', slug: 'vegetables' },
                { label: '🍎 Fruits', slug: 'fruits' },
                { label: '🍯 Valluvam', slug: 'valluvam-products' },
                { label: '🌱 Veg Seeds', slug: 'vegetable-seeds' },
                { label: '🍉 Fruit Seeds', slug: 'fruit-seeds' },
                { label: '🌾 Field Seeds', slug: 'field-seeds' },
                { label: '🌸 Flower Seeds', slug: 'flower-seeds' },
                { label: '💧 Liquid Fert.', slug: 'liquid-fertilizers' },
                { label: '🧂 Powder Fert.', slug: 'powder-fertilizers' },
                { label: '⚗️ Chemical Fert.', slug: 'chemical-fertilizers' },
                { label: '♻️ Organic Fert.', slug: 'organic-fertilizers' },
                { label: '🪴 Indoor Plants', slug: 'indoor-plants' },
                { label: '🌳 Outdoor Plants', slug: 'outdoor-plants-trees' },
              ] as const).map((c) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${selectedCategory === c.slug
                    ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]'
                    : 'bg-[#F7F9F4] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter Checkboxes */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Select Agri Brands:
            </label>
            <div className="max-h-48 overflow-y-auto custom-scroll space-y-2 pr-1">
              {brands.map((b) => {
                const countMatched = products.filter(x => x.brand === b.name).length;
                if (!countMatched) return null; // Only show brands in stock
                const isChecked = selectedBrands.includes(b.name);
                return (
                  <label key={b.id} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedBrands(selectedBrands.filter(x => x !== b.name));
                        } else {
                          setSelectedBrands([...selectedBrands, b.name]);
                        }
                      }}
                      className="rounded border-slate-300 text-[#1B6B3A] focus:ring-[#1B6B3A] h-3.5 w-3.5"
                    />
                    <span className="flex-1 truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-400">({countMatched})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              <span>Max Budget:</span>
              <span className="font-display text-[#1B6B3A] font-black">{priceRange >= 50000 ? 'Any' : `₹${priceRange.toLocaleString('en-IN')}`}</span>
            </div>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#1B6B3A] cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>{priceRange >= 50000 ? 'Any price' : `₹${priceRange.toLocaleString('en-IN')}`}</span>
            </div>
          </div>

          {/* Rating filter checkbox options */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Minimum Product Rating:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[4.5, 4.0, 3.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold border transition ${minRating === r
                    ? 'bg-yellow-100 text-[#E8A020] border-yellow-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  ★ {r}+
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle checkbox */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-600 font-semibold">Display In Stock Only</span>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${inStockOnly ? 'bg-[#1B6B3A]' : 'bg-slate-200'
                }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${inStockOnly ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
          </div>

          {/* Discount slider tier search */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Minimum Discount:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 20, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setMinDiscount(minDiscount === d ? 0 : d)}
                  className={`py-1 text-xs rounded-lg font-extrabold transition ${minDiscount === d
                    ? 'bg-red-50 text-[#D94F3D] border border-red-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                    }`}
                >
                  {d}%+
                </button>
              ))}
              <button
                onClick={() => setMinDiscount(0)}
                className={`py-1 text-xs rounded-lg font-bold transition ${minDiscount === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                All
              </button>
            </div>
          </div>
        </aside>

        {/* Right side product catalog flow */}
        <div className="lg:col-span-3 space-y-6">

          {/* Top Sort and details toolbar bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-500 text-center sm:text-left">
              Showing <span className="text-[#1B6B3A]">{filteredItems.length}</span> matching products of {products.length} cataloged
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold p-2 rounded-lg focus:outline-none focus:border-[#1B6B3A] cursor-pointer"
              >
                <option value="relevance">Relevance / Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Loop grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/60 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#1B6B3A] transition flex flex-col justify-between"
                >
                  <div className="cursor-pointer" onClick={() => handleProductCardClick(p)}>
                    <div className="relative h-44 bg-slate-50">
                      <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} />
                      {p.isIgoOwn && (
                        <span className="absolute top-2 left-2 bg-[#1B6B3A] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-emerald-600">
                          IGO Brand
                        </span>
                      )}
                      {p.stock === 0 ? (
                      <span className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                        <span className="bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full">OUT OF STOCK</span>
                      </span>
                    ) : p.stock < 20 ? (
                      <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse z-10">
                        Only {p.stock} left
                      </span>
                    ) : null}
                    {p.discount > 0 && (
                        <span className="absolute top-2 right-2 bg-[#D94F3D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {p.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1">
                      <div className="text-[10px] uppercase text-[#E8A020] font-black tracking-widest leading-none">
                        {p.brand}
                      </div>
                      <h4 className="font-display font-bold text-slate-800 text-sm line-clamp-2 mt-1 min-h-[40px]">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                        {p.subcategory}
                      </p>

                      <div className="flex items-center gap-1 mt-3">
                        <div className="flex text-yellow-400 text-xs">★ ★ ★ ★ ★</div>
                        <span className="text-[10px] text-slate-400">({p.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto select-none">
                    <div className="flex flex-col">
                      <div>
                        {p.mrp > p.price && (
                          <div className="text-xs text-slate-400 line-through leading-none">₹{p.mrp}</div>
                        )}
                        <div className="font-display font-black text-slate-900 text-base leading-tight">₹{p.price}</div>
                      </div>
                      <label className="flex items-center gap-1 mt-1 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={!!compareList.find(x => x.id === p.id)}
                          onChange={() => toggleCompare(p)}
                          className="rounded text-[#1B6B3A] focus:ring-[#1B6B3A] h-3 w-3 border-slate-300"
                        />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compare</span>
                      </label>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(p);
                      }}
                      className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-xs font-bold px-3 py-2 rounded-lg transition transform active:scale-95 hover:scale-105 shrink-0 cursor-pointer"
                    >
                      + {t.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 text-center py-20 rounded-xl space-y-4">
              <div className="text-slate-300 transform scale-150 text-3xl">📭</div>
              <h4 className="font-display font-bold text-slate-700 text-sm">No Products Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No products matched your exact search query. Try removing filters, tweaking your budget, or clearing your input.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-900 transition mt-2 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl p-4 z-50 transform transition-transform translate-y-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm text-slate-800">
                Compare Products ({compareList.length}/4)
              </span>
              <div className="flex gap-2">
                {compareList.map(p => (
                  <div key={p.id} className="relative w-10 h-10 border border-slate-200 rounded overflow-hidden">
                    <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} alt={p.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => toggleCompare(p)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCompareList([])}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className="bg-[#1B6B3A] hover:bg-emerald-950 disabled:opacity-50 text-white text-xs font-bold px-6 py-2 rounded-lg transition"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#F7F9F4]">
              <h2 className="font-display font-black text-xl text-slate-800 flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-[#1B6B3A]" />
                Product Comparison
              </h2>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition text-slate-500"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 custom-scroll">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-3 border-b-2 border-slate-200 text-left w-48 font-bold text-slate-500 text-sm uppercase tracking-widest bg-slate-50 sticky top-0 z-10">Features</th>
                    {compareList.map(p => (
                      <th key={p.id} className="p-3 border-b-2 border-slate-200 w-64 bg-white sticky top-0 z-10 text-center">
                        <div className="relative">
                          <button 
                            onClick={() => {
                              toggleCompare(p);
                              if (compareList.length <= 2) setShowCompareModal(false);
                            }}
                            className="absolute -top-2 -right-2 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} className="w-24 h-24 object-cover rounded-xl mx-auto border border-slate-100 mb-2" />
                          <h4 className="font-display font-bold text-slate-800 text-xs line-clamp-2">{p.name}</h4>
                          <div className="font-black text-[#1B6B3A] text-lg mt-1">₹{p.price}</div>
                          <button
                            onClick={() => { addToCart(p); }}
                            className="w-full mt-3 bg-[#1B6B3A] text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-emerald-950 transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-slate-100 text-xs font-bold text-slate-600 bg-slate-50">Brand</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 border-b border-slate-100 text-xs font-medium text-slate-800 text-center">{p.brand}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 text-xs font-bold text-slate-600 bg-slate-50">Category</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 border-b border-slate-100 text-xs font-medium text-slate-800 text-center">{p.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 text-xs font-bold text-slate-600 bg-slate-50">Rating</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 border-b border-slate-100 text-xs font-medium text-slate-800 text-center">★ {p.rating} ({p.reviewCount})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 text-xs font-bold text-slate-600 bg-slate-50">Stock Status</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 border-b border-slate-100 text-xs font-bold text-center">
                        {p.stock > 0 ? <span className="text-[#1B6B3A]">In Stock ({p.stock})</span> : <span className="text-red-500">Out of Stock</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 text-xs font-bold text-slate-600 bg-slate-50">Specifications</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 border-b border-slate-100 text-[10px] text-slate-600 align-top">
                        <ul className="list-disc pl-4 text-left space-y-1">
                          {Object.entries(p.specifications || {}).map(([k, v]) => (
                            <li key={k}><span className="font-bold">{k}:</span> {v}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
