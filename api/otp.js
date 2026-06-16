// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function: /api/otp
//
// Sends + verifies SMS OTPs. Runs on Vercel automatically (any file in /api
// becomes a serverless function). The SMS/DLT key stays in a Vercel Environment
// Variable — never in the website bundle. The frontend (src/otp.ts) calls /api/otp.
//
// SET THESE in Vercel → Project → Settings → Environment Variables, then redeploy:
//   SMS_API_KEY  = jMXeQOXCvv8AO8DrkJU5ZKIrUPBbVeXHbBOglA-La24
//   SMS_API_URL  = (optional) your provider's send URL with {key} {phone} {otp} placeholders.
//                  Default below is Renflair (key-only OTP API). For another provider,
//                  paste its URL, e.g. TextLocal:
//                  https://api.textlocal.in/send/?apikey={key}&numbers=91{phone}&sender={sender}&message=Your%20IGO%20OTP%20is%20{otp}
//   SMS_SENDER_ID, SMS_DLT_TEMPLATE_ID = (only if your provider's URL needs {sender}/{template})
//   OTP_SECRET   = (optional) any random string used to sign OTP tokens.
// ─────────────────────────────────────────────────────────────────────────────
import crypto from 'node:crypto';

const KEY = process.env.SMS_API_KEY || '';
const SECRET = process.env.OTP_SECRET || KEY || 'igo-otp-secret-change-me';
const URL_TMPL = process.env.SMS_API_URL || 'https://sms.renflair.in/V1.php?API={key}&PHONE={phone}&OTP={otp}';

function sign(phone, otp, exp) {
  return crypto.createHmac('sha256', SECRET).update(`${phone}.${otp}.${exp}`).digest('hex');
}

async function sendSms(phone, otp) {
  const url = URL_TMPL
    .split('{key}').join(encodeURIComponent(KEY))
    .split('{phone}').join(encodeURIComponent(phone))
    .split('{otp}').join(encodeURIComponent(otp))
    .split('{sender}').join(encodeURIComponent(process.env.SMS_SENDER_ID || ''))
    .split('{template}').join(encodeURIComponent(process.env.SMS_DLT_TEMPLATE_ID || ''));
  try {
    const r = await fetch(url);
    const t = await r.text();
    return r.ok && !/error|fail|invalid|unauthor/i.test(t);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { action, phone, code, token } = body;
  const clean = String(phone || '').replace(/\D/g, '').slice(-10);
  if (clean.length !== 10) return res.status(400).json({ error: 'invalid phone' });

  if (action === 'send') {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const exp = Date.now() + 5 * 60 * 1000; // valid 5 minutes
    const sig = sign(clean, otp, exp);
    const sent = await sendSms(clean, otp);
    // Stateless: return a signed token (NOT the OTP). Verify recomputes the signature.
    return res.status(200).json({ sent, token: `${exp}.${sig}` });
  }

  if (action === 'verify') {
    if (!token || code == null) return res.status(200).json({ valid: false });
    const [expStr, sig] = String(token).split('.');
    const exp = Number(expStr);
    if (!exp || Date.now() > exp) return res.status(200).json({ valid: false });
    const valid = sign(clean, String(code), exp) === sig;
    return res.status(200).json({ valid });
  }

  return res.status(400).json({ error: 'unknown action' });
}
