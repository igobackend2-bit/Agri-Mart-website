# IGO Agri Mart — Revamp Plan (aligned to IGO Nursery)

Prepared for: GOKUL R · IGO Group · 13 June 2026
References reviewed: **igonursery.com** (live, rendered) and **farmersfactory.com**.

> ⚠️ **farmersfactory.com is a parked domain that is "for sale" on GoDaddy** — there is no live site there to copy. "Farmers Factory" exists as an IGO division (and your catalog already uses farmer-factory images locally), but if you have a different live URL for it, send it and I'll review that one too.

---

## 1. What IGO Nursery does (and what we should match)

IGO Nursery is the **flagship brand experience** of the IGO Group. Key things to mirror in IGO Agri Mart:

**A) Premium "AgriTech lab" brand identity**
- Tagline energy: *"Nature. Engineered."* — IoT data, precision trials, lab-certified plants.
- Live "lab" stats on the hero (core lab temp, 99.2% health guarantee, 150,000+ deliveries, 99.8% satisfaction).
- Dark, premium, confident visual style — not a generic store.

**B) The 26-vertical IGO ecosystem**
- IGO Nursery showcases all **26 IGO verticals** with cross-links — and **IGO Agri Mart is listed as one of them** ("Distribution — seeds, fertilizers, equipment").
- So IGO Agri Mart should (a) carry the same group branding and (b) cross-link to sibling verticals (Nursery, Farmers Factory, Valluvam, Protein Cuts, Palm Cafe, Farm Loans, etc.).

**C) The store UX**
- A clean **/store** with **category tabs**: All, Outdoor, Indoor, Herbs, Creepers, Vegetables, Fruits, Cactus & Succulent, Tools, Support, Growing Media, Infrastructure, Containers.
- Product cards = **"PREMIUM QUALITY" badge + product name + 4.9 rating + category + 1-line description + price**.
- A persistent **trust row**: **Health Guaranteed · Safe Pan-India Delivery · 15-Day Free Returns**.
- Free pan-India delivery messaging + "polyhouse-grown at Muttukadu" provenance.

**D) Services beyond products**
- D2C Retail, Landscape Studio, AMC (annual maintenance), Garden Assistant, "Start Project Wizard" — selling **services + advisory**, not just SKUs.

---

## 2. Where IGO Agri Mart stands vs IGO Nursery

| Capability | IGO Nursery | IGO Agri Mart today | Action |
|---|---|---|---|
| Premium group branding | ✅ strong | 🟡 functional but lighter | **Re-skin** to the IGO "AgriTech" identity |
| 26-vertical cross-links | ✅ | ❌ | **Add an "IGO Ecosystem" section + footer links** |
| Store with category tabs | ✅ | ✅ (filters + Buy-by-Crop) | Align styling; add tab-style category bar |
| Premium product cards (badge+rating+price) | ✅ | ✅ | Add **"Premium / Genuine" badge** style + provenance |
| Trust row (health/ delivery/ returns) | ✅ | 🟡 (badges added on PDP) | **Add a global trust row** site-wide |
| Order placement | basic | ✅ full cart→checkout→order | Keep; align checkout styling |
| Sign in / Login | (auth) | ✅ OTP + Google + profile (built) | Keep; add returning-user polish |
| Profile pages | (auth) | ✅ Orders/Inbox/Wishlist/Addresses/Coins | Keep; add provenance + reorder (built) |
| Notification bell | — | ✅ (built) | Keep; add admin-side bell |
| Admin pages | (hidden) | ✅ full admin (orders/products/settings) | Keep; add admin notifications |
| Services/advisory | ✅ | ✅ (components exist) | Populate content |

**Conclusion:** Functionally, IGO Agri Mart already has more e-commerce machinery than IGO Nursery (login, profile, orders, notification bell, admin — all built in earlier sessions). The gap is **brand presentation + group ecosystem + trust framing**, not core features.

---

## 3. The plan — what to add / "rephase", by area

### 3.1 Brand re-skin (highest visual impact)
- Adopt the **IGO "AgriTech" identity**: shared logo lockup, premium color system, confident hero with **live trust stats** ("100% Genuine · Pan-India · X farmers served").
- Consistent typography + dark premium accents to match igonursery.com.
- Files: `Header.tsx`, `HomeComponent.tsx`, global CSS.

