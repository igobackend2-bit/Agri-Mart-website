import React from 'react';
import { Truck, Sprout, Leaf, TrendingUp, ArrowRight } from 'lucide-react';
import { pageText } from '../siteConfig';

// Category-contextual IGO bands woven between the shopping sections on the home
// page. Each band sits directly above a specific category and answers "why this
// category matters" and "why IGO is the trusted choice for it".
//
// Every text field is admin-editable: it reads pageText('home', 'band_<variant>_<field>')
// and falls back to the built-in default below when the admin hasn't set one.

type Variant = 'fresh' | 'seeds' | 'garden' | 'trending';

const BANDS: Record<Variant, {
  tag: string;
  title: string;
  text: string;
  stat: string;
  statLabel: string;
  icon: any;
  href?: string;
  cta?: string;
}> = {
  // Sits above "Freshly Arrived"
  fresh: {
    tag: 'Freshly Sourced',
    title: 'Why freshness wins every season',
    text: 'Produce and inputs on IGO Agri Mart are sourced directly from farms and brands and dispatched the same day, so you always get peak-quality, field-fresh stock instead of old shelf stock.',
    stat: 'Same-Day',
    statLabel: 'Dispatch',
    icon: Truck,
  },
  // Sits above "Seeds"
  seeds: {
    tag: 'Why Seeds Matter',
    title: 'The right seed decides your whole harvest',
    text: 'A weak seed wastes a whole season. Every seed at IGO Agri Mart is trial-tested on our own polyhouse and open farms for high germination and true-to-type purity, so you sow with confidence.',
    stat: '90%+',
    statLabel: 'Germination Tested',
    icon: Sprout,
  },
  // Sits above "Urban & Balcony Gardening"
  garden: {
    tag: 'Why Home Gardening',
    title: 'Grow fresh, chemical-free food at home',
    text: 'From balcony to terrace, IGO brings nursery-grade saplings, potting mixes and grow-kits backed by IGO Nursery, so anyone can grow safe, fresh greens in any space.',
    stat: '500+',
    statLabel: 'Garden-Ready Picks',
    icon: Leaf,
  },
  // Sits above "Trending Products"
  trending: {
    tag: "Why It's Trending",
    title: 'The products Indian farmers reorder most',
    text: 'These picks are ranked from real orders and reviews across 28+ states and vetted by IGO agronomists, so you can trust what thousands of farmers already rely on this season.',
    stat: '28+',
    statLabel: 'States Trust These',
    icon: TrendingUp,
  },
};

export default function IgoGroupBand({ variant }: { variant: Variant }) {
  const b = BANDS[variant];
  const Icon = b.icon;

  // Admin-editable overrides (fall back to the defaults above when unset).
  const tag = pageText('home', `band_${variant}_tag`, b.tag);
  const title = pageText('home', `band_${variant}_title`, b.title);
  const text = pageText('home', `band_${variant}_text`, b.text);
  const stat = pageText('home', `band_${variant}_stat`, b.stat);
  const statLabel = pageText('home', `band_${variant}_statlabel`, b.statLabel);
  const img = pageText('home', `band_${variant}_img`, '');

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 mb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-950 via-[#1B6B3A] to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#E8A020]/15 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
            {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <Icon className="h-7 w-7 text-[#E8A020]" />}
          </div>
          <div className="flex-1">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#E8A020] mb-2">
              {tag}
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl leading-tight mb-2">
              {title}
            </h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed max-w-2xl">
              {text}
            </p>
            {b.href && (
              <button
                onClick={() => window.open(b.href, '_blank', 'noopener,noreferrer')}
                className="mt-4 inline-flex items-center gap-2 bg-[#E8A020] hover:bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition"
              >
                {b.cta} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="shrink-0 text-left sm:text-right sm:border-l border-white/15 sm:pl-8">
            <div className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-[#E8A020] to-amber-200">
              {stat}
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-emerald-200/80 mt-1 font-semibold">
              {statLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
