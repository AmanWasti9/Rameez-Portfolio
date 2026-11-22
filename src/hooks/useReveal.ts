import { useLayoutEffect, type RefObject } from 'react';
import { gsap, EASE, PAGE_ENTER, SplitText, prefersReducedMotion } from '../lib/motion';

/**
 * Declarative reveals for a page. Mark elements up and this hook animates them
 * once the transition overlay clears (PAGE_ENTER) and fonts are ready.
 *
 *   data-split="lines|words|chars"  masked text rise (chars rise in random order)
 *   data-reveal="fade|clip|rule"     fade-up, image unmask, or a line drawing in
 *   data-scrub="words"               words light up as you scroll past
 *   data-parallax="0.12"             drifts against scroll (fraction of its height)
 *   data-delay="0.2"                 offset inside the hero timeline, in seconds
 *
 * Anything inside [data-hero] plays as one timeline on page enter; everything
 * else plays once when it scrolls into view.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const q = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const splits: SplitText[] = [];
    let entered = false;
    let fontsReady = false;
    let built = false;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.set(q('[data-split]'), { visibility: 'hidden' });
      gsap.set(q('[data-reveal="fade"]'), { autoAlpha: 0, y: 28 });
      gsap.set(q('[data-reveal="clip"]'), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(q('[data-reveal="clip"] img'), { scale: 1.25 });
      gsap.set(q('[data-reveal="rule"]'), { scaleX: 0, transformOrigin: '0% 50%' });
    }, root);

    const build = () => {
      if (built || !entered || !fontsReady) return;
      built = true;

      ctx.add(() => {
        if (reduced) {
          q('[data-scrub]').forEach((el) => (el.style.opacity = '1'));
          return;
        }
        const hero = gsap.timeline();
        const place = (el: HTMLElement, anim: gsap.TweenVars, targets: gsap.TweenTarget) => {
          const at = Number(el.dataset.delay ?? 0);
          if (el.closest('[data-hero]')) hero.to(targets, anim, at);
          else gsap.to(targets, { ...anim, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        };

        q('[data-split]').forEach((el) => {
          const type = (el.dataset.split ?? 'lines') as 'lines' | 'words' | 'chars';
          const split = SplitText.create(el, {
            type: type === 'chars' ? 'words,chars' : type,
            mask: type,
            linesClass: 'split-line',
          });
          splits.push(split);
          const targets = split[type];
          gsap.set(targets, { yPercent: 115 });
          gsap.set(el, { visibility: 'visible' });
          place(el, {
            yPercent: 0,
            duration: type === 'chars' ? 1.1 : 1,
            ease: EASE.out,
            stagger: type === 'chars' ? { amount: 0.45, from: 'random' } : type === 'words' ? 0.035 : 0.09,
            // Hand the text back to normal layout so it reflows on resize.
            onComplete: () => split.revert(),
          }, targets);
        });

        q('[data-reveal="fade"]').forEach((el) =>
          place(el, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.soft }, el));

        q('[data-reveal="clip"]').forEach((el) => {
          place(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: EASE.inOut }, el);
          const img = el.querySelector('img');
          if (img) place(el, { scale: 1, duration: 1.6, ease: EASE.out }, img);
        });

        q('[data-reveal="rule"]').forEach((el) =>
          place(el, { scaleX: 1, duration: 1.4, ease: EASE.out }, el));

        q('[data-reveal="settle"]').forEach((el) => {
          gsap.set(el, { scale: 1.07, transformOrigin: '50% 100%' });
          place(el, { scale: 1, duration: 1.8, ease: EASE.out }, el);
        });

        q('[data-scrub="words"]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words' });
          splits.push(split);
          gsap.fromTo(split.words, { opacity: 0.14 }, {
            opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
          });
        });

        q('[data-parallax]').forEach((el) => {
          const amt = Number(el.dataset.parallax || 0.1) * 100;
          gsap.fromTo(el, { yPercent: -amt }, {
            yPercent: amt, ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
    };

    const onEnter = () => { entered = true; build(); };
    window.addEventListener(PAGE_ENTER, onEnter);
    document.fonts.ready.then(() => { fontsReady = true; build(); });

    return () => {
      window.removeEventListener(PAGE_ENTER, onEnter);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [scope]);
}
