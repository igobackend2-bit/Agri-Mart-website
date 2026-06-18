import React from 'react';
import { 
  Hammer, 
  Cpu, 
  Sprout, 
  Leaf, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Activity,
  UserCheck,
  Scale
} from 'lucide-react';
import { Service } from '../types';
import { SEED_SERVICES } from '../seedData';

interface ServicesComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  setSelectedService: (s: Service | null) => void;
}

export default function ServicesComponent({
  lang,
  setCurrentPage,
  setSelectedService
}: ServicesComponentProps) {
  
  const handleServiceClick = (srv: Service) => {
    setSelectedService(srv);
    setCurrentPage('services-detail');
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Expert & Engineering Services</span>
        </nav>

        {/* Header Title Section */}
        <div id="services-header" className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              27 Brands Conglomerate Services
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl tracking-tight mt-4">
              {lang === 'ta' ? 'அக்ரிடெக் தொழில்முறை சேவைகள்' : 'India’s Unified Agritech Professional Services'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              Providing modern engineering, crop medicine, laboratory analysis, and government subsidy linkages directly to Tamil Nadu farmers. Sponsored and quality-checked by the IGO Group of Companies Chennai headquarters.
            </p>
          </div>
        </div>

        {/* Services Bento Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_SERVICES.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#1B6B3A]/30 transition group flex flex-col justify-between overflow-hidden"
            >
              {/* Image & Provider Tag */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={srv.image} 
                  alt={srv.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {srv.provider}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                  {srv.priceQuote}
                </div>
              </div>

              {/* Service Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1B6B3A] transition">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Bullet Bullet features teaser */}
                  <div className="mt-4 space-y-1.5">
                    {srv.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020] shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Category: {srv.category}
                  </span>
                  
                  <button 
                    onClick={() => handleServiceClick(srv)}
                    className="flex items-center gap-1.5 text-[#1B6B3A] hover:text-[#15532d] text-xs font-bold transition"
                  >
                    <span>{lang === 'ta' ? 'விவரம் காண்க' : 'Inquire Now'}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Seal Banner */}
        <div className="mt-14 bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#E8A020] text-emerald-950 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              ★
            </div>
            <div>
              <h4 className="text-base font-bold text-[#E8A020]">
                IGO Certified Seal Guarantee
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5 leading-relaxed max-w-2xl">
                Every booking creates a secure digital ServiceLead in our administrator panel. We match you with certified expert soil specialists or licensed drone aviators based in Chennai or local regional centers.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('services-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold py-2.5 px-5 rounded-lg border border-[#248F4E] shadow-sm shrink-0 transition"
          >
            Browse All Services
          </button>
        </div>

        {/* ── Our Flagship Farming Projects ─────────────────────── */}
        <div className="mt-12">
          <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">Our Flagship Farming Projects</h3>
          <p className="text-sm text-slate-500 mt-1">Turnkey, bankable agri-ventures engineered, built and managed by the IGO Group.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {[
              { t: 'Polyhouse & Greenhouse', d: 'Climate-controlled protected cultivation — GI structures, shade nets, drip & fogger systems for year-round high-value crops.', img: '/images/live_trial_field_india.png' },
              { t: 'Hydroponics & Vertical Farms', d: 'Soil-less NFT / DWC towers and grow systems for clean, high-yield vegetable and leafy-green production.', img: '/catalog/nursery tools/Flat Bed Hydroponic System 200 Planter.jpeg' },
              { t: 'Goat & Livestock Farming', d: 'Modern goat, dairy and poultry units with health monitoring, feeding and shed engineering.', img: '/images/agri_farm_bg.png' },
              { t: 'Aquaculture & Fisheries', d: 'Integrated fish & shrimp farms with biofloc tanks, aeration and cold-chain export readiness.', img: '/catalog/nursery tools/Fish Tank 3500 lt.jpeg' },
              { t: 'Precision & Smart Farming', d: 'Sensor-driven irrigation, drone spraying and data-led agronomy for higher yield at lower cost.', img: '/images/post_drip_automation.png' },
              { t: 'Cold Storage & Processing', d: 'Post-harvest cold rooms, warehouses and processing units to cut wastage and boost farm-gate value.', img: '/images/live_trial_field_main.png' },
            ].map((p) => (
              <div key={p.t} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#1B6B3A] hover:shadow-md transition">
                <img src={p.img} alt={p.t} className="w-full h-36 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/agri_farm_bg.png'; }} />
                <div className="p-5">
                  <div className="font-display font-black text-[#1B6B3A] text-base">{p.t}</div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Why IGO Agritech is the best ─────────────────────── */}
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">Why Choose IGO Agritech</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {[
              { t: 'In-house Engineering', d: 'Design, structures and automation built by our own agri-engineering team.' },
              { t: 'Govt Subsidy Linkage', d: 'Direct PM-KUSUM, NHB & NABARD subsidy facilitation — up to 90% coverage.' },
              { t: '26-Vertical Ecosystem', d: 'Land, finance, build, inputs and market access under one IGO Group roof.' },
              { t: 'Quality-Checked', d: 'Every project sponsored and quality-audited by IGO Group, Chennai HQ.' },
            ].map((w) => (
              <div key={w.t} className="bg-[#F7F9F4] border border-slate-100 rounded-xl p-4">
                <div className="font-black text-slate-800 text-sm">{w.t}</div>
                <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">{w.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => setCurrentPage('contact')}
              className="bg-[#1B6B3A] hover:bg-[#15532d] text-white font-black text-xs px-6 py-3 rounded-xl transition">
              Talk to an Agronomist
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
