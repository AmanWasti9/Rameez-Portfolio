import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Marquee } from '../components/Marquee';
import { process, services, stack } from '../data/site';

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <main ref={ref} className="page about">
      <section className="page-hero about-hero" data-hero>
        <h1 className="about-title" data-split="lines">
          I make software look considered and feel quick.
        </h1>
      </section>

      <section className="about-intro">
        <span className="rule" data-reveal="rule" />
        <h2 className="case-label" data-reveal="fade">Hello, I’m Rameez</h2>
        <div className="about-copy">
          <p data-split="lines">
            I’m a frontend developer and product designer. I work across the whole path from a rough idea to a shipped interface: understanding the problem, wireframes, visual design, and the React code that puts it in front of people.
          </p>
          <p data-split="lines">
            Most of my work is SaaS products and dashboards, where the job is to make a lot of information feel calm. The rest is marketing and brand sites, where motion earns its place by guiding the eye rather than decorating the page.
          </p>
          <p data-split="lines">
            Because I design and build, nothing gets lost in a handoff. The spacing you approve in Figma is the spacing that ships.
          </p>
        </div>
      </section>

      <section className="process">
        <header className="section-head">
          <h2 data-split="lines">How a project runs</h2>
          <span className="rule" data-reveal="rule" />
        </header>
        <ol className="steps">
          {process.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step-num" data-reveal="fade">{String(i + 1).padStart(2, '0')}</span>
              <h3 data-split="chars">{s.title}</h3>
              <p data-split="lines">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="capabilities">
        <header className="section-head">
          <h2 data-split="lines">Where I can help</h2>
          <span className="rule" data-reveal="rule" />
        </header>
        <div className="cap-grid">
          {services.map((s) => (
            <div className="cap" key={s.title}>
              <h3 data-split="lines">{s.title}</h3>
              <ul data-reveal="fade">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
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
