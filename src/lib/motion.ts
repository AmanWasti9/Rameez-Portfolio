import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

// One set of curves for the whole site. Entrances use expo-style ease-outs,
// on-screen movement uses a strong in-out.
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power4.inOut',
  cover: 'power3.inOut',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

export function startLenis() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start());
  document.documentElement.classList.toggle('is-locked', locked);
}

// Pages listen for this to start their entrance once the transition overlay clears.
export const PAGE_ENTER = 'page:enter';
export const emitPageEnter = () => window.dispatchEvent(new Event(PAGE_ENTER));

export { gsap, ScrollTrigger, SplitText };
