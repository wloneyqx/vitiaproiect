"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { languages, localizeCategory, useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart/CartContext";

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M7 8h10l-.7 11H7.7L7 8Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [awayFromTop, setAwayFromTop] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { locale, setLocale, t } = useI18n();
  const current = languages.find((item) => item.code === locale) ?? languages[0];

  useEffect(() => {
    const onScroll = () => setAwayFromTop(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const nav = [
    { label: t("home"), href: "/" },
    { label: t("catalog"), href: "/catalog" },
    { label: localizeCategory("canvas", locale), href: "/catalog/canvas" },
    { label: localizeCategory("metal", locale), href: "/catalog/metal" },
    { label: localizeCategory("string", locale), href: "/catalog/string" },
    { label: t("promo"), href: "/promotii" },
    { label: t("reviews"), href: "/#reviews" },
    { label: t("contact"), href: "/#contact" },
  ];

  const isHome = pathname === "/";
  const solid = awayFromTop || !isHome || menuOpen;
  const hideOnScroll = awayFromTop && isHome && !menuOpen;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-[opacity,transform,background,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hideOnScroll ? "-translate-y-3 bg-ivory/72 opacity-0 shadow-none backdrop-blur-md hover:translate-y-0 hover:opacity-100" : solid ? "bg-ivory/88 opacity-100 shadow-[0_18px_55px_-45px_rgba(7,7,7,0.55)] backdrop-blur-md" : "bg-transparent opacity-100"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 text-ivory sm:px-6 lg:px-10">
        <Link
          href="/"
          className={`font-sans text-xl font-semibold tracking-tight transition-colors duration-[250ms] ${
            solid ? "text-charcoal" : "text-ivory"
          }`}
        >
          svidanie<span className="text-amber-500">_</span>art
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/catalog" className={`editorial-link text-sm font-medium ${solid ? "text-charcoal" : "text-ivory"}`}>
            {t("catalog")}
          </Link>
        </nav>

        <div className={`flex items-center gap-2 ${solid ? "text-charcoal" : "text-ivory"}`}>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) setLanguageOpen(false);
              }}
              className="flex min-h-11 items-center gap-1 rounded-full border border-current/22 px-3 text-sm font-semibold backdrop-blur-sm transition-colors duration-[250ms] hover:bg-white/12"
            >
              <span aria-hidden>{current.flag}</span>
              {current.short}
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.99 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-[8px] border border-white/25 bg-ivory/92 p-1 text-charcoal shadow-[0_18px_50px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                  role="menu"
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => {
                        setLocale(language.code);
                        setLanguageOpen(false);
                      }}
                      className="flex min-h-11 w-full items-center gap-2 rounded-[6px] px-3 text-left text-sm transition-colors duration-[150ms] hover:bg-charcoal/8 focus-visible:bg-charcoal/8"
                      role="menuitem"
                    >
                      <span aria-hidden>{language.flag}</span>
                      {language.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/cart" aria-label={t("bag")} className="relative grid h-11 w-11 place-items-center rounded-full border border-current/22 backdrop-blur-sm">
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c98220] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-current/22 backdrop-blur-sm"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-current transition-transform duration-[250ms] ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-current transition-transform duration-[250ms] ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[76px] bg-ivory/94 text-charcoal backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex h-[calc(100vh-76px)] max-w-7xl flex-col justify-between px-6 py-10 lg:px-10"
            >
              <div>
                <p className="mb-8 text-sm text-charcoal-soft">{t("menu")}</p>
                <div className="grid gap-3">
                  {nav.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-sans text-[clamp(2.4rem,10vw,5.6rem)] font-semibold leading-[0.98] tracking-normal transition-colors duration-[250ms] hover:text-[#c98220] ${
                        index === 5 ? "text-[#c98220]" : "text-charcoal"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div id="contact" className="grid gap-3 text-base text-charcoal-soft sm:grid-cols-3">
                <span>+373 69 877 320</span>
                <span>Telegram</span>
                <span>hello@svidanie.art</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
