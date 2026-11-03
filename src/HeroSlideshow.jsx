import React, { useEffect, useState } from "react";
import { ChevronRight, Pause, Play } from "lucide-react";

/* ==================================================================== *
 *  HERO SLIDESHOW IMAGES — EDIT HERE
 *
 *  Each slide's `src` can be:
 *    • a local file in /public/images, e.g.  "/images/my-photo.jpg"
 *    • a placeholder,                  e.g.  "/api/placeholder/1920/1080"
 *
 *  If a local file is missing (or this component is pasted into a Claude
 *  Artifact, where /public is not available), the slide automatically
 *  falls back to /api/placeholder at the size given in `w` / `h`.
 *
 *  Every slide uses object-cover, so photos of any shape fill the screen
 *  without stretching or letterboxing. `position` (CSS object-position)
 *  picks which part of the photo stays in view when it is cropped, e.g.
 *  "center 40%" keeps a bit more of the top of a tall photo.
 * ==================================================================== */
const heroSlideshowImages = [
  {
    src: "/images/hero-lawn-mowing.avif", // ← REPLACE
    alt: "Lawn being mowed, seen from above",
    w: 1920,
    h: 1080,
    position: "70% center",
  },
  {
    src: "/images/commercial-landscape-mulch.avif", // ← REPLACE
    alt: "Commercial landscaping with fresh mulch and trimmed shrubs",
    w: 1920,
    h: 1080,
    position: "center 40%",
  },
  {
    src: "/images/snow-loader-dump-trailer.avif", // ← REPLACE
    alt: "Loader bucket full of snow beside a dump trailer",
    w: 1920,
    h: 1080,
    position: "center 50%",
  },
  {
    src: "/images/mulch-bed-lawn-edge.avif", // ← REPLACE
    alt: "Freshly edged mulch bed beside a green lawn",
    w: 1920,
    h: 1080,
    position: "center 50%",
  },
  {
    src: "/images/snow-hauling-dump-truck.avif", // ← REPLACE
    alt: "Dump truck hauling snow away from a parking lot",
    w: 1920,
    h: 1080,
    position: "center 55%",
  },
  {
    src: "/images/skid-steer-sweeper.avif", // ← REPLACE
    alt: "Tracked skid steer with a sweeper attachment",
    w: 1920,
    h: 1080,
    position: "center 55%",
  },
];

const SLIDE_DURATION_MS = 5500; // time each photo stays on screen
const FADE_MS = 1800; // length of the crossfade

const GREEN = "#1e5631";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** One background slide: crossfades in/out and falls back to a placeholder on error. */
function Slide({ slide, active, eager, zoom }) {
  const placeholder = `/api/placeholder/${slide.w}/${slide.h}`;
  const [src, setSrc] = useState(slide.src || placeholder);

  return (
    <div
      aria-hidden={!active}
      className="absolute inset-0 transition-opacity ease-in-out"
      style={{ opacity: active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      <img
        src={src}
        alt={slide.alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        onError={() => src !== placeholder && setSrc(placeholder)}
        className="h-full w-full object-cover"
        style={{
          objectPosition: slide.position || "center",
          // Slow "Ken Burns" drift on the visible slide; off for reduced motion.
          transform: zoom && active ? "scale(1)" : "scale(1.08)",
          transition: zoom ? `transform ${SLIDE_DURATION_MS + FADE_MS}ms linear` : "none",
        }}
      />
    </div>
  );
}

export default function HeroSlideshow({ slides = heroSlideshowImages }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = slides.length;

  // Respect the visitor's reduced-motion setting: no auto-advance, no zoom.
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setPaused(true);
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Auto-advance. Skips while paused or while the browser tab is hidden.
  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [paused, count, index]);

  return (
    <section
      id="home"
      aria-label="Perkins Lawn and Snow"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-[#1d1d1f] font-sans"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <Slide key={slide.src + i} slide={slide} active={i === index} eager={i === 0} zoom={!reducedMotion} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
      </div>

      {/* Slide controls (glass pill) */}
      {count > 1 && (
        <div className="absolute right-5 top-24 flex items-center gap-3 rounded-full bg-white/60 px-3 py-2 shadow-sm backdrop-blur-lg sm:right-8 lg:bottom-16 lg:top-auto">
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.src + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-500 ${EASE} ${
                  i === index ? "w-6 bg-[#1d1d1f]" : "w-1.5 bg-[#1d1d1f]/30 hover:bg-[#1d1d1f]/50"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-black/5"
          >
            {paused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
          </button>
        </div>
      )}

      {/* Static frosted-glass card — never moves with the slides */}
      <div className="mx-auto flex h-full max-w-7xl items-end px-5 pb-10 pt-28 sm:px-8 sm:pb-16">
        <div
          className={`w-full max-w-2xl rounded-3xl bg-white/70 p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-white/40 backdrop-blur-lg backdrop-saturate-150 transition-all duration-1000 ${EASE} motion-reduce:transition-none sm:p-12 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-[#1d1d1f] sm:text-6xl lg:text-7xl">
            Welcome to Perkins Lawn and Snow.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#6e6e73] sm:text-xl">
            Professional Lawn Care &amp; Snow Removal in Davenport, IA.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#contact"
              className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium text-white transition-all duration-300 ${EASE} hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1e5631]/30`}
              style={{ backgroundColor: GREEN }}
            >
              Get a Free Quote
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-1 text-base font-medium transition-opacity hover:opacity-80"
              style={{ color: GREEN }}
            >
              Our Services
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
