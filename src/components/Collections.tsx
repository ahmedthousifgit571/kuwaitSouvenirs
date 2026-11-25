'use client';

import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import CollectionPhoto from '@/components/CollectionPhoto';
import CollectionsMobile from '@/components/CollectionsMobile';
import ExploreBadge from '@/components/ExploreBadge';
import { RichText } from '@/components/ui';
import { collections } from '@/content/site';
import { DESKTOP, FINE_POINTER, gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';
import { waOrder } from '@/lib/whatsapp';

// Each slide opens from the bottom-right corner, as on the reference.
const HIDDEN = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
const FULL = 'polygon(0% 0%, 100% 0%, 100% 101%, 0% 101%)';
const TRANSITION = 0.9;
const DIM = 0.28;
const REVEAL_EASE = 'power2.inOut';

/**
 * Desktop: a pinned stage. The list sits bottom left; each collection's picture opens from the
 * corner over the right side, one viewport of scroll per collection, snapping between them.
 * Phones and reduced motion get the slider instead.
 */
export default function Collections() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const labels = useRef<number[]>([]);
  const snapTimer = useRef<number | undefined>(undefined);
  const dir = useRef(1);

  // Snap to the nearest collection once scrolling stops inside the pin.
  useLenis((lenis) => {
    if (lenis.direction) dir.current = lenis.direction;
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      const trig = st.current;
      if (!trig || !trig.isActive || !labels.current.length) return;
      const p = trig.progress;
      const ease = gsap.parseEase(REVEAL_EASE);
      const ls = labels.current;
      let pick = ls[ls.length - 1];
      for (let i = 0; i < ls.length - 1; i++) {
        if (p > ls[i + 1]) continue;
        const local = (p - ls[i]) / (ls[i + 1] - ls[i]);
        const revealed = ease(Math.min(1, Math.max(0, local / (TRANSITION / 1))));
        pick = revealed >= (dir.current > 0 ? 0.1 : 0.9) ? ls[i + 1] : ls[i];
        break;
      }
      const y = trig.start + pick * (trig.end - trig.start);
      if (Math.abs(y - lenis.scroll) > 2) lenis.scrollTo(y, { duration: 0.6, easing: (t) => 1 - Math.pow(1 - t, 3) });
    }, 110);
  });

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const pin = el.querySelector<HTMLElement>('.col-desktop')!;
        blurReveal(pin);
        const items = gsap.utils.toArray<HTMLElement>('.col-item', pin);
        const masks = gsap.utils.toArray<HTMLElement>('.col-mask', pin);
        const arts = gsap.utils.toArray<HTMLElement>('.col-art', pin);

        gsap.set(items, { opacity: DIM });
        gsap.set(masks, { clipPath: HIDDEN });
        gsap.set(arts, { scale: 1.1, transformOrigin: '50% 50%' });

        const tl = gsap.timeline({ defaults: { duration: TRANSITION, ease: REVEAL_EASE } });
        tl.addLabel('top', 0)
          .to(masks[0], { clipPath: FULL }, 0)
          .to(arts[0], { scale: 1, ease: 'none' }, 0)
          .to(items[0], { opacity: 1, duration: 0.28, ease: 'none' }, 0)
          .addLabel('s0', 1);
        for (let i = 1; i < masks.length; i++) {
          tl.to(masks[i], { clipPath: FULL }, i)
            .to(arts[i], { scale: 1, ease: 'none' }, i)
            .to(arts[i - 1], { scale: 1.2, ease: 'none' }, i)
            .to(items[i - 1], { opacity: DIM, duration: 0.28, ease: 'none' }, i)
            .to(items[i], { opacity: 1, duration: 0.28, ease: 'none' }, i)
            .addLabel(`s${i}`, i + 1);
        }
        const END = masks.length;
        tl.to({}, { duration: 0.01 }, END - 0.01);
        labels.current = Array.from(new Set(Object.values(tl.labels).map((t) => t / tl.duration()))).sort((a, b) => a - b);

        st.current = ScrollTrigger.create({ animation: tl, trigger: el, start: 'top top', end: 'bottom bottom', scrub: true });

        // The badge follows the cursor over the pictures, and drifts home when it leaves.
        const area = pin.querySelector<HTMLElement>('.col-area')!;
        const badge = pin.querySelector<HTMLElement>('.col-badge')!;
        const home = () => ({ x: area.clientWidth * 0.2, y: area.clientHeight * 0.5 });
        gsap.set(badge, { x: home().x, y: home().y, xPercent: -50, yPercent: -50 });
        const fine = window.matchMedia(FINE_POINTER).matches;
        if (!fine) return;
        const toX = gsap.quickTo(badge, 'x', { duration: 0.6, ease: 'power3.out' });
        const toY = gsap.quickTo(badge, 'y', { duration: 0.6, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = area.getBoundingClientRect();
          toX(e.clientX - r.left);
          toY(e.clientY - r.top);
        };
        const leave = () => {
          toX(home().x);
          toY(home().y);
        };
        area.addEventListener('pointermove', move);
        area.addEventListener('pointerleave', leave);
        return () => {
          area.removeEventListener('pointermove', move);
          area.removeEventListener('pointerleave', leave);
          st.current = null;
          labels.current = [];
        };
      });
    },
    { scope: root },
  );

  // The badge links to whichever collection is most open.
  const active = () => {
    const p = st.current?.progress ?? 0;
    return Math.min(collections.items.length - 1, Math.max(0, Math.round(p * collections.items.length - 0.5)));
  };

  return (
    // One viewport of scroll per collection, so the pin grows with the list.
    <section
      ref={root}
      id="collections"
      className="relative bg-white lg:h-[calc(100svh+var(--n)*100vh)] motion-reduce:h-auto!"
      style={{ '--n': collections.items.length } as React.CSSProperties}
    >
      <div className="col-desktop sticky top-0 hidden h-svh overflow-hidden lg:block motion-reduce:hidden!">
        <h2 className="absolute top-[85px] left-5 text-[clamp(64px,8.2vw,150px)] leading-none tracking-[-0.04em]" data-reveal="blur">
          {collections.title}
          <br />
          <span className="it text-[1.08em] leading-[0.9]">{collections.italic}</span>
        </h2>
        <p className="absolute top-[238px] left-[50.7%] max-w-[300px] text-[16px] leading-[1.2]" data-reveal="blur">
          <RichText value={collections.intro} />
        </p>

        {/* Rows shrink with the screen (1024px laptops, short windows) so every name stays on one line. */}
        <ol className="absolute bottom-2.5 left-5 w-[38vw] max-w-[620px]">
          {collections.items.map((c, i) => (
            <li key={c.name} className="col-item flex h-[clamp(54px,9svh,80px)] items-center gap-3 border-red whitespace-nowrap [&:not(:last-child)]:border-b">
              <span className="w-[clamp(34px,3.2vw,45px)] shrink-0 font-mono text-[clamp(13px,1.15vw,16px)] font-medium">{String(i + 1).padStart(2, '0')}.</span>
              <span className="it text-[clamp(24px,2.45vw,34px)] leading-none">{c.name}</span>
              <span className="label ml-auto text-[clamp(11px,1vw,14px)]">{c.tags}</span>
            </li>
          ))}
        </ol>

        <div className="col-area absolute inset-y-0 right-0 left-[40.8%]">
          {collections.items.map((c, i) => (
            <div key={c.name} className="col-mask absolute inset-0 overflow-hidden">
              <div className="col-art h-full w-full">
                <CollectionPhoto item={c} index={i} sizes="60vw" />
              </div>
            </div>
          ))}
          <div className="col-badge pointer-events-auto absolute top-0 left-0 z-[2]">
            <ExploreBadge
              label={collections.explore}
              href={waOrder(`${collections.items[0].name} collection`)}
              className="relative"
            />
          </div>
        </div>
        <ActiveLinkUpdater getActive={active} />
      </div>

      <div className="lg:hidden lg:motion-reduce:block!">
        <CollectionsMobile />
      </div>
    </section>
  );
}

/** Keeps the badge's WhatsApp link pointing at the collection on screen. */
function ActiveLinkUpdater({ getActive }: { getActive: () => number }) {
  useLenis(() => {
    const a = document.querySelector<HTMLAnchorElement>('.col-badge a');
    if (!a) return;
    const href = waOrder(`${collections.items[getActive()].name} collection`);
    if (a.href !== href) a.href = href;
  });
  return null;
}
