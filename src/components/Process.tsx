'use client';

import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { drawRoll, type RollGeometry } from '@/components/process/roll';
import { Pill, RichText } from '@/components/ui';
import { brand, process } from '@/content/site';
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Four red step cards on a sticky stage. On desktop they rise like a bar chart; on phones
 * they pan sideways. Across them a rough stone rolls from A to B and ends as a pearl.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const stage = q('.proc-stage')[0] as HTMLElement;
      const canvas = q('.roll-canvas')[0] as HTMLCanvasElement;
      const cardsBox = q('.proc-cards')[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add({ desktop: DESKTOP, motion: MOTION_OK }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        const c2d = canvas.getContext('2d')!;
        let geo: RollGeometry | null = null;
        const logo = new Image();
        logo.decoding = 'async';
        logo.src = brand.logo;
        logo.onload = () => {
          needsDraw = true;
        };
        let target = 0;
        let current = 0;
        let needsDraw = true;

        const measure = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const W = stage.clientWidth;
          const H = stage.clientHeight;
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
          canvas.style.width = `${W}px`;
          canvas.style.height = `${H}px`;
          c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
          // A phone on its side leaves the cards short: a smaller stone, rolling higher, keeps clear of the text.
          const short = !desktop && W > H && H < 560;
          const R = Math.min(W, H) * (desktop ? 0.13 : short ? 0.09 : 0.15);
          const xLeft = desktop ? -R : R;
          const xRight = W - 20 - R; // finish inside the last card
          geo = {
            W,
            H,
            R,
            axle: cardsBox.offsetTop + cardsBox.offsetHeight * (short ? 0.28 : 0.36),
            xLeft,
            xRight,
            tEntry: desktop ? (2 * R) / (xRight - xLeft) : 0.05,
          };
          needsDraw = true;
        };
        measure();

        // Desktop lets the cards rise first, so the stone only starts after a quarter of the pin.
        const offset = desktop ? 0.25 : 0;
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            target = Math.max(0, (self.progress - offset) / (1 - offset));
          },
          onRefresh: measure,
        });

        // Ease toward the scroll position each frame; draw only while it moves.
        const tick = () => {
          if (!geo) return;
          const d = target - current;
          if (Math.abs(d) > 0.0004) {
            current += d * 0.2;
            needsDraw = true;
          } else if (current !== target) {
            current = target;
            needsDraw = true;
          }
          if (!needsDraw) return;
          drawRoll(c2d, geo, current, logo);
          needsDraw = false;
        };
        gsap.ticker.add(tick);

        if (desktop) {
          const cards = q('.proc-card');
          const lengths = [0.42, 0.62, 0.8, 1];
          const rise = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top 65%',
              end: () => `top+=${(el.offsetHeight - window.innerHeight) * 0.55} top`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          cards.forEach((c, i) =>
            rise.fromTo(c, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power1.out', duration: lengths[i] }, 0),
          );
        } else {
          gsap.fromTo(
            cardsBox,
            { x: 0 },
            {
              x: () => -(cardsBox.scrollWidth - cardsBox.clientWidth),
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
            },
          );
        }

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          c2d.clearRect(0, 0, canvas.width, canvas.height);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[calc(100svh+300vh)] bg-white lg:h-[calc(100svh+320vh)] motion-reduce:h-auto!">
      <div className="proc-stage sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:pb-5">
        {/* Header: A → B, the note, and the pill */}
        <div className="absolute inset-x-5 top-[80px] grid grid-cols-4 items-center gap-3 max-lg:top-5 max-lg:grid-cols-[1fr_auto] max-lg:gap-y-6 motion-reduce:relative motion-reduce:inset-auto motion-reduce:mx-5 motion-reduce:pt-5">
          {/* Below lg this row spans both columns, so its width never squeezes the pill off screen. */}
          <div className="flex items-center justify-between text-[16px] max-lg:order-3 max-lg:col-span-2 max-lg:w-[min(200px,100%)]">
            <span>{process.a}</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            <span>{process.b}</span>
          </div>
          <p className="col-start-3 max-w-[230px] text-[16px] leading-[1.15] max-lg:col-start-1 max-lg:order-1 max-lg:max-w-none max-lg:text-[15px]">
            <RichText value={process.note} />
          </p>
          <div className="col-start-4 justify-self-end max-lg:col-start-2 max-lg:order-2">
            <Pill className="max-lg:text-[18px]">{process.pill}</Pill>
          </div>
        </div>

        {/* Cards: a 4-column row on desktop, a sideways track on phones */}
        <ol className="proc-cards absolute inset-x-5 top-[163px] bottom-5 grid grid-cols-4 gap-3 max-lg:top-[126px] max-lg:bottom-[60px] max-lg:flex motion-reduce:relative motion-reduce:inset-auto motion-reduce:mx-5 motion-reduce:mt-10 motion-reduce:h-[560px] max-lg:motion-reduce:h-auto max-lg:motion-reduce:flex-col">
          {process.steps.map((s, i) => (
            <li
              key={s.title}
              className="proc-card flex flex-col bg-red p-5 text-white max-lg:w-[86vw] max-lg:shrink-0 md:max-lg:w-[46vw] max-lg:motion-reduce:h-[420px] max-lg:motion-reduce:w-auto"
            >
              <span className="font-mono text-[16px] font-medium">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-auto text-[32px] leading-none tracking-[-0.03em] max-lg:text-[28px]">
                {s.title}
                <br />
                <span className="it text-[1.08em]">{s.italic}</span>
              </h3>
              <p className="mt-5 min-h-[3.6em] max-w-[301px] text-[16px] leading-[1.2]">
                <RichText value={s.body} />
              </p>
            </li>
          ))}
        </ol>

        <canvas className="roll-canvas pointer-events-none absolute top-0 left-0 motion-reduce:hidden" aria-hidden />
      </div>
    </section>
  );
}
