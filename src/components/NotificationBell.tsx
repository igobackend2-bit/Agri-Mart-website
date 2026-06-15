import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Package, Megaphone, X } from 'lucide-react';
import { getInbox, markInboxRead, InboxMessage } from '../storeData';
import { UserProfile } from '../types';

interface NotificationBellProps {
  userProfile: UserProfile | null;
  setCurrentPage: (p: string) => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function NotificationBell({ userProfile, setCurrentPage }: NotificationBellProps) {
  const email = userProfile?.email || null;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<InboxMessage[]>(() => getInbox(email));
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => setMsgs(getInbox(email)), [email]);

  // Poll for new admin/order notifications + react to cross-tab storage changes.
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    const onStorage = (e: StorageEvent) => { if (e.key === 'igo_profile_inbox') refresh(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }, [refresh]);

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const unread = msgs.filter(m => !m.read).length;

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      // Mark read shortly after opening so the badge clears but text stays visible.
      setTimeout(() => { markInboxRead(email); refresh(); }, 1200);
    }
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
            {msgs.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">No notifications yet</p>
                <p className="text-[10px] text-slate-300 mt-1">Order updates &amp; offers appear here</p>
              </div>
            ) : (
              msgs.slice(0, 20).map(m => (
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

          {msgs.length > 0 && (
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
