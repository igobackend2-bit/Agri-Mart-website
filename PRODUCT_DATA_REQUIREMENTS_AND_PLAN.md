# AgriMart — Product Data Requirements & Implementation Plan
*Drawing on the IGO Import & Export marketplace and other IGO sites in D:\Igo-websites*

## 1. What I reviewed

I went through every IGO project folder to see what product/business data models and features already exist across the group, since they're the most relevant "competitors and references" available — closer to your own brand standards than any outside company.

- **Igo-Import&Export** (`igo-marketplace`, Supabase/Next.js B2B trade platform) — has a full `schema.sql` for an international trade marketplace, plus a `competitor-audit-report.md` benchmarking it against Alibaba, IndiaMART, TradeIndia, ExportersIndia, KisaanTrade, Go4WorldBusiness
- **Igo-Crop Care** (Next.js/Supabase agri-input store) — `lib/types.ts` defines a richer agri-product schema than AgriMart currently has
- **Igo-Farmer Factory** (Next.js/Supabase fresh-produce marketplace) — the most feature-advanced sibling site; has 40+ components covering traceability, live harvest feeds, AI assistants, loyalty, and sustainability features
- **Igo-Nursery** — simpler flat product catalog with `unit`/`category`/`mrp` fields
- **Igo-Agri estate, Igo-Palm Cafe, Igo-Protein Cuts, Igo-Main website, ERP HUB** — reviewed for shared patterns (SEO setup, AI services, ERP/ops integration)

## 2. Product data fields AgriMart is missing (vs. its sibling sites)

AgriMart's current `Product` type (in `src/types.ts`) covers the basics: name, brand, category, price/MRP/discount, stock, images, description, composition, usage, rating, and tags. Comparing it against what the sibling sites use in production reveals fields worth adding:

**From Igo-Crop Care's schema** (closest sibling — same agri-input business):
- `dosage` — application rate per acre/litre (critical for pesticides/fertilizers, currently missing from AgriMart)
- `crops[]` — explicit list of crops a product is suitable for (enables "find products for my crop" filtering — more powerful than the current free-text `problemFilter`)
- `isOrganic` — boolean flag for organic-certified inputs (a major purchase driver, and a clean filter facet)
- `subCategory` — AgriMart has it on `Category` but not consistently exposed as a filter on `Product`

**From Igo-Farmer Factory's schema/components** (most advanced sibling):
- `traceability` data — farm/batch origin info shown via a `TraceabilityBadge` component (where was this grown/manufactured, when, by whom)
- `purityCertificate` / lab test or compliance documents — shown via `PurityCertificate` component (very relevant for fertilizers/pesticides where farmers care about authenticity/fake-product risk)
- `sustainabilityScore` — shown via `SustainabilityMeter`/`SustainabilityDashboard`
- `freshnessOrShelfLife` — `FreshnessMeter` equivalent; for AgriMart this would map to expiry dates on chemicals/seeds (a real compliance need)
- harvest/batch event feed — `HarvestTicker`/`FarmCommandCenter` show real-time "X just happened" updates; AgriMart could adapt this to "stock just restocked" / "new batch arrived" trust signals

**From Igo-Import&Export's `schema.sql`** (for any B2B/bulk-order ambitions):
- `moq` (minimum order quantity) and `unit` (Metric Ton/kg/Litre) — relevant if AgriMart wants to serve dealers/bulk buyers, not just retail farmers
- `origin_country` / `origin_region` — useful for imported inputs or branded-origin produce
- `certifications[]` (name, issuer, validity, document URL, verified flag) — a structured version of what AgriMart currently has nowhere; directly reusable for organic/ISO/phytosanitary claims
- `incoterms` — only relevant if AgriMart ever ships in bulk/export; otherwise skip
- `price_range` + RFQ model — useful pattern if you want a "bulk enquiry" path for large orders alongside normal retail checkout

**From Igo-Nursery:**
- explicit `unit` field on every product (e.g., "Pack of 20", "5kg block", "Per piece") — AgriMart's `Product` type has no unit field, which is a real gap for agri-inputs sold by weight/volume/pack-count

## 3. Recommended additions to AgriMart's `Product` type

