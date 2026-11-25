// The rolling stone: a regular polygon that gains sides as it rolls (4 → 12) and then
// rounds into a circle, with the brand logo seen through it, cropped while it is rough and
// whole once it is round. It rolls on a road of catenary arches, the curve on which a polygon
// wheel rolls with its axle level; each arch is one side long. As the sides multiply the
// arches flatten, and once the shape is round the road is a straight line.
// Everything is drawn in white, so it only shows where it crosses the red cards.

const N_MIN = 4;
const N_MAX = 12;
const PHASE2 = 0.3; // share of the morph spent adding sides; the rest rounds the corners
const SAMPLES = 220;
// The stamp's outer ring spans ~96% of the logo image, so draw it a touch larger than the circle.
const LOGO_FIT = 1.045;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Polar radius of a regular n-gon with a vertex at angle 0. */
function polyR(n: number, R: number, phi: number) {
  const seg = (Math.PI * 2) / n;
  const f = ((phi % seg) + seg) % seg;
  return (R * Math.cos(Math.PI / n)) / Math.cos(f - Math.PI / n);
}

export type RollGeometry = {
  W: number;
  H: number;
  R: number;
  axle: number; // y of the axle while it is a polygon
  xLeft: number;
  xRight: number;
  tEntry: number; // progress at which it starts changing shape
};

export function drawRoll(ctx: CanvasRenderingContext2D, g: RollGeometry, progress: number, logo?: HTMLImageElement | null) {
  const { W, H, R, axle, xLeft, xRight, tEntry } = g;
  const t = clamp01(progress);
  const span = xRight - xLeft;
  const wheelX = lerp(xLeft, xRight, t);

  const tm = smooth(clamp01((t - tEntry) / (1 - tEntry)));
  const tPoly = Math.min(tm / PHASE2, 1);
  const circT = smooth(clamp01((tm - PHASE2) / (1 - PHASE2)));

  const nf = N_MIN + tPoly * (N_MAX - N_MIN);
  const nLo = Math.floor(nf);
  const nHi = Math.min(N_MAX, nLo + 1);
  const frac = nf - nLo;
  const side = lerp(2 * R * Math.sin(Math.PI / nLo), 2 * R * Math.sin(Math.PI / nHi), frac);
  const apo = lerp(R * Math.cos(Math.PI / nLo), R * Math.cos(Math.PI / nHi), frac);

  const roadY = axle + apo; // top of each arch
  const axleY = roadY - (apo + (R - apo) * circT);

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Road: one catenary arch per side, flattening into a line as the shape rounds.
  const first = xLeft + Math.ceil((-xLeft - side) / side) * side;
  const arches = Math.ceil((W + side * 2) / side) + 2;
  const steps = Math.max(40, Math.round(side / 2));
  ctx.beginPath();
  for (let k = 0; k < arches; k++) {
    const peak = first + k * side;
    for (let i = 0; i <= steps; i++) {
      const lx = -side / 2 + (i / steps) * side;
      const cy = roadY + apo * Math.cosh(lx / apo) - apo;
      const y = lerp(cy, roadY, circT);
      if (k === 0 && i === 0) ctx.moveTo(peak + lx, y);
      else ctx.lineTo(peak + lx, y);
    }
  }
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Axle guide first, so the logo rolls over it rather than under it.
  ctx.save();
  ctx.setLineDash([5, 10]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, axleY);
  ctx.lineTo(W, axleY);
  ctx.stroke();
  ctx.restore();

  // The shape, rotated by the distance it has rolled.
  const rotation = ((t * span) / side) * ((Math.PI * 2) / nf) - Math.PI / nf;
  // Where the roll ends up at t = 1, so the logo can ease back to upright as it rounds off.
  const sideEnd = 2 * R * Math.sin(Math.PI / N_MAX);
  let settle = (((span / sideEnd) * ((Math.PI * 2) / N_MAX) - Math.PI / N_MAX) % (Math.PI * 2)) + Math.PI * 2;
  settle = (settle % (Math.PI * 2)) - (settle % (Math.PI * 2) > Math.PI ? Math.PI * 2 : 0);
  const logoRot = rotation - settle * circT;

  ctx.save();
  ctx.translate(wheelX, axleY);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i <= SAMPLES; i++) {
    const th = (i / SAMPLES) * Math.PI * 2;
    const phi = th - Math.PI / 2; // vertex pointing down before rotation
    const r = lerp(lerp(polyR(nLo, R, phi), polyR(nHi, R, phi), frac), R, circT);
    const x = Math.cos(th) * r;
    const y = Math.sin(th) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const showLogo = !!logo && logo.complete && logo.naturalWidth > 0;
  if (showLogo) {
    // The logo seen through the shape: cropped while it is a rough polygon, whole once round.
    ctx.save();
    ctx.clip();
    ctx.rotate(logoRot - rotation);
    const D = 2 * R * LOGO_FIT;
    ctx.drawImage(logo!, -D / 2, -D / 2, D, D);
    // A soft pearl sheen, top left, as it rounds off.
    const sheen = clamp01((circT - 0.5) / 0.5);
    if (sheen > 0) {
      ctx.rotate(-logoRot);
      const grad = ctx.createRadialGradient(-R * 0.4, -R * 0.45, 0, -R * 0.2, -R * 0.2, R * 1.1);
      grad.addColorStop(0, `rgba(255,255,255,${0.4 * sheen})`);
      grad.addColorStop(0.45, `rgba(255,255,255,${0.08 * sheen})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(-R, -R, R * 2, R * 2);
    }
    ctx.restore();
  }
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (!showLogo) {
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.restore();
}
