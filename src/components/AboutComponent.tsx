import React from 'react';
import { 
  Award, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface AboutComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
}

const MILESTONES = [
  { year: '2016', title: 'Agri Hub Inception', desc: 'IGO Seeds is established in Chennai to study high-yield hybrid tomato and cucumber genomes suited for tropical heat waves.' },
  { year: '2019', title: 'The 27-Brand Integration', desc: 'IGO Group combines 27 specialized brand components (Seeds, Fertigation, Drone Services, Greenhouse, Protein Cuts) under unified Chennai administrative leadership.' },
  { year: '2022', title: 'Precision Automation Launch', desc: 'Deploying wireless soil sensors and IoT mist control valves across state horticulture hubs in Southern India.' },
  { year: '2026', title: 'Centralized IGO Agri Market', desc: 'Introducing the consolidated electronic commerce store supplying over 40 products and 11 professional services with zero-friction cooperative credit schemes.' }
];

export default function AboutComponent({
  lang,
  setCurrentPage
}: AboutComponentProps) {
  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb line */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">About IGO Group Conglomerate</span>
        </nav>

        {/* Corporate header cards */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Corporate Overview • Chennai HQ
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight">
              {lang === 'ta' ? 'எங்களைப் பற்றி - ஐ.ஜி.ஓ குழுமங்கள்' : 'IGO Agri Market | IGO Group of Companies'}
            </h2>
            <p className="text-slate-700 text-sm sm:text-base mt-3 leading-relaxed">
              We are an integrated, ISO-certified agritech conglomerate hosting 27 specialized agrarian brand modules. Headquartered at the Kanathur coast of East Coast Road, Chennai, our mission is to provide high-quality crop protections, drone precision spray applications, macro-nutrients, and subvention credit services directly to South Indian agriculturalists.
            </p>
          </div>
        </div>

        {/* Brand Strength Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Brand Manifesto Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-930 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="h-5 w-5 text-[#E8A020]" />
              <span>Conglomerate Strengths</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              By consolidating raw processing materials under unified quality control operations, we eliminate middle-tier dealer fees.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#1B6B3A] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-750 font-medium"><strong>27 Brands, One Invoice:</strong> Buy major Seeds, Fertigations, and Machine lines in a single consolidated cart with standard GST tax processing.</span>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#1B6B3A] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-750 font-medium"><strong>PAN India COD Support:</strong> Pay cash at delivery doors, with customized 20% interest advances above ₹2,000 orders.</span>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#1B6B3A] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-750 font-medium"><strong>Hq Field Audits:</strong> Expert soil analysis and drone application aviators deployed directly from our Chennai workspace hub.</span>
              </div>
            </div>
          </div>

          {/* Location & Headquarters card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-105 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-930 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="h-5 w-5 text-[#1B6B3A]" />
              <span>Headquarter Registry</span>
            </h3>
            
            <div className="bg-[#f7f9f4] p-4 rounded-xl text-xs space-y-3 font-medium text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#1B6B3A] mt-0.5 shrink-0" />
                <div>
                  <strong>Chennai Headquarters Office:</strong><br />
                  No. 17 Kovalan Street, Uthandi, Kanathur, Chennai 600119, Tamil Nadu, India.
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-[#1B6B3A] shrink-0" />
                <div><strong>Office Line:</strong> 7397785803</div>
              </div>

              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-[#E8A020] shrink-0" />
                <div><strong>WhatsApp Helplines:</strong> +91-7397785803</div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#1B6B3A] shrink-0" />
                <div><strong>Inbound Email:</strong> br.admin@igogroups.com</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center">
              Active Hours: 09:00 AM to 06:00 PM (Monday - Saturday)
            </div>
          </div>

        </div>

        {/* Corporate Timeline */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-display font-extrabold text-[#1B6B3A] text-center mb-8">
            The IGO Conglomerate Timeline
          </h3>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-100">
            {MILESTONES.map((stone, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} relative`}>
                
                {/* Visual Bullet Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-2 h-4.5 w-4.5 bg-[#E8A020] border-4 border-white rounded-full z-10"></div>
                
                <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 duration-300 hover:border-[#1B6B3A]/20">
                    <span className="text-sm font-extrabold text-[#1B6B3A] font-mono block">
                      {stone.year}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 leading-tight">
                      {stone.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {stone.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
