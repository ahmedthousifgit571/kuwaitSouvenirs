'use client';

import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Lightbox from '@/components/gallery/Lightbox';
import Photo from '@/components/Photo';
import { Pill, RichText } from '@/components/ui';
import { gallery, type GalleryCategory, type GalleryItem } from '@/content/site';
import { Flip, gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';

type Filter = 'all' | GalleryCategory;

// Columns: 4 from lg, 3 from md, 2 on phones. The server renders 4; phones re-flow right after
// hydration, which is invisible because the gallery is far down the page.
const WIDE = '(min-width: 64rem)';
const MID = '(min-width: 48rem)';
function subscribe(cb: () => void) {
  const qs = [matchMedia(WIDE), matchMedia(MID)];
  qs.forEach((q) => q.addEventListener('change', cb));
  return () => qs.forEach((q) => q.removeEventListener('change', cb));
}
const columnCount = () => (matchMedia(WIDE).matches ? 4 : matchMedia(MID).matches ? 3 : 2);
const useColumns = () => useSyncExternalStore(subscribe, columnCount, () => 4);

// The caption under each photo, as a share of the column width, so columns balance by real height.
const CAPTION = 0.24;
// How far each column drifts (px each way) as the grid scrolls by, from md up.
const DRIFT = [30, 110, 0, 80];

/** Masonry: each piece goes to the shortest column so far, keeping the reading order roughly intact. */
function toColumns(items: GalleryItem[], n: number) {
  const cols: { item: GalleryItem; index: number }[][] = Array.from({ length: n }, () => []);
  const heights = new Array<number>(n).fill(0);
  items.forEach((item, index) => {
    let c = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[c] - 0.01) c = i;
    cols[c].push({ item, index });
    heights[c] += item.photo.src.height / item.photo.src.width + CAPTION;
  });
  return cols;
}

const pad = (n: number) => String(n).padStart(2, '0');
// Each piece keeps its SM/GAL number whatever the filter.
const codeOf = (item: GalleryItem) => `SM/GAL.${pad(gallery.items.indexOf(item) + 1)}`;
const catLabel = (item: GalleryItem) => gallery.categories.find((c) => c.id === item.cat)?.label ?? '';

