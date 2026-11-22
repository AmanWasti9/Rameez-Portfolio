import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { TLink } from '../components/Transition';
import { projects } from '../data/projects';
import { gsap, EASE, finePointer } from '../lib/motion';

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useReveal(ref);

  // The preview card trails the pointer across the list.
  useEffect(() => {
    const el = preview.current;
    if (!el || !finePointer()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    gsap.to(el, {
      autoAlpha: active === null ? 0 : 1, scale: active === null ? 0.85 : 1,
      duration: active === null ? 0.25 : 0.5, ease: EASE.out, overwrite: 'auto',
    });
    if (active === null) return;
    const frames = el.querySelectorAll<HTMLElement>('.preview-frame');
    frames.forEach((f, i) => (f.style.zIndex = i === active ? '2' : '1'));
    gsap.fromTo(frames[active], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: EASE.inOut });
  }, [active]);

  return (
    <main ref={ref} className="page work-page">
      <section className="page-hero" data-hero>
        <div className="page-hero-title">
          <h1 className="display" data-split="chars">Work</h1>
          <span className="display-count" data-reveal="fade" data-delay="0.5">({String(projects.length).padStart(2, '0')})</span>
        </div>
        <p className="page-hero-lede" data-split="lines" data-delay="0.35">
          Product interfaces and brand sites, designed and built end to end. Each one is a self-initiated concept with a working frontend you can click through, not a static mockup.
        </p>
      </section>

      <ul className="index" onPointerLeave={() => setActive(null)}>
        <li className="index-head" data-reveal="fade" aria-hidden="true">
          <span>Project</span><span>Type</span><span>Built with</span><span>Year</span>
        </li>
        {projects.map((p, i) => (
          <li className="index-row" key={p.slug}>
            <span className="rule" data-reveal="rule" />
            <TLink to={`/work/${p.slug}`} className="index-link" data-cursor="View case"
              onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
              <span className="index-title" data-split="lines">{p.title}</span>
              <span className="index-kind" data-reveal="fade">{p.kind}</span>
              <span className="index-stack" data-reveal="fade">{p.stack.slice(0, 3).join(', ')}</span>
              <span className="index-year" data-reveal="fade">{p.year}</span>
              <span className="index-thumb" style={{ background: p.tone }}>
                <img src={p.cover} alt="" loading="lazy" style={{ objectPosition: p.focus }} />
              </span>
            </TLink>
          </li>
        ))}
        <li className="index-end"><span className="rule" data-reveal="rule" /></li>
      </ul>

      <div className="preview" ref={preview} aria-hidden="true">
        {projects.map((p) => (
          <div className="preview-frame" key={p.slug} style={{ background: p.tone }}>
            <img src={p.cover} alt="" style={{ objectPosition: p.focus }} />
          </div>
        ))}
      </div>
    </main>
  );
}
