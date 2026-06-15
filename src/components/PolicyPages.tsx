import { ArrowLeft, ShieldCheck, FileText, RotateCcw } from 'lucide-react';
import { getSettings } from '../siteConfig';

interface PolicyPagesProps {
  page: 'privacy' | 'terms' | 'returns';
  setCurrentPage: (p: string) => void;
}

// Legal/policy pages — required before enabling online payments.
// Plain, editable templates. Have your legal advisor review before launch.
export default function PolicyPages({ page, setCurrentPage }: PolicyPagesProps) {
  const s = getSettings();
  const updated = 'June 2026';

  const content = {
    privacy: {
      icon: ShieldCheck,
      title: 'Privacy Policy',
      sections: [
        ['Information we collect', `We collect your name, phone number, email, delivery address and order history to fulfil your orders and improve ${s.storeName}. Payment details are handled by our payment partner and are never stored on our servers.`],
        ['How we use it', 'To process and deliver orders, send order updates (SMS/WhatsApp/email/in-app), provide support, prevent fraud, and—if you opt in—share relevant offers and farming advisory.'],
        ['Sharing', 'We share only what is necessary with delivery/courier partners and our payment gateway. We do not sell your personal data to advertisers.'],
        ['Your choices', 'You may view and edit your profile and addresses, request deletion of your account, and opt out of marketing messages at any time.'],
        ['Security', 'We use industry-standard safeguards. No method of transmission is 100% secure, but we work continuously to protect your data.'],
        ['Contact', `Questions? Email ${s.email} or call ${s.phone}.`],
      ],
    },
    terms: {
      icon: FileText,
      title: 'Terms & Conditions',
      sections: [
        ['Acceptance', `By using ${s.storeName}, you agree to these terms. If you do not agree, please do not use the platform.`],
        ['Orders & pricing', 'All prices are in INR and inclusive of applicable taxes unless stated otherwise. We may correct pricing errors and cancel affected orders with a full refund.'],
        ['Product information', 'Agri-inputs must be used strictly as per the label and local regulations. We are not liable for misuse. Crop outcomes depend on many factors beyond our control.'],
        ['Payments', 'Payments are processed by our payment partner. Cash on Delivery may require a partial advance for high-value orders.'],
        ['Cancellation', 'You may cancel before dispatch from My Orders. Once dispatched, the return policy applies.'],
        ['Liability', `${s.storeName}'s liability is limited to the value of the product purchased.`],
        ['Contact', `For any dispute, contact ${s.email} first so we can resolve it quickly.`],
      ],
    },
    returns: {
      icon: RotateCcw,
      title: 'Return, Refund & Replacement Policy',
      sections: [
        ['Eligibility', 'Damaged, defective, expired or wrong items are eligible for replacement or refund. Report within 48 hours of delivery with photos.'],
        ['Perishables', 'Fresh produce and live plants: report quality issues within 24 hours of delivery; we replace or refund verified cases.'],
        ['Non-returnable', 'Opened seed packs, chemicals/pesticides once opened, and clearance items are non-returnable for safety and regulatory reasons (unless damaged on arrival).'],
        ['How to request', 'Go to My Orders → open the order → contact support, or email us with your order ID and photos.'],
        ['Refund timeline', 'Approved refunds are processed to the original payment method within 3–5 business days. COD refunds go to your bank/UPI on file.'],
        ['Contact', `Need help? Email ${s.email} or call ${s.phone}.`],
      ],
    },
  }[page];

  const Icon = content.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => setCurrentPage('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1B6B3A] transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to store
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#1B6B3A]" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">{content.title}</h1>
          <p className="text-xs text-slate-400 font-medium">Last updated: {updated} · {s.storeName}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {content.sections.map(([heading, body], i) => (
          <div key={i}>
            <h2 className="font-black text-sm text-slate-800 mb-1.5">{i + 1}. {heading}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium">
        This is a starter template. Please have it reviewed by a legal professional and tailored to your business before going live with online payments.
      </div>
    </div>
  );
}
