"use client";

import { motion } from "framer-motion";
import PortraitArt from "./PortraitArt";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-10 lg:pt-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-charcoal bg-charcoal text-ivory shadow-[0_30px_80px_-60px_rgba(7,7,7,0.9)]">
        <div className="relative min-h-[620px] lg:min-h-[720px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.04, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-20 mx-auto h-[410px] w-[78%] max-w-[760px] overflow-hidden rounded-sm opacity-95 sm:h-[480px] lg:right-10 lg:left-auto lg:top-12 lg:h-[610px] lg:w-[58%]"
          >
            <PortraitArt material="metal" seed="editorial-hero" label="svidanie_art" className="h-full w-full scale-110" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgba(130,168,194,0.32),transparent_38%),linear-gradient(90deg,rgba(7,7,7,0.62),transparent_45%),linear-gradient(0deg,rgba(7,7,7,0.3),transparent_42%)]" />
          </motion.div>

          <div className="relative z-10 flex min-h-[620px] flex-col justify-between px-6 py-8 sm:px-9 lg:min-h-[720px] lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr_180px]">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                className="max-w-[18rem] font-sans text-[0.72rem] font-medium uppercase leading-relaxed tracking-[0.22em] text-ivory/72"
              >
                At svidanie_art, we capture emotions through high-quality materials and master craftsmanship.
              </motion.p>
              <div />
              <motion.a
                href="#products"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                className="group hidden h-11 items-center justify-between border border-ivory/65 px-4 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-ivory hover:text-charcoal lg:flex"
              >
                Start Your Portrait
                <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
              </motion.a>
            </div>

            <div className="pb-5">
              <motion.h1
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
                className="max-w-[12ch] font-display text-[clamp(4.5rem,18vw,15rem)] font-extrabold uppercase leading-[0.72] tracking-normal text-ivory"
              >
                Custom Portraits
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
                className="mt-8 flex flex-col gap-4 border-t border-ivory/22 pt-5 sm:flex-row sm:items-end sm:justify-between"
              >
                <p className="max-w-md font-sans text-base leading-relaxed text-ivory/82">
                  Where memories meet artistry. Metal, thread, and canvas portraits crafted as editorial objects.
                </p>
                <a
                  href="#materials"
                  className="group inline-flex min-h-11 w-fit items-center gap-3 border border-ivory/60 px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-ivory hover:text-charcoal"
                >
                  Choose material
                  <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
