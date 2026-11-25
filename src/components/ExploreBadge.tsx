import { ArrowUpRight } from 'lucide-react';
import { useId } from 'react';

/**
 * "• • • EXPLORE MORE" set round a circle, slowly turning, around a red arrow disc.
 * Text on an SVG path stands in for the reference's CircleType.
 */
export default function ExploreBadge({ label, href, className = '' }: { label: string; href: string; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const word = label
    .toUpperCase()
    .split(' ')
    .map((w) => w.split('').join(' '))
    .join('   ');
  const text = `• • •  ${word}  • • •  ${word}  `;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={`group block h-[148px] w-[148px] text-red ${className}`}>
      <svg viewBox="0 0 148 148" className="absolute inset-0 h-full w-full animate-[spin_16s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={id} d="M74 74 m-63 0 a63 63 0 1 1 126 0 a63 63 0 1 1 -126 0" />
        </defs>
        <text className="font-mono text-[13px] font-semibold" fill="currentColor" stroke="#fff" strokeWidth="3" strokeLinejoin="round" style={{ paintOrder: 'stroke', whiteSpace: 'pre' }}>
          <textPath href={`#${id}`} textLength={2 * Math.PI * 63 - 4} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[39px] flex items-center justify-center rounded-full bg-red text-white transition-transform duration-300 group-hover:scale-110">
        <ArrowUpRight className="h-7 w-7" strokeWidth={1.75} />
      </span>
    </a>
  );
}
