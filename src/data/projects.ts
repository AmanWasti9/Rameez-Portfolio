export type Shot = { src: string; alt: string; layout: 'full' | 'half' | 'wide'; caption?: string };

export type Project = {
  slug: string;
  title: string;
  kind: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  type: string;
  cover: string;
  tone: string; // background tone behind the cover, taken from the project's own palette
  focus?: string; // object-position for the cover when it's cropped
  brief: string;
  built: string;
  highlights: { title: string; body: string }[];
  shots: Shot[];
};

const img = (slug: string, name: string) => `/work/${slug}/${name}.webp`;

export const projects: Project[] = [
  {
    slug: 'dealboard',
    title: 'DealBoard',
    kind: 'AI sales intelligence SaaS',
    tagline: 'Pipeline, lead scoring, forecasting and automation in one workspace.',
    year: '2026',
    role: 'Product design & frontend',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Framer Motion', 'dnd-kit'],
    type: 'Concept product',
    cover: img('dealboard', 'cover'),
    tone: '#2A1A14',
    brief:
      'Sales teams live in three tabs at once: a CRM, a spreadsheet forecast and a chat thread about which deal is slipping. DealBoard puts those in one place and lets an AI layer point at the deals worth a call today.',
    built:
      'A marketing site plus eight working product screens: overview, kanban pipeline, AI lead intelligence, revenue forecast, analytics, workflow automation, team performance and settings. Everything works on the frontend, with data that persists per device.',
    highlights: [
      { title: 'Drag-and-drop pipeline', body: 'Deals move between stages with live column totals and undo.' },
      { title: 'AI lead scoring', body: 'Scores, intent bands and a suggested next action for every lead.' },
      { title: 'Forecast with confidence', body: 'Scenarios and a confidence range, not a single hopeful line.' },
      { title: 'One token set, two themes', body: 'A full dark theme from the same design tokens, saved per device.' },
    ],
    shots: [
      { src: img('dealboard', 'dashboard'), alt: 'DealBoard overview dashboard with KPI cards and revenue chart', layout: 'full', caption: 'Overview: KPIs, revenue against target, pipeline by stage' },
      { src: img('dealboard', 'pipeline'), alt: 'A deal card being dragged across the kanban pipeline', layout: 'half' },
      { src: img('dealboard', 'leads'), alt: 'AI lead recommendation card', layout: 'half' },
      { src: img('dealboard', 'forecast'), alt: 'Revenue forecast chart with an AI note', layout: 'wide', caption: 'Forecasts show a range and the reasoning behind it' },
      { src: img('dealboard', 'drawer'), alt: 'Deal details drawer with stage control and deal health', layout: 'half' },
      { src: img('dealboard', 'analytics'), alt: 'Sales analytics charts', layout: 'half' },
      { src: img('dealboard', 'responsive'), alt: 'DealBoard dark theme on desktop and three phones', layout: 'full', caption: 'Dark theme and mobile, from one token set' },
      { src: img('dealboard', 'system'), alt: 'DealBoard design system: palette, type and components', layout: 'wide' },
    ],
  },
  {
    slug: 'dispatch',
    title: 'Dispatch',
    kind: 'Logistics & fleet management',
    tagline: 'Smarter operations. On time, every time.',
    year: '2026',
    role: 'Product design & frontend',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Zustand'],
    type: 'Concept product',
    cover: img('dispatch', 'cover'),
    tone: '#141B33',
    brief:
      'Operations managers need to answer one question all day: is anything late, and what do I do about it? Dispatch is built around that question, with live tracking, shipments, drivers and routes connected to each other.',
    built:
      'Eleven interactive screens in Next.js: a dashboard, a live fleet map drawn in SVG with no API keys, shipment CRUD with timelines, driver and fleet rosters, a deterministic route optimiser, analytics and CSV reports. Related records stay in sync across every screen.',
    highlights: [
      { title: 'Live fleet map', body: 'A hand-built SVG map with vehicle cards, filters and an activity feed.' },
      { title: 'Route optimiser', body: 'Stop-order search with an alternate corridor, explained on the map.' },
      { title: 'Connected records', body: 'Create a shipment and the dashboard, totals and notifications update.' },
      { title: 'Built for phones too', body: 'Tracking and the dashboard work properly at 390px wide.' },
    ],
    shots: [
      { src: img('dispatch', 'tracking'), alt: 'Dispatch live tracking map with vehicles and route', layout: 'full', caption: 'Live tracking: every vehicle, route and delivery' },
      { src: img('dispatch', 'routes'), alt: 'Route optimisation screen', layout: 'half' },
      { src: img('dispatch', 'shipments'), alt: 'Shipments table with filters', layout: 'half' },
      { src: img('dispatch', 'analytics'), alt: 'Dispatch analytics charts', layout: 'wide', caption: 'Analytics and exportable reports' },
      { src: img('dispatch', 'responsive'), alt: 'Dispatch on mobile', layout: 'full' },
    ],
  },
  {
    slug: 'elan',
    title: 'Élan Match',
    kind: 'Private matchmaking concierge',
    tagline: 'A cinematic, scroll-driven site for a discreet matchmaking service.',
    year: '2026',
    role: 'Art direction, design & development',
    stack: ['React', 'GSAP', 'Lenis', 'Tailwind CSS'],
    type: 'Concept brand site',
    cover: img('elan', 'cover'),
    tone: '#1C1714',
    focus: '0% 50%',
    brief:
      'A matchmaking service for accomplished adults should not look like a dating app. The brief was a site that feels closer to a film title sequence or a fashion campaign: intimate, editorial and quiet.',
    built:
      'A single long story told through scroll: full-bleed photography, masked image reveals, a scattered polaroid sequence, pinned chapters and serif type set at cinema scale. Built with GSAP ScrollTrigger on Lenis smooth scroll, and fully responsive.',
    highlights: [
      { title: 'Scroll as storytelling', body: 'Chapters pin, images unmask and type moves at reading pace.' },
      { title: 'Polaroid sequence', body: 'Photos scatter and settle as you scroll, then gather into a story.' },
      { title: 'Editorial type', body: 'A high-contrast serif carries the brand with almost no decoration.' },
      { title: 'Mobile first-class', body: 'The same story recomposed for a phone, not squeezed onto one.' },
    ],
    shots: [
      { src: img('elan', 'hero'), alt: 'Élan Match hero with Beyond Profiles headline', layout: 'full', caption: 'Beyond profiles, into connection' },
      { src: img('elan', 'polaroids'), alt: 'Scattered polaroid photographs section', layout: 'wide' },
      { src: img('elan', 'story'), alt: 'Editorial story section', layout: 'half' },
      { src: img('elan', 'light'), alt: 'Light editorial section', layout: 'half' },
    ],
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
