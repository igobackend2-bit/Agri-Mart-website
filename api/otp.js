// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function: /api/otp
//
// Sends + verifies SMS OTPs. Runs on Vercel automatically (any file in /api
// becomes a serverless function). The SMS/DLT key stays in a Vercel Environment
// Variable — never in the website bundle. The frontend (src/otp.ts) calls /api/otp.
//
// Provider: APITxT (apitxt.com) — OTP route. Works with just the API key.
//
// SET THIS in Vercel → Project → Settings → Environment Variables, then redeploy:
//   SMS_API_KEY    = your APITxT Auth Key   (REQUIRED — keep it ONLY here, never in code)
//
// OPTIONAL (only if APITxT asks for DLT details on your account):
//   SMS_SENDER_ID  = your approved sender/header
//   SMS_DLT_PE_ID  = your DLT Entity (PE) ID
//   SMS_DLT_TEMPLATE_ID = your DLT template ID
//   SMS_MESSAGE    = the OTP text (must contain {otp}); default below
//   SMS_API_URL    = override the whole send URL. Placeholders: {key} {phone} {otp} {message} {sender} {pe_id} {template}
//   OTP_SECRET     = any random string used to sign OTP tokens.
// ─────────────────────────────────────────────────────────────────────────────
import crypto from 'node:crypto';

const KEY = process.env.SMS_API_KEY || '';
const SECRET = process.env.OTP_SECRET || KEY || 'igo-otp-secret-change-me';
const SENDER = process.env.SMS_SENDER_ID || '';
const MSG_TMPL = process.env.SMS_MESSAGE || 'Your IGO Agri Mart OTP is {otp}. Valid 5 minutes. Do not share it with anyone.';
// APITxT Send-OTP endpoint. mobile must include country code (91). We pass our own
// {otp} so the code we generate (and verify) is exactly what the customer receives.
// If DLT details are set, they are appended automatically below.
const BASE_URL = process.env.SMS_API_URL || 'https://apitxt.com/api/sendOTP?authkey={key}&mobile=91{phone}&otp={otp}&message={message}';
const PE_ID = process.env.SMS_DLT_PE_ID || '';
const TEMPLATE_ID = process.env.SMS_DLT_TEMPLATE_ID || '';
const URL_TMPL = BASE_URL
  + (SENDER ? '&sender={sender}' : '')
  + (PE_ID ? `&pe_id=${encodeURIComponent(PE_ID)}` : '')
  + (TEMPLATE_ID ? `&template_id=${encodeURIComponent(TEMPLATE_ID)}` : '');

function sign(phone, otp, exp) {
  return crypto.createHmac('sha256', SECRET).update(`${phone}.${otp}.${exp}`).digest('hex');
}

async function sendSms(phone, otp) {
  const message = MSG_TMPL.split('{otp}').join(otp);
  const url = URL_TMPL
    .split('{key}').join(encodeURIComponent(KEY))
    .split('{phone}').join(encodeURIComponent(phone))
    .split('{sender}').join(encodeURIComponent(SENDER))
    .split('{message}').join(encodeURIComponent(message))
    .split('{otp}').join(encodeURIComponent(otp))
    .split('{template}').join(encodeURIComponent(process.env.SMS_DLT_TEMPLATE_ID || ''));
  try {
    const r = await fetch(url);
    const t = await r.text();
    const ok = r.ok && !/error|fail|invalid|unauthor/i.test(t);
    // Visible in Vercel → Deployments → your deployment → Functions/Logs.
    console.log('[otp] sms provider', url.split('?')[0], 'status', r.status, 'ok', ok, 'body', t.slice(0, 300));
    return { ok, status: r.status, body: t.slice(0, 300) };
  } catch (e) {
    console.log('[otp] sms send error', String(e));
    return { ok: false, status: 0, body: String(e) };
  }
}

export default async function handler(req, res) {
  // Allow localhost to call this live API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET = health/diagnostic check (open /api/otp in a browser). Never exposes the key.
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      function: 'live',
      keySet: !!KEY,
      senderSet: !!process.env.SMS_SENDER_ID,
      sender: SENDER,
      provider: URL_TMPL.split('?')[0],
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { action, phone, code, token } = body;
  const clean = String(phone || '').replace(/\D/g, '').slice(-10);
  if (clean.length !== 10) return res.status(400).json({ error: 'invalid phone' });

  if (action === 'send') {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const exp = Date.now() + 5 * 60 * 1000; // valid 5 minutes
    const sig = sign(clean, otp, exp);
    const r = await sendSms(clean, otp);
    // Stateless: return a signed token (NOT the OTP). Verify recomputes the signature.
    // `debug` only shows when you POST directly (the website ignores it) — helps diagnose providers.
    return res.status(200).json({ sent: r.ok, token: `${exp}.${sig}`, debug: { status: r.status, body: r.body } });
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
