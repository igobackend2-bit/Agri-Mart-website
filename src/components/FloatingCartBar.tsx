import { ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartBarProps {
  cart: CartItem[];
  onViewCart: () => void;
}

// Zepto/Instamart-style persistent cart bar. Renders only when the cart has
// items; hidden on cart/checkout/admin pages (controlled by the parent).
export default function FloatingCartBar({ cart, onViewCart }: FloatingCartBarProps) {
  const count = cart.reduce((t, i) => t + i.quantity, 0);
  if (count === 0) return null;

  const subtotal = cart.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const firstImg = cart[0]?.product?.images?.[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] w-[calc(100%-24px)] max-w-md px-1">
      <button
        onClick={onViewCart}
        className="w-full bg-[#1B6B3A] hover:bg-emerald-900 text-white rounded-2xl shadow-2xl shadow-emerald-900/30 flex items-center gap-3 pl-3 pr-4 py-2.5 transition active:scale-[0.99]"
      >
        <div className="relative shrink-0">
          {firstImg ? (
            <img src={firstImg} alt="" className="h-9 w-9 rounded-lg object-cover border border-white/20" />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4" />
            </div>
          )}
          <span className="absolute -top-1.5 -right-1.5 bg-[#E8A020] text-slate-950 text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        </div>
        <div className="flex-1 min-w-0 text-left leading-tight">
          <p className="text-[11px] font-bold text-emerald-100">{count} item{count > 1 ? 's' : ''} in cart</p>
          <p className="text-sm font-black">&#8377;{subtotal.toLocaleString('en-IN')}</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wide shrink-0">
          View Cart <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
