'use client';

import { animate, stagger } from 'animejs';
import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import Wordmark from '@/components/wordmark/Wordmark';
import { loader as copy } from '@/content/site';
import { gsap, useGSAP } from '@/lib/gsap';
import { introSkipped, startIntro } from '@/lib/intro';

const DIGIT_H = 20;
const TENS = Array.from({ length: 11 }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).flat();
const ONES = Array.from({ length: 21 }, (_, i) => (i % 2 ? 5 : 0));
const CUT_AT = '58%'; // where the red splits open, as on the reference

/** Five little "wheels" that roll in along the bottom: diamond, hexagon, octagon, circle, cog. */
function Wheel({ kind }: { kind: number }) {
  const shapes = [
    <path key="d" d="M7 0 L14 7 L7 14 L0 7 Z" />,
    <path key="h" d="M7 0 L13 3.5 V10.5 L7 14 L1 10.5 V3.5 Z" />,
    <path key="o" d="M4.5 0 H9.5 L14 4.5 V9.5 L9.5 14 H4.5 L0 9.5 V4.5 Z" />,
    <circle key="c" cx="7" cy="7" r="7" />,
    <path key="g" d="M6 0h2l.6 2.2 2-1.1 1.4 1.4-1.1 2L13.1 6v2l-2.2.6 1.1 2-1.4 1.4-2-1.1L8 13.1H6l-.6-2.2-2 1.1L2 10.6l1.1-2L.9 8V6l2.2-.6-1.1-2L3.4 2l2 1.1z" />,
  ];
  return (
    <svg viewBox="0 0 14 14" className="loader-wheel block h-[13px] w-[13px] fill-white" aria-hidden>
      {shapes[kind]}
    </svg>
  );
}

function Scissors() {
  return (
    <svg viewBox="0 0 40 24" className="block h-6 w-10 overflow-visible" aria-hidden>
      <g className="blade-a" style={{ transformBox: 'view-box', transformOrigin: '17px 12px' }}>
        <circle cx="7" cy="5.5" r="4.2" fill="none" stroke="white" strokeWidth="2.2" />
        <path d="M10.5 7.6 L17 11 L39 11.4 L17 9.4 Z" fill="white" />
      </g>
      <g className="blade-b" style={{ transformBox: 'view-box', transformOrigin: '17px 12px' }}>
        <circle cx="7" cy="18.5" r="4.2" fill="none" stroke="white" strokeWidth="2.2" />
        <path d="M10.5 16.4 L17 13 L39 12.6 L17 14.6 Z" fill="white" />
      </g>
      <circle cx="17" cy="12" r="1.6" fill="white" />
    </svg>
  );
}

