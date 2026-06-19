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
  const updateSeller = (id: string, patch: Partial<Seller>) => {
    const next = getSellers().map((s) => (s.id === id ? { ...s, ...patch } : s));
    saveSellers(next); setSellers(next);
  };
  const removeSeller = (id: string) => {
    if (!window.confirm('Remove this seller submission?')) return;
    const next = getSellers().filter((s) => s.id !== id);
    saveSellers(next); setSellers(next);
  };

  const TERMS = [
    'Products listed must be genuine, in good condition and accurately described.',
    'IGO Agri Mart verifies every listing before it is approved for sale.',
    'Agreed price is final; IGO Agri Mart may deduct a small platform/handling fee.',
    'Payouts are made to the bank details you provide, after the product is received and verified.',
    'You authorise IGO Agri Mart to communicate with you about your listing and payout.',
  ];

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Sell on IGO Agri Mart</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-9 shadow-sm border border-slate-100 mb-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Become a Seller
          </span>
          <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight flex items-center gap-3">
            <Store className="h-8 w-8 shrink-0" /> Sell your products on IGO Agri Mart
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">
            List your product with price and quantity, our team verifies it, and once approved you track everything —
            status, messages and your payment proof — right here in your seller dashboard.
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex bg-white rounded-full border border-slate-100 shadow-sm p-1 mb-7 flex-wrap">
          {([['sell', 'Become a Seller'], ['dashboard', 'Seller Dashboard'], ...(isAdmin ? [['review', 'Seller Approvals'] as [SellerTab, string]] : [])] as [SellerTab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={'flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full transition ' + (tab === key ? 'bg-[#1B6B3A] text-white' : 'text-slate-500 hover:text-[#1B6B3A]')}>
              {key === 'sell' ? <Store className="h-4 w-4" /> : key === 'dashboard' ? <Package className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
              {label}{key === 'review' && sellers.filter((s) => s.status === 'Pending').length > 0 ? ' (' + sellers.filter((s) => s.status === 'Pending').length + ')' : ''}
            </button>
          ))}
        </div>

        {/* ── BECOME A SELLER ─────────────────────────────────────────────── */}
        {tab === 'sell' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-display font-black text-slate-900 text-lg">List your product</h3>
              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Submitted! Our team will verify it shortly. Track it in the <b>Seller Dashboard</b> tab using your phone number.</span>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Your Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Murugan" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Product Name</label>
                  <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="e.g. Organic Vermicompost 25kg" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Price (Rs.)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 450" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Quantity available</label>
                  <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 50" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Bank Details (for your payout)</label>
                  <textarea value={form.bankDetails} onChange={(e) => setForm({ ...form, bankDetails: e.target.value })} rows={2} placeholder="Account holder, A/c number, IFSC, or UPI ID" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold resize-none" />
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Shared only with the IGO Agri Mart team for your payout.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Product Photo (optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="bg-[#1B6B3A] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer inline-flex items-center gap-1.5 transition">
                      <Upload className="h-3.5 w-3.5" /> Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageResized(e.target.files?.[0], (url) => setForm((f) => ({ ...f, productImage: url })))} />
                    </label>
                    {form.productImage && <img src={form.productImage} alt="" className="h-12 w-12 rounded-lg object-cover border border-slate-200" />}
                  </div>
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B6B3A]" />
                <span>I accept the seller <b>terms &amp; conditions</b> shown on the right.</span>
              </label>
              <button type="submit" className="bg-[#1B6B3A] hover:bg-[#15532d] text-white font-black text-sm px-6 py-3 rounded-xl transition w-full sm:w-auto">Save &amp; Submit for Verification</button>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
              <h4 className="font-display font-black text-slate-900 text-sm flex items-center gap-1.5"><ClipboardCheck className="h-4 w-4 text-[#1B6B3A]" /> Terms &amp; Conditions</h4>
              <ul className="mt-3 space-y-2.5">
                {TERMS.map((t, i) => (
                  <li key={i} className="text-[11px] text-slate-600 leading-relaxed flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#1B6B3A] mt-0.5 shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── SELLER DASHBOARD ────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-500 block mb-1">Enter your phone number to see your listings</label>
              <div className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input value={lookupPhone} onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Your 10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-bold" />
                </div>
                <button onClick={refresh} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 rounded-lg">Refresh</button>
              </div>
            </div>

            {lookupPhone.trim().length < 4 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400">Enter your phone number above to view your product listings and payment status.</div>
            ) : myListings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400">No listings found for this number. Submit one in the <b>Become a Seller</b> tab.</div>
            ) : (
              <div className="space-y-4">
                {myListings.map((s) => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      {s.productImage && <img src={s.productImage} alt="" className="h-16 w-16 rounded-xl object-cover border border-slate-200 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display font-black text-slate-900 text-base">{s.productName}</h4>
                          <span className={'text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ' + statusPill(s.status)}>{s.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Rs.{s.price.toLocaleString('en-IN')} · Qty {s.quantity} · Listed {new Date(s.createdAt).toLocaleDateString('en-IN')}</p>
                        {s.adminMessage && (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] text-amber-900"><b>Message from IGO:</b> {s.adminMessage}</div>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                          <Banknote className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-slate-500">Payment:</span>
                          <span className={'font-black px-2 py-0.5 rounded-full border ' + payPill(s.paymentStatus)}>{s.paymentStatus === 'None' ? 'Pending' : s.paymentStatus}</span>
                        </div>
                        {s.paymentProofImage && (
                          <div className="mt-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700 mb-1">Payment proof from IGO</p>
                            <img src={s.paymentProofImage} alt="payment proof" className="max-h-56 rounded-xl border border-slate-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADMIN: SELLER APPROVALS ─────────────────────────────────────── */}
        {tab === 'review' && isAdmin && (
          <div className="space-y-4">
            {sellers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400">No seller submissions yet.</div>
            ) : (
              [...sellers].sort((a, b) => (a.status === 'Pending' ? -1 : 1) - (b.status === 'Pending' ? -1 : 1)).map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {s.productImage && <img src={s.productImage} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200" />}
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{s.productName}</h4>
                        <p className="text-[11px] text-slate-500">{s.name} · {s.phone}</p>
                        <p className="text-[11px] text-slate-700 font-bold mt-0.5 flex items-center gap-1"><IndianRupee className="h-3 w-3" />{s.price.toLocaleString('en-IN')} · Qty {s.quantity}</p>
                      </div>
                    </div>
                    <span className={'text-[10px] font-black uppercase px-2 py-1 rounded-full border ' + statusPill(s.status)}>{s.status}</span>
                  </div>

                  <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700">
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
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-7 flex items-start gap-2.5">
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
