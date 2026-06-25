import React, { useState, useEffect } from 'react';
import { captureLead } from '../leads';
import { 
  FileText, 
  Percent, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  Calculator, 
  Smartphone, 
  FileCheck, 
  Calendar,
  Sparkles,
  Info,
  DollarSign,
  Briefcase,
  ExternalLink,
  Shield,
  AlertCircle,
  User,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { translations, LanguageDict } from '../translation';

interface FarmLoansComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  userProfile: any;
}

const SCHEMES = [
  {
    id: 'sch-01',
    name: 'Precision Farming Micro-Credit',
    subventionRate: '4% p.a.',
    standardRate: '8% p.a.',
    maxAmount: '₹2,00,000',
    applicable: 'Purchase of Hybrid Seeds, NPK soluble feeds & biofungicides',
    requirement: 'Under 5 acres of agricultural holding'
  },
  {
    id: 'sch-02',
    name: 'Agricultural Machinery Capital Subvention',
    subventionRate: '5.5% p.a.',
    standardRate: '9.2% p.a.',
    maxAmount: '₹5,00,000',
    applicable: 'Brush Cutters, Battery Spray Units & Earth Augers',
    requirement: 'Registration with TN Agriculture department'
  },
  {
    id: 'sch-03',
    name: 'Polyhouse and Greenhouse Erection Credit Line',
    subventionRate: '6.2% p.a.',
    standardRate: '10.5% p.a.',
    maxAmount: '₹15,00,000',
    applicable: 'Automated Solar Greenhouses & Misting Infrastructures',
    requirement: 'Certified structural invoice from IGO Greenhouse'
  }
];

