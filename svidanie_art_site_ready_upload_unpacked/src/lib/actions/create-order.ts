"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { metalSizes } from "@/lib/data";
import { makeOrderNumber } from "@/lib/order-utils";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
  customization: z
    .object({
      uploadedPhotoUrl: z.string().max(500).optional(),
      previewImageUrl: z.string().max(500).optional(),
      size: z.string().max(80).optional(),
      style: z.string().max(80).optional(),
      note: z.string().max(1000).optional(),
    })
    .optional(),
});

const checkoutSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6),
  country: z.string().trim().min(2),
  city: z.string().trim().min(2),
  address: z.string().trim().min(5),
  postalCode: z.string().trim().min(2),
  cart: z.string().transform((raw, ctx) => {
    try {
      return z.array(cartItemSchema).min(1).parse(JSON.parse(raw));
    } catch {
      ctx.addIssue({ code: "custom", message: "Cart data is invalid." });
      return z.NEVER;
    }
  }),
});

export type CheckoutState = { ok: false; error: string };

export async function createOrder(_state: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Please check your contact and delivery details." };

  const productIds = [...new Set(parsed.data.cart.map((item) => item.productId))];
  const variantIds = parsed.data.cart.map((item) => item.variantId).filter((id): id is string => Boolean(id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { variants: variantIds.length ? { where: { id: { in: variantIds } } } : true },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];

  for (const item of parsed.data.cart) {
    const product = productById.get(item.productId);
    if (!product) return { ok: false, error: "A product in your cart is no longer available." };

    const variant = item.variantId ? product.variants.find((entry) => entry.id === item.variantId && entry.enabled) : null;
    const metalSizePrice =
      product.material === "metal" && item.customization?.size
        ? metalSizes.find((entry) => entry.label === item.customization?.size)?.price
        : undefined;
    const unitPrice = variant?.priceOverride ?? metalSizePrice ?? (product.isOnSale && product.salePrice ? product.salePrice : product.price);
    const size = item.customization?.size ?? variant?.size;
    const style = item.customization?.style ?? variant?.style ?? undefined;

    orderItems.push({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      productImageUrl: product.imageUrl,
      material: product.material,
      size,
      style,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
      uploadedPhotoUrl: item.customization?.uploadedPhotoUrl,
      previewImageUrl: item.customization?.previewImageUrl,
      customizationNote: item.customization?.note,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const created = await prisma.order.create({
    data: {
      orderNumber: `pending-${Date.now()}`,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      city: parsed.data.city,
      address: parsed.data.address,
      postalCode: parsed.data.postalCode,
      subtotal,
      shippingCost: 0,
      total: subtotal,
      items: { create: orderItems },
    },
  });

  const orderNumber = makeOrderNumber(created.id);
  await prisma.order.update({ where: { id: created.id }, data: { orderNumber } });
  redirect(`/order-confirmation/${orderNumber}`);
}
