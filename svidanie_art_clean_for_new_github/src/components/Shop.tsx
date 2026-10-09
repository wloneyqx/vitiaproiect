"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PortraitArt from "./PortraitArt";
import { materials, type Material } from "@/lib/data";
import { getStartingPrice, getTopSellerLabel, type ProductWithVariants } from "@/lib/products";
import { useCart } from "@/lib/cart/CartContext";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Shop({ products }: { products: ProductWithVariants[] }) {
  const [active, setActive] = useState<Material | null>(null);
  const { addItem } = useCart();

  const filtered = useMemo(() => (active ? products.filter((p) => p.material === active) : products), [products, active]);

  return (
    <>
      <section id="materials" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10 lg:pt-32">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
              Crafted To Last
            </p>
            <h2 className="font-display text-[clamp(2.8rem,8vw,7rem)] font-extrabold uppercase leading-[0.84] tracking-normal text-charcoal">
              Choose your material
            </h2>
          </div>
          <p className="font-sans text-lg leading-relaxed text-charcoal-soft">
            Three ways to hold a memory - filter the collection below by touch, finish, and feel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {materials.map((m, i) => {
            const isActive = active === m.id;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                onClick={() => setActive(isActive ? null : m.id)}
                aria-pressed={isActive}
                className={`group relative cursor-pointer overflow-hidden rounded-sm border text-left transition-[border-color,transform] duration-300 hover:-translate-y-1 ${
                  isActive ? "border-charcoal" : "border-border"
                }`}
              >
                <div className="relative h-72 overflow-hidden bg-charcoal">
                  <PortraitArt
                    material={m.id}
                    seed={`cat-${m.id}`}
                    className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/78 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 bg-ivory px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal">
                    {m.tagline}
                  </span>
                </div>
                <div className="bg-ivory p-6">
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-none text-charcoal">{m.name}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal-soft">{m.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-gold-deep">
                    {isActive ? "Showing this material" : "Filter collection"}
                    <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="mb-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
              Shop The Collection
            </p>
            <h2 className="max-w-3xl font-display text-[clamp(2.5rem,7vw,6.2rem)] font-extrabold uppercase leading-[0.86] tracking-normal text-charcoal">
              Transparent pricing, always
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActive(null)}
              className={`min-h-11 cursor-pointer border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                active === null ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal-soft hover:border-charcoal"
              }`}
            >
              All
            </button>
            {materials.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`min-h-11 cursor-pointer border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                  active === m.id ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal-soft hover:border-charcoal"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: i * 0.035 }}
                className="group overflow-hidden border-b border-charcoal/30 bg-transparent transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-[420px] overflow-hidden bg-charcoal">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <PortraitArt
                      material={p.material}
                      seed={p.id}
                      label={p.name}
                      className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  )}
                  {getTopSellerLabel(p) && (
                    <span className="absolute left-4 top-4 bg-ivory px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-widest text-charcoal">
                      {getTopSellerLabel(p)}
                    </span>
                  )}
                  <span className="absolute right-4 top-4 bg-charcoal/80 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-ivory">
                    {p.occasion}
                  </span>
                </div>

                <div className="py-5">
                  <h3 className="font-display text-3xl font-extrabold uppercase leading-none text-charcoal">{p.name}</h3>
                  <p className="mt-1 font-sans text-sm capitalize text-charcoal-soft">
                    {materials.find((m) => m.id === p.material)?.name}
                  </p>

                  <div className="mt-4 flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-widest text-gold-deep">
                    <ShieldIcon />
                    High-Quality Paint &amp; Materials
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal-soft">Starting from</p>
                      <p className="font-display text-2xl font-extrabold text-charcoal">${getStartingPrice(p)}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Link
                        href={`/products/${p.slug}`}
                        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-charcoal px-4 py-2.5 font-sans text-sm font-semibold text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-ivory"
                      >
                        <EyeIcon />
                        Free Preview
                      </Link>
                      <button
                        onClick={() =>
                          addItem({
                            productId: p.id,
                            slug: p.slug,
                            name: p.name,
                            material: p.material,
                            image: p.imageUrl ?? undefined,
                            unitPrice: getStartingPrice(p),
                          })
                        }
                        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-charcoal px-4 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors duration-200 hover:bg-gold-deep"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}