/**
 * Every product photo as a masonry wall: filter chips re-flow it with a Flip, columns drift at
 * different speeds on scroll, photos unclip from the bottom as they arrive, and tapping a piece
 * opens it full screen (see Lightbox) with a WhatsApp button to ask about it.
 */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const cols = useColumns();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const visible = useMemo(() => (filter === 'all' ? gallery.items : gallery.items.filter((i) => i.cat === filter)), [filter]);
  const columns = useMemo(() => toColumns(visible, cols), [visible, cols]);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: gallery.items.length, mugs: 0, wear: 0, keep: 0, shop: 0 };
    gallery.items.forEach((i) => c[i.cat]++);
    return c;
  }, []);

  // Heading lines blur in once.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => blurReveal(root.current!));
    },
    { scope: root },
  );

  // Column drift and photo reveals, rebuilt whenever the column count changes.
  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${MID}`, () => {
        const grid = el.querySelector('.gl-grid');
        gsap.utils.toArray<HTMLElement>('.gl-col', el).forEach((col, i) => {
          const s = DRIFT[i % DRIFT.length];
          if (!s) return;
          gsap.fromTo(col, { y: s }, { y: -s, ease: 'none', scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
      });
      mm.add(MOTION_OK, () => {
        const media = gsap.utils.toArray<HTMLElement>('.gl-media', el);
        gsap.set(media, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(gsap.utils.toArray('.gl-zoom', el), { scale: 1.25 });
        ScrollTrigger.batch(media, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'ks', stagger: 0.09 });
            gsap.to(batch.map((m) => m.querySelector('.gl-zoom')), { scale: 1, duration: 1.4, ease: 'ks', stagger: 0.09 });
          },
        });
      });
    },
    { scope: root, dependencies: [cols], revertOnUpdate: true },
  );

  // Filter change: remember where every piece was, re-render, then Flip them to their new places.
  const flip = useRef<Flip.FlipState | null>(null);
  const changed = useRef(false);
  const choose = (f: Filter) => {
    if (f === filter) return;
    changed.current = true;
    if (matchMedia(MOTION_OK).matches) flip.current = Flip.getState(root.current!.querySelectorAll('.gl-item'));
    setFilter(f);
  };
  useLayoutEffect(() => {
    if (!changed.current) return;
    changed.current = false;
    const state = flip.current;
    flip.current = null;
    // The section changed height: everything below (the packs pin) needs new positions.
    const refresh = () => ScrollTrigger.refresh();
    if (!state) return refresh();
    // Pieces that just mounted were never registered for the reveal, so they start fully shown.
    Flip.from(state, {
      targets: root.current!.querySelectorAll('.gl-item'),
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.015,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' }),
      onComplete: refresh,
    });
  }, [filter]);

  const show = (index: number, el: HTMLElement) => {
    opener.current = el;
    setOpen(index);
  };
  const hide = () => {
    setOpen(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  };

  const chips: { id: Filter; label: string }[] = [{ id: 'all', label: gallery.all }, ...gallery.categories];

  return (
    <section ref={root} id="gallery" className="relative bg-white px-5 pt-[120px] pb-[150px] max-md:pt-20 max-md:pb-24">
      <div className="grid grid-cols-2 items-end gap-10 max-md:grid-cols-1 max-md:gap-8">
        <div>
          <Pill className="text-[20px]">{gallery.pill}</Pill>
          <h2 className="h2 mt-10 max-md:mt-8" data-reveal="blur">
            {gallery.title}
            <br />
            <span className="it">{gallery.italic}</span>
          </h2>
        </div>
        <p className="max-w-[360px] text-[16px] leading-[1.2] md:mb-1" data-reveal="blur">
          <RichText value={gallery.intro} />
        </p>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-red pt-5 max-md:mt-10 max-md:gap-1.5">
        {chips.map((c) => {
          const on = c.id === filter;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(c.id)}
              className={`label flex items-center gap-1.5 rounded-full border border-red px-4 py-2.5 text-[12px] font-medium transition-colors duration-300 max-md:px-3 max-md:py-2 max-md:text-[11px] ${
                on ? 'bg-red text-white' : 'hover:bg-red/8'
              }`}
            >
              {c.label}
              <span className={`text-[10px] tabular-nums ${on ? 'text-white/70' : 'text-ink/45'}`}>{pad(counts[c.id])}</span>
            </button>
          );
        })}
        <p className="label ml-auto text-[12px] text-ink/50 max-md:hidden">
          <span className="tabular-nums">{pad(visible.length)}</span> {gallery.pieces} · {gallery.hint}
        </p>
      </div>

      <div className="gl-grid mt-12 flex items-start gap-5 max-md:mt-8 max-md:gap-3">
        {columns.map((col, c) => (
          <div key={c} className="gl-col flex min-w-0 flex-1 flex-col gap-10 max-md:gap-6">
            {col.map(({ item, index }) => (
              <Tile key={item.id} item={item} onOpen={(el) => show(index, el)} />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && visible[open] && (
          <Lightbox key="lightbox" items={visible} index={open} codeOf={codeOf} catLabel={catLabel} onIndex={setOpen} onClose={hide} />
        )}
      </AnimatePresence>
    </section>
  );
}

/** One piece: the photo at its own shape, its code sticker, and the name and note underneath. */
function Tile({ item, onOpen }: { item: GalleryItem; onOpen: (el: HTMLElement) => void }) {
  const { width, height } = item.photo.src;
  return (
    <button
      type="button"
      data-flip-id={item.id}
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`${item.name}: ${item.note}. Open larger`}
      className="gl-item group block w-full cursor-zoom-in text-left"
    >
      <span className="gl-media relative block overflow-hidden rounded-[8px] bg-[#efe3cc]" style={{ aspectRatio: `${width} / ${height}` }}>
        <span className="gl-zoom absolute inset-0 block">
          <Photo
            photo={item.photo}
            sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 50vw"
            className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        </span>
        <span className="label absolute top-3 left-3 rounded-[4px] bg-white px-2 py-1 text-[10px] text-red shadow-[0_4px_10px_-4px_rgba(22,22,22,0.25)] max-md:hidden">
          {codeOf(item)}
        </span>
        <span className="absolute right-3 bottom-3 grid h-10 w-10 scale-75 place-items-center rounded-full bg-red text-white opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <Plus className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </span>
      <span className="mt-3 flex items-baseline justify-between gap-3 max-md:mt-2">
        <span className="it text-[clamp(20px,1.75vw,27px)] leading-none max-md:text-[18px]">{item.name}</span>
        <span className="label shrink-0 text-[10px] text-ink/45 max-lg:hidden">{catLabel(item)}</span>
      </span>
      <span className="mt-1.5 block text-[14px] leading-[1.25] text-ink/60 max-md:text-[12px]">{item.note}</span>
    </button>
  );
}
