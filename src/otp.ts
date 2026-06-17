// ─────────────────────────────────────────────────────────────────────────────
// OTP send/verify.
//
// Calls the backend serverless function at /api/otp (deployed automatically on
// Vercel — see api/otp.js). The SMS/DLT key lives only in the Vercel env var, not
// in this bundle. If the backend is unreachable OR the SMS provider doesn't
// confirm delivery, we fall back to an on-screen DEMO OTP so login always works.
// ─────────────────────────────────────────────────────────────────────────────

const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const OTP_API = (import.meta as any).env?.VITE_OTP_API || (isLocal ? 'https://igoagri-mart-website.vercel.app/api/otp' : '/api/otp');

/** Request an OTP for a phone. Returns whether a real SMS was sent or a demo code. */
export async function requestOtp(phone: string): Promise<{ mode: 'sms' | 'demo'; demoCode?: string }> {
  try {
    const r = await fetch(OTP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send', phone }),
    });
    if (r.ok) {
      const j = await r.json().catch(() => ({} as any));
      if (j.sent && j.token) {
        try {
          sessionStorage.setItem('igo_otp_token_' + phone, j.token);
          sessionStorage.removeItem('igo_otp_' + phone);
        } catch { /* ignore */ }
        return { mode: 'sms' };
      }
    }
  } catch {
    throw new Error('Network error — could not reach the OTP service. Please check your connection and try again.');
  }

  // Real SMS only — NO demo fallback. If the provider didn't confirm delivery,
  // surface an error so the customer can retry (we never show a code on screen).
  throw new Error('Could not send the OTP right now. Please try again in a moment.');
}

/** Verify an entered OTP. */
export async function confirmOtp(phone: string, code: string): Promise<boolean> {
  let token = '';
  try { token = sessionStorage.getItem('igo_otp_token_' + phone) || ''; } catch { /* ignore */ }

  if (token) {
    try {
      const r = await fetch(OTP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, code, token }),
      });
      if (r.ok) {
        const j = await r.json().catch(() => ({} as any));
        return !!j.valid;
      }
    } catch { /* fall through to demo check */ }
  }

  let stored = '';
  try { stored = sessionStorage.getItem('igo_otp_' + phone) || ''; } catch { /* ignore */ }
  return stored !== '' && stored === code;
}
