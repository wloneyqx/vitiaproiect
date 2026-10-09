"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localizeCategory, useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart/CartContext";

function LogoMark() {
  return (
    <Link href="/" aria-label="svidanie_art" className="flex items-center gap-2">
      <span className="inline-grid h-[26px] w-[44px] grid-cols-[14px_12px_14px] items-center gap-[2px]" aria-hidden>
        <span className="h-5 rounded-[3px] bg-[#E3D9FC]" />
        <span className="h-5 rounded-[3px] bg-[#BF40FA]" />
        <span className="h-5 rounded-[3px] bg-[#E3D9FC]" />
      </span>
      <span className="hidden text-sm font-semibold text-[#E3D9FC] sm:inline">svidanie_art</span>
    </Link>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M7 8h10l-.7 11H7.7L7 8Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero() {
  const { locale, t } = useI18n();
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 20);
    return () => window.clearTimeout(timer);
  }, []);

  const navLinks = [
    { label: t("catalog"), href: "/catalog" },
    { label: localizeCategory("canvas", locale), href: "/catalog/canvas" },
    { label: localizeCategory("metal", locale), href: "/catalog/metal" },
    { label: localizeCategory("string", locale), href: "/catalog/string" },
    { label: t("reviews"), href: "/#reviews" },
  ];

  const revealClass = mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[2px]";
  const revealMotion = "transition-[opacity,transform,filter] duration-[720ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter]";

  return (
    <section id="top" className="svidanie-hero relative min-h-screen overflow-hidden bg-transparent text-white">
      <nav className={`absolute left-1/2 top-5 z-30 -translate-x-1/2 whitespace-nowrap ${revealMotion} ${revealClass}`} aria-label="Homepage">
        <div className="hero-nav-card flex items-center gap-3 rounded-[9999px] px-3 py-2.5 sm:gap-6 sm:px-4">
          <LogoMark />
          <div className="hidden items-center gap-5 md:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-[#E3D9FC]/82 transition-colors duration-200 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="ml-1 flex items-center gap-3 sm:ml-4">
            <Link href="/catalog" className="hidden text-sm font-medium text-[#E3D9FC]/82 transition-colors duration-200 hover:text-white sm:inline">
              {t("catalog")}
            </Link>
            <span className="relative inline-flex overflow-visible">
              <Link
                href="/cart"
                aria-label={t("bag")}
                className="inline-flex min-h-9 items-center gap-2 rounded-[9999px] bg-[#E3D9FC] px-4 py-1.5 pr-7 text-sm font-bold text-[#040607] shadow-[0_0_24px_rgba(191,64,250,0.32)] transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.035] hover:shadow-[0_0_32px_rgba(191,64,250,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3D9FC] active:scale-[0.98]"
              >
                <BagIcon />
                <span className="hidden sm:inline">{t("bag")}</span>
              </Link>
              {itemCount > 0 && (
                <span className="pointer-events-none absolute right-1 top-1 z-10 grid h-5 min-w-5 place-items-center rounded-[9999px] bg-[#BF40FA] px-1.5 text-center text-[10px] font-bold leading-none text-white">
                  {itemCount}
                </span>
              )}
            </span>
          </div>
        </div>
      </nav>

      <div className={`absolute left-0 right-0 z-20 w-full px-4 ${revealMotion} ${revealClass}`} style={{ top: "112px", transitionDelay: "80ms" }}>
        <h1 className="hero-title select-none">svidanie_art</h1>
      </div>

      <div className={`fx-button-layer absolute left-1/2 top-[56%] z-20 flex w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 ${revealMotion} ${revealClass}`} style={{ transitionDelay: "160ms" }}>
        <Link
          href="/catalog"
          className="fx-start-btn"
        >
          <span className="fx-text">{t("catalog")}</span>
          <span className="fx-icon" aria-hidden>
            <svg viewBox="0 0 1024 1024" className="h-4 w-4">
              <path d="M779.180132 473.232045 322.354755 16.406668c-21.413706-21.413706-56.121182-21.413706-77.534887 0-21.413706 21.413706-21.413706 56.122205 0 77.534887l418.057421 418.057421L244.819868 930.057421c-21.413706 21.413706-21.413706 56.122205 0 77.534887 10.706853 10.706853 24.759917 16.059767 38.767955 16.059767s28.061103-5.353938 38.767955-16.059767L779.180132 550.767955C800.593837 529.35425 800.593837 494.64575 779.180132 473.232045z" />
            </svg>
          </span>
          <span className="fx-circle-overlay" aria-hidden />
        </Link>
        <Link
          href="#how-it-works"
          className="fx-start-btn"
        >
          <span className="fx-text">Comanda portret</span>
          <span className="fx-circle-overlay" aria-hidden />
        </Link>
      </div>

      <div className={`absolute bottom-20 left-0 right-0 z-20 px-5 sm:bottom-24 sm:px-10 md:bottom-28 ${revealMotion} ${revealClass}`} style={{ transitionDelay: "220ms" }}>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <p className="hero-copy-text max-w-[300px] text-sm font-medium leading-relaxed text-white/88">
            Portrete personalizate pe metal, canvas si string art, pregatite pentru cadouri si interioare memorabile.
          </p>
          <p className="hero-copy-text max-w-[300px] text-sm font-medium leading-relaxed text-white/88 md:text-right">
            Alegi fotografia, noi adaptam compozitia pentru materialul potrivit si livram lucrarea finisata.
          </p>
        </div>
      </div>
    </section>
  );
}
