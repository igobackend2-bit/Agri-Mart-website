# IGO Agri Mart — Supabase Connection Guide

Your website and admin panel now store **orders, profiles, reviews and service leads** in Supabase.
Project URL: `https://elkylzsyrktltvrftjgt.supabase.co`

## 🔴 Security first (do this now)
1. **You pasted your keys in chat — regenerate them.** Supabase → **Settings → API → Reset/Roll** the keys (at minimum the `service_role`).
2. **Never put the `service_role` key in the website/admin code.** It bypasses all security. The app only uses the **anon** key (in `src/supabase.ts`), which is the correct public key for a frontend.

## Step 1 — Create the tables
1. Open your project → **SQL Editor → New query**.
2. Paste the contents of **`supabase_schema.sql`** (in this folder) and click **Run**.
3. This creates `profiles`, `orders`, `reviews`, `service_leads` (+ optional `products`) and enables RLS with permissive **demo** policies.

## Step 2 — Install + run
```bash
npm install          # installs @supabase/supabase-js (already in package.json)
npm run dev          # or START_DEV.bat
```
The app reads the URL/anon key from `src/supabase.ts` (or from a `.env` if you add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

## Step 3 — Test it end to end
1. **Sign up / login** (phone OTP) → a row appears in **Table Editor → profiles**.
   - Keep **Anonymous** sign-in enabled in **Firebase Console → Authentication** — it provides the user id (`uid`) that links every Supabase row. (Auth identity stays on Firebase for now; all *data* is in Supabase.)
2. **Place an order** → a row appears in **orders** (and in the customer's *My Orders*).
3. **Open `/admin`** → the order shows in the admin Orders tab; change its status → the `orders` row updates and the customer's notification bell updates.
4. **Submit a service enquiry** → a row appears in **service_leads**.

## What is connected
| Feature | Where it's stored |
|---|---|
| User profiles (name, email, address, wishlist) | Supabase `profiles` |
| Orders + status | Supabase `orders` |
| Product reviews | Supabase `reviews` |
| Service/booking leads | Supabase `service_leads` |
| Product catalog (1000+ items) | In the app code (fast, bundled) |
| Login identity (uid) | Firebase anonymous (swap to Supabase Auth later) |

All of this routes through **`src/dbHelper.ts`** → **`src/supabase.ts`**. Nothing else in the UI changed.

## Going to production (later)
- Move login to **`supabase.auth.signInAnonymously()`** (or real phone/email auth) so requests carry a Supabase JWT.
- Replace the demo RLS policies in `supabase_schema.sql` with owner-scoped ones (`user_id = auth.uid()`) and an admin policy — the SQL file's bottom section shows exactly how.
- Optionally migrate the product catalog into the `products` table and an image **Storage bucket**, then point product images there.
