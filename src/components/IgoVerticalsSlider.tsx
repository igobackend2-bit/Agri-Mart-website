import React from 'react';

export default function IgoVerticalsSlider() {
  return (
    <section className="py-24 md:py-36 bg-white relative flex flex-col items-center overflow-hidden">
      {/* Background Clean Map Watermark (Made smaller and centered as requested) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 select-none">
        <img 
          src="/images/igo_ecosystem_bg_clean.jpg" 
          alt="Watermark Map" 
          className="w-full max-w-[450px] md:max-w-[600px] h-auto object-contain mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full text-center">
        {/* Header Tag */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-10 md:w-16 bg-[#d4af37]" />
          <span className="text-[#d4af37] text-[10px] md:text-sm font-black tracking-[0.3em] uppercase">
            The Sovereign Ecosystem
          </span>
          <div className="h-[1px] w-10 md:w-16 bg-[#d4af37]" />
        </div>

        {/* Massive Centered Text */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-serif text-[#1e1e1e] tracking-tight mb-8 leading-tight">
          The <span className="italic text-[#d4af37]">26 Verticals</span> of IGO.
        </h2>

        <p className="text-[#64748b] text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-14">
          A sovereign agricultural ecosystem covering Engineering, Production, Trade, and Consumer Lifestyle.
        </p>

        {/* Interactive Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1B6B3A] hover:border-[#1B6B3A] transition bg-white shadow-sm hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
            Explore All 26 Verticals
          </span>
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1B6B3A] hover:border-[#1B6B3A] transition bg-white shadow-sm hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
