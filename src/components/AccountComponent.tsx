import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  User, 
  X, 
  ChevronRight, 
  HelpCircle, 
  Trash2, 
  FileCheck,
  Award,
  Calendar,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Product, Order, UserProfile, Address } from '../types';
import { fetchUserOrders, cancelUserOrder, fetchUserProfile } from '../dbHelper';
import { currentUid, clearSession } from '../session';
import { getLocalOrders, getInbox, markInboxRead, unreadInboxCount, deleteInboxMessage, InboxMessage, getWalletCoins, mergeOrdersByStatus, sendInboxMessage } from '../storeData';
import { captureLead } from '../leads';
import { Inbox as InboxIcon, Mail, Home, Store, ShoppingCart } from 'lucide-react';

interface AccountComponentProps {
  lang: 'en' | 'ta';
  allProducts: Product[];
  userProfile: UserProfile | null;
  setUserProfile: (u: UserProfile | null) => void;
  setCurrentPage: (p: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'account' | 'admin') => void;
  setSelectedProduct: (p: Product) => void;
  addToCart: (p: Product) => void;
}

const accountTranslations = {
  en: {
    orders: 'My Agri Orders',
    wishlist: 'Farming Wishlist',
    addresses: 'Saved Addresses',
    profile: 'Personal Profile',
    dashboard: 'Farmer Guest',
    customer: 'Customer',
    ordersHeader: 'Your Agri Orders',
    ordersSub: 'Track warehouse logistics status on your ordered items',
    loadingOrders: 'Loading order databases... Please hold.',
    noOrders: 'No orders checked out yet. Place your initial agritech checkout!',
    orderRef: 'Order Reference #',
    checkoutDate: 'Checkout Date',
    method: 'Method',
    netValue: 'Net Value',
    cancelOrder: 'Cancel Agri Order',
    favoritePlants: 'Your Favorite Plants',
    favoriteSub: 'Directly monitor and add items from your likes drawer',
    addToBasket: '+ Add to Basket',
    emptyWishlist: 'Wishlist contains 0 items. Tap those green hearts on product grids!',
    shippingHeader: 'Saved Shipping Addresses',
    shippingSub: 'Set up defaults for snappy e-commerce checkout checkouts',
    addAddressBtn: '+ Add Address',
    cancelAddBtn: 'Cancel Add',
    billingFormHeader: 'Billing & Shipping Form',
    consigneeName: 'Consignee Name *',
    phone: 'Phone * (e.g. 7397785803)',
    address1: 'Address Line 1 *',
    address2: 'Address Line 2 (Optional)',
    city: 'City *',
    pincode: '6-Digit Pincode *',
    saveBtn: 'Save Address',
    noAddresses: 'No addresses saved. Setup shipping default coordinates above.',
    profileHeader: 'Personal Profile',
    profileSub: 'Manage your personal information and login details',
    farmerName: 'Full Name',
    registeredEmail: 'Email Address',
    roleStatus: 'Account Type',
    gateway: 'Account',
    confirmCancel: 'Are you sure you want to cancel this agricultural order?',
    addressSuccess: 'Address successfully saved to your profile!',
    addressVarRequired: 'Please enter all required address variables.',
  },
  ta: {
    orders: 'எனது விவசாய ஆர்டர்கள்',
    wishlist: 'விவசாய விருப்பப்பட்டியல்',
    addresses: 'சேமிக்கப்பட்ட முகவரிகள்',
    profile: 'தனிப்பட்ட சுயவிவரம்',
    dashboard: 'விவசாயி விருந்தினர்',
    customer: 'வாடிக்கையாளர்',
    ordersHeader: 'உங்கள் விவசாய ஆர்டர்கள்',
    ordersSub: 'ஆர்டர் செய்யப்பட்ட பொருட்களின் கிடங்கு தளவாட நிலையை கண்காணிக்கவும்',
    loadingOrders: 'ஆர்டர் தரவுத்தளங்கள் ஏற்றப்படுகின்றன... தயவுசெய்து காத்திருக்கவும்.',
    noOrders: 'இன்னும் ஆர்டர்கள் எதுவும் செய்யப்படவில்லை. உங்கள் முதல் விவசாய ஆர்டரைச் செய்யுங்கள்!',
    orderRef: 'ஆர்டர் குறிப்பு எண் #',
    checkoutDate: 'ஆர்டர் செய்த தேதி',
    method: 'கட்டண முறை',
    netValue: 'நிகர மதிப்பு',
    cancelOrder: 'ஆர்டரை ரத்து செய்',
    favoritePlants: 'உங்களுக்கு பிடித்த பயிர்கள்',
    favoriteSub: 'உங்களுக்கு பிடித்த பொருட்களின் பட்டியலை நேரடியாக கண்காணித்து சேர்க்கவும்',
    addToBasket: '+ கூடையில் சேர்',
    emptyWishlist: 'விருப்பப்பட்டியலில் 0 பொருட்கள் உள்ளன. தயாரிப்பு பட்டியலில் உள்ள பச்சை இதயங்களை அழுத்தவும்!',
    shippingHeader: 'சேமிக்கப்பட்ட விநியோக முகவரிகள்',
    shippingSub: 'விரைவான ஆர்டர்களுக்கான முகவரி விவரங்களை அமைக்கவும்',
    addAddressBtn: '+ முகவரியைச் சேர்',
    cancelAddBtn: 'சேர்ப்பதை ரத்துசெய்',
    billingFormHeader: 'விநியோக முகவரி படிவம்',
    consigneeName: 'பெறுநர் பெயர் *',
    phone: 'தொலைபேசி எண் * (எ.கா. 7397785803)',
    address1: 'முகவரி வரி 1 *',
    address2: 'முகவரி வரி 2 (விருப்பத்திற்குரியது)',
    city: 'நகரம் *',
    pincode: '6-இலக்க பின்கோடு *',
    saveBtn: 'முகவரியைச் சேமி',
    noAddresses: 'முகவரிகள் எதுவும் சேமிக்கப்படவில்லை. மேலே உங்கள் தற்போதைய முகவரியைச் சேர்க்கவும்.',
    profileHeader: 'தனிப்பட்ட சுயவிவர விவரங்கள்',
    profileSub: 'டிஜிட்டல் உள்நுழைவு அங்கீகார விவரங்களை கண்காணிக்கவும்',
    farmerName: 'விவசாயி பெயர்',
    registeredEmail: 'பதிவு செய்யப்பட்ட மின்னஞ்சல்',
    roleStatus: 'அட்மின் அணுகல் நிலை',
    gateway: 'கணக்கு நுழைவாயில்',
    confirmCancel: 'இந்த விவசாய ஆர்டரை ரத்து செய்ய விரும்புகிறீர்களா என்பதில் உறுதியாக இருக்கிறீர்களா?',
    addressSuccess: 'முகவரி உங்கள் சுயவிவரத்தில் வெற்றிகரமாக சேமிக்கப்பட்டது!',
    addressVarRequired: 'தேவையான அனைத்து முகவரி விவரங்களையும் உள்ளிடவும்.',
  }
};

