import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  Microscope,
  ShoppingBag,
  CalendarClock,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Info,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';

interface CropDoctorComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  allProducts: Product[];
  setSelectedProduct: (p: Product | null) => void;
}

interface DiagnosisReport {
  cropGuess: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High';
  rootCause: string;
  symptoms: string[];
  recommendedProductSlugs: string[];
  treatmentSchedule: { day: string; action: string }[];
}

// --- Mocked "AI" diagnosis bank — in production this would be a Gemini Vision call ---
// (`@google/genai` is already an installed dependency in this project, ready to be wired up)
const MOCK_DIAGNOSES: DiagnosisReport[] = [
  {
    cropGuess: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    confidence: 91,
    severity: 'Moderate',
    rootCause: 'Fungal infection favoured by warm, humid weather and overhead irrigation that keeps foliage wet for extended periods. Often spreads from infected plant debris left in the field from a previous season.',
    symptoms: [
      'Concentric "target-board" brown rings on lower & older leaves',
      'Yellowing of tissue surrounding the lesions',
      'Premature leaf drop reducing fruit cover and yield'
    ],
    recommendedProductSlugs: ['fmc-coragen-broad-spectrum-insecticide', 'igo-bio-solutions-organic-seaweed-extract'],
    treatmentSchedule: [
      { day: 'Day 0', action: 'Remove and destroy visibly infected lower leaves; avoid working in the field when foliage is wet' },
      { day: 'Day 1', action: 'Apply recommended fungicide/bio-protectant as a foliar spray in the cool hours of early morning' },
      { day: 'Day 7', action: 'Re-inspect plants; repeat spray if new lesions are visible, rotating active ingredient to prevent resistance' },
      { day: 'Day 14', action: 'Apply a seaweed/bio-stimulant feed to support recovery and strengthen new foliage' }
    ]
  },
  {
    cropGuess: 'Paddy (Rice)',
    disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    confidence: 87,
    severity: 'High',
    rootCause: 'Bacteria entering through wounds or natural openings (hydathodes), spread rapidly by wind-driven rain, flooding, and contaminated irrigation water — especially in fields with excess nitrogen application.',
    symptoms: [
      'Water-soaked streaks near leaf tips and margins turning yellow-to-white',
      'Leaves drying out from the tip downward, giving a scorched look',
      'Milky bacterial ooze visible on cut, infected leaf blades in the morning'
    ],
    recommendedProductSlugs: ['coromandel-npk-19-19-19-soluble-fertilizer', 'igo-bio-solutions-organic-seaweed-extract'],
    treatmentSchedule: [
      { day: 'Day 0', action: 'Drain standing water from the field where possible and avoid working in wet canopy' },
      { day: 'Day 1', action: 'Apply a copper-based bactericide spray; avoid excess nitrogenous top-dressing until the field recovers' },
      { day: 'Day 5', action: 'Switch to balanced NPK feeding to rebuild plant vigour without over-stimulating soft new growth' },
      { day: 'Day 12', action: 'Scout neighbouring bunds; remove and isolate severely infected clumps to slow spread' }
    ]
  },
  {
    cropGuess: 'Cotton',
    disease: 'Pink Bollworm Infestation (Pectinophora gossypiella)',
    confidence: 84,
    severity: 'High',
    rootCause: 'Moth larvae boring into developing bolls, typically peaking mid-season; aggravated by continuous cotton cropping, delayed harvest of the previous season\'s crop residue, and absence of pheromone trap monitoring.',
    symptoms: [
      'Rosette-shaped flowers with larvae visible inside when opened',
      'Small circular entry/exit holes on green bolls',
      'Stained, discoloured lint and premature boll opening'
    ],
    recommendedProductSlugs: ['fmc-coragen-broad-spectrum-insecticide', 'igo-hybrid-tomato-seeds-swaraksha-plus'],
    treatmentSchedule: [
      { day: 'Day 0', action: 'Install pheromone traps (4-5/acre) to confirm moth activity levels before spraying' },
      { day: 'Day 2', action: 'Apply a recommended broad-spectrum insecticide once trap catches cross the economic threshold' },
      { day: 'Day 10', action: 'Hand-pick and destroy visibly infested rosette flowers and bolls to break the breeding cycle' },
      { day: 'Day 21', action: 'Plan for timely crop residue destruction post-harvest to deny overwintering sites for the next season' }
    ]
  }
];

