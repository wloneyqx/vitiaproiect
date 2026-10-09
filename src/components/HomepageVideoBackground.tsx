"use client";

import { useEffect, useRef } from "react";

const HOMEPAGE_VIDEO = "/videos/upscaled-video.mp4";

export default function HomepageVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => undefined);
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={HOMEPAGE_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="homepage-video h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_18%_8%,rgba(227,217,252,0.2),transparent_30rem),linear-gradient(135deg,rgba(4,6,7,0.38),rgba(91,42,98,0.34)_48%,rgba(73,40,194,0.4))]" />
    </>
  );
}