export default function FarmLoansComponent({
  lang,
  setCurrentPage,
  userProfile
}: FarmLoansComponentProps) {
  
  // Calculator States
  const [loanInput, setLoanInput] = useState<number>(250000);
  const [tenureInput, setTenureInput] = useState<number>(3); // years
  const [isSubventionApplied, setIsSubventionApplied] = useState<boolean>(true);
  
  // Computed EMI numbers
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalRepayable, setTotalRepayable] = useState<number>(0);

  // Form Pre-Qualizer States
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [selectedScheme, setSelectedScheme] = useState(SCHEMES[0].id);
  const [landAcres, setLandAcres] = useState<number>(3);
  const [annualIncome, setAnnualIncome] = useState<number>(150000);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  
  // Feedback states
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const targetScheme = SCHEMES.find(s => s.id === selectedScheme) || SCHEMES[0];

  // Simple amortized EMI calculation on adjust
  useEffect(() => {
    // Determine annual interest based on selected subvention toggling
    const annualRate = isSubventionApplied ? 4.5 : 8.5; // subsidized 4.5% vs standard 8.5%
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = tenureInput * 12;
    
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let emi = 0;
    if (monthlyRate > 0) {
      const pow = Math.pow(1 + monthlyRate, totalMonths);
      emi = (loanInput * monthlyRate * pow) / (pow - 1);
    } else {
      emi = loanInput / totalMonths;
    }

    const repayable = emi * totalMonths;
    const interest = repayable - loanInput;

    setMonthlyEmi(Math.round(emi));
    setTotalInterest(Math.round(interest));
    setTotalRepayable(Math.round(repayable));
  }, [loanInput, tenureInput, isSubventionApplied]);

  const handlePreQualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) {
      setErrorText('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorText('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!consentChecked) {
      setErrorText('Please approve CIBIL soft credit authorization check consent');
      return;
    }

    // 1) Save application so it appears in Admin -> Visitor Leads.
    captureLead({ source: 'Farm Loan', name, phone, subject: 'Loan pre-qualification request' });
    // 2) Email the loan request to the farm-loans team via Web3Forms.
    //    Set VITE_WEB3FORMS_LOAN_KEY (registered to the loan email, e.g. info@igoloans.in)
    //    in Vercel; falls back to the shared VITE_WEB3FORMS_KEY if not set.
    const KEY = (import.meta as any).env?.VITE_WEB3FORMS_LOAN_KEY || (import.meta as any).env?.VITE_WEB3FORMS_KEY || '';
    if (KEY) {
      try {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: KEY,
            subject: 'IGO Farm Loan request: ' + targetScheme.name,
            from_name: 'IGO Agri Mart - Farm Loans',
            name, phone,
            message: `Farm loan pre-qualification request\n\nName: ${name}\nMobile: ${phone}\nScheme: ${targetScheme.name}\nLand holding: ${landAcres} acres\nAnnual agri income: Rs.${annualIncome.toLocaleString('en-IN')}`,
          }),
        }).catch(() => { /* lead is already saved in admin */ });
      } catch { /* ignore */ }
    }
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero Banner header — full-width banner */}
        <div className="bg-gradient-to-br from-[#0a2e18] via-[#1B6B3A] to-[#114b27] shadow-2xl mb-12 relative overflow-hidden flex items-center min-h-[460px] sm:min-h-[540px] py-14 sm:py-20 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {/* Background video */}
          <video autoPlay muted loop playsInline poster="/images/agri_farm_bg.png" className="absolute inset-0 w-full h-full object-cover z-0 opacity-95">
            <source src="/videos/farm-loans.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#06210f]/90 via-[#0a2e18]/45 to-transparent z-0 pointer-events-none"></div>
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 h-96 w-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 h-64 w-64 bg-amber-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/4 h-32 w-32 bg-emerald-400 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-6 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Interest Subvention Hub • Nabard Linked
            </div>
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl mt-2 tracking-tight leading-tight drop-shadow-sm">
              {lang === 'ta' ? 'விவசாய கடன்கள் மற்றும் மானியங்கள்' : 'Agricultural Micro-Credit & Interest Subventions'}
            </h2>
            <p className="text-emerald-50 text-sm sm:text-lg mt-5 leading-relaxed max-w-2xl font-light">
              In partnership with leading rural cooperative banks, IGO Group of Companies coordinates direct central and state government credit schemes directly with our 27 agritech product brands. Low-interest rates starting at <span className="font-bold text-amber-400">4%</span> with zero processing charges.
            </p>
          </div>
        </div>

        {/* Key facts at a glance — the first things a farmer should see */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {[
            { v: '₹50 Lakh', l: 'Max Loan' },
            { v: '7.5%', l: 'Fixed APR (from)' },
            { v: '72 hrs', l: 'Fast Approval' },
            { v: '18+', l: 'Bank Partners' },
            { v: 'Up to 90%', l: 'Subsidy Coverage' },
          ].map((x) => (
            <div key={x.l} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="font-display font-black text-[#1B6B3A] text-xl sm:text-2xl">{x.v}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{x.l}</div>
            </div>
          ))}
        </div>

        {/* Farm Loan Basics — quick A to Z for the customer */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-emerald-50 text-[#1B6B3A] rounded-xl flex items-center justify-center"><HelpCircle className="h-5 w-5" /></div>
            <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">Farm Loan Basics — A to Z</h3>
          </div>
          <p className="text-base text-slate-500 mt-1 mb-8">Everything important, in short. For full details, calculators and success stories, visit the IGO Farm Loans portal.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { q: 'What is a farm loan?', a: 'Low-interest credit for farmers to fund seeds, machinery, irrigation, polyhouses, solar and farm infrastructure — repaid in easy monthly EMIs.' },
              { q: 'Why borrow / what is the use?', a: 'Grow more without blocking your own cash: buy quality inputs, upgrade equipment, build structures and expand — then repay from your harvest income.' },
              { q: 'Who can apply?', a: 'Farmers and agri-entrepreneurs with land records (Pattah), Aadhaar and a basic income or crop plan. Even small (under 5 acre) holdings qualify.' },
              { q: 'Why IGO Farm Loans?', a: 'Rates from 7.5% (as low as 4% with subvention), up to 90% government subsidy stacking, 72-hour approval, 18+ bank partners — and we handle 100% of the paperwork.' },
            ].map((f) => (
              <div key={f.q} className="bg-[#F7F9F4] border border-slate-100 rounded-2xl p-5">
                <div className="font-black text-slate-900 text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#1B6B3A] shrink-0" /> {f.q}</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            <button onClick={() => document.getElementById('loan-eligibility-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-[#1B6B3A] hover:bg-[#114b27] text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-[#1B6B3A]/30 transition">Check My Eligibility</button>
            <a href="https://igofarmloans.com/" target="_blank" rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-black text-sm px-8 py-3.5 rounded-xl transition">
              See Full Details on IGO Farm Loans <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Schemes Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SCHEMES.map((sch) => (
            <div 
              key={sch.id}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-[#1B6B3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div>
                <div className="flex justify-between items-start gap-2 mb-5">
                  <span className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-[#1B6B3A] border border-emerald-200/50 text-[10px] font-black uppercase px-3 py-1.5 rounded-md tracking-wider">
                    From {sch.subventionRate}
                  </span>
                  <span className="text-slate-400 text-xs text-right line-through font-bold decoration-slate-300">
                    {sch.standardRate}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#1B6B3A] transition-colors">
                  {sch.name}
                </h3>
                
                <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-7 px-7 py-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Limit:</span>
                  <span className="text-sm font-black text-[#E8A020] bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{sch.maxAmount}</span>
                </div>

                <p className="text-xs text-slate-600 mt-5 leading-relaxed">
                  <strong className="text-slate-900">Use Case:</strong> {sch.applicable}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-500 font-medium leading-tight">
                  <strong className="text-slate-700">Req:</strong> {sch.requirement}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          
          {/* Slider Inputs Box */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-7 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Calculator className="h-32 w-32 text-[#1B6B3A]" />
            </div>
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 relative z-10">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-[#1B6B3A]">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-900">
                Loan EMI Calculator
              </h3>
            </div>

            {/* Principal Range Slider */}
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Loan Amount
                </span>
                <span className="text-2xl font-display font-black text-[#1B6B3A] bg-[#F7F9F4] px-4 py-1 rounded-lg border border-slate-100">
                  ₹{loanInput.toLocaleString('en-IN')}
                </span>
              </div>
              <input 
                type="range"
                min="5000"
                max="1500000"
                step="25000"
                value={loanInput}
                onChange={(e) => setLoanInput(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E8A020]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold tracking-wider mt-2">
                <span>₹5,000</span>
                <span>₹7.5 Lakh</span>
                <span>₹15 Lakh</span>
              </div>
            </div>

            {/* Tenure Range Slider */}
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Repayment Tenure
                </span>
                <span className="text-2xl font-display font-black text-[#1B6B3A] bg-[#F7F9F4] px-4 py-1 rounded-lg border border-slate-100">
                  {tenureInput} {tenureInput === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="5"
                step="1"
                value={tenureInput}
                onChange={(e) => setTenureInput(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E8A020]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold tracking-wider mt-2">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>

            {/* Toggling Government Subvention rates */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100/60 flex items-center justify-between shadow-inner relative z-10">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#1B6B3A] flex items-center gap-2">
                  <Percent className="h-4 w-4" /> Apply Government Interest Subsidy
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Applies the subsidised 4.5% p.a. rate in place of the standard rate.
                </p>
              </div>
              <button 
                onClick={() => setIsSubventionApplied(!isSubventionApplied)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${isSubventionApplied ? 'bg-[#1B6B3A]' : 'bg-slate-300'}`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] ring-0 transition duration-300 ease-in-out ${isSubventionApplied ? 'translate-x-7' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          {/* EMI Results Box */}
          <div className="lg:col-span-5 bg-[#0a2e18] rounded-3xl p-8 border border-[#114b27] shadow-[0_20px_40px_rgba(10,46,24,0.15)] flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B6B3A] rounded-full blur-[80px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8A020] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Your Estimated Repayment
              </h3>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-2xl mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A020]">
                  Estimated Monthly EMI
                </span>
                <div className="text-4xl sm:text-5xl font-display font-black mt-3 text-white drop-shadow-md">
                  <span className="text-emerald-400 text-3xl font-sans mr-1">₹</span>{monthlyEmi.toLocaleString('en-IN')}
                </div>
                <div className="mt-4 inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/5">
                  <p className="text-[10px] text-emerald-200 font-medium tracking-wide">
                    Over {tenureInput * 12} monthly installments
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Total Interest
                  </span>
                  <span className="text-lg font-black text-emerald-100">
                    ₹{totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Total Repayable
                  </span>
                  <span className="text-lg font-black text-white">
                    ₹{totalRepayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 text-[10px] text-emerald-400/60 font-medium leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
              <Info className="h-3 w-3 inline mr-1 -mt-0.5" />
              Disclaimer: This is an estimate only. Your final interest rate is confirmed after document and eligibility verification by our partner banks.
            </div>
          </div>

        </div>

        {/* Dynamic Credit Pre-Qualification Form */}
        <div id="loan-eligibility-form" className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          {/* Form background accents */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#1B6B3A]/5 rounded-bl-[100px] pointer-events-none"></div>

          {isSubmitted ? (
            <div className="text-center py-14 px-4 space-y-6 max-w-xl mx-auto relative z-10">
              <div className="h-24 w-24 bg-emerald-50 border border-emerald-100 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div>
                <h3 className="font-display font-black text-slate-900 text-3xl tracking-tight mb-2">
                  Application Received!
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Thank you, <strong className="text-slate-900">{name}</strong>! Your soft application for <strong className="text-[#1B6B3A]">{targetScheme.name}</strong> is safely logged in our systems.
                </p>
              </div>
              
              <div className="bg-amber-50/80 p-6 border border-amber-200/50 rounded-2xl text-left shadow-sm">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-2">
                  <FileCheck className="h-4 w-4 text-amber-600" /> Next Action Checklist:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our farm-credit manager will verify your documents (land record, layout and Aadhaar) and contact you on WhatsApp at <strong className="text-slate-900">{phone}</strong> within 48 hours.
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#1B6B3A]/30 transition transform hover:-translate-y-0.5"
                >
                  Apply For Another Scheme
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePreQualSubmit} className="space-y-8 relative z-10">
              <div className="border-b border-slate-100 pb-6 text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  <Shield className="h-3 w-3" /> Quick Eligibility Check
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 leading-tight">
                  Fast Pre-Qualification Check
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Check your loan eligibility in minutes. This is a soft check and does not affect your credit score.
                </p>
              </div>

              {errorText && (
                <div className="p-4 bg-red-50/80 border border-red-200 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                  <AlertCircle className="h-5 w-5" /> {errorText}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Farmer Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#1B6B3A]" /> Farmer Full Name
                  </label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anandha Selvam"
                    className="w-full bg-[#F7F9F4] hover:bg-white text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-4 focus:ring-[#1B6B3A]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Farmer Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5 text-[#1B6B3A]" /> Active Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-400">+91</span>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="7397785803"
                      className="w-full bg-[#F7F9F4] hover:bg-white text-sm pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-4 focus:ring-[#1B6B3A]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {/* Select Scheme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-[#1B6B3A]" /> Target Scheme
                  </label>
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="w-full bg-[#F7F9F4] hover:bg-white text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-4 focus:ring-[#1B6B3A]/10 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                  >
                    {SCHEMES.map((s, idx) => (
                      <option key={idx} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Land holdings size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#1B6B3A]" /> Land Holding (Acres)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="500"
                    value={landAcres}
                    onChange={(e) => setLandAcres(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#F7F9F4] hover:bg-white text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-4 focus:ring-[#1B6B3A]/10 transition-all font-medium text-slate-800"
                  />
                </div>

                {/* Annual agritrade income */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-[#1B6B3A]" /> Annual Income (₹)
                  </label>
                  <input 
                    type="number"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Math.max(10000, Number(e.target.value)))}
                    className="w-full bg-[#F7F9F4] hover:bg-white text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B6B3A] focus:ring-4 focus:ring-[#1B6B3A]/10 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Consent check */}
              <div className="flex gap-4 items-start bg-emerald-50/50 p-5 rounded-xl border border-emerald-100/50">
                <input 
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="h-5 w-5 shrink-0 rounded text-[#1B6B3A] border-slate-300 accent-[#1B6B3A] focus:ring-[#1B6B3A] cursor-pointer mt-0.5"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 select-none cursor-pointer leading-relaxed">
                  I authorise IGO Agri Mart's credit partners to assess my loan eligibility using the details I have submitted and public land records. This is a soft check and does not affect my credit score.
                </label>
              </div>

              {/* Form Submission Button */}
              <button 
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-[#15532d] to-[#1B6B3A] hover:from-[#0a2e18] hover:to-[#15532d] text-white font-black text-sm py-4 rounded-xl shadow-[0_8px_20px_rgba(27,107,58,0.3)] transition-all transform hover:-translate-y-0.5 group"
              >
                <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-12 -ml-10 group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Check My Eligibility <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </form>
          )}
        </div>

        {/* ── Loan Schemes We Cover ─────────────────────────────── */}
        <div className="mt-14 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">Loan Schemes We Cover</h3>
          </div>
          <p className="text-base text-slate-500 mt-1 mb-8">End-to-end support — paperwork, bank coordination, and legal compliance — for every major scheme.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { k: 'KCC', d: 'Kisan Credit Card' },
              { k: 'PMEGP', d: 'PM Employment Gen.' },
              { k: 'MSME', d: 'Micro & Small Enterprise' },
              { k: 'AIF', d: 'Agri Infrastructure Fund' },
              { k: 'NABARD', d: 'Infrastructure Grants' },
            ].map((s) => (
              <div key={s.k} className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="font-black text-[#1B6B3A] text-lg">{s.k}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">{s.d}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            {[
              { v: 'Rs.50 Lakh', l: 'Max loan amount' },
              { v: '7.5%', l: 'Fixed APR (from)' },
              { v: '72 hrs', l: 'Approval speed' },
              { v: '18+', l: 'Bank partners' },
            ].map((x) => (
              <div key={x.l} className="text-center">
                <div className="font-display font-black text-slate-900 text-2xl sm:text-3xl">{x.v}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Government Subsidies ─────────────────────────────── */}
        <div className="mt-8 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">Government Subsidies We Maximize</h3>
          </div>
          <p className="text-base text-slate-500 mt-1 mb-8">We stack central + state schemes to cover up to 90% of your project cost.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { t: 'PM-KUSUM Solar', d: 'Up to 90% subsidized solar pumps & farm power. Site assessment, design, approval and install handled.', img: '/images/live_trial_field_india.png' },
              { t: 'NHB Horticulture', d: 'National Horticulture Board grants for polyhouse, orchards and protected cultivation.', img: '/images/hero_3_new.png' },
              { t: 'NABARD Infrastructure', d: 'Capital subsidy for cold storage, warehouses and farm infrastructure projects.', img: '/images/agri_farm_bg.png' },
            ].map((s) => (
              <div key={s.t} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.img} alt={s.t} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { (e.target as HTMLImageElement).src = '/images/agri_farm_bg.png'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                </div>
                <div className="p-5">
                  <div className="font-black text-slate-900 text-base">{s.t}</div>
                  <div className="text-xs text-slate-500 mt-2 leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How We Help (end to end) ─────────────────────────────── */}
        <div className="mt-8 bg-[#F7F9F4] rounded-3xl p-8 sm:p-10 border border-emerald-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-200/20 rounded-bl-full pointer-events-none"></div>
          <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight relative z-10">How We Help — End to End</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
            {[
              { t: 'Loan Facilitation', d: 'Paperwork, bank coordination and legal compliance for KCC, PMEGP, AIF & NABARD.' },
              { t: 'Subsidy Maximization', d: 'Optimal central + state scheme stacking for the highest coverage.' },
              { t: 'DPR Preparation', d: 'Bankable Detailed Project Reports to NABARD / Ministry standards.' },
              { t: 'Project Management', d: 'Site selection, design, build supervision through to first harvest.' },
            ].map((s) => (
              <div key={s.t} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#1B6B3A] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-8 w-8 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="font-black text-slate-800 text-sm">{s.t}</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 relative z-10 text-center">
            <button onClick={() => document.getElementById('loan-eligibility-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#1B6B3A] hover:bg-[#114b27] text-white font-black text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#1B6B3A]/30 transition transform hover:-translate-y-0.5">
              Apply for a Loan / Subsidy
            </button>
          </div>
        </div>

        {/* ── How to Borrow (Procedure) ─────────────────────────────── */}
        <div className="mt-8 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">How to Borrow — The Procedure</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-[3px] bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 z-0 rounded-full"></div>
            {[
              { s: '1', t: 'Pre-Qualification', d: 'Fill the eligibility form above. Our system instantly verifies parameters.' },
              { s: '2', t: 'Document Collection', d: 'Our credit manager connects via WhatsApp to collect Pattah, Aadhar & land details.' },
              { s: '3', t: 'DPR & Bank Approval', d: 'We prepare your Detailed Project Report (DPR) and submit it to our 18+ partner banks.' },
              { s: '4', t: '72hr Disbursal', d: 'Fast-tracked approval process ensures funds reach your account within 72 hours.' },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
                <div className="h-12 w-12 bg-gradient-to-br from-[#1B6B3A] to-[#114b27] text-white font-black rounded-xl flex items-center justify-center mb-5 text-lg shadow-[0_4px_15px_rgba(27,107,58,0.3)] group-hover:scale-110 transition-transform duration-300">
                  {step.s}
                </div>
                <h4 className="font-black text-slate-900 text-base">{step.t}</h4>
                <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Benefits for the Customer (Cx) ─────────────────────────────── */}
        <div className="mt-8 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/50">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display font-black text-slate-900 text-2xl sm:text-3xl tracking-tight">How IGO Benefits You (Customer)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { t: 'Zero Processing Headaches', d: 'We handle 100% of the paperwork, bank coordination, and legal compliance. You focus on farming.' },
              { t: 'Lowest Interest Rates', d: 'Access institutional credit lines with fixed APR starting at just 7.5%.' },
              { t: 'AI Subsidy Stacking', d: 'Our AI engine identifies and combines Central and State subsidies so you get up to 90% cost coverage.' },
              { t: 'NABARD Certified', d: 'We are an approved partner with certified quality (ISO 9001), ensuring your projects meet all standards.' },
              { t: 'Complete Ecosystem', d: 'We don\'t just get you a loan; we help with project design, build supervision, and even franchise partnerships.' },
              { t: 'Guaranteed Results', d: 'Over 1M+ Agripreneurs supported with ₹5k Cr+ in capital flow facilitated to date.' },
            ].map((b, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#F7F9F4]/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="bg-emerald-100/50 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[#1B6B3A]" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{b.t}</h4>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact & Full Details ─────────────────────────────── */}
        <div className="mt-8 bg-gradient-to-br from-[#0a2e18] to-[#1B6B3A] rounded-3xl p-8 sm:p-14 shadow-2xl text-white relative overflow-hidden">
          {/* Abstract glows */}
          <div className="absolute top-0 right-0 h-96 w-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-amber-400/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 justify-between items-center">
            <div className="max-w-2xl">
              <span className="inline-block bg-white/10 text-emerald-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-white/10">
                Corporate Agrifinance
              </span>
              <h3 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">Want the full picture?</h3>
              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed mb-8 font-light">
                Explore our dedicated Sovereign Farming-Fintech portal. Read success stories, use our advanced subsidy calculators, and view our massive portfolio of precision farming ventures.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs sm:text-sm text-emerald-50 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="leading-relaxed">Plot #42, Farming-Fintech Hub, Delhi NCR — 110001, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Smartphone className="h-4 w-4 text-amber-400" />
                  </div>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-amber-400" />
                  </div>
                  <span>info@igoloans.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                  </div>
                  <span>Mon–Sat · 9 AM – 7 PM IST</span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 w-full lg:w-auto text-center lg:text-right">
              <a 
                href="https://igofarmloans.com/" 
                target="_blank" 
                rel="noreferrer"
                className="w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-10 py-5 rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 group text-lg"
              >
                Visit IGO Farm Loans <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <p className="text-xs text-center lg:text-right text-emerald-200/60 mt-4 font-medium flex items-center justify-center lg:justify-end gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Securely opens external portal
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
