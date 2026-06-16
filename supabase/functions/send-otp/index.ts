// ─────────────────────────────────────────────────────────────────────────────
// Supabase Edge Function: send-otp
//
// Sends + verifies SMS OTPs. The SMS/DLT API key lives ONLY here (as a Supabase
// secret), never in the website. The frontend (src/otp.ts) calls this function.
//
// Deploy:
//   supabase functions deploy send-otp --no-verify-jwt
//   supabase secrets set SMS_API_KEY="jMXeQOXCvv8AO8DrkJU5ZKIrUPBbVeXHbBOglA-La24"
//   supabase secrets set SMS_SENDER_ID="IGOAGR"        # your DLT-approved 6-char sender id
//   supabase secrets set SMS_DLT_TEMPLATE_ID="1234567890123456789"  # your DLT template id
//
// Also run the SQL at the bottom of this file once (creates the `otps` table).
// Then in the website .env:  VITE_OTP_API=https://<project-ref>.functions.supabase.co/send-otp
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // server-side only — safe inside the function
);

// ── Send the SMS. Works with ANY provider. ───────────────────────────────────
// Easiest: set SMS_API_URL to your provider's endpoint, using these placeholders:
//   {key} {phone} {otp} {sender} {template} {message}
// Examples:
//   TextLocal: https://api.textlocal.in/send/?apikey={key}&numbers=91{phone}&sender={sender}&message=Your%20IGO%20OTP%20is%20{otp}
//   Fast2SMS : https://www.fast2sms.com/dev/bulkV2?authorization={key}&route=dlt&sender_id={sender}&message={template}&variables_values={otp}&numbers={phone}
//   MSG91    : https://control.msg91.com/api/v5/otp?template_id={template}&mobile=91{phone}&authkey={key}&otp={otp}
async function sendSms(phone: string, otp: string): Promise<boolean> {
  const KEY = Deno.env.get('SMS_API_KEY') || '';
  const SENDER = Deno.env.get('SMS_SENDER_ID') || 'IGOAGR';
  const TEMPLATE = Deno.env.get('SMS_DLT_TEMPLATE_ID') || '';
  const MESSAGE = `Your IGO Agri Mart OTP is ${otp}. Valid for 5 minutes.`;
  const URL_TMPL = Deno.env.get('SMS_API_URL') || '';
  const METHOD = (Deno.env.get('SMS_API_METHOD') || 'GET').toUpperCase();

  const fill = (s: string) => s
    .replaceAll('{key}', encodeURIComponent(KEY))
    .replaceAll('{phone}', encodeURIComponent(phone))
    .replaceAll('{otp}', encodeURIComponent(otp))
    .replaceAll('{sender}', encodeURIComponent(SENDER))
    .replaceAll('{template}', encodeURIComponent(TEMPLATE))
    .replaceAll('{message}', encodeURIComponent(MESSAGE));

  if (URL_TMPL) {
    try {
      const url = fill(URL_TMPL);
      const r = METHOD === 'POST'
        ? await fetch(url.split('?')[0], { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: url.split('?')[1] || '' })
        : await fetch(url, { headers: { 'cache-control': 'no-cache' } });
      const txt = await r.text();
      // Most providers return 200 + a success body; treat HTTP 2xx as sent.
      return r.ok && !/error|fail|invalid/i.test(txt);
    } catch (_) { return false; }
  }

  // Fallback preset: Fast2SMS DLT route
  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${KEY}&route=dlt&sender_id=${SENDER}&message=${TEMPLATE}&variables_values=${otp}&numbers=${phone}&flash=0`;
    const r = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
    const j = await r.json().catch(() => ({}));
    return j.return === true;
  } catch (_) { return false; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { action, phone, code } = await req.json();
    const clean = String(phone || '').replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) return json({ error: 'invalid phone' }, 400);

    if (action === 'send') {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min
      await supabase.from('otps').upsert({ phone: clean, code: otp, expires_at: expires }, { onConflict: 'phone' });
      const sent = await sendSms(clean, otp);
      return json({ sent });
    }

    if (action === 'verify') {
      const { data } = await supabase.from('otps').select('code, expires_at').eq('phone', clean).maybeSingle();
      const valid = !!data && data.code === String(code) && new Date(data.expires_at) > new Date();
      if (valid) await supabase.from('otps').delete().eq('phone', clean);
      return json({ valid });
    }

    return json({ error: 'unknown action' }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

/* ── Run this SQL once in Supabase (SQL Editor) ──
create table if not exists public.otps (
  phone       text primary key,
  code        text not null,
  expires_at  timestamptz not null
);
alter table public.otps enable row level security;
-- no anon policies: only the Edge Function (service_role) touches this table.
*/
