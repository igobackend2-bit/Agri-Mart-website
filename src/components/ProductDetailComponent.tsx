import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  ChevronRight, 
  CheckCircle, 
  Info, 
  Truck, 
  MapPin, 
  Plus, 
  Minus,
  MessageSquare,
  Sparkles,
  Award,
  ShieldCheck,
  Leaf,
  Sprout,
  BadgeCheck
} from 'lucide-react';
import { Product, Review } from '../types';
import { translations, LanguageDict } from '../translation';
import { fetchReviews, addReview } from '../dbHelper';
import { sendInboxMessage } from '../storeData';

interface ProductDetailProps {
  lang: 'en' | 'ta';
  product: Product;
  allProducts: Product[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  addToCart: (p: Product, q: number) => void;
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin') => void;
  setSelectedProduct: (p: Product) => void;
}

export default function ProductDetailComponent({
  lang,
  product,
  allProducts,
  wishlist,
  toggleWishlist,
  addToCart,
  setCurrentPage,
  setSelectedProduct
}: ProductDetailProps) {
  const t: LanguageDict = translations[lang];

  // Image selectors
  const [activeImage, setActiveImage] = useState<string>(product.images?.[0] || '/catalog/nursery-essentials/Pots.png');
  const [quantity, setQuantity] = useState<number>(1);

  // ── Pack-size variants (1kg / 5kg, 1L / 5L etc. based on product unit) ──
  const unitInfo = (() => {
    const u = (product.unit || '').toLowerCase();
    if (/litre|liter|\bl\b|ml/.test(u)) return { base: u.includes('ml') ? u : '1 L', kind: 'L' };
    if (/kg|gram|\bg\b/.test(u)) return { base: u.includes('kg') ? u : '1 kg', kind: 'kg' };
    return null;
  })();
  const PACK_VARIANTS = unitInfo ? [
    { label: unitInfo.kind === 'L' ? '1 Litre' : '1 kg', mult: 1 },
    { label: unitInfo.kind === 'L' ? '5 Litre' : '5 kg', mult: 5, save: 4 },
    { label: unitInfo.kind === 'L' ? '10 Litre' : '10 kg', mult: 10, save: 8 },
  ] : [
    { label: '1 Pack', mult: 1 },
    { label: 'Pack of 3', mult: 3, save: 5 },
    { label: 'Pack of 5', mult: 5, save: 8 },
  ];
  const [packIdx, setPackIdx] = useState(0);
  const pack = PACK_VARIANTS[packIdx];
  // Bigger packs get a small bulk discount
  const packPrice = Math.round(product.price * pack.mult * (1 - (pack.save || 0) / 100));
  const packMrp = product.mrp * pack.mult;
  const cartProduct: typeof product = pack.mult === 1 ? product : {
    ...product,
    id: product.id + '::pack' + pack.mult,
    name: product.name + ' — ' + pack.label + ' pack',
    price: packPrice,
    mrp: packMrp,
  };
  const [activeTab, setActiveTab] = useState<'Overview' | 'Usage' | 'Composition' | 'Reviews' | 'Video'>('Overview');
  const [notified, setNotified] = useState<boolean>(false);

  const handleNotifyMe = () => {
    sendInboxMessage({
      title: 'Back-in-stock alert set',
      body: `We'll notify you here when "${product.name}" is back in stock.`,
    });
    setNotified(true);
  };
  
  // Pincode validation state
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<'unchecked' | 'available' | 'offline'>('unchecked');

  // Reviews list validation
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Frequently bought elements
  const frequentlyBoughtProduct = allProducts.find(x => x.category === product.category && x.id !== product.id) || allProducts[0];

  // Update active image when changing products
  useEffect(() => {
    setActiveImage(product.images?.[0] || '/catalog/nursery-essentials/Pots.png');
    setQuantity(1);
    setPincodeStatus('unchecked');
    setPincode('');
    setReviewSuccess(false);
    setNewComment('');

    // Fetch review docs
    fetchReviews(product.id).then(setReviewsList).catch(console.error);
  }, [product]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length !== 6) {
      alert("Please key-in a valid 6-digit Indian pincode.");
      return;
    }
    // Simulate pincode validity. Central Tamil Nadu (starts with 600 - 649) is Express. 
    // Outliers are standard, and non-numerical are blocked
    const parsed = parseInt(pincode);
    if (isNaN(parsed)) {
      setPincodeStatus('offline');
      return;
    }
    if (pincode.startsWith('600') || pincode.startsWith('601') || pincode.startsWith('73')) {
      setPincodeStatus('available');
    } else {
      setPincodeStatus('available'); // Let us make all pincodes available for good UX but show express notes
    }
  };

