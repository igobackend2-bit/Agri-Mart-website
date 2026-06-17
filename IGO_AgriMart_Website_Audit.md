# IGO Agri Mart — Full Website Audit & Professional Upgrade Roadmap

*Prepared for: GOKUL R / IGO Group · Frontend UX + Competitive Analysis*

---

## 1. Executive summary

IGO Agri Mart already has a strong foundation: a real product catalog (430+ items across 14 categories incl. the new Nursery Tools), Supabase-backed orders, working OTP login (APITxT), an admin control panel, cart/checkout, a customer dashboard, IGO Coins, and a glassmorphism login. The structure rivals BigHaat and AgroStar feature-for-feature.

What separates it from a *premium, professional* storefront today is **visual consistency, trust signalling, performance polish, and conversion-focused detail** — not missing features. This document scores each page, compares against competitors, and gives a prioritized, low-risk upgrade plan.

**Overall maturity: 7/10.** With the "Quick Wins" in Section 4 it reaches ~8.5/10; with the full roadmap, a 9+.

---

## 2. Competitor benchmark

| Capability | BigHaat | AgroStar | Zepto/Blinkit (q-comm) | farmersfactory | **IGO Agri Mart (now)** |
|---|---|---|---|---|---|
| Clean sticky nav + search | ✅ | ✅ | ✅ | ✅ | ✅ (just added) |
| Voice search | ❌ | ❌ | ❌ | ❌ | ✅ (differentiator) |
| Buy-by-crop / problem filter | ✅ | ✅ | – | partial | ✅ |
| Trust badges everywhere | ✅ | ✅ | ✅ | ✅ | ⚠️ partial |
| Product reviews w/ photos | ✅ | ✅ | ✅ | ⚠️ | ⚠️ ratings only |
| Delivery ETA / pincode check | ✅ | ✅ | ✅ (killer) | ⚠️ | ✅ (PDP) |
| Loyalty / wallet | ⚠️ | ✅ | ✅ | ❌ | ✅ IGO Coins |
| Consistent design system | ✅ | ✅ | ✅✅ | ✅ | ⚠️ **biggest gap** |
| Mobile-first polish | ✅ | ✅ | ✅✅ | ✅ | ⚠️ needs pass |
| Skeleton loaders / no layout shift | ✅ | ✅ | ✅ | ✅ | ❌ |

**Takeaway:** IGO matches competitors on features; the opportunity is **design consistency + mobile polish + trust/conversion micro-UX**, which is exactly where premium sites win.

---

## 3. Page-by-page audit

### 3.1 Header / Global Nav — 8/10
**Good:** sticky nav now works, global menu on every page, compact search, voice search with listening indicator, language toggle.
**Improve:**
- Reduce vertical stack height — announcement bar + logo row + dark sub-nav + trust bar + menu = ~5 rows; on laptop this pushes content down. Consider merging the dark sub-nav links into the main menu, and showing the announcement bar only on first load.
- On scroll, collapse to a slim bar (logo + menu + search + cart) — the "shrinking header" pattern competitors use.
- Cart icon should show a live item count badge + a mini-cart hover preview.

### 3.2 Homepage — 7/10
**Good:** q-commerce hero, shop-by-crop tiles, best sellers, brand marquee, ecosystem carousel.
**Improve:**
- **One hero, one message.** Lead with a single strong value prop + search, then a clear primary CTA ("Shop Seeds", "Shop Fertilizers"). Avoid competing CTAs.
- Add a **"Deliver to {pincode}"** prompt up top (Zepto/Blinkit pattern) — biggest trust/conversion lever for agri delivery.
- Category tiles: equal-size cards, consistent corner radius, real product photo per tile, item counts.
- Add **social proof band**: "10,000+ farmers · 4.8★ · 50,000 orders delivered" with real-looking stats.
- Add a **"Deals of the day" / time-limited offers** strip — drives urgency.

### 3.3 Shop / Category — 7.5/10
**Good:** filters (crop, problem, brand, price, rating, stock, discount), search results.
**Improve:**
- Add **sort dropdown** (Relevance, Price ↑/↓, Discount, Rating, Newest) prominently.
- Product card consistency: fixed card height, image area fixed ratio, 2-line name clamp, price + MRP + % off badge, rating, one primary "Add" button. Inconsistent card heights look unprofessional.
- Add **skeleton loaders** while products load (no blank flashes / layout shift).
- Sticky filter sidebar on desktop; bottom-sheet filter on mobile.
- Show active filters as removable chips.