export default function AccountComponent({
  lang,
  allProducts,
  userProfile,
  setUserProfile,
  setCurrentPage,
  setSelectedProduct,
  addToCart
}: AccountComponentProps) {
  const t = accountTranslations[lang];
  const [activeTab, setActiveTab] = useState<'Orders' | 'Inbox' | 'Wishlist' | 'Addresses' | 'Profile' | 'Support'>(() => {
    const saved = sessionStorage.getItem('igo_account_tab');
    if (saved) {
      sessionStorage.removeItem('igo_account_tab');
      return saved as any;
    }
    return 'Profile';
  });
  const [inboxMsgs, setInboxMsgs] = useState<InboxMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address add form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: ''
  });

  // Safety net: if the account opens without a profile in memory, load it from
  // the session id (Supabase or local mirror) so the customer always sees it.
  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile(currentUid()).then((p) => { if (p) setUserProfile(p); }).catch(() => { /* ignore */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pull orders when account opens, then poll so admin status changes (shipping,
  // packed, delivered…) appear live without a manual refresh.
  useEffect(() => {
    let active = true;
    const loadOrders = (showSpinner: boolean) => {
      const local = getLocalOrders();
      if (userProfile?.uid) {
        if (showSpinner) setIsLoadingOrders(true);
        fetchUserOrders(userProfile.uid)
          .then((items) => {
            if (!active) return;
            // Most-progressed status wins, so admin updates (local or cloud) show.
            setOrders(mergeOrdersByStatus(items, local));
            setIsLoadingOrders(false);
          })
          .catch(() => {
            if (!active) return;
            setOrders(mergeOrdersByStatus(local));
            setIsLoadingOrders(false);
          });
      } else {
        setOrders(local);
      }
    };
    loadOrders(true);
    setInboxMsgs(getInbox(userProfile?.email));
    const interval = setInterval(() => loadOrders(false), 8000);
    return () => { active = false; clearInterval(interval); };
  }, [userProfile]);

  // Mark inbox read when opened
  useEffect(() => {
    if (activeTab === 'Inbox') {
      markInboxRead(userProfile?.email);
      setInboxMsgs(getInbox(userProfile?.email));
    }
  }, [activeTab]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(t.confirmCancel)) return;
    try {
      await cancelUserOrder(orderId);
      // Refresh order list
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    } catch {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    }
  };

  const handleDeleteMsg = (id: string) => {
    deleteInboxMessage(id);
    setInboxMsgs(getInbox(userProfile?.email));
  };

  // Order-status line for the notification list.
  const orderStatusLine = (s: string): string => ({
    Placed: 'We received your order and will confirm it shortly.',
    Confirmed: 'Your order is confirmed and being prepared.',
    Packed: 'Your order is packed and ready to ship.',
    Shipped: 'Your order has shipped — on its way!',
    Dispatched: 'Your order has been dispatched — on its way!',
    Delivered: 'Your order has been delivered. Thank you!',
    Cancelled: 'Your order was cancelled. Any prepayment will be refunded.',
  } as Record<string, string>)[s] || ('Your order status is now ' + s + '.');

  const handleLogout = async () => {
    try { await signOut(auth); } catch { /* local session — ignore */ }
    clearSession();
    setUserProfile(null);
    setCurrentPage('home');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address1.trim() || !newAddress.city.trim() || !newAddress.pincode.trim()) {
      alert(t.addressVarRequired);
      return;
    }
    const created: Address = {
      id: 'addr-' + Math.random().toString(36).substring(2, 9),
      name: newAddress.name,
      phone: newAddress.phone,
      addressLine1: newAddress.address1,
      addressLine2: newAddress.address2,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode
    };

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        addresses: [...(userProfile.addresses || []), created] 
      };
      setUserProfile(updatedProfile);
      setShowAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: ''
      });
      alert(t.addressSuccess);
    }
  };

  const removeAddress = (addrId: string) => {
    if (userProfile) {
      const filtered = userProfile.addresses.filter(x => x.id !== addrId);
      setUserProfile({ ...userProfile, addresses: filtered });
    }
  };

  // Resolve products in wishlist
  const wishlistProducts = allProducts.filter(p => userProfile?.wishlist?.includes(p.id));

  // Determine status stepper step
  const getStatusStep = (status: string) => {
    const norm = (status || '').toLowerCase();
    if (norm === 'placed' || norm === 'pending') return 1;
    if (norm === 'confirmed') return 2;
    if (norm === 'packed') return 3;
    if (norm === 'shipped' || norm === 'dispatched') return 4;
    if (norm === 'delivered') return 5;
    return 0; // Cancelled
  };

  const stepperSteps = [
    { label: lang === 'ta' ? 'வைக்கப்பட்டது' : 'Placed', step: 1 },
    { label: lang === 'ta' ? 'உறுதி' : 'Confirmed', step: 2 },
    { label: lang === 'ta' ? 'பேக் செய்யப்பட்டது' : 'Packed', step: 3 },
    { label: lang === 'ta' ? 'அனுப்பப்பட்டது' : 'Shipped', step: 4 },
    { label: lang === 'ta' ? 'சேர்க்கப்பட்டது' : 'Delivered', step: 5 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left column Dashboard navigation selectors */}
        <div className="w-full lg:col-span-1 lg:max-w-[280px] bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm select-none">
          <div className="flex items-center gap-3 bg-[#F7F9F4] p-3.5 rounded-xl border border-slate-100 mb-2">
            <div className="h-10 w-10 bg-[#1B6B3A] text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-emerald-100 shadow-sm shrink-0">
              {userProfile?.name?.charAt(0) || 'F'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-800 truncate leading-none mb-1">
                {userProfile?.name || t.dashboard}
              </div>
              <span className="text-[10px] bg-yellow-105 bg-amber-50 text-[#E8A020] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border border-amber-200/50">
                {userProfile?.role || t.customer}
              </span>
            </div>
          </div>

          {/* Quick store navigation */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { icon: Home, label: lang === 'ta' ? 'முகப்பு' : 'Home', page: 'home' },
              { icon: Store, label: lang === 'ta' ? 'கடை' : 'Shop', page: 'category' },
              { icon: ShoppingCart, label: lang === 'ta' ? 'கார்ட்' : 'Cart', page: 'cart' },
            ] as const).map((n) => {
              const NIcon = n.icon;
              return (
                <button
                  key={n.page}
                  onClick={() => setCurrentPage(n.page)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#1B6B3A] hover:bg-emerald-50 text-slate-600 hover:text-[#1B6B3A] transition"
                >
                  <NIcon className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-wide">{n.label}</span>
                </button>
              );
            })}
          </div>

          {/* IGO Coins wallet — loyalty reward */}
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/60 rounded-xl px-3.5 py-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">IGO Coins</span>
              </div>
              <span className="text-sm font-black text-[#1B6B3A]">{getWalletCoins().toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
              You earn IGO Coins worth <span className="font-bold text-slate-700">2% of every order</span> — 1 Coin = ₹1. Your balance is worth <span className="font-bold text-[#1B6B3A]">₹{getWalletCoins().toLocaleString('en-IN')}</span> in discounts on future orders.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {([
              { key: 'Profile', icon: User, label: t.profile },
              { key: 'Orders', icon: ShoppingBag, label: t.orders },
              { key: 'Inbox', icon: InboxIcon, label: 'Inbox' },
              { key: 'Wishlist', icon: Heart, label: t.wishlist },
              { key: 'Addresses', icon: MapPin, label: t.addresses },
              { key: 'Support', icon: HelpCircle, label: 'Support Tickets' }
            ] as const).map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left p-3 rounded-lg text-xs font-bold transition flex items-center gap-3 text-slate-700 cursor-pointer ${
                    isActive 
                      ? 'bg-[#1B6B3A] text-white border-l-4 border-[#E8A020] shadow-sm' 
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <IconComp className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                  {tab.key === 'Inbox' && unreadInboxCount(userProfile?.email) > 0 && (
                    <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{unreadInboxCount(userProfile?.email)}</span>
                  )}
                </button>
              );
            })}

            {/* Logout — moved here from the main header */}
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 rounded-lg text-xs font-bold transition flex items-center gap-3 text-rose-600 hover:bg-rose-50 border-l-4 border-transparent mt-1 border-t border-slate-100 pt-3"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>{lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Right column view panels */}
        <div className="flex-1 w-full bg-white border border-slate-200 p-6 sm:p-10 rounded-xl min-h-[480px] shadow-sm">
          
          {/* ORDERS VIEW TAB */}
          {activeTab === 'Orders' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg">{t.ordersHeader}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.ordersSub}</p>
                </div>
                <span className="text-xs text-[#1B6B3A] bg-emerald-50 px-2 py-1 rounded font-black border border-emerald-100">
                  {orders.length} {lang === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}
                </span>
              </div>

              {/* Account summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-[#1B6B3A] bg-emerald-50 border-emerald-100' },
                  { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: InboxIcon, color: 'text-blue-700 bg-blue-50 border-blue-100' },
                  { label: 'IGO Coins', value: getWalletCoins(), icon: Heart, color: 'text-amber-700 bg-amber-50 border-amber-100' },
                  { label: 'Wishlist', value: wishlistProducts.length, icon: Heart, color: 'text-rose-700 bg-rose-50 border-rose-100' },
                ].map((s) => {
                  const Ic = s.icon;
                  return (
                    <div key={s.label} className={'rounded-xl border p-3 ' + s.color}>
                      <Ic className="h-4 w-4 mb-1.5 opacity-80" />
                      <div className="text-lg font-display font-black leading-none">{s.value.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wide opacity-70 mt-1">{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Track Orders', onClick: () => setActiveTab('Orders') },
                  { label: 'My Wishlist', onClick: () => setActiveTab('Wishlist') },
                  { label: 'Saved Addresses', onClick: () => setActiveTab('Addresses') },
                  { label: 'Continue Shopping', onClick: () => setCurrentPage('category') },
                ].map((a) => (
                  <button key={a.label} onClick={a.onClick}
                    className="text-[11px] font-bold text-[#1B6B3A] bg-white border border-emerald-200 hover:bg-emerald-50 px-3.5 py-2 rounded-lg transition">
                    {a.label}
                  </button>
                ))}
              </div>

              {isLoadingOrders ? (
                <div className="py-20 text-center text-slate-400 text-xs font-bold leading-normal animate-pulse">
                  {t.loadingOrders}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((o) => {
                    const currentStep = getStatusStep(o.status);
                    return (
                      <div key={o.id} className="border border-slate-200 rounded-xl overflow-hidden p-5 hover:shadow-md transition duration-300">
                        
                        {/* Top bar metrics */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4 text-xs font-bold select-none bg-slate-55 bg-[#F7F9F4]/40 -mx-5 -mt-5 p-5">
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-normal tracking-wide text-[10px] uppercase">{t.orderRef}</span>
                            <span className="text-slate-800 font-mono tracking-tight">{o.id}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-normal tracking-wide text-[10px] uppercase">{t.checkoutDate}</span>
                            <span className="text-slate-800 flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{o.createdAt?.toString().slice(0, 10)}</span>
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-normal tracking-wide text-[10px] uppercase">{t.method}</span>
                            <span className="text-slate-800">{o.paymentMethod}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-normal tracking-wide text-[10px] uppercase">{t.netValue}</span>
                            <span className="text-[#1B6B3A] text-sm">₹{o.totalAmount}</span>
                          </div>

                          {/* Status badge element */}
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded ${
                              o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              o.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              o.status === 'Dispatched' || o.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                              o.status === 'Confirmed' ? 'bg-teal-100 text-teal-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Logistics Stepper Progress */}
                        {o.status !== 'Cancelled' && (
                          <div className="mb-6 mt-4 px-2 max-w-xl mx-auto">
                            <div className="relative flex items-center justify-between">
                              {/* Background Line */}
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0"></div>
                              {/* Active Progress Line */}
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1B6B3A] transition-all duration-500 rounded-full z-0"
                                style={{ 
                                  width: currentStep > 1 ? `${((currentStep - 1) / 4) * 100}%` : '0%'
                                }}
                              ></div>

                              {/* Stepper Steps */}
                              {stepperSteps.map((st) => {
                                const isCompleted = currentStep >= st.step;
                                const isCurrent = currentStep === st.step;
                                return (
                                  <div key={st.step} className="flex flex-col items-center relative z-10 w-1/4">
                                    <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                                      isCurrent ? 'bg-white border-[#E8A020] text-[#E8A020] ring-4 ring-amber-50 scale-110 shadow-sm font-black' :
                                      isCompleted ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white' :
                                      'bg-white border-slate-200 text-slate-400'
                                    }`}>
                                      {isCompleted && !isCurrent ? '✓' : st.step}
                                    </div>
                                    <span className={`text-[9px] font-black tracking-tight mt-1.5 whitespace-nowrap px-1 rounded transition-colors text-center ${
                                      isCurrent ? 'text-[#E8A020]' :
                                      isCompleted ? 'text-slate-800' :
                                      'text-slate-400'
                                    }`}>
                                      {st.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {o.status === 'Cancelled' && (
                          <div className="my-4 p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 flex items-center gap-2 text-[11px] font-semibold">
                            <span className="text-sm">⚠️</span>
                            <span>
                              {lang === 'ta' 
                                ? 'இந்த ஆர்டர் ரத்து செய்யப்பட்டுள்ளது. நீங்கள் பணம் செலுத்தியிருந்தால் 3-5 வேலைநாட்களில் திருப்பித் தரப்படும்.' 
                                : 'This order was cancelled. Any active pre-payments will be refunded within 3-5 business days.'}
                            </span>
                          </div>
                        )}

                        <div className="h-[1px] bg-slate-100 my-4"></div>

                        {/* Items checkout lists */}
                        <div className="space-y-4">
                          {o.items?.map((item, i) => (
                            <div key={i} className="flex gap-4 items-center">
                              <img src={item.image} alt="" className="h-12 w-12 object-cover rounded-lg border border-slate-100 shadow-sm shrink-0" />
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</div>
                                <p className="text-[10px] text-slate-400 mt-0.5">{item.brand} • {lang === 'ta' ? 'அளவு' : 'Qty'}: {item.quantity}</p>
                              </div>
                              <span className="text-xs font-black text-slate-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTAs: Reorder + Cancel + Invoice */}
                        <div className="border-t border-slate-100 pt-3 mt-4 flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              alert("Downloading PDF invoice for " + o.id + "...");
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer transition shadow-sm flex items-center gap-1"
                          >
                            <FileCheck className="h-3 w-3" /> Invoice
                          </button>
                          <button
                            onClick={() => {
                              (o.items || []).forEach((it) => {
                                const prod = allProducts.find((p) => p.id === it.productId);
                                if (prod) addToCart(prod);
                              });
                              setCurrentPage('cart');
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-[#1B6B3A] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer transition shadow-sm flex items-center gap-1"
                          >
                            ↻ Reorder
                          </button>
                          {o.status !== 'Cancelled' && o.status !== 'Delivered' && o.status !== 'Dispatched' && o.status !== 'Shipped' && (
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              className="bg-red-50 hover:bg-red-100 text-[#D94F3D] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer transition shadow-sm"
                            >
                              {t.cancelOrder}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs italic bg-[#F7F9F4]/50 rounded-2xl border border-dashed border-slate-200">
                  {t.noOrders}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST VIEW TAB */}
          {/* INBOX VIEW TAB */}
          {activeTab === 'Inbox' && (() => {
            // Full notification list = live order-status updates + saved messages.
            const orderNotifs = orders.flatMap((o) => {
              const statusNotif = {
                id: 'ord-' + o.id,
                title: 'Order ' + o.id + ' — ' + o.status,
                body: orderStatusLine(o.status),
                createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
                orderId: o.id,
                canDelete: false,
              };
              // Admin → customer messages stored on the order (sync across devices).
              const msgs = (o.messages || []).map((m) => ({
                id: 'omsg-' + m.id,
                title: '✉️ Message · Order ' + o.id,
                body: m.body,
                createdAt: m.createdAt,
                orderId: o.id,
                canDelete: false,
              }));
              return [statusNotif, ...msgs];
            });
            const msgNotifs = inboxMsgs.map((m) => ({
              id: m.id, title: m.title, body: m.body, createdAt: m.createdAt, orderId: m.orderId, canDelete: true,
            }));
            const allNotifs = [...orderNotifs, ...msgNotifs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-lg">Notifications &amp; Inbox</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Order updates and messages from the IGO Agri Mart team</p>
                </div>
                <span className="text-[11px] font-black text-[#1B6B3A] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">{allNotifs.length}</span>
              </div>
              {allNotifs.length === 0 ? (
                <div className="py-16 text-center">
                  <Mail className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Order confirmations and updates from our team will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allNotifs.map(m => (
                    <div key={m.id} className="border border-slate-200 bg-white rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-extrabold text-slate-800 text-sm">{m.title}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                          {m.canDelete && (
                            <button onClick={() => handleDeleteMsg(m.id)} title="Delete notification"
                              className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{m.body}</p>
                      {m.orderId && <span className="inline-block mt-2 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{m.orderId}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })()}

          {/* WISHLIST VIEW TAB */}
          {activeTab === 'Wishlist' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg">{t.favoritePlants}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.favoriteSub}</p>
              </div>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="border border-slate-200 p-4 rounded-xl flex gap-4 items-center justify-between hover:shadow-sm transition">
                      <div className="flex gap-3 items-center cursor-pointer overflow-hidden" onClick={() => { setSelectedProduct(p); setCurrentPage('product'); }}>
                        <img src={p.images?.[0] || '/catalog/nursery-essentials/Pots.png'} onError={(e) => { (e.target as HTMLImageElement).src = '/catalog/nursery-essentials/Pots.png'; }} alt="" className="h-12 w-12 object-cover rounded-lg border" />
                        <div className="truncate">
                          <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{p.brand}</span>
                          <span className="text-xs font-black text-[#1B6B3A] mt-1 block">₹{p.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p);
                        }}
                        className="bg-[#1B6B3A] text-white hover:bg-emerald-950 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg transition shrink-0 cursor-pointer shadow-sm ml-2"
                      >
                        {t.addToBasket}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs italic bg-[#F7F9F4]/50 rounded-2xl border border-dashed border-slate-200">
                  {t.emptyWishlist}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES VIEW TAB */}
          {activeTab === 'Addresses' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-end flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg">{t.shippingHeader}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.shippingSub}</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-[10px] font-black uppercase tracking-wide px-3 py-2 rounded-lg cursor-pointer transition select-none shadow-sm"
                >
                  {showAddressForm ? t.cancelAddBtn : t.addAddressBtn}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-[#F7F9F4] p-5 rounded-xl border border-slate-100 max-w-xl space-y-4">
                  <h4 className="font-display font-bold text-xs text-slate-750 text-[#1B6B3A] uppercase tracking-wider mb-2">
                    {t.billingFormHeader}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.consigneeName}
                      required
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full"
                    />
                    <input
                      type="tel"
                      placeholder={t.phone}
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.address1}
                      required
                      value={newAddress.address1}
                      onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full col-span-2"
                    />
                    <input
                      type="text"
                      placeholder={t.address2}
                      value={newAddress.address2}
                      onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full col-span-2"
                    />
                    <input
                      type="text"
                      placeholder={t.city}
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.pincode}
                      required
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })}
                      className="bg-white border border-slate-200 rounded p-2 text-xs font-bold w-full"
                    />
                  </div>
                  <button type="submit" className="bg-[#1B6B3A] text-white hover:bg-emerald-950 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer transition shadow-sm">
                    {t.saveBtn}
                  </button>
                </form>
              )}

              {/* Saved Address Lists */}
              <div className="space-y-4">
                {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                  userProfile.addresses.map((a) => (
                    <div key={a.id} className="border border-slate-200 p-4 rounded-xl flex justify-between items-start gap-3 hover:bg-slate-50/20 transition">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800">{a.name}</div>
                        <div className="text-xs text-slate-400">Phone: {a.phone}</div>
                        <div className="text-xs text-slate-500 max-w-sm">
                          {a.addressLine1}, {a.addressLine2 && `${a.addressLine2}, `}{a.city}, {a.state} - {a.pincode}
                        </div>
                      </div>

                      <button
                        onClick={() => removeAddress(a.id)}
                        className="p-1.5 text-slate-400 hover:text-[#D94F3D] hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-10 text-center border border-dashed rounded-xl bg-slate-50/40">{t.noAddresses}</p>
                )}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg">{t.profileHeader}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.profileSub}</p>
              </div>



              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">{t.farmerName}</span>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-100">{userProfile?.name}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">{t.registeredEmail}</span>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">{userProfile?.email || 'None'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">{lang === 'ta' ? 'தொலைபேசி எண்' : 'Mobile Number'}</span>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">{userProfile?.phone ? '+91 ' + userProfile.phone : 'Not added'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">{t.roleStatus}</span>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-black text-slate-650 text-slate-700 border border-slate-100 uppercase uppercase-tracking-widest capitalize">
                    {userProfile?.role} {t.gateway}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT TICKETS TAB */}
          {activeTab === 'Support' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-[#1B6B3A] text-base sm:text-lg">Help & Support Tickets</h3>
                <p className="text-xs text-slate-400 mt-1">Submit issues or track existing queries regarding your orders</p>
              </div>

              <div className="bg-[#F7F9F4] p-5 rounded-xl border border-slate-100 max-w-xl space-y-4">
                <h4 className="font-display font-bold text-xs text-[#1B6B3A] uppercase tracking-wider mb-2">
                  Create a new ticket
                </h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const fd = new FormData(form);
                  const subject = String(fd.get('subject') || '').trim();
                  const message = String(fd.get('message') || '').trim();
                  // Route the ticket to the admin Leads inbox so the team actually sees it.
                  try {
                    captureLead({
                      source: 'Other',
                      name: userProfile?.name || 'Customer',
                      phone: userProfile?.phone || '',
                      email: userProfile?.email || undefined,
                      subject: 'Support ticket: ' + (subject || 'No subject'),
                      message,
                    });
                  } catch { /* ignore */ }
                  // Confirmation in the customer's own inbox.
                  try {
                    sendInboxMessage({
                      toEmail: userProfile?.email || 'all',
                      title: 'Support ticket received',
                      body: 'Thanks ' + (userProfile?.name || '') + '. We received your ticket: "' + (subject || 'No subject') + '". Our team will contact you shortly.',
                    });
                    setInboxMsgs(getInbox(userProfile?.email));
                  } catch { /* ignore */ }
                  alert('Support ticket raised successfully! Our team will contact you shortly.');
                  form.reset();
                }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subject / Related Order</label>
                    <input name="subject" type="text" required placeholder="e.g. Order AGM-2026... not delivered" className="w-full bg-white border border-slate-200 rounded p-2 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Describe your issue</label>
                    <textarea name="message" required rows={4} placeholder="Please provide detailed information..." className="w-full bg-white border border-slate-200 rounded p-2 text-xs"></textarea>
                  </div>
                  <button type="submit" className="bg-[#1B6B3A] text-white hover:bg-emerald-950 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer transition shadow-sm">
                    Submit Ticket
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h4 className="font-display font-extrabold text-slate-800 text-sm">Previous Tickets</h4>
                <div className="py-10 text-center border border-dashed rounded-xl bg-slate-50/40 text-xs text-slate-400">
                  No previous support tickets found.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
