# IGO Agri Mart — Full Website Plan
> Based on Farmers Factory (famersfactory.com) reference site
> Brand: **IGO Agri Mart** | Division: Distribution | IGO Group

---

## 🎯 What is IGO Agri Mart?
A comprehensive agricultural distribution network supplying **seeds, fertilizers, pesticides, tools, and essential farming equipment** to farmers across India. This is a B2B/B2C platform targeting farmers, agri-entrepreneurs, and rural buyers — different from Farmers Factory (which sells organic produce to consumers).

---

## 🏗️ Tech Stack (Recommended)
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes or Node.js/Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** NextAuth.js (Email + Phone OTP)
- **Payments:** Razorpay
- **Storage:** Cloudinary (product images)
- **Hosting:** Vercel (frontend) + Railway/Supabase (DB)

---

## 🌐 CUSTOMER-FACING PAGES

---

### PAGE 1: Home Page (`/`)
**Purpose:** Brand intro + product discovery + trust building

**Sections (top to bottom):**
1. **Navbar**
   - Logo (IGO Agri Mart)
   - Language toggle (EN/Tamil)
   - Search bar (product search)
   - Cart icon with badge
   - Login / My Account

2. **Marquee Banner** (like Farmers Factory)
   - "Free Delivery on orders above ₹999"
   - "Seeds • Fertilizers • Equipment • Pesticides"
   - "Trusted by 10,000+ Farmers across Tamil Nadu"
   - "Genuine Products • Best Prices • Fast Delivery"

3. **Hero Section**
   - Full-width banner image (farmer in field / agri equipment)
   - Headline: *"Everything a Farmer Needs — Delivered to Your Farm"*
   - Sub-headline: Seeds, Fertilizers, Tools & Equipment
   - CTA buttons: [Shop Now] [Browse Categories]

4. **Category Cards Grid**
   - Seeds (50+ Varieties) → `/products?category=Seeds`
   - Fertilizers (Organic & Chemical) → `/products?category=Fertilizers`
   - Pesticides & Herbicides → `/products?category=Pesticides`
   - Farming Tools & Equipment → `/products?category=Equipment`
   - Irrigation Systems → `/products?category=Irrigation`
   - Plant Protection → `/products?category=PlantProtection`

5. **Featured / Best Seller Products Strip**
   - Horizontal scroll of product cards
   - Each card: Image, Name, Price, Add to Cart button

6. **Why IGO Agri Mart (Trust Section)**
   - 4 icon cards:
     - ✅ Genuine Certified Products
     - 🚚 Delivery to Farm Gate
     - 💰 Best Market Prices
     - 📞 Expert Agri Support

7. **IGO Group Ecosystem Section** (same as Farmers Factory "26 Verticals")
   - Show all IGO Group brands as cards
   - Highlight IGO Agri Mart as active
   - Links to other sister sites

8. **Testimonials Section**
   - 3–4 farmer testimonials with photo, name, location

9. **Banner / Offer Strip**
   - Seasonal offers (e.g., "Kharif Season Sale — Up to 20% Off")

10. **Footer**
    - Logo + tagline
    - Links: Products, About, Contact, Privacy Policy, Terms
    - Social: Instagram, Facebook, YouTube
    - © 2026 IGO Agri Mart. All Rights Reserved.

---

### PAGE 2: Products / Shop Page (`/products`)
**Purpose:** Browse and filter all products

**Layout:**
- **Left Sidebar (Filters)**
  - Category (Seeds, Fertilizers, Equipment…)
  - Brand/Manufacturer
  - Price Range slider
  - Rating filter
  - In Stock only toggle
  - Certifications (Organic, IARI Approved, etc.)

- **Main Grid**
  - Sort by: Popular / Price Low-High / Price High-Low / Newest
  - Product cards (image, name, brand, price, rating, Add to Cart)
  - Pagination or infinite scroll

- **Top Filter Bar (mobile)**
  - Filter & Sort bottom sheet on mobile

**Category Sub-pages:**
- `/products?category=Seeds`
- `/products?category=Fertilizers`
- `/products?category=Pesticides`
- `/products?category=Equipment`
- `/products?category=Irrigation`

---

### PAGE 3: Product Detail Page (`/products/[slug]`)
**Purpose:** Full product info + buy action

**Sections:**
1. Breadcrumb (Home > Fertilizers > Urea 50kg)
2. Image gallery (main + thumbnails)
3. Product name, brand, SKU
4. Price (MRP + discounted price + % off badge)
5. Stock status (In Stock / Out of Stock)
6. Quantity selector
7. Buttons: [Add to Cart] [Buy Now]
8. Product Description (rich text)
9. Specifications table (Weight, Composition, Usage, Dosage)
10. How to Use / Application Guide
11. Certifications & Approvals
12. Customer Reviews & Ratings
13. Related Products strip

