export type { ProductWithVariants } from "@/lib/types";
import type { ProductWithVariants } from "@/lib/types";

export function getStartingPrice(product: ProductWithVariants): number {
  const enabled = product.variants.filter((v) => v.enabled);
  const base = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  if (enabled.length === 0) return base;
  return Math.min(...enabled.map((v) => v.priceOverride ?? base));
}

export function getTopSellerLabel(product: { topSellerRank: number | null }): string | null {
  return product.topSellerRank ? `#${product.topSellerRank} Top Seller` : null;
}

export function getSalePercent(product: {
  isOnSale?: boolean;
  salePercent?: number | null;
  compareAtPrice?: number | null;
  salePrice?: number | null;
  price: number;
}): number | null {
  if (!product.isOnSale) return null;
  if (product.salePercent) return product.salePercent;
  const oldPrice = product.compareAtPrice ?? product.price;
  const newPrice = product.salePrice ?? product.price;
  if (oldPrice <= newPrice) return null;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}
