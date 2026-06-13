import React, { useState } from 'react';
import {
  BookOpen,
  Sprout,
  FlaskConical,
  Bug,
  Newspaper,
  PlayCircle,
  Search,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';

interface KnowledgeHubComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
}

type HubSection = 'all' | 'crop-guides' | 'fertilizer-guides' | 'disease-library' | 'news' | 'videos';

interface HubArticle {
  id: string;
  section: Exclude<HubSection, 'all'>;
  title: string;
  titleTa: string;
  summary: string;
  summaryTa: string;
  tag: string;
  readTime: string;
}

const SECTION_META: Record<Exclude<HubSection, 'all'>, { label: string; labelTa: string; icon: any; color: string }> = {
  'crop-guides': { label: 'Crop Guides', labelTa: 'பயிர் வழிகாட்டிகள்', icon: Sprout, color: 'bg-emerald-50 text-emerald-700' },
  'fertilizer-guides': { label: 'Fertilizer Guides', labelTa: 'உர வழிகாட்டிகள்', icon: FlaskConical, color: 'bg-sky-50 text-sky-700' },
  'disease-library': { label: 'Disease Library', labelTa: 'நோய் நூலகம்', icon: Bug, color: 'bg-[#D94F3D]/10 text-[#D94F3D]' },
  'news': { label: 'Agriculture News', labelTa: 'விவசாய செய்திகள்', icon: Newspaper, color: 'bg-amber-50 text-amber-800' },
  'videos': { label: 'Video Tutorials', labelTa: 'காணொளி பயிற்சிகள்', icon: PlayCircle, color: 'bg-violet-50 text-violet-700' },
};