### 3.4 Product Detail (PDP) — 8/10
**Good:** image gallery, unit-aware pack sizes (kg/L/plant/piece), crop fit, pincode check, GST note, reviews count, combo.
**Improve:**
- Add a real **review section with star breakdown + customer photos** (even seeded), and a "Write a review" CTA for buyers.
- Add **"Frequently bought together" / cross-sell**.
- Sticky **Add to Cart bar** on mobile while scrolling specs.
- Trust row under the buy button: Genuine · COD · Easy returns · Secure — consistently styled.
- Delivery: show an **estimated date** ("Get it by Mon, 23 Jun") not just a pincode field.

### 3.5 Cart / Checkout — 7/10
**Improve:**
- Progress steps (Cart → Address → Payment → Done).
- Order summary always visible (sticky on desktop) with savings highlighted ("You save ₹X").
- Coupon field with applied-state feedback; show IGO Coins redeemable.
- Trust/secure-checkout badges near the pay button.
- Address: save/select multiple, default address, pincode auto-fill city/state.

### 3.6 Account / Dashboard — 8/10
**Good:** orders with live status, inbox (welcome message), wishlist, addresses, IGO Coins, Home/Shop/Cart quick links, logout moved here.
**Improve:**
- Order card: clearer status stepper, invoice download, reorder, track — consistent button styling.
- Inbox: move to Supabase so messages persist across devices (currently per-browser).
- Empty states with friendly illustrations + CTA ("No orders yet — Start shopping").

### 3.7 Login / Auth — 8.5/10
**Good:** glassmorphism, single continuous background, "Future of Farming" hero, real OTP, full-screen (no header/footer).
**Improve:**
- Add the reference's helper links: "Remember me", "Lost your password?", "Already received a code? Enter it here".
- Inline field validation (red/green states) instead of only a top error banner.
- OTP screen: 6 separate boxes with auto-advance + paste support + resend timer.

### 3.8 Admin — 8/10
**Good:** dashboard KPIs, orders w/ status sync, products, inventory, coupons, content, leads, 5-sec auto-refresh that pauses while editing.
**Improve:**
- Add charts (revenue trend, orders by status, top categories) — you have the data.
- Table search/sort/pagination on Products & Orders.
- Export to Excel/CSV for orders and inventory.

### 3.9 Footer — 7.5/10
**Good:** shop categories, quick links, IGO Group ecosystem with status badges, contact.
**Improve:** newsletter signup, app-download/QR placeholder, payment-method icons, social links consistent with login.

---

## 4. Prioritized action plan

### ⚡ Quick wins (high impact, low risk — 1–2 sessions)
1. **Design tokens**: lock one green (`#1B6B3A`), one accent, consistent radius (`rounded-xl`), spacing, and shadow scale — apply across cards/buttons. *This single change makes the whole site look "designed."*
2. **Uniform product cards** (fixed height, image ratio, name clamp, price block, one CTA) on Home + Shop.
3. **Skeleton loaders** for product grids and orders.
4. **Sort dropdown** + removable filter chips on Shop.
5. **Sticky mobile Add-to-Cart** on PDP.
6. **"Deliver to pincode"** prompt in the header.

### 🟡 Medium (1–2 weeks)
7. Shrinking/sticky header on scroll + mini-cart preview.
8. Real review section (stars breakdown + photos) on PDP.
9. Checkout progress steps + sticky order summary + coupon feedback.
10. Inbox → Supabase (cross-device).
11. Admin charts + table search/sort/pagination + CSV export.

### 🔵 Advanced (differentiators)
12. Delivery ETA by pincode (date estimate).
13. "Frequently bought together" cross-sell + crop-kit bundles.
14. Personalized homepage (recently viewed, reorder, by-crop).
15. PWA / installable + push notifications for order status.
16. Performance: image lazy-load + compression, code-split routes, Lighthouse 90+.

---

## 5. Recommended first batch (safe, visible, no feature risk)
If you approve, I'll implement these together as one consistent pass — they're presentational and won't touch your working OTP/orders/admin logic:
- Design-token cleanup (color/radius/shadow consistency)
- Uniform product cards (Home + Shop)
- Skeleton loaders
- Shop sort dropdown + filter chips
- Sticky mobile Add-to-Cart on PDP

These five give the biggest jump in "professional feel" for the least risk.

---

*End of audit. Tell me which batch to start with and I'll implement it page-by-page, verifying each change.*
