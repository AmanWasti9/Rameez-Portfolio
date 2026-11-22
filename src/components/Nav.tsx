import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TLink } from './Transition';
import { Roll } from './Roll';
import { Clock } from './Clock';
import { site } from '../data/site';
import { gsap, EASE, PAGE_ENTER, ScrollTrigger, lockScroll, prefersReducedMotion } from '../lib/motion';

const links = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Nav() {
  const { pathname } = useLocation();
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const isActive = (to: string) => pathname === to || (to === '/work' && pathname.startsWith('/work'));

  // Arrives last, once the first page has entered.
  useEffect(() => {
    const el = bar.current!;
    if (prefersReducedMotion()) return;
    gsap.set(el.querySelectorAll('.nav-item'), { yPercent: -120, autoAlpha: 0 });
    const enter = () => gsap.to(el.querySelectorAll('.nav-item'), {
      yPercent: 0, autoAlpha: 1, duration: 0.9, ease: EASE.out, stagger: 0.06, delay: 0.55,
    });
    window.addEventListener(PAGE_ENTER, enter, { once: true });
    return () => window.removeEventListener(PAGE_ENTER, enter);
  }, []);

  // Tuck away while scrolling down, come back on the way up.
  useEffect(() => {
    const el = bar.current!;
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 160;
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.5, ease: EASE.soft, overwrite: 'auto' });
      },
    });
    return () => st.kill();
  }, []);

  // Mobile menu: tiles of ink slide down, links rise in.
  useEffect(() => {
    const el = menu.current!;
    const items = el.querySelectorAll('.menu-link-inner, .menu-foot');
    // Skip the mount run, or it would unlock scrolling during the intro.
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    lockScroll(open);
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: open ? 'visible' : 'hidden', clipPath: 'none' });
      return;
    }
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: EASE.inOut });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE.out, stagger: 0.06, delay: 0.3 });
    } else if (el.style.visibility === 'visible') {
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: EASE.inOut,
        onComplete: () => { gsap.set(el, { visibility: 'hidden' }); },
      });
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="nav" ref={bar}>
        <TLink to="/" className="nav-logo roll-host nav-item" aria-label={`${site.name}, home`}>
          <span className="nav-mark" aria-hidden="true"><i /><i /><i /></span>
          <Roll text={site.name} />
        </TLink>

        <div className="nav-status nav-item">
          {site.available && <span className="status-dot" aria-hidden="true" />}
          <span>{site.available ? 'Available for new projects' : 'Booked for now'}</span>
          <span className="nav-sep" aria-hidden="true" />
          <Clock />
        </div>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <TLink key={l.to} to={l.to} className={`nav-link roll-host nav-item${isActive(l.to) ? ' is-active' : ''}`}
              aria-current={isActive(l.to) ? 'page' : undefined}>
              <Roll text={l.label} />
            </TLink>
          ))}
        </nav>

        <button className="nav-toggle nav-item" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <span className="nav-toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className={`burger${open ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div className="menu" id="menu" ref={menu} aria-hidden={!open}>
        <nav className="menu-links" aria-label="Mobile">
          {[{ to: '/', label: 'Index' }, ...links].map((l) => (
            <TLink key={l.to} to={l.to} className="menu-link" tabIndex={open ? 0 : -1}>
              <span className="menu-link-inner">{l.label}</span>
            </TLink>
          ))}
        </nav>
        <div className="menu-foot-wrap">
          <div className="menu-foot">
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>{site.email}</a>
            <Clock />
          </div>
        </div>
      </div>
    </>
  );
}
