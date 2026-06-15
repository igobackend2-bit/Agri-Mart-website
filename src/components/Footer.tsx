import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ExternalLink, Leaf, ArrowRight } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (p: string) => void;
  setSelectedCategory: (c: string | null) => void;
}

const IGO_BRANDS = [
  { name: 'IGO Agritech Farms', tag: 'Core Business', active: true, url: 'https://www.igoagritechfarms.com' },
  { name: 'Farmers Factory', tag: 'Organic Produce', active: true, url: 'https://famersfactory.com' },
  { name: 'Valluvam', tag: 'Consultancy', active: true, url: '#' },
  { name: 'Protein Cuts', tag: 'Farm-to-Table', active: true, url: '#' },
  { name: 'IGO Agri Mart', tag: 'Distribution', active: true, url: '#' },
  { name: 'IGO Nursery', tag: 'Plant Propagation', active: true, url: 'https://www.igonursery.com' },
  { name: 'Palm Cafe', tag: 'F&B', active: true, url: '#' },
  { name: 'IGO Exports & Imports', tag: 'Trade', active: true, url: '#' },
  { name: 'IGO Fintech', tag: 'Micro Finance', active: false, url: '#' },
  { name: 'IGO Farmgate Mandi', tag: 'Procurement', active: true, url: '#' },
  { name: 'IGO Mart', tag: 'Retail', active: true, url: '#' },
  { name: 'India Green', tag: 'Sustainability', active: false, url: '#' },
];

export default function Footer({ setCurrentPage, setSelectedCategory }: FooterProps) {
  const navLinks = [
    { label: 'Seeds & Saplings', action: () => { setSelectedCategory('seeds-saplings'); setCurrentPage('category'); } },
    { label: 'Fertilizers', action: () => { setSelectedCategory('fertilizers'); setCurrentPage('category'); } },
    { label: 'Crop Protection', action: () => { setSelectedCategory('bioproducts'); setCurrentPage('category'); } },
    { label: 'Farm Tools', action: () => { setSelectedCategory('farm-tools-implements'); setCurrentPage('category'); } },
    { label: 'Irrigation', action: () => { setSelectedCategory('irrigation-systems'); setCurrentPage('category'); } },
    { label: 'Organic Inputs', action: () => { setSelectedCategory('organic-natural-farming'); setCurrentPage('category'); } },
    { label: 'Animal Husbandry', action: () => { setSelectedCategory('animal-husbandry'); setCurrentPage('category'); } },
    { label: 'Nursery & Plants', action: () => { setSelectedCategory('indoor-plants'); setCurrentPage('category'); } },
  ];

  const infoLinks = [
    { label: 'About IGO Agri Mart', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
    { label: 'Services', page: 'services' },
    { label: 'IGO Academy', page: 'academy' },
    { label: 'Blog & News', page: 'blog' },
    { label: 'Knowledge Hub', page: 'knowledge-hub' },
    { label: 'Partner Portal', page: 'partners' },
    { label: 'Farm Loans', page: 'farm-loans' },
  ];

  return (
    <footer className="bg-[#0f2d1b] text-white mt-12">
      {/* Top CTA Strip */}
      <div className="bg-[#1B6B3A] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Leaf className="h-5 w-5 text-emerald-300 shrink-0" />
            <p className="text-sm font-bold text-white">
              Need expert agri advice? Talk to our farming specialists — free consultation!
            </p>
          </div>
          <a href="tel:+917397785803"
            className="bg-[#E8A020] text-emerald-950 font-black text-xs px-5 py-2.5 rounded-lg hover:bg-amber-400 transition whitespace-nowrap flex items-center gap-2 shrink-0">
            <Phone className="h-3.5 w-3.5" /> Call +91 73977 85803
          </a>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-[#1B6B3A] rounded-lg flex items-center justify-center font-black text-xl border border-emerald-700">I</div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-wider leading-none">IGO AGRI MART</h3>
                <p className="text-[9px] text-[#E8A020] font-bold tracking-widest uppercase mt-0.5">Part of IGO Group</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-5">
              India's trusted agricultural distribution network. Seeds, fertilizers, pesticides, and farming equipment — delivered to your farm gate.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Chengalpattu & Chennai HQ, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <a href="tel:+917397785803" className="hover:text-white transition">+91 73977 85803</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <a href="mailto:igobackend3@gmail.com" className="hover:text-white transition">igobackend3@gmail.com</a>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a href="https://www.instagram.com/the_farmers_factory/" target="_blank" rel="noreferrer"
                className="h-9 w-9 bg-white/10 hover:bg-[#E1306C] rounded-lg flex items-center justify-center transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100068904620757" target="_blank" rel="noreferrer"
                className="h-9 w-9 bg-white/10 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/@igogroupofficial" target="_blank" rel="noreferrer"
                className="h-9 w-9 bg-white/10 hover:bg-[#FF0000] rounded-lg flex items-center justify-center transition">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/917397785803`} target="_blank" rel="noreferrer"
                className="h-9 w-9 bg-white/10 hover:bg-[#25D366] rounded-lg flex items-center justify-center transition">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop by Category */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/10">Shop by Category</h4>
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <button onClick={link.action}
                    className="text-slate-400 hover:text-emerald-400 text-xs transition flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 text-emerald-700 group-hover:text-emerald-400 transition" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/10">Quick Links</h4>
            <ul className="space-y-2">
              {infoLinks.map((link, i) => (
                <li key={i}>
                  <button onClick={() => setCurrentPage(link.page)}
                    className="text-slate-400 hover:text-emerald-400 text-xs transition flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 text-emerald-700 group-hover:text-emerald-400 transition" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* IGO Group Ecosystem */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/10">IGO Group Ecosystem</h4>
            <div className="space-y-2">
              {IGO_BRANDS.map((brand, i) => (
                <a key={i} href={brand.url} target={brand.url !== '#' ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center justify-between group">
                  <div>
                    <div className="text-xs font-bold text-slate-300 group-hover:text-white transition">{brand.name}</div>
                    <div className="text-[10px] text-slate-500">{brand.tag}</div>
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${brand.active ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {brand.active ? 'ACTIVE' : 'SOON'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 IGO Agri Mart. All Rights Reserved. Part of <span className="text-emerald-400 font-bold">IGO Group</span>.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('about')} className="hover:text-white transition">About</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition">Contact</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('terms')} className="hover:text-white transition">Terms</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('returns')} className="hover:text-white transition">Returns</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('admin')} className="hover:text-emerald-400 transition font-bold">Admin Login</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
