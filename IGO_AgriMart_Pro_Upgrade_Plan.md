# IGO Agri Mart — Professional & Advanced Upgrade Plan

*Tailored to this website's actual stack (React + Vite + TypeScript + Tailwind, Supabase, the admin "Edit Home Page Sections" system). Every item below is designed to be added in safe, self-contained passes — without changing unrelated working code.*

---

## 1. Where IGO Agri Mart stands today (strengths)

- Broad catalog with crop-fit + certification badges
- Q-commerce touches: floating cart, delivery slots, one-tap reorder, IGO Coins
- Trust framing: IGO group story woven with the marketplace, multilingual (EN/TA/HI/TE)
- A real admin: products, orders, inventory, coupons, sellers, **and now editable home-page sections (text + images)**
- Product page with variants, reviews, frequently-bought, spec table, delivery estimate

This is already ahead of a basic store. The gap to "advanced like BigHaat / AgroStar / DeHaat" is in **discovery, trust signals, advisory, and performance** — not in basic features.

## 2. Competitor benchmark (what the leaders do)

| Capability | BigHaat | AgroStar | DeHaat | IGO today |
|---|---|---|---|---|
| AI crop-doctor (photo → diagnosis) | ✅ | ✅ | ✅ | Manual WhatsApp only |
| Mandi / live price feed | ✅ | ✅ | ✅ | Static ticker |
| Weather advisory | ✅ | ✅ | ✅ | Static (Chennai only) |
| Farmer community / Q&A | ✅ (Kisan Vedika) | ✅ | ✅ | ❌ |
| Multilingual | 5 langs | ✅ | ✅ | ✅ (4 langs) |
| Verified reviews + photos | ✅ | ✅ | ✅ | Reviews, no photos |
| Advisory + commerce in one flow | ✅ | ✅ | ✅ | Partial |

## 3. 2026 conversion/UX best practices (what actually moves sales)

- **Speed**: LCP under 2.5s — a 1s delay cuts conversions ~7%.
- **Mobile-first**: ~78% of retail traffic is mobile; design the thumb path, short forms.
- **Trust before payment**: reviews with photos, secure-payment badges, clear shipping/returns, stock + delivery date near the CTA.
- **Guest checkout**: 19% abandon over forced account creation.
- **Social proof in the layout**: ratings in the hero, "X bought this week", live purchase nudges.

---

## 4. The plan — prioritized, tailored, safe passes

### Tier A — Highest impact, low risk (do first)
1. **Performance pass** — lazy-load all images, compress hero/band images, defer offscreen sections. (Biggest conversion lever; touches only image attrs.)
2. **Product page trust upgrade** — add "X bought this week", secure-checkout + returns badges near the Add-to-Cart, and review **photos** upload. (Additive to ProductDetailComponent only.)
3. **Mobile polish** — sticky add-to-cart (already partial), bigger tap targets, shorter checkout form, guest checkout confirmed.
4. **Make the static "live" widgets real or honest** — either wire the price ticker/weather to a simple data source, or label them clearly and make them **admin-editable** (consistent with the system we just built).

### Tier B — "Advanced" features that match the leaders
5. **AI-style Crop Doctor** — a guided "upload a photo → get advice" form that captures the lead and routes to your agronomists (start rules-based; no real ML needed to look advanced).
6. **Live mandi price page** — an admin-editable table of crop prices by market (uses the same `pageText`/KV pattern), refreshed by you or a scheduled task.
7. **Farmer community / Q&A lite** — a simple questions board (Supabase table) so buyers ask and you answer — BigHaat's "Kisan Vedika" equivalent.
8. **Verified-review photos + ratings in hero** — show star rating and a real photo strip on the product hero.

### Tier C — Polish & growth
9. **Global design system pass** — consistent page headers/breadcrumbs, spacing, scroll-reveal + hover micro-interactions across all ~24 pages (one shared style, applied page by page).
10. **SEO/AEO** — per-page titles/meta, JSON-LD product schema, sitemap, `llms.txt` (the seo-aeo-geo tooling can automate this).
11. **Finish admin editability** — service cards, Crop Doctor block, weather bar, product-row titles editable (continuing the section-by-section work).
12. **Email/enquiry wiring** — finish the contact/enquiry email to igobackend3@gmail.com (still pending).

---

## 5. Suggested order of execution (one verified pass each)

1. Performance + lazy-load (quick, global win)
2. Product page trust + review photos
3. Crop Doctor lead form (advanced look, easy build)
4. Admin-editable mandi price + weather (honest + advanced)
5. Review photos + rating in product hero
6. Community Q&A lite
7. Global design polish, page by page
8. SEO/AEO automation
9. Finish remaining admin-editable sections
10. Enquiry email wiring

## 6. Guardrails (how we keep it safe)

- One section/feature per pass; verify build-safety each time (no null bytes, JSX intact).
- Additive only — new components/fields, no rewrites of working flows.
- All new editable content uses the existing `pageText` + Supabase KV pattern and the inline image uploader (no storage-bucket dependency).
- Keep any other AI/editor **closed** on shared files (AdminComponent has been overwritten externally before).

---

### Recommended first move
**Tier A #1 (Performance) + #2 (Product-page trust)** — together they give the biggest jump in "feels professional and fast" with the least risk. Say which tier/number to start and I'll execute that pass and verify it.
