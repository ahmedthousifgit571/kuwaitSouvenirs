export type PersonaKind = 'hijab' | 'ghutra' | 'short';

/** Flat illustrated portraits for the sample review "photos" on the desktop. */
export default function Persona({ kind, className = '' }: { kind: PersonaKind; className?: string }) {
  if (kind === 'hijab') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden>
        <rect width="120" height="120" fill="#efd9bf" />
        <circle cx="96" cy="22" r="14" fill="#f7e9d6" />
        <path d="M14 120 C18 92 38 82 60 82 C82 82 102 92 106 120 Z" fill="#1f3f6b" />
        <path d="M30 70 C26 36 42 20 60 20 C78 20 94 36 90 70 C88 86 76 96 60 96 C44 96 32 86 30 70 Z" fill="#1f3f6b" />
        <ellipse cx="60" cy="60" rx="20" ry="24" fill="#c8946f" />
        <path d="M40 50 C44 34 76 34 80 50 C72 42 48 42 40 50 Z" fill="#1f3f6b" />
        <circle cx="52" cy="60" r="2.2" fill="#2a1d16" />
        <circle cx="68" cy="60" r="2.2" fill="#2a1d16" />
        <path d="M53 72 Q60 77 67 72" stroke="#7a3b2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'ghutra') {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden>
        <rect width="120" height="120" fill="#cfe3f5" />
        <path d="M12 120 C16 94 36 84 60 84 C84 84 104 94 108 120 Z" fill="#fbfbf8" />
        <path d="M56 84 L60 100 L64 84 Z" fill="#e4e4de" />
        <path d="M26 92 C24 52 34 22 60 22 C86 22 96 52 94 92 L80 96 L80 60 L40 60 L40 96 Z" fill="#fbfbf8" />
        <ellipse cx="60" cy="62" rx="19" ry="23" fill="#b6815f" />
        <path d="M41 66 C42 86 52 92 60 92 C68 92 78 86 79 66 C74 78 68 80 60 80 C52 80 46 78 41 66 Z" fill="#2a1f1a" />
        <path d="M30 40 C36 26 84 26 90 40 L88 46 C80 34 40 34 32 46 Z" fill="#161616" />
        <path d="M33 47 C40 37 80 37 87 47" stroke="#161616" strokeWidth="3" fill="none" />
        <circle cx="52" cy="60" r="2.2" fill="#1d1410" />
        <circle cx="68" cy="60" r="2.2" fill="#1d1410" />
        <path d="M54 74 Q60 78 66 74" stroke="#f2e6dc" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect width="120" height="120" fill="#f4d6d2" />
      <path d="M14 120 C18 94 38 84 60 84 C82 84 102 94 106 120 Z" fill="#cf1830" />
      <path d="M32 72 C26 40 40 22 60 22 C82 22 96 40 88 72 C84 62 82 50 78 44 C66 52 50 50 42 44 C38 52 36 62 32 72 Z" fill="#6b3e26" />
      <rect x="53" y="76" width="14" height="12" rx="4" fill="#e3b08f" />
      <ellipse cx="60" cy="60" rx="19" ry="22" fill="#e9b996" />
      <path d="M40 54 C42 36 78 34 80 54 C74 42 50 40 40 54 Z" fill="#6b3e26" />
      <circle cx="52" cy="61" r="2.2" fill="#3a2418" />
      <circle cx="68" cy="61" r="2.2" fill="#3a2418" />
      <path d="M53 71 Q60 77 67 71" stroke="#a24a3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
