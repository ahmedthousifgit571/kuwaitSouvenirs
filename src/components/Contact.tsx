'use client';

import { useRef } from 'react';
import LetsTalk from '@/components/LetsTalk';
import { Pill, RichText } from '@/components/ui';
import { contact } from '@/content/site';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';

/**
 * Sits right under the TV: the pill, a two-tone call to action, a short note, and the
 * ORDER NOW shape on its dashed line. The negative top margin tucks it under the TV
 * as the packs stage finishes; with reduced motion there is no TV, so it sits in flow.
 */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => blurReveal(root.current!));
    },
    { scope: root },
  );

  return (
    // The overlap follows the TV's shape: the tall (portrait) cabinet ends lower than the wide one.
    <section ref={root} id="contact" className="relative z-[1] -mt-[24svh] px-5 pt-4 pb-[140px] max-md:pb-24 portrait:-mt-[17svh] motion-reduce:mt-0! motion-reduce:pt-24">
      <div className="flex flex-col items-center text-center">
        <Pill className="text-[20px]">{contact.pill}</Pill>
        <h2 className="mt-12 text-[clamp(44px,5.56vw,104px)] leading-none tracking-[-0.04em]" data-reveal="blur">
          {contact.title}
          <br />
          <span className="it text-[1.08em] leading-[0.9]">{contact.italic}</span>
        </h2>
        <p className="mt-10 max-w-[340px] text-[16px] leading-[1.2]" data-reveal="blur">
          <RichText value={contact.body} />
        </p>
      </div>
      <div className="mt-20 max-md:mt-14">
        <LetsTalk area={root} />
      </div>
    </section>
  );
}
