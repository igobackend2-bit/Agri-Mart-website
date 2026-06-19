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

        {/* ── Turnkey Farming Projects (mirrors IGO Agritech Farms) ───────────── */}
        <div className="mt-14">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <span className="bg-[#E8A020]/15 text-[#B45309] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">24 Project Types · Pan-India</span>
              <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight mt-2">Turnkey Farming Projects</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">End-to-end agri-ventures engineered, built and managed by the IGO Group — from feasibility and design to construction, inputs and market linkage. Most projects are <b className="text-[#1B6B3A]">government-subsidy eligible</b>.</p>
            </div>
            <button onClick={() => setCurrentPage('contact')} className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold py-2.5 px-5 rounded-lg shrink-0 transition">Book Free Consultation</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {[
              {
                title: 'Agri Farming Projects', count: '10 project types',
                img: 'https://www.igoagritechfarms.in/assets/new%20project%20images/main-page/agri%20farming%20projects%20.png',
                desc: 'High-value crop ventures — protected cultivation, soil-less systems and precision plantations engineered for year-round yield.',
                items: ['Polyhouse & Protected Cultivation', 'Hydroponics (NFT / DWC)', 'Vertical Farming', 'Open-Field Orchards — Dragon Fruit, Mango, Guava, Papaya, Fig, Blueberry', 'Vegetable Cultivation — Tomato, Chilli, Capsicum, Cucumber, Melons', 'Medicinal Crops — Aloe Vera, Moringa, Turmeric, Ginger', 'Floriculture — Rose, Jasmine, Marigold', 'Mushroom Farming', 'Urban Farming', 'Nursery Setup'],
              },
              {
                title: 'Aquaculture Farming Projects', count: '5 project types',
                img: 'https://www.igoagritechfarms.in/assets/new%20project%20images/main-page/aquaculture%20projects%20.png',
                desc: 'Integrated fish & shrimp farming with modern tanks, aeration and export-ready cold-chain readiness.',
                items: ['Fish Farming', 'Biofloc Systems', 'Shrimp Farming', 'Crab Farming', 'Integrated Aquaculture'],
              },
              {
                title: 'Livestock Farming Projects', count: '5 project types',
                img: 'https://www.igoagritechfarms.in/assets/new%20project%20images/main-page/live%20stock%20project%20.png',
                desc: 'Modern animal husbandry units with health monitoring, scientific feeding and shed engineering.',
                items: ['Goat Farming', 'Sheep Farming', 'Dairy Farming', 'Poultry Farming', 'Integrated Livestock'],
              },
              {
                title: 'Farm Engineering Projects', count: '4 project types',
                img: 'https://www.igoagritechfarms.in/assets/new%20project%20images/main-page/farm%20engineering%20project%20.png',
                desc: 'The civil & energy backbone of every farm — infrastructure, water systems, solar power and land development.',
                items: ['Farm Infrastructure', 'Water Management & Irrigation', 'Solar & Renewable Energy', 'Land Development'],
              },
            ].map((cat) => (
              <div key={cat.title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/agri_farm_bg.png'; }} />
                  <span className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">{cat.count}</span>
                  <span className="absolute bottom-3 right-3 bg-[#E8A020] text-emerald-950 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow">Subsidy Eligible</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-display font-black text-[#1B6B3A] text-lg">{cat.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{cat.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cat.items.map((it) => (
                      <span key={it} className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">{it}</span>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage('contact')}
                    className="mt-4 self-start inline-flex items-center gap-1.5 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-black px-4 py-2.5 rounded-lg transition">
                    <span>Get free feasibility report</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
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
