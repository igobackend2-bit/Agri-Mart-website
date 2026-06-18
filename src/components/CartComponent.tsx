import React, { useState } from 'react';
import { 
  Trash2, 
  ChevronRight, 
  ShoppingBag, 
  Tag, 
  Plus, 
  Minus,
  Truck,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { CartItem } from '../types';
import { translations, LanguageDict } from '../translation';
import { getSettings, validateCoupon } from '../siteConfig';
import { isSignedIn } from '../session';

interface CartComponentProps {
  lang: 'en' | 'ta';
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin') => void;
  couponDiscount: number;
  setCouponDiscount: (d: number) => void;
}

export default function CartComponent({
  lang,
  cart,
  setCart,
  setCurrentPage,
  couponDiscount,
  setCouponDiscount
}: CartComponentProps) {
  const t: LanguageDict = translations[lang];
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // Delivery slot — chosen here and carried into checkout via a shared key.
  // (Must match the slots listed in CheckoutComponent so the choice highlights.)
  const DELIVERY_SLOTS = ['Tomorrow, 6–9 AM', 'Tomorrow, 9 AM–12 PM', 'Tomorrow, 4–7 PM', 'Standard (2–4 days)'];
  const [deliverySlot, setDeliverySlot] = useState<string>(() => {
    try { return localStorage.getItem('igo_delivery_slot') || DELIVERY_SLOTS[3]; } catch { return DELIVERY_SLOTS[3]; }
  });
  const chooseSlot = (slot: string) => {
    setDeliverySlot(slot);
    try { localStorage.setItem('igo_delivery_slot', slot); } catch { /* ignore */ }
  };

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('igo_agrimart_saved_for_later');
    return cached ? JSON.parse(cached) : [];
  });

  const saveToLater = (item: CartItem) => {
    const newSaved = [...savedForLater, item];
    setSavedForLater(newSaved);
    localStorage.setItem('igo_agrimart_saved_for_later', JSON.stringify(newSaved));
    setCart(cart.filter(c => c.id !== item.id));
  };

  const moveToCart = (item: CartItem) => {
    setCart([...cart, item]);
    const newSaved = savedForLater.filter(c => c.id !== item.id);
    setSavedForLater(newSaved);
    localStorage.setItem('igo_agrimart_saved_for_later', JSON.stringify(newSaved));
  };

  const deleteSavedItem = (id: string) => {
    const newSaved = savedForLater.filter(item => item.id !== id);
    setSavedForLater(newSaved);
    localStorage.setItem('igo_agrimart_saved_for_later', JSON.stringify(newSaved));
  };

  // Calculations (delivery/GST controlled from Admin → Settings)
  const siteSettings = getSettings();
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const deliveryCharge = (subtotal >= siteSettings.freeDeliveryAbove || subtotal === 0) ? 0 : siteSettings.deliveryCharge;

  const gstAmount = Math.round(subtotal * (siteSettings.gstPercent / 100));
  
  const couponValue = couponDiscount > 0 ? (couponDiscount < 100 ? Math.round(subtotal * (couponDiscount/100)) : couponDiscount) : 0;
  const finalTotal = Math.max(0, subtotal + deliveryCharge + gstAmount - couponValue);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
  };

  const deleteItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    // Validates against admin-created coupons (Admin → Coupons) + legacy built-ins
    const result = validateCoupon(code, subtotal);
    if (result.ok) {
      setCouponDiscount(result.discount);
      setCouponSuccess(result.message);
    } else {
      setCouponError(result.message);
    }
  };

  // Render Cart Item rows
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-[#1B6B3A] text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h2 id="cart-title" className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">
              Your Cart
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Review your items, then proceed to a quick, secure checkout.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-black text-[#1B6B3A] bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left list table */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const p = item.product;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-5 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} alt={p.name} className="h-16 w-16 object-cover rounded-lg border border-slate-100" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none block">{p.brand}</span>
                      <h4 className="font-display font-bold text-slate-800 text-sm line-clamp-1 mt-1">{p.name}</h4>
                      <p className="text-[11px] text-[#1B6B3A] font-semibold mt-0.5">{p.subcategory}</p>
                    </div>
                  </div>

                  {/* Quantity Stepper controllers */}
                  <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 px-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 h-full inline-flex items-center"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-display font-bold text-xs text-slate-700 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 px-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 h-full inline-flex items-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Costing values pricing metrics */}
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Unit: ₹{p.price}</div>
                      <div className="font-display font-extrabold text-slate-900 text-sm">
                        ₹{p.price * item.quantity}
                      </div>
                    </div>

                    {/* Delete and Save buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-[#D94F3D] hover:bg-red-50 rounded-lg transition"
                        title="Remove article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => saveToLater(item)}
                        className="p-1.5 text-slate-400 hover:text-[#1B6B3A] hover:bg-emerald-50 rounded-lg transition"
                        title="Save for later"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free shipping alert banner trigger */}
            {subtotal < siteSettings.freeDeliveryAbove && subtotal > 0 && (
              <div className="bg-[#fff9eb] border border-[#ffe09e] text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 mt-4">
                <Truck className="h-5 w-5 text-[#E8A020] shrink-0" />
                <div className="text-xs font-semibold leading-relaxed">
                  {t.freeShippingAlert.replace('{amount}', (siteSettings.freeDeliveryAbove - subtotal).toString())} (Standard courier is available for small packages!)
                </div>
              </div>
            )}

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-display font-extrabold text-[#1B6B3A] text-lg mb-4 flex items-center gap-2">
                  <Bookmark className="h-5 w-5" /> Saved for Later ({savedForLater.length})
                </h3>
                <div className="space-y-4">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-5 opacity-75 hover:opacity-100 transition">
                      <div className="flex items-center gap-4">
                        <img src={item.product.images?.[0] || '/catalog/nursery-essentials/Pots.png'} alt={item.product.name} className="h-12 w-12 object-cover rounded-lg" />
                        <div>
                          <h4 className="font-display font-bold text-slate-800 text-xs">{item.product.name}</h4>
                          <div className="text-[10px] text-slate-500 font-bold mt-1">₹{item.product.price}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveToCart(item)} className="text-[10px] font-bold text-[#1B6B3A] bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100">
                          Move to Cart
                        </button>
                        <button onClick={() => deleteSavedItem(item.id)} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded hover:bg-slate-100 hover:text-[#D94F3D]">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Summary column */}
          <div className="space-y-6">

            {/* Delivery slot picker card */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Truck className="h-4 w-4 text-[#1B6B3A]" />
                <span>Choose Delivery Slot</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {DELIVERY_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => chooseSlot(slot)}
                    className={`text-left px-3 py-2 rounded-lg text-[11px] font-bold border-2 transition ${deliverySlot === slot
                      ? 'border-[#1B6B3A] bg-emerald-50/50 text-[#1B6B3A]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2.5">Fresh produce ships next-day; inputs &amp; tools ship standard.</p>
            </div>

            {/* Promo coupon form card */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Tag className="h-4 w-4 text-[#1B6B3A]" />
                <span>Apply Promo Coupon</span>
              </h4>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="bg-slate-50 border border-slate-200 uppercase px-3 py-2 text-xs font-bold rounded-lg flex-1 outline-none text-[#1a1a1a]"
                />
                <button type="submit" className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-900 cursor-pointer">
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[10px] text-[#D94F3D] font-bold mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-700 font-bold mt-2">{couponSuccess}</p>}
              {couponDiscount > 0 && (
                <div className="mt-3 flex gap-2 items-center bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-2 py-1 rounded w-fit">
                  <Sparkles className="h-3 w-3 inline" />
                  <span>Promo {couponDiscount}% Applied</span>
                </div>
              )}
            </div>

            {/* Calculations summaries panel */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4">
              <h4 className="font-display font-extrabold text-slate-800 text-sm">Order Summary</h4>
              
              <div className="space-y-2.5 text-xs text-slate-500 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal Value:</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{siteSettings.gstPercent}% AG-GST:</span>
                  <span className="font-bold text-slate-800">+ ₹{gstAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Surcharges:</span>
                  <span className="font-bold text-slate-800">
                    {deliveryCharge === 0 ? 'FREE' : `+ ₹${deliveryCharge}`}
                  </span>
                </div>
                {couponValue > 0 && (
                  <div className="flex justify-between text-[#D94F3D]">
                    <span>Coupon Deductions:</span>
                    <span className="font-bold">- ₹{couponValue}</span>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-extrabold text-slate-800">Total Net Amount:</span>
                <span className="font-display font-black text-2xl text-[#1B6B3A]">₹{finalTotal}</span>
              </div>

              {/* CTA proced to checkout */}
              <div className="pt-4 space-y-2.5">
                <button
                  onClick={() => {
                    // Require sign-in before checkout so the order links to the
                    // customer's account. After login the user returns to the cart.
                    if (!isSignedIn()) {
                      try { localStorage.setItem('igo_resume', 'cart'); } catch { /* ignore */ }
                      setCurrentPage('auth');
                    } else {
                      setCurrentPage('checkout');
                    }
                  }}
                  className="w-full bg-[#1b6b3a] hover:bg-emerald-950 text-white font-black text-xs py-3 rounded-lg text-center flex items-center justify-center gap-1.5 shadow select-none cursor-pointer border border-[#248F4E]"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setCurrentPage('category')}
                  className="w-full bg-[#F7F9F4] text-[#1B6B3A] hover:bg-[#eaf0e3] font-bold text-xs py-2.5 rounded-lg text-center select-none cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 text-center py-24 rounded-xl space-y-4">
          <div className="text-slate-300 transform scale-150 text-3xl">🛒</div>
          <h4 className="font-display font-black text-slate-700 text-sm">Your Farming Cart is Empty</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't loaded any agricultural seed kits, organic composts, or farm implements to your checkout basket yet.
          </p>
          <button
            onClick={() => setCurrentPage('category')}
            className="bg-[#1B6B3A] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-emerald-900 transition mt-2 cursor-pointer"
          >
            Go Shop Products
          </button>
        </div>
      )}

    </div>
  );
}
