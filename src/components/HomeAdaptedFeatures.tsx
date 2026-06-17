import React from 'react';
import { Play, Activity, Sun, CloudRain, ShieldCheck, Sprout, Wind, Globe, TrendingUp } from 'lucide-react';

export function FarmStories() {
  const stories = [
    { name: 'Arjun, TN', time: 'LIVE', img: '/images/farmer_arjun.png', active: true },
    { name: 'Meera', time: '2h ago', img: '/images/farmer_meera.png', active: true },
    { name: 'Senthil', time: '5h ago', img: '/images/farmer_senthil.png', active: false },
    { name: 'Kiran', time: '1d ago', img: '/images/farmer_kiran.png', active: false },
    { name: 'Dinesh', time: '1d ago', img: '/images/farmer_dinesh.png', active: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-black text-slate-800 text-lg">AgriMart Farmer Updates</h3>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest">Stories</span>
      </div>
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
        {stories.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group">
            <div className={`rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 ${s.active ? 'bg-gradient-to-tr from-[#E8A020] via-rose-500 to-[#1B6B3A] shadow-md' : 'bg-slate-200'}`}>
              <div className="bg-white p-[2px] rounded-full">
                <img src={s.img} alt={s.name} className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full object-cover border border-slate-100" />
              </div>
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{s.name}</span>
              <span className={`block text-[9px] font-bold uppercase tracking-widest mt-0.5 ${s.time === 'LIVE' ? 'text-red-500 animate-pulse bg-red-50 inline-block px-1.5 rounded' : 'text-slate-400'}`}>{s.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveTrialFields() {
  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 text-white relative">
      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1.5 z-10 animate-pulse">
        <Activity className="w-3 h-3" /> Live Trial Fields
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[280px]">
        {/* Main Feed */}
        <div className="md:col-span-2 relative h-[200px] md:h-full group cursor-pointer">
          <img src="/images/live_trial_field_india.png" alt="Center Field" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <h4 className="font-bold text-lg">Center Field • Hosur</h4>
            <p className="text-xs text-slate-300">Drip Irrigation Testing Phase 2</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Side Feeds & Weather */}
        <div className="flex flex-col h-full bg-slate-950">
          <div className="flex-1 relative border-b border-slate-800">
            <img src="/images/live_trial_agronomist_india.png" alt="North Field" className="w-full h-full object-cover opacity-60" />
            <div className="absolute bottom-2 left-2 text-xs font-bold">North Field • Maize</div>
          </div>
          <div className="flex-1 bg-slate-900 p-4 flex flex-col justify-center">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Real-time Weather</div>
            <div className="flex items-center gap-4">
              <Sun className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-2xl font-black">32°C</div>
                <div className="text-xs text-slate-400">Humidity 65%</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] bg-slate-800 px-2 py-1.5 rounded text-emerald-400 font-bold">
              <CloudRain className="w-3 h-3" /> Auto-Irrigation Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IgoEcosystemCarousel() {
  const verticals = [
    { name: 'IGO AgriMart', logo: '/images/Brands/6.jpg' },
    { name: 'IGO Farm Loans', logo: '/images/Brands/16.jpg' },
    { name: 'IGO Crop Care', logo: '/images/Brands/21.jpg' },
    { name: 'IGO Green Energy', logo: '/images/Brands/5.jpg' },
    { name: 'IGO Nursery', logo: '/images/Brands/14.jpg' },
  ];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-black text-slate-800 text-xl">The IGO Agri Ecosystem</h3>
        <button className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest hover:underline">Explore All 26</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {verticals.map((v, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-lg hover:border-[#1B6B3A] transition cursor-pointer group">
            <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition p-1">
              <img src={v.logo} alt={v.name} className="w-full h-full object-contain mix-blend-multiply rounded-xl" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.jpg'; }} />
            </div>
            <h4 className="font-bold text-slate-800 text-xs">{v.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