const ARTICLES: HubArticle[] = [
  {
    id: 'kh-01', section: 'crop-guides',
    title: 'Tomato Cultivation: Nursery to Harvest — A 90-Day Calendar',
    titleTa: 'தக்காளி சாகுபடி: நர்சரி முதல் அறுவடை வரை — 90 நாள் காலண்டர்',
    summary: 'Step-by-step planting windows, spacing, irrigation cycles, and nutrient stages tailored for Tamil Nadu\'s agro-climatic zones.',
    summaryTa: 'தமிழ்நாட்டின் வேளாண் காலநிலை மண்டலங்களுக்கு ஏற்ற நடவு காலம், இடைவெளி, பாசன சுழற்சி மற்றும் ஊட்டச்சத்து நிலைகள்.',
    tag: 'Tomato', readTime: '8 min read'
  },
  {
    id: 'kh-02', section: 'crop-guides',
    title: 'Paddy Transplanting Best Practices for the Cauvery Delta',
    titleTa: 'காவிரி டெல்டாவிற்கான நெல் நடவு சிறந்த நடைமுறைகள்',
    summary: 'Optimal seedling age, spacing grids, and water management techniques to maximise tillering and grain-fill.',
    summaryTa: 'நாற்று வயது, இடைவெளி அளவீடுகள் மற்றும் நீர் மேலாண்மை நுட்பங்கள் கதிர் வளர்ச்சியை அதிகரிக்க உதவும்.',
    tag: 'Paddy', readTime: '6 min read'
  },
  {
    id: 'kh-03', section: 'fertilizer-guides',
    title: 'Reading an NPK Label: What 19:19:19 Actually Means for Your Soil',
    titleTa: 'NPK லேபிளை படிப்பது: 19:19:19 உங்கள் மண்ணுக்கு என்ன அர்த்தம்',
    summary: 'A plain-language breakdown of nutrient ratios, application rates per acre, and when soluble vs. granular fertilizers make sense.',
    summaryTa: 'ஊட்டச்சத்து விகிதங்கள், ஏக்கருக்கான பயன்பாட்டு அளவுகள் மற்றும் கரையக்கூடிய/துகள் உரங்களுக்கு இடையேயான வேறுபாடு.',
    tag: 'Fertilizer Basics', readTime: '5 min read'
  },
  {
    id: 'kh-04', section: 'fertilizer-guides',
    title: 'Organic vs. Chemical Fertilizers: Building a Hybrid Nutrition Plan',
    titleTa: 'இயற்கை vs. வேதி உரங்கள்: கலப்பின ஊட்டச்சத்து திட்டம் உருவாக்குதல்',
    summary: 'How to combine seaweed extracts, vermicompost, and soluble NPK feeds across a crop cycle for both yield and soil health.',
    summaryTa: 'கடற்பாசி சாறு, மண்புழு உரம் மற்றும் கரையக்கூடிய NPK உரங்களை இணைத்து விளைச்சல் மற்றும் மண் ஆரோக்கியத்தை மேம்படுத்துதல்.',
    tag: 'Soil Health', readTime: '7 min read'
  },
  {
    id: 'kh-05', section: 'disease-library',
    title: 'Early Blight in Tomatoes: Identification, Spread & Control',
    titleTa: 'தக்காளியில் ஆரம்பகால கருகல் நோய்: அடையாளம், பரவல் & கட்டுப்பாடு',
    summary: 'Visual identification cues, the conditions that trigger outbreaks, and a structured treatment timeline — paired with our AI Crop Doctor tool.',
    summaryTa: 'காட்சி அடையாளக் குறிப்புகள், நோய் பரவலுக்கான காரணிகள் மற்றும் கட்டமைக்கப்பட்ட சிகிச்சை காலவரிசை — AI கிராப் டாக்டர் கருவியுடன் இணைந்தது.',
    tag: 'Tomato · Fungal', readTime: '6 min read'
  },
  {
    id: 'kh-06', section: 'disease-library',
    title: 'Bacterial Leaf Blight in Paddy: Field Diagnosis Checklist',
    titleTa: 'நெல்லில் பாக்டீரியா இலை கருகல்: வயல் கண்டறிதல் சரிபார்ப்பு பட்டியல்',
    summary: 'A printable scouting checklist for extension officers and farmers to confirm BLB before applying treatment.',
    summaryTa: 'சிகிச்சை அளிப்பதற்கு முன் BLB நோயை உறுதிப்படுத்த விவசாயிகள் & விரிவாக்க அதிகாரிகளுக்கான பட்டியல்.',
    tag: 'Paddy · Bacterial', readTime: '4 min read'
  },
  {
    id: 'kh-07', section: 'news',
    title: 'PM-KISAN 16th Instalment: Eligibility & Disbursal Dates Explained',
    titleTa: 'PM-KISAN 16வது தவணை: தகுதி & வழங்கும் தேதிகள் விளக்கம்',
    summary: 'What Tamil Nadu farmers need to check on the portal this cycle, and how to resolve common e-KYC mismatches.',
    summaryTa: 'இந்த சுழற்சியில் தமிழ்நாடு விவசாயிகள் போர்ட்டலில் சரிபார்க்க வேண்டியவை மற்றும் e-KYC பொருத்தமின்மைகளை சரிசெய்தல்.',
    tag: 'Govt. Schemes', readTime: '3 min read'
  },
  {
    id: 'kh-08', section: 'news',
    title: 'Monsoon Outlook 2026: What the IMD Forecast Means for Kharif Planning',
    titleTa: 'பருவமழை கண்ணோட்டம் 2026: காரீஃப் திட்டமிடலுக்கு IMD முன்னறிவிப்பு என்ன அர்த்தம்',
    summary: 'A district-wise summary of rainfall expectations and how to time sowing windows accordingly.',
    summaryTa: 'மாவட்ட வாரியான மழை எதிர்பார்ப்புகள் மற்றும் அதற்கேற்ப விதைப்பு காலத்தை திட்டமிடுவது எப்படி.',
    tag: 'Weather', readTime: '5 min read'
  },
  {
    id: 'kh-09', section: 'videos',
    title: 'Calibrating a Battery Sprayer for Even Coverage (Video Walkthrough)',
    titleTa: 'சீரான பயன்பாட்டுக்கு பேட்டரி தெளிப்பானை அளவீடு செய்தல் (காணொளி வழிகாட்டி)',
    summary: 'A 6-minute field demo on nozzle selection, pressure settings, and walking speed for uniform spray coverage.',
    summaryTa: 'நாஸில் தேர்வு, அழுத்த அமைப்புகள் மற்றும் சீரான தெளிப்புக்கான நடை வேகம் குறித்த 6 நிமிட காணொளி.',
    tag: 'Equipment', readTime: '6 min video'
  },
  {
    id: 'kh-10', section: 'videos',
    title: 'Reading Your Soil Report: NPK, pH & Micronutrients in 5 Minutes',
    titleTa: 'உங்கள் மண் அறிக்கையைப் படித்தல்: NPK, pH & நுண்ணூட்டச்சத்துக்கள் 5 நிமிடங்களில்',
    summary: 'A visual breakdown of common soil-test parameters and what corrective inputs each result calls for.',
    summaryTa: 'பொதுவான மண் பரிசோதனை அளவுருக்களின் காட்சி விளக்கம் மற்றும் ஒவ்வொரு முடிவுக்கும் தேவையான திருத்த நடவடிக்கைகள்.',
    tag: 'Soil Reports', readTime: '5 min video'
  },
];

