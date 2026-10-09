export const Material = {
  metal: "metal",
  string: "string",
  canvas: "canvas",
} as const;

export type Material = (typeof Material)[keyof typeof Material];

export const OrderStatus = {
  NEW: "NEW",
  CONFIRMED: "CONFIRMED",
  IN_PRODUCTION: "IN_PRODUCTION",
  READY: "READY",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  style: string | null;
  priceOverride: number | null;
  enabled: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  material: Material;
  category: string;
  occasion: string;
  theme: string | null;
  active: boolean;
  topSellerRank: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export type OrderItem = {
  id: string;
  orderId: number;
  productId: string | null;
  variantId: string | null;
  productName: string;
  productImageUrl: string | null;
  material: Material;
  size: string | null;
  style: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  uploadedPhotoUrl: string | null;
  previewImageUrl: string | null;
  customizationNote: string | null;
  createdAt: Date;
};

export type Order = {
  id: number;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  createdAt: Date;
};
