export interface Product {
  id: string;
  name: string;
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
}

export interface Address {
  id: string;
  name: string;
  phone: string;
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
  status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  deliveryAddress: Address;
  createdAt: any; // Firestore timestamp or UTC string
  phone: string;
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

