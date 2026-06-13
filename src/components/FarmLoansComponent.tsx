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
  Briefcase
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
    subventionRate: '4% (Net of Subvention)',
    standardRate: '8% p.a.',
    maxAmount: '₹2,00,000',
    applicable: 'Purchase of Hybrid Seeds, NPK soluble feeds & biofungicides',
    requirement: 'Under 5 acres of agricultural holding'
  },
  {
    id: 'sch-02',
    name: 'Agricultural Machinery Capital Subvention',
    subventionRate: '5.5% (Net of Subvention)',
    standardRate: '9.2% p.a.',
    maxAmount: '₹5,00,000',
    applicable: 'Brush Cutters, Battery Spray Units & Earth Augers',
    requirement: 'Registration with TN Agriculture department'
  },
  {
    id: 'sch-03',
    name: 'Polyhouse and Greenhouse Erection Credit Line',
    subventionRate: '6.2% (Net of Subvention)',
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

    // Save application so it appears in Admin -> Visitor Leads
    captureLead({ source: 'Farm Loan', name, phone, subject: 'Loan pre-qualification request' });
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb path */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Subsidies & Farm Loans Credit Panel</span>
        </nav>

        {/* Hero Banner header */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Interest Subvention Hub • Nabard Linked
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight">
              {lang === 'ta' ? 'விவசாய கடன்கள் மற்றும் மானியங்கள்' : 'Agricultural Micro-Credit & Interest Subventions'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              In partnership with leading rural cooperative banks, IGO Group of Companies coordinates direct central and state government credit schemes directly with our 27 agritech product brands. Low-interest rates starting at 4% with zero processing charges.
            </p>
          </div>
        </div>

        {/* Schemes Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SCHEMES.map((sch) => (
            <div 
              key={sch.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                    Net: {sch.subventionRate}
                  </span>
                  <span className="text-slate-400 text-xs text-right line-through font-medium">
                    {sch.standardRate}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {sch.name}
                </h3>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
                  <span className="text-xs text-slate-400 font-medium">Limit:</span>
                  <span className="text-xs font-extrabold text-[#E8A020]">{sch.maxAmount}</span>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed leading-relaxed">
                  <strong>Use Case:</strong> {sch.applicable}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 text-[10px] text-slate-405 font-mono">
                Req: {sch.requirement}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Slider Inputs Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Calculator className="h-5 w-5 text-[#1B6B3A]" />
              <h3 className="text-base font-bold text-slate-900">
                Agrarian EMI & Repayment Calculator
              </h3>
            </div>

            {/* Principal Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Required Loan Principal (INR)
                </span>
                <span className="text-sm font-extrabold text-[#1B6B3A]">
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
                className="w-full accent-[#1B6B3A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>₹5,000</span>
                <span>₹7.5 Lakh</span>
                <span>₹15 Lakh</span>
              </div>
            </div>

            {/* Tenure Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Credit Tenure Duration (Years)
                </span>
                <span className="text-sm font-extrabold text-[#1B6B3A]">
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
                className="w-full accent-[#1B6B3A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-mono">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>

            {/* Toggling Government Subvention rates */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#1B6B3A] uppercase tracking-wide">
                  Apply Government Interest Subvention Scheme
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Reduces active monthly interest down to pre-negotiated 4.5% annual subvention rates.
                </p>
              </div>
              <button 
                onClick={() => setIsSubventionApplied(!isSubventionApplied)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isSubventionApplied ? 'bg-[#1B6B3A]' : 'bg-slate-300'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isSubventionApplied ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          {/* EMI Results Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Computed Credit Installment Overview
            </h3>

            <div className="p-5 bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-2xl text-white text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A020]">
                Monthly Payable (EMI)
              </span>
              <div className="text-3xl font-display font-extrabold mt-1 text-[#E8A020]">
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-emerald-250 mt-1 font-medium font-mono">
                Computed for {tenureInput * 12} monthly iterations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Interest
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  ₹{totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Repayable
                </span>
                <span className="text-sm font-extrabold text-[#1B6B3A]">
                  ₹{totalRepayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-medium leading-relaxed bg-[#F7F9F4] p-3 rounded-lg border border-slate-100">
              Disclaimer: Amortized estimation tools are models only. Final interest mappings require full verification of the farmer credit scorecard by direct IGO Group bankers.
            </div>
          </div>

        </div>

        {/* Dynamic Credit Pre-Qualification Form */}
        <div id="loan-eligibility-form" className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-10 px-4 space-y-4 max-w-xl mx-auto">
              <div className="h-16 w-16 bg-blue-100 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="font-display font-extrabold text-slate-900 text-2xl tracking-tight">
                Pre-Qualification Mapped!
              </h3>
              <p className="text-sm text-slate-650 leading-relaxed leading-relaxed">
                Thank you, <strong>{name}</strong>! Your soft pre-qualification application for <strong>{targetScheme.name}</strong> has been logged in our databases in Chennai.
              </p>
              
              <div className="bg-yellow-50 p-4 border border-yellow-200/50 rounded-xl space-y-2 text-left">
                <h4 className="text-xs font-bold text-slate-800">Next Action Checklist:</h4>
                <p className="text-xs text-slate-700 leading-normal">
                  Our Agrarian Credit Linkage manager from No. 17 Kovalan Street, Kanathur headquarters will verify your documents (Pattah, Land Layout, Aadhar card) and reach out to your mobile <strong>{phone}</strong> via WhatsApp within 48 hours.
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
                >
                  Apply For Another Scheme
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePreQualSubmit} className="space-y-6">
              <div className="border-b border-indigo-100 pb-4">
                <span className="text-[#E8A020] text-[10px] font-extrabold uppercase tracking-widest block">
                  CIBIL Allied Verification
                </span>
                <h3 className="text-xl font-display font-extrabold text-slate-900 mt-1">
                  Fast Pre-Qualification Credit Check
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your cooperative agribusiness loan eligibility parameters instantly. Does not affect standard external CIBIL profiles.
                </p>
              </div>

              {errorText && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                  {errorText}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Farmer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Farmer Full Name
                  </label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anandha Selvam"
                    className="w-full bg-[#F7F9F4] text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#1B6B3A]"
                  />
                </div>

                {/* Farmer Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 border-slate-250">
                    Active Phone Number (+91)
                  </label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 7397785803"
                    className="w-full bg-[#F7F9F4] text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#1B6B3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Select Scheme */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Credit Scheme
                  </label>
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="w-full bg-[#F7F9F4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none"
                  >
                    {SCHEMES.map((s, idx) => (
                      <option key={idx} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Land holdings size */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Land Holding (Acres)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="500"
                    value={landAcres}
                    onChange={(e) => setLandAcres(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#F7F9F4] text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#1B6B3A]"
                  />
                </div>

                {/* Annual agritrade income */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Annual Agriculture Income (₹)
                  </label>
                  <input 
                    type="number"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Math.max(10000, Number(e.target.value)))}
                    className="w-full bg-[#F7F9F4] text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Consent check */}
              <div className="flex gap-3 items-start border-slate-100 pt-4 border-t">
                <input 
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded text-[#1B6B3A] border-slate-300 accent-[#1B6B3A] focus:ring-[#1B6B3A] mt-0.5 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 select-none cursor-pointer leading-normal">
                  I hereby authorize IGO Agri Market Credit Linkage Partners to perform a soft evaluation of my agrarian loan parameters. This involves soft check validation with public Tamil Nadu Pattah and Revenue records to estimate cooperative eligibility.
                </label>
              </div>

              {/* Form Submission Button */}
              <button 
                type="submit"
                className="w-full bg-[#1B6B3A] hover:bg-[#15532d] text-white font-bold text-xs py-3 rounded-xl shadow-md border border-[#248F4E] transition"
              >
                Request Pre-Qualifying Credit Verification
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