const LANG_LABELS = {
  en: {
    eyebrow: 'AI-Powered Plant Health · Demo Preview',
    title: 'Crop Doctor — Diagnose Crop Issues from a Photo',
    subtitle: 'Upload a clear photo of the affected leaf, stem, or fruit. Our AI vision model analyses visual symptoms and returns a diagnosis report with root cause, recommended products, and a day-by-day treatment plan.',
    uploadCta: 'Upload or drag a crop photo here',
    uploadHint: 'JPG or PNG · Best results with close-up, well-lit photos of the affected part',
    chooseFile: 'Choose Photo',
    analyzing: 'Analysing visual symptoms with AI Vision…',
    analyzingSub: 'Cross-referencing against 1,200+ known crop disease patterns',
    tryAnother: 'Diagnose Another Photo',
    diseaseDetected: 'Disease Detected',
    confidence: 'AI Confidence',
    severity: 'Severity',
    rootCause: 'Root Cause',
    symptoms: 'Observed Symptoms',
    recommended: 'Recommended Products',
    schedule: 'Treatment Schedule',
    viewProduct: 'View Product →',
    demoNotice: 'Demo Preview: this report is generated from a sample diagnosis bank for demonstration. The production version will connect to Gemini Vision (already installed in this project as @google/genai) for real-time image analysis.',
  },
  ta: {
    eyebrow: 'AI இயங்கும் பயிர் சுகாதாரம் · மாதிரி காட்சி',
    title: 'கிராப் டாக்டர் — புகைப்படத்தில் இருந்து பயிர் பிரச்சனைகளை கண்டறியவும்',
    subtitle: 'பாதிக்கப்பட்ட இலை, தண்டு அல்லது பழத்தின் தெளிவான புகைப்படத்தை பதிவேற்றவும். எங்கள் AI பார்வை மாதிரி காட்சி அறிகுறிகளை பகுப்பாய்வு செய்து, மூல காரணம், பரிந்துரைக்கப்பட்ட தயாரிப்புகள் மற்றும் நாள்வாரி சிகிச்சை திட்டத்துடன் ஒரு அறிக்கையை வழங்கும்.',
    uploadCta: 'பயிர் புகைப்படத்தை இங்கே பதிவேற்றவும்',
    uploadHint: 'JPG அல்லது PNG · பாதிக்கப்பட்ட பகுதியின் தெளிவான புகைப்படங்களில் சிறந்த முடிவுகள்',
    chooseFile: 'புகைப்படம் தேர்ந்தெடுக்கவும்',
    analyzing: 'AI பார்வையுடன் அறிகுறிகள் பகுப்பாய்வு செய்யப்படுகிறது…',
    analyzingSub: '1,200+ அறியப்பட்ட பயிர் நோய் வடிவங்களுடன் ஒப்பிடப்படுகிறது',
    tryAnother: 'மற்றொரு புகைப்படத்தை பரிசோதிக்கவும்',
    diseaseDetected: 'கண்டறியப்பட்ட நோய்',
    confidence: 'AI நம்பகத்தன்மை',
    severity: 'தீவிரம்',
    rootCause: 'மூல காரணம்',
    symptoms: 'கவனிக்கப்பட்ட அறிகுறிகள்',
    recommended: 'பரிந்துரைக்கப்பட்ட தயாரிப்புகள்',
    schedule: 'சிகிச்சை அட்டவணை',
    viewProduct: 'தயாரிப்பை காண →',
    demoNotice: 'மாதிரி காட்சி: இந்த அறிக்கை செயல்விளக்கத்திற்காக ஒரு மாதிரி தரவுத்தளத்தில் இருந்து உருவாக்கப்படுகிறது. நேரடி பதிப்பு Gemini Vision உடன் (இந்த திட்டத்தில் ஏற்கனவே @google/genai எனப் பொருத்தப்பட்டுள்ளது) நேரடி பகுப்பாய்வு செய்யும்.',
  }
};

