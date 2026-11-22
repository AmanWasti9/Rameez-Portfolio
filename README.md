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

- [ ] `email`: real email address (it is used in the footer, contact page and form)
- [ ] `upwork`: Upwork profile URL
- [ ] `socials`: real LinkedIn, GitHub and Dribbble links, or remove the ones he doesn't use
- [ ] `city` and `timeZone`: confirm (they drive the live clock)
- [ ] `available`: set to `false` to show "Booked for now"

Project copy lives in `src/data/projects.ts`.

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
