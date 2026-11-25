// Barcode and pixel code for the shipping labels. Both are drawn from the pack code,
// so each label gets its own stable pattern (no randomness between renders).

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function Barcode({ seed, className = '' }: { seed: string; className?: string }) {
  const rnd = hash(seed);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 290) {
    const w = 1 + Math.floor(rnd() * 4) * 1.6;
    if (rnd() > 0.32) bars.push({ x, w });
    x += w + 1.4 + Math.floor(rnd() * 3);
  }
  return (
    <svg viewBox="0 0 294 48" preserveAspectRatio="none" className={className} aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} width={b.w} height="48" fill="currentColor" />
      ))}
    </svg>
  );
}

export function PixelCode({ seed, className = '' }: { seed: string; className?: string }) {
  const rnd = hash(seed + 'px');
  const N = 11;
  const cells: [number, number][] = [];
  const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > N - 4) || (r > N - 4 && c < 3);
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (finder(r, c)) {
        // 3x3 corner markers: solid, like a scannable code's finder squares
        cells.push([r, c]);
      } else if (rnd() > 0.52) cells.push([r, c]);
    }
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className={className} shapeRendering="crispEdges" aria-hidden>
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}