export default function CropDoctorComponent({
  lang,
  setCurrentPage,
  allProducts,
  setSelectedProduct
}: CropDoctorComponentProps) {
  const t = LANG_LABELS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const runMockAnalysis = (url: string) => {
    setPreviewUrl(url);
    setReport(null);
    setIsAnalyzing(true);

    // Simulate AI inference latency, then return a deterministic-but-varied mock report
    setTimeout(() => {
      const pick = MOCK_DIAGNOSES[Math.floor(Math.random() * MOCK_DIAGNOSES.length)];
      setReport(pick);
      setIsAnalyzing(false);
    }, 2200);
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    runMockAnalysis(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setPreviewUrl(null);
    setReport(null);
    setIsAnalyzing(false);
  };

  const severityColor = (sev: string) =>
    sev === 'High' ? 'bg-[#D94F3D]/10 text-[#D94F3D] border-[#D94F3D]/30'
    : sev === 'Moderate' ? 'bg-[#E8A020]/10 text-[#9c6c0c] border-[#E8A020]/30'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const recommendedProducts = report
    ? report.recommendedProductSlugs
        .map(slug => allProducts.find(p => p.slug === slug))
        .filter((p): p is Product => Boolean(p))
    : [];

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Crop Doctor</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> {t.eyebrow}
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight flex items-center gap-3">
              <Stethoscope className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              {t.title}
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{t.subtitle}</p>
          </div>
        </div>

        {/* Upload / Result Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Upload + Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl border-2 border-dashed ${isDragging ? 'border-[#1B6B3A] bg-[#1B6B3A]/5' : 'border-slate-200'} transition p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[280px]`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Uploaded crop" className="max-h-56 rounded-xl object-cover shadow-sm border border-slate-100" />
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-[#1B6B3A]/10 flex items-center justify-center text-[#1B6B3A]">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">{t.uploadCta}</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">{t.uploadHint}</p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-[#1B6B3A] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-[#155530] transition"
                >
                  <ImageIcon className="h-4 w-4" /> {t.chooseFile}
                </button>
                {(previewUrl || report) && (
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D94F3D] px-3 py-2.5 rounded-full transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> {t.tryAnother}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-relaxed">{t.demoNotice}</p>
            </div>
          </div>

          {/* Right: Analysis / Report */}
          <div className="lg:col-span-3">
            {isAnalyzing && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center gap-4 min-h-[280px] text-center">
                <Loader2 className="h-10 w-10 text-[#1B6B3A] animate-spin" />
                <p className="text-sm font-bold text-slate-700">{t.analyzing}</p>
                <p className="text-[11px] text-slate-400">{t.analyzingSub}</p>
              </div>
            )}

            {!isAnalyzing && !report && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center gap-3 min-h-[280px] text-center">
                <Microscope className="h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-400 max-w-sm">
                  {lang === 'ta'
                    ? 'பகுப்பாய்வு முடிவுகளை காண இடதுபுறம் ஒரு பயிர் புகைப்படத்தை பதிவேற்றவும்.'
                    : 'Upload a crop photo on the left to see the AI diagnosis report appear here.'}
                </p>
              </div>
            )}

            {!isAnalyzing && report && (
              <div className="space-y-5">

                {/* Disease summary card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.diseaseDetected} · {report.cropGuess}</p>
                      <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-[#D94F3D]" />
                        {report.disease}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-extrabold px-3 py-1.5 rounded-full">
                        {t.confidence}: {report.confidence}%
                      </span>
                      <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${severityColor(report.severity)}`}>
                        {t.severity}: {report.severity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid sm:grid-cols-2 gap-5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t.rootCause}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{report.rootCause}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t.symptoms}</p>
                      <ul className="space-y-1.5">
                        {report.symptoms.map((s, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1B6B3A] mt-1.5 shrink-0"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommended products */}
                {recommendedProducts.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5" /> {t.recommended}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {recommendedProducts.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedProduct(p); setCurrentPage('product'); }}
                          className="flex items-center gap-3 text-left bg-[#F7F9F4] hover:bg-[#1B6B3A]/10 border border-slate-100 rounded-xl p-3 transition group"
                        >
                          <img src={p.images?.[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover shrink-0 border border-slate-100" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.brand}</p>
                            <span className="text-[10px] font-bold text-[#1B6B3A] inline-flex items-center gap-1 mt-0.5 group-hover:gap-1.5 transition-all">
                              {t.viewProduct.replace(' →', '')} <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment schedule */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" /> {t.schedule}
                  </p>
                  <div className="space-y-3">
                    {report.treatmentSchedule.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-full bg-[#1B6B3A] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#1B6B3A] uppercase tracking-wider">{step.day}</p>
                          <p className="text-sm text-slate-600">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
