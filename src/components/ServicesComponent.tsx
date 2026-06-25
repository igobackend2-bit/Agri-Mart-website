import React, { useState } from 'react';
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
  Scale,
  X,
  ExternalLink
} from 'lucide-react';
import { Service } from '../types';
import { SEED_SERVICES } from '../seedData';

// Maps each project/category to its detail page on the IGO Agritech Farms site,
// where the customer can read more and submit an enquiry.
const PROJECT_LINKS: Record<string, string> = {
  'Polyhouse Projects': 'https://www.igoagritechfarms.com/polyhouseproject.php',
  'Hydroponic Projects': 'https://www.igoagritechfarms.com/hydroponicproject.php',
  'Joint Venture Projects': 'https://www.igoagritechfarms.com/jointventureproject.php',
  'Vertical Farming Projects': 'https://www.igoagritechfarms.com/verticalfarmingproject.php',
  'Open Cultivation Projects': 'https://www.igoagritechfarms.com/opencultivationproject.php',
  'Rooftop Projects': 'https://www.igoagritechfarms.com/rooftopproject.php',
  'Floriculture Projects': 'https://www.igoagritechfarms.com/floricultureproject.php',
  'Goat Farming Projects': 'https://www.igoagritechfarms.com/goatfarmingproject.php',
  'Horticulture Projects': 'https://www.igoagritechfarms.com/horticultureproject.php',
  'Landscaping Projects': 'https://www.igoagritechfarms.com/landscapingproject.php',
  'Mushroom Cultivation Projects': 'https://www.igoagritechfarms.com/mushroomcultivationproject.php',
  'Pondliner Projects': 'https://www.igoagritechfarms.com/pondlinerproject.php',
  'Solar Dryer Projects': 'https://www.igoagritechfarms.com/solardryerproject.php',
  'Nursery Projects': 'https://www.igoagritechfarms.com/nurseryproject.php',
  'Microgreens Farming Projects': 'https://www.igoagritechfarms.com/microgreensproject.php',
  'Agri Farming Projects': 'https://www.igoagritechfarms.in/projects/agri',
  'Aquaculture Farming Projects': 'https://www.igoagritechfarms.in/projects/aquaculture',
  'Livestock Farming Projects': 'https://www.igoagritechfarms.in/projects/livestock',
  'Farm Engineering Projects': 'https://www.igoagritechfarms.in/projects/engineering',
};

