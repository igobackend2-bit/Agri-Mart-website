import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  Info, 
  IndianRupee 
} from 'lucide-react';
import { Service, ServiceLead } from '../types';
import { placeServiceLead } from '../dbHelper';

interface ServicesDetailComponentProps {
  lang: 'en' | 'ta';
  selectedService: Service | null;
  setCurrentPage: (p: any) => void;
  userProfile: any;
}

const TN_DISTRICTS = [
  'Chennai',
  'Chengalpattu',
  'Kanchipuram',
  'Thiruvallur',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Thanjavur',
  'Cuddalore',
  'Vellore',
  'Erode',
  'Tirunelveli',
  'Tuticorin'
];

export default function ServicesDetailComponent({
  lang,
  selectedService,
  setCurrentPage,
  userProfile
}: ServicesDetailComponentProps) {
  
  if (!selectedService) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500 text-sm">No service selected.</p>
        <button 
          onClick={() => setCurrentPage('services')}
          className="mt-4 text-[#1B6B3A] font-bold"
        >
          Back to Services
        </button>
      </div>
    );
  }

  // Booking Form State
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [district, setDistrict] = useState(TN_DISTRICTS[0]);
  const [date, setDate] = useState('');
  const [acres, setAcres] = useState(1);
  const [cropType, setCropType] = useState('Paddy');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract base rate from priceQuote to calculate estimated dynamic quotation
  const getParsedRate = () => {
    // Check if drone spray: From ¥650 / Acre
    if (selectedService.id === 'srv-03') return 650;
    // Soil Analysis: ¥450 / Sample
    if (selectedService.id === 'srv-01') return 450;
    // Fertigation audit: ¥1,200 / Inspection
    if (selectedService.id === 'srv-07') return 1200;
    // Legal consulting: ¥1,500 Consultation
    if (selectedService.id === 'srv-11') return 1500;
    return 0; // Default flat fallback
  };

  const parsedRate = getParsedRate();
  const calculatedEstimate = parsedRate > 0 ? parsedRate * acres : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    if (!date) {
      setErrorMsg('Please select a preferred inspection date');
      return;
    }

    setIsSubmitting(true);
    try {
      const leadId = `lead-${Date.now()}`;
      const newLead: ServiceLead = {
        id: leadId,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        userName: name,
        userPhone: phone,
        userEmail: email,
        district,
        date,
        acres: Number(acres),
        cropType,
        additionalNotes,
        createdAt: new Date().toISOString(),
        status: 'Pending'
      };

      await placeServiceLead(newLead);
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit service lead request:', err);
      setErrorMsg('Submission failed. Please check your network and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back navigation */}
        <button 
          onClick={() => setCurrentPage('services')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1B6B3A] text-xs font-bold mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Expert Services</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="h-72 relative bg-slate-100">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-[#E8A020] text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                    {selectedService.provider}
                  </span>
                  <h2 className="text-white font-display font-extrabold text-2xl sm:text-3xl mt-2 tracking-tight">
                    {selectedService.name}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Service Specifications
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedService.description}
                </p>

                {/* Features Checklist */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Key Benefits & Offerings:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedService.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle className="h-4.5 w-4.5 text-[#1B6B3A] shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-normal font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Standard Info Cards */}
            <div className="bg-[#1B6B3A]/5 border border-[#1B6B3A]/10 rounded-2xl p-5 flex gap-4">
              <Info className="h-5 w-5 text-[#1B6B3A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#1B6B3A] uppercase tracking-wide">
                  IGO Standard Operating Procedure (SOP)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Our Chennai agronomy officers monitor diagnostic test criteria using verified ISO machinery. Drone schedules are coordinate matching regional aviation permits in Chengalpattu under certified pilots.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-5">
            <div id="booking-card" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              {submitSuccess ? (
                <div className="text-center py-8 px-4 space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-display font-extrabold text-slate-900 text-xl tracking-tight">
                    Booking Inquiry Received!
                  </h3>
                  <p className="text-xs text-slate-650 leading-relaxed max-w-sm mx-auto">
                    Excellent choice, <strong>{name}</strong>! Your scheduling lead ticket is locked successfully in our database. Our Chennai district executive officer will contact you within 24 hours via phone <strong>{phone}</strong> to confirm scheduling.
                  </p>
                  
                  <div className="bg-[#F7F9F4] p-4 rounded-xl text-[11px] text-slate-500 font-mono text-left space-y-1">
                    <div>• SERVICE: {selectedService.name}</div>
                    <div>• CROPS: {cropType} • LAND: {acres} Acres</div>
                    <div>• INQUIRY PHONE: 7397785803</div>
                    <div>• HEADQUARTERS: Kanathur, Chennai 600119</div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setCurrentPage('services')}
                      className="bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold py-2 px-4 rounded-lg transition"
                    >
                      Book Another Service
                    </button>
                    <button 
                      onClick={() => setCurrentPage('home')}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Return to Storefront Home
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Request Expert On-Site Booking
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below. Zero deposit required — pay on-site post audit.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Farmer Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anandha Selvam"
                        className="w-full bg-[#F7F9F4] text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 7397785803"
                        className="w-full bg-[#F7F9F4] text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      />
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. farmer@igogroups.com"
                        className="w-full bg-[#F7F9F4] text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      />
                    </div>
                  </div>

                  {/* Grid Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Select District */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        District (TN)
                      </label>
                      <select 
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#F7F9F4] text-xs px-3 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      >
                        {TN_DISTRICTS.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Inspection Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#E8A020]" />
                        <span>Date</span>
                      </label>
                      <input 
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#F7F9F4] text-xs px-3 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      />
                    </div>
                  </div>

                  {/* Crop details */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Land Area */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {selectedService.id === 'srv-01' ? 'Samples to Draw' : 'Land Size (Acres)'}
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="100"
                        value={acres}
                        onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-[#F7F9F4] text-xs px-3 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                      />
                    </div>

                    {/* Crop Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Target Crop Type
                      </label>
                      <input 
                        type="text"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        placeholder="e.g. Paddy, Tomato, Mango"
                        className="w-full bg-[#F7F9F4] text-xs px-3 py-2 rounded-lg border border-slate-250 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculated Estimate Box */}
                  {calculatedEstimate && (
                    <div className="p-3.5 bg-yellow-50 border border-yellow-250/50 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Dynamic Est. Quote:</span>
                        <span className="font-extrabold text-[#1B6B3A] flex items-center gap-0.5">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>₹{calculatedEstimate.toLocaleString('en-IN')}</span>
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                        Based on {acres} × {selectedService.priceQuote} flat standard rate. Includes travel to {district} district.
                      </div>
                    </div>
                  )}

                  {/* Additional notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Additional Requirements / Notes
                    </label>
                    <textarea 
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Soil is highly alkaline, or Drone flight scheduled next Friday morning preferred."
                      className="w-full bg-[#F7F9F4] text-xs px-3 py-2 rounded-lg border border-slate-250 focus:outline-none focus:border-[#1B6B3A]"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1B6B3A] hover:bg-[#15532d] disabled:bg-slate-300 text-white text-xs font-bold py-3 rounded-xl shadow-md border border-[#248F4E] transition shrink-0"
                  >
                    {isSubmitting ? 'Syncing securely...' : 'Submit Service Booking Inquiry Now'}
                  </button>
                  
                  <div className="text-[9px] text-slate-400 font-medium text-center leading-relaxed">
                    Protected by SSL security protocol. We verify and respond according to our Kanathur head office customer service standards.
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
