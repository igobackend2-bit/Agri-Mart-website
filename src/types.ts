export interface Product {
  id: string;
  name: string;
  displayName?: string; // clean, brand-free product name for compact UI labels
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  images: string[];
  description: string;
  composition: string;
  usage: string;
  rating: number;
  reviewCount: number;
  isIgoOwn: boolean;
  problemFilter?: string; // e.g. "Pest Control", "Disease Control", "Growth Boosters", "Manures & Fertilizers"
  tags?: string[];

  // --- Extended agri-commerce fields (trust, discovery & compliance) ---
  unit?: string;          // e.g. "1kg", "500ml", "Pack of 10", "Per acre kit"
  dosage?: string;        // e.g. "2ml per litre of water — spray at 15-day intervals"
  crops?: string[];       // e.g. ["Tomato", "Paddy", "Mango", "Cotton"] — structured crop-fit filter
  isOrganic?: boolean;    // organic-certified input flag
  expiryDate?: string;    // shelf-life / compliance date for chemicals & seeds (ISO date string)
  origin?: string;        // manufacturing location / batch origin, for traceability
  batchNumber?: string;   // batch/lot number, for traceability + recall tracking
  moq?: number;           // minimum order quantity, for dealer/bulk-buyer enquiries
  certifications?: ProductCertification[];
}

export interface ProductCertification {
  name: string;            // e.g. "ISO 9001", "Organic India", "CIB&RC Registered"
  issuer?: string;
  validUntil?: string;     // ISO date string
  documentUrl?: string;
  isVerified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  type: 'igo_own' | 'third_party';
  logo?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[]; // array of productIds
  profileComplete?: boolean; // true once the customer finishes the join/profile form
  passwordHash?: string;     // demo only — real auth/passwords move to Supabase/DLT later
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItem {
  id: string; // matches product.id
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Dispatched' | 'Delivered' | 'Cancelled';
  deliveryAddress: Address;
  createdAt: any; // Firestore timestamp or UTC string
  phone: string;
  deliverySlot?: string; // chosen delivery slot (e.g. "Tomorrow, 6–9 AM")
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  category: string;
  provider: string;
  priceQuote: string;
  features: string[];
}

export interface ServiceLead {
  id: string;
  serviceId: string;
  serviceName: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  district: string;
  date: string;
  acres: number;
  cropType: string;
  additionalNotes?: string;
  createdAt: string;
  status: 'Pending' | 'Contacted' | 'Scheduled' | 'Completed';
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  instructor: string;
  lessonsCount: number;
  duration: string;
  level: string;
  originalPrice: number;
  currentPrice: number;
  description: string;
  modules: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  createdAt: string;
  tags?: string[];
}
