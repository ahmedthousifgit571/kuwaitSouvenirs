'use client';

import { useRef } from 'react';
import HeroReel from '@/components/HeroReel';
import LocalTime from '@/components/LocalTime';
import { brand, hero } from '@/content/site';
import { gsap, MOTION_OK, PHONE, useGSAP } from '@/lib/gsap';
import { onIntro } from '@/lib/intro';

/**
 * Statement under the wordmark, Kuwait time and status in the bottom corners, and the reel:
 * it opens as a small inset at the bottom and grows to full bleed as you scroll,
 * held on a sticky stage.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, phone: PHONE }, (ctx) => {
        const { motion, phone } = ctx.conditions as { motion: boolean; phone: boolean };
        if (!motion) return;

        const stage = q('.hero-stage')[0] as HTMLElement;
        const reel = q('.hero-reel')[0] as HTMLElement;
        const title = q('.hero-title')[0] as HTMLElement;
        const s0 = phone ? 0.62 : 0.4;

        // Start the inset low on screen but always clear of the statement.
        const y0 = () => {
          const vh = stage.offsetHeight;
          const below = title.offsetTop + title.offsetHeight + (phone ? 28 : 48);
          const top = Math.min(Math.max(vh * (phone ? 0.45 : 0.8), below), vh * 0.9);
          return (top / vh - 0.5 + s0 / 2) * 100;
        };

        // Entrance, after the loader hands over.
        gsap.set(q('.hero-line'), { opacity: 0, filter: 'blur(10px)', y: 15 });
        gsap.set(q('.hero-reel-box'), { scale: 0 });
        gsap.set(q('.hero-meta'), { y: 30, opacity: 0 });
        const off = onIntro(() => {
          const tl = gsap.timeline();
          tl.to(q('.hero-line'), { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6, ease: phone ? 'power3.out' : 'power1.out', stagger: 0.1 }, phone ? 0 : 0.2)
            .to(q('.hero-reel-box'), { scale: 1, duration: 0.8, ease: 'power1.out' }, phone ? 0 : 0.4)
            .to(q('.hero-meta'), { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' }, phone ? 0.1 : 1);
        });

        // Scroll: the reel grows from the inset to full bleed.
        gsap.fromTo(
          reel,
          { scale: s0, yPercent: y0, y: 0 },
          {
            scale: 1,
            yPercent: 0,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight}`, scrub: 0.5, invalidateOnRefresh: true },
          },
        );
        gsap.to(q('.hero-title, .hero-meta-wrap'), {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: () => `top+=${window.innerHeight * 0.35} top`, end: () => `+=${window.innerHeight * 0.4}`, scrub: true },
        });

        return () => off();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative h-[calc(100svh+150vh)] motion-reduce:h-auto">
      <div className="hero-stage sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:pb-5">
        <div className="hero-title relative z-[1] pt-[calc(20px+var(--wm-h)+24px+19px+52px)] pl-[50%] pr-5 max-md:pt-[calc(20px+var(--wm-h)+24px+19px+40px)] max-md:pl-5 short:pt-[calc(20px+var(--wm-h)+24px+19px+20px)]">
          <h1 className="h1 max-md:text-[min(34px,8.6vw)]">
            {hero.lines.map((l) => (
              <span key={l} className="hero-line block">
                {l}
              </span>
            ))}
            <span className="hero-line block">
              <span className="it">{hero.italic}</span>
            </span>
          </h1>
          {/* On phones the reel would cover the corners, so time and status sit under the statement. */}
          <div className="hero-meta mt-6 flex items-end justify-between md:hidden">
            <LocalTime className="label font-medium" />
            <div className="label flex items-center gap-3 font-medium">
              <span className="pulse-dot" aria-hidden />
              {brand.status}
            </div>
          </div>
        </div>

        <div className="hero-meta-wrap pointer-events-none absolute inset-x-5 bottom-5 z-[1] flex items-end justify-between motion-reduce:hidden max-md:hidden">
          <LocalTime className="hero-meta label font-medium" />
          <div className="hero-meta label flex items-center gap-3 font-medium">
            <span className="pulse-dot" aria-hidden />
            {brand.status}
          </div>
        </div>

        <div className="hero-reel-box absolute inset-0 z-[2] motion-reduce:relative motion-reduce:mx-5 motion-reduce:mt-12 motion-reduce:aspect-video motion-reduce:h-auto">
          <div className="hero-reel absolute inset-0 origin-center will-change-transform">
            <HeroReel />
          </div>
        </div>
      </div>
    </section>
  );
}
