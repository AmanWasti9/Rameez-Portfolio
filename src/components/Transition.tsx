import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState,
  type MouseEvent, type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate, type LinkProps } from 'react-router-dom';
import {
  gsap, EASE, ScrollTrigger, emitPageEnter, getLenis, lockScroll, prefersReducedMotion, scrollToTop,
} from '../lib/motion';
import { site } from '../data/site';
import { getProject } from '../data/projects';

const VISITED = sessionStorage.getItem('rr-visited') === '1';
sessionStorage.setItem('rr-visited', '1');

type Go = (to: string, origin?: { x: number; y: number }) => void;
const TransitionCtx = createContext<{ go: Go }>({ go: () => {} });
export const useTransition = () => useContext(TransitionCtx);

function computeGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cols = w < 640 ? 5 : w < 1100 ? 8 : 12;
  const rows = Math.ceil(h / (w / cols));
  return { cols, rows };
}

function labelFor(path: string) {
  if (path === '/') return 'Index';
  if (path.startsWith('/work/')) return getProject(path.split('/')[2])?.title ?? 'Work';
  const name = path.slice(1);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const Chars = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} aria-hidden="true">
    {[...text].map((c, i) => (
      <span className="tx-mask" key={i}>
        <span className="tx-char">{c === ' ' ? ' ' : c}</span>
      </span>
    ))}
  </span>
);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlay = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState(computeGrid);
  const [label, setLabel] = useState('');
  const busy = useRef(true);
  const pending = useRef(false);
  const origin = useRef<[number, number]>([0.5, 0.5]);
  const lastPath = useRef(location.pathname);

  const cells = () => overlay.current!.querySelectorAll<HTMLElement>('.tx-cell');
  const stagger = (amount: number) => ({ grid: [grid.rows, grid.cols] as [number, number], from: origin.current, amount });

  // Keep the grid square-ish when the window changes size (never mid-transition).
  useEffect(() => {
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => !busy.current && setGrid(computeGrid()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // First load / reload: counter, name, then the tiles clear in a diagonal wave.
  useLayoutEffect(() => {
    const el = overlay.current!;
    lockScroll(true);
    const finish = () => {
      gsap.set(el, { visibility: 'hidden' });
      busy.current = false;
      lockScroll(false);
      ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.set(el.querySelector('.tx-intro'), { autoAlpha: 0 });
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(cells(), { autoAlpha: 0, duration: 0.4 }).call(emitPageEnter, [], 0.1);
      return;
    }

    // Repeat visits in the same session get a quicker count.
    const countDur = VISITED ? 0.9 : 1.7;
    const counter = el.querySelector<HTMLElement>('.tx-count')!;
    const num = { v: 0 };
    origin.current = [0, 1];

    const tl = gsap.timeline({ onComplete: finish, delay: 0.15 });
    tl.from(el.querySelectorAll('.tx-intro-name .tx-char'), {
      yPercent: 110, duration: 0.9, ease: EASE.out, stagger: { amount: 0.35, from: 'random' },
    })
      .from(el.querySelectorAll('.tx-intro-meta'), { autoAlpha: 0, y: 12, duration: 0.6, ease: EASE.soft, stagger: 0.08 }, 0.2)
      .to(num, {
        v: 100, duration: countDur, ease: 'power2.inOut',
        onUpdate: () => { counter.textContent = String(Math.round(num.v)).padStart(3, '0'); },
      }, 0.15)
      .fromTo(el.querySelector('.tx-bar-fill'), { scaleX: 0 }, { scaleX: 1, duration: countDur, ease: 'power2.inOut' }, 0.15)
      .to(el.querySelectorAll('.tx-intro-name .tx-char'), {
        yPercent: -110, duration: 0.55, ease: EASE.cover, stagger: { amount: 0.2, from: 'random' },
      }, '+=0.15')
      .to(el.querySelectorAll('.tx-intro-meta, .tx-bar, .tx-count'), { autoAlpha: 0, y: -16, duration: 0.4, ease: EASE.cover }, '<')
      .to(cells(), {
        scaleY: 0, transformOrigin: '50% 0%', duration: 0.6, ease: EASE.cover, stagger: stagger(0.6),
      }, '-=0.15')
      .call(emitPageEnter, [], '<0.2');
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go: Go = useCallback((to, point) => {
    const path = to.split('#')[0].split('?')[0];
    if (busy.current) return;
    if (path === location.pathname) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    busy.current = true;
    pending.current = true;
    lockScroll(true);
    origin.current = point
      ? [point.x / window.innerWidth, point.y / window.innerHeight]
      : [0.5, 1];
    setLabel(labelFor(path));

    const el = overlay.current!;
    const reduced = prefersReducedMotion();
    gsap.set(el, { visibility: 'visible' });
    gsap.set(el.querySelector('.tx-intro'), { autoAlpha: 0 });

    if (reduced) {
      gsap.set(cells(), { scaleY: 1, autoAlpha: 0 });
      gsap.to(cells(), { autoAlpha: 1, duration: 0.25, onComplete: () => navigate(to) });
      return;
    }

    gsap.set(cells(), { scaleY: 0, autoAlpha: 1, transformOrigin: '50% 100%' });
    const tl = gsap.timeline({ onComplete: () => navigate(to) });
    tl.to(cells(), { scaleY: 1, duration: 0.5, ease: EASE.cover, stagger: stagger(0.4) });
    // Label chars ride in while the last tiles land.
    requestAnimationFrame(() => {
      const chars = el.querySelectorAll('.tx-label .tx-char');
      gsap.fromTo(chars, { yPercent: 110 }, {
        yPercent: 0, duration: 0.6, ease: EASE.out, stagger: 0.025, delay: 0.42,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, grid]);

  // After the route swaps: reset scroll, then clear the tiles from the same point.
  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;
    scrollToTop();

    if (!pending.current) {
      // Browser back/forward: no cover, just start the new page.
      ScrollTrigger.refresh();
      emitPageEnter();
      return;
    }
    pending.current = false;
    const el = overlay.current!;
    const done = () => {
      gsap.set(el, { visibility: 'hidden' });
      busy.current = false;
      lockScroll(false);
      ScrollTrigger.refresh();
    };

    if (prefersReducedMotion()) {
      gsap.to(cells(), { autoAlpha: 0, duration: 0.3, onComplete: done });
      emitPageEnter();
      return;
    }

    const tl = gsap.timeline({ onComplete: done, delay: 0.12 });
    tl.to(el.querySelectorAll('.tx-label .tx-char'), {
      yPercent: -110, duration: 0.45, ease: EASE.cover, stagger: 0.02,
    })
      .to(cells(), {
        scaleY: 0, transformOrigin: '50% 0%', duration: 0.55, ease: EASE.cover, stagger: stagger(0.45),
      }, '-=0.25')
      .call(emitPageEnter, [], '<0.15');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <div className="tx" ref={overlay} aria-hidden="true">
        <div className="tx-grid" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridAutoRows: `${100 / grid.cols}vw` }}>
          {Array.from({ length: grid.cols * grid.rows }, (_, i) => <div className="tx-cell" key={i} />)}
        </div>

        <div className="tx-intro">
          <div className="tx-intro-top">
            <span className="tx-intro-meta">{site.role}</span>
            <span className="tx-intro-meta">Portfolio, {new Date().getFullYear()}</span>
          </div>
          <Chars text={site.name} className="tx-intro-name" />
          <div className="tx-intro-bottom">
            <div className="tx-bar"><div className="tx-bar-fill" /></div>
            <span className="tx-count">000</span>
          </div>
        </div>

        <div className="tx-label-wrap">
          <Chars key={label} text={label} className="tx-label" />
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

type TLinkProps = LinkProps & { to: string };

/** A router link that plays the tile transition. Modifier-clicks still open new tabs. */
export function TLink({ to, onClick, ...rest }: TLinkProps) {
  const { go } = useTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to, e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : undefined);
  };
  return <Link to={to} onClick={handle} {...rest} />;
}
