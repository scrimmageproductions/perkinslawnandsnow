import React from "react";
import {
  Leaf,
  Snowflake,
  Shovel,
  Trash2,
  Droplets,
  BrickWall,
  Sprout,
  Truck,
  ArrowUpRight,
} from "lucide-react";

/* ==================================================================== *
 *  SERVICES — EDIT HERE
 *
 *  Icon-and-title bento grid (no photos, no body text). On desktop the grid has
 *  4 columns; each card's `variant` decides its size and material:
 *
 *    "feature-green"    2×2, deep Forest Green, white text
 *    "feature-charcoal" 2×2, charcoal, white text
 *    "wide"             2×1, off-white, horizontal layout
 *    "tile"             1×1, off-white square
 *
 *  The order below is what makes the desktop grid pack cleanly:
 *    ┌───────────────┬───────┬───────┐
 *    │               │ tile  │ tile  │
 *    │  Lawn (green) ├───────┼───────┤
 *    │               │ tile  │ tile  │
 *    ├───────────────┼───────┴───────┤
 *    │  wide         │               │
 *    ├───────────────┤ Snow (charcoal)│
 *    │  wide         │               │
 *    └───────────────┴───────────────┘
 *  If you add or remove cards, keep the tiles in pairs and the wides
 *  in pairs so the grid stays gap-free.
 * ==================================================================== */
const services = [
  {
    title: "Lawn Care & Maintenance",
    icon: Leaf,
    variant: "feature-green",
  },
  { title: "Mulch Services", icon: Shovel, variant: "tile" },
  { title: "Fertilization Programs", icon: Sprout, variant: "tile" },
  { title: "Pressure Washing", icon: Droplets, variant: "tile" },
  { title: "Junk Removal Services", icon: Trash2, variant: "tile" },
  {
    title: "Concrete Services",
    icon: BrickWall,
    variant: "wide",
  },
  {
    title: "Snow Removal Services",
    icon: Snowflake,
    variant: "feature-charcoal",
  },
  {
    title: "Aggregate Delivery",
    icon: Truck,
    variant: "wide",
  },
];

const EXTRA_SERVICES =
  "Bush & shrub trimming, skid loader work, grading, light excavating, hauling, trucking, house cleanouts, storage cleanouts, and more.";

/* ----------------------------- Design tokens ------------------------ */
const GREEN = "#1e5631"; // Forest Green
const CHARCOAL = "#1d1d1f";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const SPAN = {
  "feature-green": "md:col-span-2 lg:row-span-2",
  "feature-charcoal": "md:col-span-2 lg:row-span-2",
  wide: "md:col-span-2",
  tile: "",
};

/* ----------------------------- Cards -------------------------------- */

/** Large 2×2 card on a dark material. Typography is the hero. */
function FeatureCard({ service }) {
  const { title, icon: Icon, variant } = service;
  const isGreen = variant === "feature-green";

  return (
    <article
      className={`group relative isolate flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl p-8 text-white sm:p-10 lg:min-h-0 xl:p-12`}
      style={{ backgroundColor: isGreen ? GREEN : CHARCOAL }}
    >
      {/* Oversized watermark icon, offset off the bottom-right corner */}
      <Icon
        aria-hidden="true"
        strokeWidth={0.9}
        className={`pointer-events-none absolute -bottom-16 -right-16 -z-10 h-80 w-80 transition-transform duration-[1200ms] ${EASE} group-hover:-rotate-6 group-hover:scale-105 sm:h-[26rem] sm:w-[26rem] ${
          isGreen ? "text-white/[0.09]" : "text-white/[0.07]"
        }`}
      />
      {/* Soft light falloff for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: isGreen
            ? "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.10), transparent 60%)"
            : "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.07), transparent 60%)",
        }}
      />

      <div className="flex items-start justify-between">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            isGreen ? "bg-white text-[#1e5631]" : "bg-[#7fc49b] text-[#1d1d1f]"
          }`}
        >
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </span>
      </div>

      <div className="mt-auto pt-16 lg:pt-8 xl:pt-16">
        <h3 className="max-w-md text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl">
          {title}
        </h3>
      </div>
    </article>
  );
}

/** 2×1 off-white card: text left, large faint icon anchored right. */
function WideCard({ service }) {
  const { title, icon: Icon } = service;
  return (
    <article
      className={`group relative isolate flex h-full min-h-[220px] items-end overflow-hidden rounded-3xl bg-[#f5f5f7] p-8 transition-colors duration-500 ${EASE} hover:bg-[#ececf0] sm:p-10`}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={0.9}
        className={`pointer-events-none absolute -right-6 top-1/2 -z-10 h-56 w-56 -translate-y-1/2 text-[#1d1d1f]/[0.06] transition-all duration-700 ${EASE} group-hover:-translate-x-3 group-hover:text-[#1e5631]/[0.14]`}
      />
      <div className="max-w-sm">
        <h3 className="text-3xl font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-4xl">{title}</h3>
      </div>
    </article>
  );
}

/** 1×1 off-white square: icon top, title anchored to the bottom. */
function TileCard({ service }) {
  const { title, icon: Icon } = service;
  return (
    <article
      className={`group flex h-full min-h-[220px] flex-col rounded-3xl bg-[#f5f5f7] p-8 transition-colors duration-500 ${EASE} hover:bg-[#ececf0] lg:aspect-square lg:h-auto lg:min-h-0 lg:w-full`}
    >
      <div className="flex items-start justify-between">
        <Icon
          className={`h-9 w-9 text-[#1e5631] transition-transform duration-500 ${EASE} group-hover:-translate-y-0.5 group-hover:scale-110`}
          strokeWidth={1.5}
        />
      </div>
      <div className="mt-auto pt-10">
        <h3 className="text-xl font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-2xl">{title}</h3>
      </div>
    </article>
  );
}

function ServiceCard({ service }) {
  if (service.variant?.startsWith("feature")) return <FeatureCard service={service} />;
  if (service.variant === "wide") return <WideCard service={service} />;
  return <TileCard service={service} />;
}

/* ----------------------------- Section ------------------------------ */
export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-28 font-sans antialiased sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: GREEN }}>
            Services
          </p>
          <h2 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight text-[#1d1d1f] sm:text-6xl xl:text-7xl">
            Everything your property needs.{" "}
            <br className="hidden lg:block" />
            All year.
          </h2>
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <p className="max-w-2xl text-xl leading-relaxed text-[#86868b] sm:text-2xl">
              From the first mow of spring to the last plow of winter, one local crew handles it all.
            </p>
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-1.5 font-semibold transition-opacity hover:opacity-80 sm:pb-1"
              style={{ color: GREEN }}
            >
              Request a free quote
              <ArrowUpRight
                className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
              />
            </a>
          </div>
        </header>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {services.map((service) => (
            <div key={service.title} className={SPAN[service.variant] || ""}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-16 max-w-3xl text-center text-lg leading-relaxed text-[#86868b] sm:mt-20">
          <span className="font-semibold text-[#1d1d1f]">We also offer:</span> {EXTRA_SERVICES}
        </p>
      </div>
    </section>
  );
}
