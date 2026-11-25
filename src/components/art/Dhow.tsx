/** A traditional Gulf dhow under a lateen sail, drawn in one colour (currentColor). */
export default function Dhow({ className, waves = true }: { className?: string; waves?: boolean }) {
  return (
    <svg viewBox={waves ? '0 0 240 170' : '0 0 240 141'} className={className} aria-hidden fill="currentColor">
      {/* lateen sail hanging from the long raked yard */}
      <path d="M40 80 L216 6 L134 104 Z" />
      <path d="M36 83 L222 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* mast, raked forward */}
      <path d="M118 104 L124 22 L129 22 L125 104 Z" />
      <path d="M126 22 L126 8 L142 14 L126 18 Z" />
      {/* hull: high square stern on the left, long pointed bow on the right */}
      <path d="M10 92 L38 92 L42 104 L202 104 L236 84 L216 120 Q200 138 168 140 L68 140 Q38 138 24 120 Z" />
      <path d="M44 114 H206" stroke="var(--art-bg, #fff)" strokeWidth="2.5" opacity="0.55" />
      <path d="M52 124 H196" stroke="var(--art-bg, #fff)" strokeWidth="1.5" opacity="0.35" />
      {waves && (
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M4 152 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
          <path d="M28 164 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" opacity="0.55" />
        </g>
      )}
    </svg>
  );
}
