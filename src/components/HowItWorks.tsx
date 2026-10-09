"use client";

import { useRef } from "react";
import Reviews from "@/components/Reviews";
import { useGsapReveal } from "@/lib/useGsapReveal";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
      <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 15.5l4-3.5 3 2.5 3-4 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CraftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
      <path d="M3.5 8l8.5-4.5L20.5 8 12 12.5 3.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.5 8v8l8.5 4.5m0-8V21m8.5-13v8l-8.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const steps = [
  {
    n: "01",
    title: "Upload",
    body: "Alegi fotografia preferata pentru portret, poster sau print.",
    icon: UploadIcon,
  },
  {
    n: "02",
    title: "Preview",
    body: "Confirmam detaliile si pregatim compozitia potrivita pentru material.",
    icon: PreviewIcon,
  },
  {
    n: "03",
    title: "Crafting & Delivery",
    body: "Lucram produsul si il ambalam atent pentru livrare.",
    icon: CraftIcon,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: ".js-process-step", y: 16, stagger: 0.065, start: "top 82%" });

  return (
    <>
      <section ref={sectionRef} id="how-it-works" className="bg-transparent px-4 py-24 font-sans text-white sm:px-6 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="section-glass-frame section-glass-heading mb-16">
            <div>
              <p className="liquid-glass mb-6 inline-flex rounded-full px-7 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Proces</p>
              <h2 className="font-serif text-[clamp(3.2rem,8vw,7rem)] italic leading-[0.9] tracking-normal text-white">
                Cum lucram
              </h2>
            </div>
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/78">
              Un flux simplu: fotografia ta, confirmarea detaliilor si un produs personalizat pregatit cu grija.
            </p>
          </div>

          <div className="liquid-glass relative grid gap-0 rounded-[28px] md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                className="js-process-step relative border-b border-white/12 px-6 py-8 last:border-b-0 md:border-b-0 md:border-r md:border-white/12 md:px-7 md:last:border-r-0"
              >
                <div className="liquid-glass relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] text-white/82">
                  <step.icon />
                </div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/45">Pas {step.n}</p>
                <h3 className="text-3xl font-medium leading-none tracking-normal text-white">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-white/68">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Reviews />
    </>
  );
}
