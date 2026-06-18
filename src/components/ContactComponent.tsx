import React, { useState } from 'react';
import { captureLead } from '../leads';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ContactComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
}

export default function ContactComponent({
  lang,
  setCurrentPage
}: ContactComponentProps) {
  
  // Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Feedback states
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) {
      setErrorText('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorText('Please enter your 10-digit mobile number');
      return;
    }
    if (!message.trim()) {
      setErrorText('Please write your request or message');
      return;
    }

    setLoading(true);
    // 1) Save enquiry so it always appears in Admin -> Visitor Leads.
    captureLead({ source: 'Contact Form', name, phone, subject, message });
    // 2) Email it to igobackend3@gmail.com via Web3Forms (free relay).
    //    Web3Forms always delivers to the email that the access key is registered
    //    to — so this key MUST be the one created at web3forms.com for
    //    igobackend3@gmail.com. Paste that key below (Web3Forms keys are safe to
    //    keep in frontend code), or set it in Vercel env as VITE_WEB3FORMS_KEY.
    const HARDCODED_WEB3FORMS_KEY = ''; // ← paste igobackend3@gmail.com Web3Forms key here
    const WEB3FORMS_KEY = HARDCODED_WEB3FORMS_KEY || (import.meta as any).env?.VITE_WEB3FORMS_KEY || '';
    if (WEB3FORMS_KEY) {
      try {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: 'IGO Agri Mart enquiry: ' + (subject || 'New message'),
            from_name: 'IGO Agri Mart Website',
            name, phone, message,
            // Delivered to igobackend3@gmail.com (the email the access key is registered to).
            body: `Name: ${name}\nPhone: ${phone}\nSubject: ${subject}\n\n${message}`,
          }),
        }).catch(() => { /* lead is already saved in admin */ });
      } catch { /* ignore */ }
    }
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 600);
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb line */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Contact Agri Helplines</span>
        </nav>

        {/* Outer Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Direct Contact Card dials */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div>
                <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">
                  PAN India Desk
                </span>
                <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2 tracking-tight">
                  Reach Out Instantly
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Have inquiries on seed variants or fertilizer subsidies? Dial our Chennai Kovalan Street hotline.
                </p>
              </div>

              {/* Quick Triggers */}
              <div className="space-y-4">
                
                {/* Dial trigger */}
                <a 
                  href="tel:7397785803"
                  className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-[#1B6B3A]/5 border border-slate-100 rounded-xl transition group duration-350"
                >
                  <div className="h-10 w-10 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded-lg flex items-center justify-center shrink-0 font-bold group-hover:bg-[#1B6B3A]/20 transition">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wider">
                      Hotline Phone Call
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      7397785803
                    </span>
                  </div>
                </a>

                {/* WhatsApp Chat trigger */}
                <a 
                  href="https://wa.me/917397785803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#25D366]/5 hover:bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl transition group duration-350"
                  referrerPolicy="no-referrer"
                >
                  <div className="h-10 w-10 bg-[#25D366]/20 text-[#25D366] rounded-lg flex items-center justify-center shrink-0 font-bold group-hover:bg-[#25D366]/30 transition">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-extrabold text-[#25D366] block tracking-wider">
                      WhatsApp Chat Direct
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      +91-7397785803
                    </span>
                  </div>
                </a>

                {/* Email Desk */}
                <a 
                  href="mailto:br.admin@igogroups.com"
                  className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-[#1B6B3A]/5 border border-slate-100 rounded-xl transition group duration-350"
                >
                  <div className="h-10 w-10 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded-lg flex items-center justify-center shrink-0 font-bold group-hover:bg-[#1B6B3A]/20 transition">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wider">
                      Executive Support email
                    </span>
                    <span className="text-sm font-bold text-slate-800 break-all leading-tight">
                      br.admin@igogroups.com
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="h-10 w-10 bg-amber-100 text-[#E8A020] rounded-lg flex items-center justify-center shrink-0 font-bold">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-xs text-slate-650 leading-relaxed font-medium">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wider">
                      Corporate Headquarter
                    </span>
                    <strong>IGO Agri Market Office</strong><br />
                    No. 17 Kovalan Street, Uthandi, Kanathur, Chennai 600119, Tamil Nadu.
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              {isSent ? (
                <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
                  <div className="h-14 w-14 bg-emerald-100 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-display font-extrabold text-slate-900 text-xl tracking-tight">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Thank you for writing, <strong>{name}</strong>! Your technical farm support request is synchronized. A specialized crop consultant based in our Chennai headquarters will address your guidelines via phone <strong>{phone}</strong> soon.
                  </p>
                  
                  <button 
                    onClick={() => { setIsSent(false); setMessage(''); setSubject(''); }}
                    className="bg-[#1B6B3A] hover:bg-[#134D29] text-white text-xs font-bold py-2.5 px-6 rounded-lg transition"
                  >
                    Submit New Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Send Secure Online Message
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Need custom seed orders, structural greenhouse designs or loan subvention files? Fill out your parameters.
                    </p>
                  </div>

                  {errorText && (
                    <div className="p-3 bg-red-50 text-red-650 rounded-lg text-xs font-semibold">
                      {errorText}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={name}
                      placeholder="e.g. Anandha Selvam"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Mobile Phone
                    </label>
                    <input 
                      type="tel"
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={phone}
                      placeholder="e.g. 7397785803"
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={subject}
                      placeholder="e.g. Subsidy eligibility query for Drip Systems"
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message Requirements
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={message}
                      placeholder="Write your agricultural requirements here..."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1B6B3A] hover:bg-[#15532d] disabled:bg-slate-300 text-white font-bold text-xs py-3 rounded-xl shadow-md border border-[#248F4E] transition shrink-0"
                  >
                    {loading ? 'Transmitting request...' : 'Secure Submit Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
