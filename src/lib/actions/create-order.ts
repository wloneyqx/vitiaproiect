"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createOrderFromPayload } from "@/lib/services/order-service";

const customerUploadUrlSchema = z
  .string()
  .max(600)
  .regex(/^\/(?:api\/customer-uploads|uploads\/customers)\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/);

const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
  customization: z
    .object({
      uploadedPhotoUrl: customerUploadUrlSchema.optional(),
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

  let created;
  try {
    created = await createOrderFromPayload({ ...parsed.data, postalCode: parsed.data.postalCode });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not create order." };
  }
  redirect(`/order-confirmation/${created.orderNumber}`);
}
