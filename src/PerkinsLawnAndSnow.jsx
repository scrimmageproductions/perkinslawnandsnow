import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Phone,
  MapPin,
  Menu,
  X,
  Star,
  Facebook,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ==================================================================== *
 *  IMAGES — EDIT HERE
 *
 *  Every photo on the site comes from the arrays below.
 *
 *  To change a photo, set its `src` to either:
 *    • a local file in /public/images, e.g.  "/images/my-photo.jpg"
 *    • a placeholder,                  e.g.  "/api/placeholder/800/600"
 *
 *  If a local file is missing (or you paste this component into a Claude
 *  Artifact, where /public is not available), the image automatically
 *  falls back to /api/placeholder at the size given in `w` / `h`.
 *
 *  `position` (optional) is the CSS object-position used when the photo
 *  is cropped, e.g. "70% center" keeps the right side of a wide photo.
 * ==================================================================== */

const heroImage = {
  src: "/images/hero-lawn-mowing.avif", // ← REPLACE: wide photo, 1600px+ across
  alt: "Lawn being mowed, seen from above",
  w: 1600,
  h: 900,
  position: "70% center",
};

const aboutImage = {
  src: "/images/perkins-truck-logo.avif", // ← REPLACE: e.g. a photo of Jason & Shannon or the crew
  alt: "Perkins Lawn and Snow work truck",
  w: 800,
  h: 600,
  position: "75% center",
};

const services = [
  {
    title: "Lawn Care & Maintenance",
    description: "Weekly mowing, edging and trimming that keeps your property looking sharp all season.",
    src: "/images/trimming-edging.avif", // ← REPLACE
    position: "60% center",
  },
  {
    title: "Snow Removal Services",
    description: "Plowing, shoveling and salting for driveways, sidewalks and commercial lots all winter long.",
    src: "/images/snow-plow-cab-view.jpg", // ← REPLACE
  },
  {
    title: "Mulch Services",
    description: "Fresh mulch delivered and installed to protect your beds and boost curb appeal.",
    src: "/images/mulch-commercial-shrubs.jpg", // ← REPLACE
  },
  {
    title: "Junk Removal Services",
    description: "Hauling of unwanted items, yard debris and construction waste, handled quickly.",
    src: "/images/mulch-pile-wheelbarrow.jpg", // ← REPLACE: stand-in photo, swap for a junk-hauling shot
  },
  {
    title: "Pressure Washing",
    description: "Driveways, patios, siding and decks cleaned of dirt, mildew and grime.",
    src: "/images/pressure-washing-pavers.jpg", // ← REPLACE
  },
  {
    title: "Concrete Services",
    description: "Durable concrete pads, walkways and driveways, finished with care.",
    src: "/images/concrete-walkway-steps.jpg", // ← REPLACE
    position: "center 60%",
  },
  {
    title: "Fertilization Programs",
    description: "Seasonal fertilization plans for thicker, greener and healthier turf.",
    src: "/images/hero-lawn-mowing.avif", // ← REPLACE: stand-in photo, swap for a fertilizing shot
    position: "30% center",
  },
  {
    title: "Aggregate Delivery",
    description: "Rock, gravel, sand and black dirt delivered right where you need it.",
    src: "/images/mulch-residential-deck.jpg", // ← REPLACE: stand-in photo, swap for a delivery/trailer shot
    position: "right center",
  },
];

const galleryImages = [
  // ← REPLACE / ADD: { src, caption, position? }. Keep the count a multiple of 3 for a full grid.
  { src: "/images/fall-cleanup-before-after.jpg", caption: "Fall leaf cleanup, before and after" },
  { src: "/images/mulch-commercial-shrubs.jpg", caption: "Mulch and shrub trimming, commercial property" },
  { src: "/images/mulch-residential-deck.jpg", caption: "Black mulch beds with stone borders" },
  { src: "/images/mulch-parking-lot-island.jpg", caption: "Parking lot island refreshed with mulch" },
  { src: "/images/snow-clearing-lot.avif", caption: "Clearing a snowed-in parking lot", position: "75% center" },
  { src: "/images/trimming-edging.avif", caption: "String trimming and edging", position: "60% center" },
  { src: "/images/concrete-walkway-steps.jpg", caption: "New stepped concrete walkway" },
  { src: "/images/landscape-fabric-planting.jpg", caption: "Shrubs planted through weed-barrier fabric" },
  { src: "/images/pressure-washing-pavers.jpg", caption: "Pressure washing a paver patio" },
];

