import React, { useState } from 'react';
import { Phone, ChevronRight, ArrowLeft, ShieldCheck, Truck, BadgeCheck, Star } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: string) => void;
}

export default function AuthComponent({ lang, setCurrentPage }: AuthComponentProps) {
  const [tab, setTab] = useState<'login' | 'join'>('login');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setBusy(true);
    try {
      await signInWithPopup(auth, provider);
      setCurrentPage('account'); // take the customer straight to their profile
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    } finally {
      setBusy(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    alert('OTP Verified Successfully! (Mock)');
    setCurrentPage('account');
  };

  return (
    <div className="min-h-[85vh] flex items-stretch justify-center p-4 sm:p-8 bg-gradient-to-br from-emerald-50 via-[#F7F9F4] to-amber-50/40">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-slate-100 my-auto">

        {/* ── Left: brand panel with farm imagery ── */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1000&q=85&fit=crop"
            alt="Indian farmer in green field"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D22] via-[#0B3D22]/55 to-emerald-900/20" />
          <div className="relative h-full flex flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center font-black text-xl text-[#1B6B3A] shadow-lg">I</div>
              <div>
                <p className="text-white font-black tracking-wide leading-none">IGO AGRI MART</p>
                <p className="text-[9px] text-emerald-200 font-bold tracking-widest uppercase mt-1">IGO Group · Chennai HQ</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-white font-black text-3xl leading-tight">
                Grow more.<br />Spend less.<br /><span className="text-lime-300">Order in minutes.</span>
              </h2>
              <p className="text-emerald-100/90 text-sm mt-3 max-w-xs">
                Join 10,000+ farmers buying certified seeds, fertilizers and equipment at market-best prices.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-8">
                {[
                  { icon: BadgeCheck, l: '100% Genuine' },
                  { icon: Truck, l: 'Fast Delivery' },
                  { icon: Star, l: '4.8★ Rated' },
                ].map((b, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center">
                    <b.icon className="h-5 w-5 text-lime-300 mx-auto mb-1.5" />
                    <p className="text-[10px] font-black text-white leading-tight">{b.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-emerald-200/70 font-medium">Trusted across Tamil Nadu & pan-India since 2024</p>
          </div>
        </div>

        {/* ── Right: form panel ── */}
        <div className="relative p-7 sm:p-10">
          <button
            onClick={() => setCurrentPage('home')}
            className="absolute top-5 left-5 sm:top-7 sm:left-7 h-9 w-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1B6B3A] hover:border-[#1B6B3A] transition"
            aria-label="Back to store"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="text-center mb-7 mt-6 lg:mt-2">
            <div className="lg:hidden h-12 w-12 bg-[#1B6B3A] rounded-2xl mx-auto flex items-center justify-center font-black text-xl text-white shadow-lg mb-3">I</div>
            <h2 className="font-display font-black text-slate-900 text-2xl tracking-tight">
              {tab === 'login' ? 'Welcome back, farmer!' : 'Create your free account'}
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              {tab === 'login' ? 'Login to track orders, offers & your farm cart' : 'Unlock member prices & faster checkout'}
            </p>
          </div>

          {/* Pill tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-7 max-w-xs mx-auto">
            {(['login', 'join'] as const).map(k => (
              <button
                key={k}
                onClick={() => { setTab(k); setOtpSent(false); setPhone(''); }}
                className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition ${
                  tab === k ? 'bg-white text-[#1B6B3A] shadow' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {k === 'login' ? 'Login' : 'Join Us'}
              </button>
            ))}
          </div>

          {!otpSent ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-black text-slate-500 text-sm border-r border-slate-200 pr-2.5">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-16 pr-11 focus:outline-none focus:border-[#1B6B3A] focus:bg-white transition font-bold text-sm"
                    required
                  />
                  <Phone className="absolute right-4 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1B6B3A] hover:bg-emerald-950 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5"
              >
                <span>{tab === 'login' ? 'Get OTP' : 'Register Free'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-xs font-bold text-slate-500">Code sent to <span className="text-[#1B6B3A] font-black">+91 {phone}</span></p>
              </div>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                autoFocus
                className="w-full text-center text-3xl tracking-[0.45em] font-black bg-slate-50 border-2 border-slate-100 text-slate-800 rounded-2xl py-4 focus:outline-none focus:border-[#1B6B3A] focus:bg-white transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#1B6B3A] hover:bg-emerald-950 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition shadow-lg shadow-emerald-900/20"
              >
                Verify & Continue
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setOtpSent(false)} className="text-xs font-bold text-slate-400 hover:text-[#1B6B3A] transition">
                  ← Change number
                </button>
              </div>
            </form>
          )}

          <div className="my-7 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={busy}
            className="w-full bg-white border-2 border-slate-200 hover:border-[#1B6B3A] text-slate-700 hover:text-[#1B6B3A] font-black text-sm py-3.5 rounded-2xl transition flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span>{busy ? 'Connecting...' : 'Google Account'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-400 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure login · We never share your data</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed">
            By continuing, you agree to IGO Agri Mart's{' '}
            <span className="font-bold text-slate-500 cursor-pointer hover:underline">Terms</span> &{' '}
            <span className="font-bold text-slate-500 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
