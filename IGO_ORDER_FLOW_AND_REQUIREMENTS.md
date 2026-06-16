# IGO Agri Mart — Order Flow (live) + Complete E-commerce Requirements

Prepared 16 June 2026.

## 1. The live order journey — now implemented

1. **Add to cart** — customer clicks "Add to Cart" → item is added and a **popup** appears (View Cart / Continue Shopping), plus a persistent floating cart bar. *(works for everyone)*
2. **Proceed to checkout** — if the customer is **not signed in**, they are sent to the **login page**; after login they are returned to their **cart** to continue. *(new login gate)*
3. **Checkout** — address → delivery slot → payment method → **Place Order**. A second sign-in check guards this step, so an order can never be placed without an account. *(backstop gate)*
4. **Order saved to Supabase** — keyed to the customer's user id, so it links to their account.
5. **Customer sees it** in **My Account → Orders** (live: auto-refreshes every 8s).
6. **Admin sees it** in **/admin → Orders** (reads all orders from Supabase).
7. **Admin changes status** (Confirmed → Packed → Shipped/Dispatched → Delivered) → the Supabase order updates →
   - the customer's **Orders page updates live**, and
   - the **notification bell** shows it — **across devices**, because it now reads order-status changes from Supabase (not just this browser).
8. **Search** — the header search filters the live catalog (name, brand, category) with suggestions.

> Requires: **Anonymous** sign-in enabled in Firebase (gives the user id), and the Supabase tables created from `supabase_schema.sql`.

## 2. What a complete e-commerce order needs — and IGO's status

### Frontend (customer side)
| Option | Why | IGO status |
|---|---|---|
| Product listing + search + filters | Find products | ✅ |
| Product detail (images, price, stock, reviews) | Decide | ✅ |
| Add-to-cart + cart popup + cart page | Build order | ✅ |
| Login / signup gate before purchase | Tie order to a person | ✅ (new) |
| Address book + delivery slot | Where/when | ✅ |
| Payment method choice | How to pay | ✅ (selection) · ❌ real gateway |
| Order confirmation + order id | Reassurance | ✅ |
| My Orders + live status tracking | Follow up | ✅ (live) |
| Reorder / cancel | Convenience | ✅ |
| Notifications (bell) | Updates | ✅ (live, cross-device) |
| Coupons / wallet / referral | Retention | ✅ (WELCOME10, IGO Coins) |
| Reviews & ratings | Trust | ✅ |
| Wishlist / back-in-stock | Re-engage | ✅ |
| Invoice / GST bill download | Compliance | ❌ to add |
| Return / refund request flow | Trust | 🟡 policy page only |

### Backend (server / data side)
| Option | Why | IGO status |
|---|---|---|
| Auth & user identity | Know the customer | ✅ Firebase id (→ Supabase Auth later) |
| Profiles store | Save details | ✅ Supabase `profiles` |
| Orders store + status | Source of truth | ✅ Supabase `orders` |
| Reviews / leads store | Engagement | ✅ Supabase `reviews`, `service_leads` |
| **Payment gateway** (Razorpay/PhonePe) | Take money | ❌ needs your merchant keys |
| **Payment verification webhook** | Confirm payment server-side | ❌ needs a small backend/Edge Function |
| **Inventory/stock decrement** | Prevent oversell | 🟡 local; move to DB |
| **Order status workflow** (admin) | Operate | ✅ |
| **Notifications** (SMS/WhatsApp/email) | Reach customer | 🟡 in-app only · ❌ real channels need DLT/Twilio |
| **Shipping/courier integration** (Shiprocket/Delhivery) | Deliver + track | ❌ needs courier account |
| **RLS / security** | Protect data | 🟡 demo policies → tighten with Supabase Auth |
| **Image storage/CDN** | Serve media | 🟡 in-repo → Supabase Storage later |
| Analytics + admin dashboard | Decisions | 🟡 admin panel ✅, analytics ❌ |

## 3. What still needs YOUR accounts/keys (I'll wire each when ready)
1. **Razorpay/PhonePe** merchant keys → real payments + a verification webhook (Edge Function).
2. **DLT SMS / WhatsApp** (MSG91/Gupshup/Twilio) → real OTP + order-update messages.
3. **Shiprocket/Delhivery** account → label printing + live courier tracking on the order.
4. **Supabase Auth** migration → lock each customer to their own data (replace demo RLS).
5. **GST invoice** PDF generation (can be a frontend or Edge Function).

## 4. Best-practice references (what the leaders do)
- **Amazon / Flipkart**: guest browse → login at checkout → saved addresses → multiple payment options → order tracking timeline → returns. (We match the core flow.)
- **Zepto / Blinkit / Instamart**: floating cart, instant add, delivery promise, live tracking. (We have floating cart + slots; add real tracking via courier.)
- **BigHaat / AgroStar**: COD with partial advance, crop-based discovery, advisory, vernacular. (We have COD advance, Buy-by-Crop, TA/EN.)
- **Farmers Factory / IGO Nursery** (your sister sites): login/OTP, basket, trust row, first-order discount. (All matched.)

## 5. Files changed this round (order flow, all additive)
- `CartComponent.tsx` — login gate before checkout.
- `CheckoutComponent.tsx` — sign-in backstop at Place Order.
- `AuthComponent.tsx` — return to cart/checkout after login (`goAfterAuth`).
- `NotificationBell.tsx` — live order-status notifications from Supabase (cross-device).
- `AccountComponent.tsx` — orders auto-refresh (8s poll) for live status.
