'use client';

import { useRef } from 'react';
import Photo from '@/components/Photo';
import { RichText } from '@/components/ui';
import { manifesto } from '@/content/site';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';

/**
 * The equation row spreads from the centre to full width, then two big two-tone statements,
 * a workshop image and a small paragraph, each revealed line by line from blur.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        blurReveal(el);

        // Equation: start packed in the centre, spread to the full width as it scrolls in.
        const row = el.querySelector<HTMLElement>('.eq-row')!;
        const items = gsap.utils.toArray<HTMLElement>('.eq-item', row);
        const packed = () => {
          const gap = 9;
          const total = items.reduce((s, i) => s + i.offsetWidth, 0) + gap * (items.length - 1);
          let x = (row.offsetWidth - total) / 2;
          return items.map((i) => {
            const dx = x - i.offsetLeft;
            x += i.offsetWidth + gap;
            return dx;
          });
        };
        gsap.fromTo(
          items,
          { x: (i: number) => packed()[i] },
          {
            x: 0,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 15%', scrub: true, invalidateOnRefresh: true },
          },
        );

        gsap.fromTo(
          '.mf-image',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut', scrollTrigger: { trigger: '.mf-image', start: 'top 85%' } },
        );
        gsap.fromTo('.mf-image-inner', { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.mf-image', start: 'top 85%' } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="craft" className="relative bg-white px-5 pt-5 pb-[150px] max-md:pb-24">
      <div className="eq-row label flex justify-between text-[16px] font-medium max-md:text-[11px]">
        {manifesto.equation.map((w, i) => (
          <span key={i} className="eq-item inline-block">
            {w}
          </span>
        ))}
      </div>

      <div className="mt-[160px] grid grid-cols-2 max-md:mt-20 max-md:flex max-md:flex-col max-md:gap-10">
        <div className="flex flex-col pr-10 max-md:contents">
          <h2 className="h2 max-w-[630px]" data-reveal="blur">
            <RichText value={manifesto.left} />
          </h2>
          <p className="mt-auto max-w-[341px] text-[16px] leading-[1.1] max-md:order-1" data-reveal="blur">
            <RichText value={manifesto.small} />
          </p>
        </div>
        <div className="pt-[75px] max-md:contents">
          <div className="mf-image relative aspect-[340/165] w-[340px] overflow-hidden max-md:order-2 max-md:w-full">
            <div className="mf-image-inner relative h-full w-full">
              <Photo photo={manifesto.image} sizes="(max-width: 767px) 100vw, 340px" />
            </div>
          </div>
          <h2 className="h2 mt-[55px] max-w-[700px] max-md:order-3 max-md:mt-0" data-reveal="blur">
            <RichText value={manifesto.right} />
          </h2>
        </div>
      </div>
    </section>
  );
}
