// Hand-built stencil letterforms for the SOUVENIR / AND MORE wordmark.
// Each letter is a few slab pieces plus "cuts": hairline slits masked out of the
// pieces, the way a stencil bridges its counters. Coordinates are per letter,
// with the cap height H and stroke S below.

export const H = 160; // cap height
export const S = 34; // vertical stroke
const C = 5; // stencil slit
export const GAP = 30; // space between letters
export const LINE_GAP = 22; // space between the two lines
export const WIDTH = 1400;
export const HEIGHT = H * 2 + LINE_GAP;

export type Piece = { d: string; stroke?: boolean };
export type Glyph = { char: string; w: number; pieces: Piece[]; cuts: string[] };

const n = (v: number) => Math.round(v * 100) / 100;
const rect = (x: number, y: number, w: number, h: number) => `M${n(x)} ${n(y)}H${n(x + w)}V${n(y + h)}H${n(x)}Z`;
const poly = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L') + 'Z';

const P = S * 1.12; // perpendicular weight of a diagonal, a touch heavier than the stems so it reads even

/**
 * Half of a diagonal band's horizontal width, so the band measures P across its slope.
 * `span` is the horizontal run between its outer edges, `rise` its height.
 */
function half(span: number, rise: number) {
  let h = P / 2;
  for (let i = 0; i < 8; i++) h = ((P / 2) * Math.hypot(span - 2 * h, rise)) / rise;
  return h;
}

/** A diagonal band along the centreline (x0,y0) to (x1,y1) with horizontal half-width h. */
const band = (x0: number, y0: number, x1: number, y1: number, h: number) =>
  poly([[x0 - h, y0], [x0 + h, y0], [x1 + h, y1], [x1 - h, y1]]);

function K(w: number): Glyph {
  const x0 = S + C;
  const yArm = H * 0.6;
  const yLeg = H * 0.4;
  const ha = half(w - x0, yArm);
  const hl = half(w - x0, H - yLeg);
  return {
    char: 'K',
    w,
    pieces: [
      { d: rect(0, 0, S, H) },
      { d: band(w - ha, 0, x0 + ha, yArm, ha) },
      { d: band(x0 + hl, yLeg, w - hl, H, hl) },
      // fills the notch where arm and leg cross, so the K meets the stem with a flat edge
      { d: rect(x0, yLeg, Math.max(ha, hl) * 1.6, yArm - yLeg) },
    ],
    cuts: [],
  };
}

function U(w: number): Glyph {
  const r = (w - S) / 2;
  const y = H - S / 2 - r;
  return {
    char: 'U',
    w,
    pieces: [{ d: `M${n(S / 2)} 0V${n(y)}A${n(r)} ${n(r)} 0 0 0 ${n(w - S / 2)} ${n(y)}V0`, stroke: true }],
    cuts: [rect(w / 2 - C / 2, H - S - 6, C, S + 12)],
  };
}

function W(w: number): Glyph {
  const q1 = w / 4;
  const m = w / 2;
  const q3 = (3 * w) / 4;
  const h = half(q1, H);
  return {
    char: 'W',
    w,
    pieces: [
      { d: band(h, 0, q1 - h, H, h) },
      { d: band(m - h, 0, q1 + h, H, h) },
      { d: band(m + h, 0, q3 - h, H, h) },
      { d: band(w - h, 0, q3 + h, H, h) },
    ],
    cuts: [rect(q1 - C / 2, H - 48, C, 52), rect(m - C / 2, -4, C, 52), rect(q3 - C / 2, H - 48, C, 52)],
  };
}

function A(w: number): Glyph {
  const m = w / 2;
  const h = half(m, H);
  const yb = H * 0.58;
  const hb = 28;
  // inner edge of the left leg runs from (2h, H) up to (m, 0)
  const xl = (y: number) => 2 * h + ((m - 2 * h) * (H - y)) / H;
  const xr = (y: number) => w - xl(y);
  return {
    char: 'A',
    w,
    pieces: [
      { d: band(m - h, 0, h, H, h) },
      { d: band(m + h, 0, w - h, H, h) },
      { d: poly([[xl(yb) + C, yb], [xr(yb) - C, yb], [xr(yb + hb) - C, yb + hb], [xl(yb + hb) + C, yb + hb]]) },
    ],
    cuts: [rect(m - C / 2, -4, C, 44)],
  };
}

function I(): Glyph {
  return { char: 'I', w: S, pieces: [{ d: rect(0, 0, S, H) }], cuts: [] };
}

function Tee(w: number): Glyph {
  const m = w / 2;
  return {
    char: 'T',
    w,
    pieces: [{ d: rect(0, 0, w, S) }, { d: rect(m - S / 2, S + C, S, H - S - C) }],
    cuts: [],
  };
}

function Ess(w: number): Glyph {
  const rx = (w - S) / 2;
  const ry = (H - S) / 4;
  const cx = w / 2;
  const top = S / 2 + ry;
  const bot = H / 2 + ry;
  return {
    char: 'S',
    w,
    pieces: [
      {
        d:
          `M${n(w - S / 2)} ${n(top)}A${n(rx)} ${n(ry)} 0 0 0 ${n(S / 2)} ${n(top)}` +
          `A${n(rx)} ${n(ry)} 0 0 0 ${n(cx)} ${n(H / 2)}` +
          `A${n(rx)} ${n(ry)} 0 0 1 ${n(w - S / 2)} ${n(bot)}` +
          `A${n(rx)} ${n(ry)} 0 0 1 ${n(S / 2)} ${n(bot)}`,
        stroke: true,
      },
    ],
    cuts: [rect(cx - C / 2, H / 2 - S / 2 - 6, C, S + 12)],
  };
}