```ts
export interface Product {
  // ...existing fields (id, name, slug, brand, category, price, mrp, etc.)
  unit: string;                 // "1kg", "500ml", "Pack of 10", "Per acre kit"
  dosage?: string;              // "2ml per litre of water" — critical for chemicals
  crops?: string[];             // ["Tomato", "Paddy", "Mango"] — structured crop-fit filter
  isOrganic?: boolean;          // organic certification flag
  expiryDate?: string;          // shelf-life / compliance for chemicals & seeds
  certifications?: {            // structured cert data (modeled on Import&Export schema)
    name: string;               // "ISO 9001", "Organic India", "CIB&RC Registered"
    issuer?: string;
    validUntil?: string;
    documentUrl?: string;
    isVerified?: boolean;
  }[];
  origin?: string;              // manufacturing location / batch origin for traceability
  batchNumber?: string;         // for traceability + recalls
  moq?: number;                 // minimum order qty, for dealer/bulk-buyer view
}
```

These are additive — none break the existing schema, and the offline `SEED_PRODUCTS` fallback can be updated incrementally.

## 4. Implementation plan

### Phase 1 — Data model & content (foundation)
1. Extend `src/types.ts` `Product` interface with the fields above
2. Update `seedData.ts` and the admin product form (`AdminComponent.tsx`) to capture `unit`, `dosage`, `crops`, `isOrganic`, `expiryDate`, `certifications`, `origin`, `batchNumber`
3. Backfill existing Firestore product records with these fields (a one-time admin migration script using `dbHelper.adminAddOrUpdateProduct`)
4. Update Firestore security rules (`firestore.rules`) if new sub-collections (e.g., certifications) are introduced

### Phase 2 — Surface the new data in the UI
5. Add `unit` and `dosage` to product cards and the product detail page — farmers need to know "how much do I actually need to buy"
6. Add an `isOrganic` filter facet and badge (category/search pages + product cards)
7. Add a `crops[]`-based filter ("Shop by crop": Tomato, Paddy, Mango, Cotton…) — this is a much stronger discovery path for farmers than generic categories, and several sibling sites already model crop-based browsing
8. Build a `TraceabilityBadge`/`PurityCertificate`-style component (adapted from Farmer Factory) showing origin, batch number, and certification documents on the product detail page — this directly addresses farmers' single biggest concern: counterfeit agri-inputs
9. Add expiry-date display for chemicals/seeds (compliance + trust)

### Phase 3 — Bulk/dealer path (optional, if you want B2B reach)
10. Add an `moq` field and a "Bulk Enquiry / Dealer Pricing" CTA on relevant product pages, modeled on the Import & Export marketplace's RFQ flow (`rfqs`/`trade_leads` tables) — lets dealers and large farms request quotes without disrupting the retail checkout
11. If useful, cross-link AgriMart's branded/own-label products (`isIgoOwn: true`) into the Import & Export marketplace catalog so they're export-ready — the schema (`products`, `categories`, `certifications`) is already compatible in shape with the additions above

### Phase 4 — Trust & differentiation features (borrowing proven patterns from sibling sites)
12. "Just restocked" / "New batch arrived" live ticker (adapted from Farmer Factory's `HarvestTicker`) — builds urgency and freshness perception
13. Sustainability/organic scoring badges where relevant (adapted from `SustainabilityMeter`)
14. AI-assisted product matching: "Tell us your crop and problem, we'll recommend the right input" — combines the new `crops[]`/`problemFilter` fields with the already-installed (but unused) Gemini SDK flagged in the earlier site analysis

### Phase 5 — Verification
15. QA pass: confirm new fields render correctly in English and Tamil, admin CRUD works end-to-end, and the offline seed fallback still loads without errors
16. Spot-check Firestore rules so new fields/sub-collections don't open unintended write access

## 5. Net effect

This plan turns AgriMart's product catalog from "name, price, description" into the kind of structured, trust-building data that the sibling IGO platforms already prove works — crop-fit filtering, dosage clarity, organic/certification badges, traceability, and (optionally) a bulk/dealer path mirrored on the Import & Export marketplace's B2B model. None of it requires new infrastructure; it's largely schema extension + UI surfacing + content backfill, reusing patterns your own team has already built and validated elsewhere.
