import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Sizes an element's font so its first child spans exactly the element's width,
 * but never taller than `maxHeight()` pixels (line box height), when given.
 * Measured from layout boxes, so pending transforms don't skew it.
 */
export function useFitText(ref: RefObject<HTMLElement | null>, maxHeight?: () => number, scale = 1) {
  const limit = useRef(maxHeight);
  limit.current = maxHeight;

  useLayoutEffect(() => {
    const el = ref.current;
    const inner = el?.firstElementChild as HTMLElement | null;
    if (!el || !inner) return;

    const fit = () => {
      el.style.fontSize = '100px';
      const natural = inner.offsetWidth;
      if (!natural) return;
      let size = ((100 * el.clientWidth) / natural) * scale;
      const cap = limit.current?.() ?? Infinity;
      if (Number.isFinite(cap)) {
        const lh = parseFloat(getComputedStyle(el).lineHeight) / 100; // line-height in em
        size = Math.min(size, Math.max(cap, 0) / lh);
      }
      el.style.fontSize = `${Math.floor(size * 10) / 10}px`;
    };

    // Refit once the display face actually arrives; `fonts.ready` can resolve before it's requested.
    fit();
    document.fonts.ready.then(fit);
    document.fonts.addEventListener('loadingdone', fit);
    window.addEventListener('resize', fit);
    return () => {
      document.fonts.removeEventListener('loadingdone', fit);
      window.removeEventListener('resize', fit);
    };
  }, [ref, scale]);
}