function ellipse(cx: number, cy: number, rx: number, ry: number) {
  return `M${n(cx - rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(cx + rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(cx - rx)} ${n(cy)}Z`;
}

function O(w: number): Glyph {
  const rx = (w - S) / 2;
  const ry = (H - S) / 2;
  return {
    char: 'O',
    w,
    // Drawn as the round logo stamp in Wordmark; this ring is the fallback shape and sets the width.
    pieces: [{ d: ellipse(w / 2, H / 2, rx, ry), stroke: true }],
    cuts: [rect(w / 2 - C / 2, -4, C, S + 8), rect(w / 2 - C / 2, H - S - 4, C, S + 8)],
  };
}

function V(w: number): Glyph {
  const m = w / 2;
  const h = half(m, H);
  return {
    char: 'V',
    w,
    pieces: [{ d: band(h, 0, m - h, H, h) }, { d: band(w - h, 0, m + h, H, h) }],
    cuts: [rect(m - C / 2, H - 48, C, 52)],
  };
}

function E(w: number): Glyph {
  return {
    char: 'E',
    w,
    pieces: [
      { d: `M0 0H${n(w)}V${S}H${S}V${H - S}H${n(w)}V${H}H0Z` },
      { d: rect(S + C, (H - S) / 2, w * 0.8 - S - C, S) },
    ],
    cuts: [],
  };
}

function N(w: number): Glyph {
  const h = half(w, H);
  const reach = ((S + C) / (w - 2 * h)) * H + 6;
  return {
    char: 'N',
    w,
    pieces: [{ d: rect(0, 0, S, H) }, { d: rect(w - S, 0, S, H) }, { d: band(h, 0, w - h, H, h) }],
    cuts: [rect(S, -4, C, reach + 4), rect(w - S - C, H - reach, C, reach + 4)],
  };
}

function R(w: number): Glyph {
  const hb = H * 0.6;
  const rb = (hb - S) / 2;
  const xl = w * 0.3;
  const hl = half(w - xl, H - hb - C);
  return {
    char: 'R',
    w,
    pieces: [
      { d: rect(0, 0, S, H) },
      { d: `M${n(S + C)} ${n(S / 2)}H${n(w - S / 2 - rb)}A${n(rb)} ${n(rb)} 0 0 1 ${n(w - S / 2 - rb)} ${n(hb - S / 2)}H${n(S + C)}`, stroke: true },
      { d: band(xl + hl, hb + C, w - hl, H, hl) },
    ],
    cuts: [],
  };
}

function D(w: number): Glyph {
  // Stem, a hairline slit, then a bowl that rounds off on the right.
  const r = (H - S) / 2;
  return {
    char: 'D',
    w,
    pieces: [
      { d: rect(0, 0, S, H) },
      {
        d: `M${n(S + C)} ${n(S / 2)}H${n(w - S / 2 - r)}A${n(r)} ${n(r)} 0 0 1 ${n(w - S / 2 - r)} ${n(H - S / 2)}H${n(S + C)}`,
        stroke: true,
      },
    ],
    cuts: [],
  };
}

function M(w: number): Glyph {
  // Two stems with a V hung between them, split from the stems and at the vertex like the N.
  const m = w / 2;
  const x0 = S - 4;
  const h = half(m - x0, H);
  const reach = ((C + 4) / (m - x0 - 2 * h)) * H + 6;
  return {
    char: 'M',
    w,
    pieces: [
      { d: rect(0, 0, S, H) },
      { d: rect(w - S, 0, S, H) },
      { d: band(x0 + h, 0, m - h, H, h) },
      { d: band(w - x0 - h, 0, m + h, H, h) },
    ],
    cuts: [rect(S, -4, C, reach + 4), rect(w - S - C, -4, C, reach + 4), rect(m - C / 2, H - 48, C, 52)],
  };
}

const SPACE = 70; // word space on a line, on top of the normal letter gap

// Letter widths flex so both lines run the full 1400 units with the same gap.
function layout(glyphs: Glyph[]) {
  let x = 0;
  return glyphs.map((g) => {
    const placed = { ...g, x };
    x += g.w + GAP;
    return placed;
  });
}

function fit(spec: [string, number][]): Glyph[] {
  const fixed = spec.reduce((sum, [c]) => sum + (c === 'I' ? S : c === ' ' ? SPACE : 0), 0);
  const free = WIDTH - GAP * (spec.length - 1) - fixed;
  const total = spec.reduce((sum, [c, p]) => (c === 'I' || c === ' ' ? sum : sum + p), 0);
  const unit = free / total;
  return spec.map(([c, p]) => {
    const w = p * unit;
    switch (c) {
      case ' ': return { char: ' ', w: SPACE, pieces: [], cuts: [] };
      case 'K': return K(w);
      case 'U': return U(w);
      case 'W': return W(w);
      case 'A': return A(w);
      case 'I': return I();
      case 'T': return Tee(w);
      case 'S': return Ess(w);
      case 'O': return O(w);
      case 'V': return V(w);
      case 'E': return E(w);
      case 'N': return N(w);
      case 'R': return R(w);
      case 'D': return D(w);
      case 'M': return M(w);
      default: throw new Error(`No glyph for ${c}`);
    }
  });
}

// SOUVENIR over AND MORE (the shop is Souvenir & More; the giant mark spells out "AND"
// so both lines carry the same letter proportions).
export const LINES = [
  layout(fit([['S', 0.95], ['O', 1.05], ['U', 1], ['V', 1.05], ['E', 0.85], ['N', 1.05], ['I', 0], ['R', 0.95]])),
  layout(fit([['A', 1.15], ['N', 1.05], ['D', 1.05], [' ', 0], ['M', 1.4], ['O', 1.05], ['R', 0.95], ['E', 0.85]])),
];
