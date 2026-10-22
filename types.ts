export type PaymentMethodType = 'easypaisa' | 'jazzcash' | 'ibft';

export type OrderStage = 'PAYMENT_PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export type CourierCarrier = 'TCS' | 'Leopards' | 'Trax' | 'PostEx';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  pricePKR: number;
  originalPricePKR?: number;
  image: string;
  category: string;
  origin: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  specs: string[];
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string; // Pakistani format: 03XX-XXXXXXX
  streetAddress: string;
  city: string;
  postalCode: string;
  orderNotes?: string;
}

export interface PaymentDetails {
  method: PaymentMethodType;
  accountNumber?: string;
  transactionId: string;
  receiptImage?: string; // Data URL or filename
  senderTitle?: string;
  verifiedAt?: string;
}

export interface Order {
  id: string; // e.g. PK-849201
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotalPKR: number;
  shippingFeePKR: number;
  totalPKR: number;
  payment: PaymentDetails;
  stage: OrderStage;
  courier?: {
    carrier: CourierCarrier;
    trackingId: string;
    dispatchedAt: string;
    estimatedDelivery: string;
  };
  notes?: string;
}

export interface EmailReceipt {
  to: string;
  subject: string;
  type: 'CUSTOMER' | 'ADMIN';
  timestamp: string;
  orderId: string;
  htmlContent: string;
}
