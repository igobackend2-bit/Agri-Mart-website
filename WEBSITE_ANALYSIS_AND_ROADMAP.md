# IGO AgriMart — Website Analysis & Improvement Roadmap

*Prepared: June 2026*

## 1. What the site already has

IGO AgriMart is a React 19 + Vite + Firebase (Firestore/Auth) agri-commerce platform with bilingual support (English/Tamil). The codebase is genuinely substantial — 14 page components covering:

Home, Category browsing, Product detail, Cart, Checkout, Account/orders, Admin panel, Services marketplace (drone spraying, soil testing, etc.), Service detail with lead capture, Farm Loans, Academy (courses), Blog, About, and Contact. It has Google sign-in, a wishlist, coupon codes, Firestore-backed product/order/review data, an offline seed-data fallback, and a working admin product/order manager.

That's a strong foundation — most early-stage agri e-commerce sites don't have this much built. The gaps below are what stand between "functional demo" and "production-grade, professional platform."

## 2. Critical gaps to implement

**No real payment gateway.** Checkout offers UPI, Card, NetBanking and COD as radio options, but there's no Razorpay/PayU/Cashfree/Stripe integration behind them — selecting "UPI" or "Card" doesn't actually charge anyone. For a commerce site this is the single highest-priority gap. Razorpay or Cashfree (both popular with Indian agri/D2C platforms, support UPI + cards + netbanking + wallets in one integration) would be the natural choice.

**`alert()` used for user feedback (17 places).** Adding to cart, wishlist errors, form submissions, etc. all use the browser's native `alert()`. This looks unpolished and blocks the UI thread. Replace with toast notifications (e.g., a lightweight library or custom component) and inline form validation states.

**No SEO setup.** `index.html` still has the placeholder title "My Google AI Studio App," no meta description, no Open Graph/Twitter card tags, no favicon, no `robots.txt` or `sitemap.xml`, and no per-page `<title>`/meta updates (it's a single-page app with client-side routing only — no SSR/prerendering, so search engines will struggle to index product and category pages). For an e-commerce site that depends on organic search traffic, this is a major revenue gap.

**No analytics or conversion tracking.** No Google Analytics/GA4, Meta Pixel, or any event tracking for add-to-cart, checkout funnel drop-off, search terms, etc. You can't optimize what you can't measure.

**Unused AI capability.** The project already depends on `@google/genai` (Gemini API) but nothing in the codebase calls it. This is a missed opportunity — competitors lean heavily on AI-driven crop/plant diagnosis (see research below), and you already have the SDK installed.

**Unused animation library.** `motion` (Framer Motion's successor) is a dependency but isn't imported anywhere — the UI currently has no micro-interactions/transitions, which is part of what makes modern commerce sites feel "premium."

**Encoding bug in Tamil translations.** `src/translation.ts` line 93 (`searchPlaceholder` for Tamil) contains corrupted/mojibake characters (`�`) — the Tamil locale's search box placeholder is currently broken/garbled.

**No PWA / manifest / app icons.** No `manifest.webmanifest`, no favicon, no install-to-home-screen support — relevant for rural/mobile-first users on patchy connectivity.

**Client-side-only rendering.** Pure SPA via Vite with no SSR or static pre-rendering. This hurts both SEO and first-paint performance on slow rural mobile networks — a real concern for this audience.

## 3. What competitors are doing (research findings)

Looking at the leading Indian agritech platforms for comparison:

**BigHaat** (₹1,100+ crore FY25 revenue, just raised $10M in Feb 2026) runs an omnichannel model — app/web plus a "missed call" ordering option for farmers without smartphones/data, vernacular advisory in multiple regional languages, a community forum ("Kisan Vedika"), and a standout AI feature called **"Crop Doctor"** where farmers photograph a diseased plant and get expert/AI-assisted diagnosis.

**AgroStar** (raised $30M in Nov 2025) differentiates with a **voice-enabled app** serving 5M+ farmers — critical for low-literacy users — plus a strong climate-resilient/sustainable-agriculture advisory angle.

**DeHaat** (₹3,000+ crore FY25 revenue, ₹369 crore profit) wins by being end-to-end: inputs + crop advisory + **market linkage (helping farmers sell their produce)**, backed by physical local centres that blend digital convenience with on-ground trust.

**Common threads across all three:** AI/photo-based crop diagnosis, vernacular and voice support, strong advisory content (not just a product catalog), omnichannel access for low-connectivity users, and a "farmer community" element that builds trust and retention beyond a single transaction.

## 4. Recommended roadmap (prioritized)

**Phase 1 — Make commerce actually work (foundational, do first)**
- Integrate a real payment gateway (Razorpay or Cashfree — both handle UPI/cards/netbanking/wallets and are well-documented for Indian businesses)
- Replace all `alert()` calls with a proper toast/notification system and inline validation
- Fix the Tamil translation encoding bug
- Add transactional emails/SMS for order confirmation, shipping, and delivery updates

**Phase 2 — Get found (SEO & growth infrastructure)**
- Add proper `<title>`, meta description, Open Graph/Twitter tags, favicon, `robots.txt`, `sitemap.xml`
- Move to SSR or static pre-rendering (Next.js migration, or Vite SSR/prerender plugin) so product/category pages are indexable
- Wire up GA4 + Meta Pixel with funnel event tracking (view item, add to cart, begin checkout, purchase)
- Add a PWA manifest + icons for installability on rural mobile devices

**Phase 3 — Differentiate with AI & advisory (this is where you can leapfrog)**
- Activate the already-installed Gemini SDK to build a **"Crop/Plant Doctor"**: farmers upload a photo of a diseased crop, Gemini's vision capability suggests likely issues and recommended IGO products — directly mirroring BigHaat's most-loved feature, but built on a more modern model
- Add an AI chat assistant for product recommendations and farming Q&A in both English and Tamil
- Consider voice-search/voice-navigation for low-literacy users (à la AgroStar)

**Phase 4 — Polish & retention**
- Add `motion`-powered micro-interactions (page transitions, add-to-cart animations, skeleton loaders) — the dependency is already there, just unused
- Build out a farmer community/forum element tied to the Academy and Blog sections (mirrors BigHaat's "Kisan Vedika" and DeHaat's trust-building model)
- Add market-linkage features (helping farmers sell produce, not just buy inputs) as a long-term differentiator — this is DeHaat's biggest revenue lever

## 5. Bottom line

The platform's bones are solid — the structure, data model, and breadth of sections (services, loans, academy, blog) already match or exceed many funded competitors at a similar stage. The fastest wins are Phase 1 (payments + UX polish) since the site can't process real transactions yet. The biggest *competitive* opportunity is Phase 3 — you already have the Gemini SDK installed and unused, and an AI-powered "Crop Doctor" is the single feature that consistently shows up as a favorite across BigHaat, AgroStar, and similar platforms.
