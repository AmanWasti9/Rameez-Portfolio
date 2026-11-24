# Rameez Raza: portfolio

An animated portfolio for Rameez Raza, frontend developer and product designer.
React, TypeScript and Vite, with GSAP (ScrollTrigger and SplitText), Lenis smooth scroll and React Router.

## Run

```bash
npm install
npm run dev       # http://localhost:5310
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Before going live: replace the placeholders

All personal details live in `src/data/site.ts`:

- [x] `email`, `upwork`, LinkedIn and GitHub are set

- [ ] `city` and `timeZone`: confirm (they drive the live clock)
- [ ] `available`: set to `false` to show "Booked for now"

Project copy lives in `src/data/projects.ts`.

## Contact form (EmailJS)

The contact form sends enquiries straight to Rameez's inbox through [EmailJS](https://www.emailjs.com), with no backend.
Until the keys below are set, the form falls back to opening the visitor's own mail app.

1. Create a free EmailJS account and **Add New Service** → Gmail → connect `ramisraza95@gmail.com`. Copy the **Service ID**.
2. **Email Templates** → Create New Template. Set **To Email** to `ramisraza95@gmail.com` and **Reply To** to `{{reply_to}}`. Use this subject and body:
   - Subject: `New enquiry from {{from_name}}: {{project_type}}`
   - Body:
     ```
     Name: {{from_name}}
     Email: {{from_email}}
     Project: {{project_type}}
     Budget: {{budget}}

     {{message}}
     ```
   Copy the **Template ID**.
3. **Account → General** → copy your **Public Key**.
4. Locally: copy `.env.example` to `.env` and fill in the three values, then restart `npm run dev`.
5. On Vercel/Netlify: add the same three variables (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) in the project's environment settings, then redeploy.

The public key is meant to be visible in the browser. To limit abuse, in EmailJS go to **Account → Security** and restrict allowed domains to the live site, and keep the free plan's monthly limit in mind (a hidden honeypot field already filters most bots).

## Images

The case-study images come from the sibling project folders (`../DealBoard`, `../Dispatch`, `../Match`).
After you change any screenshots there, rebuild the WebP files in `public/work/` with:

```bash
npm run images
```

## How the motion works

- **Page transitions** (`src/components/Transition.tsx`): a grid of ink tiles covers the screen, rippling out from the point you clicked. The route swaps underneath, then the tiles clear from the same point. Every internal link uses `<TLink>`.
- **Intro on every load**: a 0–100 counter and the name, then the tiles clear in a diagonal wave. It plays faster on repeat visits in the same session.
- **Reveals** (`src/hooks/useReveal.ts`): mark elements up with `data-split="lines|words|chars"`, `data-reveal="fade|clip|rule|settle"`, `data-scrub="words"` or `data-parallax="0.1"`. Anything inside `[data-hero]` plays as soon as the page enters. Everything else plays when it scrolls into view.
- **Hovers**: letter-roll text (`<Roll>`), magnetic buttons (`<Magnetic>`), and a cursor label for anything with `data-cursor="…"`.
- **Reduced motion** is respected throughout: tiles fade instead of rippling, text appears without movement, the marquee and reel stop, and smooth scroll is turned off.

## Deploy

This is a static single-page app. `vercel.json` (Vercel) and `public/_redirects` (Netlify) send every path to `index.html`, so deep links like `/work/dealboard` work.

## Dev helpers

`scripts/shoot.mjs` and `scripts/flow.mjs` take screenshots with your local Chrome (the dev server must be running).
