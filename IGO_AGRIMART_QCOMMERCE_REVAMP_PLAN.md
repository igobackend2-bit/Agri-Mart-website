# IGO Agri Mart — Q-Commerce Style Revamp Plan

Prepared for: GOKUL R · IGO Group · 13 June 2026
Goal: make IGO Agri Mart feel as fast, frictionless and trustworthy as **Swiggy / Zomato / Zepto / Instamart**, applied to **agriculture products** (inputs + fresh produce + native foods).

---

## 1. The model — what we are copying, and from whom

We blend two playbooks:

**A) Quick-commerce UX (Swiggy, Zomato, Zepto, Instamart, Blinkit)**
- **Location first.** The app opens by asking "where do you want delivery?" Everything (stock, ETA, price) keys off that pincode/area.
- **Single-session conversion.** From opening to ordering in under a few minutes — minimal taps, no dead ends.
- **Speed as the headline.** A visible delivery promise ("Delivery in X") on home, category and product.
- **Big visual home rails.** Large banners + horizontal "scroll" rails (Best sellers, Deals, New, Reorder).
- **Instant cart feedback.** Tap "+" adds instantly with a live floating cart bar; no full-page reload.
- **Use-case / occasion discovery.** "Growing Tomato?", "Monsoon sowing kit", "Kitchen garden starter" — like Instamart's "movie night" bundles.
- **Live order tracking** with a status timeline and rider/courier ETA.

**B) Agri / farm-fresh players (Otipy, KisanKonnect, Ninjacart, DeHaat, BigHaat, AgroStar, Country Delight)**
- **Farm-to-home promise + traceability** (KisanKonnect: trace your order back to the farm; A-grade quality checks).
- **Slotted / scheduled delivery** for fresh produce (Otipy 12-hour farm-to-home; Country Delight morning slots).
- **Subscriptions** for repeat items (milk, vegetables, fertilizer refills).
- **Crop advisory + weather + mandi prices** woven into shopping (AgroStar).
- **COD + vernacular + missed-call/WhatsApp ordering** for rural reach (BigHaat, AgroStar).

---

## 2. Where IGO stands today (so we only add what's missing)

Your site already has: product catalog with brand/price/rating/problem filters, **Buy-by-Crop filter (added)**, product pages with usage/dosage/reviews + **crop & certification badges (added)**, wishlist, **add-to-cart popup**, cart with coupons/GST/delivery, COD/UPI/Card selection, multi-tab account with orders + inbox, **notification bell (added)**, **OTP + profile login (added)**, location detection, voice search, Tamil/English toggle, and an admin panel. **174 new products (added)** now span seeds, plants, tools, materials and Valluvam native foods.

So this plan is about the **q-commerce layer on top**: speed, delivery, frictionless cart, occasion discovery, subscriptions, tracking, and an app.

---

## 3. The revamp — section by section (mapped to your code)

### 3.1 Location & delivery promise (NEW — highest impact)
*Model: Zepto/Instamart open with location + ETA.*
- On first load, ask **delivery pincode/area** (you already have `detectLocation()` in `storeData.ts` + a pincode check on PDP — promote it to a **top-bar location selector** in `Header.tsx`).
- Show a **delivery promise** beside it ("Fresh produce by tomorrow AM · Inputs in 2–4 days").
- Gate out-of-area orders before checkout (serviceable-pincode list in Admin).
- Effort: **Medium.** Files: `Header.tsx`, `CheckoutComponent.tsx`, Admin settings.

### 3.2 Home page rails (UPGRADE)
*Model: Swiggy/Zepto horizontal rails.*
- Add dynamic rails: **Reorder your last items**, **Best sellers**, **Deals under ₹199**, **New this week**, **Buy by Crop** shortcuts, **Seasonal / Monsoon picks**.
- Add **occasion bundles**: "Kitchen Garden Starter", "Tomato Grower's Kit", "Native Foods Hamper".
- Effort: **Medium.** File: `HomeComponent.tsx` (rails infra already exists).

### 3.3 Category & search (UPGRADE)
*Model: Instamart instant category browse.*
- Make category browsing **instant** (no reloads) with sticky filter chips; you already have the filters and the new crop filter.
- Add **"sort by delivery speed"** and a **fresh-produce vs inputs** toggle.
- Surface **sponsored/featured** slots for IGO-own brands.
- Effort: **Low–Medium.** File: `CategoryComponent.tsx`.

### 3.4 Product page (UPGRADE — mostly done)
- ✅ Crop suitability chips + certification/trust badges (added).
- Add **delivery ETA by pincode** (you check availability; show the date).
- Add **"Notify me when back in stock"** (reuse the new notification system).
- Add **verified-buyer tag + photos** on reviews.
- Effort: **Low.** File: `ProductDetailComponent.tsx`.

### 3.5 Frictionless cart (UPGRADE)
*Model: Zepto floating cart + instant +/−.*
- Add a **persistent floating cart bar** ("3 items · ₹540 · View cart") on every page.
- Inline **+/−** steppers on product cards (no need to open the product).
- **Cross-sell at cart** ("Farmers also added… neem oil, gloves").
- Effort: **Medium.** Files: `App.tsx` (cart state exists), product cards, `CartComponent.tsx`.