function Strip({ digits, id }: { digits: number[]; id: string }) {
  return (
    <div className="loader-col relative h-5 w-[10px] overflow-hidden">
      <div className={`loader-strip absolute inset-x-0 top-0 flex flex-col items-center ${id}`}>
        {digits.map((d, i) => (
          <div key={i} className="flex h-5 w-full items-center justify-center font-mono text-[13px] font-bold leading-none text-white tabular-nums">
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Red screen, the wordmark drops in, scissors cut along the line while a counter rolls to 100,
 * then the red splits open on the cut and reveals the page.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const running = useRef(true);

  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && running.current) lenis.stop();
  }, [lenis]);

  useGSAP(
    () => {
      if (introSkipped()) {
        running.current = false;
        startIntro();
        setGone(true);
        return;
      }
      window.scrollTo(0, 0);
      const phone = window.innerWidth < 768;
      const k = phone ? 0.62 : 1; // phones get a shorter run

      const q = gsap.utils.selector(root);
      const letters = q('.loader-logo .wm-letter');
      const proxy = { v: 0 };
      const snip = animate(q('.blade-a'), { rotate: [-16, 2], duration: 260, loop: true, alternate: true, ease: 'inOutSine' });
      const snipB = animate(q('.blade-b'), { rotate: [16, -2], duration: 260, loop: true, alternate: true, ease: 'inOutSine' });
      const wheels = q('.loader-wheel-wrap');
      const rollIn = animate(wheels, {
        x: [window.innerWidth * 0.8, 0],
        rotate: [720, 0],
        duration: 1700 * k,
        delay: stagger(90, { start: 250 * k }),
        ease: 'outCubic',
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        onComplete: () => {
          running.current = false;
          snip.pause();
          snipB.pause();
          rollIn.pause();
          try {
            sessionStorage.setItem('ks-intro', '1');
          } catch {}
          lenisRef.current?.start();
          setGone(true);
        },
      });

      tl.from(letters, { y: -420, duration: 2 * k, stagger: { each: 0.05, from: 'center' } }, 0)
        .to(
          proxy,
          {
            v: 100,
            duration: 3 * k,
            ease: 'power2.inOut',
            onUpdate() {
              const v = proxy.v;
              gsap.set(q('.strip-h'), { y: -(v / 100) * DIGIT_H });
              gsap.set(q('.strip-t'), { y: -(v / 10) * DIGIT_H });
              gsap.set(q('.strip-o'), { y: -(v / 5) * DIGIT_H });
              gsap.set(q('.loader-cut'), { scaleX: v / 100 });
              gsap.set(q('.loader-scissors'), { x: (v / 100) * (window.innerWidth - 60) });
            },
          },
          0,
        )
        .to(q('.loader-progress'), { opacity: 0, duration: 0.25 }, 3 * k)
        .to(q('.loader-top'), { height: 0, duration: 1.7 * k, ease: 'power3.inOut' }, 3.05 * k)
        .to(q('.loader-bottom'), { height: 0, duration: 1.7 * k, ease: 'power3.inOut' }, 3.05 * k)
        .to(wheels, { x: () => window.innerWidth, rotate: 540, duration: 1.4 * k, ease: 'power2.in', stagger: 0.06 }, 3.1 * k)
        .call(startIntro, [], 4.1 * k);

      return () => {
        snip.revert();
        snipB.revert();
        rollIn.revert();
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="loader fixed inset-0 z-[100]" aria-hidden>
      <div className="loader-top absolute inset-x-0 top-0 overflow-hidden bg-red" style={{ height: CUT_AT }}>
        <div className="loader-logo absolute top-5 right-5 left-5 text-white">
          <Wordmark className="block h-auto w-full" decorative />
        </div>
      </div>
      <div className="loader-bottom absolute inset-x-0 bottom-0 overflow-hidden bg-red" style={{ height: `calc(100% - ${CUT_AT})` }}>
        <div className="absolute bottom-[22px] left-1/2 flex -translate-x-1/2 items-center gap-[26px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="loader-wheel-wrap">
              <Wheel kind={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="loader-progress absolute inset-x-0" style={{ top: CUT_AT }}>
        <div className="absolute bottom-[14px] left-5 flex gap-[2px]">
          <Strip digits={[0, 1]} id="strip-h" />
          <Strip digits={TENS} id="strip-t" />
          <Strip digits={ONES} id="strip-o" />
        </div>
        <div className="label absolute right-5 bottom-[14px] flex items-center gap-8 font-semibold text-white">
          <span>{copy.cutLabel}</span>
          <span className="tracking-[-0.2em]">▸▸▸</span>
        </div>
        <div
          className="absolute inset-x-0 top-0 h-px -translate-y-1/2"
          style={{ backgroundImage: 'repeating-linear-gradient(to right, #fff 0 8px, transparent 8px 14px)' }}
        />
        <div className="loader-cut absolute inset-x-0 top-0 h-[2px] origin-left -translate-y-1/2 scale-x-0 bg-white" />
        <div className="loader-scissors absolute top-0 left-5 -translate-y-[60%]">
          <Scissors />
        </div>
      </div>
    </div>
  );
}
