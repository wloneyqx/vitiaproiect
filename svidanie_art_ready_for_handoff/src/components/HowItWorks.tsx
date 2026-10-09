"use client";

import { motion } from "framer-motion";

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
    body: "Pick a favorite photo for any occasion - a wedding, a birthday, or a family tribute.",
    icon: UploadIcon,
  },
  {
    n: "02",
    title: "Preview",
    body: "We generate a free, high-resolution digital preview so you can see it before you commit.",
    icon: PreviewIcon,
  },
  {
    n: "03",
    title: "Crafting & Delivery",
    body: "Our artisans hand-work premium paint, metal, or thread and ship your finished masterpiece.",
    icon: CraftIcon,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-charcoal px-4 py-24 text-ivory sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">The Process</p>
            <h2 className="font-display text-[clamp(2.8rem,8vw,7rem)] font-extrabold uppercase leading-[0.84] tracking-normal">
              How it works
            </h2>
          </div>
          <p className="font-sans text-base leading-relaxed text-ivory/68">
            A quiet production flow: your image, an honest preview, and a finished portrait prepared with material care.
          </p>
        </div>

        <div className="relative grid gap-0 border-y border-ivory/20 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className="relative border-b border-ivory/20 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:last:border-r-0"
            >
              <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center border border-ivory/28 bg-charcoal text-gold">
                <step.icon />
              </div>
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">Step {step.n}</p>
              <h3 className="font-display text-3xl font-extrabold uppercase leading-none tracking-normal">{step.title}</h3>
              <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-ivory/70">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
