import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool, query } from "@/lib/mysql";
import type {
  AdminUser,
  Material,
  OrderStatus,
  OrderWithItems,
  PaymentStatus,
  ProductVariant,
  ProductWithVariants,
} from "@/lib/types";

type ProductRow = RowDataPacket & {
  id: number;
  category_id: number;
  category_name: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string;
  base_price: number;
  compare_at_price: number | null;
  sale_price: number | null;
  sale_percent: number | null;
  sku: string;
  stock: number;
  material: Material;
  occasion: string | null;
  theme: string | null;
  active: 0 | 1;
  featured: 0 | 1;
  sort_order: number | null;
  created_at: Date;
  updated_at: Date;
};

type VariantRow = RowDataPacket & {
  id: number;
  product_id: number;
  name: string;
  size: string | null;
  material: Material;
  price: number | null;
  stock: number;
  sku: string;
  active: 0 | 1;
  sort_order: number;
};

type ImageRow = RowDataPacket & {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: 0 | 1;
};

type OrderRow = RowDataPacket & {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_country: string;
  delivery_city: string;
  delivery_address: string;
  delivery_postal_code: string | null;
  subtotal: number;
  discount: number;
  delivery_price: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: Date;
  updated_at: Date;
};

type OrderItemRow = RowDataPacket & {
  id: number;
  order_id: number;
  product_id: number | null;
  variant_id: number | null;
  product_name: string;
  product_image_url: string | null;
  material: Material;
  size: string | null;
  style: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  uploaded_photo_url: string | null;
  preview_image_url: string | null;
  customization_note: string | null;
  created_at: Date;
};

function id(value: string | number | null | undefined) {
  return value === null || value === undefined ? null : String(value);
}

function bool(value: unknown) {
  return value ? 1 : 0;
}

function inParams(prefix: string, values: string[] | number[]) {
  const params: Record<string, unknown> = {};
  const placeholders = values.map((value, index) => {
    const key = `${prefix}${index}`;
    params[key] = value;
    return `:${key}`;
  });
  return { sql: placeholders.join(", "), params };
}

function toProduct(row: ProductRow, variants: ProductVariant[] = [], images: ImageRow[] = []): ProductWithVariants {
  const orderedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = orderedImages.find((image) => image.is_primary) ?? orderedImages[0];
  return {
    id: id(row.id) ?? "",
    slug: row.slug,
    name: row.name,
    description: row.description,
    fullDescription: row.description,
    price: Number(row.base_price),
    compareAtPrice: row.compare_at_price === null ? null : Number(row.compare_at_price),
    salePrice: row.sale_price === null ? null : Number(row.sale_price),
    salePercent: row.sale_percent,
    isOnSale: row.sale_price !== null || row.sale_percent !== null,
    imageUrl: primary?.image_url ?? null,
    galleryImageUrls: orderedImages.map((image) => image.image_url),
    material: row.material,
    category: row.category_name,
    occasion: row.occasion ?? "Custom",
    theme: row.theme,
    featured: Boolean(row.featured),
    displayOrder: row.sort_order,
    active: Boolean(row.active),
    topSellerRank: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    variants,
  };
}

function toVariant(row: VariantRow): ProductVariant {
  return {
    id: id(row.id) ?? "",
    productId: id(row.product_id) ?? "",
    size: row.size ?? row.name,
    style: row.name,
    priceOverride: row.price === null ? null : Number(row.price),
    enabled: Boolean(row.active),
    sortOrder: row.sort_order,
  };
}

function splitName(customerName: string) {
  const parts = customerName.trim().split(/\s+/);
  return {
    firstName: parts.shift() ?? customerName,
    lastName: parts.join(" "),
  };
}

