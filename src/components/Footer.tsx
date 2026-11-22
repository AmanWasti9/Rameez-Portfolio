import { useEffect, useRef, useState } from 'react';
import { TLink } from './Transition';
import { Magnetic } from './Magnetic';
import { Roll } from './Roll';
import { Clock } from './Clock';
import { site } from '../data/site';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // The footer content rises from underneath the page as it comes into view.
  useEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    const tween = gsap.fromTo(el.querySelector('.footer-inner'), { yPercent: -30 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
    ScrollTrigger.refresh();
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <p className="footer-kicker">Have something that needs designing, building, or both?</p>
        <TLink to="/contact" className="footer-cta roll-host" data-cursor="Start a project">
          <Roll text="Let’s build it" />
        </TLink>

        <div className="footer-row">
          <button className="footer-email" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy email'}>
            <span>{site.email}</span>
            <span className="footer-email-state" aria-live="polite">{copied ? 'Copied to clipboard' : 'Click to copy'}</span>
          </button>
          <Magnetic>
            <a className="btn-round" href={site.upwork} target="_blank" rel="noreferrer">
              <span>Hire me on Upwork</span>
            </a>
          </Magnetic>
        </div>

        <div className="footer-bottom">
          <ul className="footer-socials">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a className="roll-host" href={s.href} target="_blank" rel="noreferrer"><Roll text={s.label} /></a>
              </li>
            ))}
          </ul>
          <Clock />
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </div>
    </footer>
  );
}
