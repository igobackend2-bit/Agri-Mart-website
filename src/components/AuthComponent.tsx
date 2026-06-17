import React, { useState } from 'react';
import { Phone, ChevronRight, ArrowLeft, ShieldCheck, Truck, BadgeCheck, Star, User, Mail, Lock, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { fetchUserProfile, saveUserProfile } from '../dbHelper';
import { currentUid, markSignedIn } from '../session';
import { requestOtp, confirmOtp } from '../otp';
import { sendInboxMessage } from '../storeData';
import { UserProfile, Address } from '../types';

interface AuthComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: string) => void;
  setUserProfile: (u: UserProfile | null) => void;
  userProfile: UserProfile | null;
}

// Lightweight client-side hash so we never store a raw password (demo only).
async function hashText(text: string): Promise<string> {
  try {
    if (window.crypto?.subtle) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch { /* fall through */ }
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return 'djb2:' + h.toString(16);
}

type Phase = 'phone' | 'otp' | 'profile' | 'email_login';

export default function AuthComponent({ setCurrentPage, setUserProfile }: AuthComponentProps) {
  const [tab, setTab] = useState<'login' | 'join'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phase, setPhase] = useState<Phase>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Profile-creation form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');

  // Email login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const resetFlow = () => {
    setPhase(loginMethod === 'phone' ? 'phone' : 'email_login');
    setOtp(''); setGeneratedOtp(''); setError(''); setInfo(''); setLoginPassword(''); setLoginEmail('');
  };

  // After a successful sign-in, resume where the user came from (e.g. the cart),
  // otherwise go to their account.
  const goAfterAuth = () => {
    let dest = 'account';
    try {
      const r = localStorage.getItem('igo_resume');
      if (r) { dest = r; localStorage.removeItem('igo_resume'); }
    } catch { /* ignore */ }
    setCurrentPage(dest);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setBusy(true); setError('');
    try {
      await signInWithPopup(auth, provider);
      goAfterAuth();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      setError('Google sign-in could not be completed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) { setError('Please enter both email and password.'); return; }
    setBusy(true);
    try {
      // Demo email login. In production use signInWithEmailAndPassword.
      markSignedIn();
      const uid = currentUid();
      const existing = await fetchUserProfile(uid);
      if (existing) {
        setUserProfile(existing);
        goAfterAuth();
      } else {
        // Mock success for unlinked accounts
        setUserProfile({
          uid,
          name: loginEmail.split('@')[0],
          email: loginEmail,
          phone: '',
          role: 'customer',
          addresses: [],
          wishlist: [],
          profileComplete: true,
        });
        goAfterAuth();
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  // ── Step 1: send OTP (real SMS via backend if configured, else on-screen demo) ─
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length !== 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    setBusy(true);
    try {
      const res = await requestOtp(phone);
      setPhase('otp');
      if (res.mode === 'sms') {
        setInfo(`OTP sent to +91 ${phone}. Check your messages.`);
      } else {
        setInfo(`Demo OTP for +91 ${phone}: ${res.demoCode}`);
      }
    } catch {
      setError('Could not send OTP. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // ── Step 2: verify OTP, then sign in and route ───────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const valid = await confirmOtp(phone, otp);
    if (!valid) { setError('Incorrect OTP. Please check and try again.'); return; }
    setBusy(true);
    try {
      // Start a local session (no Firebase "Anonymous" provider needed).
      markSignedIn();
      const uid = currentUid();
      const existing = await fetchUserProfile(uid);
      if (existing && existing.profileComplete) {
        // Returning customer → straight to their profile.
        setUserProfile({ ...existing, phone: existing.phone || phone });
        setInfo('');
        goAfterAuth();
        return;
      }
      // New customer → collect profile details.
      setPhase('profile');
    } catch (err: any) {
      console.error('OTP sign-in failed:', err);
      const msg = String(err?.code || err?.message || '');
      if (msg.includes('operation-not-allowed') || msg.includes('admin-restricted')) {
        setError('Sign-in is not enabled yet. Enable "Anonymous" sign-in in Firebase Console → Authentication → Sign-in method.');
      } else {
        setError('Could not verify right now. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  // ── Step 3: create profile ───────────────────────────────────────────────────
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    try {
      markSignedIn();
      const uid = currentUid();

      const address: Address | null = addressLine1.trim()
        ? {
            id: 'addr-' + Date.now().toString(36),
            name: name.trim(),
            phone,
            email: email.trim() || undefined,
            addressLine1: addressLine1.trim(),
            city: city.trim(),
            state: stateName.trim(),
            pincode: pincode.trim(),
          }
        : null;

      const profile: UserProfile = {
        uid,
        name: name.trim(),
        phone,
        email: email.trim(),
        role: email.trim().toLowerCase() === 'igobackend2@gmail.com' ? 'admin' : 'customer',
        addresses: address ? [address] : [],
        wishlist: [],
        profileComplete: true,
        passwordHash: await hashText(password),
      };
      await saveUserProfile(profile);
      // Welcome message so the customer's Inbox is never empty.
      try {
        sendInboxMessage({
          toEmail: profile.email || 'all',
          title: 'Welcome to IGO Agri Mart 🌱',
          body: `Hi ${profile.name}, your account is ready! Track orders, offers and updates here in your Inbox. Happy farming!`,
        });
      } catch { /* ignore */ }
      setUserProfile(profile);
      goAfterAuth();
    } catch (err) {
      console.error('Profile creation failed:', err);
      setError('Could not save your profile. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // Developer test login — skips OTP entirely. Creates/loads a ready test account
  // so you can test the full cart → checkout → order flow without SMS/DLT.
  // (Remove or hide this button before going to production.)
  const handleDevLogin = async () => {
    setBusy(true); setError('');
    try {
      markSignedIn();
      const uid = currentUid();
      let profile = await fetchUserProfile(uid);
      if (!profile) {
        profile = {
          uid,
          name: 'Test Developer',
          phone: '9000000000',
          email: 'dev@igo.test',
          role: 'customer',
          addresses: [{
            id: 'addr-dev', name: 'Test Developer', phone: '9000000000', email: 'dev@igo.test',
            addressLine1: 'IGO Test Address, OMR', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001',
          }],
          wishlist: [],
          profileComplete: true,
        };
        await saveUserProfile(profile);
      }
      setUserProfile(profile);
      goAfterAuth();
    } catch (err: any) {
      const msg = String(err?.code || err?.message || '');
      setError(
        msg.includes('operation-not-allowed') || msg.includes('admin-restricted')
          ? 'Enable "Anonymous" sign-in in Firebase Console → Authentication → Sign-in method.'
          : 'Test login failed. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-stretch bg-[#0B3D22]">
      <img
        src="/images/agri_farm_bg.png"
        alt="Agritech Farm"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/40" />
      <div className="relative w-full grid lg:grid-cols-2 overflow-hidden">

        {/* ── Left: brand panel (over the single shared background) ── */}
        <div className="relative hidden lg:block">
          <div className="relative h-full flex flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center font-black text-xl text-[#EA5B2A] shadow-lg">I</div>
              <div>
                <p className="text-white font-black tracking-wide leading-none">IGO AGRI MART</p>
                <p className="text-[9px] text-emerald-200 font-bold tracking-widest uppercase mt-1">IGO Group · Chennai HQ</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-white font-black text-5xl xl:text-6xl leading-[1.05] tracking-tight">
                Cultivating<br />Tomorrow's<br />Harvest<br /><span className="text-lime-400">Today.</span>
              </h2>
              <p className="text-emerald-50/90 text-sm mt-5 max-w-sm leading-relaxed font-medium">
                Join India's most trusted agricultural marketplace. Access certified seeds, high-yield fertilizers, precision tools, and expert farming guidance all in one place.
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

            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Ic, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="h-9 w-9 rounded-full bg-white/10 hover:bg-lime-300 hover:text-emerald-950 border border-white/20 flex items-center justify-center text-white transition">
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: form panel (Glassmorphism Card) ── */}
        <div className="relative p-6 sm:p-10 lg:px-14 flex flex-col justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-lg w-full mx-auto relative">
            <button
              onClick={() => (phase === 'phone' ? setCurrentPage('home') : resetFlow())}
              className="absolute top-6 left-6 h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

            <div className="mb-7 mt-8 max-w-md w-full mx-auto text-center">
              <h2 className="font-display font-black text-white text-4xl tracking-tight">
                {phase === 'profile'
                  ? 'Complete Profile'
                  : tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-200 text-sm mt-2 font-medium">
                {phase === 'profile'
                  ? 'Just a few details to finalize your farmer profile.'
                  : tab === 'login' ? 'Sign in to access exclusive agritech deals and track orders.' : 'Join 10,000+ farmers empowering their agriculture.'}
              </p>
            </div>

          {/* Pill tabs (hidden during profile step) */}
          {phase !== 'profile' && (
            <div className="flex bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-1.5 mb-8 max-w-[16rem] mx-auto">
              {(['login', 'join'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => { setTab(k); resetFlow(); setPhone(''); }}
                  className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition ${
                    tab === k ? 'bg-white text-[#1B6B3A] shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {k === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {/* Method toggler */}
          {(phase === 'phone' || phase === 'email_login') && (
            <div className="flex gap-6 mb-8 justify-center">
              <button 
                onClick={() => { setLoginMethod('phone'); setPhase('phone'); }} 
                className={`text-[11px] font-black uppercase tracking-widest pb-1.5 border-b-2 transition-colors ${loginMethod === 'phone' ? 'border-[#EA5B2A] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Mobile OTP
              </button>
              <button 
                onClick={() => { setLoginMethod('email'); setPhase('email_login'); }} 
                className={`text-[11px] font-black uppercase tracking-widest pb-1.5 border-b-2 transition-colors ${loginMethod === 'email' ? 'border-[#EA5B2A] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Email ID
              </button>
            </div>
          )}

          {/* Alerts */}
          {info && (
            <div className="mb-4 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
              {info}
            </div>
          )}
          {error && (
            <div className="mb-4 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-center">
              {error}
            </div>
          )}

          {/* Phase 1: phone */}
          {phase === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Mobile Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-black text-slate-400 text-sm border-r border-slate-300/30 pr-2.5">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter your 10-digit number"
                    className="w-full bg-white/90 border-2 border-transparent text-slate-900 placeholder:text-slate-500 rounded-2xl py-3.5 pl-16 pr-11 focus:outline-none focus:border-[#EA5B2A] focus:bg-white transition font-bold text-sm"
                    required
                  />
                  <Phone className="absolute right-4 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#EA5B2A] hover:bg-[#cf4a1f] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5"
              >
                <span>{tab === 'login' ? 'Get OTP' : 'Register Free'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Phase 1b: email login */}
          {phase === 'email_login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white border-2 border-slate-200 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#EA5B2A] focus:bg-white transition font-bold text-sm"
                    required
                  />
                  <Mail className="absolute left-4 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white border-2 border-slate-200 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#EA5B2A] focus:bg-white transition font-bold text-sm"
                    required
                  />
                  <Lock className="absolute left-4 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#EA5B2A] hover:bg-[#cf4a1f] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition shadow-lg shadow-emerald-900/20 disabled:opacity-60"
              >
                {busy ? 'Verifying...' : (tab === 'login' ? 'Secure Login' : 'Register Free')}
              </button>
            </form>
          )}

          {/* Phase 2: OTP */}
          {phase === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-xs font-bold text-slate-300">Code sent to <span className="text-[#EA5B2A] font-black">+91 {phone}</span></p>
              </div>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                autoFocus
                className="w-full text-center text-3xl tracking-[0.45em] font-black bg-white/90 border-2 border-transparent text-slate-900 rounded-2xl py-4 focus:outline-none focus:border-[#EA5B2A] focus:bg-white transition"
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#EA5B2A] hover:bg-[#cf4a1f] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition shadow-lg shadow-emerald-900/20 disabled:opacity-60"
              >
                {busy ? 'Verifying…' : 'Verify & Continue'}
              </button>
              <div className="text-center">
                <button type="button" onClick={resetFlow} className="text-xs font-bold text-slate-400 hover:text-[#EA5B2A] transition">
                  ← Change number
                </button>
              </div>
            </form>
          )}

          {/* Phase 3: profile creation */}
          {phase === 'profile' && (
            <form onSubmit={handleCreateProfile} className="space-y-3.5">
              <Field icon={User} placeholder="Full name" value={name} onChange={setName} required />
              <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
              <Field icon={Lock} type="password" placeholder="Create a password (min 6 chars)" value={password} onChange={setPassword} required />
              <div className="pt-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> Delivery address (optional)
                </p>
                <div className="space-y-3">
                  <Field placeholder="House no, street, area" value={addressLine1} onChange={setAddressLine1} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field placeholder="City / Town" value={city} onChange={setCity} />
                    <Field placeholder="Pincode" value={pincode} onChange={(v) => setPincode(v.replace(/\D/g, '').slice(0, 6))} />
                  </div>
                  <Field placeholder="State" value={stateName} onChange={setStateName} />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#EA5B2A] hover:bg-[#cf4a1f] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition shadow-lg shadow-emerald-900/20 disabled:opacity-60"
              >
                {busy ? 'Creating account…' : 'Create account & continue'}
              </button>
            </form>
          )}

          {/* Google option (only on first steps) */}
          {(phase === 'phone' || phase === 'email_login') && (
            <>
              <div className="my-7 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                <span className="relative bg-transparent px-3 text-[10px] font-black text-slate-300 uppercase tracking-widest backdrop-blur-sm rounded-full">Or continue with</span>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={busy}
                className="w-full bg-white/90 hover:bg-white border-2 border-transparent text-slate-800 font-black text-sm py-3.5 rounded-2xl transition flex items-center justify-center gap-3 disabled:opacity-60 shadow-md"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>{busy ? 'Connecting...' : 'Google Account'}</span>
              </button>

              {/* Developer test login — no OTP. Remove before production. */}
              <button
                onClick={handleDevLogin}
                disabled={busy}
                className="w-full mt-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white font-black text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-60 backdrop-blur-md"
              >
                <span>⚡ Developer Test Login (skip OTP)</span>
              </button>
            </>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[10px] text-emerald-300 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Bank-grade secure login · Data is strictly protected</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed">
            By continuing, you agree to IGO Agri Mart's{' '}
            <span className="font-bold text-slate-300 cursor-pointer hover:underline">Terms of Service</span> &{' '}
            <span className="font-bold text-slate-300 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
          
          </div> {/* End Glassmorphism Card */}
        </div>
      </div>
    </div>
  );
}

// Small reusable input field
function Field({
  icon: Icon, type = 'text', placeholder, value, onChange, required,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon className="absolute left-4 h-4 w-4 text-slate-300" />}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-white/90 border-2 border-transparent text-slate-900 placeholder:text-slate-500 rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 focus:outline-none focus:border-[#EA5B2A] focus:bg-white transition font-bold text-sm shadow-sm`}
      />
    </div>
  );
}
