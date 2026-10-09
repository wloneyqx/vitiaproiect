import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  AdminUser,
  Material,
  Order,
  OrderItem,
  OrderStatus,
  OrderWithItems,
  PaymentStatus,
  Product,
  ProductVariant,
  ProductWithVariants,
} from "@/lib/types";

type StoredProduct = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
};
type StoredOrderItem = Omit<OrderItem, "createdAt"> & { createdAt: string };
type StoredOrder = Omit<Order, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  items: StoredOrderItem[];
};
type StoredAdminUser = Omit<AdminUser, "createdAt"> & { createdAt: string };

type Store = {
  products: StoredProduct[];
  orders: StoredOrder[];
  adminUsers: StoredAdminUser[];
  nextOrderId: number;
};

const storePath = path.join(process.cwd(), "data", "store.json");

function now() {
  return new Date().toISOString();
}

function productSeed(): StoredProduct[] {
  const stamp = now();
  return [
    {
      id: "p1",
      slug: "the-heirloom",
      name: "Portret pe panza",
      description:
        "Portret personalizat pe panza premium, pregatit pentru rama si pentru un cadou memorabil.",
      price: 299,
      compareAtPrice: 369,
      salePrice: 299,
      salePercent: 19,
      isOnSale: true,
      imageUrl: null,
      material: "canvas",
      category: "Custom Portrait",
      occasion: "Family Tributes",
      theme: null,
      active: true,
      topSellerRank: 1,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
    {
      id: "p2",
      slug: "modern-radiance",
      name: "Portret pe metal",
      description: "Portret luminos pe aluminiu, cu finisaj modern, rezistent si potrivit pentru interioare minimaliste.",
      price: 349,
      compareAtPrice: null,
      salePrice: null,
      salePercent: null,
      isOnSale: false,
      imageUrl: null,
      material: "metal",
      category: "Custom Portrait",
      occasion: "Anniversaries",
      theme: null,
      active: true,
      topSellerRank: 2,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
    {
      id: "p3",
      slug: "woven-devotion",
      name: "Portret din ata",
      description:
        "Portret realizat manual din ata, cu textura vizibila, profunzime si prezenta artistica.",
      price: 899,
      compareAtPrice: null,
      salePrice: null,
      salePercent: null,
      isOnSale: false,
      imageUrl: null,
      material: "string",
      category: "Custom Portrait",
      occasion: "Weddings",
      theme: null,
      active: true,
      topSellerRank: null,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
    {
      id: "p4",
      slug: "golden-hour",
      name: "Poster fotografic",
      description: "Poster personalizat din fotografia ta, imprimat curat pentru perete, birou sau cadou.",
      price: 179,
      compareAtPrice: 229,
      salePrice: 179,
      salePercent: 22,
      isOnSale: true,
      imageUrl: null,
      material: "canvas",
      category: "Custom Portrait",
      occasion: "Birthdays",
      theme: null,
      active: true,
      topSellerRank: null,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
    {
      id: "p5",
      slug: "brushed-eternity",
      name: "Metal print brushed",
      description: "Print pe metal cu aspect editorial, contrast fin si durabilitate foarte buna in timp.",
      price: 449,
      compareAtPrice: null,
      salePrice: null,
      salePercent: null,
      isOnSale: false,
      imageUrl: null,
      material: "metal",
      category: "Custom Portrait",
      occasion: "Weddings",
      theme: null,
      active: true,
      topSellerRank: null,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
    {
      id: "p6",
      slug: "threaded-legacy",
      name: "String art 50x50",
      description: "Portret din fire pentru fotografie de familie, nunta sau cadou personalizat cu impact vizual.",
      price: 999,
      compareAtPrice: 1199,
      salePrice: 999,
      salePercent: 17,
      isOnSale: true,
      imageUrl: null,
      material: "string",
      category: "Custom Portrait",
      occasion: "Family Tributes",
      theme: null,
      active: true,
      topSellerRank: 3,
      createdAt: stamp,
      updatedAt: stamp,
      variants: [],
    },
  ];
}

function emptyStore(): Store {
  return { products: productSeed(), orders: [], adminUsers: [], nextOrderId: 1 };
}

async function writeStore(store: Store) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as Store;
  } catch {
    const store = emptyStore();
    await writeStore(store);
    return store;
  }
}

function toProduct(product: StoredProduct): ProductWithVariants {
  return {
    ...product,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
    variants: [...product.variants],
  };
}

function toOrder(order: StoredOrder): OrderWithItems {
  return {
    ...order,
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(order.updatedAt),
    items: order.items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
}

function filterVariants(product: ProductWithVariants, include: any) {
  const variantsArg = include?.variants;
  if (!variantsArg) return product;
  let variants = [...product.variants];
  if (variantsArg.where?.enabled !== undefined) variants = variants.filter((variant) => variant.enabled === variantsArg.where.enabled);
  if (variantsArg.where?.id?.in) variants = variants.filter((variant) => variantsArg.where.id.in.includes(variant.id));
  variants.sort((a, b) => a.sortOrder - b.sortOrder);
  return { ...product, variants };
}

function sortProducts(products: ProductWithVariants[], orderBy: any) {
  const rules = Array.isArray(orderBy) ? orderBy : orderBy ? [orderBy] : [];
  return [...products].sort((a, b) => {
    for (const rule of rules) {
      if (rule.active) return rule.active === "desc" ? Number(b.active) - Number(a.active) : Number(a.active) - Number(b.active);
      if (rule.createdAt) return rule.createdAt === "desc" ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime();
      if (rule.topSellerRank) {
        const av = a.topSellerRank ?? Number.POSITIVE_INFINITY;
        const bv = b.topSellerRank ?? Number.POSITIVE_INFINITY;
        if (av !== bv) return av - bv;
      }
    }
    return 0;
  });
}

function sortOrders(orders: OrderWithItems[], orderBy: any) {
  if (orderBy?.createdAt === "desc") return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return orders;
}

export const prisma = {
  product: {
    async findMany(args: any = {}) {
      const store = await readStore();
      let products = store.products.map(toProduct);
      if (args.where?.active !== undefined) products = products.filter((product) => product.active === args.where.active);
      if (args.where?.id?.in) products = products.filter((product) => args.where.id.in.includes(product.id));
      return sortProducts(products, args.orderBy).map((product) => filterVariants(product, args.include));
    },

    async findUnique(args: any) {
      const store = await readStore();
      const product = store.products.find((item) => item.id === args.where.id || item.slug === args.where.slug);
      return product ? filterVariants(toProduct(product), args.include) : null;
    },

    async count() {
      const store = await readStore();
      return store.products.length;
    },

    async create(args: { data: Partial<Product> }) {
      const store = await readStore();
      if (store.products.some((item) => item.slug === args.data.slug)) throw new Error("Duplicate product slug.");
      if (args.data.topSellerRank && store.products.some((item) => item.topSellerRank === args.data.topSellerRank)) {
        throw new Error("Duplicate top seller rank.");
      }
      const stamp = now();
      const product: StoredProduct = {
        id: args.data.id ?? `prod_${randomUUID()}`,
        slug: args.data.slug ?? `product-${Date.now()}`,
        name: args.data.name ?? "Untitled product",
        description: args.data.description ?? "",
      price: args.data.price ?? 0,
      compareAtPrice: args.data.compareAtPrice ?? null,
      salePrice: args.data.salePrice ?? null,
      salePercent: args.data.salePercent ?? null,
      isOnSale: args.data.isOnSale ?? false,
      imageUrl: args.data.imageUrl ?? null,
        material: (args.data.material ?? "canvas") as Material,
        category: args.data.category ?? "Custom Portrait",
        occasion: args.data.occasion ?? "Custom",
        theme: args.data.theme ?? null,
        active: args.data.active ?? true,
        topSellerRank: args.data.topSellerRank ?? null,
        createdAt: stamp,
        updatedAt: stamp,
        variants: [],
      };
      store.products.push(product);
      await writeStore(store);
      return toProduct(product);
    },

    async update(args: { where: { id: string }; data: Partial<Product> }) {
      const store = await readStore();
      const index = store.products.findIndex((product) => product.id === args.where.id);
      if (index < 0) throw new Error("Product not found.");
      if (args.data.slug && store.products.some((item) => item.slug === args.data.slug && item.id !== args.where.id)) {
        throw new Error("Duplicate product slug.");
      }
      if (
        args.data.topSellerRank &&
        store.products.some((item) => item.topSellerRank === args.data.topSellerRank && item.id !== args.where.id)
      ) {
        throw new Error("Duplicate top seller rank.");
      }
      const current = store.products[index];
      store.products[index] = {
        ...current,
        id: args.data.id ?? current.id,
        slug: args.data.slug ?? current.slug,
        name: args.data.name ?? current.name,
        description: args.data.description ?? current.description,
        price: args.data.price ?? current.price,
        compareAtPrice: args.data.compareAtPrice === undefined ? current.compareAtPrice : args.data.compareAtPrice,
        salePrice: args.data.salePrice === undefined ? current.salePrice : args.data.salePrice,
        salePercent: args.data.salePercent === undefined ? current.salePercent : args.data.salePercent,
        isOnSale: args.data.isOnSale ?? current.isOnSale ?? false,
        imageUrl: args.data.imageUrl === undefined ? current.imageUrl : args.data.imageUrl,
        material: (args.data.material ?? current.material) as Material,
        category: args.data.category ?? current.category,
        occasion: args.data.occasion ?? current.occasion,
        theme: args.data.theme === undefined ? current.theme : args.data.theme,
        active: args.data.active ?? current.active,
        topSellerRank: args.data.topSellerRank === undefined ? null : args.data.topSellerRank,
        updatedAt: now(),
      };
      await writeStore(store);
      return toProduct(store.products[index]);
    },
  },

  order: {
    async findMany(args: any = {}) {
      const store = await readStore();
      let orders = sortOrders(store.orders.map(toOrder), args.orderBy);
      if (args.take) orders = orders.slice(0, args.take);
      return orders;
    },

    async findUnique(args: any) {
      const store = await readStore();
      const order = store.orders.find((item) => item.id === args.where.id || item.orderNumber === args.where.orderNumber);
      return order ? toOrder(order) : null;
    },

    async count(args: any = {}) {
      const store = await readStore();
      if (args.where?.status) return store.orders.filter((order) => order.status === args.where.status).length;
      return store.orders.length;
    },

    async aggregate(_args: any = {}) {
      const store = await readStore();
      return { _sum: { total: store.orders.reduce((sum, order) => sum + order.total, 0) } };
    },

    async create(args: { data: any }) {
      const store = await readStore();
      const stamp = now();
      const id = store.nextOrderId++;
      const order: StoredOrder = {
        id,
        orderNumber: args.data.orderNumber,
        firstName: args.data.firstName,
        lastName: args.data.lastName,
        email: args.data.email,
        phone: args.data.phone,
        country: args.data.country,
        city: args.data.city,
        address: args.data.address,
        postalCode: args.data.postalCode,
        subtotal: args.data.subtotal,
        shippingCost: args.data.shippingCost ?? 0,
        total: args.data.total,
        status: "NEW",
        paymentStatus: "UNPAID",
        stripePaymentIntentId: null,
        createdAt: stamp,
        updatedAt: stamp,
        items: args.data.items.create.map((item: Partial<OrderItem>) => ({
          id: `item_${randomUUID()}`,
          orderId: id,
          productId: item.productId ?? null,
          variantId: item.variantId ?? null,
          productName: item.productName ?? "",
          productImageUrl: item.productImageUrl ?? null,
          material: (item.material ?? "canvas") as Material,
          size: item.size ?? null,
          style: item.style ?? null,
          unitPrice: item.unitPrice ?? 0,
          quantity: item.quantity ?? 1,
          lineTotal: item.lineTotal ?? 0,
          uploadedPhotoUrl: item.uploadedPhotoUrl ?? null,
          previewImageUrl: item.previewImageUrl ?? null,
          customizationNote: item.customizationNote ?? null,
          createdAt: stamp,
        })),
      };
      store.orders.push(order);
      await writeStore(store);
      return toOrder(order);
    },

    async update(args: { where: { id: number }; data: Partial<Order> }) {
      const store = await readStore();
      const index = store.orders.findIndex((order) => order.id === args.where.id);
      if (index < 0) throw new Error("Order not found.");
      const current = store.orders[index];
      store.orders[index] = {
        ...current,
        orderNumber: args.data.orderNumber ?? current.orderNumber,
        firstName: args.data.firstName ?? current.firstName,
        lastName: args.data.lastName ?? current.lastName,
        email: args.data.email ?? current.email,
        phone: args.data.phone ?? current.phone,
        country: args.data.country ?? current.country,
        city: args.data.city ?? current.city,
        address: args.data.address ?? current.address,
        postalCode: args.data.postalCode ?? current.postalCode,
        subtotal: args.data.subtotal ?? current.subtotal,
        shippingCost: args.data.shippingCost ?? current.shippingCost,
        total: args.data.total ?? current.total,
        status: (args.data.status ?? current.status) as OrderStatus,
        paymentStatus: (args.data.paymentStatus ?? current.paymentStatus) as PaymentStatus,
        stripePaymentIntentId: args.data.stripePaymentIntentId ?? current.stripePaymentIntentId,
        updatedAt: now(),
      };
      await writeStore(store);
      return toOrder(store.orders[index]);
    },
  },

  adminUser: {
    async findUnique(args: any) {
      const store = await readStore();
      const admin = store.adminUsers.find((item) => item.email === args.where.email);
      return admin ? { ...admin, createdAt: new Date(admin.createdAt) } : null;
    },
  },
};
