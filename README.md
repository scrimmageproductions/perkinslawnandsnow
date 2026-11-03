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

## Editing photos and content

Everything editable sits at the top of `src/PerkinsLawnAndSnow.jsx`:

| Array | Controls |
| --- | --- |
| `heroImage` | Hero background |
| `aboutImage` | About section photo |
| `services` | Service cards (title, description, photo) |
| `galleryImages` | "Our Work" grid; keep the count a multiple of 3 |
| `facebookPosts` | "Recent Updates" cards (`src: null` for text-only) |
| `googleReviews` | Review quotes |

Set any `src` to a file in `public/images/` (e.g. `"/images/new-photo.jpg"`)
or to `"/api/placeholder/W/H"`. If a local file is missing, or the component
is pasted into a Claude Artifact, images fall back to `/api/placeholder`
automatically, then to a plain grey block.
`position` is the CSS object-position used when a photo is cropped.

Three service cards use stand-in photos until real ones are available
(marked `stand-in photo` in the code): Junk Removal, Fertilization Programs
and Aggregate Delivery.

The header uses the official logo, `public/images/perkins-logo.avif`
(path set in `LOGO_SRC`). The footer uses plain text, because the logo's
black lettering doesn't show on the dark background.
