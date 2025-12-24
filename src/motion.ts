import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// 動きは演出であって機能ではない。reduced-motion のときは一切動かさず、
// すべての要素を最初から見えた状態にする(CSS側の opacity 指定も html.motion 限定)。
export function prefersReduced(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let lenis: Lenis | null = null;

// 起動時に一度だけ。なめらかスクロールを有効化し、GSAPのticker/ScrollTriggerと噛み合わせる。
export function initMotion(): void {
  if (prefersReduced()) return;
  document.documentElement.classList.add('motion');
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ルート描画のたびに呼ぶ。前のトリガーを片付け、今のDOMに出現と視差を付け直す。
export function revealRoute(root: HTMLElement): void {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
  if (prefersReduced()) return;

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
  reveals.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: 'power3.out',
        delay: Math.min(i, 6) * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });

  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const depth = Number(el.dataset.parallax) || 0.18;
    gsap.to(el, {
      yPercent: depth * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('[data-parallax-scope]') ?? el.parentElement ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  ScrollTrigger.refresh();
}
