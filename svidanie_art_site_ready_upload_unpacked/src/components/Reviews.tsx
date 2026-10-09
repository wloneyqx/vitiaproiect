"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { customerReviews, type ReviewMedia } from "@/lib/reviews";

const proofAutoplayMs = 4400;
const reviewAutoplayMs = 5200;
const reviewBenefits: { icon: "box" | "shield" | "star" | "chat"; title: string; body: string }[] = [
  { icon: "box", title: "Ambalaj premium", body: "Fiecare comanda este pregatita cu grija." },
  { icon: "shield", title: "Calitate garantata", body: "Printuri clare si culori vii." },
  { icon: "star", title: "Clienti multumiti", body: "Recenzii si experiente reale." },
  { icon: "chat", title: "Suport rapid", body: "Raspundem rapid atunci cand ai nevoie." },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        d="M12 3.6l2.45 5.05 5.55.8-4 3.9.95 5.5L12 16.25l-4.95 2.6.95-5.5-4-3.9 5.55-.8L12 3.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProofIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[#c98220]" aria-hidden>
      <path d="M5 6.5h14v8.5H9.5L5 18.5v-12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BenefitIcon({ type }: { type: "box" | "shield" | "star" | "chat" }) {
  const common = "h-10 w-10 text-[#c98220]";
  if (type === "box") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M4 8l8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 8v8l8 4 8-4V8M12 12v8" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8.8 12.2l2 2 4.5-4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M12 3.4l2.4 5.1 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 3.4Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <path d="M5 6.5h14v9H9l-4 3v-12Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ProofCard({ media, tall = false }: { media: ReviewMedia; tall?: boolean }) {
  const isPhoto = media.type === "photo";

  return (
    <div className={`h-full rounded-[16px] border border-border bg-white p-3 shadow-[0_22px_70px_-55px_rgba(7,7,7,0.8)] ${tall ? "min-h-[320px]" : ""}`}>
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-soft">
        {isPhoto ? "JOI, 11:42" : "MAR, 15:03"}
      </p>
      {media.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.src} alt={media.title} loading="lazy" className="h-full max-h-[520px] w-full rounded-[12px] object-contain" />
      ) : (
        <div className="space-y-3">
          {(media.messages ?? []).slice(0, 3).map((message) => (
            <p key={message} className="rounded-[14px] bg-[#f0f1f2] px-3 py-2 text-sm leading-snug text-charcoal">
              {message}
            </p>
          ))}
          <div className="relative aspect-[0.84] overflow-hidden rounded-[12px] bg-[#e8e0d4]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(145deg,#cab79c,#fbf7ef_48%,#9a8065)]" />
            <div className="absolute inset-x-[16%] top-[22%] h-[48%] rotate-[-5deg] rounded-[7px] border border-white/70 bg-white/65 shadow-[0_16px_42px_-24px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-x-[22%] top-[30%] h-[34%] rotate-[6deg] rounded-[6px] border border-white/80 bg-[#d5b491]/80" />
            <p className="absolute bottom-3 left-3 right-3 rounded-full bg-white/72 px-3 py-1.5 text-center text-[11px] font-semibold text-[#9f671c]">
              {media.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoReviewCard({ video, onOpen }: { video?: ReviewMedia; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full overflow-hidden rounded-[18px] border border-border bg-white text-left shadow-[0_18px_70px_-55px_rgba(7,7,7,0.75)] transition-transform duration-[250ms] hover:-translate-y-1 sm:grid-cols-[0.82fr_1fr]"
    >
      <div className="relative min-h-[176px] overflow-hidden bg-[#d9c7ae]">
        {video?.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.poster} alt={video.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_30%),linear-gradient(135deg,#b78f6b,#f5eee3_48%,#806a57)]" />
        )}
        <span className="absolute inset-0 bg-black/16" />
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/85 bg-white/38 text-white shadow-[0_16px_45px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-transform duration-[250ms] hover:scale-[1.04]">
          <PlayIcon className="h-8 w-8" />
        </span>
      </div>
      <div className="flex flex-col justify-center p-5">
        <p className="text-lg font-semibold text-charcoal">{video?.title ?? "Recenzie video de la Andreea"}</p>
        <p className="mt-1 text-sm text-charcoal-soft">{video?.caption ?? "Client svidanie_art"}</p>
        <span className="mt-3 w-fit rounded-full bg-[#f1eadf] px-3 py-1 text-xs font-semibold text-charcoal-soft">
          {video?.duration ?? "0:45"}
        </span>
        <span className="mt-5 inline-flex min-h-10 w-fit items-center gap-2 rounded-[8px] border border-[#c98220] px-4 text-sm font-semibold text-[#9f671c]">
          <PlayIcon />
          Urmareste recenzia
        </span>
      </div>
    </button>
  );
}

export default function Reviews() {
  const [activeReview, setActiveReview] = useState(0);
  const [activeProof, setActiveProof] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const review = customerReviews[activeReview];
  const proofItems = review.media;
  const currentProof = proofItems[activeProof % proofItems.length];
  const hasVideo = Boolean(review.video);
  const carouselCount = proofItems.length + (hasVideo ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActiveReview((value) => (value + 1) % customerReviews.length), reviewAutoplayMs);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || paused || carouselCount < 2) return;
    const timer = window.setInterval(() => {
      setActiveProof((value) => (value + 1) % carouselCount);
    }, proofAutoplayMs);
    return () => window.clearInterval(timer);
  }, [carouselCount, paused, reduceMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        setVideoOpen(false);
      }
      if (lightboxIndex !== null && event.key === "ArrowRight") {
        setLightboxIndex((value) => (value === null ? 0 : (value + 1) % proofItems.length));
      }
      if (lightboxIndex !== null && event.key === "ArrowLeft") {
        setLightboxIndex((value) => (value === null ? 0 : (value + proofItems.length - 1) % proofItems.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, proofItems.length]);

  const carouselItem = useMemo(() => {
    if (activeProof >= proofItems.length && review.video) return review.video;
    return currentProof;
  }, [activeProof, currentProof, proofItems.length, review.video]);

  const goReview = (direction: -1 | 1) => {
    setActiveReview((value) => (value + direction + customerReviews.length) % customerReviews.length);
  };

  const goProof = (direction: -1 | 1) => {
    setActiveProof((value) => (value + direction + carouselCount) % carouselCount);
  };

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#fbfaf8] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(201,130,32,0.12),transparent_44%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-4xl text-center"
        >
          <span className="inline-flex rounded-full bg-[#f2eadf] px-6 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9f671c]">
            RECENZII
          </span>
          <h2 className="mt-4 text-[clamp(2.7rem,7vw,5.4rem)] font-semibold leading-[0.94] tracking-normal text-charcoal">
            Ce spun clientii
          </h2>
          <p className="mt-4 text-lg text-charcoal-soft">
            Pareri reale si momente impartasite de clientii nostri.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[28px] border border-border bg-white/82 p-7 shadow-[0_28px_110px_-82px_rgba(7,7,7,0.75)] sm:p-10 lg:p-12"
          >
            <div className="mb-8 flex gap-1 text-2xl text-[#c98220]" aria-label={`${review.rating} din 5 stele`}>
              {Array.from({ length: review.rating }).map((_, index) => (
                <StarIcon key={index} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.12] tracking-normal text-charcoal">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <div className="mt-10 border-t border-border pt-6">
                  <p className="text-xl font-semibold text-charcoal">{review.name}</p>
                  <p className="mt-1 text-base text-charcoal-soft">
                    {review.category} / {review.date}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {customerReviews.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Arata recenzia ${index + 1}`}
                    onClick={() => setActiveReview(index)}
                    className={`h-3 rounded-full transition-all duration-[250ms] ${activeReview === index ? "w-10 bg-[#c98220]" : "w-3 bg-charcoal/12"}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-base font-semibold text-charcoal">
                  {activeReview + 1} / {customerReviews.length}
                </span>
                <button type="button" aria-label="Recenzia precedenta" onClick={() => goReview(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white shadow-[0_12px_40px_-30px_rgba(7,7,7,0.75)] transition-transform duration-[250ms] hover:-translate-x-0.5">
                  <ArrowIcon direction="left" />
                </button>
                <button type="button" aria-label="Recenzia urmatoare" onClick={() => goReview(1)} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white shadow-[0_12px_40px_-30px_rgba(7,7,7,0.75)] transition-transform duration-[250ms] hover:translate-x-0.5">
                  <ArrowIcon direction="right" />
                </button>
              </div>
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="rounded-[28px] border border-border bg-[#fbf7ef]/86 p-5 shadow-[0_28px_100px_-82px_rgba(7,7,7,0.7)]"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 font-semibold text-charcoal">
                <ProofIcon />
                Dovezi de la clienti
              </p>
              <span className="w-fit rounded-full bg-[#f2eadf] px-4 py-2 text-xs font-semibold text-[#9f671c]">
                Screenshot-uri & Video
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {proofItems.slice(0, 2).map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group text-left transition-transform duration-[250ms] hover:-translate-y-1"
                >
                  <ProofCard media={item} />
                </button>
              ))}
            </div>

            <motion.div
              className="mt-4 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55) goProof(1);
                if (info.offset.x > 55) goProof(-1);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselItem.id}
                  initial={{ opacity: 0, x: 18, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -18, filter: "blur(2px)" }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  {carouselItem.type === "video" ? (
                    <VideoReviewCard video={carouselItem} onOpen={() => setVideoOpen(true)} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(activeProof % proofItems.length)}
                      className="w-full text-left transition-transform duration-[250ms] hover:-translate-y-1"
                    >
                      <ProofCard media={carouselItem} tall />
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {Array.from({ length: carouselCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Arata dovada ${index + 1}`}
                    onClick={() => setActiveProof(index)}
                    className={`h-2 rounded-full transition-all duration-[250ms] ${activeProof % carouselCount === index ? "w-8 bg-[#c98220]" : "w-2 bg-charcoal/14"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" aria-label="Dovada precedenta" onClick={() => goProof(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white">
                  <ArrowIcon direction="left" />
                </button>
                <button type="button" aria-label="Dovada urmatoare" onClick={() => goProof(1)} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white">
                  <ArrowIcon direction="right" />
                </button>
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12 grid gap-6 border-t border-border pt-9 md:grid-cols-4">
          {reviewBenefits.map(({ icon, title, body }, index) => (
            <div key={title} className={`flex gap-5 ${index > 0 ? "md:border-l md:border-border md:pl-8" : ""}`}>
              <BenefitIcon type={icon} />
              <div>
                <p className="font-semibold text-charcoal">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/82 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="Inchide" onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-ivory text-2xl text-charcoal">
              x
            </button>
            <button type="button" aria-label="Dovada precedenta" onClick={() => setLightboxIndex((value) => (value === null ? 0 : (value + proofItems.length - 1) % proofItems.length))} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory text-charcoal">
              <ArrowIcon direction="left" />
            </button>
            <button type="button" aria-label="Dovada urmatoare" onClick={() => setLightboxIndex((value) => (value === null ? 0 : (value + 1) % proofItems.length))} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory text-charcoal">
              <ArrowIcon direction="right" />
            </button>
            <motion.div
              initial={{ y: 18, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-[82vh] w-full max-w-md"
            >
              <ProofCard media={proofItems[lightboxIndex]} tall />
            </motion.div>
          </motion.div>
        )}

        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/84 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="Inchide video" onClick={() => setVideoOpen(false)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-ivory text-2xl text-charcoal">
              x
            </button>
            <motion.div
              initial={{ y: 18, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl overflow-hidden rounded-[22px] bg-ivory p-4 shadow-[0_32px_110px_-60px_rgba(0,0,0,0.95)]"
            >
              {review.video?.src ? (
                <video autoPlay controls playsInline className="aspect-video w-full rounded-[16px] bg-charcoal">
                  <source src={review.video.src} />
                </video>
              ) : (
                <div className="grid aspect-video place-items-center rounded-[16px] bg-[linear-gradient(135deg,#d5c1a5,#fbf7ef_48%,#a88c6a)] text-center">
                  <div>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/60 text-charcoal backdrop-blur-sm">
                      <PlayIcon className="h-10 w-10" />
                    </div>
                    <p className="mt-5 text-xl font-semibold text-charcoal">{review.video?.title ?? "Video review"}</p>
                    <p className="mt-1 text-sm text-charcoal-soft">Adauga un MP4 in structura de date pentru redare reala.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
