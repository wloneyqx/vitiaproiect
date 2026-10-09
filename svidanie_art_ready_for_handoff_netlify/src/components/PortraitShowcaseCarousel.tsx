"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PortraitArt from "./PortraitArt";
import type { Material } from "@/lib/data";

const portraits: { material: Material; seed: string; title: string; caption: string }[] = [
  { material: "metal", seed: "showcase-01", title: "Modern Radiance", caption: "A cool-toned metal portrait with luminous depth." },
  { material: "canvas", seed: "showcase-02", title: "The Heirloom", caption: "Painterly canvas finish for family stories." },
  { material: "string", seed: "showcase-03", title: "Woven Devotion", caption: "Textural thread art with handcrafted presence." },
  { material: "metal", seed: "showcase-04", title: "Brushed Eternity", caption: "Sharp editorial contrast on durable aluminum." },
  { material: "canvas", seed: "showcase-05", title: "Golden Hour", caption: "Soft museum warmth with a classic portrait feel." },
];

function wrapIndex(index: number) {
  return (index + portraits.length) % portraits.length;
}

function ArrowLeft() {
  return <span aria-hidden>{"<"}</span>;
}

function ArrowRight() {
  return <span aria-hidden>{">"}</span>;
}

export default function PortraitShowcaseCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const visible = useMemo(
    () => [
      { slot: "left" as const, portrait: portraits[wrapIndex(active - 1)] },
      { slot: "center" as const, portrait: portraits[active] },
      { slot: "right" as const, portrait: portraits[wrapIndex(active + 1)] },
    ],
    [active]
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setActive((index) => wrapIndex(index + 1)), 4200);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const go = (direction: -1 | 1) => setActive((index) => wrapIndex(index + direction));

  return (
    <section
      aria-label="Portrait showcase"
      className="overflow-hidden border-y border-border bg-ivory px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">
            Portrait study
          </p>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.2rem,6vw,5.8rem)] font-extrabold uppercase leading-[0.86] tracking-normal text-charcoal">
            Portraits that hold the room.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-charcoal-soft">
            A rotating editorial showcase of the materials, mood, and scale behind each custom piece.
          </p>
        </motion.div>

        <div
          className="relative mx-auto h-[430px] max-w-5xl touch-pan-y sm:h-[520px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              if (info.offset.x > 70) go(-1);
            }}
          >
            {visible.map(({ slot, portrait }) => {
              const isCenter = slot === "center";
              const x = slot === "left" ? "-132%" : slot === "right" ? "32%" : "-50%";
              return (
                <motion.article
                  key={`${slot}-${portrait.seed}`}
                  initial={false}
                  animate={{
                    x,
                    scale: isCenter ? 1 : 0.86,
                    opacity: isCenter ? 1 : 0.68,
                    zIndex: isCenter ? 3 : 1,
                  }}
                  transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-0 h-[360px] w-[76vw] max-w-[430px] overflow-hidden rounded-sm bg-charcoal shadow-[0_24px_60px_-45px_rgba(7,7,7,0.8)] sm:h-[460px] sm:w-[44vw]"
                >
                  <PortraitArt
                    material={portrait.material}
                    seed={portrait.seed}
                    label={portrait.title}
                    className="h-full w-full transition-transform duration-500 ease-out hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory">
                    <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ivory/70">
                      {String(wrapIndex(portraits.indexOf(portrait)) + 1).padStart(2, "0")} / {String(portraits.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none">{portrait.title}</h3>
                    <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-ivory/74">{portrait.caption}</p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous portrait"
            className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-charcoal bg-ivory font-sans text-lg text-charcoal transition-transform duration-300 hover:-translate-x-1 sm:left-8"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next portrait"
            className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-charcoal bg-ivory font-sans text-lg text-charcoal transition-transform duration-300 hover:translate-x-1 sm:right-8"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {portraits.map((portrait, index) => (
            <button
              key={portrait.seed}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show portrait ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === index ? "w-8 bg-charcoal" : "w-2 bg-charcoal/25 hover:bg-charcoal/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
