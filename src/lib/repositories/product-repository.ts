import "server-only";

import { prisma } from "@/lib/db";
import type { Material, Product, ProductVariant } from "@/lib/types";

export type ProductFilters = {
  active?: boolean;
  material?: Material;
  query?: string;
  status?: "active" | "hidden" | "all";
  sort?: "newest" | "oldest" | "name" | "price-low" | "price-high" | "featured";
};

export type ProductWriteInput = Partial<Product> & {
  variants?: Partial<ProductVariant>[];
};

function matchesQuery(product: Product, query?: string) {
  if (!query) return true;
  const haystack = [product.name, product.slug, product.description, product.category, product.occasion, product.theme]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function applyProductFilters<T extends Product>(products: T[], filters: ProductFilters = {}) {
  let result = products;
  if (filters.active !== undefined) result = result.filter((product) => product.active === filters.active);
  if (filters.status === "active") result = result.filter((product) => product.active);
  if (filters.status === "hidden") result = result.filter((product) => !product.active);
  if (filters.material) result = result.filter((product) => product.material === filters.material);
  result = result.filter((product) => matchesQuery(product, filters.query));

  return [...result].sort((a, b) => {
    switch (filters.sort) {
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "featured": {
        const rankA = a.topSellerRank ?? Number.POSITIVE_INFINITY;
        const rankB = b.topSellerRank ?? Number.POSITIVE_INFINITY;
        if (rankA !== rankB) return rankA - rankB;
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      case "newest":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
}

export async function getProducts(filters: ProductFilters = {}) {
  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
  });
  return applyProductFilters(products, filters);
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
  });
}

export async function createProduct(data: ProductWriteInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: ProductWriteInput) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getCategories() {
  const { materials } = await import("@/lib/data");
  return materials;
}
