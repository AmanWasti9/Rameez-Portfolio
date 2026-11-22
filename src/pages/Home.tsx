import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useFitText } from '../hooks/useFitText';
import { TLink } from '../components/Transition';
import { Magnetic } from '../components/Magnetic';
import { Marquee } from '../components/Marquee';
import { Roll } from '../components/Roll';
import { projects } from '../data/projects';
import { services, site, stack } from '../data/site';
import { getLenis } from '../lib/motion';

export default function Home() {
  const ref = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  // Desktop: the name gets whatever height is left above the fold. Phones: just fill the width.
  useFitText(nameRef, () => {
    const root = ref.current;
    if (!root || window.innerWidth <= 760) return Infinity;
    const hero = root.querySelector<HTMLElement>('.hero')!;
    const frame = root.querySelector<HTMLElement>('.hero-frame')!;
    const hs = getComputedStyle(hero);
    const gap = parseFloat(getComputedStyle(frame).rowGap) || 0;
    const top = root.querySelector<HTMLElement>('.hero-top')!.offsetHeight;
    const mid = root.querySelector<HTMLElement>('.hero-mid')!.offsetHeight;
    return window.innerHeight - parseFloat(hs.paddingTop) - parseFloat(hs.paddingBottom) - top - mid - gap * 2 - 8;
  }, 0.93); // ~7% short of the full measure, so the name reads as a choice, not a squeeze
  useReveal(ref);

  const toWork = () => {
    const target = document.getElementById('work');
    const lenis = getLenis();
    if (target && lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main ref={ref} className="page home">
      <section className="hero" data-hero>
        <div className="hero-frame" data-reveal="settle">
          <div className="hero-top">
            <p className="hero-role" data-split="lines" data-delay="0.15">
              {site.role}
            </p>
            <p className="hero-where" data-split="lines" data-delay="0.25">
              Based in {site.city}. <br />Working with teams anywhere.
            </p>
          </div>

          <div className="hero-mid">
            <p className="hero-lede" data-split="lines" data-delay="0.5">
              I turn complex ideas into polished SaaS products, combining thoughtful interface design with production-ready frontend engineering.
            </p>
            <div className="hero-actions" data-reveal="fade" data-delay="0.8">
              <Magnetic>
                <TLink to="/contact" className="btn btn--accent roll-host" data-cursor="Let’s talk">
                  <Roll text="Start a project" />
                </TLink>
              </Magnetic>
              <button className="btn btn--ghost roll-host" onClick={toWork}>
                <Roll text="Selected work" />
              </button>
            </div>
          </div>

          <div className="hero-base">
            <h1 className="hero-name" ref={nameRef}>
              <span className="hero-name-inner">
                <span data-split="chars">{site.first}</span>{' '}
                <span data-split="chars" data-delay="0.12">{site.last}</span>
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="statement">
        <p className="statement-text" data-scrub="words">
          I care about the moment a product starts to feel obvious. Dashboards that stay calm under a lot of data, marketing pages that move with intent, and code your team is happy to inherit.
        </p>
      </section>

      <section className="work" id="work">
        <header className="section-head">
          <h2 data-split="lines">Selected work</h2>
          <span className="section-count" data-reveal="fade">{String(projects.length).padStart(2, '0')} projects</span>
          <span className="rule" data-reveal="rule" />
        </header>

        <div className="features">
          {projects.map((p, i) => (
            <article className={`feature${i % 2 ? ' feature--flip' : ''}`} key={p.slug}>
              <TLink to={`/work/${p.slug}`} className="feature-link" data-cursor="View case">
                <figure className="feature-media" data-reveal="clip" style={{ background: p.tone }}>
                  <div className="feature-parallax" data-parallax="0.05">
                    <img src={p.cover} alt={`${p.title}: ${p.kind}`} loading="lazy" style={{ objectPosition: p.focus }} />
                  </div>
                </figure>
                <div className="feature-meta">
                  <h3 className="feature-title" data-split="chars">{p.title}</h3>
                  <p className="feature-kind" data-reveal="fade">{p.kind}</p>
                  <p className="feature-line" data-reveal="fade">{p.tagline}</p>
                  <ul className="tags" data-reveal="fade">
                    {p.stack.slice(0, 4).map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </TLink>
            </article>
          ))}
        </div>

        <div className="work-more" data-reveal="fade">
          <Magnetic>
            <TLink to="/work" className="btn btn--ink roll-host"><Roll text="View all work" /></TLink>
          </Magnetic>
        </div>
      </section>

      <section className="services">
        <header className="section-head">
          <h2 data-split="lines">What I do</h2>
          <span className="rule" data-reveal="rule" />
        </header>
        <div className="service-list">
          {services.map((s) => (
            <div className="service" key={s.title}>
              <h3 className="service-title" data-split="lines">{s.title}</h3>
              <p className="service-body" data-split="lines">{s.body}</p>
              <ul className="tags" data-reveal="fade">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <span className="rule" data-reveal="rule" />
            </div>
          ))}
        </div>
      </section>

      <section className="toolkit" aria-label="Toolkit">
        <Marquee items={stack} />
      </section>
    </main>
  );
}
