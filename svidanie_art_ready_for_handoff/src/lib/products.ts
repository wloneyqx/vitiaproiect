export type { ProductWithVariants } from "@/lib/types";
import type { ProductWithVariants } from "@/lib/types";

export function getStartingPrice(product: ProductWithVariants): number {
  const enabled = product.variants.filter((v) => v.enabled);
  if (enabled.length === 0) return product.price;
  return Math.min(...enabled.map((v) => v.priceOverride ?? product.price));
}

export function getTopSellerLabel(product: { topSellerRank: number | null }): string | null {
  return product.topSellerRank ? `#${product.topSellerRank} Top Seller` : null;
}
