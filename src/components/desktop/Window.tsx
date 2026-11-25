'use client';

import { AnimatePresence, motion, useDragControls, useMotionValue } from 'framer-motion';
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';

export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** The three title-bar controls: red close circle, grey hexagon, grey diamond. */
export function WindowDots({ onClose, size = 12 }: { onClose?: () => void; size?: number }) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.7 }}>
      <button
        type="button"
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Close window"
        className="relative rounded-full bg-red transition-transform before:absolute before:-inset-2.5 before:content-[''] hover:scale-110"
        style={{ width: size, height: size }}
      />
      <svg viewBox="0 0 8 8" style={{ width: size, height: size }} className="fill-[#c9c9c9]" aria-hidden>
        <path d="M4 0 L7.5 2 V6 L4 8 L0.5 6 V2 Z" />
      </svg>
      <svg viewBox="0 0 8 8" style={{ width: size, height: size }} className="fill-[#c9c9c9]" aria-hidden>
        <path d="M4 0 L8 4 L4 8 L0 4 Z" />
      </svg>
    </div>
  );
}

type Props = {
  title: string;
  open: boolean;
  z: number;
  onFocus: () => void;
  onClose: () => void;
  bounds: RefObject<HTMLElement | null>;
  /** Centre of the icon it opens from, relative to the desktop. */
  from: () => { x: number; y: number } | null;
  place: { left: string; top: string; width: number; height?: number };
  phone?: boolean;
  bodyClassName?: string;
  children: ReactNode;
};

/**
 * A desktop window: it grows out of its icon, drags by the title bar, comes to the front
 * when touched, and shrinks back into the icon when closed. On phones it opens as a sheet.
 */
export default function Window({ title, open, z, onFocus, onClose, bounds, from, place, phone, bodyClassName = '', children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Point the scale animation at the icon, both on the way in and on the way out.
  const aim = () => {
    const el = ref.current;
    const p = from();
    if (!el || !p) return;
    el.style.transformOrigin = `${p.x - el.offsetLeft - x.get()}px ${p.y - el.offsetTop - y.get()}px`;
  };
  useLayoutEffect(() => {
    if (open) aim();
  });

  const close = () => {
    aim();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-label={title}
          drag={!phone}
          dragControls={controls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={bounds}
          onPointerDown={onFocus}
          initial={{ scale: 0.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.04, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE, opacity: { duration: 0.25 } }}
          className={`absolute flex flex-col bg-white px-2 pb-2 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.55)] ${
            phone ? 'inset-x-3 bottom-[76px] mx-auto max-h-[72%] max-w-[460px] short:bottom-[52px] short:max-h-[78%]' : ''
          }`}
          style={phone ? { x, y, zIndex: z } : { x, y, zIndex: z, left: place.left, top: place.top, width: place.width, height: place.height }}
        >
          <div
            className={`relative flex h-9 shrink-0 items-center select-none ${phone ? '' : 'cursor-grab touch-none active:cursor-grabbing'}`}
            onPointerDown={(e) => !phone && controls.start(e)}
          >
            <WindowDots onClose={close} />
            <p className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold whitespace-nowrap text-red">{title}</p>
          </div>
          <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
