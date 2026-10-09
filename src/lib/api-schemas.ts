import { z } from "zod";
import { Material, OrderStatus, PaymentStatus } from "@/lib/types";

const customerUploadUrlSchema = z
  .string()
  .max(600)
  .regex(/^\/(?:api\/customer-uploads|uploads\/customers)\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/);

export const idSchema = z.coerce.number().int().positive();

export const productApiSchema = z.object({
  slug: z.string().trim().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().nullable().optional(),
  salePrice: z.coerce.number().positive().nullable().optional(),
  salePercent: z.coerce.number().int().min(1).max(95).nullable().optional(),
  material: z.nativeEnum(Material),
  category: z.string().trim().min(2),
  occasion: z.string().trim().min(2).optional(),
  theme: z.string().trim().nullable().optional(),
  imageUrl: z.string().trim().max(600).nullable().optional(),
  galleryImageUrls: z.array(z.string().trim().max(600)).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  topSellerRank: z.number().int().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().trim().min(1).max(80),
        style: z.string().trim().max(120).nullable().optional(),
        priceOverride: z.number().positive().nullable().optional(),
        enabled: z.boolean().optional(),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
});

export const cartItemApiSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
  customization: z
    .object({
      uploadedPhotoUrl: customerUploadUrlSchema.optional(),
      previewImageUrl: z.string().max(600).optional(),
      size: z.string().max(80).optional(),
      style: z.string().max(120).optional(),
      note: z.string().max(1000).optional(),
    })
    .optional(),
});

export const orderApiSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2),
  city: z.string().trim().min(2),
  address: z.string().trim().min(5),
  postalCode: z.string().trim().min(2).optional(),
  cart: z.array(cartItemApiSchema).min(1),
});

export const orderStatusApiSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});

export const reviewApiSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().trim().min(2).max(160),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(2000),
});
