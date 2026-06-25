import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, HelpCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';

interface FaqComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
}

type FaqItem = { cat: string; q: string; a: string };

// ── FAQ knowledge base — modelled on agri-marketplace leaders (BigHaat,
// KisanShop, AgroStar) plus IGO Agritech Farms' own project FAQ. Grouped by
// category so customers can scan quickly. ──────────────────────────────────
const FAQS: FaqItem[] = [
  // Orders & Delivery
  { cat: 'Orders & Delivery', q: 'How do I place an order on IGO Agri Mart?', a: 'Browse or search for a product, choose your pack size, and tap “Add to Cart”. Open the cart, pick a delivery slot, and proceed to checkout. You can also use “Buy Now” to skip straight to checkout.' },
  { cat: 'Orders & Delivery', q: 'Which areas do you deliver to?', a: 'We deliver across Tamil Nadu and most serviceable pincodes in India. Enter your 6-digit pincode on any product page to instantly check delivery availability and the estimated delivery date.' },
  { cat: 'Orders & Delivery', q: 'How long does delivery take?', a: 'Most in-stock orders are dispatched within 24–48 hours and delivered in 2–5 working days depending on your location. Your estimated delivery date is shown at checkout and in your order details.' },
  { cat: 'Orders & Delivery', q: 'Can I choose a delivery time slot?', a: 'Yes. In the cart you can pick a convenient delivery slot, and it carries through to checkout and appears on your order so our team plans the delivery around it.' },
  { cat: 'Orders & Delivery', q: 'How do I track my order?', a: 'Open “My Account → Orders” to see live status for every order — from confirmed and packed to out-for-delivery and delivered. You’ll also get notifications as the status changes.' },

  // Payments & Pricing
  { cat: 'Payments & Pricing', q: 'What payment methods do you accept?', a: 'You can pay online via UPI, debit/credit cards and net-banking, or choose Cash on Delivery (COD) where available. All online payments are processed through a secure, encrypted gateway.' },
  { cat: 'Payments & Pricing', q: 'Are the prices inclusive of GST?', a: 'Yes. Displayed prices include GST and any applicable agricultural subvention adjustments, so there are no surprise charges at checkout.' },
  { cat: 'Payments & Pricing', q: 'What are IGO Coins and how do I use them?', a: 'IGO Coins are reward points you earn on activity and purchases. They sit in your account wallet and can be redeemed for discounts on future orders during checkout.' },
  { cat: 'Payments & Pricing', q: 'Do you offer bulk or multipack discounts?', a: 'Yes. Many products have “Big Savings on Multipack” options (for example 5 kg or 10 kg packs) at a lower per-unit price. Larger farm orders may qualify for special pricing — contact our team for a quote.' },

  // Returns & Refunds
  { cat: 'Returns & Refunds', q: 'What is your return policy?', a: 'If a product arrives damaged, defective, or different from what you ordered, you can raise a return request within the eligible window shown on the product/return page. Perishable and opened agri-inputs may have limited returnability for safety reasons.' },
  { cat: 'Returns & Refunds', q: 'How do I request a return or replacement?', a: 'Go to “My Account → Orders”, select the order, and choose Return/Replace. Share a photo of the issue where asked, and our support team will arrange a pickup or replacement.' },
  { cat: 'Returns & Refunds', q: 'When will I get my refund?', a: 'Once a returned item is received and verified, refunds are issued to your original payment method (or as IGO Coins, if you prefer) — typically within 5–7 working days.' },

  // Products & Quality
  { cat: 'Products & Quality', q: 'Are your seeds and inputs genuine?', a: 'Yes. Every product is sourced from verified brands and carries our “100% Genuine Product” assurance. Inputs are quality-checked and backed by the IGO Group of Companies.' },
  { cat: 'Products & Quality', q: 'How do I choose the right product for my crop?', a: 'Use the crop and problem filters on the Shop page, read the product specifications and key features, or ask our agronomists via the Contact page for a free recommendation.' },
  { cat: 'Products & Quality', q: 'Will you notify me when an out-of-stock item is back?', a: 'Yes. On any out-of-stock product, tap “Notify Me” and we’ll alert you the moment it is back in stock.' },

  // Account & Login
  { cat: 'Account & Login', q: 'How do I create an account?', a: 'Tap “Login / Sign In” and enter your mobile number. We send a one-time password (OTP) to verify you — no passwords to remember. First-time users complete a quick profile.' },
  { cat: 'Account & Login', q: 'Is my personal information safe?', a: 'Yes. We use OTP-based login (we never store your password), and your data is handled securely. We never share your details with third parties without consent.' },
  { cat: 'Account & Login', q: 'Can I reorder a previous purchase quickly?', a: 'Absolutely. In “My Account → Orders”, use one-tap Reorder to add a past order straight back to your cart.' },

  // Selling on IGO
  { cat: 'Selling on IGO', q: 'How can I sell my produce or products on IGO Agri Mart?', a: 'Open the Sellers page and submit your details — name, contact, product, price, quantity and a photo. Our team verifies every listing before it goes live.' },
  { cat: 'Selling on IGO', q: 'How and when do I get paid as a seller?', a: 'After your items sell, payouts are processed to your registered account. Your payout status is tracked, and our team confirms each settlement with you.' },
  { cat: 'Selling on IGO', q: 'Does IGO buy back farm produce?', a: 'Yes. Through our buyback and market-linkage programs we connect your harvest to assured buyers at fair, pre-agreed pricing on selected crops. Ask our team for eligibility.' },

  // Farm Loans & Subsidy
  { cat: 'Farm Loans & Subsidy', q: 'Do you help with farm loans and credit?', a: 'Yes. Our Farm Loans desk helps you understand and access agricultural credit and interest-subvention schemes in partnership with rural cooperative banks. See the Farm Loans page for details.' },
  { cat: 'Farm Loans & Subsidy', q: 'Are projects eligible for government subsidy?', a: 'Most agri projects qualify for PM-KUSUM, NHB, NABARD or state horticulture subsidies — up to 90% on eligible components. Our team prepares and files the paperwork for you.' },

  // Farm Projects & Services
  { cat: 'Farm Projects & Services', q: 'What farm projects can IGO set up for me?', a: 'We deliver turnkey projects — polyhouse, hydroponics, vertical farming, open cultivation, goat & livestock, aquaculture, mushroom, nursery, solar dryer and more — engineered end-to-end. See the Services page.' },
  { cat: 'Farm Projects & Services', q: 'What does a turnkey project include?', a: 'Feasibility & ROI study, engineering design and construction, quality inputs, government-subsidy facilitation, agronomy support, optional AMC maintenance, and market linkage / buyback.' },
  { cat: 'Farm Projects & Services', q: 'How do I start a project or get a quote?', a: 'Open the Services page, tap any project to read full details, then “Get a Free Quote & Consultation”. We visit your site, assess feasibility, and share a cost estimate before you commit — no obligation.' },
  { cat: 'Farm Projects & Services', q: 'Do you offer training and mentorship for farmers?', a: 'Yes. Our Mentorship & Training program gives new and existing farmers hands-on guidance on crop planning, operations and agri-business, plus an ongoing expert helpline.' },
];

