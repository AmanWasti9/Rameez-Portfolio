import { useEffect, useRef, useState } from 'react';
import { gsap, finePointer } from '../lib/motion';

/**
 * A label that trails the pointer when hovering anything with [data-cursor].
 * The native cursor stays; this only adds context ("View case", "Copy email").
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });
    let current = '';

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      const next = target?.dataset.cursor ?? '';
      if (next === current) return;
      current = next;
      if (next) setLabel(next);
      gsap.to(el, {
        scale: next ? 1 : 0.6, autoAlpha: next ? 1 : 0,
        duration: next ? 0.35 : 0.2, ease: next ? 'back.out(2)' : 'power2.out', overwrite: 'auto',
      });
    };
    const hide = () => { current = ''; gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.2 }); };

    // A click usually means navigation, so drop the label until the pointer moves again.
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', hide);
    document.addEventListener('pointerleave', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', hide);
      document.removeEventListener('pointerleave', hide);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
