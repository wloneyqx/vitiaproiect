import "server-only";

import { prisma } from "@/lib/db";
import { metalSizes } from "@/lib/data";
import { sendOrderEmails } from "@/lib/email";
import { makeOrderNumber } from "@/lib/order-utils";
import { sendOrderTelegram } from "@/lib/telegram";
import type { z } from "zod";
import type { orderApiSchema } from "@/lib/api-schemas";

export async function createOrderFromPayload(data: z.infer<typeof orderApiSchema>) {
  const productIds = [...new Set(data.cart.map((item) => item.productId))];
  const variantIds = data.cart.map((item) => item.variantId).filter((item): item is string => Boolean(item));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { variants: variantIds.length ? { where: { id: { in: variantIds } } } : true },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];

  for (const item of data.cart) {
    const product = productById.get(item.productId);
    if (!product) throw new Error("A product in your cart is no longer available.");

    const variant = item.variantId ? product.variants.find((entry) => entry.id === item.variantId && entry.enabled) : null;
    const metalSizePrice =
      product.material === "metal" && item.customization?.size
        ? metalSizes.find((entry) => entry.label === item.customization?.size)?.price
        : undefined;
    const unitPrice = variant?.priceOverride ?? metalSizePrice ?? (product.isOnSale && product.salePrice ? product.salePrice : product.price);

    orderItems.push({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      productImageUrl: product.imageUrl,
      material: product.material,
      size: item.customization?.size ?? variant?.size,
      style: item.customization?.style ?? variant?.style ?? undefined,
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
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      address: data.address,
      postalCode: data.postalCode ?? "",
      subtotal,
      shippingCost: 0,
      total: subtotal,
      items: { create: orderItems },
    },
  });

  const orderNumber = makeOrderNumber(created.id);
  const updated = await prisma.order.update({ where: { id: created.id }, data: { orderNumber } });
  if (!updated) throw new Error("Order was created but could not be loaded.");
  await Promise.all([sendOrderEmails(updated), sendOrderTelegram(updated)]);
  return updated;
}