const CATEGORIES = ['All', ...Array.from(new Set(FAQS.map((f) => f.cat)))];

export default function FaqComponent({ lang, setCurrentPage }: FaqComponentProps) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [open, setOpen] = useState<string | null>(FAQS[0].q);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchCat = activeCat === 'All' || f.cat === activeCat;
      const matchText = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [query, activeCat]);

  // Group filtered items by category for display.
  const grouped = useMemo(() => {
    const map: Record<string, FaqItem[]> = {};
    filtered.forEach((f) => { (map[f.cat] = map[f.cat] || []).push(f); });
    return map;
  }, [filtered]);

  // Inject FAQPage JSON-LD structured data for SEO (rich results in Google).
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'igo-faq-schema';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.getElementById('igo-faq-schema')?.remove();
    document.head.appendChild(script);
    return () => { document.getElementById('igo-faq-schema')?.remove(); };
  }, []);

  return (
    <div className="bg-[#F7F9F4] min-h-screen pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto pt-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-bold">FAQs</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2e18] via-[#134e2a] to-[#0a2e18] shadow-xl px-6 sm:px-12 py-12 sm:py-14">
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-[#E8A020]/10 rounded-full blur-3xl pointer-events-none"></div>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-[#E8A020] text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
            <HelpCircle className="h-3.5 w-3.5" /> Help Centre
          </span>
          <h1 className="font-display font-black text-white text-3xl sm:text-5xl tracking-tight mt-4">Frequently Asked Questions</h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Everything you need to know about ordering, delivery, payments, returns, selling, farm loans and our turnkey agri projects — all in one place.
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your question…"
              className="w-full bg-white rounded-full pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-700 shadow-lg outline-none focus:ring-2 focus:ring-[#E8A020]"
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mt-6">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActiveCat(c)}
              className={'text-xs font-black px-4 py-2 rounded-full border transition ' +
                (activeCat === c ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B6B3A]/40')}>
              {c}
            </button>
          ))}
        </div>

        {/* FAQ groups */}
        <div className="mt-8 space-y-8">
          {Object.keys(grouped).length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-sm font-bold text-slate-500">No questions match “{query}”. Try a different search or pick a category.</p>
            </div>
          )}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-display font-black text-slate-900 text-lg mb-3">{cat}</h2>
              <div className="space-y-2.5">
                {items.map((f) => (
                  <div key={f.q} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => setOpen(open === f.q ? null : f.q)}
                      className="w-full flex items-center justify-between gap-3 text-left px-5 py-4 hover:bg-slate-50 transition">
                      <span className="text-sm font-black text-slate-800">{f.q}</span>
                      <Plus className={'h-4 w-4 text-[#1B6B3A] shrink-0 transition-transform ' + (open === f.q ? 'rotate-45' : '')} />
                    </button>
                    {open === f.q && (
                      <div className="px-5 pb-4 -mt-1">
                        <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help CTA */}
        <div className="mt-12 bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-display font-black text-lg text-[#E8A020]">Still have a question?</h3>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl leading-relaxed">Our support team and agronomists are happy to help with orders, products, projects or loans.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a href="https://wa.me/917397789803?text=Hello%20IGO%20Agri%20Mart%2C%20I%20have%20a%20question" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black px-5 py-3 rounded-xl transition">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <button onClick={() => setCurrentPage('contact')}
              className="inline-flex items-center gap-1.5 bg-[#E8A020] hover:bg-[#d18f17] text-emerald-950 text-xs font-black px-5 py-3 rounded-xl transition">
              <Phone className="h-4 w-4" /> Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