export default function KnowledgeHubComponent({
  lang,
  setCurrentPage
}: KnowledgeHubComponentProps) {
  const [activeSection, setActiveSection] = useState<HubSection>('all');
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter(a => {
    const matchesSection = activeSection === 'all' || a.section === activeSection;
    const text = (lang === 'ta' ? a.titleTa + ' ' + a.summaryTa : a.title + ' ' + a.summary) + ' ' + a.tag;
    const matchesQuery = !query.trim() || text.toLowerCase().includes(query.toLowerCase());
    return matchesSection && matchesQuery;
  });

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Knowledge Hub</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> SEO Content Engine · Demo Preview
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight flex items-center gap-3">
              <BookOpen className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              {lang === 'ta' ? 'அறிவு மையம்' : 'Knowledge Hub'}
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {lang === 'ta'
                ? 'பயிர் வழிகாட்டிகள், உர வழிகாட்டிகள், நோய் நூலகம், விவசாய செய்திகள் மற்றும் காணொளி பயிற்சிகள் — ஆயிரக்கணக்கான விவசாய தேடல் வார்த்தைகளுக்கு தரவரிசைப்படுத்த வடிவமைக்கப்பட்ட உள்ளடக்க மையம்.'
                : 'Crop Guides, Fertilizer Guides, a Disease Library, Agriculture News, and Video Tutorials — a content hub designed to rank for thousands of agriculture search terms and build long-term trust with farmers.'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'ta' ? 'வழிகாட்டிகள், நோய்கள், செய்திகள் தேடவும்…' : 'Search guides, diseases, news, tutorials…'}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/30 focus:border-[#1B6B3A]"
          />
        </div>

        {/* Section filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition border ${activeSection === 'all' ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white text-slate-700 border-slate-200 hover:border-[#1B6B3A]'}`}
          >
            {lang === 'ta' ? 'அனைத்தும்' : 'All Sections'}
          </button>
          {(Object.keys(SECTION_META) as Exclude<HubSection, 'all'>[]).map(key => {
            const meta = SECTION_META[key];
            const Icon = meta.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition border ${activeSection === key ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white text-slate-700 border-slate-200 hover:border-[#1B6B3A]'}`}
              >
                <Icon className="h-3.5 w-3.5" /> {lang === 'ta' ? meta.labelTa : meta.label}
              </button>
            );
          })}
        </div>

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => {
            const meta = SECTION_META[a.section];
            const Icon = meta.icon;
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col hover:shadow-md transition group">
                <span className={`self-start inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.color}`}>
                  <Icon className="h-3 w-3" /> {lang === 'ta' ? meta.labelTa : meta.label}
                </span>
                <h3 className="text-sm font-extrabold text-slate-800 mt-3 leading-snug line-clamp-2">
                  {lang === 'ta' ? a.titleTa : a.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 flex-1">
                  {lang === 'ta' ? a.summaryTa : a.summary}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Tag className="h-3 w-3" /> {a.tag} · {a.readTime}
                  </span>
                  <button
                    onClick={() => setCurrentPage(a.section === 'videos' || a.section === 'news' ? 'blog' : (a.section === 'disease-library' ? 'crop-doctor' : 'academy'))}
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#1B6B3A] group-hover:gap-1.5 transition-all"
                  >
                    {lang === 'ta' ? 'மேலும் பார்க்க' : 'Explore'} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm text-slate-400">
              {lang === 'ta' ? 'பொருந்தும் கட்டுரைகள் எதுவும் கிடைக்கவில்லை.' : 'No matching articles found — try a different search term or section.'}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-8 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            {lang === 'ta'
              ? 'மாதிரி காட்சி: இந்த கட்டுரைகள் உள்ளடக்க மைய கருத்தை விளக்க எழுதப்பட்ட மாதிரிகள். நேரடி பதிப்பில் ஒவ்வொரு கட்டுரையும் முழு பக்கமாகவும், SEO-மேம்படுத்தப்பட்டதாகவும், IGO Academy & Blog உடன் இணைக்கப்பட்டதாகவும் இருக்கும்.'
              : 'Demo Preview: these are illustrative summaries showing the intended content-hub structure. In production, each card would link to a full SEO-optimised article, cross-linked with IGO Academy and the Blog, and indexed for the agriculture search terms in your Agri Mart 2.0 SEO strategy.'}
          </p>
        </div>
      </div>
    </div>
  );
}
