'use client';

import { useLenis } from 'lenis/react';
import { useId, useRef } from 'react';
import { brand } from '@/content/site';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { H, HEIGHT, LINE_GAP, LINES, S, WIDTH } from './letters';

type Props = {
  className?: string;
  /** Hide from assistive tech when another copy of the name is already announced. */
  decorative?: boolean;
};

// Round letters sit a hair past the cap height and the baseline, so the stamp reads the same size as its neighbours.
const LOGO_R = H / 2 + 4;
const IDLE_TURN = 24; // seconds per turn at rest

/**
 * SOUVENIR over AND MORE, edge to edge. Colour comes from `currentColor`.
 * Every letter is a `.wm-letter` group so the loader and footer can animate them one by one.
 * Each O is the round Souvenir & More stamp, filled with the wordmark's colour: it turns slowly,
 * winds up while the page scrolls, and spins faster under the cursor.
 */
export default function Wordmark({ className, decorative }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const root = useRef<SVGSVGElement>(null);
  const turns = useRef<gsap.core.Tween[]>([]);
  const hover = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The two stamps turn in opposite directions, like a pair of gears.
        turns.current = gsap.utils
          .toArray<SVGGElement>('.wm-spin', root.current)
          .map((el, i) => gsap.to(el, { rotation: i % 2 ? -360 : 360, transformOrigin: '50% 50%', duration: IDLE_TURN, ease: 'none', repeat: -1 }));
        return () => {
          turns.current = [];
        };
      });
    },
    { scope: root },
  );

  const setSpeed = (speed: number, duration = 0.35) => turns.current.forEach((t) => gsap.to(t, { timeScale: speed, duration, overwrite: true }));

  // Scrolling winds the stamps up; they settle back to their idle turn when the page stops.
  useLenis(({ velocity }) => {
    if (!turns.current.length) return;
    setSpeed((hover.current ? 6 : 1) + Math.min(Math.abs(velocity) * 0.4, 14));
  });

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'Souvenir & More'}
      overflow="visible"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        hover.current = true;
        setSpeed(6, 0.6);
      }}
      onPointerLeave={() => {
        hover.current = false;
        setSpeed(1, 1.2);
      }}
    >
      <defs>
        {/* The stamp as a luminance mask (white ink on black), so it takes on whatever colour the mark is drawn in. */}
        <mask id={`${uid}-logo`} maskContentUnits="objectBoundingBox">
          <image href={brand.logoMask} width="1" height="1" preserveAspectRatio="xMidYMid meet" />
        </mask>
        {LINES.flatMap((line, li) =>
          line
            .filter((g) => g.cuts.length && g.char !== 'O')
            .map((g, gi) => (
              <mask key={`${li}-${gi}`} id={`${uid}-m${li}-${g.x}`} maskUnits="userSpaceOnUse" x={-20} y={-20} width={g.w + 40} height={H + 40}>
                <rect x={-20} y={-20} width={g.w + 40} height={H + 40} fill="white" />
                {g.cuts.map((d, ci) => (
                  <path key={ci} d={d} fill="black" />
                ))}
              </mask>
            )),
        )}
      </defs>
      {LINES.map((line, li) => (
        <g key={li} transform={`translate(0 ${li * (H + LINE_GAP)})`}>
          {line.map((g) => (
            <g key={g.x} transform={`translate(${g.x} 0)`}>
              {g.char === 'O' ? (
                <g className="wm-letter" data-char="O">
                  <g className="wm-spin">
                    <rect x={g.w / 2 - LOGO_R} y={H / 2 - LOGO_R} width={LOGO_R * 2} height={LOGO_R * 2} fill="currentColor" mask={`url(#${uid}-logo)`} />
                  </g>
                </g>
              ) : (
                <g className="wm-letter" data-char={g.char} mask={g.cuts.length ? `url(#${uid}-m${li}-${g.x})` : undefined}>
                  {g.pieces.map((p, pi) =>
                    p.stroke ? (
                      <path key={pi} className="wm-piece" d={p.d} fill="none" stroke="currentColor" strokeWidth={S} />
                    ) : (
                      <path key={pi} className="wm-piece" d={p.d} fill="currentColor" />
                    ),
                  )}
                </g>
              )}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

export const WORDMARK_RATIO = HEIGHT / WIDTH;
