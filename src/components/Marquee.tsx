import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/** Endless row of words. Scrolling speeds it up and flips its direction. */
export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    if (prefersReducedMotion()) return;
    const loop = gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let dir = 1;
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 220, 6);
        gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' });
      },
    });
    return () => { st.kill(); loop.kill(); };
  }, []);

  const row = items.map((t, i) => (
    <span className="marquee-item" key={i}>{t}<i aria-hidden="true" /></span>
  ));

  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee-track" ref={track} aria-hidden="true">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  );
}
