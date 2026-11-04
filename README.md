# Perkins Lawn and Snow — Website

Apple-inspired single-page site: glass navigation, frosted hero card,
text-and-icon service grid, masonry gallery and soft-grey quote form.

Single-page React + Tailwind CSS site for Perkins Lawn and Snow (Davenport, IA).

- **The entire site is one self-contained component:** `src/PerkinsLawnAndSnow.jsx`. You can paste it straight into a Claude Artifact.
- Icons: `lucide-react`
- Quote form email: Resend, via the `/api/send-quote` serverless function.

## Run locally

```bash
npm install
cp .env.example .env   # then add your Resend API key
npm run dev
```

`npm run build` writes a static site to `dist/`. You can deploy it to Netlify, Vercel, GitHub Pages, or any static host.
On the host, set `RESEND_API_KEY` (and `QUOTE_TO_EMAIL`) as environment variables.

## Quote form email (Resend)

The quote form posts to `/api/send-quote` (`api/send-quote.js`), which emails
the request to the Perkins team through [Resend](https://resend.com).

- **Local:** put `RESEND_API_KEY` (and optionally `QUOTE_TO_EMAIL`) in `.env`
  (see `.env.example`). `npm run dev` serves the API route too.
- **Production (Vercel):** add the same variables under Project → Settings →
  Environment Variables. Vercel runs `api/send-quote.js` as a serverless function.
  Other static hosts (e.g. GitHub Pages) can't run it.
- **Sender address:** `onboarding@resend.dev` only delivers to the email on your
  Resend account. To deliver to `info@perkinslawnandsnow.com`, verify the domain in
  Resend and set `QUOTE_FROM_EMAIL` to an address on it.
- A hidden `botField` honeypot blocks simple spam bots.

## Editing photos and content

Hero slideshow photos are in `heroSlideshowImages` at the top of
`src/HeroSlideshow.jsx` (a standalone component you can also paste into a
Claude Artifact on its own). `SLIDE_DURATION_MS`, `FADE_MS` and `ZOOM_SCALE` control
the timing and zoom. The logo in the hero card comes from `logoUrl`. The slideshow has a pause button and does not auto-advance for
visitors who have reduced motion turned on.

Service cards (text-and-icon bento grid; each card has a `variant` for size and colour) are in `services` at the top of
`src/ServicesSection.jsx`, another standalone component.

Everything else editable sits at the top of `src/PerkinsLawnAndSnow.jsx`:

| Array | Controls |
| --- | --- |
| `aboutImage` | About section photo |
| `davenportMapUrl` | Faint street map behind the About heading (grayscale, 15% opacity). File: `public/images/davenport-map.png` |
| `galleryImages` | Gallery grid. Built automatically from `heroSlideshowImages`, so it always shows the same photos as the hero. Wide photos are listed in `WIDE_PHOTOS` and span two columns |
| `facebookPosts` | "Recent Updates" cards (`src: null` for text-only) |
| `googleReviews` | Review quotes |

Set any `src` to a file in `public/images/` (e.g. `"/images/new-photo.jpg"`)
or to `"/api/placeholder/W/H"`. If a local file is missing, or the component
is pasted into a Claude Artifact, images fall back to `/api/placeholder`
automatically, then to a plain grey block.
`position` is the CSS object-position used when a photo is cropped.


The header uses the official logo, `public/images/perkins-logo.avif`
(path set in `LOGO_SRC`). The footer uses plain text, because the logo's
black lettering doesn't show on the dark background.
