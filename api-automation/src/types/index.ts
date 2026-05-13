// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductListResponse {
  total: number;
  page: number;
  limit: number;
  data: Product[];
}

export interface ProductQueryParams {
  category?: string;
  page?: number;
  limit?: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  message: string;
  cartTotal: number;
}

export interface CartLineItem {
  productId: number;
  quantity: number;
  price?: number;
  name?: string;
}

export interface CartResponse {
  items: CartLineItem[];
  subtotal: number;
  itemCount: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  orderId: string;
  status: OrderStatus;
  total: number;
  items: CartLineItem[];
  createdAt: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  total: number;
  status: OrderStatus;
  message: string;
}

export interface CancelOrderResponse {
  orderId: string;
  status: string;
  message: string;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentMethod = "credit_card" | "debit_card" | "upi" | "net_banking";

export interface PaymentRequest {
  orderId: string;
  method: PaymentMethod;
}

export interface PaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
  message: string;
}

export interface PaymentDetails {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: string;
  processedAt: string;
}

// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}
