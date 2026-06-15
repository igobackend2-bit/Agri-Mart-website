# IGO Agri Mart — Competitive Feature Audit & Gap List

Prepared for: GOKUL R · IGO Group · 13 June 2026
Benchmarked against: **BigHaat, AgroStar, AgriBegri, Agriplex India, Farmkart, Krishibazaar** (+ general e-commerce best practice).

Legend for "IGO status": ✅ Has it · 🟡 Partial / cosmetic only · ❌ Missing

---

## A. Executive summary

The good news: your site already matches competitors on most **storefront** features — category/brand/price/rating filters, product detail with usage & reviews, wishlist, pincode delivery check, coupons, GST, COD/UPI/Card selection, a multi-tab account, voice search, and a Tamil/English toggle. Few agri sites have all of that.

The real gaps are in **transaction trust** and **farmer-engagement** layers:

1. **No real payment processing** — payment methods are *selectable* but not *charged* (no Razorpay/UPI gateway). 🔴 Critical.
2. **OTP is demo-only** — needs DLT SMS. 🔴 Critical (you're already planning this).
3. **No "Buy by Crop" journey** — the single biggest agri-specific feature competitors lead with. 🔴 High.
4. **No loyalty/wallet/coins** — BigHaat coins, AgroStar loyalty drive repeat orders. 🟠 High.
5. **No real shipment tracking / invoices / return policy** — trust killers at scale. 🟠 High.
6. **No mobile app / PWA / WhatsApp ordering** — competitors' main farmer channel. 🟡 Medium.

---

## B. Full audit table

### 1. Discovery & navigation
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Category tree | All | ✅ | Reorganize to your 7 main categories (see prior report). |
| Brand / price / rating filters | BigHaat, AgriBegri | ✅ | — |
| Problem filter (pest/disease/growth) | BigHaat | ✅ | — |
| **Shop / filter by Crop** | **AgroStar, BigHaat** | 🟡 (`crops` field exists in data, not exposed as a filter) | Add a **Crop filter** + **"Buy by Crop" landing pages** ("Tomato → seeds, nutrition, protection kit"). |
| Search autocomplete + voice | — | ✅ (Mic + suggestions) | Move to **server-side search** before catalog passes ~5k items. |
| Product comparison | Some | ❌ | Add compare (nice-to-have). |
| "New / Best-seller / Deal of day" rails | BigHaat | 🟡 | Surface dynamic rails on home. |

### 2. Product detail page (PDP)
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Images, price, MRP, discount | All | ✅ | — |
| Quantity + pack sizes + bulk discount | BigHaat | ✅ | — |
| Usage / dosage / composition tabs | BigHaat, AgroStar | ✅ | — |
| Crop suitability shown on PDP | AgroStar | 🟡 | Display `crops[]` as chips + "works for these crops". |
| Reviews & ratings | All | ✅ (add/fetch) | Add **verified-buyer tag + review photos**. |
| Pincode / delivery-ETA check | BigHaat | 🟡 (checks availability, no ETA/date) | Show **expected delivery date**. |
| Trust badges / certifications | Best practice | 🟡 (`certifications` field exists, not shown) | Render **CIB&RC / ISO / Organic** badges + genuineness seal. |
| Back-in-stock notify | — | ❌ | Add "Notify me" (reuse the new notification system). |
| Q&A on product | BigHaat | ❌ | Optional. |

### 3. Cart, checkout & payment
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Cart with coupons, GST, delivery | All | ✅ | — |
| Add-to-cart popup (view/continue) | All | ✅ | — |
| Payment **method selection** (COD/UPI/Card/NetBanking) | All | ✅ (UI) | — |
| **Real payment gateway (charges money)** | **All** | ❌ | **Integrate Razorpay/PhonePe/Cashfree** — UPI, cards, netbanking, wallets. *The #1 gap.* |
| COD with partial advance | BigHaat | ✅ (20% advance >₹2000) | Tie advance to the real gateway. |
| Serviceable-pincode gate at checkout | BigHaat | 🟡 | Block out-of-area orders before payment. |
| GST invoice / bill PDF | B2B sellers | ❌ | Auto-generate invoice per order. |
| Order confirmation SMS / WhatsApp / email | All | 🟡 (in-app inbox only) | Add real SMS/WhatsApp/email on each status. |

### 4. Account & engagement
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Orders + live status | All | ✅ | — |
| Wishlist | All | ✅ | — |
| Address book | All | ✅ | — |
| Notification bell / inbox | BigHaat | ✅ (just added) | Add a **matching admin bell** for new orders/leads. |
| **Wallet / loyalty coins / rewards** | **BigHaat coins, AgroStar loyalty** | ❌ | Add a **coins/wallet** earned per order, redeemable at checkout. |
| **Referral program** | Common | ❌ | "Refer a farmer, both get ₹X." |
| Reorder / buy-again | Amazon-style | ❌ | One-tap reorder from past orders. |
| Subscription / scheduled refill | — | ❌ | Optional (fertilizer refills). |

### 5. Logistics & trust
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Order tracking page | All | 🟡 (manual status) | Integrate **Shiprocket/Delhivery** for AWB + live tracking. |
| Return / replacement / refund policy | Best practice | ❌ | Add policy pages + a return-request flow. |
| Cancel order | BigHaat | ✅ | — |
| Genuine-product guarantee messaging | BigHaat, Farmkart | 🟡 | Make it prominent (badges, PDP, footer). |
| Privacy / Terms / Refund legal pages | Required for payments | ❌ | Add before going live with payments. |

### 6. Farmer-engagement (agri differentiators)
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| Crop advisory / crop doctor | AgroStar, BigHaat | ✅ (CropDoctor + Knowledge Hub components exist) | Populate with real content; link products. |
| **Mandi prices** | **AgroStar** | ❌ | Add a mandi-price widget (gov/agmarknet feed). |
| **Weather alerts** | **AgroStar (AccuWeather)** | ❌ | Add localized weather + spray-window alerts. |
| Community / Q&A ("Krishi Charcha") | AgroStar | 🟡 (Events/Blog exist) | Add a farmer community/forum. |
| AI assistant / chatbot | — | ✅ (AIAssistantWidget) | Connect to product search + advisory. |
| Academy / courses | — | ✅ (Academy component) | Populate. |
| Farm loans / services | — | ✅ (FarmLoans, Services) | Strong differentiator — keep. |

### 7. Channels, scale & ops
| Feature | Competitors | IGO status | What to add |
|---|---|---|---|
| **Mobile app / PWA** | **BigHaat, AgroStar apps** | ❌ | Ship a **PWA** first (installable, push notifications), native app later. |
| **Missed-call / WhatsApp ordering** | **BigHaat, AgroStar** | ❌ | Add WhatsApp catalog + order link (huge for rural users). |
| Push notifications | Apps | 🟡 (in-app only) | Web push via PWA + the new notification system. |
| Multi-language | AgroStar (vernacular) | ✅ (TA/EN) | Complete Tamil coverage; consider Hindi/Telugu. |
| **Real DB at scale (Supabase/Postgres)** | — | ❌ (Firestore now) | Migrate per your plan; add server search + pagination. |
| **Image bucket + CDN** | — | ❌ | Supabase Storage / Cloudflare R2 + CDN. |
| Load balancer / autoscale | — | ❌ | Add when traffic grows (your plan). |
| SEO (sitemap, schema.org, fast load) | Best practice | 🟡 | Add product schema + sitemap for free traffic. |
| Analytics (GA4) | Best practice | ❌ | Add to see what sells. |
| Automated tests + clean CI build | Best practice | 🟡 | Make `npm run build` pass cleanly in CI. |

---

## C. Prioritized "what to add" — do in this order

**🔴 Phase 1 — Launch-blockers (trust & money)**
1. Real payment gateway (Razorpay/PhonePe) — UPI, card, netbanking, wallet.
2. Real OTP via DLT SMS (replace demo block).
3. Order confirmation via SMS/WhatsApp/email + GST invoice PDF.
4. Return/refund + Privacy/Terms legal pages.
5. Serviceable-pincode gate before payment.

**🟠 Phase 2 — Agri differentiators (repeat business)**
6. **Buy by Crop** filter + crop landing pages + crop chips on PDP.
7. **Wallet / loyalty coins** + referral program.
8. Trust badges & certifications on PDP/checkout.
9. Real shipment tracking (Shiprocket/Delhivery) + delivery ETA.
10. Admin-side notification bell + low-stock alerts.

**🟡 Phase 3 — Reach & scale**
11. Migrate to Supabase + image bucket/CDN + server-side search.
12. PWA (installable + web push) and WhatsApp ordering.
13. Mandi prices + weather alerts widgets.
14. SEO + GA4 analytics + reorder/back-in-stock.

---

## D. Sources
- BigHaat — https://www.bighaat.com/
- AgroStar (Kisan AgriDoctor) — https://corporate.agrostar.in/ · https://play.google.com/store/apps/details?id=com.ulink.agrostar
- AgriBegri — https://agribegri.com/
- Agriplex India — https://agriplexindia.com/
- Farmkart — https://farmkart.com/
- Krishibazaar — https://krishibazaar.in/
- Agri e-commerce best practices — https://www.grazecart.com/blog/how-to-sell-agricultural-products-online · https://dynamicweb.com/resources/insights/blog/ecommerce-for-horticulture-and-agriculture-a-beginners-guide
