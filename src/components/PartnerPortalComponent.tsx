import React, { useState } from 'react';
import {
  Store,
  Truck,
  Package,
  ClipboardList,
  TrendingUp,
  Wallet,
  Users,
  MapPin,
  BarChart3,
  Warehouse,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

interface PartnerPortalComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  userProfile: any;
}

type PortalTab = 'dealer' | 'distributor';

// --- Sample/mock data — illustrates the intended Dealer & Distributor Portal experience ---
const DEALER_KPIS = [
  { label: 'This Month Sales', value: '₹4,82,300', delta: '+12.4%', up: true, icon: TrendingUp },
  { label: 'Active Orders', value: '37', delta: '+5', up: true, icon: ClipboardList },
  { label: 'Inventory SKUs', value: '212', delta: '-3', up: false, icon: Package },
  { label: 'Wallet Balance', value: '₹68,540', delta: '+₹9,200', up: true, icon: Wallet },
];

const DEALER_ORDERS = [
  { id: 'ORD-7741', customer: 'Murugan Farms, Trichy', items: 'NPK 19:19:19 (40 bags)', amount: '₹38,000', status: 'Dispatched' },
  { id: 'ORD-7742', customer: 'Lakshmi Agro Traders, Salem', items: 'Coragen Insecticide (60 units)', amount: '₹52,400', status: 'Processing' },
  { id: 'ORD-7743', customer: 'Senthil Nursery, Dindigul', items: 'Hybrid Tomato Seeds (25 packs)', amount: '₹6,250', status: 'Confirmed' },
  { id: 'ORD-7744', customer: 'Karthik Agencies, Erode', items: 'Seaweed Extract (30 ltr)', amount: '₹14,700', status: 'Delivered' },
];

const DEALER_INVENTORY = [
  { name: 'IGO Hybrid Tomato Seeds — Swaraksha Plus', stock: 184, reorderAt: 50, status: 'Healthy' },
  { name: 'Coromandel NPK 19:19:19 Soluble Fertilizer', stock: 42, reorderAt: 60, status: 'Low Stock' },
  { name: 'FMC Coragen Broad-Spectrum Insecticide', stock: 96, reorderAt: 40, status: 'Healthy' },
  { name: 'IGO Bio Solutions Organic Seaweed Extract', stock: 18, reorderAt: 30, status: 'Reorder Now' },
];

const DEALER_COMMISSION = [
  { period: 'This Month', sales: '₹4,82,300', commissionRate: '6%', earned: '₹28,938' },
  { period: 'Last Month', sales: '₹4,15,800', commissionRate: '6%', earned: '₹24,948' },
  { period: 'Quarter to Date', sales: '₹13,42,100', commissionRate: '6% avg.', earned: '₹80,526' },
];

const DISTRIBUTOR_KPIS = [
  { label: 'Regional Revenue (TN)', value: '₹61.4 L', delta: '+8.7%', up: true, icon: TrendingUp },
  { label: 'Active Dealers', value: '128', delta: '+6', up: true, icon: Store },
  { label: 'Pending Bulk Orders', value: '14', delta: '+3', up: true, icon: ClipboardList },
  { label: 'Warehouse Utilisation', value: '78%', delta: '+4%', up: true, icon: Warehouse },
];

const DEALER_ROSTER = [
  { name: 'Murugan Agro Centre', district: 'Tiruchirappalli', tier: 'Gold', mtdSales: '₹6.2 L', status: 'Active' },
  { name: 'Lakshmi Agro Traders', district: 'Salem', tier: 'Silver', mtdSales: '₹3.8 L', status: 'Active' },
  { name: 'Senthil Nursery & Agencies', district: 'Dindigul', tier: 'Gold', mtdSales: '₹5.1 L', status: 'Active' },
  { name: 'Karthik Agencies', district: 'Erode', tier: 'Bronze', mtdSales: '₹1.6 L', status: 'Onboarding' },
  { name: 'Annai Velankanni Agro', district: 'Thanjavur', tier: 'Silver', mtdSales: '₹2.9 L', status: 'Active' },
];

