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
 *  Text-and-icon bento grid (no photos). On desktop the grid has
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
    description: "Precision mowing, edging and trimming that keeps your property sharp from the first cut of spring to the last of fall.",
    tags: ["Weekly mowing", "Edging & trimming", "Seasonal cleanups"],
    icon: Leaf,
    variant: "feature-green",
  },
  { title: "Mulch Services", description: "Fresh beds. Crisp edges.", icon: Shovel, variant: "tile" },
  { title: "Fertilization Programs", description: "Thicker, greener turf.", icon: Sprout, variant: "tile" },
  { title: "Pressure Washing", description: "Years of grime, gone.", icon: Droplets, variant: "tile" },
  { title: "Junk Removal Services", description: "Hauled away, fast.", icon: Trash2, variant: "tile" },
  {
    title: "Concrete Services",
    description: "Pads, walkways and driveways, poured and finished to last.",
    icon: BrickWall,
    variant: "wide",
  },
  {
    title: "Snow Removal Services",
    description: "Driveways, sidewalks and commercial lots cleared and salted before the morning commute. All winter long.",
    tags: ["Plowing", "Shoveling", "Salting"],
    icon: Snowflake,
    variant: "feature-charcoal",
  },
  {
    title: "Aggregate Delivery",
    description: "Rock, gravel, sand and black dirt, dropped exactly where you need it.",
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

const pad = (n) => String(n).padStart(2, "0");

/* ----------------------------- Cards -------------------------------- */

/** Large 2×2 card on a dark material. Typography is the hero. */
function FeatureCard({ service, index }) {
  const { title, description, tags = [], icon: Icon, variant } = service;
  const isGreen = variant === "feature-green";

  return (
    <article
      className={`group relative isolate flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl p-8 text-white sm:p-10 lg:min-h-0 lg:p-12`}
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
        <span className="font-mono text-sm tabular-nums text-white/50">{pad(index + 1)}</span>
      </div>

      <div className="mt-auto pt-16">
        <h3 className="max-w-md text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">{description}</p>
        {tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** 2×1 off-white card: text left, large faint icon anchored right. */
function WideCard({ service, index }) {
  const { title, description, icon: Icon } = service;
  return (
    <article
      className={`group relative isolate flex h-full min-h-[220px] items-end overflow-hidden rounded-3xl bg-[#f5f5f7] p-8 transition-colors duration-500 ${EASE} hover:bg-[#ececf0] sm:p-10`}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={0.9}
        className={`pointer-events-none absolute -right-6 top-1/2 -z-10 h-56 w-56 -translate-y-1/2 text-[#1d1d1f]/[0.06] transition-all duration-700 ${EASE} group-hover:-translate-x-3 group-hover:text-[#1e5631]/[0.14]`}
      />
      <span className="absolute left-8 top-8 font-mono text-sm tabular-nums text-[#86868b] sm:left-10 sm:top-10">
        {pad(index + 1)}
      </span>
      <div className="max-w-sm">
        <h3 className="text-3xl font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-4xl">{title}</h3>
        <p className="mt-3 text-[17px] leading-relaxed text-[#6e6e73]">{description}</p>
      </div>
    </article>
  );
}

/** 1×1 off-white square: icon top, title anchored to the bottom. */
function TileCard({ service, index }) {
  const { title, description, icon: Icon } = service;
  return (
    <article
      className={`group flex h-full min-h-[220px] flex-col rounded-3xl bg-[#f5f5f7] p-8 transition-colors duration-500 ${EASE} hover:bg-[#ececf0] lg:aspect-square lg:min-h-0`}
    >
      <div className="flex items-start justify-between">
        <Icon
          className={`h-9 w-9 text-[#1e5631] transition-transform duration-500 ${EASE} group-hover:-translate-y-0.5 group-hover:scale-110`}
          strokeWidth={1.5}
        />
        <span className="font-mono text-sm tabular-nums text-[#86868b]">{pad(index + 1)}</span>
      </div>
      <div className="mt-auto pt-10">
        <h3 className="text-xl font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-2xl">{title}</h3>
        <p className="mt-2 text-[15px] leading-snug text-[#6e6e73]">{description}</p>
      </div>
    </article>
  );
}

function ServiceCard({ service, index }) {
  if (service.variant?.startsWith("feature")) return <FeatureCard service={service} index={index} />;
  if (service.variant === "wide") return <WideCard service={service} index={index} />;
  return <TileCard service={service} index={index} />;
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
          {services.map((service, i) => (
            <div key={service.title} className={SPAN[service.variant] || ""}>
              <ServiceCard service={service} index={i} />
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