---

### PAGE 4: Cart Page (`/cart`)
**Purpose:** Review items before checkout

**Sections:**
- Cart items list (image, name, qty +/-, price, remove)
- Price Summary (subtotal, delivery, discount, total)
- Coupon code input
- [Proceed to Checkout] button
- Continue Shopping link

---

### PAGE 5: Checkout Page (`/checkout`)
**Purpose:** Address + payment

**Steps (stepper UI):**
1. Delivery Address (add/select saved address)
2. Order Summary review
3. Payment (Razorpay — UPI, Card, Net Banking, COD)
4. Order Confirmed page with order ID

---

### PAGE 6: Auth Page (`/auth`)
**Purpose:** Login / Register

**Tabs:**
- Login: Phone OTP or Email + Password
- Register: Name, Phone, Email, Address (Village/District/Pincode), Password
- Forgot Password flow

---

### PAGE 7: User Dashboard (`/account`)
**Purpose:** Customer's personal area

**Sub-pages:**
- `/account/orders` — Order history + tracking
- `/account/orders/[id]` — Order detail + invoice download
- `/account/addresses` — Saved delivery addresses
- `/account/wishlist` — Saved products
- `/account/profile` — Edit personal info
- `/account/support` — Raise a ticket / chat

---

### PAGE 8: Order Tracking (`/track`)
- Enter Order ID + Phone
- Show real-time status: Placed → Confirmed → Dispatched → Out for Delivery → Delivered

---

### PAGE 9: About Us (`/about`)
- IGO Agri Mart story, mission, vision
- IGO Group connection
- Team section
- Stats: Farmers Served, Products Available, Districts Covered

---

### PAGE 10: Contact Page (`/contact`)
- Contact form (Name, Phone, Message, Category: Order/Product/Other)
- WhatsApp chat link
- Phone & Email
- Office address + Google Maps embed

---

### PAGE 11: Static Pages
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions
- `/refund` — Refund & Return Policy
- `/shipping` — Shipping & Delivery Info
- `/faq` — FAQ accordion

---

## 🔐 ADMIN PANEL PAGES (`/admin/...`)

---

### ADMIN PAGE 1: Dashboard (`/admin`)
**Overview metrics:**
- Total Orders Today / This Week / This Month
- Total Revenue (with chart)
- New Customers
- Low Stock Alerts
- Top Selling Products
- Recent Orders table (last 10)
- Quick actions: Add Product, View Orders, Add Offer

---

### ADMIN PAGE 2: Products Management (`/admin/products`)
**List view:**
- Table: Image, Name, Category, Price, Stock, Status, Actions (Edit/Delete)
- Search + filter by category/status
- Bulk actions (activate/deactivate/delete)
- [+ Add Product] button

**Add/Edit Product (`/admin/products/new` or `/admin/products/[id]`):**
- Product name, slug (auto-generated)
- Category selector
- Brand / Manufacturer
- Description (rich text editor)
- Specifications (key-value pairs)
- Images (multi-upload, drag & reorder)
- Pricing: MRP, Selling Price, Bulk Price
- Stock: Quantity, Unit (kg/litre/bag/piece), Low Stock Alert Threshold
- Weight/Dimensions (for shipping)
- Tags, SEO Meta Title & Description
- Status: Active / Draft / Out of Stock

---

### ADMIN PAGE 3: Categories Management (`/admin/categories`)
- Tree/list of categories
- Add / Edit / Delete categories
- Set category image and description
- Reorder categories (drag & drop)

---

### ADMIN PAGE 4: Orders Management (`/admin/orders`)
**List view:**
- Table: Order ID, Customer, Date, Items, Total, Payment Status, Delivery Status
- Filter by: Date range, Status, Payment method
- Search by Order ID / Phone

**Order Detail (`/admin/orders/[id]`):**
- Customer info + delivery address
- Items ordered (image, name, qty, price)
- Payment details (method, transaction ID, status)
- Order status stepper: Update status (Confirmed → Packed → Dispatched → Delivered)
- Add tracking number / courier partner
- Print Invoice button
- Refund / Cancel order

---

### ADMIN PAGE 5: Customers Management (`/admin/customers`)
- List: Name, Phone, Email, Location, Orders Count, Total Spent, Join Date
- Customer detail: Profile + full order history
- Search / filter by district, registration date
- Export to Excel/CSV

---

