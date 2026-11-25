'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gallery, type GalleryItem } from '@/content/site';
import { waLink } from '@/lib/whatsapp';

type Props = {
  items: GalleryItem[];
  index: number;
  codeOf: (item: GalleryItem) => string;
  catLabel: (item: GalleryItem) => string;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const WIPE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const pad = (n: number) => String(n).padStart(2, '0');

// Photos slide in from the side you are heading to.
const slide: Variants = {
  enter: (d: number) => ({ x: d * 90, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: OUT } },
  exit: (d: number) => ({ x: d * -90, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } }),
};

/**
 * A gallery piece full screen: code, counter and close along the top, the photo in the middle
 * (swipe, arrow buttons or arrow keys to move), and its name with a WhatsApp "ask" button below.
 * Wipes in like the menu; Lenis pauses while it is open.
 */
export default function Lightbox({ items, index, codeOf, catLabel, onIndex, onClose }: Props) {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(1);
  const n = items.length;
  const item = items[index];
  const go = (d: number) => {
    setDir(d);
    onIndex((index + d + n) % n);
  };

  useEffect(() => {
    lenis?.stop();
    closeBtn.current?.focus({ preventScroll: true });
    return () => lenis?.start();
  }, [lenis]);

  // Re-bound every render so the handlers always see the current index.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const code = codeOf(item);
  const ask = waLink(gallery.askMessage.replace('{name}', item.name).replace('{code}', code));
  const neighbours = n > 1 ? [items[(index + 1) % n], items[(index - 1 + n) % n]] : [];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${gallery.pill}: ${item.name}`}
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex flex-col bg-grey text-red"
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
      transition={{ duration: reduce ? 0 : 0.6, ease: WIPE }}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-5">
        <p className="label w-1/3 text-[12px] leading-[1.5]">
          <span className="font-semibold">{code}</span>
          <br />
          <span className="text-ink/50">{catLabel(item)}</span>
        </p>
        <p className="label text-[12px] tabular-nums" aria-live="polite">
          {pad(index + 1)} / {pad(n)}
        </p>
        <div className="flex w-1/3 justify-end">
          <button ref={closeBtn} type="button" onClick={onClose} className="label -m-3 rounded-[6px] p-3 text-[12px] font-semibold outline-red focus-visible:outline-2">
            [ {gallery.close} ]
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-6 md:px-28">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={item.id}
            custom={dir}
            variants={reduce ? undefined : slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) go(1);
              else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
            }}
            className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <Image
              src={item.photo.src}
              alt={item.photo.alt}
              fill
              sizes="(min-width: 768px) 80vw, 100vw"
              placeholder="blur"
              draggable={false}
              className="pointer-events-none object-contain drop-shadow-[0_24px_40px_rgba(22,22,22,0.18)] select-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Side arrows from md up; phones get them beside the ask button. */}
        {n > 1 && (
          <>
            <RoundButton label={gallery.prev} onClick={() => go(-1)} className="absolute top-1/2 left-6 -translate-y-1/2 max-md:hidden">
              <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
            </RoundButton>
            <RoundButton label={gallery.next} onClick={() => go(1)} className="absolute top-1/2 right-6 -translate-y-1/2 max-md:hidden">
              <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
            </RoundButton>
          </>
        )}

        {/* Warm the cache for the pieces either side, so moving on is instant. */}
        <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
          {neighbours.map((p) => (
            <Image key={p.id} src={p.photo.src} alt="" width={64} height={64} sizes="(min-width: 768px) 80vw, 100vw" loading="eager" />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 border-t border-red/20 px-5 pt-5 pb-6 max-md:flex-col max-md:items-stretch max-md:gap-4 max-md:pt-4">
        <div className="min-w-0">
          <p className="it text-[clamp(34px,3.4vw,54px)] leading-none">{item.name}</p>
          <p className="mt-2 text-[15px] text-ink/60">{item.note}</p>
        </div>
        <div className="flex items-center gap-3">
          {n > 1 && (
            <RoundButton label={gallery.prev} onClick={() => go(-1)} className="md:hidden">
              <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
            </RoundButton>
          )}
          <a
            href={ask}
            target="_blank"
            rel="noreferrer"
            className="it flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-red px-8 text-[22px] whitespace-nowrap text-white transition-transform duration-300 hover:scale-[1.03] max-md:h-12 max-md:px-4 max-md:text-[19px]"
          >
            {gallery.ask}
            <ArrowUpRight className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          </a>
          {n > 1 && (
            <RoundButton label={gallery.next} onClick={() => go(1)} className="md:hidden">
              <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
            </RoundButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RoundButton({ label, onClick, className = '', children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-red bg-white transition-colors duration-300 hover:bg-red hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}
