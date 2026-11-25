'use client';

import { forwardRef, type ReactNode } from 'react';
import Persona, { type PersonaKind } from '@/components/art/Persona';

type Kind = { type: 'image'; persona: PersonaKind } | { type: 'folder' } | { type: 'doc'; ext: string; accent?: boolean };

function Glyph({ kind }: { kind: Kind }): ReactNode {
  if (kind.type === 'image')
    return (
      <span className="block h-[62px] w-[62px] overflow-hidden rounded-[6px] border-[3px] border-white bg-white shadow-[0_6px_14px_rgba(0,0,0,0.3)]">
        <Persona kind={kind.persona} className="h-full w-full" />
      </span>
    );
  if (kind.type === 'folder')
    return (
      <svg viewBox="0 0 64 52" className="h-[54px] w-[66px] drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]" aria-hidden>
        <path d="M2 8 Q2 4 6 4 H24 L30 10 H58 Q62 10 62 14 V18 H2 Z" fill="#3d93e6" />
        <path d="M2 16 H62 V46 Q62 50 58 50 H6 Q2 50 2 46 Z" fill="#63b0f7" />
        <path d="M2 16 H62 V20 H2 Z" fill="#8cc8fb" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 60" className="h-[60px] w-[48px] drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]" aria-hidden>
      <path d="M2 2 H32 L46 16 V58 H2 Z" fill="#fff" />
      <path d="M32 2 V16 H46 Z" fill="#dcdcdc" />
      <text x="24" y="44" textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize="9" fill={kind.accent ? '#cf1830' : '#9a9a9a'}>
        {kind.ext}
      </text>
    </svg>
  );
}

type Props = { label: string; kind: Kind; onOpen: () => void; className?: string };

/** A desktop icon with its file name underneath. */
const DesktopIcon = forwardRef<HTMLButtonElement, Props>(function DesktopIcon({ label, kind, onOpen, className = '' }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className={`group flex w-[96px] flex-col items-center gap-1.5 rounded-[6px] p-1.5 text-center transition-colors hover:bg-white/20 focus-visible:bg-white/25 focus-visible:outline-none ${className}`}
    >
      <span className="flex h-[64px] items-end justify-center">
        <Glyph kind={kind} />
      </span>
      <span className="text-[14px] leading-tight font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">{label}</span>
    </button>
  );
});

export default DesktopIcon;
