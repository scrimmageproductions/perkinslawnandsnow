import React, { useEffect, useRef, useState } from "react";
import {
  Leaf,
  Snowflake,
  Shovel,
  Trash2,
  Droplets,
  BrickWall,
  Sprout,
  Truck,
} from "lucide-react";

/* ==================================================================== *
 *  SERVICES — EDIT HERE
 *
 *  Text-and-icon only (no photos). Each card needs a title, a short
 *  1–2 sentence description and a Lucide icon (https://lucide.dev/icons).
 *  Keep the count even so the 2-column grid has no empty slot.
 * ==================================================================== */
const services = [
  {
    title: "Lawn Care & Maintenance",
    description: "Precision mowing, edging and trimming. Every week, all season long.",
    icon: Leaf,
  },
  {
    title: "Snow Removal Services",
    description: "Plowed, shoveled and salted before your morning commute. Residential and commercial.",
    icon: Snowflake,
  },
  {
    title: "Mulch Services",
    description: "Fresh beds and crisp edges, delivered and installed. Instant curb appeal.",
    icon: Shovel,
  },
  {
    title: "Junk Removal Services",
    description: "Yard debris, old furniture, construction waste. Hauled away, fast.",
    icon: Trash2,
  },
  {
    title: "Pressure Washing",
    description: "Driveways, patios, siding and decks, cleaned of years of grime.",
    icon: Droplets,
  },
  {
    title: "Concrete Services",
    description: "Pads, walkways and driveways, poured and finished to last.",
    icon: BrickWall,
  },
  {
    title: "Fertilization Programs",
    description: "Seasonal treatments for thicker, greener, healthier turf.",
    icon: Sprout,
  },
  {
    title: "Aggregate Delivery",
    description: "Rock, gravel, sand and black dirt, dropped exactly where you need it.",
    icon: Truck,
  },
];

const EXTRA_SERVICES =
  "Bush & shrub trimming, skid loader work, grading, light excavating, hauling, trucking, house cleanouts, storage cleanouts, and more.";

/* ----------------------------- Design tokens ------------------------ */
const GREEN = "#1e5631"; // Forest Green
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Fades content up as it scrolls into view. Skipped for reduced motion. */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ServiceCard({ title, description, icon: Icon }) {
  return (
    <article
      className={`group h-full rounded-3xl bg-[#f5f5f7] p-8 transition-all duration-500 ${EASE} hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.03)] motion-reduce:hover:translate-y-0 sm:p-10 lg:p-12`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-500 ${EASE} group-hover:scale-110 group-hover:bg-[#1e5631] group-hover:text-white group-hover:shadow-[0_10px_24px_-10px_rgba(30,86,49,0.6)]`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.6} />
      </div>

      <h3 className="mt-10 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-[1.75rem] sm:leading-tight">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[17px] leading-relaxed text-[#6e6e73]">{description}</p>
    </article>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-28 font-sans antialiased sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <Reveal className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: GREEN }}>
            Services
          </p>
          <h2 className="mt-5 text-5xl font-bold leading-[1.04] tracking-tight text-[#1d1d1f] sm:text-6xl lg:text-7xl">
            Everything your property needs. All year.
          </h2>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-[#86868b] sm:text-2xl">
            From the first mow of spring to the last plow of winter, one local crew handles it all.
          </p>
        </Reveal>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-2 md:gap-6 lg:gap-8">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 2) * 120}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
          <p className="text-lg leading-relaxed text-[#86868b]">
            <span className="font-semibold text-[#1d1d1f]">We also offer:</span> {EXTRA_SERVICES}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
