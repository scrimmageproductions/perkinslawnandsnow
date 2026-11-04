import { Resend } from "resend";

/* ==================================================================== *
 *  POST /api/send-quote
 *
 *  Emails a quote request from the website form to the Perkins team.
 *
 *  This is a Vercel serverless function (this project is Vite + React,
 *  not Next.js). It uses the same Web-standard `POST(request)` shape as a
 *  Next.js App Router route, so it can move to app/api/send-quote/route.js
 *  unchanged if the site is ever migrated. During `npm run dev`, Vite
 *  serves it through the small middleware in vite.config.js.
 *
 *  Environment variables (set in .env locally and in Vercel → Project →
 *  Settings → Environment Variables for production):
 *    RESEND_API_KEY   Resend API key (required)
 *    QUOTE_TO_EMAIL   inbox that receives quotes (default: Resend testing address)
 *    QUOTE_FROM_EMAIL sender address (default: Resend's test sender)
 * ==================================================================== */

// Default inbox: the Resend account's testing address, so the form works while
// the domain is unverified. Set QUOTE_TO_EMAIL to the real Perkins inbox once
// perkinslawnandsnow.com is verified in Resend.
const TO_EMAIL = process.env.QUOTE_TO_EMAIL || "scrimmy@rslini.resend.app";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "Perkins Website <onboarding@resend.dev>";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const clean = (value, max = 200) => String(value ?? "").trim().slice(0, max);

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never see or fill this field; bots usually do.
  if (data.botField) {
    return json({ error: "Invalid submission." }, 400);
  }

  const fields = {
    firstName: clean(data.firstName, 80),
    lastName: clean(data.lastName, 80),
    email: clean(data.email, 200),
    phone: clean(data.phone, 40),
    service: clean(data.service, 100),
    message: clean(data.message, 5000),
  };

  const missing = ["firstName", "lastName", "email", "phone", "service"].filter((k) => !fields[k]);
  if (missing.length) {
    return json({ error: `Missing required fields: ${missing.join(", ")}` }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("send-quote: RESEND_API_KEY is not set");
    return json({ error: "Email is not configured." }, 500);
  }

  const name = `${fields.firstName} ${fields.lastName}`;
  const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  const rows = [
    ["First Name", fields.firstName],
    ["Last Name", fields.lastName],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Service", fields.service],
    ["Message", fields.message || "(no details provided)"],
    ["Submitted", `${submittedAt} (Central)`],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1d1d1f;max-width:560px">
      <h2 style="margin:0 0 16px;font-size:20px">New quote request</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:15px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="border-bottom:1px solid #eee;color:#6e6e73;white-space:nowrap;vertical-align:top">${k}</td>
              <td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td>
            </tr>`
          )
          .join("")}
      </table>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: fields.email, // hitting Reply in the inbox answers the customer
      subject: `New quote request: ${fields.service} (${name})`,
      text,
      html,
    });

    if (error) {
      console.error("send-quote: Resend error", error);
      return json({ error: "We couldn't send your request." }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("send-quote: unexpected error", err);
    return json({ error: "We couldn't send your request." }, 500);
  }
}