const REGIONAL_PERFORMANCE = [
  { region: 'Trichy & Cauvery Delta', revenue: '₹18.2 L', growth: '+11%', dealers: 34 },
  { region: 'Western Districts (Salem–Erode)', revenue: '₹14.6 L', growth: '+7%', dealers: 29 },
  { region: 'Southern Districts (Madurai–Dindigul)', revenue: '₹16.9 L', growth: '+14%', dealers: 38 },
  { region: 'Northern Districts (Vellore–Krishnagiri)', revenue: '₹11.7 L', growth: '+4%', dealers: 27 },
];

const BULK_ORDERS = [
  { id: 'BLK-2201', dealer: 'Murugan Agro Centre', product: 'NPK 19:19:19 Soluble Fertilizer', qty: '200 bags (MOQ 50)', status: 'Awaiting Approval' },
  { id: 'BLK-2202', dealer: 'Senthil Nursery & Agencies', product: 'Hybrid Tomato Seeds — Swaraksha Plus', qty: '500 packs (MOQ 50)', status: 'Approved · Dispatch Pending' },
  { id: 'BLK-2203', dealer: 'Annai Velankanni Agro', product: 'FMC Coragen Insecticide', qty: '150 units (MOQ 25)', status: 'Quotation Sent' },
];

function StatCard({ label, value, delta, up, icon: Icon }: { label: string; value: string; delta: string; up: boolean; icon: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-9 w-9 rounded-xl bg-[#1B6B3A]/10 text-[#1B6B3A] flex items-center justify-center">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-1 rounded-full ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-[#D94F3D]/10 text-[#D94F3D]'}`}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

const statusPill = (status: string) => {
  const map: Record<string, string> = {
    'Delivered': 'bg-emerald-50 text-emerald-700',
    'Dispatched': 'bg-sky-50 text-sky-700',
    'Processing': 'bg-amber-50 text-amber-800',
    'Confirmed': 'bg-slate-100 text-slate-600',
    'Healthy': 'bg-emerald-50 text-emerald-700',
    'Low Stock': 'bg-amber-50 text-amber-800',
    'Reorder Now': 'bg-[#D94F3D]/10 text-[#D94F3D]',
    'Active': 'bg-emerald-50 text-emerald-700',
    'Onboarding': 'bg-amber-50 text-amber-800',
    'Awaiting Approval': 'bg-amber-50 text-amber-800',
    'Approved · Dispatch Pending': 'bg-sky-50 text-sky-700',
    'Quotation Sent': 'bg-slate-100 text-slate-600',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};

const tierPill = (tier: string) => {
  const map: Record<string, string> = {
    Gold: 'bg-[#E8A020]/15 text-[#9c6c0c]',
    Silver: 'bg-slate-200 text-slate-700',
    Bronze: 'bg-orange-100 text-orange-800',
  };
  return map[tier] || 'bg-slate-100 text-slate-600';
};

export default function PartnerPortalComponent({
  lang,
  setCurrentPage,
  userProfile
}: PartnerPortalComponentProps) {
  const [tab, setTab] = useState<PortalTab>('dealer');

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Partner Portal</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> Dealer & Distributor Network · Demo Preview
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight flex items-center gap-3">
              <Store className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              {lang === 'ta' ? 'பார்ட்னர் போர்டல் — டீலர் & விநியோகஸ்தர்' : 'Partner Portal — Dealer & Distributor Network'}
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {lang === 'ta'
                ? 'IGO டீலர் மற்றும் விநியோகஸ்தர் வலையமைப்புக்கான டாஷ்போர்டுகளின் முன்னோட்டம் — தயாரிப்பு மேலாண்மை, இருப்பு, ஆர்டர்கள், விற்பனை பகுப்பாய்வு, கமிஷன் கண்காணிப்பு மற்றும் பிராந்திய செயல்திறன் ஆகியவற்றை ஒரே இடத்தில் காட்டுகிறது.'
                : 'A preview of the dashboards envisioned for IGO’s Dealer & Distributor network — product & inventory management, order queues, sales analytics, wallet/commission tracking, and regional performance, all in one place.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-white rounded-full border border-slate-100 shadow-sm p-1 mb-7">
          <button
            onClick={() => setTab('dealer')}
            className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full transition ${tab === 'dealer' ? 'bg-[#1B6B3A] text-white' : 'text-slate-500 hover:text-[#1B6B3A]'}`}
          >
            <Store className="h-4 w-4" /> {lang === 'ta' ? 'டீலர் டாஷ்போர்டு' : 'Dealer Dashboard'}
          </button>
          <button
            onClick={() => setTab('distributor')}
            className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full transition ${tab === 'distributor' ? 'bg-[#1B6B3A] text-white' : 'text-slate-500 hover:text-[#1B6B3A]'}`}
          >
            <Truck className="h-4 w-4" /> {lang === 'ta' ? 'விநியோகஸ்தர் டாஷ்போர்டு' : 'Distributor Dashboard'}
          </button>
        </div>

        {tab === 'dealer' ? (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {DEALER_KPIS.map((k, i) => (
                <div key={i}>
                  <StatCard label={k.label} value={k.value} delta={k.delta} up={k.up} icon={k.icon} />
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Orders queue */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" /> Orders Queue
                </p>
                <div className="space-y-3">
                  {DEALER_ORDERS.map(o => (
                    <div key={o.id} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800">{o.id} · {o.customer}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{o.items}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-slate-800">{o.amount}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusPill(o.status)}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Inventory Health
                </p>
                <div className="space-y-3">
                  {DEALER_INVENTORY.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-slate-400">Stock: {p.stock} units · Reorder at {p.reorderAt}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusPill(p.status)}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet & Commission */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" /> Dealer Wallet & Commission Tracking
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {DEALER_COMMISSION.map((c, i) => (
                  <div key={i} className="bg-[#F7F9F4] rounded-xl border border-slate-100 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.period}</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-1">{c.earned}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Sales: {c.sales} · Rate: {c.commissionRate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {DISTRIBUTOR_KPIS.map((k, i) => (
                <div key={i}>
                  <StatCard label={k.label} value={k.value} delta={k.delta} up={k.up} icon={k.icon} />
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dealer roster */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Dealer Management Roster
                </p>
                <div className="space-y-3">
                  {DEALER_ROSTER.map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          {d.name}
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${tierPill(d.tier)}`}>{d.tier}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.district} · MTD: {d.mtdSales}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusPill(d.status)}`}>{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk orders */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" /> Bulk Orders / RFQ Queue
                </p>
                <div className="space-y-3">
                  {BULK_ORDERS.map(b => (
                    <div key={b.id} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800">{b.id} · {b.dealer}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{b.product} — {b.qty}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusPill(b.status)}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3 flex items-start gap-1.5">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  Bulk-order thresholds reference each product's <span className="font-bold">MOQ</span> field — already added to the catalog data model.
                </p>
              </div>
            </div>

            {/* Regional performance */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Regional Performance & Revenue Dashboard
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {REGIONAL_PERFORMANCE.map((r, i) => (
                  <div key={i} className="bg-[#F7F9F4] rounded-xl border border-slate-100 p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{r.region}</p>
                      <p className="text-[11px] text-slate-400">{r.dealers} active dealers</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-slate-800">{r.revenue}</p>
                      <span className="text-[10px] font-bold text-emerald-700">{r.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-7 flex items-start gap-2.5">
          <Award className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            {lang === 'ta'
              ? 'மாதிரி காட்சி: இந்த டாஷ்போர்டுகள் மாதிரி தரவுகளுடன் கட்டமைக்கப்பட்டுள்ளன. நேரடி பதிப்புக்கு பங்கு அடிப்படையிலான அங்கீகாரம், ஆர்டர்/இருப்பு backend மற்றும் கணக்கு லெட்ஜர் தேவை.'
              : 'Demo Preview: these dashboards are built with sample data to illustrate the intended Dealer/Distributor experience. Going live requires role-based authentication, an order/inventory backend, and a wallet/commission ledger — see the Agri Mart 2.0 roadmap document for the phased plan.'}
          </p>
        </div>
        {userProfile?.role === 'admin' && (
          <p className="text-[10px] text-slate-400 mt-3 font-mono">Signed in as Admin — in production this portal would be scoped to authenticated Dealer/Distributor accounts only.</p>
        )}
      </div>
    </div>
  );
}
