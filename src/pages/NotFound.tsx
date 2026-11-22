import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { TLink } from '../components/Transition';
import { Roll } from '../components/Roll';

export default function NotFound() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <main ref={ref} className="page notfound" data-hero>
      <h1 className="display" data-split="chars">404</h1>
      <p className="page-hero-lede" data-split="lines" data-delay="0.3">This page doesn’t exist, or it moved.</p>
      <div data-reveal="fade" data-delay="0.5">
        <TLink to="/" className="btn btn--ink roll-host"><Roll text="Back to the index" /></TLink>
      </div>
    </main>
  );
}
