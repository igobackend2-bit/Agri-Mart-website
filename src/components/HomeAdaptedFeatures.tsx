import React from 'react';
import { Play, Activity, Sun, CloudRain, ShieldCheck, Sprout, Wind, Globe, TrendingUp } from 'lucide-react';

export function FarmStories() {
  const stories = [
    { name: 'Arjun, TN', time: 'LIVE', img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&q=80', active: true },
    { name: 'Meera', time: '2h ago', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=100&q=80', active: true },
    { name: 'Senthil', time: '5h ago', img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=100&q=80', active: false },
    { name: 'Kiran', time: '1d ago', img: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=100&q=80', active: false },
    { name: 'Dinesh', time: '1d ago', img: 'https://images.unsplash.com/photo-1585454028886-1a1c9a3bc3d2?w=100&q=80', active: false },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
      <h3 className="font-display font-black text-slate-800 text-lg mb-4">AgriMart Farmer Updates</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
            <div className={`rounded-full p-0.5 ${s.active ? 'bg-gradient-to-tr from-[#E8A020] to-[#1B6B3A]' : 'bg-slate-200'}`}>
              <div className="bg-white p-0.5 rounded-full">
                <img src={s.img} alt={s.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" />
              </div>
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-bold text-slate-700">{s.name}</span>
              <span className={`block text-[9px] font-black uppercase tracking-widest ${s.time === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>{s.time}</span>
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
          <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80" alt="Center Field" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
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
            <img src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80" alt="North Field" className="w-full h-full object-cover opacity-60" />
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
    { name: 'IGO AgriMart', icon: Globe, color: 'text-emerald-500' },
    { name: 'IGO Farm Loans', icon: TrendingUp, color: 'text-amber-500' },
    { name: 'IGO Crop Care', icon: ShieldCheck, color: 'text-blue-500' },
    { name: 'IGO Green Energy', icon: Sun, color: 'text-yellow-500' },
    { name: 'IGO Nursery', icon: Sprout, color: 'text-lime-500' },
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
            <div className="w-12 h-12 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <v.icon className={`w-6 h-6 ${v.color}`} />
            </div>
            <h4 className="font-bold text-slate-800 text-xs">{v.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
