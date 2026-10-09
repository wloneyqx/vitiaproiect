import { materials, occasions } from "@/lib/data";

export default function Footer({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";

  return (
    <footer className={dark ? "border-t border-white/12 bg-black text-white" : "border-t border-border bg-ivory"}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className={dark ? "font-serif text-3xl italic leading-none tracking-normal text-white" : "font-display text-xl font-extrabold tracking-tight text-charcoal"}>
              svidanie<span className={dark ? "text-white/55" : "text-gold-deep"}>_</span>art
            </p>
            <p className={dark ? "mt-4 max-w-xs font-sans text-sm leading-relaxed text-white/62" : "mt-4 max-w-xs font-sans text-sm leading-relaxed text-charcoal-soft"}>
              Where memories meet artistry. Custom portraits crafted with high-quality materials and master craftsmanship.
            </p>
          </div>

          <div>
            <p className={dark ? "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/45" : "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep"}>Materials</p>
            <ul className="space-y-3">
              {materials.map((m) => (
                <li key={m.id}>
                  <a href="#materials" className={dark ? "editorial-link font-sans text-sm text-white/62 transition-colors hover:text-white" : "editorial-link font-sans text-sm text-charcoal-soft transition-colors hover:text-charcoal"}>
                    {m.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={dark ? "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/45" : "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep"}>Occasions</p>
            <ul className="space-y-3">
              {occasions.map((o) => (
                <li key={o}>
                  <a href="#products" className={dark ? "editorial-link font-sans text-sm text-white/62 transition-colors hover:text-white" : "editorial-link font-sans text-sm text-charcoal-soft transition-colors hover:text-charcoal"}>
                    {o}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={dark ? "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/45" : "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep"}>Studio</p>
            <ul className={dark ? "space-y-3 font-sans text-sm text-white/62" : "space-y-3 font-sans text-sm text-charcoal-soft"}>
              <li>hello@svidanie.art</li>
              <li>Mon-Fri, 9:00-18:00</li>
              <li>Worldwide shipping</li>
            </ul>
          </div>
        </div>

        <div className={dark ? "mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/12 pt-8 sm:flex-row" : "mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row"}>
          <p className={dark ? "font-sans text-xs text-white/45" : "font-sans text-xs text-charcoal-soft"}>(c) {new Date().getFullYear()} svidanie_art. All rights reserved.</p>
          <p className={dark ? "font-sans text-xs uppercase tracking-[0.2em] text-white/45" : "font-sans text-xs uppercase tracking-[0.2em] text-charcoal-soft"}>Handcrafted, always.</p>
        </div>
      </div>
    </footer>
  );
}
