"use client";

import { RefObject, useEffect } from "react";
import { gsap, motionTokens, ScrollTrigger } from "@/lib/gsap";

type RevealOptions = {
  selector: string;
  y?: number;
  stagger?: number;
  start?: string;
  batchMax?: number;
};

export function useGsapReveal<T extends HTMLElement>(
  scopeRef: RefObject<T | null>,
  { selector, y = motionTokens.distance.medium, stagger = motionTokens.stagger.soft, start = "top 84%", batchMax = 6 }: RevealOptions
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector) as HTMLElement[];
      if (elements.length === 0) return;

      if (reduceMotion) {
        gsap.set(elements, { autoAlpha: 1, y: 0, clearProps: "visibility,opacity,transform" });
        return;
      }

      ScrollTrigger.batch(elements, {
        start,
        once: true,
        batchMax,
        interval: 0.08,
        onEnter: (batch: HTMLElement[]) => {
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration: motionTokens.duration.base,
              ease: motionTokens.ease.standard,
              stagger,
              overwrite: "auto",
              clearProps: "visibility,opacity,transform",
            }
          );
        },
      });

      window.setTimeout(() => {
        gsap.to(elements, {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.duration.quick,
          ease: motionTokens.ease.standard,
          overwrite: "auto",
          clearProps: "visibility,opacity,transform",
        });
      }, 900);
    }, scope);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [scopeRef, selector, y, stagger, start, batchMax]);
}
