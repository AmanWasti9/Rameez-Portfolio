import { useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { TLink } from '../components/Transition';
import { Roll } from '../components/Roll';
import { getProject, nextProject } from '../data/projects';

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <Navigate to="/work" replace />;
  // Keyed so every reveal re-runs when moving between case studies.
  return <CaseStudy key={project.slug} slug={project.slug} />;
}

function CaseStudy({ slug }: { slug: string }) {
  const ref = useRef<HTMLElement>(null);
  const p = getProject(slug)!;
  const next = nextProject(slug);
  useReveal(ref);

  return (
    <main ref={ref} className="page case">
      <section className="case-hero" data-hero>
        <TLink to="/work" className="case-back roll-host" data-reveal="fade"><Roll text="All work" /></TLink>
        <p className="case-kind" data-split="lines" data-delay="0.1">{p.kind}</p>
        <h1 className="case-title" data-split="chars">{p.title}</h1>
        <p className="case-tagline" data-split="lines" data-delay="0.3">{p.tagline}</p>

        <dl className="case-meta">
          {[
            ['Role', p.role],
            ['Year', p.year],
            ['Type', p.type],
            ['Stack', p.stack.join(', ')],
          ].map(([k, v], i) => (
            <div key={k} data-reveal="fade" data-delay={0.45 + i * 0.07}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <figure className="case-cover" data-reveal="clip" style={{ background: p.tone }}>
        <div data-parallax="0.06" className="case-cover-inner">
          <img src={p.cover} alt={`${p.title} cover`} style={{ objectPosition: p.focus }} />
        </div>
      </figure>

      <section className="case-story">
        <div className="case-col">
          <h2 className="case-label" data-reveal="fade">The brief</h2>
          <p className="case-text" data-split="lines">{p.brief}</p>
        </div>
        <div className="case-col">
          <h2 className="case-label" data-reveal="fade">What I built</h2>
          <p className="case-text" data-split="lines">{p.built}</p>
        </div>
      </section>

      <section className="case-highlights">
        {p.highlights.map((h) => (
          <div className="highlight" key={h.title}>
            <span className="rule" data-reveal="rule" />
            <h3 data-split="lines">{h.title}</h3>
            <p data-reveal="fade">{h.body}</p>
          </div>
        ))}
      </section>

      <section className="gallery">
        {p.shots.map((s) => (
          <figure className={`shot shot--${s.layout}`} key={s.src}>
            <div className="shot-media" data-reveal="clip" style={{ background: p.tone }}>
              <img src={s.src} alt={s.alt} loading="lazy" />
            </div>
            {s.caption && <figcaption data-reveal="fade">{s.caption}</figcaption>}
          </figure>
        ))}
      </section>

      <section className="next">
        <TLink to={`/work/${next.slug}`} className="next-link" data-cursor="Next case">
          <span className="next-label" data-reveal="fade">Next project</span>
          <span className="next-title" data-split="chars">{next.title}</span>
          <span className="next-kind" data-reveal="fade">{next.kind}</span>
          <span className="next-thumb" style={{ background: next.tone }}>
            <img src={next.cover} alt="" loading="lazy" style={{ objectPosition: next.focus }} />
          </span>
        </TLink>
      </section>
    </main>
  );
}
