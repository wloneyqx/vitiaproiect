"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, localizeCategory, useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart/CartContext";
import { gsap, motionTokens } from "@/lib/gsap";

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
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const menu = languageMenuRef.current;
    if (!menu) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(menu);

    if (languageOpen) {
      gsap.set(menu, { display: "block" });
      gsap.fromTo(
        menu,
        { autoAlpha: 0, y: reduceMotion ? 0 : -5, scale: reduceMotion ? 1 : 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: reduceMotion ? 0 : 0.22, ease: motionTokens.ease.standard, overwrite: "auto" }
      );
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        y: reduceMotion ? 0 : -5,
        scale: reduceMotion ? 1 : 0.99,
        duration: reduceMotion ? 0 : 0.18,
        ease: motionTokens.ease.soft,
        overwrite: "auto",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
  }, [languageOpen]);

  useEffect(() => {
    const overlay = mobileMenuRef.current;
    const panel = mobilePanelRef.current;
    if (!overlay || !panel) return;

    const links = panel.querySelectorAll(".js-mobile-link");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf([overlay, panel, links]);

    if (menuOpen) {
      gsap.set(overlay, { display: "block" });
      gsap
        .timeline({ defaults: { ease: motionTokens.ease.standard, overwrite: "auto" } })
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.24 })
        .fromTo(panel, { autoAlpha: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: reduceMotion ? 0 : 0.36 }, 0.02)
        .fromTo(links, { autoAlpha: 0, y: reduceMotion ? 0 : 12 }, { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.32, stagger: motionTokens.stagger.tight }, 0.12);
    } else {
      gsap
        .timeline({
          defaults: { ease: motionTokens.ease.soft, overwrite: "auto" },
          onComplete: () => gsap.set(overlay, { display: "none" }),
        })
        .to(links, { autoAlpha: 0, y: reduceMotion ? 0 : 8, duration: reduceMotion ? 0 : 0.14, stagger: 0.02 }, 0)
        .to(panel, { autoAlpha: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.99, duration: reduceMotion ? 0 : 0.22 }, 0)
        .to(overlay, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.2 }, 0.04);
    }
  }, [menuOpen]);

  const nav = [
    { label: t("home"), href: "/" },
    { label: t("catalog"), href: "/catalog" },
    { label: localizeCategory("canvas", locale), href: "/catalog/canvas" },
    { label: localizeCategory("metal", locale), href: "/catalog/metal" },
    { label: localizeCategory("string", locale), href: "/catalog/string" },
    { label: t("reviews"), href: "/#reviews" },
    { label: t("contact"), href: "/#contact" },
  ];

  const isHome = pathname === "/";
  const hideOnScroll = awayFromTop && isHome && !menuOpen;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-5 transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-10 ${
        hideOnScroll ? "-translate-y-3 opacity-0 hover:translate-y-0 hover:opacity-100" : "opacity-100"
      }`}
    >
      <div className="liquid-glass mx-auto flex h-[56px] max-w-7xl items-center justify-between rounded-[9999px] px-3 text-white sm:px-4">
        <Link
          href="/"
          className="font-sans text-sm font-light tracking-tight text-white/85 transition-colors duration-[250ms] hover:text-white sm:text-base"
        >
          svidanie<span className="text-white/55">_</span>art
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/catalog" className="text-sm font-light text-white/70 transition-colors duration-200 hover:text-white">
            {t("catalog")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-white">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) setLanguageOpen(false);
              }}
              className="flex min-h-10 items-center gap-1 rounded-[9999px] px-3 text-sm font-medium text-white/75 transition-colors duration-[250ms] hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden>{current.flag}</span>
              {current.short}
            </button>
                <div
                  ref={languageMenuRef}
                  style={{ display: "none" }}
                  aria-hidden={!languageOpen}
                  className="liquid-glass-strong absolute right-0 mt-2 w-48 overflow-hidden rounded-[18px] p-1 text-white shadow-[0_18px_50px_-35px_rgba(255,255,255,0.22)]"
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
                      className="flex min-h-11 w-full items-center gap-2 rounded-[9999px] px-3 text-left text-sm text-white/75 transition-colors duration-[150ms] hover:bg-white/10 hover:text-white focus-visible:bg-white/10"
                      role="menuitem"
                    >
                      <span aria-hidden>{language.flag}</span>
                      {language.label}
                    </button>
                  ))}
                </div>
          </div>

          <span className="relative inline-grid overflow-visible">
            <Link href="/cart" aria-label={t("bag")} className="liquid-glass-strong grid h-10 w-10 place-items-center rounded-[9999px] text-white transition-transform duration-200 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70">
              <BagIcon />
            </Link>
            {itemCount > 0 && (
              <span className="pointer-events-none absolute right-0 top-0 z-10 grid h-5 min-w-5 place-items-center rounded-[9999px] bg-white px-1.5 text-center text-[10px] font-bold leading-none text-black">
                {itemCount}
              </span>
            )}
          </span>

          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="liquid-glass-strong grid h-10 w-10 place-items-center rounded-[9999px] text-white transition-transform duration-200 hover:scale-[1.04]"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-current transition-transform duration-[250ms] ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-current transition-transform duration-[250ms] ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

          <div
            ref={mobileMenuRef}
            style={{ display: "none" }}
            aria-hidden={!menuOpen}
            className="fixed inset-0 top-[86px] bg-black/94 text-white backdrop-blur-xl"
          >
            <div
              ref={mobilePanelRef}
              className="mx-auto flex h-[calc(100vh-86px)] max-w-7xl flex-col justify-between px-6 py-10 lg:px-10"
            >
              <div>
                <p className="mb-8 text-sm text-white/55">{t("menu")}</p>
                <div className="grid gap-3">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="js-mobile-link font-sans text-[clamp(2.4rem,10vw,5.6rem)] font-semibold leading-[0.98] tracking-normal text-white transition-colors duration-[250ms] hover:text-white/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div id="contact" className="grid gap-3 text-base text-white/58 sm:grid-cols-3">
                <span>+373 69 877 320</span>
                <span>Telegram</span>
                <span>hello@svidanie.art</span>
              </div>
            </div>
          </div>
    </header>
  );
}
