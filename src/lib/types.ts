export type UserRole = "buyer" | "seller" | "admin";

export type OrderStatus = "placed" | "packed" | "shipped" | "delivered" | "cancelled";

export type PaymentMethod = "jazzcash" | "easypaisa" | "card" | "cod";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  shopName: string;
  photo: string;
  city: string;
  province: string;
  bio: string;
  story: string;
  specialty: string;
  joinedAt: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  isNew: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  artisanId: string;
  materials: string[];
  location: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  featured: boolean;
  launchCollection: boolean;
  createdAt: string;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  artisanId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  artisanId: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  commission: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
  trackingNote?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  productId?: string;
  productName?: string;
  lastMessage: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  artisanId?: string;
  phone?: string;
  referralCode: string;
  referredBy?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  against: string;
  reason: string;
  status: "open" | "in_review" | "resolved";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  role: "buyer" | "seller";
}