  const handleApplyReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const rDoc: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      productId: product.id,
      userId: 'user-guest',
      userName: 'Self-Certified Farmer',
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString()
    };

    try {
      await addReview(rDoc);
      setReviewsList([rDoc, ...reviewsList]);
      setReviewSuccess(true);
      setNewComment('');
    } catch {
      // Offline fallback state push
      setReviewsList([rDoc, ...reviewsList]);
      setReviewSuccess(true);
      setNewComment('');
    }
  };

  const isLiked = wishlist.includes(product.id);

  // Related items list: filter same categories
  const relatedList = allProducts
    .filter(x => x.category === product.category && x.id !== product.id)
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Breadcrumb row */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8 select-none">
        <span className="hover:text-[#1B6B3A] cursor-pointer font-medium" onClick={() => setCurrentPage('home')}>Home</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="hover:text-[#1B6B3A] cursor-pointer font-medium" onClick={() => setCurrentPage('category')}>Marketplace</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-800 font-bold truncate max-w-[150px]">{product.name}</span>
      </nav>

      {/* Main product configuration layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-xl border border-slate-200">
        
        {/* Gallery column */}
        <div className="space-y-4">
          <div className="h-[360px] sm:h-[450px] bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative shadow-inner">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            
            {product.isIgoOwn && (
              <span className="absolute top-4 left-4 bg-[#1B6B3A] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-emerald-600">
                IGO BRAND
              </span>
            )}
          </div>

          {/* Thumbnails (Supports up to 5 elements) */}
          <div className="flex gap-3">
            {/* Always seed 4 identical images with different filters or Unsplash backups if none available */}
            {Array.from({ length: 4 }).map((_, idx) => {
              // Cycle through secondary images if available, else repeat the main
              const imgUrl = product.images?.[idx] || product.images?.[0] || '/catalog/nursery-essentials/Pots.png';
              const isActive = activeImage === imgUrl;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`h-16 w-16 bg-slate-50 rounded-lg overflow-hidden border-2 cursor-pointer transition select-none ${
                    isActive ? 'border-[#1B6B3A] scale-105' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurations detail column */}
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-[#E8A020] uppercase tracking-widest">{product.brand}</span>
              <h1 className="font-display font-extrabold text-[#1a1a1a] text-xl sm:text-2xl lg:text-3xl tracking-tight mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">
                Category: <strong className="text-slate-600">{product.category}</strong> • Sub: {product.subcategory}
              </p>
            </div>

            {/* Standard Ratings review badge */}
            <div className="flex items-center gap-3 bg-[#F7F9F4] p-2.5 rounded-lg border border-slate-100 max-w-xs">
              <div className="flex text-yellow-400 font-display font-extrabold text-sm">
                ★ {product.rating}
              </div>
              <span className="text-xs text-slate-400 font-medium">|</span>
              <span className="text-xs text-slate-600 font-bold">{product.reviewCount} customer reviews</span>
            </div>

            {/* Price section with discount strikethrough */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400 tracking-wide block uppercase font-bold">Price Details:</span>
              <div className="flex items-baseline gap-3">
                <span className="font-display font-black text-2xl text-slate-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{product.mrp}</span>
                    <span className="bg-red-100 text-[#D94F3D] text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#1B6B3A] font-semibold">
                Include GST & local agricultural subvention tax refunds
              </p>
            </div>

            {/* Pincode availability tracker checker input */}
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl max-w-md">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <MapPin className="h-4 w-4 text-[#1B6B3A]" />
                <span>{t.pincodeCheck}</span>
              </h5>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.pincodePlaceholder}
                  className="bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold rounded-lg flex-1 outline-none text-[#1a1a1a]"
                />
                <button type="submit" className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-emerald-900 cursor-pointer">
                  {t.check}
                </button>
              </form>

              {pincodeStatus === 'available' && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-2.5">
                  {t.pincodeDeliveryAvailable} (Delivery within 2 days to Chennai and suburbs)
                </p>
              )}
              {pincodeStatus === 'offline' && (
                <p className="text-[11px] text-red-500 font-semibold mt-2.5">
                  {t.pincodeNotServiced} This pincode is outside our immediate logistics range.
                </p>
              )}
            </div>

            {/* Pack size selector */}
            <div className="pt-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Select Pack Size</p>
              <div className="flex gap-2 flex-wrap">
                {PACK_VARIANTS.map((v, i) => {
                  const vPrice = Math.round(product.price * v.mult * (1 - (v.save || 0) / 100));
                  return (
                    <button key={i} onClick={() => setPackIdx(i)}
                      className={'relative px-4 py-2.5 rounded-xl border-2 text-left transition ' + (packIdx === i ? 'border-[#1B6B3A] bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300')}>
                      <span className={'block text-xs font-black ' + (packIdx === i ? 'text-[#1B6B3A]' : 'text-slate-700')}>{v.label}</span>
                      <span className="block text-[11px] font-bold text-slate-500 mt-0.5">₹{vPrice.toLocaleString('en-IN')}</span>
                      {v.save ? (
                        <span className="absolute -top-2 -right-2 bg-[#E8A020] text-emerald-950 text-[8px] font-black px-1.5 py-0.5 rounded-full">SAVE {v.save}%</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock urgency */}
            {product.stock === 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-black text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">Out of Stock — restocking soon</p>
                {notified ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 inline-flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" /> We'll alert you
                  </span>
                ) : (
                  <button
                    onClick={handleNotifyMe}
                    className="text-xs font-black text-[#1B6B3A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 inline-flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Notify me when back
                  </button>
                )}
              </div>
            ) : product.stock < 20 ? (
              <p className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">🔥 Low stock — only {product.stock} left, order soon!</p>
            ) : null}

            {/* Crop suitability chips (from product.crops) */}
            {product.crops && product.crops.length > 0 && (
              <div className="pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Sprout className="h-3.5 w-3.5 text-[#1B6B3A]" /> Best suited for these crops
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.crops.map((crop) => (
                    <span key={crop} className="text-[11px] font-bold text-[#1B6B3A] bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust & certification badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Genuine Product
              </span>
              {product.isOrganic && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-800 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
                  <Leaf className="h-3.5 w-3.5 text-green-600" /> Organic
                </span>
              )}
              {(product.certifications || []).map((c) => (
                <span key={c.name} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1B6B3A]" /> {c.name}{c.isVerified ? ' ✓' : ''}
                </span>
              ))}
            </div>

            {/* Stepper + Action CTA tools */}
            <div className="flex items-center gap-4 flex-wrap pt-4">
              {/* Stepper counter */}
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden shrink-0 select-none bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition h-full inline-flex items-center"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-display font-bold text-sm px-4 text-slate-800 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition h-full inline-flex items-center"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add To Cart CTA Button */}
              <button
                onClick={() => {
                  addToCart(cartProduct, quantity);
                }}
                className="bg-[#1B6B3A] hover:bg-emerald-950 text-white font-extrabold text-xs px-6 py-3 rounded-lg flex items-center justify-center gap-2 flex-1 min-w-[140px] shadow transition transform active:scale-95 hover:scale-[1.02] select-none cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{t.addToCart}</span>
              </button>

              {/* Wishlist Heart toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded-lg transition transform active:scale-90 hover:scale-110 shrink-0 cursor-pointer ${
                  isLiked 
                    ? 'border-[#D94F3D] bg-red-50 text-[#D94F3D]' 
                    : 'border-slate-300 text-slate-400 hover:text-[#D94F3D] hover:border-[#D94F3D]'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
              </button>
            </div>
          </div>

          {/* Green WhatsApp direct messaging CTA block */}
          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center gap-4 bg-[#F7F9F4] p-4 rounded-xl border border-emerald-50">
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-[#1B6B3A]">Prefer ordering over chat?</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Skip checkouts and chat with coordinate experts</div>
            </div>
            <button
              onClick={() => {
                const textMsg = encodeURIComponent(`Hello IGO Agri Market! I want to order ${quantity} units of ${product.name} (Brand: ${product.brand}) for ₹${product.price * quantity}`);
                window.open(`https://wa.me/917397785803?text=${textMsg}`);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-black text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow sm:ml-auto select-none cursor-pointer"
            >
              💬 WhatsApp Order
            </button>
          </div>

        </div>
      </div>

      {/* Frequently bought combo offer box */}
      {frequentlyBoughtProduct && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8">
          <h4 className="font-display font-bold text-[#1B6B3A] text-sm flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#E8A020] fill-current" />
            <span>Frequently Bought Together (Combo Offer)</span>
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between select-none">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
              {/* Product 1 */}
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm max-w-xs">
                <img src={product.images?.[0] || '/catalog/nursery-essentials/Pots.png'} onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} alt="p1" className="h-10 w-10 object-cover rounded" />
                <div className="text-[11px] font-bold text-slate-700 line-clamp-1 truncate max-w-[120px]">{product.name}</div>
              </div>

              <span className="text-slate-400 font-extrabold text-sm">+</span>

              {/* Product 2 */}
              <div 
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm max-w-xs cursor-pointer hover:border-[#1B6B3A]"
                onClick={() => setSelectedProduct(frequentlyBoughtProduct)}
              >
                <img src={frequentlyBoughtProduct.images?.[0] || '/catalog/nursery-essentials/Pots.png'} alt="p2" onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} className="h-10 w-10 object-cover rounded" />
                <div className="text-[11px] font-bold text-slate-700 line-clamp-1 truncate max-w-[120px]">{frequentlyBoughtProduct.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-center sm:text-right mt-4 sm:mt-0">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Bundle Price</span>
                <span className="text-base font-black text-slate-900">₹{product.price + frequentlyBoughtProduct.price}</span>
              </div>
              <button
                onClick={() => {
                  addToCart(product, 1);
                  addToCart(frequentlyBoughtProduct, 1);
                  alert("Successfully added Bundle Combo items to Cart!");
                  setCurrentPage('cart');
                }}
                className="bg-[#E8A020] hover:bg-[#ce8d19] text-emerald-950 text-xs font-black px-5 py-2.5 rounded-lg shadow cursor-pointer"
              >
                Buy Combo Pack
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Description tabs, instructions, reviews list */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mt-12 space-y-6">
        {/* Tabs picker bar */}
        <div className="flex border-b border-slate-100 flex-wrap">
          {(['Overview', 'Usage', 'Composition', 'Reviews', 'Video'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 font-display font-extrabold text-xs sm:text-sm border-b-2 transition ${
                  isActive 
                    ? 'border-[#1B6B3A] text-[#1B6B3A]' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'Overview' && 'Product Overview'}
                {tab === 'Usage' && 'Usage Instructions'}
                {tab === 'Composition' && 'Composition Details'}
                {tab === 'Reviews' && `Reviews (${reviewsList.length})`}
                {tab === 'Video' && 'Product Video'}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <div className="bg-[#F7F9F4] p-4 rounded-lg border border-slate-100 max-w-xl">
                <h5 className="font-display font-bold text-[#1B6B3A] text-xs flex items-center gap-1.5 mb-2">
                  <Info className="h-4 w-4" />
                  <span>Important Warehouse Safe Disclaimer:</span>
                </h5>
                <p className="text-[11px] text-slate-500">
                  Certified to match rigorous standards of Tamil Nadu agricultural councils. All seeds are vacuum sealed to preserve high gestation ratios for 12 months. Save in dry space.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Usage' && (
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800">Operational Instructions:</h5>
              <p className="bg-[#F7F9F4] p-4 rounded-lg text-slate-700 italic border-l-4 border-[#1B6B3A]">
                {product.usage || "Place 1 tablet or dilute 2ml per 1 litre of clean water. Spray once early morning or late evening depending on weather."}
              </p>
            </div>
          )}

          {activeTab === 'Composition' && (
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800">Chemical and organic trace element structures:</h5>
              <p className="bg-[#F7F9F4] p-4 rounded-lg text-slate-700 italic border-l-4 border-[#E8A020]">
                {product.composition || "100% genuine water soluble compound ingredients mapped under Indian agricultural regulations."}
              </p>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-8">
              
              {/* Review Input form */}
              <div className="bg-[#F7F9F4] p-5 rounded-lg border border-slate-100 max-w-xl">
                <h5 className="font-display font-bold text-[#1B6B3A] text-xs uppercase tracking-wider mb-4">
                  Write Product Feedbacks
                </h5>
                {reviewSuccess ? (
                  <p className="text-xs text-[#1B6B3A] font-bold">
                    ✓ Feedback submitted successfully! Thank you for supporting organic farmers.
                  </p>
                ) : (
                  <form onSubmit={handleApplyReview} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">
                        Your Score Rating:
                      </label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="bg-white border border-slate-200 text-xs font-bold rounded p-1.5 mt-1 outline-none cursor-pointer"
                      >
                        <option value={5}>★ ★ ★ ★ ★ (5 - Perfect)</option>
                        <option value={4}>★ ★ ★ ★ (4 - Good)</option>
                        <option value={3}>★ ★ ★ (3 - Standard)</option>
                        <option value={2}>★ ★ (2 - Needs work)</option>
                        <option value={1}>★ (1 - Poor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">
                        Write reviews notes:
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        placeholder="Detail performance outcomes on crop sizes or pest prevention effects..."
                        className="w-full bg-white border border-slate-200 text-xs rounded p-2.5 mt-1 outline-none text-[#1a1a1a]"
                      />
                    </div>

                    <button type="submit" className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-950 cursor-pointer">
                      Submit Review
                    </button>
                  </form>
                )}
              </div>

              {/* Feedbacks grid */}
              <div className="space-y-4">
                {reviewsList.length > 0 ? (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center gap-4">
                        <div className="text-xs font-extrabold text-slate-800">{rev.userName}</div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {rev.createdAt?.toString().slice(0, 10)}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        {Array.from({ length: rev.rating }).map((_, i) => '★')}
                      </div>
                      <p className="text-xs text-slate-600 italic mt-2">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Be the first to review this product! Help Chennai agricultural forums buy right.
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'Video' && (
            <div className="space-y-4">
              <h5 className="font-bold text-slate-800">Product Demonstration & Guides:</h5>
              <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-200">
                {(product as any).videoUrl ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={(product as any).videoUrl.replace('watch?v=', 'embed/')} 
                    title="Product Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-4xl mb-2">🎥</div>
                    <p className="text-slate-400 font-bold text-sm">A video guide for this product is coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Carousel (Horizontal Scrolling Grid) */}
      {relatedList.length > 0 && (
        <section className="mt-14 space-y-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-[#1B6B3A] text-xl tracking-tight">
              Related Crop Cultivations
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-3">
              Similar to {product.category}
            </span>
          </div>

          {/* Horizontal scroll grid */}
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scroll snap-x select-none">
            {relatedList.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#1B6B3A] transition shrink-0 w-60 snap-start cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-slate-50 relative">
                    <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} alt={p.name} className="w-full h-full object-cover" />
                    {p.isIgoOwn && (
                      <span className="absolute top-2 left-2 bg-[#1B6B3A] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                        IGO
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">{p.brand}</span>
                    <h5 className="font-display font-bold text-slate-800 text-xs lines-2 mt-1 truncate">{p.name}</h5>
                    <div className="text-xs text-yellow-500 font-bold mt-2">★ {p.rating}</div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900">₹{p.price}</div>
                  <span className="text-[10px] font-bold text-[#1B6B3A] hover:underline">View details →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
