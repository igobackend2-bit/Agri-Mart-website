# Real OTP (DLT SMS) on Vercel — 3 steps

Your site shows "Demo OTP" because the SMS backend isn't switched on yet. The code is ready. Because you deploy on **Vercel**, I added a serverless function at **`api/otp.js`** — Vercel runs it automatically and your key stays safe on the server (never in the website).

## Why it still shows the demo code
The website has no way to send SMS by itself (browsers can't, and the key must stay secret). It needs the `api/otp` function + your key set as an Environment Variable. Until then it falls back to the on-screen demo OTP.

## Do this (≈3 minutes)
1. **Push the new files** (`api/otp.js`, `src/otp.ts`) to the GitHub repo Vercel deploys from. (Vercel auto-deploys the `api/` function — nothing else to configure.)

2. **Add the key in Vercel** → your Project → **Settings → Environment Variables** → add:
   | Name | Value |
   |---|---|
   | `SMS_API_KEY` | `jMXeQOXCvv8AO8DrkJU5ZKIrUPBbVeXHbBOglA-La24` |
   | `SMS_API_URL` | *(only if NOT Renflair)* your provider's send URL with `{key} {phone} {otp}` placeholders |

   The default provider is **Renflair** (`https://sms.renflair.in/V1.php?API={key}&PHONE={phone}&OTP={otp}`) — if your key is from Renflair, you don't need `SMS_API_URL` at all. If it's a different service, paste its API URL (from their docs) as `SMS_API_URL`, e.g.:
   - TextLocal: `https://api.textlocal.in/send/?apikey={key}&numbers=91{phone}&sender={sender}&message=Your%20IGO%20OTP%20is%20{otp}`
   - Fast2SMS: `https://www.fast2sms.com/dev/bulkV2?authorization={key}&route=dlt&sender_id={sender}&message={template}&variables_values={otp}&numbers={phone}`
   - (add `SMS_SENDER_ID` / `SMS_DLT_TEMPLATE_ID` too if your URL uses `{sender}` / `{template}`)

3. **Redeploy** (Vercel → Deployments → Redeploy, or just push a commit).

## After that
Enter a mobile number → the screen says **"OTP sent to +91 …"** (no code shown) → the real OTP arrives by SMS → paste it → signed in. ✅

If an SMS ever fails to send, it safely falls back to the demo code so logins never get stuck.

## How it works (so you can trust it)
- Website → `POST /api/otp {action:'send', phone}` → the function generates a 6-digit OTP, sends it via your provider, and returns a **signed token** (never the OTP itself).
- Website → `POST /api/otp {action:'verify', phone, code, token}` → the function checks the code against the token's signature (valid 5 min). No database needed.
- The key is only ever read on the server from `process.env.SMS_API_KEY`.

> Tip: which provider is the key for? If sending doesn't work after step 2, tell me the provider (or paste their API URL) and I'll set `SMS_API_URL` exactly.
