import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Package, Megaphone, X } from 'lucide-react';
import { getInbox, markInboxRead, InboxMessage, getLocalOrders, mergeOrdersByStatus } from '../storeData';
import { fetchUserOrders } from '../dbHelper';
import { UserProfile } from '../types';

interface NotificationBellProps {
  userProfile: UserProfile | null;
  setCurrentPage: (p: string) => void;
}

interface Notif {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  orderId?: string;
}

const SEEN_KEY = 'igo_order_status_seen';
const readSeen = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); } catch { return {}; }
};
const writeSeen = (m: Record<string, string>) => localStorage.setItem(SEEN_KEY, JSON.stringify(m));

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const statusLine = (s: string): string => ({
  Placed: 'We received your order and will confirm it shortly.',
  Confirmed: 'Your order is confirmed and being prepared.',
  Packed: 'Your order is packed and ready to ship.',
  Dispatched: 'Your order has been dispatched — on its way!',
  Shipped: 'Your order has shipped — on its way!',
  Delivered: 'Your order has been delivered. Thank you!',
  Cancelled: 'Your order was cancelled. Any prepayment will be refunded.',
}[s] || `Your order status is now ${s}.`);

export default function NotificationBell({ userProfile, setCurrentPage }: NotificationBellProps) {
  const email = userProfile?.email || null;
  const uid = userProfile?.uid || null;
  const [open, setOpen] = useState(false);
  const [inbox, setInbox] = useState<InboxMessage[]>(() => getInbox(email));
  const [orderNotifs, setOrderNotifs] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const refreshInbox = useCallback(() => setInbox(getInbox(email)), [email]);

  // Pull live order-status changes from Supabase (works across devices).
  const refreshOrders = useCallback(async () => {
    if (!uid) { setOrderNotifs([]); return; }
    try {
      let cloud: any[] = [];
      try { cloud = await fetchUserOrders(uid); } catch { /* offline */ }
      // Merge with the local mirror so admin status changes (same browser) show.
      const orders = mergeOrdersByStatus(cloud, getLocalOrders());
      const seen = readSeen();
      const notifs: Notif[] = orders.map((o) => ({
        id: 'ord-' + o.id,
        title: `Order ${o.id} — ${o.status}`,
        body: statusLine(o.status),
        createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
        read: seen[o.id] === o.status,
        orderId: o.id,
      }));
      setOrderNotifs(notifs);
    } catch { /* offline — keep last */ }
  }, [uid]);

  useEffect(() => {
    refreshInbox();
    refreshOrders();
    const interval = setInterval(() => { refreshInbox(); refreshOrders(); }, 5000);
    const onStorage = (e: StorageEvent) => { if (e.key === 'igo_profile_inbox') refreshInbox(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }, [refreshInbox, refreshOrders]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Merge order-status notifications + inbox messages, newest first.
  const inboxNotifs: Notif[] = inbox.map((m) => ({
    id: m.id, title: m.title, body: m.body, createdAt: m.createdAt, read: m.read, orderId: m.orderId,
  }));
  const all = [...orderNotifs, ...inboxNotifs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const unread = all.filter((n) => !n.read).length;

  const markAllSeen = () => {
    // Mark inbox read + remember each order's current status as "seen".
    markInboxRead(email);
    const seen = readSeen();
    orderNotifs.forEach((n) => { if (n.orderId) seen[n.orderId] = n.title.split('— ')[1] || ''; });
    writeSeen(seen);
    refreshInbox();
    refreshOrders();
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) setTimeout(markAllSeen, 1200);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 text-slate-600 hover:text-[#1B6B3A] transition"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D94F3D] text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1B6B3A] text-white">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="font-black text-sm">Notifications</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {all.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">No notifications yet</p>
                <p className="text-[10px] text-slate-300 mt-1">Order updates &amp; offers appear here</p>
              </div>
            ) : (
              all.slice(0, 25).map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setOpen(false); setCurrentPage('account'); }}
                  className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-slate-50 transition ${m.read ? '' : 'bg-emerald-50/40'}`}
                >
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.orderId ? 'bg-emerald-100 text-[#1B6B3A]' : 'bg-amber-100 text-amber-700'}`}>
                    {m.orderId ? <Package className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-800 text-xs truncate">{m.title}</p>
                      {!m.read && <span className="shrink-0 h-2 w-2 rounded-full bg-[#D94F3D]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{m.body}</p>
                    <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wide mt-1">{timeAgo(m.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {all.length > 0 && (
            <button
              onClick={() => { setOpen(false); setCurrentPage('account'); }}
              className="w-full py-3 text-xs font-black text-[#1B6B3A] hover:bg-emerald-50 transition border-t border-slate-100"
            >
              View all in My Account →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
