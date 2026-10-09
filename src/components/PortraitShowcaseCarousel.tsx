"use client";

import { useRef, useState } from "react";
import PortraitArt from "./PortraitArt";
import type { Material } from "@/lib/data";
import { useGsapReveal } from "@/lib/useGsapReveal";

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
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortraitShowcaseCarousel() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const dragStartRef = useRef<number | null>(null);
  useGsapReveal(sectionRef, { selector: ".js-showcase-heading", y: 18, start: "top 84%" });
  const activePortrait = portraits[active];
  const nextPortrait = portraits[wrapIndex(active + 1)];
  const go = (direction: -1 | 1) => setActive((index) => wrapIndex(index + direction));
  const show = (index: number) => setActive(wrapIndex(index));

  return (
    <section
      ref={sectionRef}
      aria-label="Portrait showcase"
      className="overflow-hidden border-y border-white/12 bg-black px-4 py-20 text-white sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="js-showcase-heading mb-12 text-center"
        >
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Portrait study
          </p>
          <h2 className="mx-auto max-w-4xl font-serif text-[clamp(2.4rem,6vw,5.4rem)] italic leading-[0.9] tracking-normal text-white">
            Portraits that hold the room.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-white/62">
            A rotating editorial showcase of the materials, mood, and scale behind each custom piece.
          </p>
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Portrait materials carousel"
          tabIndex={0}
          className="relative mx-auto max-w-6xl touch-pan-y outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
          }}
          >
          <p className="sr-only" aria-live="polite">
            Slide {active + 1} of {portraits.length}: {activePortrait.title}
          </p>

          <div className="mb-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-sans text-sm font-medium text-white/62">
              {active + 1} of {portraits.length}
            </p>
            <div className="liquid-glass flex items-center gap-2 rounded-[9999px] p-1.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous portrait"
                className="grid h-[62px] w-[62px] place-items-center rounded-[9999px] text-white transition-colors duration-200 hover:bg-white/12 focus-visible:bg-white/12"
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next portrait"
                className="grid h-[62px] w-[62px] place-items-center rounded-[9999px] bg-white text-black transition-transform duration-200 hover:scale-[1.03]"
              >
                <ArrowRight />
              </button>
            </div>
          </div>

          <div
            className="grid cursor-grab grid-cols-[minmax(0,1fr)_88px] gap-4 active:cursor-grabbing sm:grid-cols-[minmax(0,1fr)_150px] lg:grid-cols-[minmax(0,1fr)_220px]"
            onPointerDown={(event) => {
              dragStartRef.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const start = dragStartRef.current;
              dragStartRef.current = null;
              if (start === null) return;
              const offset = event.clientX - start;
              if (offset < -70) go(1);
              if (offset > 70) go(-1);
            }}
          >
            <article
              key={activePortrait.seed}
              role="group"
              aria-roledescription="slide"
              aria-label={`${active + 1} of ${portraits.length}: ${activePortrait.title}`}
              className="liquid-glass grid min-h-[420px] overflow-hidden rounded-[28px] md:grid-cols-[0.92fr_1fr] lg:min-h-[520px]"
            >
              <div className="relative min-h-[280px] overflow-hidden">
                <PortraitArt
                  material={activePortrait.material}
                  seed={activePortrait.seed}
                  label={activePortrait.title}
                  className="h-full w-full transition-transform duration-500 ease-out hover:scale-[1.025]"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  Portrait study
                </p>
                <h3 className="mt-4 font-serif text-[clamp(2.4rem,6vw,5rem)] italic leading-[0.94] text-white">
                  {activePortrait.title}
                </h3>
                <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-white/68">
                  {activePortrait.caption}
                </p>
              </div>
            </article>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Peek next portrait: ${nextPortrait.title}`}
              className="group relative min-h-[420px] overflow-hidden rounded-[28px] bg-white/[0.04] text-left lg:min-h-[520px]"
            >
              <div className="absolute inset-0 w-[280px] max-w-none -translate-x-[38%] transition-transform duration-500 group-hover:-translate-x-[34%] sm:w-[360px] lg:w-[460px]">
                <PortraitArt
                  material={nextPortrait.material}
                  seed={nextPortrait.seed}
                  label={nextPortrait.title}
                  className="h-full w-full opacity-70"
                />
              </div>
              <span className="absolute bottom-4 left-3 right-3 rounded-full bg-black/50 px-3 py-2 text-center font-sans text-xs font-semibold text-white backdrop-blur-sm">
                Next
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {portraits.map((portrait, index) => (
            <button
              key={portrait.seed}
              type="button"
              onClick={() => show(index)}
              aria-label={`Show portrait ${index + 1}`}
              aria-current={active === index}
              className={`h-3 rounded-full transition-all duration-300 ${
                active === index ? "w-10 bg-white" : "w-3 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
