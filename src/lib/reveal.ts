'use client';

import { gsap, SplitText } from '@/lib/gsap';

/**
 * Line-by-line blur reveal, as on the reference: each line comes up 15px out of a 10px blur
 * when its block reaches 85% of the viewport. Re-splits by itself when the layout reflows.
 * Call inside a gsap context (useGSAP) under a motion-ok media query.
 */
export function blurReveal(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal="blur"]', scope).forEach((text) => {
    SplitText.create(text, {
      type: 'lines',
      linesClass: 'reveal-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.lines,
          { opacity: 0, filter: 'blur(10px)', y: 15 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.5,
            ease: 'power1.out',
            stagger: 0.12,
            scrollTrigger: { trigger: text, start: 'top 85%', toggleActions: 'play none none none' },
          },
        );
      },
    });
  });
}
