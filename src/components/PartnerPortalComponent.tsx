import React, { useState } from 'react';
import {
  Store, Package, ShieldCheck, CheckCircle, X, Upload, Phone, Sparkles,
  Info, Award, Clock, IndianRupee, Banknote, ClipboardCheck
} from 'lucide-react';
import { getSellers, saveSellers, Seller } from '../siteConfig';

interface PartnerPortalComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  userProfile: any;
}

type SellerTab = 'sell' | 'dashboard' | 'review';

// Resize an uploaded image to a reasonable size and return a JPEG data URL so we
// don't bloat storage with multi-MB photos.
function readImageResized(file: File | undefined, onLoad: (url: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const max = 900;
      let { width, height } = img;
      if (width > max || height > max) {
        if (width > height) { height = Math.round((height * max) / width); width = max; }
        else { width = Math.round((width * max) / height); height = max; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.drawImage(img, 0, 0, width, height); onLoad(canvas.toDataURL('image/jpeg', 0.82)); }
      else onLoad(ev.target?.result as string);
    };
    img.onerror = () => onLoad(ev.target?.result as string);
    img.src = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
}

const statusPill = (s: string) => ({
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}[s] || 'bg-slate-100 text-slate-600 border-slate-200');

const payPill = (s: string) => ({
  None: 'bg-slate-100 text-slate-500 border-slate-200',
  Requested: 'bg-sky-50 text-sky-700 border-sky-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}[s] || 'bg-slate-100 text-slate-500 border-slate-200');

export default function PartnerPortalComponent({ setCurrentPage, userProfile }: PartnerPortalComponentProps) {
  const isAdmin = userProfile?.role === 'admin';
  const [tab, setTab] = useState<SellerTab>('sell');
  const [sellers, setSellers] = useState<Seller[]>(() => getSellers());

  // ── Become-a-Seller form ──────────────────────────────────────────────────
  const blank = { name: '', phone: '', productName: '', price: '', quantity: '', bankDetails: '', productImage: '' };
  const [form, setForm] = useState({ ...blank });
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const refresh = () => setSellers(getSellers());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.length < 10 || !form.productName.trim() || !form.price || !form.quantity || !form.bankDetails.trim()) {
      alert('Please fill all fields (name, 10-digit phone, product, price, quantity and bank details).');
      return;
    }
    if (!agree) { alert('Please accept the seller terms & conditions to continue.'); return; }
    const seller: Seller = {
      id: 'sel-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: form.name.trim(), phone: form.phone.trim(), productName: form.productName.trim(),
      price: Number(form.price) || 0, quantity: Number(form.quantity) || 0,
      bankDetails: form.bankDetails.trim(), productImage: form.productImage || undefined,
      status: 'Pending', paymentStatus: 'None', createdAt: new Date().toISOString(),
    };
    const next = [seller, ...getSellers()];
    saveSellers(next); setSellers(next);
    setForm({ ...blank }); setAgree(false); setSubmitted(true);
  };

  // ── Seller dashboard (lookup by phone) ────────────────────────────────────
  const [lookupPhone, setLookupPhone] = useState('');
  const myListings = lookupPhone.trim().length >= 4
    ? sellers.filter((s) => s.phone.includes(lookupPhone.trim()))
    : [];

  // ── Admin actions ─────────────────────────────────────────────────────────
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Seller>>({});

  const updateSeller = (id: string, patch: Partial<Seller>) => {
    const next = getSellers().map((s) => (s.id === id ? { ...s, ...patch } : s));
    saveSellers(next); setSellers(next);
  };
  const removeSeller = (id: string) => {
    if (!window.confirm('Remove this seller submission?')) return;
    const next = getSellers().filter((s) => s.id !== id);
    saveSellers(next); setSellers(next);
  };

  const startEditing = (seller: Seller) => {
    setEditingSellerId(seller.id);
    setEditForm({ ...seller });
  };
  const saveEdit = () => {
    if (editingSellerId) {
      updateSeller(editingSellerId, editForm);
      setEditingSellerId(null);
    }
  };

  const TERMS = [
    'Products listed must be genuine, in good condition and accurately described.',
    'IGO Agri Mart verifies every listing before it is approved for sale.',
    'Agreed price is final; IGO Agri Mart may deduct a small platform/handling fee.',
    'Payouts are made to the bank details you provide, after the product is received and verified.',
    'You authorise IGO Agri Mart to communicate with you about your listing and payout.',
  ];

  return (
    <div className="bg-[#F7F9F4] min-h-screen pb-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="bg-slate-900 relative overflow-hidden py-12 sm:py-16 mb-8 min-h-[460px] sm:min-h-[540px] flex items-center w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {/* Background video (banner-style hero) */}
          <video autoPlay muted loop playsInline poster="/images/agri_farm_bg.png" className="absolute inset-0 w-full h-full object-cover z-0">
            <source src="/videos/igo-sellers.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/45 to-slate-900/15 z-0 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
            {/* Left Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[13px] font-extrabold mb-4">
                <Store className="h-4 w-4 text-emerald-300" /> IGO Agri Mart Seller Partner Program
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white leading-[1.1] mb-4 tracking-tight drop-shadow-md">
                Grow your agri business with IGO Agri Mart
              </h1>
              <p className="text-base sm:text-lg text-emerald-50/90 mb-6 leading-relaxed max-w-xl">
                Join IGO Agri Mart to list genuine seeds, crop protection, nutrition, tools and agri inputs. Our team helps with onboarding, catalog setup and order operations.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a href="#signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold shadow-[0_16px_36px_rgba(20,133,55,0.25)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(20,133,55,0.3)] transition-all">
                  <ClipboardCheck className="h-5 w-5" /> Start Seller Registration
                </a>
                <a href="#steps" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-700 border border-emerald-200 font-extrabold shadow-[0_12px_26px_rgba(8,34,22,0.06)] hover:shadow-[0_18px_34px_rgba(8,34,22,0.1)] transition-all">
                  <Package className="h-5 w-5" /> See How It Works
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-emerald-50 text-slate-800 text-[13px] font-bold shadow-sm"><CheckCircle className="h-4 w-4 text-emerald-500" /> No joining fee</span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-emerald-50 text-slate-800 text-[13px] font-bold shadow-sm"><CheckCircle className="h-4 w-4 text-emerald-500" /> Catalog support</span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-emerald-50 text-slate-800 text-[13px] font-bold shadow-sm"><CheckCircle className="h-4 w-4 text-emerald-500" /> Quick team callback</span>
              </div>
            </div>

            {/* Right Card */}
            <div className="hidden lg:flex justify-end">
              <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-[0_22px_54px_rgba(8,34,22,0.08)] w-full max-w-[420px]">
                <div className="flex justify-between items-center mb-4">
                  <strong className="text-lg text-slate-900 font-black">What happens next</strong>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                    <Sparkles className="h-3.5 w-3.5" /> Simple onboarding
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#f7fbf8] border border-emerald-100 rounded-2xl p-3.5 flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md"><ClipboardCheck className="h-5 w-5" /></div>
                    <div><b className="block text-slate-900 text-sm">Submit your details</b><span className="text-xs text-slate-500">Business, GST, PAN and product category.</span></div>
                  </div>
                  <div className="bg-[#f7fbf8] border border-emerald-100 rounded-2xl p-3.5 flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md"><Phone className="h-5 w-5" /></div>
                    <div><b className="block text-slate-900 text-sm">Team verification</b><span className="text-xs text-slate-500">Our seller team reviews and calls you.</span></div>
                  </div>
                  <div className="bg-[#f7fbf8] border border-emerald-100 rounded-2xl p-3.5 flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md"><Package className="h-5 w-5" /></div>
                    <div><b className="block text-slate-900 text-sm">Start listing products</b><span className="text-xs text-slate-500">Get help with catalog and order readiness.</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAND */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 -mt-4 relative z-20 px-4">
          <div className="bg-white border border-emerald-100/60 rounded-2xl shadow-[0_10px_30px_rgba(8,34,22,0.06)] p-5 text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-1">0</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Joining fee</p>
          </div>
          <div className="bg-white border border-emerald-100/60 rounded-2xl shadow-[0_10px_30px_rgba(8,34,22,0.06)] p-5 text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-1">Up to 8%</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Marketplace fee</p>
          </div>
          <div className="bg-white border border-emerald-100/60 rounded-2xl shadow-[0_10px_30px_rgba(8,34,22,0.06)] p-5 text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-1">24-48 hrs</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Verification review</p>
          </div>
          <div className="bg-white border border-emerald-100/60 rounded-2xl shadow-[0_10px_30px_rgba(8,34,22,0.06)] p-5 text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-1">Team</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Onboarding support</p>
          </div>
        </div>

        {/* BENEFITS */}
        <section className="mb-14">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">Why Sellers Join IGO Agri Mart</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-white/90 to-white border border-emerald-100 rounded-3xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5"><Store className="h-7 w-7" /></div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Reach Agri Buyers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">List your products where farmers search for seeds, crop protection, nutrition and tools.</p>
            </div>
            <div className="bg-gradient-to-b from-white/90 to-white border border-emerald-100 rounded-3xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5"><Package className="h-7 w-7" /></div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Clean Product Listings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Get support for product titles, images, variants and category placement.</p>
            </div>
            <div className="bg-gradient-to-b from-white/90 to-white border border-emerald-100 rounded-3xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5"><ShieldCheck className="h-7 w-7" /></div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Smoother Operations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Coordinate order processing, pickup support and seller communication from one flow.</p>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section id="steps" className="mb-14">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">Start With Three Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 pl-16 relative shadow-sm">
              <div className="absolute top-5 left-4 h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black shadow-md">1</div>
              <h4 className="font-black text-slate-900 text-base mb-1">Register</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Fill a quick form and upload GST & PAN documents for verification.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 pl-16 relative shadow-sm">
              <div className="absolute top-5 left-4 h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black shadow-md">2</div>
              <h4 className="font-black text-slate-900 text-base mb-1">List Products</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Add SKUs, pricing, stock and product details with onboarding support.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 pl-16 relative shadow-sm">
              <div className="absolute top-5 left-4 h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black shadow-md">3</div>
              <h4 className="font-black text-slate-900 text-base mb-1">Receive Orders</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Process verified orders with IGO Agri Mart operational support.</p>
            </div>
          </div>
        </section>

        {/* FEES TABLE */}
        <section className="mb-14">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">Simple & Transparent Fees</h2>
          <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                <tr>
                  <th className="p-4 font-bold">Fee Type</th>
                  <th className="p-4 font-bold">Rate</th>
                  <th className="p-4 font-bold">Highlights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                <tr>
                  <td className="p-4 text-slate-800 font-bold">Joining Fee</td>
                  <td className="p-4 font-bold">₹0 <span className="ml-2 inline-block bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Free</span></td>
                  <td className="p-4 text-slate-600">No onboarding or tech charges</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-800 font-bold">Commission</td>
                  <td className="p-4 font-bold">Up to 8%</td>
                  <td className="p-4 text-slate-600">Category-wise; transparent transfer-price model</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-800 font-bold">Seller Support</td>
                  <td className="p-4 font-bold">Included</td>
                  <td className="p-4 text-slate-600">Onboarding and product listing guidance</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-800 font-bold">Shipping</td>
                  <td className="p-4 font-bold">Actuals</td>
                  <td className="p-4 text-slate-600">Pan-India logistics at negotiated rates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-14">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight">What Sellers Say</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <p className="italic text-slate-600 text-sm mb-3">“In 6 months our pesticide unit sales grew 230%. Their ads + farmer targeting just works.”</p>
              <h5 className="font-bold text-slate-900 text-sm">Mahesh Kumar · GreenCrop Chemicals</h5>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <p className="italic text-slate-600 text-sm mb-3">“The onboarding team helped us clean up product listings and start faster.”</p>
              <h5 className="font-bold text-slate-900 text-sm">Sneha Patel · AgroSeeds Co.</h5>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section id="signup" className="bg-gradient-to-b from-[#f7fbf8] to-white -mx-4 sm:-mx-6 px-4 sm:px-6 py-12 border-t border-emerald-50">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm mb-6">
                <h3 className="font-display font-black text-slate-900 text-xl mb-4">What We Help With</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Product listing and category setup</li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Seller onboarding and verification</li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Order and pickup coordination support</li>
                </ul>
                <h3 className="font-display font-black text-slate-900 text-xl mb-4">Eligibility</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2.5 text-sm text-slate-600"><Store className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> Valid GST, PAN & bank account</li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600"><Package className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> Genuine agri-inputs with labels/compliance</li>
                </ul>
                <div className="bg-gradient-to-br from-[#f0fff4] to-white border border-dashed border-[#9bd8ad] rounded-2xl p-4">
                  <strong className="block text-slate-900 text-sm mb-1">Need help while applying?</strong>
                  <span className="block text-slate-600 text-xs leading-relaxed">Submit the form and our seller team will call you for onboarding support.</span>
                </div>
              </div>
              
              {/* Tracker for existing sellers */}
              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-black text-sky-900 text-sm mb-2"><Package className="h-4 w-4 inline mr-1" /> Track Application</h3>
                 <p className="text-xs text-sky-800 mb-3">Enter your 10-digit number to check your status.</p>
                 <div className="flex flex-col gap-2">
                   <div className="relative">
                     <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                     <input value={lookupPhone} onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Mobile Number" className="w-full bg-white border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-sky-400" />
                   </div>
                   {lookupPhone.length >= 4 && myListings.length > 0 && (
                     <div className="mt-2 space-y-2 max-h-[200px] overflow-auto">
                        {myListings.map(s => (
                          <div key={s.id} className="bg-white rounded-lg p-2.5 border border-sky-100 text-xs">
                            <b className="truncate block">{s.productName}</b>
                            <div className="flex justify-between items-center mt-1">
                              <span className={'px-1.5 py-0.5 rounded text-[9px] font-bold ' + statusPill(s.status)}>{s.status}</span>
                              <span className="text-sky-700 font-bold">₹{s.price}</span>
                            </div>
                          </div>
                        ))}
                     </div>
                   )}
                   {lookupPhone.length >= 4 && myListings.length === 0 && (
                     <div className="text-xs text-sky-700 mt-1">No listings found.</div>
                   )}
                 </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-[0_22px_56px_rgba(8,34,22,0.06)]">
                <h3 className="font-display font-black text-3xl text-slate-900 mb-2 tracking-tight">Apply to become a IGO Agri Mart seller</h3>
                <p className="text-slate-500 text-sm mb-6">Share your business details once. Our team will review and guide you on listing your products.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                  <div className="bg-emerald-50 border border-[#cef4dc] text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-full flex justify-center items-center gap-2"><Store className="h-3.5 w-3.5" /> Business details</div>
                  <div className="bg-emerald-50 border border-[#cef4dc] text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-full flex justify-center items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> GST and PAN</div>
                  <div className="bg-emerald-50 border border-[#cef4dc] text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-full flex justify-center items-center gap-2"><Phone className="h-3.5 w-3.5" /> Team callback</div>
                </div>

                <form onSubmit={handleSubmit}>
                  {submitted && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex items-start gap-3 mb-6">
                      <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                      <span><b>Application Submitted Successfully!</b> Our team will contact you shortly for onboarding.</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-slate-900 font-black text-base mb-4 mt-6"><Store className="h-4 w-4 text-emerald-600" /> Business information</div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Example: Green Agro Traders" className="w-full bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile number" className="w-full bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                      <div className="text-[11px] text-slate-500 mt-1">Enter 10-digit Indian mobile number</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-900 font-black text-base mb-4 mt-8"><Package className="h-4 w-4 text-emerald-600" /> Product Details</div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Name & Category *</label>
                      <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="e.g. Organic Vermicompost (Fertilizer)" className="w-full bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Price / Unit (₹) *</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 450" className="w-full bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity Available *</label>
                      <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 50" className="w-full bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-900 font-black text-base mb-4 mt-8"><ClipboardCheck className="h-4 w-4 text-emerald-600" /> Address & Documents</div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Address & Bank Details *</label>
                      <textarea value={form.bankDetails} onChange={(e) => setForm({ ...form, bankDetails: e.target.value })} rows={3} placeholder="1. Complete pickup address&#10;2. Account holder name, A/c number, IFSC" className="w-full min-h-[104px] resize-y bg-white border border-[#cfd8d3] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(20,133,55,0.12)] outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Photo / Document (Optional)</label>
                      <div className="flex items-center gap-4">
                        <label className="bg-white border border-[#cfd8d3] hover:border-emerald-400 text-slate-700 text-sm font-bold px-5 py-3.5 rounded-full cursor-pointer inline-flex items-center justify-center gap-2 transition-all">
                          <Upload className="h-4 w-4" /> Upload Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageResized(e.target.files?.[0], (url) => setForm((f) => ({ ...f, productImage: url })))} />
                        </label>
                        {form.productImage && <img src={form.productImage} alt="Preview" className="h-12 w-12 rounded-xl object-cover border border-slate-200" />}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-3">
                    <input type="checkbox" id="terms" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-emerald-600 rounded border-slate-300" />
                    <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the seller terms & conditions. I confirm that products listed are genuine and I authorize IGO Agri Mart to communicate with me regarding onboarding.
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-br from-emerald-600 to-emerald-500 hover:-translate-y-0.5 text-white font-black text-base px-6 py-4 rounded-full shadow-[0_16px_36px_rgba(20,133,55,0.25)] hover:shadow-[0_20px_40px_rgba(20,133,55,0.32)] transition-all">
                    Submit Seller Application
                  </button>
                  <div className="text-center text-[11px] text-slate-500 mt-4">By submitting, you agree that IGO Agri Mart may contact you for seller onboarding.</div>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* ── ADMIN: SELLER APPROVALS ─────────────────────────────────────── */}
        {isAdmin && (
          <div className="mt-10 mb-6 max-w-5xl mx-auto">
            <div className="bg-slate-900 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-black text-lg flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-400" /> Admin: Seller Approvals</h3>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full">{sellers.filter((s) => s.status === 'Pending').length} Pending</span>
            </div>
            <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-6 shadow-sm space-y-4">
              {sellers.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-400">No seller submissions yet.</div>
              ) : (
                [...sellers].sort((a, b) => (a.status === 'Pending' ? -1 : 1) - (b.status === 'Pending' ? -1 : 1)).map((s) => (
                  <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    {editingSellerId === s.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2"><Store className="h-4 w-4 text-[#1B6B3A]" /> Edit Seller Details</h4>
                          <button onClick={() => setEditingSellerId(null)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Business Name</label>
                            <input value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Phone</label>
                            <input value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Product Name & Category</label>
                            <input value={editForm.productName || ''} onChange={(e) => setEditForm({...editForm, productName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Price (₹)</label>
                            <input type="number" value={editForm.price || ''} onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Quantity</label>
                            <input type="number" value={editForm.quantity || ''} onChange={(e) => setEditForm({...editForm, quantity: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Address & Bank Details</label>
                            <textarea value={editForm.bankDetails || ''} onChange={(e) => setEditForm({...editForm, bankDetails: e.target.value})} rows={2} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B6B3A]" />
                          </div>
                          <div className="sm:col-span-2 flex gap-2 pt-2">
                            <button onClick={saveEdit} className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold px-4 py-2 rounded-lg">Save Changes</button>
                            <button onClick={() => setEditingSellerId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg">Cancel</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {s.productImage && <img src={s.productImage} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200" />}
                            <div>
                              <h4 className="font-black text-slate-900 text-sm">{s.productName}</h4>
                              <p className="text-[11px] text-slate-500">{s.name} · {s.phone}</p>
                              <p className="text-[11px] text-slate-700 font-bold mt-0.5 flex items-center gap-1"><IndianRupee className="h-3 w-3" />{s.price.toLocaleString('en-IN')} · Qty {s.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditing(s)} className="text-[10px] text-emerald-700 font-bold hover:underline bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">Edit</button>
                            <span className={'text-[10px] font-black uppercase px-2 py-1 rounded-full border ' + statusPill(s.status)}>{s.status}</span>
                          </div>
                        </div>

                        <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700">
                          <span className="font-black text-slate-500 uppercase tracking-wide text-[9px] block mb-0.5">Payout bank details</span>
                          {s.bankDetails}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => updateSeller(s.id, { status: 'Approved' })} className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Approve</button>
                          <button onClick={() => updateSeller(s.id, { status: 'Rejected' })} className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg">Reject</button>
                          <button onClick={() => updateSeller(s.id, { paymentStatus: 'Requested' })} className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-3 py-1.5 rounded-lg">Request bank details</button>
                          <label className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5" /> {s.paymentProofImage ? 'Replace payment proof' : 'Upload payment proof'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageResized(e.target.files?.[0], (url) => updateSeller(s.id, { paymentProofImage: url, paymentStatus: 'Paid' }))} />
                          </label>
                          <button onClick={() => removeSeller(s.id)} className="text-slate-400 hover:text-rose-600 text-xs font-bold px-2">Delete</button>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <input
                            defaultValue={s.adminMessage || ''}
                            onBlur={(e) => { if (e.target.value !== (s.adminMessage || '')) updateSeller(s.id, { adminMessage: e.target.value }); }}
                            placeholder="Message to the seller (saved when you click away)…"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                          <span className="text-slate-500">Payment status:</span>
                          <span className={'font-black px-2 py-0.5 rounded-full border ' + payPill(s.paymentStatus)}>{s.paymentStatus}</span>
                          {s.paymentProofImage && <img src={s.paymentProofImage} alt="" className="h-10 rounded border border-slate-200" />}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            Bank/payout details are sensitive. They are shared only with the IGO Agri Mart team for your payment. For full
            production security, payout details should be held in a protected (access-controlled) store.
          </p>
        </div>
        {!isAdmin && (
          <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1"><Clock className="h-3 w-3" /> Seller approvals are managed by the IGO Agri Mart admin team.</p>
        )}
      </div>
    </div>
  );
}
