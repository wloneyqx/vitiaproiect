import type { Material } from "@/lib/data";

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEAD = { cx: 200, cy: 165, rx: 66, ry: 80 };
const SHOULDERS =
  "M88,304 C88,254 138,222 200,222 C262,222 312,254 312,304 L346,500 L54,500 Z";

// Rounded to 2dp so SSR (Node's V8) and the browser's V8 — which can
// diverge in the last ULP of Math.cos/sin — always stringify identically
// and avoid a React hydration mismatch.
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function pointOnBust(rand: () => number) {
  const t = rand();
  if (t < 0.55) {
    const angle = rand() * Math.PI * 2;
    return {
      x: round2(HEAD.cx + Math.cos(angle) * HEAD.rx * (0.5 + rand() * 0.5)),
      y: round2(HEAD.cy + Math.sin(angle) * HEAD.ry * (0.5 + rand() * 0.5)),
    };
  }
  return {
    x: round2(90 + rand() * 220),
    y: round2(260 + rand() * 220),
  };
}

export default function PortraitArt({
  material,
  seed,
  label,
  className = "",
}: {
  material: Material;
  seed: string;
  label?: string;
  className?: string;
}) {
  const uid = `${material}-${seed}`.replace(/[^a-zA-Z0-9-]/g, "");
  const rand = mulberry32(hashSeed(seed));

  // Per-seed pan/zoom/rotate so repeated materials don't render as
  // identical silhouettes; scale-about-center then offset keeps the bust framed.
  const jdx = round2((rand() - 0.5) * 70);
  const jdy = round2((rand() - 0.5) * 46);
  const jscale = round2(0.82 + rand() * 0.34);
  const jrotate = round2((rand() - 0.5) * 14);
  const bustTransform = `translate(${round2(200 + jdx)} ${round2(258 + jdy)}) scale(${jscale}) rotate(${jrotate}) translate(-200 -258)`;
  const figCx = round2(30 + rand() * 45);
  const figCy = round2(20 + rand() * 35);

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={label ?? `${material} portrait artwork`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <clipPath id={`bust-${uid}`}>
          <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} />
          <path d={SHOULDERS} />
        </clipPath>

        <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e7e7ea" />
          <stop offset="35%" stopColor="#9a9ba1" />
          <stop offset="55%" stopColor="#f4f4f6" />
          <stop offset="78%" stopColor="#8b8c93" />
          <stop offset="100%" stopColor="#d9dade" />
        </linearGradient>
        <linearGradient id={`metalbg-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>

        <linearGradient id={`canvasbg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5ecd7" />
          <stop offset="100%" stopColor="#e7d5a8" />
        </linearGradient>
        <radialGradient id={`canvasfig-${uid}`} cx={`${figCx}%`} cy={`${figCy}%`} r="65%">
          <stop offset="0%" stopColor="#3d3a34" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#1a1a1a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a8842a" stopOpacity="0.75" />
        </radialGradient>
        <filter id={`grain-${uid}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={hashSeed(seed) % 100}
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
        <filter id={`soft-${uid}`}>
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {material === "metal" && (
        <>
          <rect width="400" height="500" fill={`url(#metalbg-${uid})`} />
          <g transform={bustTransform}>
            <g clipPath={`url(#bust-${uid})`}>
              <rect width="400" height="500" fill={`url(#metal-${uid})`} />
              {Array.from({ length: 40 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  x2="400"
                  y1={i * 13}
                  y2={i * 13}
                  stroke="#ffffff"
                  strokeOpacity="0.06"
                  strokeWidth="1"
                />
              ))}
              <polygon
                points="60,500 180,0 260,0 140,500"
                fill="#ffffff"
                opacity="0.16"
                style={{ mixBlendMode: "overlay" }}
              />
            </g>
            <ellipse
              cx={HEAD.cx}
              cy={HEAD.cy}
              rx={HEAD.rx}
              ry={HEAD.ry}
              fill="none"
              stroke="#d4af37"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          </g>
        </>
      )}

      {material === "string" && (
        <>
          <rect width="400" height="500" fill="#1a1a1a" />
          <rect
            x="30"
            y="30"
            width="340"
            height="440"
            fill="none"
            stroke="#d4af37"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <g transform={bustTransform}>
            <g clipPath={`url(#bust-${uid})`}>
              {Array.from({ length: 90 }).map((_, i) => {
                const a = pointOnBust(rand);
                const b = pointOnBust(rand);
                const gold = rand() > 0.35;
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={gold ? "#d4af37" : "#fdfcf7"}
                    strokeOpacity={gold ? 0.55 : 0.22}
                    strokeWidth="0.6"
                  />
                );
              })}
            </g>
            {Array.from({ length: 26 }).map((_, i) => {
              const angle = (i / 26) * Math.PI * 2;
              const x = round2(HEAD.cx + Math.cos(angle) * (HEAD.rx + 14));
              const y = round2(HEAD.cy + Math.sin(angle) * (HEAD.ry + 14));
              return <circle key={i} cx={x} cy={y} r="1.6" fill="#d4af37" opacity="0.6" />;
            })}
          </g>
        </>
      )}

      {material === "canvas" && (
        <>
          <rect width="400" height="500" fill={`url(#canvasbg-${uid})`} />
          <rect width="400" height="500" filter={`url(#grain-${uid})`} opacity="0.5" />
          <g transform={bustTransform}>
            <g clipPath={`url(#bust-${uid})`} filter={`url(#soft-${uid})`}>
              <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx + 10} ry={HEAD.ry + 10} fill={`url(#canvasfig-${uid})`} />
              <path d={SHOULDERS} fill={`url(#canvasfig-${uid})`} />
            </g>
            <path
              d={SHOULDERS}
              fill="none"
              stroke="#d4af37"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
          </g>
        </>
      )}
    </svg>
  );
}