function toOrder(row: OrderRow, items: OrderItemRow[] = []): OrderWithItems {
  const name = splitName(row.customer_name);
  return {
    id: row.id,
    orderNumber: row.order_number,
    firstName: name.firstName,
    lastName: name.lastName,
    email: row.customer_email,
    phone: row.customer_phone,
    country: row.delivery_country,
    city: row.delivery_city,
    address: row.delivery_address,
    postalCode: row.delivery_postal_code ?? "",
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.delivery_price),
    total: Number(row.total),
    status: row.order_status,
    paymentStatus: row.payment_status,
    stripePaymentIntentId: null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    items: items.map((item) => ({
      id: id(item.id) ?? "",
      orderId: item.order_id,
      productId: id(item.product_id),
      variantId: id(item.variant_id),
      productName: item.product_name,
      productImageUrl: item.product_image_url,
      material: item.material,
      size: item.size,
      style: item.style,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.total_price),
      uploadedPhotoUrl: item.uploaded_photo_url,
      previewImageUrl: item.preview_image_url,
      customizationNote: item.customization_note,
      createdAt: new Date(item.created_at),
    })),
  };
}

async function getImages(productIds: string[]) {
  if (productIds.length === 0) return new Map<string, ImageRow[]>();
  const ids = inParams("imageProductId", productIds);
  const rows = await query<ImageRow[]>(
    `SELECT * FROM product_images WHERE product_id IN (${ids.sql}) ORDER BY sort_order ASC`,
    ids.params,
  );
  const map = new Map<string, ImageRow[]>();
  for (const row of rows) {
    const key = id(row.product_id) ?? "";
    map.set(key, [...(map.get(key) ?? []), row]);
  }
  return map;
}

async function getVariants(productIds: string[], onlyEnabled = false, variantIds?: string[]) {
  if (productIds.length === 0) return new Map<string, ProductVariant[]>();
  const productIdParams = inParams("variantProductId", productIds);
  const conditions = [`product_id IN (${productIdParams.sql})`];
  const params: Record<string, unknown> = { ...productIdParams.params };
  if (onlyEnabled) conditions.push("active = TRUE");
  if (variantIds?.length) {
    const variantIdParams = inParams("variantId", variantIds);
    conditions.push(`id IN (${variantIdParams.sql})`);
    Object.assign(params, variantIdParams.params);
  }
  const rows = await query<VariantRow[]>(
    `SELECT * FROM product_variants WHERE ${conditions.join(" AND ")} ORDER BY sort_order ASC`,
    params,
  );
  const map = new Map<string, ProductVariant[]>();
  for (const row of rows) {
    const key = id(row.product_id) ?? "";
    map.set(key, [...(map.get(key) ?? []), toVariant(row)]);
  }
  return map;
}

async function hydrateProducts(rows: ProductRow[], include?: any) {
  const productIds = rows.map((row) => id(row.id) ?? "");
  const onlyEnabled = include?.variants?.where?.enabled === true;
  const variantIds = include?.variants?.where?.id?.in;
  const [variants, images] = await Promise.all([
    include?.variants === false ? Promise.resolve(new Map<string, ProductVariant[]>()) : getVariants(productIds, onlyEnabled, variantIds),
    getImages(productIds),
  ]);
  return rows.map((row) => toProduct(row, variants.get(id(row.id) ?? "") ?? [], images.get(id(row.id) ?? "") ?? []));
}

function productSelect(where = "") {
  return `
    SELECT p.*, c.name AS category_name
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id
    ${where}
  `;
}

async function ensureCategory(name: string, material: Material) {
  const slug = material || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const existing = await query<RowDataPacket[]>(`SELECT id FROM categories WHERE slug = :slug LIMIT 1`, { slug });
  if (existing[0]) return Number(existing[0].id);
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO categories (name, slug, active) VALUES (:name, :slug, TRUE)`,
    { name, slug },
  );
  return result.insertId;
}

async function replaceImages(productId: string, imageUrl: string | null, gallery: string[] = []) {
  await query(`DELETE FROM product_images WHERE product_id = :productId`, { productId });
  const urls = Array.from(new Set([imageUrl, ...gallery].filter((url): url is string => Boolean(url))));
  for (const [index, url] of urls.entries()) {
    await query(
      `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
       VALUES (:productId, :url, '', :sortOrder, :isPrimary)`,
      { productId, url, sortOrder: index, isPrimary: index === 0 },
    );
  }
}

async function replaceVariants(productId: string, material: Material, variants: ProductVariant[]) {
  await query(`DELETE FROM product_variants WHERE product_id = :productId`, { productId });
  for (const [index, variant] of variants.entries()) {
    const sku = `${productId}-${(variant.size || "variant").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
    await query(
      `INSERT INTO product_variants (product_id, name, size, material, price, stock, sku, active, sort_order)
       VALUES (:productId, :name, :size, :material, :price, 100, :sku, :active, :sortOrder)`,
      {
        productId,
        name: variant.style || variant.size || "Variant",
        size: variant.size || null,
        material,
        price: variant.priceOverride,
        sku,
        active: variant.enabled,
        sortOrder: variant.sortOrder ?? index,
      },
    );
  }
}

