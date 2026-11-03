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

## Replacing placeholder images

Each image is a `<PlaceholderImage>` with a text label (for example "Dump Truck" or "Snow Plowing").
To use a real photo, pass `src`:

```jsx
<PlaceholderImage src="/images/dump-truck.jpg" label="Dump Truck" ... />
```

Put the photos in `public/images/`. For gallery items, add a `src` field to the `GALLERY` array and pass it through to the component.
To remove the text overlay on real photos, delete the label `<div>` in `PlaceholderImage`.

## Reviews & Facebook feed

Google reviews live in the `REVIEWS` array and Facebook posts in `FACEBOOK_POSTS`. To add more, append entries there.
Each post's `image` takes a real photo path; when it is `null`, a labelled placeholder is shown.
The Facebook page URL is in `FACEBOOK_URL`.
