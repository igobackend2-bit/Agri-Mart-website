import React, { useState } from 'react';
// Admin login gate — reached via the /admin URL
import { Shield, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AdminComponent from './AdminComponent';
import { Product, Category, Brand } from '../types';
import { verifyAdminPassword, isAdminSessionActive, startAdminSession, endAdminSession, siteImage } from '../siteConfig';

interface AdminGatekeeperProps {
  lang: 'en' | 'ta';
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: Category[];
  brands: Brand[];
  setCurrentPage: (p: string) => void;
}

export default function AdminGatekeeper(props: AdminGatekeeperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminSessionActive());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    const ok = await verifyAdminPassword(password);
    setChecking(false);
    if (ok) {
      startAdminSession();
      setIsAuthenticated(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    endAdminSession();
    setIsAuthenticated(false);
    props.setCurrentPage('home');
  };

  if (isAuthenticated) {
    return <AdminComponent {...props} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen relative flex items-stretch bg-[#0B3D22]">
      <img src={siteImage('admin_login_bg', '/images/admin_login_bg.png')} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/45" />

      <div className="relative w-full grid lg:grid-cols-2">
        {/* Left: brand hero */}
        <div className="relative hidden lg:flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center font-black text-xl text-[#1B6B3A] shadow-lg">I</div>
            <div>
              <p className="text-white font-black tracking-wide leading-none">IGO AGRI MART</p>
              <p className="text-[9px] text-emerald-200 font-bold tracking-widest uppercase mt-1">Admin Control Panel</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-white font-black text-5xl xl:text-6xl leading-[1.05] tracking-tight">
              Admin<br />Control<br /><span className="text-lime-300">Panel</span>
            </h2>
            <p className="text-emerald-100/90 text-sm mt-5 max-w-xs leading-relaxed">
              Manage products, orders, content and images — the full IGO Agri Mart storefront from one place.
            </p>
          </div>
          <p className="text-[10px] text-emerald-200/70 font-medium flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Authorized personnel only
          </p>
        </div>

        {/* Right: glass login form */}
        <div className="relative p-8 sm:p-12 lg:px-16 flex flex-col justify-center min-h-screen">
          <button
            onClick={() => props.setCurrentPage('home')}
            className="absolute top-6 left-6 h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
            aria-label="Back to store"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-7 w-7 text-lime-300" />
              <h2 className="font-display font-black text-white text-4xl tracking-tight">Admin Sign in</h2>
            </div>
            <p className="text-slate-300 text-sm mb-7 font-medium">Enter your admin password to open the dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-200 uppercase tracking-widest mb-2">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(false); }}
                    placeholder="Enter admin password"
                    autoFocus
                    className={`w-full bg-white border-2 ${error ? 'border-red-400' : 'border-transparent'} text-slate-800 rounded-2xl py-3.5 pl-12 pr-11 focus:outline-none focus:border-[#EA5B2A] transition font-bold text-sm`}
                    required
                  />
                  <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-300 mt-2 font-bold">Incorrect password. Please try again.</p>}
              </div>

              <button
                type="submit"
                disabled={checking}
                className="w-full bg-[#EA5B2A] hover:bg-[#cf4a1f] disabled:opacity-60 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{checking ? 'Verifying...' : 'Access Dashboard'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-300 font-bold">
              <Lock className="h-3 w-3 text-lime-300" /> Secure access - Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