export const prisma = {
  product: {
    async findMany(args: any = {}) {
      const conditions: string[] = [];
      const params: Record<string, unknown> = {};
      if (args.where?.active !== undefined) {
        conditions.push("p.active = :active");
        params.active = bool(args.where.active);
      }
      if (args.where?.id?.in) {
        const ids = inParams("productId", args.where.id.in);
        conditions.push(`p.id IN (${ids.sql})`);
        Object.assign(params, ids.params);
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await query<ProductRow[]>(
        `${productSelect(where)} ORDER BY p.active DESC, COALESCE(p.sort_order, 9999) ASC, p.created_at DESC`,
        params,
      );
      return hydrateProducts(rows, args.include);
    },

    async findUnique(args: any) {
      const key = args.where.id ? "p.id = :value" : "p.slug = :value";
      const rows = await query<ProductRow[]>(`${productSelect(`WHERE ${key}`)} LIMIT 1`, {
        value: args.where.id ?? args.where.slug,
      });
      const products = await hydrateProducts(rows, args.include);
      return products[0] ?? null;
    },

    async count(args: any = {}) {
      const rows = await query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM products ${args.where?.active !== undefined ? "WHERE active = :active" : ""}`,
        args.where?.active !== undefined ? { active: bool(args.where.active) } : {},
      );
      return Number(rows[0]?.count ?? 0);
    },

    async create(args: { data: any }) {
      const categoryId = await ensureCategory(args.data.category ?? "Custom Portrait", args.data.material ?? "canvas");
      const sku = args.data.sku ?? args.data.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
      const [result] = await getPool().execute<ResultSetHeader>(
        `INSERT INTO products
          (category_id, name, slug, short_description, description, base_price, compare_at_price, sale_price, sale_percent, sku, stock, material, occasion, theme, active, featured, sort_order)
         VALUES
          (:categoryId, :name, :slug, :shortDescription, :description, :price, :compareAtPrice, :salePrice, :salePercent, :sku, :stock, :material, :occasion, :theme, :active, :featured, :sortOrder)`,
        {
          categoryId,
          name: args.data.name,
          slug: args.data.slug,
          shortDescription: args.data.description?.slice(0, 300) ?? null,
          description: args.data.description ?? "",
          price: args.data.price ?? 0,
          compareAtPrice: args.data.compareAtPrice ?? null,
          salePrice: args.data.salePrice ?? null,
          salePercent: args.data.salePercent ?? null,
          sku,
          stock: args.data.stock ?? 100,
          material: args.data.material ?? "canvas",
          occasion: args.data.occasion ?? null,
          theme: args.data.theme || null,
          active: bool(args.data.active ?? true),
          featured: bool(args.data.featured ?? Boolean(args.data.topSellerRank)),
          sortOrder: args.data.topSellerRank ?? args.data.displayOrder ?? null,
        },
      );
      const productId = String(result.insertId);
      await replaceImages(productId, args.data.imageUrl ?? null, args.data.galleryImageUrls ?? []);
      await replaceVariants(productId, args.data.material ?? "canvas", args.data.variants ?? []);
      return this.findUnique({ where: { id: productId }, include: { variants: true } });
    },

    async update(args: { where: { id: string }; data: any }) {
      const current = await this.findUnique({ where: { id: args.where.id }, include: { variants: true } });
      if (!current) throw new Error("Product not found.");
      const material = args.data.material ?? current.material;
      const categoryId = await ensureCategory(args.data.category ?? current.category, material);
      await query(
        `UPDATE products SET
          category_id = :categoryId,
          name = :name,
          slug = :slug,
          short_description = :shortDescription,
          description = :description,
          base_price = :price,
          compare_at_price = :compareAtPrice,
          sale_price = :salePrice,
          sale_percent = :salePercent,
          stock = :stock,
          material = :material,
          occasion = :occasion,
          theme = :theme,
          active = :active,
          featured = :featured,
          sort_order = :sortOrder
         WHERE id = :id`,
        {
          id: args.where.id,
          categoryId,
          name: args.data.name ?? current.name,
          slug: args.data.slug ?? current.slug,
          shortDescription: (args.data.description ?? current.description).slice(0, 300),
          description: args.data.description ?? current.description,
          price: args.data.price ?? current.price,
          compareAtPrice: args.data.compareAtPrice === undefined ? current.compareAtPrice : args.data.compareAtPrice,
          salePrice: args.data.salePrice === undefined ? current.salePrice : args.data.salePrice,
          salePercent: args.data.salePercent === undefined ? current.salePercent : args.data.salePercent,
          stock: args.data.stock ?? 100,
          material,
          occasion: args.data.occasion ?? current.occasion,
          theme: args.data.theme === undefined ? current.theme : args.data.theme || null,
          active: bool(args.data.active ?? current.active),
          featured: bool(args.data.featured ?? current.featured ?? Boolean(args.data.topSellerRank ?? current.topSellerRank)),
          sortOrder: args.data.topSellerRank === undefined ? current.topSellerRank : args.data.topSellerRank,
        },
      );
      if (args.data.imageUrl !== undefined || args.data.galleryImageUrls !== undefined) {
        await replaceImages(args.where.id, args.data.imageUrl ?? current.imageUrl, args.data.galleryImageUrls ?? current.galleryImageUrls ?? []);
      }
      if (args.data.variants !== undefined) await replaceVariants(args.where.id, material, args.data.variants);
      return this.findUnique({ where: { id: args.where.id }, include: { variants: true } });
    },

    async delete(args: { where: { id: string } }) {
      await query(`UPDATE products SET active = FALSE WHERE id = :id`, { id: args.where.id });
      return this.findUnique({ where: { id: args.where.id }, include: { variants: true } });
    },
  },

  order: {
    async findMany(args: any = {}) {
      const rows = await query<OrderRow[]>(
        `SELECT * FROM orders ORDER BY created_at DESC ${args.take ? "LIMIT :take" : ""}`,
        args.take ? { take: Number(args.take) } : {},
      );
      const ids = rows.map((row) => row.id);
      const orderIds = inParams("orderId", ids);
      const items = ids.length
        ? await query<OrderItemRow[]>(`SELECT * FROM order_items WHERE order_id IN (${orderIds.sql}) ORDER BY id ASC`, orderIds.params)
        : [];
      return rows.map((row) => toOrder(row, items.filter((item) => item.order_id === row.id)));
    },

    async findUnique(args: any) {
      const where = args.where.id ? "id = :value" : "order_number = :value";
      const rows = await query<OrderRow[]>(`SELECT * FROM orders WHERE ${where} LIMIT 1`, {
        value: args.where.id ?? args.where.orderNumber,
      });
      if (!rows[0]) return null;
      const items = await query<OrderItemRow[]>(`SELECT * FROM order_items WHERE order_id = :id ORDER BY id ASC`, { id: rows[0].id });
      return toOrder(rows[0], items);
    },

    async count(args: any = {}) {
      const rows = await query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM orders ${args.where?.status ? "WHERE order_status = :status" : ""}`,
        args.where?.status ? { status: args.where.status } : {},
      );
      return Number(rows[0]?.count ?? 0);
    },

    async aggregate(args: any = {}) {
      const conditions: string[] = [];
      const params: Record<string, unknown> = {};
      if (args.where?.paymentStatus) {
        conditions.push("payment_status = :paymentStatus");
        params.paymentStatus = args.where.paymentStatus;
      }
      if (args.where?.status?.not) {
        conditions.push("order_status <> :statusNot");
        params.statusNot = args.where.status.not;
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await query<RowDataPacket[]>(`SELECT COALESCE(SUM(total), 0) AS total FROM orders ${where}`, params);
      return { _sum: { total: Number(rows[0]?.total ?? 0) } };
    },

    async create(args: { data: any }) {
      const connection = await getPool().getConnection();
      try {
        await connection.beginTransaction();
        const customerName = `${args.data.firstName} ${args.data.lastName}`.trim();
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO orders
            (order_number, customer_name, customer_email, customer_phone, delivery_country, delivery_city, delivery_address, delivery_postal_code, subtotal, discount, delivery_price, total, payment_status, order_status)
           VALUES
            (:orderNumber, :customerName, :email, :phone, :country, :city, :address, :postalCode, :subtotal, 0, :shippingCost, :total, 'UNPAID', 'NEW')`,
          {
            orderNumber: args.data.orderNumber,
            customerName,
            email: args.data.email,
            phone: args.data.phone,
            country: args.data.country,
            city: args.data.city,
            address: args.data.address,
            postalCode: args.data.postalCode ?? null,
            subtotal: args.data.subtotal,
            shippingCost: args.data.shippingCost ?? 0,
            total: args.data.total,
          },
        );
        const orderId = result.insertId;
        for (const item of args.data.items.create) {
          await connection.execute(
            `INSERT INTO order_items
              (order_id, product_id, variant_id, product_name, product_image_url, material, size, style, quantity, unit_price, total_price, uploaded_photo_url, preview_image_url, customization_note)
             VALUES
              (:orderId, :productId, :variantId, :productName, :productImageUrl, :material, :size, :style, :quantity, :unitPrice, :lineTotal, :uploadedPhotoUrl, :previewImageUrl, :customizationNote)`,
            {
              orderId,
              productId: item.productId ?? null,
              variantId: item.variantId ?? null,
              productName: item.productName,
              productImageUrl: item.productImageUrl ?? null,
              material: item.material,
              size: item.size ?? null,
              style: item.style ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
              uploadedPhotoUrl: item.uploadedPhotoUrl ?? null,
              previewImageUrl: item.previewImageUrl ?? null,
              customizationNote: item.customizationNote ?? null,
            },
          );
        }
        await connection.commit();
        const created = await this.findUnique({ where: { id: orderId }, include: { items: true } });
        if (!created) throw new Error("Order was created but could not be loaded.");
        return created;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async update(args: { where: { id: number }; data: any }) {
      await query(
        `UPDATE orders SET
          order_number = COALESCE(:orderNumber, order_number),
          order_status = COALESCE(:status, order_status),
          payment_status = COALESCE(:paymentStatus, payment_status)
         WHERE id = :id`,
        {
          id: args.where.id,
          orderNumber: args.data.orderNumber ?? null,
          status: args.data.status ?? null,
          paymentStatus: args.data.paymentStatus ?? null,
        },
      );
      const updated = await this.findUnique({ where: { id: args.where.id }, include: { items: true } });
      if (!updated) throw new Error("Order not found.");
      return updated;
    },
  },

  adminUser: {
    async findUnique(args: any): Promise<AdminUser | null> {
      const rows = await query<(RowDataPacket & AdminUser & { password_hash: string; created_at: Date })[]>(
        `SELECT id, email, password_hash, name, created_at FROM users WHERE email = :email AND role = 'admin' AND active = TRUE LIMIT 1`,
        { email: args.where.email },
      );
      const admin = rows[0];
      return admin
        ? {
            id: id(admin.id) ?? "",
            email: admin.email,
            passwordHash: admin.password_hash,
            name: admin.name,
            createdAt: new Date(admin.created_at),
          }
        : null;
    },
  },
};
