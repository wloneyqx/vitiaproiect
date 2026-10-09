import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/repositories/product-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  const staticRoutes = ["", "/catalog", "/promotii"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const products = await getProducts({ active: true }).catch(() => []);
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