### 3.2 IGO Ecosystem section (new)
- Add a **"Part of the IGO Group — 26 Verticals"** band on the home page + footer, cross-linking to IGO Nursery, Farmers Factory, Valluvam, Protein Cuts, Palm Cafe, Farm Loans, Exports, etc.
- Reinforces trust and group scale (exactly what IGO Nursery does).
- Files: `HomeComponent.tsx`, `Footer.tsx`.

### 3.3 Global trust row (new)
- A site-wide strip: **100% Genuine Products · Free/Fast Pan-India Delivery · Easy Returns/Replacement · Secure Payments · Expert Crop Support.**
- Mirrors IGO Nursery's "Health Guaranteed / Pan-India / 15-Day Free Returns".
- Files: `Header.tsx` or a new `TrustBar.tsx` + `Footer.tsx`.

### 3.4 Store UX alignment
- Add a **category tab bar** (like IGO Nursery's All / Outdoor / Indoor / Herbs / Vegetables / Fruits / Tools …) on top of the existing filters.
- Standardize product cards: **"Premium / 100% Genuine" badge + rating + provenance ("Sourced from … / IGO-certified")**.
- Files: `CategoryComponent.tsx`, product card component, `HomeComponent.tsx`.

### 3.5 Order placement (keep + polish)
- Already complete: add-to-cart popup, floating cart bar, cart → checkout → order, delivery slot, COD/UPI/Card selection, order confirmation to inbox.
- Polish: align checkout visual style to premium brand; add **order success "what's next" timeline**.

### 3.6 Sign in / Login (keep + polish)
- Already built: **phone OTP + profile creation + Google + login/join tabs** (demo OTP; swap to DLT later).
- Polish: premium auth screen styling; "Continue as guest" for faster first order; remember returning users.

### 3.7 Profile pages (keep + extend)
- Already built: **Orders (with reorder), Inbox, Wishlist, Addresses, Profile, IGO Coins wallet**.
- Extend: add **order provenance/traceability**, **saved crop preferences** (powers Buy-by-Crop), and **subscription/AMC** tab (Nursery-style annual care).

### 3.8 Notification bell (keep + extend)
- Already built for customers (updates on admin order-status changes).
- Extend: **admin-side bell** for new orders/leads/low-stock; optional web-push via PWA.

### 3.9 Admin pages (keep + extend)
- Already built: orders, products (add/edit/delete/stock), settings, coupons, banners, notifications, service leads.
- Extend: **admin notification center**, bulk CSV product import (your starter CSV is ready), and an **ecosystem/services manager**.

### 3.10 Services & advisory (populate)
- Mirror IGO Nursery's services model: **Crop Doctor, Knowledge Hub, Academy, Farm Loans, Events** (components exist) + a **"Project/Order Assistant"** like Nursery's Garden Assistant.

---

## 4. Prioritized rollout

**🔴 Phase 1 — Brand & trust (fast, high impact, no accounts)**
1. Global trust row site-wide.
2. IGO Ecosystem section + footer cross-links to the 26 verticals.
3. Hero re-skin with live trust stats + premium styling.
4. Store category tab bar + premium product-card badges/provenance.

**🟠 Phase 2 — Conversion polish (mostly no accounts)**
5. Checkout + auth premium re-skin; guest checkout.
6. Profile: crop preferences + subscription/AMC tab.
7. Admin notification center + bulk CSV import.

**🟡 Phase 3 — Commerce-grade (needs your accounts/keys)**
8. Real payment gateway (Razorpay/PhonePe), DLT SMS/WhatsApp, courier tracking.
9. Supabase + image bucket/CDN + server search; PWA + web push.

---

## 5. What I can build right now (no accounts) vs what needs you
**Build now:** trust row, IGO Ecosystem section + footer links, hero re-skin, store category tabs, premium card badges/provenance, guest checkout, admin notification bell, profile crop-preferences/AMC tab.

**Needs your input:** the **exact list + URLs of the 26 verticals** to cross-link, your **brand assets** (logo, colors, fonts) to match igonursery.com, and **accounts/keys** for payments, SMS, courier and Supabase.

---

## 6. One question for you before I build
To match the IGO Nursery look precisely, send me (or point me to) your **brand kit** — logo files, color codes, and the **list of vertical names + their live URLs**. With those, Phase 1 (trust row + ecosystem section + hero re-skin + store tabs) can be implemented cleanly and on-brand.
