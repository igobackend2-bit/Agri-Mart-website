// ─────────────────────────────────────────────────────────────────────────────
// OTP send/verify.
//
// SECURITY: SMS provider / DLT keys must NEVER live in the browser. They belong
// in a backend. This module calls a backend endpoint (a Supabase Edge Function —
// see supabase/functions/send-otp/index.ts) which holds the key and sends the SMS.
//
// Set the endpoint in a .env file:  VITE_OTP_API=https://<project>.functions.supabase.co/send-otp
//
// If no endpoint is configured (or it fails), we fall back to an on-screen DEMO
// OTP so testing always works.
// ─────────────────────────────────────────────────────────────────────────────

const OTP_API = (import.meta as any).env?.VITE_OTP_API || '';

/** Request an OTP for a phone. Returns whether a real SMS was sent or a demo code. */
export async function requestOtp(phone: string): Promise<{ mode: 'sms' | 'demo'; demoCode?: string }> {
  if (OTP_API) {
    try {
      const r = await fetch(OTP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone }),
      });
      if (r.ok) return { mode: 'sms' };
    } catch { /* fall through to demo */ }
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  try { sessionStorage.setItem('igo_otp_' + phone, code); } catch { /* ignore */ }
  return { mode: 'demo', demoCode: code };
}

/** Verify an entered OTP. */
export async function confirmOtp(phone: string, code: string): Promise<boolean> {
  if (OTP_API) {
    try {
      const r = await fetch(OTP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, code }),
      });
      if (r.ok) {
        const j = await r.json().catch(() => ({}));
        return !!j.valid;
      }
    } catch { /* fall through to demo */ }
  }
  let stored = '';
  try { stored = sessionStorage.getItem('igo_otp_' + phone) || ''; } catch { /* ignore */ }
  return stored !== '' && stored === code;
}
