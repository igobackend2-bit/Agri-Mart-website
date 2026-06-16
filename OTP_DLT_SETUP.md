# Real OTP (DLT SMS) — Setup

The website is now **backend-ready** for real OTP. Right now it shows the OTP on screen (demo). To send real SMS, deploy the included Supabase Edge Function — your SMS/DLT key stays safely on the server, never in the website.

## ⚠️ Important
- Your DLT/SMS key must **never** be in the website code. It lives only in the Edge Function as a Supabase secret. (You pasted the key in chat — consider regenerating it.)
- Browsers can't call SMS providers directly (CORS), which is why a backend is required.

## Steps
1. **Create the OTP table** — Supabase → SQL Editor → run:
   ```sql
   create table if not exists public.otps (
     phone text primary key, code text not null, expires_at timestamptz not null
   );
   alter table public.otps enable row level security;
   ```
2. **Deploy the function** (file already in `supabase/functions/send-otp/`):
   ```bash
   supabase functions deploy send-otp --no-verify-jwt
   ```
3. **Set your secrets.** Works with ANY provider — just paste your provider's API
   URL using the placeholders `{key} {phone} {otp} {sender} {template} {message}`:
   ```bash
   supabase secrets set SMS_API_KEY="jMXeQOXCvv8AO8DrkJU5ZKIrUPBbVeXHbBOglA-La24"
   supabase secrets set SMS_SENDER_ID="IGOAGR"          # your DLT sender id
   supabase secrets set SMS_DLT_TEMPLATE_ID="<template id>"
   # Paste YOUR provider's send-SMS URL (example shown is TextLocal):
   supabase secrets set SMS_API_URL="https://api.textlocal.in/send/?apikey={key}&numbers=91{phone}&sender={sender}&message=Your%20IGO%20OTP%20is%20{otp}"
   ```
   (Find your provider's exact API URL in their docs and paste it — the function
   substitutes the placeholders and sends. POST APIs: also `supabase secrets set SMS_API_METHOD=POST`.)
4. **Point the website at it** — create/edit `.env` in the project root:
   ```
   VITE_OTP_API=https://<your-project-ref>.functions.supabase.co/send-otp
   ```
   Restart `npm run dev`.

## What I still need from you to finish the SMS part
The function defaults to **Fast2SMS** (India). To make the SMS actually send, tell me:
1. **Which SMS provider** you registered the DLT with (Fast2SMS / MSG91 / Gupshup / Twilio…).
2. Your **DLT-approved Sender ID** (6 letters).
3. Your **DLT Template ID** and the **approved message text** (e.g. "Your IGO Agri Mart OTP is {#var#}. Valid 5 min.").

With those I'll finalize the `sendSms()` call in the function for your exact provider.

## Until then
Login still works for you and customers via the **on-screen demo OTP** and the **⚡ Developer Test Login** button — no SMS needed.
