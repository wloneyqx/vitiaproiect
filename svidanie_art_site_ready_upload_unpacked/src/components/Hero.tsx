"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import PortraitArt from "./PortraitArt";
import { useI18n } from "@/lib/i18n";

const heroSlides = [
  {
    material: "canvas" as const,
    seed: "premium-photo-hero",
    kicker: "Canvas portrait",
    accent: "#c98220",
    glow: "rgba(201,130,32,0.32)",
  },
  {
    material: "metal" as const,
    seed: "hero-metal-editorial",
    kicker: "Metal print",
    accent: "#6f8793",
    glow: "rgba(111,135,147,0.28)",
  },
  {
    material: "string" as const,
    seed: "hero-thread-studio",
    kicker: "Thread portrait",
    accent: "#9b6f45",
    glow: "rgba(155,111,69,0.3)",
  },
];

export default function Hero() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useTransform(mx, [-1, 1], reduceMotion ? [0, 0] : [-8, 8]);
  const y = useTransform(my, [-1, 1], reduceMotion ? [0, 0] : [-6, 6]);
  const slide = heroSlides[active];
  const nextSlide = heroSlides[(active + 1) % heroSlides.length];
  const previousSlide = heroSlides[(active + heroSlides.length - 1) % heroSlides.length];
  const decorativeBackground = useMemo(
    () =>
      `linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.52)),radial-gradient(circle at 72% 24%,${slide.glow},transparent 34%),linear-gradient(110deg,rgba(0,0,0,0.78),rgba(0,0,0,0.16) 54%,rgba(0,0,0,0.46))`,
    [slide.glow]
  );

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % heroSlides.length), 4800);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-charcoal text-ivory"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
        my.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      }}
    >
      {heroSlides.map((item, index) => (
        <motion.div
          key={item.seed}
          initial={false}
          animate={{
            opacity: active === index ? 1 : 0,
            scale: active === index ? 1 : 1.035,
            filter: active === index ? "saturate(1.04) contrast(1.02)" : "saturate(0.9) contrast(0.98)",
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <PortraitArt material={item.material} seed={item.seed} label="svidanie_art" className="h-full w-full opacity-95" />
        </motion.div>
      ))}
      <motion.div
        key={slide.seed}
        initial={false}
        animate={{ background: decorativeBackground }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(244,239,230,0.22),transparent)]" />

      <motion.div style={{ x, y }} className="pointer-events-none absolute right-[8%] top-[17%] hidden h-[34vh] w-[24vw] max-w-[330px] overflow-hidden rounded-[8px] border border-white/24 bg-white/10 shadow-[0_36px_90px_-42px_rgba(0,0,0,0.95)] backdrop-blur-[3px] lg:block">
        <PortraitArt material={nextSlide.material} seed={`floating-${nextSlide.seed}`} className="h-full w-full" />
      </motion.div>
      <motion.div style={{ x: y, y: x }} className="pointer-events-none absolute bottom-[11%] right-[20%] hidden h-[24vh] w-[18vw] max-w-[250px] overflow-hidden rounded-[8px] border border-white/20 bg-white/10 shadow-[0_30px_80px_-46px_rgba(0,0,0,0.9)] backdrop-blur-[3px] md:block">
        <PortraitArt material={previousSlide.material} seed={`floating-${previousSlide.seed}`} className="h-full w-full" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-12 pt-28 sm:px-6 lg:px-10 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="max-w-2xl rounded-[12px] border border-white/18 bg-black/24 p-6 shadow-[0_34px_110px_-58px_rgba(0,0,0,0.95)] backdrop-blur-[12px] sm:p-8"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: slide.accent }}>
              {slide.kicker}
            </span>
            <span className="text-sm leading-relaxed text-ivory/72">{t("heroNote")}</span>
          </div>
          <h1 className="font-sans text-[clamp(3.4rem,11vw,8rem)] font-semibold leading-[0.92] tracking-normal text-ivory">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-[clamp(1rem,2.5vw,1.35rem)] leading-relaxed text-ivory/84">{t("heroCopy")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c98220] px-8 text-sm font-semibold text-white transition-[transform,background] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#b8741b]"
            >
              {t("catalog")}
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/38 px-8 text-sm font-semibold text-white transition-[transform,background] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white/10"
            >
              Cum lucram
            </Link>
          </div>
          <div className="mt-8 flex gap-2" aria-label="Hero carousel progress">
            {heroSlides.map((item, index) => (
              <button
                key={item.seed}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2 rounded-full transition-all duration-[250ms] ${active === index ? "w-10" : "w-2 bg-white/32"}`}
                style={{ backgroundColor: active === index ? item.accent : undefined }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
