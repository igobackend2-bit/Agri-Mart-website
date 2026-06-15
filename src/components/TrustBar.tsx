import { BadgeCheck, Truck, RotateCcw, ShieldCheck, Leaf } from 'lucide-react';
import { getSettings } from '../siteConfig';

// Site-wide trust ticker — mirrors the IGO Nursery / Farmers Factory trust rows.
export default function TrustBar() {
  const s = getSettings();
  const items = [
    { icon: BadgeCheck, text: '100% Genuine Products' },
    { icon: Truck, text: `Free Delivery above ₹${(s.freeDeliveryAbove || 1300).toLocaleString('en-IN')}` },
    { icon: Leaf, text: 'Farm-Fresh & Certified Inputs' },
    { icon: RotateCcw, text: 'Easy Returns & Replacement' },
    { icon: ShieldCheck, text: 'Secure Checkout' },
  ];

  return (
    <div className="bg-[#0B3D22] text-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop: evenly spaced row */}
        <div className="hidden sm:flex items-center justify-between py-2 gap-4">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap">
              <it.icon className="h-3.5 w-3.5 text-lime-300 shrink-0" />
              <span>{it.text}</span>
            </div>
          ))}
        </div>
        {/* Mobile: scrolling marquee */}
        <div className="sm:hidden py-2 relative">
          <div className="flex items-center gap-6 animate-[trustscroll_18s_linear_infinite] whitespace-nowrap w-max">
            {[...items, ...items].map((it, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold">
                <it.icon className="h-3.5 w-3.5 text-lime-300 shrink-0" />
                <span>{it.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes trustscroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
