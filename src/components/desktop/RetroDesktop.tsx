'use client';

import Image from 'next/image';
import { useRef, useState, type ReactNode, type RefObject } from 'react';
import Persona from '@/components/art/Persona';
import { RichText } from '@/components/ui';
import { desktop, reviews } from '@/content/site';
import { nextZ } from '@/lib/zstack';
import DesktopIcon from './DesktopIcon';
import FaqEditor from './FaqEditor';
import Taskbar from './Taskbar';
import Window from './Window';

type Props = {
  phone: boolean;
  /** The Packs.html window, rendered inside the desktop so it stacks with the others. */
  children: ReactNode;
  packsIconRef: RefObject<HTMLButtonElement | null>;
  onPacksIcon: () => void;
  deskRef: RefObject<HTMLDivElement | null>;
};

/**
 * A retro desktop on a sky-over-dunes wallpaper: review photos, a Reviews folder and FAQ.md
 * down the right, the live time bottom right. Every icon opens a draggable window.
 */
export default function RetroDesktop({ phone, children, packsIconRef, onPacksIcon, deskRef }: Props) {
  const icons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [z, setZ] = useState<Record<string, number>>({});

  const focus = (id: string) => setZ((s) => ({ ...s, [id]: nextZ() }));
  const show = (id: string) => {
    setOpen((o) => ({ ...o, [id]: true }));
    focus(id);
  };
  const hide = (id: string) => setOpen((o) => ({ ...o, [id]: false }));
  const from = (id: string) => () => {
    const icon = icons.current[id];
    const desk = deskRef.current;
    if (!icon || !desk) return null;
    const r = icon.getBoundingClientRect();
    const d = desk.getBoundingClientRect();
    return { x: r.left + r.width / 2 - d.left, y: r.top + 34 - d.top };
  };
  const win = (id: string) => ({
    open: !!open[id],
    z: z[id] ?? 31,
    onFocus: () => focus(id),
    onClose: () => hide(id),
    from: from(id),
    phone,
  });

  return (
    <div ref={deskRef} className="desk absolute inset-0 overflow-hidden bg-[#3a78d0] select-none">
      <Image src={desktop.wallpaper} alt="" fill sizes="100vw" className="object-cover select-none" draggable={false} />

      <div
        className={
          phone
            ? 'absolute inset-x-2 top-[76px] grid grid-cols-4 justify-items-center gap-y-2 sm:grid-cols-6 short:top-[60px]'
            : 'absolute top-[96px] right-6 flex flex-col items-center gap-2'
        }
      >
        <DesktopIcon ref={packsIconRef} label={desktop.packsFile} kind={{ type: 'doc', ext: 'HTML', accent: true }} onOpen={onPacksIcon} />
        {reviews.items.map((r, i) => (
          <DesktopIcon
            key={r.file}
            ref={(el) => {
              icons.current[`review-${i}`] = el;
            }}
            label={r.file}
            kind={{ type: 'image', persona: r.persona }}
            onOpen={() => show(`review-${i}`)}
          />
        ))}
        <DesktopIcon
          ref={(el) => {
            icons.current.folder = el;
          }}
          label={desktop.reviewsFolder}
          kind={{ type: 'folder' }}
          onOpen={() => show('folder')}
        />
        <DesktopIcon
          ref={(el) => {
            icons.current.faq = el;
          }}
          label={desktop.faqFile}
          kind={{ type: 'doc', ext: 'MD' }}
          onOpen={() => show('faq')}
        />
      </div>

      <Taskbar />

      {children}

      <Window bounds={deskRef} title={desktop.faqFile} place={{ left: '55%', top: '20%', width: 410, height: 540 }} bodyClassName="overflow-hidden" {...win('faq')}>
        <FaqEditor />
      </Window>

      <Window bounds={deskRef} title={desktop.reviewsFolder} place={{ left: '36%', top: '16%', width: 390 }} {...win('folder')}>
        <div className="bg-[#f3f2f0] p-4">
          <div className="grid grid-cols-3 gap-2">
            {reviews.items.map((r, i) => (
              <button key={r.file} type="button" onClick={() => show(`review-${i}`)} className="flex flex-col items-center gap-1.5 rounded-[6px] p-2 hover:bg-white">
                <span className="block h-[64px] w-[64px] overflow-hidden rounded-[6px] border-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
                  <Persona kind={r.persona} className="h-full w-full" />
                </span>
                <span className="text-[13px] font-semibold text-red">{r.file}</span>
              </button>
            ))}
          </div>
          <p className="label mt-3 text-[11px] text-red/60">{reviews.items.length} items</p>
        </div>
      </Window>

      {reviews.items.map((r, i) => (
        <Window key={r.file} bounds={deskRef} title={r.file} place={{ left: `${58 - i * 7}%`, top: `${12 + i * 8}%`, width: 300 }} {...win(`review-${i}`)}>
          <div className="bg-[#f3f2f0] p-3">
            <Persona kind={r.persona} className="aspect-square w-full" />
          </div>
          <p className="mt-3 px-1 text-[15px] leading-[1.25] text-red">
            <RichText value={r.quote} />
          </p>
          <div className="label mt-3 flex justify-between px-1 text-[11px] text-red">
            <span>{r.name}</span>
            {reviews.sample && <span className="opacity-55">Sample review</span>}
          </div>
        </Window>
      ))}
    </div>
  );
}
