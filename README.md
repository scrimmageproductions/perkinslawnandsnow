# Perkins Lawn and Snow — Website

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

## Photos

Real photos live in `public/images/`:

| File | Used in |
| --- | --- |
| `perkins-logo.avif` | Header logo |
| `hero-lawn-mowing.avif` | Hero background |
| `perkins-truck-logo.avif` | About section |
| `fall-cleanup-before-after.jpg` | Gallery (with Before/After tags) |
| `mulch-commercial-shrubs.jpg` | Gallery |
| `mulch-residential-deck.jpg` | Gallery + "Spring cleanup" Facebook post |
| `mulch-parking-lot-island.jpg` | Gallery |
| `snow-clearing-lot.avif` | Gallery + "Cleared driveway" Facebook post |
| `trimming-edging.avif` | Gallery |
| `concrete-walkway-steps.jpg` | Concrete Services card + Gallery |
| `mulch-pile-wheelbarrow.jpg` | Mulch Services card |
| `pressure-washing-pavers.jpg` | Pressure Washing card + Gallery |
| `snow-plow-cab-view.jpg` | Snow Removal card |
| `landscape-fabric-planting.jpg` | Gallery |

Service cards take an `image` (and optional `imagePosition`) in the
`SERVICES` array. Junk Removal, Fertilization Programs and Aggregate
Delivery still show labelled placeholders.

The map tile in the Contact section is also still a placeholder.
Wide photos are cropped with `position` (CSS object-position) so the
subject stays in frame; adjust it per image if needed.

To fill one, drop the photo in `public/images/` and set its `src`
(for gallery items, the `src` field in the `GALLERY` array; for Facebook
posts, `image` in `FACEBOOK_POSTS`). Images with a `src` hide the text label.

## Reviews & Facebook feed

Google reviews live in the `REVIEWS` array and Facebook posts in `FACEBOOK_POSTS`. To add more, append entries there.
Each post's `image` takes a real photo path; when it is `null`, a labelled placeholder is shown.
The Facebook page URL is in `FACEBOOK_URL`.