const facebookPosts = [
  // ← REPLACE / ADD: copy text and photos from the Facebook page.
  // Set `src: null` for a text-only post.
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

const EXTRA_SERVICES =
  "Bush & shrub trimming, skid loader work, grading, light excavating, hauling, trucking, house cleanouts, storage cleanouts, and more.";

/* ----------------------------- Building blocks ---------------------- */

/** Photo with automatic fallback: src → /api/placeholder → flat grey block. */
function Photo({ src, alt = "", w = 800, h = 600, position = "center", className = "", eager = false }) {
  const placeholder = `/api/placeholder/${w}/${h}`;
  const [current, setCurrent] = useState(src || placeholder);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (current !== placeholder) setCurrent(placeholder);
    else setFailed(true);
  };

  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden bg-slate-200 ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm font-medium text-slate-500">
          {alt || "Photo"}
        </div>
      ) : (
        <img
          src={current}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={handleError}
          style={{ objectPosition: position }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function SectionHeading({ title, intro, align = "center" }) {
  const centered = align === "center";
  return (
    <div className={`mb-12 ${centered ? "mx-auto max-w-2xl text-center" : ""}`}>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{title}</h2>
      <div className={`mt-4 h-1 w-14 bg-green-800 ${centered ? "mx-auto" : ""}`} />
      {intro && <p className="mt-5 text-lg text-slate-600">{intro}</p>}
    </div>
  );
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-green-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-900";

/* ----------------------------- Sections ----------------------------- */

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="text-xl font-bold tracking-tight text-green-800 sm:text-2xl">
          Perkins Lawn <span className="font-semibold text-zinc-800">and Snow</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="border-b-2 border-transparent py-1 text-sm font-medium text-slate-700 transition-colors hover:border-green-800 hover:text-green-800"
            >
              {l.label}
            </a>
          ))}
          <a href={PHONE_HREF} className={`${btnPrimary} px-5 py-2.5 text-sm`}>
            <Phone className="h-4 w-4" />
            Call Now: {PHONE_DISPLAY}
          </a>
        </div>

        <button
          type="button"
          className="p-2 text-zinc-900 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 px-4 pb-5 lg:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-slate-100 py-3 font-medium text-slate-700 hover:text-green-800"
            >
              {l.label}
            </a>
          ))}
          <a href={PHONE_HREF} className={`${btnPrimary} mt-4 w-full`}>
            <Phone className="h-4 w-4" />
            Call Now: {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative">
      <Photo {...heroImage} eager className="absolute inset-0" />
      <div className="absolute inset-0 bg-zinc-900/60" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to Perkins Lawn and Snow
          </h1>
          <p className="mt-5 text-lg text-slate-200 sm:text-xl">
            Professional Lawn Care &amp; Snow Removal in Davenport, IA.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className={`${btnPrimary} px-7 py-3.5`}>
              Get a Free Quote
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-white px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-zinc-900"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-16 lg:px-8">
        <Photo {...aboutImage} className="aspect-[4/3] rounded-md" />
        <div>
          <SectionHeading title="About Our Family Business" align="left" />
          <div className="-mt-4 space-y-5 text-lg leading-relaxed text-slate-700">
            <p>
              Perkins Lawn and Snow planted its roots in the early 1980s when Jason helped his
              grandfather mow yards and shovel sidewalks. What started as earning extra money grew
              into a passion.
            </p>
            <p>
              In 2001, Jason jumped in with both feet, starting &ldquo;Perkins and Son&rsquo;s Snow
              Removal.&rdquo; As the company expanded, the name evolved to &ldquo;Perkins Lawn and
              Snow.&rdquo;
            </p>
            <p>
              Today, Jason and his wife Shannon own and operate the business together. We look
              forward to working with you!
            </p>
          </div>
          <a href="#contact" className={`${btnPrimary} mt-8`}>
            Get a Free Quote
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Services"
          intro="From spring cleanups to the first snowfall, one local crew handles it all."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.title}
              className="group overflow-hidden rounded-md border border-slate-200 bg-white transition-colors hover:border-green-800"
            >
              <Photo src={s.src} alt={s.title} w={600} h={450} position={s.position} className="aspect-[4/3]" />
              <div className="border-t-4 border-transparent p-5 transition-colors group-hover:border-green-800">
                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-green-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-3xl text-center text-slate-700">
          <span className="font-semibold text-zinc-900">We also offer:</span> {EXTRA_SERVICES}
        </p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Our Work" intro="Recent projects around Davenport and the Quad Cities." />
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img) => (
            <figure key={img.src + img.caption} className="group">
              <Photo
                src={img.src}
                alt={img.caption}
                w={600}
                h={600}
                position={img.position}
                className="aspect-square rounded-md ring-1 ring-slate-200 transition group-hover:ring-2 group-hover:ring-green-800"
              />
              <figcaption className="mt-3 text-sm text-slate-600">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < count ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="What Our Community Says" />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Google reviews */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">Google Reviews</h3>
            <div className="space-y-6">
              {googleReviews.map((r) => (
                <figure key={r.name} className="border-l-4 border-green-800 bg-white p-6">
                  <Stars count={r.rating} />
                  <blockquote className="mt-4 leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</blockquote>
                  <figcaption className="mt-4 font-semibold text-zinc-900">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Facebook feed */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Recent Updates
            </h3>
            <div className="space-y-6">
              {facebookPosts.map((post, i) => (
                <article key={i} className="overflow-hidden rounded-md border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-4 px-5 pt-5">
                    <p className="font-semibold text-zinc-900">Perkins Lawn and Snow</p>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Facebook className="h-3.5 w-3.5 text-blue-600" />
                      Posted on Facebook
                    </span>
                  </div>
                  <p className="px-5 py-4 text-sm leading-relaxed text-slate-700">{post.text}</p>
                  {post.src && (
                    <Photo src={post.src} alt={post.alt} w={800} h={400} position={post.position} className="aspect-[2/1]" />
                  )}
                </article>
              ))}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-green-800 hover:text-green-900"
              >
                See more on Facebook <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SERVICE_OPTIONS = [
  ...services.map((s) => s.title),
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
      <div className="rounded-md border border-slate-200 bg-white p-8 sm:p-10">
        <CheckCircle2 className="h-10 w-10 text-green-800" />
        <h3 className="mt-4 text-2xl font-bold text-zinc-900">Thank you!</h3>
        <p className="mt-2 text-slate-600">
          Your quote request has been sent. We&rsquo;ll be in touch shortly.
        </p>
        {!EMAIL_CONFIGURED && (
          <p className="mt-4 text-xs text-amber-700">Demo mode: add your EmailJS keys to send real emails.</p>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-semibold text-green-800 underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-zinc-900 placeholder-slate-400 focus:border-green-800 focus:outline-none focus:ring-1 focus:ring-green-800";
  const label = "block text-sm font-medium text-slate-700";
  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          First Name *
          <input name="firstName" required value={form.firstName} onChange={update} className={field} autoComplete="given-name" />
        </label>
        <label className={label}>
          Last Name *
          <input name="lastName" required value={form.lastName} onChange={update} className={field} autoComplete="family-name" />
        </label>
        <label className={label}>
          Email *
          <input type="email" name="email" required value={form.email} onChange={update} className={field} autoComplete="email" />
        </label>
        <label className={label}>
          Phone Number *
          <input type="tel" name="phone" required value={form.phone} onChange={update} className={field} autoComplete="tel" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Service Requested *
          <select name="service" required value={form.service} onChange={update} className={field}>
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>
          Message
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={update}
            className={field}
            placeholder="Tell us about your property and what you need."
          />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-5 flex items-start gap-2 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Sorry, we couldn&rsquo;t send your request. Please try again or call {PHONE_DISPLAY}.
        </p>
      )}

      <button type="submit" disabled={loading} className={`${btnPrimary} mt-6 w-full py-3.5 disabled:opacity-70`}>
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          "Request My Free Quote"
        )}
      </button>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get Your Free Quote"
          intro="Tell us about your project and we'll get back to you with a no-obligation estimate."
        />
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <dl className="divide-y divide-slate-200 border-y border-slate-200">
              <div className="flex gap-4 py-6">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-800" />
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-slate-500">Address</dt>
                  <dd className="mt-1">
                    <a href={MAPS_HREF} target="_blank" rel="noopener noreferrer" className="text-lg text-zinc-900 hover:text-green-800">
                      {ADDRESS}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 py-6">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-green-800" />
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-slate-500">Phone</dt>
                  <dd className="mt-1">
                    <a href={PHONE_HREF} className="text-lg text-zinc-900 hover:text-green-800">
                      {PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <p className="mt-6 leading-relaxed text-slate-600">
              Prefer to talk it through? Give us a call. We&rsquo;re happy to answer questions and
              schedule a time to look at your property.
            </p>
          </div>
          <div className="lg:col-span-3">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-900 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <div>
          <p className="font-semibold text-white">Perkins Lawn and Snow</p>
          <p className="mt-1 text-sm">
            {ADDRESS} &middot;{" "}
            <a href={PHONE_HREF} className="hover:text-white">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perkins Lawn and Snow on Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 text-slate-300 transition-colors hover:border-green-700 hover:bg-green-800 hover:text-white"
        >
          <Facebook className="h-5 w-5" />
        </a>
      </div>
      <div className="border-t border-zinc-800 py-5 text-center text-sm">
        &copy; 2023 Perkins Lawn and Snow-All Rights Reserved
      </div>
    </footer>
  );
}

/* ----------------------------- Page --------------------------------- */
export default function PerkinsLawnAndSnow() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 antialiased">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