// Full in-page detail shown when a customer taps a project — so they can read
// everything on our own site before choosing to enquire.
const PROJECT_DETAILS: Record<string, { benefits: string[]; idealFor: string }> = {
  'Polyhouse Projects': { benefits: ['Year-round, weather-proof cultivation', '2–5× higher yield than open fields', 'Protection from pests, heavy rain & heat', 'Premium, export-grade produce'], idealFor: 'High-value vegetables, capsicum, cucumber, exotic flowers and nursery crops on 0.25 acre and above.' },
  'Hydroponic Projects': { benefits: ['Up to 90% less water usage', 'Faster growth & higher plant density', 'No soil — fewer soil-borne diseases', 'Clean, residue-free leafy greens'], idealFor: 'Lettuce, spinach, herbs and exotic greens for urban, rooftop and commercial growers.' },
  'Joint Venture Projects': { benefits: ['You provide land, IGO provides everything else', 'Fully managed, hands-off farm business', 'Transparent profit-sharing model', 'Bankable, professionally run venture'], idealFor: 'Land owners who want farm income without running day-to-day operations.' },
  'Vertical Farming Projects': { benefits: ['Maximum yield per square foot', 'Grows in urban & space-limited sites', 'Climate-controlled, all-season output', 'Lower water and land footprint'], idealFor: 'Urban entrepreneurs and indoor commercial leafy-green production.' },
  'Open Cultivation Projects': { benefits: ['Lowest setup cost per acre', 'Large-scale, high-volume production', 'Drip irrigation & fertigation included', 'Full agronomy & crop-care support'], idealFor: 'Dragon fruit, mango, guava, papaya and field crops on open land.' },
  'Rooftop Projects': { benefits: ['Turns idle terraces into income/food', 'Lightweight, leak-safe grow systems', 'Fresh vegetables at home or office', 'Low maintenance, modular setup'], idealFor: 'Homes, apartments, schools and commercial buildings with unused rooftops.' },
  'Floriculture Projects': { benefits: ['Steady, high-value market demand', 'Climate-controlled premium blooms', 'Year-round flowering cycles', 'Strong returns per square metre'], idealFor: 'Rose, jasmine, marigold and exotic cut-flower growers.' },
  'Goat Farming Projects': { benefits: ['Proper shed engineering & ventilation', 'Scientific breed & feed selection', 'Health & vaccination management', 'Strong, growing meat & milk demand'], idealFor: 'First-time and expanding livestock entrepreneurs.' },
  'Horticulture Projects': { benefits: ['End-to-end orchard development', 'Right crop & spacing planning', 'Irrigation & nutrition management', 'Sustainable, high-quality produce'], idealFor: 'Fruit and vegetable orchard owners seeking long-term yield.' },
  'Landscaping Projects': { benefits: ['Professional design & execution', 'Lawns, gardens, green walls & hardscape', 'Low-maintenance plant selection', 'Adds value to any property'], idealFor: 'Homes, farms, resorts, institutions and commercial campuses.' },
  'Mushroom Cultivation Projects': { benefits: ['High return from very little space', 'Climate-controlled grow rooms', 'Spawn supply & training included', 'Fast, repeatable crop cycles'], idealFor: 'Oyster, milky and button mushroom growers — even at home scale.' },
  'Pondliner Projects': { benefits: ['Leak-proof water storage', 'UV-stable, long-lasting HDPE', 'Ideal for aquaculture & reservoirs', 'Reduces water loss & seepage'], idealFor: 'Farm reservoirs, fish/shrimp ponds and irrigation water storage.' },
  'Solar Dryer Projects': { benefits: ['Cuts post-harvest losses', 'Hygienic, dust-free drying', 'Off-grid clean solar energy', 'Higher value for dried produce'], idealFor: 'Drying fruits, vegetables, spices and herbs for better market price.' },
  'Nursery Projects': { benefits: ['Quality saplings & planting material', 'Poly/shade structures + mist systems', 'Year-round propagation', 'Strong demand from farmers & gardens'], idealFor: 'Entrepreneurs supplying seedlings, grafts and saplings.' },
  'Microgreens Farming Projects': { benefits: ['High-margin premium produce', 'Fast 7–14 day crop cycles', 'Indoor, year-round soil-less trays', 'Strong restaurant & urban demand'], idealFor: 'Urban growers targeting restaurants, hotels and health markets.' },
  'Agri Farming Projects': { benefits: ['10+ crop & system options', 'Protected, soil-less & open systems', 'Engineered for year-round yield', 'Subsidy-eligible turnkey delivery'], idealFor: 'Anyone planting vegetables, fruits, flowers, medicinal or exotic crops.' },
  'Aquaculture Farming Projects': { benefits: ['Modern tanks & aeration systems', 'Biofloc & integrated options', 'Export-ready cold-chain readiness', 'High-protein, high-demand output'], idealFor: 'Fish, shrimp and crab farming entrepreneurs.' },
  'Livestock Farming Projects': { benefits: ['Scientific shed engineering', 'Health monitoring & feeding plans', 'Goat, sheep, dairy & poultry units', 'Reliable, recurring income'], idealFor: 'Farmers building animal-husbandry businesses.' },
  'Farm Engineering Projects': { benefits: ['Infrastructure & water systems', 'Solar & renewable energy', 'Land development & leveling', 'The backbone of every farm'], idealFor: 'Any farm needing civil, water or energy infrastructure.' },
};

