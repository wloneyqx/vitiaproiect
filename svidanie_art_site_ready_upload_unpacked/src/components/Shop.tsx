"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PortraitArt from "./PortraitArt";
import type { Material } from "@/lib/data";
import { localizeCategory, useI18n } from "@/lib/i18n";
import { getSalePercent, getStartingPrice, type ProductWithVariants } from "@/lib/products";

function ProductImage({ product }: { product: ProductWithVariants }) {
  if (product.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]" />;
  }
  return <PortraitArt material={product.material} seed={product.id} label={product.name} className="h-full w-full transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]" />;
}

export function CategoryGrid() {
  const { locale, t } = useI18n();
  const categories: { id: Material | "promo"; material: Material; href: string }[] = [
    { id: "canvas", material: "canvas", href: "/catalog/canvas" },
    { id: "metal", material: "metal", href: "/catalog/metal" },
    { id: "string", material: "string", href: "/catalog/string" },
    { id: "promo", material: "canvas", href: "/promotii" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
        >
          <Link href={category.href} className="group block overflow-hidden rounded-[8px] bg-charcoal text-ivory">
            <div className="relative aspect-[0.82] overflow-hidden">
              <div className="absolute inset-0 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[14%] group-hover:opacity-65">
                <PortraitArt material={category.material} seed={`category-a-${category.id}`} className="h-full w-full" />
              </div>
              <div className="absolute inset-0 translate-x-full opacity-0 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
                <PortraitArt material={category.material} seed={`category-b-${category.id}`} className="h-full w-full scale-[1.03]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/12 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-[clamp(1.4rem,4.5vw,2.2rem)] font-semibold leading-none">{localizeCategory(category.id, locale)}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ivory/86">
                  {t("explore")}
                  <span className="transition-transform duration-[250ms] group-hover:translate-x-1">→</span>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function ProductGrid({ products, title }: { products: ProductWithVariants[]; title?: string }) {
  const { locale, t } = useI18n();
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-10 lg:py-24">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#c98220]">{title ?? t("allProducts")}</p>
          <h2 className="max-w-3xl text-[clamp(2.5rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-normal text-charcoal">
            {t("catalog")}
          </h2>
        </div>
        <Link href="/promotii" className="hidden min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-charcoal-soft transition-colors duration-[250ms] hover:border-charcoal hover:text-charcoal sm:inline-flex">
          {t("promo")}
        </Link>
      </div>

      <motion.div layout className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className="col-span-full rounded-[8px] border border-border bg-white/48 p-8 text-charcoal-soft">{t("emptyPromo")}</p>
        )}
        {products.map((product, index) => {
          const salePercent = getSalePercent(product);
          return (
            <motion.article
              layout
              key={product.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 6) * 0.04 }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[0.82] overflow-hidden rounded-[8px] bg-charcoal">
                  <ProductImage product={product} />
                  {salePercent && <span className="absolute left-4 top-4 rounded-full bg-ivory/92 px-3 py-1 text-xs font-semibold text-charcoal">-{salePercent}%</span>}
                </div>
                <div className="pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#c98220]">{localizeCategory(product.material, locale)}</p>
                  <h3 className="text-[clamp(1.35rem,3vw,2rem)] font-semibold leading-tight text-charcoal">{product.name}</h3>
                  <div className="mt-3 flex items-center gap-3 text-lg font-semibold text-charcoal">
                    {product.isOnSale && product.compareAtPrice && <span className="text-sm font-medium text-charcoal-soft line-through">{product.compareAtPrice} {t("lei")}</span>}
                    <span>{t("from")} {getStartingPrice(product)} {t("lei")}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

export default function Shop() {
  const { t } = useI18n();
  return (
    <>
      <section id="catalog-intro" className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-10 lg:py-24">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c98220]">{t("products")}</p>
          <h2 className="text-[clamp(3rem,8vw,6.8rem)] font-semibold leading-[0.95] tracking-normal text-charcoal">
            {t("productIntro")}
          </h2>
        </div>
        <CategoryGrid />
      </section>
    </>
  );
}
