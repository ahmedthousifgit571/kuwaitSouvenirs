import { useId } from 'react';

type Props = {
  className?: string;
  /** base, accent, dark, light */
  colors?: [string, string, string, string];
  scale?: number;
  /** Turn the weave (e.g. 90 for a runner hanging down, where the bands run lengthwise). */
  rotate?: number;
  /**
   * Draw into a box of exactly this many units (width, height) and stretch it to the element,
   * so a caller that knows its own proportions gets bands of a fixed size. Default: a 400 x 400
   * box that covers the element.
   */
  box?: [number, number];
};

/**
 * Sadu, the Bedouin weave: banded stripes with rows of "teeth" and diamonds.
 * Drawn as a repeating SVG pattern so it fills any box.
 */
export default function Sadu({ className, colors = ['#cf1830', '#161616', '#f4ead7', '#ffffff'], scale = 1, rotate = 0, box }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [base, dark, light, white] = colors;
  const [w, h] = box ?? [400, 400];
  return (
    <svg className={className} aria-hidden preserveAspectRatio={box ? 'none' : 'xMidYMid slice'} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern id={id} width="48" height="96" patternUnits="userSpaceOnUse" patternTransform={`${rotate ? `rotate(${rotate}) ` : ''}scale(${scale})`}>
          <rect width="48" height="96" fill={base} />
          {/* dark band with light teeth */}
          <rect y="0" width="48" height="22" fill={dark} />
          <path d="M0 22 L6 14 L12 22 L18 14 L24 22 L30 14 L36 22 L42 14 L48 22 Z" fill={light} />
          {/* diamond row */}
          <rect y="28" width="48" height="26" fill={light} />
          <path d="M24 30 L36 41 L24 52 L12 41 Z" fill={base} />
          <path d="M24 35 L30 41 L24 47 L18 41 Z" fill={dark} />
          <path d="M0 30 L12 41 L0 52 Z M48 30 L36 41 L48 52 Z" fill={dark} />
          {/* thin stripes */}
          <rect y="58" width="48" height="4" fill={dark} />
          <rect y="64" width="48" height="2" fill={white} />
          {/* chequer teeth */}
          <path d="M0 72 H8 V80 H0 Z M16 72 H24 V80 H16 Z M32 72 H40 V80 H32 Z M8 80 H16 V88 H8 Z M24 80 H32 V88 H24 Z M40 80 H48 V88 H40 Z" fill={dark} />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
    </svg>
  );
}
