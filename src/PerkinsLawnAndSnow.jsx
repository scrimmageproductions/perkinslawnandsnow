import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Leaf,
  Snowflake,
  Shovel,
  Trash2,
  Droplets,
  BrickWall,
  Sprout,
  Truck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Users,
  Award,
  CalendarDays,
  Facebook,
  Star,
  Quote,
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  EMAIL CONFIGURATION (EmailJS — client-side, no server required)
 *
 *  1. Create a free account at https://www.emailjs.com
 *  2. Add an Email Service (Gmail, Outlook, etc.) connected to the
 *     Perkins inbox  -> copy the Service ID.
 *  3. Create an Email Template. Use these variables in the template:
 *       {{first_name}} {{last_name}} {{from_name}} {{reply_to}}
 *       {{phone}} {{service}} {{message}} {{submitted_at}}
 *     Set "To Email" to the Perkins inbox and "Reply To" to {{reply_to}}
 *     -> copy the Template ID.
 *  4. Account > General -> copy the Public Key.
 *  5. Put the three values in a .env file (see .env.example) or paste
 *     them directly below.
 *
 *  If the keys are left blank, the form runs in DEMO MODE: it simulates
 *  a successful submission so the UI can be previewed (e.g. in a Claude
 *  Artifact) without sending real email.
 * ------------------------------------------------------------------ */
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAIL_CONFIGURED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
);

/* ----------------------------- Content ----------------------------- */
const PHONE_DISPLAY = "(563) 676-8052";
const PHONE_HREF = "tel:+15636768052";
const ADDRESS = "5519 W River Dr, Davenport, IA 52802";
const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=5519+W+River+Dr+Davenport+IA+52802";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    title: "Lawn Care & Maintenance",
    icon: Leaf,
    desc: "Weekly mowing, edging, trimming and seasonal cleanups that keep your property looking sharp all year.",
  },
  {
    title: "Snow Removal Services",
    icon: Snowflake,
    desc: "Reliable plowing, shoveling and salting for driveways, sidewalks and commercial lots — all winter long.",
  },
  {
    title: "Mulch Services",
    icon: Shovel,
    desc: "Fresh mulch delivered and installed to protect beds, retain moisture and boost curb appeal.",
  },
  {
    title: "Junk Removal Services",
    icon: Trash2,
    desc: "Fast, hassle-free hauling of unwanted items, yard debris and construction waste.",
  },
  {
    title: "Pressure Washing",
    icon: Droplets,
    desc: "Restore driveways, patios, siding and decks by blasting away dirt, mildew and grime.",
  },
  {
    title: "Concrete Services",
    icon: BrickWall,
    desc: "Durable concrete work for pads, walkways and driveways, finished with care.",
  },
  {
    title: "Fertilization Programs",
    icon: Sprout,
    desc: "Seasonal fertilization plans designed for thicker, greener and healthier turf.",
  },
  {
    title: "Aggregate Delivery",
    icon: Truck,
    desc: "Rock, gravel, sand and black dirt delivered right where you need it.",
  },
];

const EXTRA_SERVICES =
  "Bush & shrub trimming, skid loader work, grading, light excavating, hauling, trucking, house cleanouts, storage cleanouts, and more.";

// Real project photos live in /public/images. Items without `src` show a
// labelled placeholder until the client supplies a photo.
const GALLERY = [
  {
    label: "Fall Cleanup — Before & After",
    caption: "Fall leaf cleanup: before & after",
    src: "/images/fall-cleanup-before-after.jpg",
    beforeAfter: true,
  },
  {
    label: "Commercial Mulch & Shrub Trimming",
    caption: "Fresh mulch & trimmed shrubs at a commercial property",
    src: "/images/mulch-commercial-shrubs.jpg",
  },
  {
    label: "Residential Black Mulch Beds",
    caption: "Black mulch beds with clean stone borders",
    src: "/images/mulch-residential-deck.jpg",
  },
  {
    label: "Parking Lot Island Mulch",
    caption: "Parking lot island refreshed with new mulch",
    src: "/images/mulch-parking-lot-island.jpg",
  },
  {
    label: "Snow Plowing",
    caption: "Clearing a snowed-in parking lot",
    src: "/images/snow-clearing-lot.avif",
    position: "75% center",
  },
  {
    label: "Trimming & Edging",
    caption: "Precise string trimming & edging",
    src: "/images/trimming-edging.avif",
    position: "60% center",
  },
];

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100062919445046";

