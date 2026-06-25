import React from 'react';
import { CloudRain, Sun, ShieldCheck, Phone, ChevronRight, Tractor, Factory, Wrench, Leaf, Plane, Droplets } from 'lucide-react';
import { pageText } from '../siteConfig';
export function CorporateTrustStrip() {
  return (
    <div className="bg-gradient-to-r from-emerald-950 via-[#1B6B3A] to-emerald-950 text-white py-2.5 overflow-hidden border-b border-[#E8A020]/20 relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="IGO Logo" className="h-6 w-6 rounded-full object-cover border border-white/30" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-100">
            <strong className="text-white font-black">IGO Agri Mart</strong> — Online Agri-Inputs Store of the IGO Group
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E8A020] animate-pulse"></span>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#E8A020]">
            Winner of MSME Award 2024 - Best Agri-Consulting Brand
          </span>
        </div>
      </div>
    </div>
  );
}

export function FarmingWeatherAdvisory() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-500">
            <Sun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800 text-sm">Chennai, TN</h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Good Day for Spraying</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">32°C • Humidity 65% • Wind 12 km/h</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 border-l border-sky-200 pl-6">
          <CloudRain className="h-5 w-5 text-sky-400" />
          <p className="text-xs text-slate-600"><strong>Forecast:</strong> Clear skies for the next 3 days. Ideal for applying foliar fertilizers.</p>
        </div>
      </div>
    </div>
  );
}

export function ShopByCropGrid() {
  const crops = [
    { name: 'Tomato', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80', color: 'bg-red-50' },
    { name: 'Paddy', img: 'https://images.unsplash.com/photo-1629841498115-b77ddfbf6f6e?w=200&q=80', color: 'bg-amber-50' },
    { name: 'Cotton', img: 'https://images.unsplash.com/photo-1605000527376-7871b657cb0e?w=200&q=80', color: 'bg-slate-50' },
    { name: 'Chilli', img: 'https://images.unsplash.com/photo-1588047970726-218fc091f696?w=200&q=80', color: 'bg-green-50' },
    { name: 'Sugarcane', img: 'https://images.unsplash.com/photo-1626243883011-ea21798544e3?w=200&q=80', color: 'bg-emerald-50' },
    { name: 'Banana', img: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&q=80', color: 'bg-yellow-50' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mb-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">Shop by Crop</h2>
          <p className="text-slate-500 text-sm mt-1">Specialized inputs for your specific harvest.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {crops.map((c, i) => (
          <div key={i} className={`${c.color} rounded-2xl p-2 cursor-pointer hover:-translate-y-1 transition group border border-slate-100`}>
            <div className="h-20 w-full rounded-xl overflow-hidden mb-2">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <p className="text-center font-bold text-slate-800 text-xs sm:text-sm">{c.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FarmInfrastructureServices() {
  const dTitle = ['Polyhouse Construction', 'Smart Drip Irrigation', 'Precision Drone Spray', 'Commercial Orchard Setup'];
  const dDesc = ['Commercial climate-controlled structures.', 'Automated fertigation & drip pipelines.', 'UAV mapping & chemical application.', 'End-to-end plantation development.'];
  const dImg = ['/images/services/srv_06_polyhouse_1781771230939.png', '/images/services/srv_02_drip_irrigation_1781771172398.png', '/images/services/srv_03_drone_spray_1781771184491.png', '/images/services/srv_08_orchard_1781771257649.png'];
  const icons = [Factory, Droplets, Plane, Leaf];

  const services = [1, 2, 3, 4].map(i => ({
    title: pageText('home', `farm_srv${i}_title`, dTitle[i-1]),
    desc: pageText('home', `farm_srv${i}_desc`, dDesc[i-1]),
    img: pageText('home', `farm_srv${i}_img`, dImg[i-1]),
    icon: icons[i-1]
  }));

  const mainTitle = pageText('home', 'farm_title', 'Shop Inputs Here, Build Your Farm With Us');
  // Simple highlight of the word "Farm"
  const titleParts = mainTitle.split(/(Farm)/i);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B6B3A]/30 blur-[100px] rounded-full mix-blend-screen"></div>
      <div className="relative z-10 mb-10 text-center">
        <span className="inline-block bg-[#1B6B3A] text-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          {pageText('home', 'farm_sub', 'More Than a Store')}
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
          {titleParts.map((part, i) => 
            part.toLowerCase() === 'farm' ? <span key={i} className="text-[#E8A020]">{part}</span> : <React.Fragment key={i}>{part}</React.Fragment>
          )}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          {pageText('home', 'farm_desc', "Alongside the marketplace, the IGO group's engineering arm, IGO Agritech Farms, designs and builds commercial farming projects end-to-end — so the same trusted team that supplies your inputs can set up your farm.")}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((srv, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-[#E8A020]/50 transition group cursor-pointer backdrop-blur-sm">
            <div className="h-40 w-full overflow-hidden relative">
              <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              <srv.icon className="absolute bottom-3 left-3 h-6 w-6 text-[#E8A020]" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white text-base mb-1">{srv.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{srv.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#E8A020] group-hover:translate-x-1 transition-transform">
                Request Quote <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CropDoctorConsultation() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <Leaf className="w-48 h-48 -mr-10 -mb-10 text-[#1B6B3A]" />
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">Live Support</span>
            <h2 className="font-display font-black text-slate-900 text-2xl">Crop looking sick?</h2>
          </div>
          <p className="text-slate-600 text-sm max-w-md">
            Don't risk your harvest. Upload a photo of the diseased plant and get instant, free advisory from IGO's expert agronomists.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button onClick={() => window.open('https://wa.me/917397785803')} className="bg-[#1B6B3A] hover:bg-emerald-800 text-white font-black text-sm px-8 py-4 rounded-xl shadow-lg transition flex items-center gap-3 group">
            <Phone className="h-5 w-5 group-hover:animate-bounce" /> Ask Crop Doctor
          </button>
        </div>
      </div>
    </section>
  );
}

export function TopAgriBrandsCarousel() {
  const topBrands = [
    '/images/Brands/1.jpg', '/images/Brands/2.jpg', '/images/Brands/3.jpg', 
    '/images/Brands/4.jpg', '/images/Brands/5.jpg', '/images/Brands/6.jpg',
    '/images/Brands/7.jpg', '/images/Brands/8.jpg'
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mb-6 border-t border-slate-100">
      <div className="text-center mb-6">
        <h3 className="font-display font-black text-slate-400 text-xs uppercase tracking-[0.2em]">Authorized Dealer For Top Brands</h3>
      </div>
      <div className="flex justify-center gap-6 sm:gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition duration-500">
        {topBrands.map((src, i) => (
          <img key={i} src={src} alt="Brand" className="h-8 sm:h-12 object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ))}
      </div>
    </section>
  );
}
