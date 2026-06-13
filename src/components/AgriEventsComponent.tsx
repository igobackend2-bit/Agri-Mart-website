import { useState } from 'react';
import { Calendar, MapPin, ExternalLink, ChevronRight, Search, Filter, Clock, Users, Award } from 'lucide-react';

interface AgriEventsProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: string) => void;
}

const ALL_EVENTS = [
  {
    id: 1,
    name: 'AGRI INTEX 2026',
    city: 'Coimbatore', state: 'Tamil Nadu',
    date: 'Jul 9–11, 2026', dateSort: '2026-07-09',
    type: 'Trade Expo', emoji: '🏭',
    organizer: 'CODISSIA',
    venue: 'CODISSIA Trade Fair Complex, Coimbatore',
    description: 'South India\'s largest agriculture trade fair showcasing seeds, machinery, irrigation, fertilizers, and agri-tech innovations.',
    tags: ['Seeds', 'Machinery', 'Irrigation', 'Agri-Tech'],
    expected: '50,000+ visitors',
    color: 'border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700',
    bgGrad: 'from-emerald-50 to-emerald-100',
    featured: true,
  },
  {
    id: 2,
    name: 'India Horti Expo 2026',
    city: 'Hosur', state: 'Tamil Nadu',
    date: 'Jun 19–20, 2026', dateSort: '2026-06-19',
    type: 'Horticulture',
    emoji: '🌸',
    organizer: 'NABARD / State Horticulture Dept.',
    venue: 'Hosur Agri Centre',
    description: 'Dedicated horticulture expo: floriculture, tissue culture plants, protected cultivation, organic vegetables, and export produce.',
    tags: ['Flowers', 'Vegetables', 'Organic', 'Export'],
    expected: '12,000+ visitors',
    color: 'border-pink-300',
    badge: 'bg-pink-100 text-pink-700',
    bgGrad: 'from-pink-50 to-rose-50',
    featured: false,
  },
  {
    id: 3,
    name: 'Kisan Agri & Agro Tech Expo 2026',
    city: 'Vijayawada', state: 'Andhra Pradesh',
    date: 'Jun 26–27, 2026', dateSort: '2026-06-26',
    type: 'Farmer Meet',
    emoji: '🚜',
    organizer: 'AP Agricultural University',
    venue: 'Amaravathi Expo Grounds, Vijayawada',
    description: 'Focused on precision agriculture, drone tech, micro-irrigation, and direct-to-farmer input distribution channels.',
    tags: ['Drones', 'Irrigation', 'Precision Farming'],
    expected: '30,000+ visitors',
    color: 'border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
    bgGrad: 'from-blue-50 to-cyan-50',
    featured: false,
  },
  {
    id: 4,
    name: 'UNITED AGRITECH 2026',
    city: 'Madurai', state: 'Tamil Nadu',
    date: 'Sep 18–19, 2026', dateSort: '2026-09-18',
    type: 'AgriTech',
    emoji: '🤖',
    organizer: 'CII Tamil Nadu',
    venue: 'Madurai Kamaraj University Grounds',
    description: 'Smart farming technology showcase — IoT sensors, AI advisory tools, satellite crop monitoring, and climate-resilient seed varieties.',
    tags: ['AI', 'IoT', 'Smart Farming', 'Climate'],
    expected: '8,000+ visitors',
    color: 'border-cyan-300',
    badge: 'bg-cyan-100 text-cyan-700',
    bgGrad: 'from-cyan-50 to-teal-50',
    featured: true,
  },
  {
    id: 5,
    name: 'Agri Asia 2026',
    city: 'Gandhinagar', state: 'Gujarat',
    date: 'Sep 11–13, 2026', dateSort: '2026-09-11',
    type: 'International',
    emoji: '🌏',
    organizer: 'ASSOCHAM',
    venue: 'Mahatma Mandir, Gandhinagar',
    description: 'International agricultural trade summit with delegations from 20+ countries, covering exports, farm finance, and commodity markets.',
    tags: ['International', 'Export', 'Finance', 'B2B'],
    expected: '1 Lakh+ visitors',
    color: 'border-violet-300',
    badge: 'bg-violet-100 text-violet-700',
    bgGrad: 'from-violet-50 to-purple-50',
    featured: true,
  },
  {
    id: 6,
    name: 'CII AgroTech India 2026',
    city: 'Chandigarh', state: 'Punjab',
    date: 'Nov 20–23, 2026', dateSort: '2026-11-20',
    type: 'National',
    emoji: '🌾',
    organizer: 'CII',
    venue: 'Punjab Agricultural University, Ludhiana Rd',
    description: 'India\'s premier agricultural technology fair featuring 1,200+ exhibitors, government pavilions, and live field demonstrations.',
    tags: ['National', 'Equipment', 'Technology', 'Live Demo'],
    expected: '2.5 Lakh+ visitors',
    color: 'border-amber-300',
    badge: 'bg-amber-100 text-amber-700',
    bgGrad: 'from-amber-50 to-yellow-50',
    featured: true,
  },
  {
    id: 7,
    name: 'Agroworld Expo 2026',
    city: 'Jalgaon', state: 'Maharashtra',
    date: 'Nov 20–22, 2026', dateSort: '2026-11-20',
    type: 'Regional',
    emoji: '🍌',
    organizer: 'Maharashtra Agri Dept.',
    venue: 'Jalgaon Exhibition Grounds',
    description: 'Maharashtra\'s banana belt agri expo — post-harvest tech, cold chain, food processing, and export packaging innovations.',
    tags: ['Banana', 'Post-Harvest', 'Cold Chain', 'Processing'],
    expected: '20,000+ visitors',
    color: 'border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-700',
    bgGrad: 'from-yellow-50 to-orange-50',
    featured: false,
  },
  {
    id: 8,
    name: 'Bharat Agri Tech 2027',
    city: 'Indore', state: 'Madhya Pradesh',
    date: 'Jan 8–10, 2027', dateSort: '2027-01-08',
    type: 'National',
    emoji: '🇮🇳',
    organizer: 'MP Govt. / ICAR',
    venue: 'Brilliant Convention Centre, Indore',
    description: 'National-level agri innovation summit with startup pitches, government scheme pavilions, and crop science demonstrations.',
    tags: ['Startups', 'Govt. Schemes', 'Innovation'],
    expected: '40,000+ visitors',
    color: 'border-slate-300',
    badge: 'bg-slate-100 text-slate-700',
    bgGrad: 'from-slate-50 to-gray-50',
    featured: false,
  },
];

