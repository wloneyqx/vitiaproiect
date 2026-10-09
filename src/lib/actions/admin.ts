"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { OrderStatus, PaymentStatus, Material } from "@/lib/types";
import { prisma } from "@/lib/db";
import { query } from "@/lib/mysql";
import { clearAdminSession, createAdminSession, requireAdmin } from "@/lib/admin-auth";
import { saveUploadedFile } from "@/lib/upload";
import { createProduct, deleteProduct, updateProduct } from "@/lib/repositories/product-repository";
import { updateOrderStatus } from "@/lib/repositories/order-repository";

export type AdminActionState = { ok: boolean; message: string };

function validationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Data is invalid.";
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

export async function loginAdmin(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const storedLoginAllowed = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!storedLoginAllowed || !admin) {
    return { ok: false, message: "Email or password is incorrect." };
  }
  await createAdminSession(admin.id, admin.email);
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
  await updateOrderStatus(id, status, paymentStatus);
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
}

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  salePrice: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  salePercent: z.coerce.number().int().min(1).max(95).optional().or(z.literal("").transform(() => undefined)),
  isOnSale: z.string().optional().transform((value) => value === "on"),
  material: z.nativeEnum(Material),
  category: z.string().trim().min(2),
  occasion: z.string().trim().min(2),
  theme: z.string().trim().optional(),
  topSellerRank: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  active: z.string().optional().transform((value) => value === "on"),
});

function parseGalleryUrls(formData: FormData, imageUrl: string | null) {
  const raw = String(formData.get("galleryImageUrls") ?? "");
  const gallery = raw
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => value.startsWith("/uploads/") || value.startsWith("https://") || value.startsWith("http://"));
  return Array.from(new Set([imageUrl, ...gallery].filter((value): value is string => Boolean(value))));
}

function parseVariants(formData: FormData, productId: string) {
  const raw = String(formData.get("variants") ?? "").trim();
  if (!raw) return [];

  return raw.split(/\r?\n/).flatMap((line, index) => {
    const [size, style = "", priceOverride = "", enabled = "true"] = line.split("|").map((part) => part.trim());
    if (!size) return [];
    const parsedPrice = priceOverride ? Number(priceOverride) : null;
    return [{
      id: `${productId || "new"}-${size.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      productId,
      size,
      style: style || null,
      priceOverride: Number.isFinite(parsedPrice) ? parsedPrice : null,
      enabled: enabled.toLowerCase() !== "false",
      sortOrder: index,
    }];
  });
}

export async function saveProduct(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: validationMessage(parsed.error) };

  const image = formData.get("image");
  let imageUrl = String(formData.get("existingImageUrl") ?? "") || null;
  if (image instanceof File && image.size > 0) {
    const upload = await saveUploadedFile(image, "products", 5 * 1024 * 1024);
    if (!upload.ok) return { ok: false, message: upload.error };
    imageUrl = upload.url;
  }

  const { id, ...productData } = parsed.data;
  const variants = parseVariants(formData, id ?? "");
  const data = { ...productData, imageUrl, galleryImageUrls: parseGalleryUrls(formData, imageUrl), variants };
  try {
    if (id) {
      await updateProduct(id, data);
    } else {
      await createProduct(data);
    }
  } catch (error) {
    console.error("Could not save product", error);
    return { ok: false, message: "Could not save product. Slug or top seller rank may already exist." };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product saved." };
}

export async function removeProduct(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const active = z.string().optional().transform((value) => value === "true").parse(formData.get("active"));
  await updateProduct(id, { active });
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
}

export async function saveCategory(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const schema = z.object({
    name: z.string().trim().min(2),
    slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().optional(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    active: z.string().optional().transform((value) => value === "on"),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: validationMessage(parsed.error) };

  try {
    await query(
      `INSERT INTO categories (name, slug, description, active, sort_order)
       VALUES (:name, :slug, :description, :active, :sortOrder)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         active = VALUES(active),
         sort_order = VALUES(sort_order)`,
      parsed.data,
    );
  } catch (error) {
    console.error("Could not save category", error);
    return { ok: false, message: "Could not save category. Check the slug and try again." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { ok: true, message: "Category saved." };
}

export async function toggleReviewApproval(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const approved = z.string().transform((value) => value === "true").parse(formData.get("approved"));
  await query(`UPDATE reviews SET approved = :approved WHERE id = :id`, { id, approved });
  revalidatePath("/admin/reviews");
}

export async function removeReview(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  await query(`DELETE FROM reviews WHERE id = :id`, { id });
  revalidatePath("/admin/reviews");
}

export async function savePromotion(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const schema = z.object({
    name: z.string().trim().min(2),
    code: z.string().trim().optional(),
    discountType: z.enum(["percent", "fixed"]),
    discountValue: z.coerce.number().positive(),
    active: z.string().optional().transform((value) => value === "on"),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: validationMessage(parsed.error) };

  try {
    await query(
      `INSERT INTO promotions (name, code, discount_type, discount_value, active)
       VALUES (:name, NULLIF(:code, ''), :discountType, :discountValue, :active)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         discount_type = VALUES(discount_type),
         discount_value = VALUES(discount_value),
         active = VALUES(active)`,
      parsed.data,
    );
  } catch (error) {
    console.error("Could not save promotion", error);
    return { ok: false, message: "Could not save promotion. Check the code and try again." };
  }

  revalidatePath("/admin/promotions");
  revalidatePath("/promotii");
  return { ok: true, message: "Promotion saved." };
}

export async function togglePromotionActive(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const active = z.string().transform((value) => value === "true").parse(formData.get("active"));
  await query(`UPDATE promotions SET active = :active WHERE id = :id`, { id, active });
  revalidatePath("/admin/promotions");
}
