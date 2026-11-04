import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import HeroSlideshow, { heroSlideshowImages } from "./HeroSlideshow.jsx"; // hero photos are set in HeroSlideshow.jsx
import ServicesSection from "./ServicesSection.jsx"; // services are set in ServicesSection.jsx
import {
  Phone,
  MapPin,
  Menu,
  X,
  Star,
  Facebook,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

/* ==================================================================== *
 *  IMAGES & CONTENT — EDIT HERE
 *
 *  Every photo on the site comes from the data below.
 *
 *  To change a photo, set its `src` to either:
 *    • a local file in /public/images, e.g.  "/images/my-photo.jpg"
 *    • a placeholder,                  e.g.  "/api/placeholder/800/600"
 *
 *  If a local file is missing (or this component is pasted into a Claude
 *  Artifact, where /public is not available), each image automatically
 *  falls back to /api/placeholder at the size given in `w` / `h`.
 *
 *  `position` (optional) = CSS object-position used when a photo is
 *  cropped, e.g. "70% center" keeps the right side of a wide photo.
 * ==================================================================== */

const LOGO_SRC = "/images/perkins-logo.avif"; // official Perkins Lawn & Snow logo — do not restyle

// ← REPLACE: street map of Davenport, IA shown faintly behind the About heading.
// Any image works (JPG/PNG/SVG/AVIF in /public/images, e.g. "/images/davenport-map.png").
// It is automatically converted to grayscale and shown at 15% opacity, with
// softly faded edges, so a full-color map export is fine.
const davenportMapUrl = "/images/davenport-map.png";

// Fade only the outer ~18% on each side; the middle of the map stays at full
// strength. Two linear masks are intersected so all four edges fade evenly.
const MAP_EDGE_FADE = [
  "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
  "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
].join(", ");

const aboutImage = {
  src: "/images/perkins-truck-logo.avif", // ← REPLACE: e.g. Jason & Shannon, or the crew
  alt: "Perkins Lawn and Snow work truck",
  w: 1200,
  h: 900,
  position: "65% center",
};


// Gallery shows the same real client photos as the hero slideshow.
// To add, remove or reorder photos, edit `heroSlideshowImages` in HeroSlideshow.jsx.
// Portrait photos show uncropped at 3:4. Wide photos (wider than 4:3) span two
// columns, so 10 portraits + 1 wide fill a clean 4×3 grid on desktop.
const WIDE_PHOTOS = ["hero-lawn-mowing"]; // ← add a filename here if you add another wide photo
const galleryImages = heroSlideshowImages.map((img) => ({
  src: img.src,
  caption: img.alt,
  position: img.position,
  wide: WIDE_PHOTOS.some((name) => img.src.includes(name)),
}));

const facebookPosts = [
  // ← REPLACE / ADD: copy text and photos from the Facebook page. `src: null` = text-only.
  {
    text: "Another massive driveway cleared and salted before the morning commute! ❄️ We take pride in making sure our Davenport neighbors can get out safely, no matter how much snow drops overnight. Give us a call to get on our route!",
    src: "/images/snow-clearing-lot.avif", // ← REPLACE
    alt: "Snow being cleared from a parking lot",
    position: "75% center",
  },
  {
    text: "Spring cleanup in full swing! 🌱 Check out the sharp edges and fresh mulch on this property. We love transforming a winter-weary yard into a pristine outdoor space. Quality work is always our top priority.",
    src: "/images/mulch-residential-deck.jpg", // ← REPLACE
    alt: "Fresh black mulch bed beside a deck",
  },
];

const googleReviews = [
  {
    name: "Dawn Brock",
    rating: 5,
    text: "These people did something they normally don't do, but since I am so close, they did... they came and dug out my driveway of snow... I can't say enough about them.. I appreciate it all. Thank you is not enough....you guys are amazing! This teacher appreciates it so much!",
  },
  {
    name: "Dan Michels",
    rating: 5,
    text: "I have delt with Jason at Perkins Lawn Care for several years now. From lawns to snow removal, this is the company you need.",
  },
];

/* ==================================================================== *
 *  EMAIL — EmailJS (client-side, no server needed)
 *
 *  1. Create a free account at https://www.emailjs.com
 *  2. Add an Email Service connected to the Perkins inbox → Service ID
 *  3. Create a template using:
 *       {{first_name}} {{last_name}} {{from_name}} {{reply_to}}
 *       {{phone}} {{service}} {{message}} {{submitted_at}}
 *     Set "To Email" to the Perkins inbox and "Reply To" to {{reply_to}}
 *     → Template ID
 *  4. Account → General → Public Key
 *  5. Put the values in .env (see .env.example) or paste them below.
 *
 *  Without keys the form runs in DEMO MODE: it shows the loading and
 *  success states but sends nothing.
 * ==================================================================== */
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAIL_CONFIGURED = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

/* ----------------------------- Business info ------------------------ */
const PHONE_DISPLAY = "(563) 676-8052";
const PHONE_HREF = "tel:+15636768052";
const ADDRESS = "5519 W River Dr, Davenport, IA 52802";
const MAPS_HREF = "https://www.google.com/maps/search/?api=1&query=5519+W+River+Dr+Davenport+IA+52802";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100062919445046";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

/* ----------------------------- Design tokens ------------------------ *
 *  Ink #1d1d1f (headings) · Body #6e6e73 · Secondary #86868b
 *  Off-white #f5f5f7 · Forest green #1e5631 (hover #17452a)
 * --------------------------------------------------------------------- */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const pillPrimary = `inline-flex items-center justify-center gap-2 rounded-full bg-[#1e5631] font-medium text-white transition-all duration-300 ${EASE} hover:bg-[#17452a] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1e5631]/30`;
const softShadow = "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]";

/* ----------------------------- Building blocks ---------------------- */

/** Photo with automatic fallback: src → /api/placeholder → soft grey block. */
function Photo({ src, alt = "", w = 800, h = 600, position = "center", className = "", imgClassName = "", eager = false }) {
  const placeholder = `/api/placeholder/${w}/${h}`;
  const [current, setCurrent] = useState(src || placeholder);
  const [failed, setFailed] = useState(false);
  const isAbsolute = /\babsolute\b/.test(className);

  return (
    <div className={`${isAbsolute ? "" : "relative"} overflow-hidden bg-[#e8e8ed] ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-[#86868b]">
          {alt || "Photo"}
        </div>
      ) : (
        <img
          src={current}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => (current !== placeholder ? setCurrent(placeholder) : setFailed(true))}
          style={{ objectPosition: position }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}

/** Fades content up as it scrolls into view. Honors reduced-motion. */
function Reveal({ children, className = "", delay = 0 }) {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ${EASE} motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionIntro({ eyebrow, title, intro, className = "" }) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1e5631]">{eyebrow}</p>}
      <h2 className="mt-4 text-5xl font-semibold tracking-tight text-[#1d1d1f] sm:text-6xl">{title}</h2>
      {intro && <p className="mt-6 text-xl leading-relaxed text-[#6e6e73]">{intro}</p>}
    </Reveal>
  );
}

/* ----------------------------- Sections ----------------------------- */

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-md backdrop-saturate-150">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="shrink-0" aria-label="Perkins Lawn and Snow, back to top">
          <img src={LOGO_SRC} alt="Perkins Lawn and Snow" width={606} height={196} className="h-9 w-auto sm:h-10" />
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[#1d1d1f]/75 transition-colors duration-300 hover:text-[#1d1d1f]"
            >
              {l.label}
            </a>
          ))}
          <a href={PHONE_HREF} className={`${pillPrimary} px-5 py-2 text-[13px]`}>
            <Phone className="h-3.5 w-3.5" />
            Call Now: {PHONE_DISPLAY}
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 text-[#1d1d1f] lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-500 ${EASE} lg:hidden ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-6 pt-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/5 py-3.5 text-lg font-medium text-[#1d1d1f]"
            >
              {l.label}
            </a>
          ))}
          <a href={PHONE_HREF} className={`${pillPrimary} mt-5 w-full py-3.5`}>
            <Phone className="h-4 w-4" />
            Call Now: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </header>
  );
}

// Feathered edges for the frosted backdrop behind the About heading.
const GLASS_FEATHER = "radial-gradient(ellipse 50% 50% at 50% 50%, #000 55%, transparent 100%)";

function About() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Parallax: as the section scrolls through the viewport, the big
  // "Since the 1980s" header drifts up more slowly than the page around it.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-70, 70]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-white py-28 sm:py-36">
      {/* Massive ultra-light background header with scroll-linked parallax */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          style={{ y: headerY }}
          className="pointer-events-none select-none text-[17vw] font-extralight leading-[0.85] tracking-[-0.04em] text-[#1d1d1f]/[0.09] will-change-transform sm:whitespace-nowrap sm:text-[clamp(3.25rem,11vw,10rem)]"
        >
          SINCE THE <br className="sm:hidden" />
          1980s
        </motion.p>
      </div>

      <div className="relative mx-auto mt-6 grid max-w-7xl gap-14 px-5 sm:-mt-10 sm:px-8 lg:-mt-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative isolate lg:col-span-5">
          {/* Hometown texture: faint grayscale Davenport street map behind the heading */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-5 -inset-y-10 -z-10 bg-cover bg-center opacity-[0.15] grayscale sm:-inset-x-8 lg:inset-x-0 lg:-inset-y-12"
            style={{
              backgroundImage: `url("${davenportMapUrl}")`,
              // Fade only the outer edges so the map blends into the white background.
              WebkitMaskImage: MAP_EDGE_FADE,
              WebkitMaskComposite: "source-in",
              maskImage: MAP_EDGE_FADE,
              maskComposite: "intersect",
            }}
          />
          <div className="relative z-10 lg:pt-10">
            {/* Soft frosted backdrop: blurs and lightens the map just behind the
                text, with feathered edges so there's no visible box. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 bg-white/70 backdrop-blur-[3px] sm:-inset-x-14 sm:-inset-y-14"
              style={{ WebkitMaskImage: GLASS_FEATHER, maskImage: GLASS_FEATHER }}
            />
            <SectionIntro
              title="About Our Family Business"
              intro="A Davenport family business, built one yard and one driveway at a time."
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <Photo {...aboutImage} className={`aspect-[16/10] rounded-3xl ${softShadow}`} />
          </Reveal>
          <Reveal delay={150} className="relative -mt-10 ml-auto w-[92%] sm:-mt-12 sm:w-[85%]">
            <div className={`space-y-5 rounded-3xl bg-white p-8 text-lg leading-relaxed text-[#6e6e73] sm:p-11 ${softShadow}`}>
              <p>
                Perkins Lawn and Snow planted its roots in the early 1980s when Jason helped his grandfather
                mow yards and shovel sidewalks. What started as earning extra money grew into a passion.
              </p>
              <p>
                In 2001, Jason jumped in with both feet, starting &ldquo;Perkins and Son&rsquo;s Snow
                Removal.&rdquo; As the company expanded, the name evolved to &ldquo;Perkins Lawn and Snow.&rdquo;
              </p>
              <p>
                Today, Jason and his wife Shannon own and operate the business together, striving to keep
                employees and clients happy.{" "}
                <span className="font-medium text-[#1d1d1f]">We look forward to working with you!</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="bg-[#f5f5f7] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionIntro eyebrow="Gallery" title="Our work speaks for itself." className="mb-16 sm:mb-20" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {galleryImages.map((img, i) => (
            <Reveal
              key={img.src + i}
              delay={(i % 3) * 100}
              className={img.wide ? "sm:col-span-2" : ""}
            >
              <figure className="group relative h-full overflow-hidden rounded-3xl">
                <Photo
                  src={img.src}
                  alt={img.caption}
                  w={img.wide ? 1600 : 600}
                  h={800}
                  position={img.position}
                  className={
                    img.wide
                      ? "aspect-[4/3] sm:aspect-[2/1] lg:aspect-auto lg:h-full"
                      : "aspect-[3/4]"
                  }
                  imgClassName={`transition-transform duration-1000 ${EASE} group-hover:scale-105`}
                />
                <figcaption
                  className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-6 pb-5 pt-16 text-sm font-medium text-white transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100`}
                >
                  {img.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionIntro eyebrow="Reviews" title="What Our Community Says" className="mb-16 sm:mb-24" />

        <div className="grid gap-20 lg:grid-cols-12 lg:gap-16">
          {/* Reviews */}
          <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
            <span
              aria-hidden="true"
              className="-mb-10 block select-none font-serif text-[9rem] leading-none text-[#1e5631]/20 sm:-mb-14 sm:text-[12rem]"
            >
              &ldquo;
            </span>
            <div className="space-y-16">
              {googleReviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 120}>
                  <figure>
                    <blockquote className="text-2xl font-medium leading-snug tracking-tight text-[#1d1d1f] sm:text-3xl">
                      {r.text}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 text-[#86868b]">
                      <span className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${j < r.rating ? "fill-[#1e5631] text-[#1e5631]" : "text-[#d2d2d7]"}`}
                          />
                        ))}
                      </span>
                      <span className="font-medium text-[#1d1d1f]">{r.name}</span>
                      <span>· Google</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Facebook updates, styled like iOS widgets */}
          <div className="lg:col-span-5">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#86868b]">Recent Updates</p>
            <div className="space-y-5">
              {facebookPosts.map((post, i) => (
                <Reveal key={i} delay={i * 120}>
                  <article
                    className={`rounded-3xl bg-[#f5f5f7] p-5 transition-all duration-700 ${EASE} hover:scale-[1.02] hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.25)] sm:p-6`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877f2]">
                        <Facebook className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                      </span>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-[#1d1d1f]">Perkins Lawn and Snow</p>
                        <p className="text-xs text-[#86868b]">Posted on Facebook</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#1d1d1f]">{post.text}</p>
                    {post.src && (
                      <Photo
                        src={post.src}
                        alt={post.alt}
                        w={800}
                        h={450}
                        position={post.position}
                        className="mt-4 aspect-video rounded-2xl"
                      />
                    )}
                  </article>
                </Reveal>
              ))}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 pl-1 font-medium text-[#1e5631] hover:text-[#17452a]"
              >
                More on Facebook
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SERVICE_OPTIONS = [
  "Lawn Care & Maintenance",
  "Snow Removal Services",
  "Mulch Services",
  "Junk Removal Services",
  "Pressure Washing",
  "Concrete Services",
  "Fertilization Programs",
  "Aggregate Delivery",
  "Bush & Shrub Trimming",
  "Skid Loader / Grading / Excavating",
  "Hauling & Trucking",
  "House or Storage Cleanout",
  "Other",
];

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", service: "", message: "" };

function QuoteForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const params = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      from_name: `${form.firstName} ${form.lastName}`.trim(),
      reply_to: form.email.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.service,
      message: form.message.trim() || "(no details provided)",
      submitted_at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
    };

    try {
      if (EMAIL_CONFIGURED) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      } else {
        console.info("[Demo mode] Quote request (EmailJS not configured):", params);
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Quote submission failed:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-start justify-center py-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e5631]">
          <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
        </span>
        <h3 className="mt-6 text-3xl font-semibold tracking-tight text-[#1d1d1f]">Thank you.</h3>
        <p className="mt-3 text-lg text-[#6e6e73]">Your request is on its way. We&rsquo;ll be in touch shortly.</p>
        {!EMAIL_CONFIGURED && (
          <p className="mt-4 text-xs text-[#86868b]">Demo mode: add your EmailJS keys to send real emails.</p>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="group mt-8 inline-flex items-center gap-1 font-medium text-[#1e5631]"
        >
          Send another request
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`} />
        </button>
      </div>
    );
  }

  const field = `mt-2 block w-full rounded-xl border-0 bg-white px-4 py-3.5 text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] placeholder:text-[#86868b] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#1e5631]`;
  const label = "block text-sm font-medium text-[#1d1d1f]";
  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          First Name
          <input name="firstName" required value={form.firstName} onChange={update} className={field} autoComplete="given-name" />
        </label>
        <label className={label}>
          Last Name
          <input name="lastName" required value={form.lastName} onChange={update} className={field} autoComplete="family-name" />
        </label>
        <label className={label}>
          Email
          <input type="email" name="email" required value={form.email} onChange={update} className={field} autoComplete="email" />
        </label>
        <label className={label}>
          Phone Number
          <input type="tel" name="phone" required value={form.phone} onChange={update} className={field} autoComplete="tel" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Service Requested
          <select name="service" required value={form.service} onChange={update} className={field}>
            <option value="" disabled>
              Choose a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>
          Project Details
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={update}
            className={`${field} resize-none`}
            placeholder="Tell us about your property and what you need."
          />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-5 flex items-start gap-2 text-sm text-red-600" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Something went wrong. Please try again or call {PHONE_DISPLAY}.
        </p>
      )}

      <button type="submit" disabled={loading} className={`${pillPrimary} mt-8 w-full py-4 text-base disabled:opacity-70 sm:w-auto sm:px-10`}>
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          "Request Free Quote"
        )}
      </button>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid gap-14 rounded-3xl bg-[#f5f5f7] px-6 py-14 sm:p-14 lg:grid-cols-12 lg:gap-16 lg:p-20">
            <div className="lg:col-span-5">
              <h2 className="text-5xl font-semibold tracking-tight text-[#1d1d1f] sm:text-6xl">Get Your Free Quote.</h2>
              <p className="mt-6 text-xl leading-relaxed text-[#6e6e73]">
                Tell us about your project. We&rsquo;ll get back to you with a no-obligation estimate.
              </p>
              <div className="mt-12 space-y-6">
                <a href={MAPS_HREF} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#1e5631]" />
                  <span className="text-lg text-[#1d1d1f] transition-colors group-hover:text-[#1e5631]">{ADDRESS}</span>
                </a>
                <a href={PHONE_HREF} className="group flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-[#1e5631]" />
                  <span className="text-lg text-[#1d1d1f] transition-colors group-hover:text-[#1e5631]">{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <QuoteForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-5 border-t border-black/5 px-5 py-10 sm:flex-row sm:px-8">
        <p className="text-sm text-[#86868b]">&copy; 2023 Perkins Lawn and Snow-All Rights Reserved</p>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perkins Lawn and Snow on Facebook"
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] transition-all duration-300 ${EASE} hover:scale-105 hover:bg-[#1e5631] hover:text-white`}
        >
          <Facebook className="h-[18px] w-[18px]" />
        </a>
      </div>
    </footer>
  );
}

/* ----------------------------- Page --------------------------------- */
export default function PerkinsLawnAndSnow() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f] antialiased selection:bg-[#1e5631] selection:text-white">
      <Header />
      <main>
        <HeroSlideshow />
        <About />
        <ServicesSection />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
