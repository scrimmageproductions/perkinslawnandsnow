# Perkins Lawn and Snow — Website

Apple-inspired single-page site: glass navigation, frosted hero card,
text-and-icon service grid, masonry gallery and soft-grey quote form.

Single-page React + Tailwind CSS site for Perkins Lawn and Snow (Davenport, IA).

- **The entire site is one self-contained component:** `src/PerkinsLawnAndSnow.jsx`. You can paste it straight into a Claude Artifact.
- Icons: `lucide-react`
- Quote form email: [EmailJS](https://www.emailjs.com), sent from the browser, so no server is needed.

## Run locally

```bash
npm install
cp .env.example .env   # then fill in EmailJS keys
npm run dev
```

`npm run build` writes a static site to `dist/`. You can deploy it to Netlify, Vercel, GitHub Pages, or any static host.
On the host, set the three `VITE_EMAILJS_*` variables as environment variables.

## Setting up quote emails (EmailJS)

1. Create a free EmailJS account and add an **Email Service** that is connected to the Perkins inbox.
2. Create an **Email Template** and set:
   - **To Email**: the Perkins inbox
   - **Reply To**: `{{reply_to}}`
   - **Subject**: `New quote request: {{service}} — {{from_name}}`
   - **Body** (example):
     ```
     Name: {{first_name}} {{last_name}}
     Email: {{reply_to}}
     Phone: {{phone}}
     Service: {{service}}
     Submitted: {{submitted_at}}

     {{message}}
     ```
3. Copy the Service ID, Template ID and Public Key into `.env`.

If the keys are missing, the form runs in **demo mode**. It still shows the loading and success states, but no email is sent.

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
| `davenportMapUrl` | Faint street map behind the About heading (grayscale, 15% opacity). Currently a temporary Unsplash test image; replace with a real Davenport map before launch |
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