const PROJECT_PROCESS = ['Enquiry & free consultation', 'Site survey & feasibility report', 'Engineering design, costing & subsidy mapping', 'Construction, automation & inputs', 'Handover, agronomy support, AMC & buyback'];
const PROJECT_INCLUDED = ['Feasibility & ROI study', 'Engineering design & build', 'Quality inputs — seeds, saplings, materials', 'Government-subsidy facilitation', 'Agronomy support & maintenance (AMC)', 'Market linkage & buyback options'];

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

  // Project explainer modal — shows details + a redirect to IGO Agritech Farms.
  const [openProject, setOpenProject] = useState<{ title: string; img: string; desc: string } | null>(null);

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Expert & Engineering Services</span>
        </nav>

        {/* Professional hero banner */}
        <div id="services-header" className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-[#0a2e18] via-[#134e2a] to-[#0a2e18] shadow-xl">
          <img src="/images/agri_farm_bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06210f]/95 via-[#0a2e18]/85 to-[#0a2e18]/55"></div>
          <div className="absolute -top-24 -right-24 h-80 w-80 bg-[#E8A020]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 h-40 w-40 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-[#E8A020] text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8A020]"></span> 27-Brand Agritech Conglomerate
            </span>
            <h1 className="font-display font-black text-white text-3xl sm:text-5xl tracking-tight mt-5 leading-[1.1]">
              {lang === 'ta' ? 'இந்தியாவின் ஒருங்கிணைந்த அக்ரிடெக் சேவைகள்' : (<>India’s Unified Agritech<br className="hidden sm:block" /> Engineering &amp; Services</>)}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
              From precision farm engineering and crop medicine to laboratory analysis, government-subsidy linkage and assured buyback — delivered end-to-end and quality-audited by the IGO Group of Companies, Chennai.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button onClick={() => { const el = document.getElementById('services-grid'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                className="bg-[#E8A020] hover:bg-[#d18f17] text-emerald-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-amber-900/20">
                Explore Our Services
              </button>
              <button onClick={() => setCurrentPage('contact')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/25 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition">
                Book Free Consultation
              </button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-emerald-100/80 text-[11px] sm:text-xs font-bold">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020]" /> Govt Subsidy up to 90%</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020]" /> In-house Engineering Team</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020]" /> Pan-India Delivery</span>
            </div>
          </div>
        </div>

        {/* Credibility stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { n: '10+', l: 'Years of Agri Engineering' },
            { n: '6000+', l: 'Projects Delivered' },
            { n: '27', l: 'IGO Group Brands' },
            { n: '75+', l: 'Industry Awards' },
          ].map((s) => (
            <div key={s.l} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="font-display font-black text-[#1B6B3A] text-2xl sm:text-3xl">{s.n}</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 leading-tight">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Services Bento Grid */}
        <div className="mb-5">
          <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">Expert &amp; Engineering Services</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">On-demand specialists — soil testing, drone spraying, crop advisory and more — booked directly through IGO Agri Mart.</p>
        </div>
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
                  <button onClick={() => setOpenProject({ title: cat.title, img: cat.img, desc: cat.desc })}
                    className="mt-4 self-start inline-flex items-center gap-1.5 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-black px-4 py-2.5 rounded-lg transition">
                    <span>View details &amp; enquire</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed portfolio — every individual project (igoagritechfarms.com) */}
          <h4 className="font-display font-black text-slate-900 text-lg mt-12 mb-1">Explore Every Project We Build</h4>
          <p className="text-sm text-slate-500 mb-5">Tap any project to request a free feasibility report and cost estimate from our engineering team.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: 'Polyhouse Projects', img: 'https://www.igoagritechfarms.com/images/pr7.webp', d: 'Climate-controlled GI polyhouses, shade nets & fan-pad greenhouses for year-round, high-yield cultivation of vegetables, flowers and exotic crops — protected from pests, rain and heat.' },
              { t: 'Hydroponic Projects', img: 'https://www.igoagritechfarms.com/images/pr3.webp', d: 'Soil-less NFT, DWC and drip hydroponic systems that grow clean, fast, high-density crops using up to 90% less water — ideal for leafy greens and exotic vegetables.' },
              { t: 'Joint Venture Projects', img: 'https://www.igoagritechfarms.com/images/joint.jpg', d: 'Partner with IGO on a profit-sharing agri venture — we bring expertise, technology and management, you bring land — for a fully managed, bankable farm business.' },
              { t: 'Vertical Farming Projects', img: 'https://www.igoagritechfarms.com/images/vertical1.jpg', d: 'Multi-tier indoor grow systems with LED lighting and climate control that maximise yield per square foot — perfect for urban and space-constrained sites.' },
              { t: 'Open Cultivation Projects', img: 'https://www.igoagritechfarms.com/images/cultivation.png', d: 'Precision open-field plantations — dragon fruit, mango, guava, papaya and more — with drip irrigation, fertigation and full agronomy support for maximum ROI.' },
              { t: 'Rooftop Projects', img: 'https://www.igoagritechfarms.com/images/rooftop1.jpg', d: 'Turn idle terraces into productive gardens — lightweight grow beds, containers and hydroponic units for fresh vegetables at home or on commercial rooftops.' },
              { t: 'Floriculture Projects', img: 'https://www.igoagritechfarms.com/images/floriculture.avif', d: 'Commercial flower farming — rose, jasmine, marigold and exotic blooms — under climate-controlled precision for steady, high-value market supply.' },
              { t: 'Goat Farming Projects', img: 'https://www.igoagritechfarms.com/images/pr4.webp', d: 'Scientifically designed goat & sheep units with proper shed engineering, breed selection, feeding and health management for profitable livestock returns.' },
              { t: 'Horticulture Projects', img: 'https://www.igoagritechfarms.com/images/horticulture.webp', d: 'End-to-end fruit and vegetable orchard development — planning, planting, irrigation and crop care for sustainable, high-quality horticultural produce.' },
              { t: 'Landscaping Projects', img: 'https://www.igoagritechfarms.com/images/pr1.webp', d: 'Professional landscape design and execution for homes, farms, resorts and institutions — lawns, gardens, hardscapes and green walls.' },
              { t: 'Mushroom Cultivation Projects', img: 'https://www.igoagritechfarms.com/images/mushroom.jpeg', d: 'Low-space, high-return mushroom units — oyster, milky and button — with climate-controlled rooms, spawn supply and hands-on cultivation training.' },
              { t: 'Pondliner Projects', img: 'https://www.igoagritechfarms.com/images/pondliner.jpg', d: 'HDPE / geomembrane pond liners for water storage, aquaculture and farm reservoirs — leak-proof, UV-stable and long-lasting water management.' },
              { t: 'Solar Dryer Projects', img: 'https://www.igoagritechfarms.com/images/solar1.png', d: 'Solar-powered dehydration units to dry fruits, vegetables and spices hygienically — cutting post-harvest losses with clean, off-grid energy.' },
              { t: 'Nursery Projects', img: 'https://www.igoagritechfarms.com/images/nursery.webp', d: 'Commercial plant nursery setup — poly/shade structures, mist systems and quality planting material for saplings, seedlings and grafts.' },
              { t: 'Microgreens Farming Projects', img: 'https://www.igoagritechfarms.com/images/micro-2.png', d: 'Compact, fast-cycle microgreens production for premium urban and restaurant markets — high-margin, soil-less trays grown indoors year-round.' },
            ].map((p) => (
              <button key={p.t} type="button" onClick={() => setOpenProject({ title: p.t, img: p.img, desc: p.d })}
                className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#1B6B3A] hover:shadow-md transition cursor-pointer flex flex-col">
                <img src={p.img} alt={p.t} loading="lazy" className="w-full h-40 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/agri_farm_bg.png'; }} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-display font-black text-[#1B6B3A] text-base">{p.t}</div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">{p.d}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-black text-[#1B6B3A]">View details &amp; enquire <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Ongoing Service Programs (AMC · Buyback · Gardening · Mentorship) ── */}
        <div className="mt-14">
          <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">Beyond the build — we stay with you</span>
          <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight mt-2">Ongoing Service Programs</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">A farm isn’t finished when it’s built. These IGO programs keep your project profitable, maintained and market-linked for the long run.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {[
              { icon: Activity, t: 'AMC — Annual Maintenance', d: 'A yearly maintenance contract for your polyhouse, hydroponic or irrigation setup — scheduled servicing, part replacement and uptime support so yields never drop.', pts: ['Scheduled site visits', 'Genuine spare parts', 'Priority breakdown support'] },
              { icon: Scale, t: 'Buyback Guarantee', d: 'We connect your harvest to assured markets and offer a buyback option on selected crops — so you grow with the confidence that your produce will sell.', pts: ['Assured market linkage', 'Fair, pre-agreed pricing', 'Pickup & logistics support'] },
              { icon: Sprout, t: 'Gardening Services', d: 'Design, setup and upkeep of home, terrace and institutional gardens — from kitchen gardens to commercial green spaces, maintained by our horticulture team.', pts: ['Home & rooftop gardens', 'Regular upkeep visits', 'Plants, soil & inputs included'] },
              { icon: UserCheck, t: 'Mentorship & Training', d: 'Hands-on training and one-to-one mentorship for new and existing farmers — crop planning, operations and agri-business guidance from IGO experts.', pts: ['Practical farm training', 'Agri-business mentoring', 'Ongoing expert helpline'] },
            ].map((s) => (
              <div key={s.t} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-[#1B6B3A]/30 transition flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-[#1B6B3A]/10 text-[#1B6B3A] flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-black text-[#1B6B3A] text-base mt-3">{s.t}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed flex-1">{s.d}</p>
                <div className="mt-3 space-y-1.5">
                  {s.pts.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020] shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('contact')}
                  className="mt-4 self-start inline-flex items-center gap-1.5 text-[#1B6B3A] hover:text-[#15532d] text-xs font-black transition">
                  Enquire <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works — enquiry to harvest ── */}
        <div className="mt-14 bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800">
          <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-white">How It Works</h3>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl">A clear, guided journey — you’re supported at every step from first enquiry to a profitable, running farm.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {[
              { n: '1', t: 'Enquiry', d: 'Tell us your land, budget and goal.' },
              { n: '2', t: 'Site Survey & Feasibility', d: 'Free assessment, crop & ROI plan.' },
              { n: '3', t: 'Design & Quote', d: 'Engineering design, costing & subsidy mapping.' },
              { n: '4', t: 'Build & Inputs', d: 'Construction, automation, seeds & saplings.' },
              { n: '5', t: 'Harvest & Buyback', d: 'Agronomy support, AMC & market linkage.' },
            ].map((step) => (
              <div key={step.n} className="bg-emerald-900/50 border border-emerald-800 rounded-xl p-4">
                <div className="h-8 w-8 rounded-full bg-[#E8A020] text-emerald-950 font-black flex items-center justify-center text-sm">{step.n}</div>
                <div className="font-black text-sm mt-2.5">{step.t}</div>
                <div className="text-[11px] text-emerald-200 mt-1 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentPage('contact')}
            className="mt-6 bg-[#E8A020] hover:bg-[#d18f17] text-emerald-950 font-black text-xs px-6 py-3 rounded-xl transition">
            Start with a Free Consultation
          </button>
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

      {/* Full in-page project detail */}
      {openProject && (() => {
        const detail = PROJECT_DETAILS[openProject.title];
        const benefits = detail?.benefits || ['Engineered & built by IGO’s in-house team', 'Government-subsidy eligible', 'Quality inputs & agronomy support', 'Market linkage & buyback options'];
        const idealFor = detail?.idealFor || 'Farmers, entrepreneurs and land owners looking for a professionally managed agri-venture.';
        return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" onClick={() => setOpenProject(null)}>
          <div className="bg-white sm:rounded-2xl w-full max-w-3xl shadow-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Hero */}
            <div className="relative h-56 sm:h-72 bg-slate-900 sticky top-0 z-10">
              <img src={openProject.img} alt={openProject.title} className="w-full h-full object-cover opacity-90"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/agri_farm_bg.png'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
              <button onClick={() => setOpenProject(null)} className="absolute top-3 right-3 h-9 w-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow">
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="bg-[#E8A020] text-emerald-950 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow">Subsidy Eligible · Turnkey</span>
                <h3 className="font-display font-black text-white text-2xl sm:text-3xl tracking-tight mt-2">{openProject.title}</h3>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <p className="text-sm text-slate-700 leading-relaxed">{openProject.desc}</p>

              {/* Key benefits */}
              <h4 className="font-display font-black text-slate-900 text-base mt-6 mb-3">Why choose this project</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 bg-[#F7F9F4] border border-slate-100 rounded-xl p-3">
                    <CheckCircle2 className="h-4 w-4 text-[#1B6B3A] shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-700 leading-snug">{b}</span>
                  </div>
                ))}
              </div>

              {/* Ideal for */}
              <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1B6B3A]">Ideal for</div>
                <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">{idealFor}</p>
              </div>

              {/* How we build it */}
              <h4 className="font-display font-black text-slate-900 text-base mt-6 mb-3">How we deliver it</h4>
              <div className="space-y-2">
                {PROJECT_PROCESS.map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#1B6B3A] text-white text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</div>
                    <span className="text-xs text-slate-700 font-semibold leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <h4 className="font-display font-black text-slate-900 text-base mt-6 mb-3">What’s included</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                {PROJECT_INCLUDED.map((inc) => (
                  <div key={inc} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8A020] shrink-0" /> {inc}
                  </div>
                ))}
              </div>

              {/* Subsidy & cost assurance */}
              <div className="mt-6 bg-emerald-950 text-white rounded-xl p-4">
                <div className="text-sm font-black text-[#E8A020]">Government subsidy &amp; free cost estimate</div>
                <p className="text-[11px] text-emerald-100 mt-1 leading-relaxed">Most projects qualify for PM-KUSUM, NHB, NABARD or state horticulture subsidies — up to 90% support on eligible components. Our team prepares a free, site-specific cost estimate and ROI plan before you commit. No obligation.</p>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <button onClick={() => { setOpenProject(null); setCurrentPage('contact'); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-black px-4 py-3.5 rounded-xl transition">
                  Get a Free Quote &amp; Consultation <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <a href={PROJECT_LINKS[openProject.title] || 'https://www.igoagritechfarms.com/projects.php'} target="_blank" rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-[#1B6B3A] text-[#1B6B3A] hover:bg-emerald-50 text-xs font-black px-4 py-3.5 rounded-xl transition">
                  Full specs on IGO Agritech <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-3">Quality-audited by IGO Group of Companies, Chennai · 6000+ projects delivered</p>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
