# IGO Agri Mart — Merged Revamp Plan (Farmers Factory + IGO Nursery)

Prepared for: GOKUL R · IGO Group · 13 June 2026
Based on live, rendered inspection of **famersfactory.com** (IGO Farmers Factory) and **igonursery.com** (IGO flagship).

> Note: the live Farmers Factory site is **famersfactory.com** (spelled "famers", no 'r'). The `farmersfactory.com` domain (with 'r') is a parked GoDaddy listing for sale — ignore it.

---

## 1. What the two sister sites do (audit)

### Farmers Factory (famersfactory.com) — the closest model for IGO Agri Mart
- **Auth (/auth):** `LOGIN` / `JOIN` tabs · **PASSWORD or OTP** toggle · login with **email OR mobile number + password** · "Back to Store".
- **Order flow:** product cards with **ADD TO BASKET** → "BASKET" (cart) → checkout. Cart is branded **"Basket"** ("Items in your basket").
- **Pricing:** every card shows **rating 4.8 (120+) · weight (1 kg) · price + MRP strikethrough + "SAVE ₹X"**.
- **Trust ticker:** Free delivery above ₹499 · Farm-to-table 24h · No chemical ripening · Zero-waste packaging.
- **Collections:** Vegetables · Fruits · **Valluvam Products**.
- **Growth:** first-order **10% discount popup** (email capture).
- **Language:** EN toggle (vernacular ready).

### IGO Nursery (igonursery.com) — the premium brand standard
- Premium **"AgriTech lab"** identity with **live trust stats** (99.2% health guarantee, 150k+ deliveries, 99.8% satisfaction).
- **26-vertical IGO ecosystem** showcase with cross-links (IGO Agri Mart is one vertical).
- **/store** with clean **category tabs** + **"PREMIUM QUALITY" badge + 4.9 rating + price** cards + trust row (**Health Guaranteed · Pan-India Delivery · 15-Day Free Returns**).
- Sells **services** too: Landscape Studio, AMC, Garden Assistant, Project Wizard.

### The merged DNA (what both share → adopt as standard)
Premium organic branding · ratings on every card · **MRP + "SAVE ₹X"** pricing · scrolling **trust ticker/row** · **Valluvam** category · **LOGIN/JOIN with PASSWORD or OTP** · email-or-mobile login · **first-order discount** · category tabs · **free-delivery threshold + 24h/fast-delivery** messaging · **group ecosystem cross-linking**.

---

## 2. Your five focus areas — what to do in IGO Agri Mart

### 2.1 Place the order
- **Reference:** Farmers Factory "ADD TO BASKET → Basket → checkout"; free delivery above ₹499; 24h delivery promise.
- **IGO Agri Mart today:** ✅ add-to-cart popup, floating cart bar, cart → checkout → order, delivery slot, COD/UPI/Card (all built).
- **Add:** rename/optionally brand cart as "Basket"; show **MRP + "SAVE ₹X"** on cards; a **free-delivery progress bar** ("Add ₹X more for free delivery"); a **24h/fast-delivery promise** badge.

### 2.2 Sign in / Login
- **Reference:** `/auth` with **LOGIN / JOIN** tabs, **PASSWORD or OTP** toggle, **email-or-mobile + password**.
- **IGO Agri Mart today:** ✅ phone OTP + profile creation + Google + login/join tabs (built).
- **Add (to exactly match Farmers Factory):** a **PASSWORD vs OTP toggle**, allow **email OR mobile** as the identifier, and keep OTP as an option. (You already store a password hash, so password login is a small addition.) Add the **first-order 10% discount** prompt for new joiners.

### 2.3 Profile pages
- **Reference:** logged-in account (orders, basket history, addresses).
- **IGO Agri Mart today:** ✅ Orders (with reorder), Inbox, Wishlist, Addresses, Profile, **IGO Coins** (built).
- **Add:** "Saved baskets / buy-again", crop preferences, and a **first-order offer / referral** card. Keep the premium styling.

### 2.4 Notification bell
- **IGO Agri Mart today:** ✅ customer bell that updates on admin order-status changes (built).
- **Add:** **admin-side bell** (new orders, low stock, new leads); optional web-push later via PWA.

### 2.5 Admin pages
- **IGO Agri Mart today:** ✅ full admin — orders, products (add/edit/delete/stock), settings, coupons, banners, site notifications, service leads (built).
- **Add:** **admin notification center**, **bulk CSV product import** (your starter CSV is ready), and a **collections/ecosystem manager** to mirror the Farmers Factory collection layout.

---

## 3. Site-wide brand "rephase" (from both references)
1. **Trust ticker/row** site-wide: *100% Genuine · Free delivery above ₹X · Fast/24h delivery · Easy returns · Secure payments.*
2. **Premium product cards:** badge + rating + **MRP & "SAVE ₹X"** + unit/weight + ADD TO CART/Basket.
3. **Category tab bar** (Veg, Fruits, Seeds, Plants, Tools, Materials, **Valluvam**…) like both stores.
4. **IGO Ecosystem band + footer cross-links** to the 26 verticals (Nursery, Farmers Factory, Valluvam, Protein Cuts, Palm Cafe, Farm Loans…).
5. **Live trust stats hero** (genuine %, farmers served, deliveries) like IGO Nursery.
6. **First-order discount popup** + **language toggle** (you already have TA/EN).

---

## 4. Prioritized rollout (merged)

**🔴 Phase 1 — Match the sister-site standard (no accounts)**
1. Trust ticker/row site-wide + free-delivery progress bar.
2. Auth upgrade: **PASSWORD or OTP** toggle + **email-or-mobile** login + first-order discount.
3. Premium cards: rating + **MRP/"SAVE ₹X"** + unit.
4. Category tab bar incl. **Valluvam**.
5. IGO Ecosystem band + footer cross-links.

**🟠 Phase 2 — Engagement & ops (mostly no accounts)**
6. Admin notification bell + bulk CSV import.
7. Profile: buy-again, crop preferences, referral.
8. Hero live trust stats + premium re-skin.

**🟡 Phase 3 — Commerce-grade (needs your accounts/keys)**
9. Real payment gateway, DLT SMS/WhatsApp, courier tracking.
10. Supabase + image bucket/CDN + server search; PWA + web push.

---

## 5. Already built vs to add (quick view)
- **Built (earlier sessions):** OTP login + profile, notification bell (customer), order flow, floating cart bar, delivery slot, reorder, IGO Coins, Buy-by-Crop filter, crop/cert badges, 174 products, legal pages, back-in-stock notify, admin panel.
- **To add now (no accounts):** password-or-OTP + email/mobile auth toggle, first-order discount, trust ticker/row, MRP/"SAVE ₹X" cards, category tab bar, IGO Ecosystem section, admin bell, bulk CSV import.
- **Needs your keys:** payments, DLT SMS/WhatsApp, courier, Supabase + CDN.

---

## 6. To build Phase 1 exactly on-brand, send me
1. **Brand kit:** logo files, color codes, fonts (to match the sister sites).
2. **The 26 verticals list + live URLs** to cross-link.
3. **Free-delivery threshold** and **delivery-time promise** you want to advertise (e.g., ₹499 / 24h, or your agri-input equivalent).

With those I can implement the trust ticker, auth upgrade, premium cards, category tabs and ecosystem section cleanly and on-brand.
