'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { contact } from '@/content/site';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { waLink } from '@/lib/whatsapp';

// The shape gains sides as it travels and arrives as a circle: diamond, hexagon, octagon,
// 12-gon, 16-gon, circle, turning a quarter more at every checkpoint.
const SIDES = [4, 6, 8, 12, 16];
const CHECKS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const SAMPLES = 160;

function polyR(n: number, R: number, phi: number) {
  const seg = (Math.PI * 2) / n;
  const f = ((phi % seg) + seg) % seg;
  return (R * Math.cos(Math.PI / n)) / Math.cos(f - Math.PI / n);
}

/** Outline of the shape at progress p (0..1), centred in a box of `size`. */
function shapePath(p: number, size: number) {
  const R = size / 2 - 3;
  const c = size / 2;
  const seg = Math.min(4, Math.floor(p / 0.2));
  const t = Math.min(1, (p - seg * 0.2) / 0.2);
  const nA = SIDES[seg];
  const nB = seg < 4 ? SIDES[seg + 1] : 0;
  let d = '';
  for (let i = 0; i <= SAMPLES; i++) {
    const th = (i / SAMPLES) * Math.PI * 2;
    const phi = th + Math.PI / 2; // a vertex points straight up
    const r = nB ? polyR(nA, R, phi) + (polyR(nB, R, phi) - polyR(nA, R, phi)) * t : polyR(16, R, phi) + (R - polyR(16, R, phi)) * t;
    d += `${i ? 'L' : 'M'}${(c + Math.cos(th) * r).toFixed(2)} ${(c + Math.sin(th) * r).toFixed(2)}`;
  }
  return d + 'Z';
}

/**
 * "[ ORDER NOW ]" on a red shape that slides along a dashed line under the cursor
 * (dragged with a finger on touch screens). It morphs from a diamond to a circle as it goes
 * and drops a fading outline at every checkpoint it passes. Click or tap to order.
 */
