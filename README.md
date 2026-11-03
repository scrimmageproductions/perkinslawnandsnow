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
| `perkins-truck.jpg` | About section |
| `fall-cleanup-before-after.jpg` | Gallery (with Before/After tags) |
| `mulch-commercial-shrubs.jpg` | Gallery |
| `mulch-residential-deck.jpg` | Gallery + "Spring cleanup" Facebook post |
| `mulch-parking-lot-island.jpg` | Gallery |

These spots still show labelled placeholders: the hero background, the
"Snow Plowing" and "Skid Loader" gallery tiles, the "Cleared Driveway"
Facebook post, and the map tile in Contact.

To fill one, drop the photo in `public/images/` and set its `src`
(for gallery items, the `src` field in the `GALLERY` array; for Facebook
posts, `image` in `FACEBOOK_POSTS`). Images with a `src` hide the text label.
The hero needs a wide, high-resolution photo (at least 1600px across).

## Reviews & Facebook feed

Google reviews live in the `REVIEWS` array and Facebook posts in `FACEBOOK_POSTS`. To add more, append entries there.
Each post's `image` takes a real photo path; when it is `null`, a labelled placeholder is shown.
The Facebook page URL is in `FACEBOOK_URL`.
