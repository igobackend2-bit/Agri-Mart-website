import React, { useState } from 'react';
// Admin login gate — reached via the /admin URL
import { Shield, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AdminComponent from './AdminComponent';
import { Product, Category, Brand } from '../types';
import { verifyAdminPassword, isAdminSessionActive, startAdminSession, endAdminSession } from '../siteConfig';

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
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1600&q=80')] bg-cover bg-center opacity-10"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <button
          onClick={() => props.setCurrentPage('home')}
          className="absolute top-4 left-4 text-emerald-100 hover:text-white transition z-20"
          aria-label="Back to store"
        >
          <ArrowLeft className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        </button>

        <div className="p-8">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <Shield className="h-8 w-8 text-[#1B6B3A]" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">IGO AgriMart</h2>
            <p className="text-[#1B6B3A] text-sm font-bold tracking-widest uppercase mt-1">Admin Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  placeholder="Enter admin password"
                  autoFocus
                  className={`w-full bg-slate-50 border ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-[#1B6B3A]'} text-slate-800 rounded-xl py-3 pl-12 pr-11 focus:outline-none focus:border-[#1B6B3A] focus:ring-1 transition font-medium`}
                  required
                />
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-2 font-bold">Incorrect password. Please try again.</p>}
            </div>

            <button
              type="submit"
              disabled={checking}
              className="w-full bg-[#1B6B3A] hover:bg-emerald-900 disabled:opacity-60 text-white font-black text-sm uppercase tracking-widest py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>{checking ? 'Verifying...' : 'Access Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" /> Secure Access
          </p>
          <p className="text-[9px] text-slate-400 mt-1">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
