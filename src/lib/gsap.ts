import gsapDefault, { gsap as gsapNamed } from "@/vendor/gsap/gsap";
import ScrollTriggerDefault, { ScrollTrigger as ScrollTriggerNamed } from "@/vendor/gsap/ScrollTrigger";

type GsapTarget = string | Element | Element[] | NodeList | null;
type GsapVars = Record<string, unknown>;
type GsapTimeline = {
  fromTo: (targets: GsapTarget, fromVars: GsapVars, toVars: GsapVars, position?: string | number) => GsapTimeline;
  to: (targets: GsapTarget, vars: GsapVars, position?: string | number) => GsapTimeline;
};
type GsapContext = { revert: () => void };
type GsapLike = {
  registerPlugin: (...plugins: unknown[]) => void;
  set: (targets: GsapTarget, vars: GsapVars) => void;
  to: (targets: GsapTarget, vars: GsapVars) => unknown;
  fromTo: (targets: GsapTarget, fromVars: GsapVars, toVars: GsapVars) => unknown;
  timeline: (vars?: GsapVars) => GsapTimeline;
  context: (callback: () => void, scope?: Element | null) => GsapContext;
  killTweensOf: (targets: GsapTarget | GsapTarget[]) => void;
  quickTo: (target: GsapTarget, property: string, vars: GsapVars) => (value: number) => void;
  utils: {
    toArray: (targets: GsapTarget) => Element[];
  };
};
type ScrollTriggerLike = {
  batch: (targets: Element[], vars: GsapVars) => unknown;
  refresh: () => void;
};

export const gsap = (gsapNamed ?? gsapDefault) as unknown as GsapLike;
export const ScrollTrigger = (ScrollTriggerNamed ?? ScrollTriggerDefault) as unknown as ScrollTriggerLike;

gsap.registerPlugin(ScrollTrigger);

export const motionTokens = {
  duration: {
    quick: 0.24,
    base: 0.5,
    page: 0.72,
  },
  ease: {
    standard: "power3.out",
    soft: "power2.out",
    inOut: "power3.inOut",
  },
  stagger: {
    tight: 0.045,
    soft: 0.075,
  },
  distance: {
    short: 14,
    medium: 22,
  },
};