### 3.6 Checkout & payments (CRITICAL)
*Model: one-tap, multiple payment methods, trust badges.*
- **Real payment gateway** (Razorpay/PhonePe) — UPI, cards, netbanking, wallets. *Needs your merchant account + keys.*
- Saved addresses + **one-tap reorder**.
- **GST invoice PDF** + SMS/WhatsApp/email confirmation per status.
- Effort: **High (needs accounts).** Files: `CheckoutComponent.tsx`, a small backend.

### 3.7 Delivery, slots & tracking (NEW)
*Model: Otipy/Country Delight slotted delivery + live tracking.*
- **Delivery-slot picker** for fresh produce ("Tomorrow 6–9 AM").
- **Live order tracking** timeline (Placed → Packed → Dispatched → Out for delivery → Delivered) — your status flow + notification bell already support this; add a visual tracker and courier integration (Shiprocket/Delhivery).
- **Farm traceability** badge ("Sourced from … farm, Tamil Nadu") — KisanKonnect-style.
- Effort: **Medium–High.** Files: `OrderTrackingComponent.tsx`, Admin.

### 3.8 Subscriptions & loyalty (NEW)
*Model: Country Delight subscriptions, BigHaat coins, Swiggy One.*
- **Subscribe & save** for recurring items (vegetables weekly, fertilizer monthly).
- **IGO Coins / wallet** earned per order, redeemable at checkout.
- **Referral program** ("Refer a farmer, both get ₹X").
- **Membership** (free delivery + member prices) — Swiggy One style.
- Effort: **Medium.** Files: account + checkout + `siteConfig.ts` (coupon/wallet infra exists).

### 3.9 Engagement & advisory (UPGRADE — components exist)
*Model: AgroStar advisory + community.*
- Populate **Crop Doctor, Knowledge Hub, Academy, Blog, Events** (already built, need content).
- Add **mandi prices** + **weather/spray-window alerts** widgets.
- Add a **farmer community / Q&A** ("Krishi Charcha").
- Effort: **Low–Medium (mostly content).**

### 3.10 App & rural channels (NEW)
*Model: every q-commerce + agri player has an app; rural needs WhatsApp.*
- Ship a **PWA** first (installable, **web push notifications**, offline cart) — fastest path to an "app".
- **WhatsApp ordering / catalog** + click-to-order link (huge for rural farmers).
- Complete **Tamil** coverage; consider Hindi/Telugu.
- Effort: **Medium.**

### 3.11 Backend for scale (NEW — your stated plan)
- Migrate DB to **Supabase (Postgres)**; **image bucket + CDN**; **server-side search & pagination**; **load balancer/autoscale**. Essential before the catalog and traffic grow.
- Effort: **High.**

---

## 4. Prioritized rollout (clear order)

**🔴 Phase 1 — "It feels fast & trustworthy" (4–6 weeks)**
1. Location selector + delivery promise + serviceable-pincode gate.
2. Real payment gateway + GST invoice + SMS/WhatsApp confirmations.
3. Floating cart bar + inline +/− steppers.
4. Delivery-slot picker + visual order tracker.
5. Legal pages (Privacy, Terms, Return/Refund).

**🟠 Phase 2 — "It pulls farmers back" (4–6 weeks)**
6. Home rails (Reorder, Best sellers, Deals, Seasonal) + occasion bundles.
7. IGO Coins/wallet + referral + Subscribe & save.
8. Back-in-stock notify + verified reviews + farm traceability badge.
9. Mandi prices + weather alerts.

**🟡 Phase 3 — "It scales & reaches rural" (6–8 weeks)**
10. PWA (installable + web push) + WhatsApp ordering.
11. Supabase migration + image bucket/CDN + server search.
12. Full Tamil/Hindi coverage + community/advisory content.

---

## 5. Quick wins I can build now (no external accounts)
- Back-in-stock "Notify me" (PDP) · one-tap **Reorder** (Account) · **floating cart bar** · **home rails** (Reorder/Best sellers/Deals) · **occasion bundles** · IGO Coins (demo wallet) · serviceable-pincode list.

Items needing **your accounts/keys** (I'll wire once you provide them): payment gateway (Razorpay/PhonePe), DLT SMS/WhatsApp, courier tracking (Shiprocket/Delhivery), Supabase + CDN.

---

## 6. Sources
**Quick-commerce UX:** Swiggy Instamart, Zepto, Blinkit funnel guides — https://lyxelandflamingo.com/blogs/third-party-marketplaces/winning-on-quick-commerce-high-conversion-funnels-blinkit-zepto-instamart/ · https://predictgrowth.ai/blogs/groceries-in-the-fast-lane-inside-zepto-vs-blinkit-swiggy-instamart-s-quick-commerce-push · https://shyamfuture.com/how-blinkit-used-real-time-ux-and-hyperlocal-tech-to-win-quick-commerce/
**Agri / farm-fresh:** Otipy — https://apps.apple.com/in/app/otipy/id1500777882 · KisanKonnect — https://play.google.com/store/apps/details?id=com.kisankonnect.in · Ninjacart — https://medium.com/@ninjacartb2bonlinemarketpl/farm-fresh-deliveries-with-ninjacart-a-new-era-for-b2b-produce-trading-in-india-122d27b4b691 · Country Delight — https://en.wikipedia.org/wiki/Country_Delight
**Agri-inputs:** BigHaat — https://www.bighaat.com/ · AgroStar — https://corporate.agrostar.in/ · AgriBegri — https://agribegri.com/ · Farmkart — https://farmkart.com/
