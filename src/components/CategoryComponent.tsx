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
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');

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
        : (currentCategoryObj ? currentCategoryObj.name : 'All Farming Products')
      );

  // Clear all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(5000);
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSelectedProblem(null);
    setSearchQuery('');
    setSortBy('relevance');
    if (isBrandOnlyFilter) {
      setSelectedCategory(null);
    }
  };

  // Filter application pipeline
  const getFilteredProducts = () => {
    let result = [...products];

    // Category / Brand filter
    if (selectedCategory && !isBrandOnlyFilter) {
      // support matching either real category name or normalized slug matches
      result = result.filter(p => 
        p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedCategory ||
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
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
        
        {/* Left Filters Sidebar */}
        <aside className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-xl space-y-6 h-fit sticky top-[150px]">
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

          {/* Shop By Problem selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Shop by Problem Target:
            </label>
            <div className="flex flex-col gap-2">
              {PROBLEM_FILTERS.map((prob) => (
                <button
                  key={prob}
                  onClick={() => setSelectedProblem(selectedProblem === prob ? null : prob)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedProblem === prob
                      ? 'bg-amber-100 text-amber-800 border-l-4 border-amber-500'
                      : 'bg-[#F7F9F4] text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {prob}
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
              <span className="font-display text-[#1B6B3A] font-black">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="150"
              max="5000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#1B6B3A] cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹150</span>
              <span>₹5k+</span>
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
                  className={`px-3 py-1 text-xs rounded-lg font-bold border transition ${
                    minRating === r
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
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                inStockOnly ? 'bg-[#1B6B3A]' : 'bg-slate-200'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
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
                  className={`py-1 text-xs rounded-lg font-extrabold transition ${
                    minDiscount === d
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
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      {p.isIgoOwn && (
                        <span className="absolute top-2 left-2 bg-[#1B6B3A] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-emerald-600">
                          IGO Brand
                        </span>
                      )}
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
                    <div>
                      {p.mrp > p.price && (
                        <div className="text-xs text-slate-400 line-through leading-none">₹{p.mrp}</div>
                      )}
                      <div className="font-display font-black text-slate-900 text-base leading-tight">₹{p.price}</div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(p);
                      }}
                      className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-xs font-bold px-3 py-2 rounded-lg transition shrink-0 cursor-pointer"
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
    </div>
  );
}
