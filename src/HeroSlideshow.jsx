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
 *  "center 40%" keeps a bit more of the top of a tall photo, "center 25%"
 *  moves the crop down so something near the top (like a sign) isn't
 *  hidden behind the navigation bar.
 * ==================================================================== */

// ← REPLACE: path to the logo shown at the top of the hero card.
// Falls back to /api/placeholder/400/100 if the file can't be loaded.
const logoUrl = "/images/perkins-logo.avif";
const LOGO_PLACEHOLDER = "/api/placeholder/400/100";

const heroSlideshowImages = [
  {
    src: "/images/hero-lawn-mowing.avif", // ← REPLACE
    alt: "Lawn being mowed, seen from above",
    w: 1920,
    h: 1080,
    position: "70% center",
  },
  {
    src: "/images/landscape-beds-boulders.avif", // ← REPLACE
    alt: "Mulched landscape beds with boulders, river rock and golden shrubs",
    w: 1920,
    h: 1080,
    position: "center 60%",
  },
  {
    src: "/images/snow-loader-dump-trailer.avif", // ← REPLACE
    alt: "Loader bucket full of snow beside a dump trailer",
    w: 1920,
    h: 1080,
    position: "center 50%",
  },
  {
    src: "/images/commercial-landscape-mulch.avif", // ← REPLACE
    alt: "Commercial landscaping with fresh mulch and trimmed shrubs",
    w: 1920,
    h: 1080,
    position: "center 40%",
  },
  {
    src: "/images/commercial-mulch-restaurant.avif", // ← REPLACE
    alt: "Freshly mulched planting bed in front of a restaurant",
    w: 1920,
    h: 1080,
    position: "center 25%",
  },
  {
    src: "/images/snow-hauling-dump-truck.avif", // ← REPLACE
    alt: "Dump truck hauling snow away from a parking lot",
    w: 1920,
    h: 1080,
    position: "center 55%",
  },
  {
    src: "/images/curved-walkway-mulch.avif", // ← REPLACE
    alt: "Curved walkway lined with fresh mulch beds",
    w: 1920,
    h: 1080,
    position: "center 55%",
  },
  {
    src: "/images/mulch-bed-lawn-edge.avif", // ← REPLACE
    alt: "Freshly edged mulch bed beside a green lawn",
    w: 1920,
    h: 1080,
    position: "center 50%",
  },
  {
    src: "/images/skid-steer-sweeper.avif", // ← REPLACE
    alt: "Tracked skid steer with a sweeper attachment",
    w: 1920,
    h: 1080,
    position: "center 55%",
  },
  {
    src: "/images/terraced-black-mulch-beds.avif", // ← REPLACE
    alt: "Terraced garden beds with fresh black mulch",
    w: 1920,
    h: 1080,
    position: "center 65%",
  },
  {
    src: "/images/walkway-steps-black-mulch.avif", // ← REPLACE
    alt: "Stepped walkway with black mulch beds and river rock",
    w: 1920,
    h: 1080,
    position: "center 50%",
  },
];

const SLIDE_DURATION_MS = 3800; // time each photo stays on screen (3.5–4s)
const FADE_MS = 1200; // length of the crossfade
const ZOOM_SCALE = 1.08; // how far each photo slowly zooms in while visible

const GREEN = "#1e5631";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** One background slide: crossfades in/out and falls back to a placeholder on error. */
function Slide({ slide, active, eager, zoom, load }) {
  const placeholder = `/api/placeholder/${slide.w}/${slide.h}`;
  const [src, setSrc] = useState(slide.src || placeholder);

  // Start the zoom one frame after the slide becomes active so the browser
  // animates from scale(1) instead of jumping straight to the end.
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    if (!active || !zoom) {
      setZoomed(false);
      return;
    }
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setZoomed(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [active, zoom]);

  return (
    <div
      aria-hidden={!active}
      className="absolute inset-0 transition-opacity ease-in-out"
      style={{ opacity: active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      {load && (
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
            // Slow, continuous zoom-in while visible (off for reduced motion).
            // When the slide leaves, it holds its zoom until the fade-out
            // finishes, then resets invisibly.
            transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
            transition: zoomed
              ? `transform ${SLIDE_DURATION_MS + FADE_MS}ms linear`
              : `transform 0ms linear ${FADE_MS}ms`,
          }}
        />
      )}
    </div>
  );
}

export default function HeroSlideshow({ slides = heroSlideshowImages }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logoUrl || LOGO_PLACEHOLDER);
  const [logoFailed, setLogoFailed] = useState(false);
  const count = slides.length;

  // Download photos only as they're needed: the current slide, the next one,
  // and any already shown. Keeps the first page load light.
  const [loaded, setLoaded] = useState(() => new Set([0, 1]));
  useEffect(() => {
    setLoaded((prev) => {
      const next = (index + 1) % count;
      if (prev.has(index) && prev.has(next)) return prev;
      return new Set([...prev, index, next]);
    });
  }, [index, count]);

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
          <Slide
            key={slide.src + i}
            slide={slide}
            active={i === index}
            eager={i === 0}
            zoom={!reducedMotion}
            load={loaded.has(i)}
          />
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
                  i === index
                    ? "w-6 bg-[#1d1d1f]"
                    : "w-1.5 bg-[#1d1d1f]/30 hover:bg-[#1d1d1f]/50"
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
            {paused ? (
              <Play className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Pause className="h-3.5 w-3.5 fill-current" />
            )}
          </button>
        </div>
      )}

      {/* Static frosted-glass card — never moves with the slides */}
      <div className="mx-auto flex h-full max-w-7xl items-end px-5 pb-10 pt-28 sm:px-8 sm:pb-16">
        <div
          className={`w-full max-w-xl rounded-3xl bg-white/70 p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-white/40 backdrop-blur-lg backdrop-saturate-150 transition-all duration-1000 ${EASE} motion-reduce:transition-none sm:p-12 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {/* Logo doubles as the page's main heading for search engines and screen readers */}
          <h1 className="m-0">
            {logoFailed ? (
              <span className="text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                Perkins Lawn and Snow
              </span>
            ) : (
              <img
                src={logoSrc}
                alt="Perkins Lawn and Snow"
                width={606}
                height={196}
                fetchPriority="high"
                onError={() =>
                  logoSrc !== LOGO_PLACEHOLDER
                    ? setLogoSrc(LOGO_PLACEHOLDER)
                    : setLogoFailed(true)
                }
                className="h-auto w-56 max-w-full sm:w-72 lg:w-80"
              />
            )}
          </h1>
          <p className="mt-6 text-xl font-medium leading-snug tracking-tight text-[#6e6e73] sm:text-2xl">
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
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
