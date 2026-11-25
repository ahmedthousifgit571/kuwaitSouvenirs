'use client';

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import CollectionPhoto from '@/components/CollectionPhoto';
import { RichText } from '@/components/ui';
import { collections } from '@/content/site';
import { gsap, MOTION_OK, REDUCED, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';
import { waOrder } from '@/lib/whatsapp';

const HIDDEN = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
const FULL = 'polygon(0% 0%, 100% 0%, 100% 101%, 0% 101%)';

/**
 * Phones, tablets and reduced motion: one collection at a time. Swipe or use the arrows;
 * the next picture opens from the corner like the desktop version.
 */
export default function CollectionsMobile() {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const cur = useRef(0);
  const busy = useRef(false);
  const startX = useRef<number | null>(null);
  const n = collections.items.length;

  useGSAP(
    () => {
      const el = root.current!;
      const masks = gsap.utils.toArray<HTMLElement>('.cm-mask', el);
      const arts = gsap.utils.toArray<HTMLElement>('.cm-art', el);
      const texts = gsap.utils.toArray<HTMLElement>('.cm-text', el);
      gsap.set(masks, { clipPath: HIDDEN, visibility: 'hidden' });
      gsap.set(masks[0], { clipPath: FULL, visibility: 'visible' });
      gsap.set(arts[0], { scale: 1.2 });
      gsap.set(texts, { autoAlpha: 0 });
      gsap.set(texts[0], { autoAlpha: 1 });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => blurReveal(el));
    },
    { scope: root },
  );

  // A plain click/swipe handler: its tweens are short and finish on their own.
  const go = (delta: number) => {
    const prev = cur.current;
    const next = prev + delta;
    if (busy.current || next < 0 || next >= n) return;
    busy.current = true;
    cur.current = next;
    setIndex(next);

    const el = root.current!;
    const masks = gsap.utils.toArray<HTMLElement>('.cm-mask', el);
    const arts = gsap.utils.toArray<HTMLElement>('.cm-art', el);
    const texts = gsap.utils.toArray<HTMLElement>('.cm-text', el);
    const d = window.matchMedia(REDUCED).matches ? 0 : 0.9;
    const done = () => {
      gsap.set(masks[prev], { visibility: 'hidden', zIndex: 0 });
      gsap.set(masks[next], { zIndex: 1 });
      busy.current = false;
    };
    const tl = gsap.timeline({ defaults: { duration: d, ease: 'power2.inOut' }, onComplete: done });
    if (delta > 0) {
      gsap.set(masks[next], { visibility: 'visible', zIndex: 2, clipPath: HIDDEN });
      gsap.set(arts[next], { scale: 1 });
      tl.to(masks[next], { clipPath: FULL }, 0).to(arts[next], { scale: 1.2 }, 0).to(arts[prev], { scale: 1.4 }, 0);
    } else {
      gsap.set(masks[next], { visibility: 'visible', zIndex: 1, clipPath: FULL });
      gsap.set(masks[prev], { zIndex: 2 });
      tl.to(masks[prev], { clipPath: HIDDEN }, 0).to(arts[prev], { scale: 1 }, 0).to(arts[next], { scale: 1.2 }, 0);
    }
    tl.to(texts[prev], { autoAlpha: 0, duration: d / 3, ease: 'power1.out' }, 0).to(texts[next], { autoAlpha: 1, duration: d / 3, ease: 'power1.in' }, d / 4.5);
  };

  return (
    <div ref={root} className="px-5 pt-20 pb-24">
      <h2 className="text-[min(15vw,110px)] leading-none tracking-[-0.04em]" data-reveal="blur">
        {collections.title}
        <br />
        <span className="it text-[1.08em] leading-[0.9]">{collections.italic}</span>
      </h2>
      <p className="mt-8 ml-[25%] max-w-[300px] text-[16px] leading-[1.15]" data-reveal="blur">
        <RichText value={collections.intro} />
      </p>

      <div
        className="relative mt-10 aspect-[4/5] w-full touch-pan-y overflow-hidden select-none md:aspect-[16/10] lg:aspect-auto lg:h-[78svh] short:aspect-auto short:h-[68svh]"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (dx < -40) go(1);
          else if (dx > 40) go(-1);
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        {collections.items.map((c, i) => (
          <div key={c.name} className="cm-mask absolute inset-0 overflow-hidden">
            <div className="cm-art h-full w-full">
              <CollectionPhoto item={c} index={i} sizes="100vw" />
            </div>
          </div>
        ))}
      </div>

      {/* Below 360px the arrows drop under the name, so the name and tags keep the full width. */}
      <div className="mt-5 flex items-start justify-between gap-4 max-[359px]:flex-col max-[359px]:items-stretch max-[359px]:gap-3">
        <div className="relative min-h-[64px] flex-1">
          {collections.items.map((c, i) => (
            <div key={c.name} className={`cm-text ${i === 0 ? 'relative' : 'absolute inset-x-0 top-0'}`}>
              <p className="label text-[13px]">{c.tags}</p>
              <a href={waOrder(`${c.name} collection`)} target="_blank" rel="noreferrer" className="it mt-2 inline-flex items-center gap-1 py-1 text-[clamp(26px,7.8vw,30px)] leading-none whitespace-nowrap">
                {c.name}
                <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
              </a>
            </div>
          ))}
        </div>
        {/* The arrows carry padding (and a matching negative margin) so each is a 40px tap area. */}
        <div className="flex items-center gap-4 rounded-[50%] border border-red px-6 py-4 max-[359px]:self-end">
          <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous collection" className="-m-2.5 p-2.5 transition-opacity disabled:opacity-30">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <span className="font-mono text-[15px] font-medium tabular-nums" aria-live="polite">
            {String(index + 1).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => go(1)} disabled={index === n - 1} aria-label="Next collection" className="-m-2.5 p-2.5 transition-opacity disabled:opacity-30">
            <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
