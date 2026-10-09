"use client";

import Link from "next/link";
import { useRef } from "react";
import PortraitArt from "./PortraitArt";
import type { Material } from "@/lib/data";
import { localizeCategory, useI18n } from "@/lib/i18n";
import { getProductImages, getSalePercent, getStartingPrice, type ProductWithVariants } from "@/lib/products";
import { useGsapReveal } from "@/lib/useGsapReveal";

function ProductImage({ product }: { product: ProductWithVariants }) {
  const images = getProductImages(product);
  if (images.length > 0) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[14%] group-hover:opacity-65" />
        {images[1] && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[1]} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full translate-x-full object-cover opacity-0 transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
          </>
        )}
      </>
    );
  }
  return <PortraitArt material={product.material} seed={product.id} label={product.name} className="h-full w-full transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]" />;
}

export function CategoryGrid({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { locale, t } = useI18n();
  const gridRef = useRef<HTMLDivElement>(null);
  useGsapReveal(gridRef, { selector: ".js-category-card", y: 16, stagger: 0.055 });
  const dark = variant === "dark";
  const categories: { id: Material; material: Material; href: string }[] = [
    { id: "canvas", material: "canvas", href: "/catalog/canvas" },
    { id: "metal", material: "metal", href: "/catalog/metal" },
    { id: "string", material: "string", href: "/catalog/string" },
  ];

  return (
    <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="js-category-card"
        >
          <Link href={category.href} className={dark ? "liquid-glass group block overflow-hidden rounded-[28px] text-white" : "liquid-glass group block overflow-hidden rounded-[28px] bg-charcoal text-ivory"}>
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
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({ products, title, variant = "light" }: { products: ProductWithVariants[]; title?: string; variant?: "light" | "dark" }) {
  const { locale, t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: ".js-product-card", y: 16, stagger: 0.045, batchMax: 6 });
  const dark = variant === "dark";
  return (
    <section ref={sectionRef} id="products" className={dark ? "mx-auto max-w-7xl bg-transparent px-4 py-18 font-sans text-white sm:px-6 lg:px-10 lg:py-24" : "mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-10 lg:py-24"}>
      <div className={dark ? "section-glass-frame section-glass-heading mb-10" : "mb-10 flex items-end justify-between gap-5"}>
        <div>
          <p className={dark ? "liquid-glass mb-6 inline-flex rounded-full px-7 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70" : "mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#c98220]"}>{title ?? t("allProducts")}</p>
          <h2 className={dark ? "max-w-3xl font-serif text-[clamp(3.1rem,7vw,6rem)] italic leading-[0.92] tracking-normal text-white" : "max-w-3xl text-[clamp(2.5rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-normal text-charcoal"}>
            {t("catalog")}
          </h2>
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className={dark ? "liquid-glass col-span-full rounded-[28px] p-8 text-white/65" : "liquid-glass col-span-full rounded-[28px] p-8 text-charcoal-soft"}>{t("emptyPromo")}</p>
        )}
        {products.map((product) => {
          const salePercent = getSalePercent(product);
          return (
            <article
              key={product.id}
              className={dark ? "js-product-card group" : "js-product-card group"}
            >
              <Link href={`/products/${product.slug}`} className={dark ? "liquid-glass block rounded-[28px] p-3" : "block"}>
                <div className={dark ? "liquid-glass relative aspect-[0.82] overflow-hidden rounded-[28px] bg-white/[0.03]" : "liquid-glass relative aspect-[0.82] overflow-hidden rounded-[28px] bg-charcoal"}>
                  <ProductImage product={product} />
                  {salePercent && <span className={dark ? "liquid-glass-strong absolute left-4 top-4 rounded-[9999px] px-3 py-1 text-xs font-semibold text-white" : "absolute left-4 top-4 rounded-full bg-ivory/92 px-3 py-1 text-xs font-semibold text-charcoal"}>-{salePercent}%</span>}
                </div>
                <div className={dark ? "liquid-glass mt-3 rounded-[22px] p-4" : "pt-4"}>
                  <p className={dark ? "mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45" : "mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#c98220]"}>{localizeCategory(product.material, locale)}</p>
                  <h3 className={dark ? "text-[clamp(1.35rem,3vw,2rem)] font-medium leading-tight text-white" : "text-[clamp(1.35rem,3vw,2rem)] font-semibold leading-tight text-charcoal"}>{product.name}</h3>
                  <div className={dark ? "mt-3 flex items-center gap-3 text-lg font-semibold text-white" : "mt-3 flex items-center gap-3 text-lg font-semibold text-charcoal"}>
                    {product.isOnSale && product.compareAtPrice && <span className={dark ? "text-sm font-medium text-white/45 line-through" : "text-sm font-medium text-charcoal-soft line-through"}>{product.compareAtPrice} {t("lei")}</span>}
                    <span>{t("from")} {getStartingPrice(product)} {t("lei")}</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
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

export function DarkShop() {
  const { t } = useI18n();
  return (
    <section id="catalog-intro" className="mx-auto max-w-7xl px-4 py-18 text-white sm:px-6 lg:px-10 lg:py-24">
      <div className="mb-10 max-w-4xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/45">{t("products")}</p>
        <h2 className="font-serif text-[clamp(3rem,8vw,6.4rem)] italic leading-[0.95] tracking-normal text-white">
          {t("productIntro")}
        </h2>
      </div>
      <CategoryGrid variant="dark" />
    </section>
  );
}
