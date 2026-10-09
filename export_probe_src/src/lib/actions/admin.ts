"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { OrderStatus, PaymentStatus, Material } from "@/lib/types";
import { prisma } from "@/lib/db";
import { clearAdminSession, createAdminSession, requireAdmin } from "@/lib/admin-auth";
import { saveUploadedFile } from "@/lib/upload";

export type AdminActionState = { ok: boolean; message: string };

export async function loginAdmin(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const envLoginAllowed = email === process.env.ADMIN_EMAIL?.toLowerCase() && password === process.env.ADMIN_PASSWORD;
  const storedLoginAllowed = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!envLoginAllowed && !storedLoginAllowed) {
    return { ok: false, message: "Email or password is incorrect." };
  }
  await createAdminSession(admin?.id ?? "env-admin", admin?.email ?? email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(formData.get("id"));
  const status = z.nativeEnum(OrderStatus).parse(formData.get("status"));
  const paymentStatus = z.nativeEnum(PaymentStatus).parse(formData.get("paymentStatus"));
  await prisma.order.update({ where: { id }, data: { status, paymentStatus } });
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
}

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  material: z.nativeEnum(Material),
  occasion: z.string().trim().min(2),
  theme: z.string().trim().optional(),
  topSellerRank: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  active: z.string().optional().transform((value) => value === "on"),
});

export async function saveProduct(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Product data is invalid. Check slug, price, and required fields." };

  const image = formData.get("image");
  let imageUrl = String(formData.get("existingImageUrl") ?? "") || null;
  if (image instanceof File && image.size > 0) {
    const upload = await saveUploadedFile(image, "products", 5 * 1024 * 1024);
    if (!upload.ok) return { ok: false, message: upload.error };
    imageUrl = upload.url;
  }

  const { id, ...productData } = parsed.data;
  const data = { ...productData, imageUrl };
  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data });
    }
  } catch {
    return { ok: false, message: "Could not save product. Slug or top seller rank may already exist." };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product saved." };
}
