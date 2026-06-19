import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  ArrowLeft,
  Truck,
  FileText,
  ChevronRight,
  ShieldCheck,
  Lock,
  BadgeCheck
} from 'lucide-react';
import { CartItem, Address, Order, OrderItem } from '../types';
import { db, auth } from '../firebase';
import { placeOrder, fetchUserProfile } from '../dbHelper';
import { getSettings } from '../siteConfig';
import { isSignedIn, currentUid, markSignedIn } from '../session';
import {
  saveLocalOrder, decrementStocks, saveLastAddress, getLastAddress,
  playOrderSuccessSound, sendInboxMessage, detectLocation, earnWalletCoins
} from '../storeData';

interface CheckoutComponentProps {
  lang: 'en' | 'ta';
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin' | 'auth') => void;
  couponDiscount: number;
  setCouponDiscount: (d: number) => void;
}

export default function CheckoutComponent({
  lang,
  cart,
  setCart,
  setCurrentPage,
  couponDiscount,
  setCouponDiscount
}: CheckoutComponentProps) {
  // Checkout States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Address, 2: Delivery, 3: Payment, 4: Review

  const saved = getLastAddress();
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || saved?.name || '',
    phone: saved?.phone || '',
    email: auth.currentUser?.email || saved?.email || '',
    address1: saved?.addressLine || '',
    address2: '',
    city: saved?.city || '',
    state: 'Tamil Nadu',
    pincode: saved?.pincode || ''
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) {
        setFormData(f => ({
          ...f,
          name: user.displayName || f.name,
          email: user.email || f.email
        }));
      }
    });
    return () => unsub();
  }, []);

  // Pre-fill the customer's REAL identity from their logged-in profile so the
  // order always carries the correct name / email / phone — instead of a previous
  // device user's saved address (which caused admin to see the wrong customer).
  useEffect(() => {
    fetchUserProfile(currentUid()).then((p) => {
      if (!p) return;
      setFormData((f) => ({
        ...f,
        name: p.name || f.name,
        email: p.email || f.email,
        phone: p.phone || f.phone,
      }));
    }).catch(() => { /* ignore */ });
  }, []);

  const [detectingLoc, setDetectingLoc] = useState(false);

  const handleDetectLocation = async () => {
    setDetectingLoc(true);
    try {
      const loc = await detectLocation();
      setFormData(f => ({
        ...f,
        city: loc.city || f.city,
        pincode: loc.pincode || f.pincode,
        state: loc.state || f.state,
        // Pre-fill the street line with the detected area only if it's still empty.
        address1: f.address1 || (loc.area ? `${loc.area}` : f.address1),
      }));
      // City/State/area filled silently. If pincode couldn't be read, the field
      // simply stays empty for the customer to type — no error popup.
    } catch (e: any) {
      alert(e?.message || 'Could not detect location. Please allow location access and try again.');
    } finally {
      setDetectingLoc(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card' | 'NetBanking'>('COD');
  const DELIVERY_SLOTS = ['Tomorrow, 6–9 AM', 'Tomorrow, 9 AM–12 PM', 'Tomorrow, 4–7 PM', 'Standard (2–4 days)'];
  // Initialise from the slot the customer picked on the cart page (shared key).
  const [deliverySlot, setDeliverySlot] = useState<string>(() => {
    try { return localStorage.getItem('igo_delivery_slot') || DELIVERY_SLOTS[3]; } catch { return DELIVERY_SLOTS[3]; }
  });
  // Keep the shared key in sync so the choice persists if the user returns to cart.
  const chooseSlot = (slot: string) => {
    setDeliverySlot(slot);
    try { localStorage.setItem('igo_delivery_slot', slot); } catch { /* ignore */ }
  };
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderIdCreated, setOrderIdCreated] = useState<string | null>(null);
  const [placedOrderState, setPlacedOrderState] = useState<Order | null>(null);

  // Calculations (delivery/GST controlled from Admin -> Settings)
  const siteSettings = getSettings();
  const subtotal = cart.reduce((sum, item) => sum + (pPrice(item) * item.quantity), 0);
  const deliveryCharge = (subtotal >= siteSettings.freeDeliveryAbove || subtotal === 0) ? 0 : siteSettings.deliveryCharge;
  const gstAmount = Math.round(subtotal * (siteSettings.gstPercent / 100));
  const couponValue = couponDiscount > 0 ? (couponDiscount < 100 ? Math.round(subtotal * (couponDiscount/100)) : couponDiscount) : 0;
  const finalTotal = Math.max(0, subtotal + deliveryCharge + gstAmount - couponValue);

  // COD logic: 20% partial advance required if total > 2000
  const isCodPartialAdvanceRequired = paymentMethod === 'COD' && finalTotal > 2000;
  const codAdvanceAmount = isCodPartialAdvanceRequired ? Math.round(finalTotal * 0.20) : 0;
  const codRemainingAmount = finalTotal - codAdvanceAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.address1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
        alert("Please enter all required address form fields.");
        return;
      }
      if (formData.pincode.length !== 6) {
        alert("Pincode must be exactly 6 digits.");
        return;
      }
    }
    setStep((s) => Math.min(4, s + 1) as any);
  };

  const handlePlaceOrderSubmit = async () => {
    if (cart.length === 0) { alert('Your cart is empty.'); return; }
    // Single-page checkout — validate the address here (no step wizard).
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      alert('Please fill your delivery address: name, phone, address, city and pincode.');
      return;
    }
    if (formData.pincode.length !== 6) { alert('Pincode must be exactly 6 digits.'); return; }
    // Ensure a session so the order links to a customer id — but never block the
    // order: if somehow not signed in, start a local session and continue.
    if (!isSignedIn()) { try { markSignedIn(); } catch { /* ignore */ } }
    setIsPlacing(true);

    const checkAddr: Address = {
      id: 'addr-' + Math.random().toString(36).substring(2, 9),
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      addressLine1: formData.address1,
      addressLine2: formData.address2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    };

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || '/catalog/nursery-essentials/Pots.png'
    }));

    // Generate AGM-YYYYMMDD-XXXXX
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const randStr = Math.floor(10000 + Math.random() * 90000).toString();
    const nextId = `AGM-${dateStr}-${randStr}`;
    const currUid = currentUid();

    const placedOrder: Order = {
      id: nextId,
      userId: currUid,
      items: orderItems,
      totalAmount: finalTotal,
      paymentMethod,
      status: 'Placed',
      deliveryAddress: checkAddr,
      createdAt: new Date().toISOString(),
      phone: formData.phone,
      deliverySlot,
    };

    const finalizeOrder = () => {
      // Show success immediately — any side-effect below is best-effort only.
      setOrderIdCreated(nextId);
      setPlacedOrderState(placedOrder);
      setCart([]);
      setCouponDiscount(0);
      try { saveLocalOrder(placedOrder); } catch { /* ignore */ }
      try {
        saveLastAddress({
          name: formData.name, phone: formData.phone, email: formData.email,
          addressLine: formData.address1, city: formData.city, pincode: formData.pincode,
        });
      } catch { /* ignore */ }
      try { decrementStocks(orderItems.map(i => ({ productId: i.productId, quantity: i.quantity })), cart.map(c => c.product)); } catch { /* ignore */ }
      try {
        sendInboxMessage({
          toEmail: formData.email || 'all',
          title: 'Order ' + nextId + ' placed successfully 🎉',
          body: 'Hi ' + formData.name + ', we received your order of ' + orderItems.length + ' item(s) worth ₹' + finalTotal.toLocaleString('en-IN') + '. Delivery slot: ' + deliverySlot + '. We will confirm and dispatch it shortly. Track it anytime from My Orders.',
          orderId: nextId,
        });
      } catch { /* ignore */ }
      try { playOrderSuccessSound(); } catch { /* ignore */ }
      try { earnWalletCoins(finalTotal * 0.02); } catch { /* ignore */ }
    };

    // Finalize FIRST (synchronously, within the click) so the success screen and
    // the order-placed sound fire while the browser still allows audio. Then save
    // to Supabase in the background — the order is already placed locally.
    finalizeOrder();
    setIsPlacing(false);
    try { placeOrder(placedOrder).catch(() => { /* offline/RLS — saved locally */ }); } catch { /* ignore */ }
  };

  if (orderIdCreated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-5">
        <div className="text-center space-y-3">
          <img src="/images/logo.jpg" alt="IGO Agri Mart" className="h-14 w-14 rounded-xl object-cover mx-auto shadow" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="inline-flex h-14 w-14 bg-emerald-50 text-emerald-700 rounded-full items-center justify-center border border-emerald-100 mx-auto">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your order ID is <strong className="text-[#1B6B3A] font-black">{orderIdCreated}</strong>. We'll pack and dispatch your items shortly — track it anytime in My Dashboard.
          </p>
        </div>

        {/* Ordered products + slot summary */}
        {placedOrderState && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-slate-800 text-sm">Order Summary</span>
              <span className="text-[11px] font-bold text-[#1B6B3A] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">{placedOrderState.deliverySlot || 'Standard'}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {placedOrderState.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <img src={it.image} alt="" className="h-10 w-10 rounded-lg object-cover border" onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.jpg'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{it.name}</div>
                    <div className="text-[10px] text-slate-400">Qty {it.quantity} x Rs.{it.price}</div>
                  </div>
                  <div className="text-xs font-black text-slate-700">Rs.{(it.price * it.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-black text-slate-700">Total Paid</span>
              <span className="font-display font-black text-lg text-[#1B6B3A]">Rs.{placedOrderState.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 text-center">Payment: {placedOrderState.paymentMethod} · Delivery slot: {placedOrderState.deliverySlot || 'Standard'}</div>
          </div>
        )}

        {isCodPartialAdvanceRequired && (
          <div className="bg-[#fff9eb] border border-dashed border-[#ffe09e] text-amber-950 p-4 rounded-xl text-left max-w-md mx-auto space-y-2">
            <h4 className="font-bold text-xs text-amber-800 flex items-center gap-1.5 leading-none">
              <Truck className="h-4.5 w-4.5" />
              <span>COD Partial 20% Advance Triggered</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              For security on large orders exceeding ₹2000, please complete the ₹{codAdvanceAmount} partial advance transfer. The remaining cash of ₹{codRemainingAmount} is payable to the courier boy on delivery.
            </p>
            <div className="flex justify-between items-baseline pt-2 text-xs font-bold border-t border-amber-200">
              <span>Advance Payable UPI:</span>
              <strong className="text-emerald-950">917397785803@upi</strong>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => { setCurrentPage('home'); }}
            className="bg-[#1B6B3A] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-emerald-900 cursor-pointer"
          >
            Back to Home Market
          </button>
          <button
            onClick={() => { setCurrentPage('account'); }}
            className="bg-[#F7F9F4] text-[#1B6B3A] text-xs font-bold px-5 py-2.5 rounded-lg border border-slate-200 cursor-pointer"
          >
            Track in My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9F4] via-white to-emerald-50/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Return Page Link Row */}
      <button
        onClick={() => setCurrentPage('cart')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#1B6B3A] font-bold select-none cursor-pointer mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Cart</span>
      </button>

      <div className="flex items-center gap-3.5 mb-7">
        <div className="h-12 w-12 rounded-2xl bg-[#1B6B3A] text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h2 id="checkout-title" className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">
            Secure Checkout
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-[#1B6B3A]" /> Encrypted &amp; safe — complete everything on one page and place your order.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Single-page checkout — all sections shown at once */}
          <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-xl space-y-8">

            {(
              <div className="space-y-6 animate-fade-in">
                <h3 className="font-display font-bold text-[#1B6B3A] text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="h-5 w-5" />
                  <span>1. Shipping & Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Consignee Full name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Shanmuga Sundaram"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Secure Phone Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 7397785803"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Email Address (for order updates)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. farmer@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div className="sm:col-span-2 -mb-2">
                    <button type="button" onClick={handleDetectLocation} disabled={detectingLoc}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#1B6B3A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-lg transition disabled:opacity-60">
                      📍 {detectingLoc ? 'Detecting your location...' : 'Use my current location (auto-fill city & pincode)'}
                    </button>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleInputChange}
                      placeholder="e.g. No. 17 Kovalan Street, Uthandi"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      placeholder="e.g. Kanathur, close to beach line"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Chennai"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] cursor-pointer"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 600119"
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg outline-none text-[#1a1a1a] focus:border-[#1B6B3A]"
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            )}

            {(
              <div className="space-y-6 animate-fade-in">
                <h3 className="font-display font-bold text-[#1B6B3A] text-sm flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <Truck className="h-5 w-5" />
                  <span>2. Choose a Delivery Slot</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5 mb-2">
                  {DELIVERY_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => chooseSlot(slot)}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition ${deliverySlot === slot
                        ? 'border-[#1B6B3A] bg-emerald-50/40 text-[#1B6B3A]'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-2">Fresh produce ships next-day; inputs &amp; tools ship standard.</p>
                
              </div>
            )}

            {(
              <div className="space-y-6 animate-fade-in">
                <h3 className="font-display font-bold text-[#1B6B3A] text-sm flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
                  <CreditCard className="h-5 w-5" />
                  <span>3. Select Payment Methods</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cash on Delivery option */}
                  <label className={`border-2 p-4 rounded-xl flex items-start gap-3 cursor-pointer select-none transition ${paymentMethod === 'COD' ? 'border-[#1B6B3A] bg-emerald-50/20' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 text-[#1B6B3A] focus:ring-[#1B6B3A] h-3.5 w-3.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Pay standard cash value upon arrival</div>
                    </div>
                  </label>

                  {/* UPI option */}
                  <label className={`border-2 p-4 rounded-xl flex items-start gap-3 cursor-pointer select-none transition ${paymentMethod === 'UPI' ? 'border-[#1B6B3A] bg-emerald-50/20' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 text-[#1B6B3A] focus:ring-[#1B6B3A] h-3.5 w-3.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">UPI Instant Payments</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Pay via GPay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className={`border-2 p-4 rounded-xl flex items-start gap-3 cursor-pointer select-none transition ${paymentMethod === 'NetBanking' ? 'border-[#1B6B3A] bg-emerald-50/20' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'NetBanking'}
                      onChange={() => setPaymentMethod('NetBanking')}
                      className="mt-1 text-[#1B6B3A] focus:ring-[#1B6B3A] h-3.5 w-3.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Net Banking online transfer</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">All certified Indian retail banks supported</div>
                    </div>
                  </label>

                  {/* Credit Debit Cards */}
                  <label className={`border-2 p-4 rounded-xl flex items-start gap-3 cursor-pointer select-none transition ${paymentMethod === 'Card' ? 'border-[#1B6B3A] bg-emerald-50/20' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="mt-1 text-[#1B6B3A] focus:ring-[#1B6B3A] h-3.5 w-3.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Card Payment (Visa/Rupay)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Encrypted domestic card routing gateways</div>
                    </div>
                  </label>
                </div>

                {/* Cash On Delivery Advance Rule check */}
                {isCodPartialAdvanceRequired && (
                  <div className="bg-[#fff9eb] border border-[#ffe09e] text-amber-800 p-4 rounded-xl mt-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 leading-none">
                      <Truck className="h-4.5 w-4.5 text-[#E8A020]" />
                      <span>⚠️ Security COD Policy: 20% Advance Trigger</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Orders exceeding ₹2000 require a <strong>20% partial advance confirmation payment</strong> (₹{codAdvanceAmount}) through UPI. Rest ₹{codRemainingAmount} collected upon delivery courier. This inhibits fake bulk bookings.
                    </p>
                  </div>
                )}
                
              </div>
            )}

            {(
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-display font-bold text-[#1B6B3A] text-sm flex items-center gap-2 pb-3 border-b border-slate-100 mb-1">
                  <FileText className="h-5 w-5" />
                  <span>4. Review &amp; Confirm Order</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shipping address card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                      <span className="h-7 w-7 rounded-full bg-emerald-50 text-[#1B6B3A] flex items-center justify-center"><MapPin className="h-4 w-4" /></span>
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-700">Shipping To</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">{formData.name}</p>
                    <p className="text-[11px] font-bold text-slate-500 mb-1.5">{formData.phone}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{formData.address1}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>

                  {/* Delivery & payment card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                      <span className="h-7 w-7 rounded-full bg-amber-50 text-[#E8A020] flex items-center justify-center"><Truck className="h-4 w-4" /></span>
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-700">Delivery &amp; Payment</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">Payment</span>
                      <span className="ml-auto text-xs font-extrabold text-slate-900">{paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">Slot</span>
                      <span className="ml-auto text-[11px] font-bold text-[#1B6B3A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{deliverySlot}</span>
                    </div>
                  </div>
                </div>

                {/* Total + trust strip */}
                <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#1B6B3A]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>100% secure checkout</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Total payable</span>
                    <span className="font-display font-black text-xl text-[#1B6B3A]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrderSubmit}
                  disabled={isPlacing || cart.length === 0}
                  className="w-full bg-[#1b6b3a] hover:bg-emerald-950 text-white font-black text-sm py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg relative cursor-pointer disabled:opacity-60 transition"
                >
                  {isPlacing ? 'Placing Order to Warehouse…' : (<><CheckCircle className="h-5 w-5" /><span>Confirm &amp; Place Order · ₹{finalTotal.toLocaleString('en-IN')}</span></>)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column sticky layout summary */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-[120px]">
          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
            <h4 className="font-display font-extrabold text-slate-800 text-sm">Purchase Items</h4>
            
            <div className="space-y-3 max-h-56 overflow-y-auto custom-scroll border-b border-slate-100 pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.product.images?.[0] || '/catalog/nursery-essentials/Pots.png'} onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} alt="" className="h-9 w-9 object-cover rounded border" />
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-slate-800 line-clamp-1 truncate max-w-[140px]">{item.product.name}</div>
                    <div className="text-[10px] text-slate-400">Qty: {item.quantity} x ₹{item.product.price}</div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{siteSettings.gstPercent}% AG-GST:</span>
                <span>+ ₹{gstAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee:</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `+ ₹${deliveryCharge}`}</span>
              </div>
              {couponValue > 0 && (
                <div className="flex justify-between text-[#D94F3D]">
                  <span>Discount:</span>
                  <span>- ₹{couponValue}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Total Payable</span>
              <span className="font-display font-black text-2xl text-[#1B6B3A]">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: ShieldCheck, t: 'Secure' },
                { icon: BadgeCheck, t: 'Genuine' },
                { icon: Truck, t: 'Fast Delivery' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg py-2">
                  <b.icon className="h-4 w-4 text-[#1B6B3A]" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">{b.t}</span>
                </div>
              ))}
            </div>

            {isCodPartialAdvanceRequired && (
              <div className="pt-2 border-t border-dashed border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>20% UPI Advance:</span>
                  <strong className="text-amber-600">₹{codAdvanceAmount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payable on COD:</span>
                  <strong className="text-[#1B6B3A]">₹{codRemainingAmount}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

function pPrice(item: CartItem): number {
  return item.product?.price || 0;
}