export default function LetsTalk({ area }: { area: RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const set = () => setTouch(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useGSAP(
    () => {
      const el = track.current!;
      const shape = el.querySelector<HTMLElement>('.lt-shape')!;
      const path = el.querySelector<SVGPathElement>('.lt-path')!;
      const svg = el.querySelector<SVGSVGElement>('.lt-svg')!;
      let size = shape.offsetWidth;
      let target = 0;
      let current = 0;
      let drawn = -1;
      const trails: SVGSVGElement[] = [];

      const span = () => el.clientWidth - size;
      const render = (p: number) => {
        path.setAttribute('d', shapePath(p, size));
        gsap.set(svg, { rotation: p * 450, transformOrigin: '50% 50%' });
        gsap.set(shape, { x: p * span() });
      };

      // An outline left behind at a checkpoint, fading slower the more are already showing.
      const dropTrail = (i: number) => {
        const p = CHECKS[i];
        const ns = 'http://www.w3.org/2000/svg';
        const ghost = document.createElementNS(ns, 'svg');
        ghost.setAttribute('viewBox', `0 0 ${size} ${size}`);
        ghost.setAttribute('class', 'pointer-events-none absolute top-0 left-0 text-red');
        ghost.style.width = ghost.style.height = `${size}px`;
        const gp = document.createElementNS(ns, 'path');
        gp.setAttribute('d', shapePath(p, size));
        gp.setAttribute('fill', 'none');
        gp.setAttribute('stroke', 'currentColor');
        gp.setAttribute('stroke-width', '1');
        ghost.appendChild(gp);
        el.insertBefore(ghost, shape);
        gsap.set(ghost, { x: p * span(), rotation: p * 450, transformOrigin: '50% 50%' });
        trails.push(ghost);
        gsap.to(ghost, {
          opacity: 0,
          duration: 0.3 + trails.length * 0.4,
          ease: 'power2.out',
          onComplete: () => {
            ghost.remove();
            trails.splice(trails.indexOf(ghost), 1);
          },
        });
      };

      const tick = () => {
        const d = target - current;
        if (Math.abs(d) < 0.0005 && drawn === current) return;
        const prev = current;
        current = Math.abs(d) < 0.0005 ? target : current + d * 0.2;
        CHECKS.forEach((c, i) => {
          if ((prev < c && current >= c) || (prev > c && current <= c)) dropTrail(i);
        });
        render(current);
        drawn = current;
      };
      gsap.ticker.add(tick);
      render(0);

      const onResize = () => {
        size = shape.offsetWidth;
        drawn = -1;
      };
      window.addEventListener('resize', onResize);

      // Mouse: follow the cursor anywhere over the contact block. The parent's ref is not
      // attached yet while this child effect runs, so fall back to the enclosing section.
      const zone = area.current ?? el.closest('section');
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        target = Math.min(1, Math.max(0, (e.clientX - r.left - size / 2) / (r.width - size)));
      };
      zone?.addEventListener('pointermove', onMove);

      // Touch: drag the shape itself. A short tap still follows the link.
      let dragging = false;
      let moved = 0;
      let offset = 0;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') return;
        dragging = true;
        moved = 0;
        offset = e.clientX - shape.getBoundingClientRect().left;
        shape.setPointerCapture(e.pointerId);
      };
      const onDrag = (e: PointerEvent) => {
        if (!dragging) return;
        const r = el.getBoundingClientRect();
        moved += Math.abs(e.movementX || 0) + 1;
        target = Math.min(1, Math.max(0, (e.clientX - offset - r.left) / (r.width - size)));
      };
      const onUp = () => (dragging = false);
      const onClick = (e: MouseEvent) => {
        if (moved > 8) e.preventDefault();
        moved = 0;
      };
      shape.addEventListener('pointerdown', onDown);
      shape.addEventListener('pointermove', onDrag);
      shape.addEventListener('pointerup', onUp);
      shape.addEventListener('pointercancel', onUp);
      shape.addEventListener('click', onClick);

      // Touch screens get a one-off nudge so the shape reads as draggable.
      const mm = gsap.matchMedia();
      mm.add(`(hover: none) and ${MOTION_OK}, (pointer: coarse) and ${MOTION_OK}`, () => {
        const proxy = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          once: true,
          onEnter: () =>
            gsap
              .timeline()
              .to(proxy, { v: 0.42, duration: 1.1, ease: 'power2.inOut', onUpdate: () => (target = proxy.v) })
              .to(proxy, { v: 0, duration: 1, ease: 'power2.inOut', onUpdate: () => (target = proxy.v) }, '+=0.25'),
        });
      });

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', onResize);
        zone?.removeEventListener('pointermove', onMove);
        shape.removeEventListener('pointerdown', onDown);
        shape.removeEventListener('pointermove', onDrag);
        shape.removeEventListener('pointerup', onUp);
        shape.removeEventListener('pointercancel', onUp);
        shape.removeEventListener('click', onClick);
        trails.forEach((t) => t.remove());
      };
    },
    { scope: track },
  );

  return (
    <div ref={track} className="relative h-[220px] max-lg:h-[150px]">
      <div
        className="pointer-events-none absolute top-1/2 -right-5 -left-5 h-px -translate-y-1/2"
        style={{ backgroundImage: 'repeating-linear-gradient(to right, rgba(207,24,48,0.45) 0 6px, transparent 6px 12px)' }}
        aria-hidden
      />
      <a
        href={waLink(contact.message)}
        target="_blank"
        rel="noreferrer"
        className="lt-shape absolute top-0 left-0 block h-[220px] w-[220px] touch-pan-y select-none max-lg:h-[150px] max-lg:w-[150px]"
        aria-label={contact.cta}
        draggable={false}
      >
        <svg className="lt-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <path className="lt-path fill-red" />
        </svg>
        <span className="label absolute inset-0 flex items-center justify-center text-[16px] font-medium whitespace-nowrap text-white max-lg:text-[12px]">
          {touch ? `< ${contact.ctaTouch} >` : `[ ${contact.cta} ]`}
        </span>
      </a>
    </div>
  );
}