const REVIEWS = [
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

// Swap `image` for a real photo path (e.g. "/images/fb-driveway.jpg") when available.
const FACEBOOK_POSTS = [
  {
    text: "Another massive driveway cleared and salted before the morning commute! ❄️ We take pride in making sure our Davenport neighbors can get out safely, no matter how much snow drops overnight. Give us a call to get on our route!",
    imageLabel: "Facebook Post — Cleared Driveway",
    image: "/images/snow-clearing-lot.avif",
  },
  {
    text: "Spring cleanup in full swing! 🌱 Check out the sharp edges and fresh mulch on this property. We love transforming a winter-weary yard into a pristine outdoor space. Quality work is always our top priority.",
    imageLabel: "Facebook Post — Spring Cleanup",
    image: "/images/mulch-residential-deck.jpg",
  },
];

/* --------------------------- Helpers ------------------------------- */

/**
 * Image with a placeholder fallback. Without `src` it loads
 * /api/placeholder/W/H and shows a text label so the client knows what
 * photo belongs there. With `src` (a real photo) the label is hidden.
 * If an image fails to load, a branded gradient is shown instead.
 */
function PlaceholderImage({
  width,
  height,
  label,
  className = "",
  src,
  labelClassName = "items-center justify-center",
  position = "center", // CSS object-position, e.g. "75% center"
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  const url = src || `/api/placeholder/${width}/${height}`;
  const showLabel = !src || failed;
  return (
    <div
      className={`${
        /\babsolute\b/.test(className) ? "" : "relative"
      } overflow-hidden bg-slate-700 ${className}`}
    >
      {!failed && (
        <img
          src={url}
          alt={label}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          style={{ objectPosition: position }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {failed && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-slate-700 to-zinc-900" />
      )}
      {showLabel && (
        <div className={`absolute inset-0 flex bg-zinc-900/40 ${labelClassName}`}>
          <span className="rounded-md border border-white/40 bg-zinc-900/60 px-4 py-2 text-center text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p
        className={`mb-3 text-sm font-semibold uppercase tracking-widest ${
          light ? "text-green-300" : "text-green-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-zinc-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* --------------------------- Sections ------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center" aria-label="Perkins Lawn and Snow — home">
          <img
            src="/images/perkins-logo.avif"
            alt="Perkins Lawn and Snow"
            width={606}
            height={196}
            className="h-10 w-auto sm:h-12"
          />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-green-800"
            >
              {l.label}
            </a>
          ))}
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-900"
          >
            <Phone className="h-4 w-4" />
            Call Now: {PHONE_DISPLAY}
          </a>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-900 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-2 lg:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-green-800"
            >
              {l.label}
            </a>
          ))}
          <a
            href={PHONE_HREF}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-800 px-5 py-3 font-semibold text-white"
          >
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
    <section id="home" className="relative flex min-h-screen items-center pt-20">
      <PlaceholderImage
        width={1600}
        height={900}
        label="Lawn being mowed, seen from above"
        src="/images/hero-lawn-mowing.avif"
        position="70% center"
        eager
        className="absolute inset-0"
        labelClassName="items-end justify-end p-6"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/30" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-800/90 px-4 py-1.5 text-sm font-medium text-white">
            <MapPin className="h-4 w-4" /> Proudly serving Davenport & the Quad Cities
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to Perkins Lawn and Snow
          </h1>
          <p className="mt-6 text-lg text-slate-200 sm:text-xl">
            Professional Lawn Care & Snow Removal in Davenport, IA.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-7 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-800"
            >
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white hover:text-zinc-900"
            >
              Our Services
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-8">
            {[
              ["1980s", "Family roots"],
              ["2001", "Founded"],
              ["365", "Days a year"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-2xl font-bold text-white sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-sm text-slate-300">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function About() {
  const values = [
    { icon: Users, title: "Family Owned", text: "Run by Jason & Shannon Perkins." },
    { icon: CalendarDays, title: "Since 2001", text: "Over two decades of service." },
    { icon: Award, title: "Hard Working", text: "Happy clients & happy employees." },
  ];

  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative mx-auto w-full max-w-lg">
          <PlaceholderImage
            width={1024}
            height={452}
            label="Perkins Lawn and Snow work truck with company logo"
            src="/images/perkins-truck-logo.avif"
            className="aspect-[16/9] rounded-2xl shadow-xl"
          />
          <div className="absolute -bottom-6 -left-4 hidden rounded-xl bg-green-800 px-6 py-5 text-white shadow-lg sm:block">
            <p className="text-3xl font-extrabold">20+</p>
            <p className="text-sm text-green-100">Years in business</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
            About Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            About Our Family Business
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Perkins Lawn and Snow planted its roots in the early 1980s when Jason
              helped his grandfather mow yards and shovel sidewalks. What started as
              earning extra money grew into a passion.
            </p>
            <p>
              In 2001, Jason jumped in with both feet, starting &ldquo;Perkins and
              Son&rsquo;s Snow Removal.&rdquo; As the company expanded, the name
              evolved to &ldquo;Perkins Lawn and Snow.&rdquo;
            </p>
            <p>
              Today, Jason and his wife Shannon own and operate the business
              together, striving to keep employees and clients happy.{" "}
              <span className="font-semibold text-zinc-900">
                We look forward to working with you!
              </span>
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Icon className="mb-2 h-6 w-6 text-green-800" />
                <p className="font-semibold text-zinc-900">{title}</p>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-slate-100 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Our Services"
          subtitle="From spring cleanups to the first snowfall, one trusted local crew handles it all."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ title, icon: Icon, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-green-700 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800 transition-colors group-hover:bg-green-800 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border-l-4 border-green-800 bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            <span className="font-bold text-zinc-900">We also offer: </span>
            {EXTRA_SERVICES}
          </p>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Work"
          title="Project Gallery"
          subtitle="A look at recent jobs and the equipment that gets them done."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map(({ label, caption, src, position, beforeAfter }) => (
            <figure
              key={label}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200"
            >
              <div className="relative overflow-hidden">
                <PlaceholderImage
                  width={600}
                  height={600}
                  label={label}
                  src={src}
                  position={position}
                  className="aspect-square transition-transform duration-500 group-hover:scale-105"
                />
                {beforeAfter && (
                  <>
                    <span className="absolute left-3 top-3 rounded-md bg-zinc-900/75 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Before
                    </span>
                    <span className="absolute left-3 top-1/2 mt-3 rounded-md bg-green-800 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      After
                    </span>
                  </>
                )}
              </div>
              <figcaption className="px-5 py-4 text-sm font-medium text-slate-700">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < count ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ name, rating, text }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <figure className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Quote className="absolute right-6 top-6 h-10 w-10 text-green-100" />
      <Stars count={rating} />
      <blockquote className="mt-4 leading-relaxed text-slate-700">&ldquo;{text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-800 font-bold text-white">
          {initials}
        </span>
        <span>
          <span className="block font-semibold text-zinc-900">{name}</span>
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <Globe className="h-3.5 w-3.5" /> Google Review
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function FacebookPostCard({ text, imageLabel, image }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 px-5 pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-800 text-white">
          <Leaf className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-900">Perkins Lawn and Snow</p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Facebook className="h-3.5 w-3.5 text-blue-600" /> Posted on Facebook
          </p>
        </div>
      </header>
      <p className="px-5 py-4 text-sm leading-relaxed text-slate-700">{text}</p>
      <PlaceholderImage width={600} height={340} label={imageLabel} src={image || undefined} className="aspect-[2/1]" />
      <footer className="grid grid-cols-3 border-t border-slate-200 text-sm font-medium text-slate-500">
        {[
          [ThumbsUp, "Like"],
          [MessageCircle, "Comment"],
          [Share2, "Share"],
        ].map(([Icon, label]) => (
          <a
            key={label}
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 transition-colors hover:bg-slate-50 hover:text-green-800"
          >
            <Icon className="h-4 w-4" /> {label}
          </a>
        ))}
      </footer>
    </article>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="bg-slate-100 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Reviews & Updates"
          title="What Our Community Says"
          subtitle="Real words from our neighbors, plus the latest from our crew."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Customer reviews */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-zinc-900">Customer Reviews</h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-slate-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 5-Star Google Reviews
              </span>
            </div>
            <div className="space-y-6">
              {REVIEWS.map((r) => (
                <ReviewCard key={r.name} {...r} />
              ))}
              <div className="rounded-2xl bg-green-800 p-6 text-white shadow-sm sm:p-8">
                <h4 className="text-xl font-bold">Join our happy neighbors</h4>
                <p className="mt-2 text-green-100">
                  Lawn care, snow removal and everything in between: get a free,
                  no-obligation quote today.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-green-800 transition-colors hover:bg-green-50"
                  >
                    Get a Free Quote <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/60 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook feed */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-zinc-900">Recent Updates</h3>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Facebook className="h-4 w-4" /> Follow us
              </a>
            </div>
            <div className="space-y-6">
              {FACEBOOK_POSTS.map((p) => (
                <FacebookPostCard key={p.imageLabel} {...p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.title),
  "Bush & Shrub Trimming",
  "Skid Loader / Grading / Excavating",
  "Hauling & Trucking",
  "House or Storage Cleanout",
  "Other",
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

function QuoteForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const templateParams = {
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
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY,
        });
      } else {
        // Demo mode: simulate network latency so the loading state is visible.
        console.info("[Demo mode] Quote request (EmailJS not configured):", templateParams);
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Quote submission failed:", err);
      setError(
        `Sorry, we couldn't send your request. Please try again or call us at ${PHONE_DISPLAY}.`
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-xl">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-9 w-9 text-green-700" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900">Thank you!</h3>
        <p className="mt-3 max-w-sm text-slate-600">
          Your quote request has been sent to the Perkins team. We&rsquo;ll get back to
          you shortly — usually within one business day.
        </p>
        {!EMAIL_CONFIGURED && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Demo mode: add your EmailJS keys to send real emails.
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-lg border-2 border-green-800 px-6 py-2.5 font-semibold text-green-800 transition-colors hover:bg-green-800 hover:text-white"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const input =
    "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-zinc-900 placeholder-slate-400 shadow-sm focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/30";
  const labelCls = "block text-sm font-medium text-slate-700";
  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl sm:p-8" noValidate={false}>
      <h3 className="text-xl font-bold text-zinc-900">Request a Quote</h3>
      <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          First Name *
          <input name="firstName" required value={form.firstName} onChange={update} className={input} placeholder="Jane" autoComplete="given-name" />
        </label>
        <label className={labelCls}>
          Last Name *
          <input name="lastName" required value={form.lastName} onChange={update} className={input} placeholder="Doe" autoComplete="family-name" />
        </label>
        <label className={labelCls}>
          Email *
          <input type="email" name="email" required value={form.email} onChange={update} className={input} placeholder="you@example.com" autoComplete="email" />
        </label>
        <label className={labelCls}>
          Phone Number *
          <input type="tel" name="phone" required value={form.phone} onChange={update} className={input} placeholder="(563) 555-0123" autoComplete="tel" />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          Service Requested *
          <select name="service" required value={form.service} onChange={update} className={input}>
            <option value="" disabled>
              Select a service…
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          Project Details / Message
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={update}
            className={input}
            placeholder="Tell us about your property, the size of the job, and any timing needs."
          />
        </label>
      </div>

      {status === "error" && (
        <div className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 px-6 py-4 text-base font-semibold text-white shadow transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Get My Free Quote <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}

function Contact() {
  const items = [
    { icon: MapPin, label: "Address", value: ADDRESS, href: MAPS_HREF },
    { icon: Phone, label: "Phone", value: PHONE_DISPLAY, href: PHONE_HREF },
    { icon: Mail, label: "Free Quotes", value: "Fill out the form — we respond fast.", href: null },
  ];

  return (
    <section id="contact" className="bg-zinc-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Contact Us"
          title="Get Your Free Quote"
          subtitle="Tell us about your project and we'll put together a no-obligation estimate."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {items.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 rounded-2xl bg-zinc-800 p-6 ring-1 ring-white/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="mt-1 block text-lg font-medium text-white hover:text-green-300"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-lg font-medium text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <PlaceholderImage
              width={600}
              height={300}
              label="Map — 5519 W River Dr"
              className="hidden aspect-[2/1] rounded-2xl ring-1 ring-white/10 lg:block"
            />
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
    <footer className="border-t border-white/10 bg-zinc-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="text-center md:text-left">
          <p className="font-bold text-white">Perkins Lawn and Snow</p>
          <p className="mt-1 text-sm text-slate-400">
            {ADDRESS} &middot;{" "}
            <a href={PHONE_HREF} className="hover:text-white">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perkins Lawn and Snow on Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-slate-300 transition-colors hover:bg-green-800 hover:text-white"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        &copy; 2023 Perkins Lawn and Snow-All Rights Reserved
      </p>
    </footer>
  );
}

/* ----------------------------- Page -------------------------------- */
export default function PerkinsLawnAndSnow() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.documentElement.style.scrollPaddingTop = "80px";
  }, []);

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