const TYPE_FILTERS = ['All', 'Trade Expo', 'Horticulture', 'Farmer Meet', 'AgriTech', 'International', 'National', 'Regional'];
const STATE_FILTERS = ['All States', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat', 'Punjab', 'Maharashtra', 'Madhya Pradesh'];

export default function AgriEventsComponent({ lang, setCurrentPage }: AgriEventsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All States');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALL_EVENTS.filter(ev => {
    const matchSearch = !search || ev.name.toLowerCase().includes(search.toLowerCase()) || ev.city.toLowerCase().includes(search.toLowerCase()) || ev.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'All' || ev.type === typeFilter;
    const matchState = stateFilter === 'All States' || ev.state === stateFilter;
    return matchSearch && matchType && matchState;
  }).sort((a, b) => a.dateSort.localeCompare(b.dateSort));

  const featured = ALL_EVENTS.filter(e => e.featured).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1B6B3A] to-emerald-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-1 text-emerald-200 text-sm mb-4 hover:text-white transition">
            ← Back to Home
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-7 w-7 text-[#E8A020]" />
            <span className="bg-[#E8A020] text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Agri Events 2026–27</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight mb-2">
            Upcoming Agriculture Events
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Trade shows, farmer meets, agri-tech expos &amp; conferences across India. Stay connected with the agricultural community.
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6 text-center">
            {[
              { num: `${ALL_EVENTS.length}+`, label: 'Events Listed' },
              { num: '8', label: 'States Covered' },
              { num: '2026–27', label: 'Season' },
              { num: 'Free', label: 'Registration' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-black text-2xl text-[#E8A020]">{s.num}</div>
                <div className="text-xs text-emerald-200 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Featured Events */}
        <div className="mb-10">
          <h2 className="font-display font-black text-xl text-slate-800 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#E8A020]" /> Featured Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map(ev => (
              <div key={ev.id} className={`bg-gradient-to-br ${ev.bgGrad} border ${ev.color} rounded-2xl p-5 relative overflow-hidden hover:shadow-lg transition-all cursor-pointer`}>
                <div className="absolute top-3 right-3 text-3xl opacity-20">{ev.emoji}</div>
                <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${ev.badge} mb-2`}>{ev.type}</span>
                <div className="text-2xl mb-2">{ev.emoji}</div>
                <h3 className="font-display font-black text-sm text-slate-800 leading-tight mb-1">{ev.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                  <MapPin className="h-3 w-3" /> {ev.city}, {ev.state}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#1B6B3A]">
                  <Clock className="h-3 w-3" /> {ev.date}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <Users className="h-3 w-3" /> {ev.expected}
                </div>
                <button className="mt-3 w-full bg-[#1B6B3A] hover:bg-emerald-700 text-white text-[11px] font-bold py-2 rounded-lg transition flex items-center justify-center gap-1">
                  View Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, city, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B6B3A] focus:ring-1 focus:ring-[#1B6B3A]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#1B6B3A] hover:text-[#1B6B3A] transition"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Event Type</div>
                <div className="flex flex-wrap gap-1.5">
                  {TYPE_FILTERS.map(f => (
                    <button key={f} onClick={() => setTypeFilter(f)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${typeFilter === f ? 'bg-[#1B6B3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">State</div>
                <div className="flex flex-wrap gap-1.5">
                  {STATE_FILTERS.map(s => (
                    <button key={s} onClick={() => setStateFilter(s)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${stateFilter === s ? 'bg-[#1B6B3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="mb-4 text-sm text-slate-500">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">📅</div>
            <div className="font-semibold">No events match your filters</div>
            <button onClick={() => { setSearch(''); setTypeFilter('All'); setStateFilter('All States'); }} className="mt-3 text-sm text-[#1B6B3A] hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(ev => (
              <div key={ev.id} className={`bg-white border ${ev.color} rounded-2xl overflow-hidden hover:shadow-md transition-all group`}>
                <div className={`bg-gradient-to-r ${ev.bgGrad} px-5 pt-5 pb-4 border-b ${ev.color}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${ev.badge}`}>{ev.type}</span>
                      <div className="text-3xl mb-1">{ev.emoji}</div>
                    </div>
                    {ev.featured && <span className="text-[9px] font-black bg-[#E8A020] text-emerald-950 px-2 py-0.5 rounded-full uppercase">Featured</span>}
                  </div>
                  <h3 className="font-display font-black text-base text-slate-800 leading-tight">{ev.name}</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#E8A020] shrink-0" />
                    <span>{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B6B3A] mb-2">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {ev.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-3">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {ev.expected} · Organized by {ev.organizer}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2">{ev.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ev.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#1B6B3A] hover:bg-emerald-700 text-white text-[11px] font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                      Register / Info <ExternalLink className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/917397785803?text=Hello%20IGO,%20I%20want%20to%20attend%20${encodeURIComponent(ev.name)}`)}
                      className="bg-green-50 hover:bg-green-100 text-green-700 text-[11px] font-bold px-3 py-2.5 rounded-xl transition border border-green-200"
                    >
                      💬
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* B2B CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#1B6B3A] to-emerald-700 rounded-2xl p-6 sm:p-8 text-white text-center">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="font-display font-black text-xl mb-2">Exhibit at an Agri Event?</h3>
          <p className="text-emerald-100 text-sm max-w-md mx-auto mb-5">
            IGO AgriMart can help you set up your product stall, arrange logistics, and connect with buyers at any of these events.
          </p>
          <button
            onClick={() => window.open('https://wa.me/917397785803?text=Hello%20IGO,%20I%20want%20to%20exhibit%20at%20an%20agri%20event')}
            className="bg-[#E8A020] hover:bg-amber-400 text-emerald-950 font-black text-sm px-7 py-3.5 rounded-xl shadow-lg transition hover:-translate-y-0.5 min-h-[48px]"
          >
            💬 Contact Us for Event Support
          </button>
        </div>
      </div>
    </div>
  );
}