### ADMIN PAGE 6: Inventory Management (`/admin/inventory`)
- All products with current stock levels
- Filter: Low Stock / Out of Stock
- Bulk stock update (import CSV)
- Stock history log (who updated, when, by how much)
- Low stock email/SMS alert settings

---

### ADMIN PAGE 7: Offers & Coupons (`/admin/offers`)
- List of active/expired coupons
- Create coupon: Code, Discount type (% or flat), Min order, Expiry, Usage limit
- Banner offers: Upload promo banners for homepage
- Flash Sale manager: Set sale price + timer per product

---

### ADMIN PAGE 8: Reports & Analytics (`/admin/reports`)
- Revenue report (daily/weekly/monthly/custom range)
- Best selling products chart
- Category-wise sales breakdown
- Customer acquisition chart (new vs returning)
- District/Location-wise orders heatmap
- Export reports as PDF / Excel

---

### ADMIN PAGE 9: Delivery & Shipping (`/admin/delivery`)
- Delivery zones management (Pincode → delivery charge)
- Free delivery threshold setting
- Courier partner integrations (Shiprocket / Delhivery)
- Delivery person assignment (if local delivery)

---

### ADMIN PAGE 10: Banner & Content Management (`/admin/content`)
- Homepage banner images (upload, reorder, link)
- Marquee text lines (edit running text)
- About Us page content editor
- FAQ editor (add/edit/delete questions)
- Notification messages (in-app alerts for users)

---

### ADMIN PAGE 11: Settings (`/admin/settings`)
- Store info (name, logo, address, phone, email)
- Social media links
- Payment gateway config (Razorpay keys)
- SMS / Email notification templates
- Tax settings (GST %)
- Admin user management (add sub-admins with roles)

---

## 📱 MOBILE CONSIDERATIONS
- All pages must be fully responsive (mobile-first)
- Bottom navigation bar on mobile: Home, Categories, Cart, Account
- Touch-friendly product cards and filters
- WhatsApp float button on all pages

---

## 🎨 DESIGN LANGUAGE (Based on Farmers Factory)
- **Primary Color:** Deep Green (`#1a5c2a`) — agriculture, trust
- **Accent Color:** Amber/Gold (`#f59e0b`) — harvest, energy
- **Background:** Off-white (`#f9fafb`)
- **Font:** Clean sans-serif (Inter or Poppins)
- **Style:** Clean, modern, nature-inspired
- **Cards:** Rounded corners, subtle shadows, hover animations
- **Icons:** Lucide React or Heroicons

---

## 📋 DEVELOPMENT PHASES

### Phase 1 — Core (Weeks 1–3)
- [ ] Project setup (Next.js + Tailwind + DB)
- [ ] Auth system (Login/Register)
- [ ] Home page (all sections)
- [ ] Products listing + filter page
- [ ] Product detail page

### Phase 2 — Commerce (Weeks 4–5)
- [ ] Cart + Checkout + Razorpay payment
- [ ] Order confirmation + email
- [ ] User dashboard (orders, profile)
- [ ] Order tracking page

### Phase 3 — Admin Panel (Weeks 6–8)
- [ ] Admin dashboard
- [ ] Products CRUD
- [ ] Orders management
- [ ] Customers list
- [ ] Inventory management
- [ ] Coupons & offers

### Phase 4 — Polish (Week 9–10)
- [ ] Reports & Analytics
- [ ] Content management (banners, FAQ)
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] Mobile QA & testing
- [ ] Launch

---

## 📁 FOLDER STRUCTURE (Next.js)
```
igo-agrimart/
├── app/
│   ├── (customer)/
│   │   ├── page.tsx              # Home
│   │   ├── products/
│   │   │   ├── page.tsx          # Shop
│   │   │   └── [slug]/page.tsx   # Product Detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── auth/page.tsx
│   │   ├── account/
│   │   │   ├── orders/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard
│   │       ├── products/
│   │       ├── orders/
│   │       ├── customers/
│   │       ├── inventory/
│   │       ├── offers/
│   │       ├── reports/
│   │       └── settings/
│   └── api/
│       ├── products/
│       ├── orders/
│       ├── auth/
│       └── admin/
├── components/
│   ├── ui/           # Buttons, Cards, Modals
│   ├── layout/       # Navbar, Footer, Sidebar
│   ├── home/         # Hero, CategoryGrid, etc.
│   ├── products/     # ProductCard, Filters, etc.
│   └── admin/        # AdminTable, Charts, etc.
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── razorpay.ts
├── prisma/
│   └── schema.prisma
└── public/
    └── images/
```

---

*Plan prepared for IGO Agri Mart website development.*
*Reference: famersfactory.com | IGO Group Division*
