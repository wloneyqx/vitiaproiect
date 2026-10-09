"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { materials, occasions, themes } from "@/lib/data";
import { useCart } from "@/lib/cart/CartContext";

type MenuKey = "occasions" | "materials" | null;

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M3 4h2l1.6 9.6a2 2 0 002 1.6h8.2a2 2 0 002-1.7L20 8H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      if (window.scrollY > 12) setOpenMenu(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      onMouseLeave={() => setOpenMenu(null)}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-ivory/92 backdrop-blur-md shadow-[0_1px_0_0_var(--color-border)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="#top" className="font-display text-xl font-extrabold tracking-tight text-charcoal">
          svidanie<span className="text-gold-deep">_</span>art
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          <button
            onMouseEnter={() => setOpenMenu("occasions")}
            className="editorial-link cursor-pointer font-sans text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft transition-colors hover:text-charcoal"
          >
            Occasions
          </button>
          <button
            onMouseEnter={() => setOpenMenu("materials")}
            className="editorial-link cursor-pointer font-sans text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft transition-colors hover:text-charcoal"
          >
            Materials
          </button>
          <a
            href="#how-it-works"
            onMouseEnter={() => setOpenMenu(null)}
            className="editorial-link font-sans text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft transition-colors hover:text-charcoal"
          >
            Process
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid h-11 w-11 cursor-pointer place-items-center border border-border transition-colors hover:border-charcoal"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-charcoal font-sans text-[10px] font-bold text-ivory">
                {itemCount}
              </span>
            )}
          </Link>
          <a
            href="#products"
            className="hidden min-h-11 cursor-pointer items-center border border-charcoal bg-charcoal px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors duration-200 hover:bg-transparent hover:text-charcoal sm:inline-flex"
          >
            Start Your Portrait
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center border border-border lg:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-charcoal transition-transform duration-300 ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-charcoal transition-transform duration-300 ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden border-y border-border bg-ivory lg:block"
          >
            <div className="mx-auto max-w-7xl px-10 py-9">
              {openMenu === "occasions" && (
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Occasions</p>
                    <ul className="space-y-3">
                      {occasions.map((o) => (
                        <li key={o}>
                          <a href="#products" className="font-display text-3xl font-extrabold uppercase leading-none text-charcoal transition-colors hover:text-gold-deep">
                            {o}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Themes</p>
                    <ul className="space-y-3">
                      {themes.map((t) => (
                        <li key={t}>
                          <a href="#products" className="font-display text-3xl font-extrabold uppercase leading-none text-charcoal transition-colors hover:text-gold-deep">
                            {t}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {openMenu === "materials" && (
                <div className="grid grid-cols-3 gap-5">
                  {materials.map((m) => (
                    <a key={m.id} href="#materials" className="group border border-border p-6 transition-colors hover:border-charcoal">
                      <p className="font-display text-2xl font-extrabold uppercase leading-none text-charcoal">{m.name}</p>
                      <p className="mt-2 font-sans text-sm text-charcoal-soft">{m.tagline}</p>
                      <span className="mt-5 inline-block font-sans text-xs font-semibold uppercase tracking-widest text-gold-deep transition-transform group-hover:translate-x-1">
                        Explore -&gt;
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-y border-border bg-ivory lg:hidden"
          >
            <div className="flex flex-col gap-7 px-4 py-8 sm:px-6">
              <div>
                <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Occasions</p>
                <div className="flex flex-wrap gap-3">
                  {occasions.map((o) => (
                    <a key={o} href="#products" className="font-display text-xl font-extrabold uppercase text-charcoal" onClick={() => setMobileOpen(false)}>
                      {o}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Materials</p>
                <div className="flex flex-wrap gap-3">
                  {materials.map((m) => (
                    <a key={m.id} href="#materials" className="font-display text-xl font-extrabold uppercase text-charcoal" onClick={() => setMobileOpen(false)}>
                      {m.name}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="#products"
                onClick={() => setMobileOpen(false)}
                className="border border-charcoal bg-charcoal px-5 py-3 text-center font-sans text-sm font-semibold text-ivory"
              >
                Start Your Portrait
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
