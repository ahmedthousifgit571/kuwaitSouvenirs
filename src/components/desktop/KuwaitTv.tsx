import { useId, type CSSProperties } from 'react';
import Sadu from '@/components/art/Sadu';
import { brand } from '@/content/site';

/**
 * Shape of the TV around the screen, in "u" units: 1u = `unit` vw, so the whole set scales
 * with the viewport and with the rig's transform. The screen itself is the full viewport.
 * Packs reads this to centre the TV and to round the glass.
 */
export function tvFrame(phone: boolean) {
  // crown: how far the dallah and antennas rise above the cabinet, so the TV can be fitted whole.
  return phone
    ? { unit: 2.3, side: 4, top: 10, bottom: 16, legs: 4.5, radius: 3.2, crown: 12 }
    : { unit: 1, side: 7, top: 10, bottom: 19, legs: 7, radius: 3, crown: 16 };
}

const u = (n: number) => `calc(var(--u) * ${n})`;
const BRASS = 'linear-gradient(135deg,#6f4a12 0%,#b98a30 22%,#f6dc8e 42%,#fff4c8 50%,#d4a446 64%,#8a5e17 86%,#5c3c0c 100%)';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const ar = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[+d]);
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A 1970s Kuwaiti family TV, built around the screen: a walnut cabinet on splayed legs, a Sadu
 * runner draped over the top with its tail hanging down the front, a brass dallah and two finjan
 * cups on the cloth, rabbit-ear antennas flying a small Kuwait flag, and a control strip with a
 * slatted speaker, the shop's stamp in brass, dials and preset keys in Arabic numerals.
 * Everything sits outside the screen's rectangle, so none of it shows until the rig shrinks.
 */
export default function KuwaitTv({ phone }: { phone: boolean }) {
  const f = tvFrame(phone);
  const runner = phone ? 30 : 62; // width of the runner on top, in u (one tassel per u)
  const flap = 6.5; // how far the runner hangs over the front edge, in u
  // The hanging end: its right edge stays 1.1u clear of the screen, so it never shows on the full-screen desktop.
  const tail = phone ? 4 : 7;
  const tailLen = phone ? 16 : 22;
  const weave = 0.42; // Sadu pattern scale: one band repeat is about 4u

  return (
    <div className="pointer-events-none absolute inset-0" style={{ '--u': `${f.unit}vw` } as CSSProperties} aria-hidden>
      {/* floor shadow */}
      <div
        className="absolute"
        style={{
          left: u(-f.side + 1),
          right: u(-f.side + 1),
          top: `calc(100% + ${u(f.bottom + f.legs - 1)})`,
          height: u(2.2),
          background: 'radial-gradient(closest-side, rgba(45,25,10,0.38), rgba(45,25,10,0))',
        }}
      />

      {/* legs: tapered walnut with brass feet, splayed outwards */}
      {[-1, 1].map((s) => (
        <div
          key={s}
          className="absolute"
          style={{
            left: s < 0 ? u(-f.side + (phone ? 4 : 8)) : undefined,
            right: s > 0 ? u(-f.side + (phone ? 4 : 8)) : undefined,
            top: `calc(100% + ${u(f.bottom - 0.4)})`,
            width: u(phone ? 2.6 : 3.4),
            height: u(f.legs + 0.4),
            transformOrigin: '50% 0',
            transform: `rotate(${s * -9}deg)`,
            clipPath: 'polygon(0 0, 100% 0, 74% 100%, 26% 100%)',
            background: `linear-gradient(180deg, transparent 78%, #b98a30 78%, #f3d98c 86%, #8a5e17 100%), linear-gradient(90deg,#3a2010,#6b4024 45%,#4a2a15)`,
          }}
        />
      ))}

      {/* cabinet */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: u(-f.side),
          right: u(-f.side),
          top: u(-f.top),
          bottom: u(-f.bottom),
          borderRadius: u(phone ? 2.6 : 3),
          background: "url('/media/wood-walnut.webp') center / cover, #5f3720",
          boxShadow: `inset 0 ${u(0.45)} ${u(0.5)} rgba(255,226,190,0.28), inset 0 ${u(-0.8)} ${u(1.4)} rgba(20,8,0,0.5), inset ${u(0.5)} 0 ${u(0.9)} rgba(255,220,180,0.1), inset ${u(-0.5)} 0 ${u(0.9)} rgba(20,8,0,0.3), 0 ${u(2.6)} ${u(3.6)} ${u(-1.4)} rgba(45,22,6,0.5)`,
        }}
      >
        {/* lacquer sheen, and the screen's glow on the wood */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 34%, rgba(150,195,255,0.12), rgba(150,195,255,0) 70%), linear-gradient(180deg, rgba(255,230,200,0.14), rgba(255,230,200,0) 24%, rgba(0,0,0,0) 70%, rgba(20,8,0,0.22))',
          }}
        />
        {/* carved line around the front panel */}
        <div
          className="absolute"
          style={{
            inset: u(0.7),
            borderRadius: u(phone ? 2 : 2.4),
            border: `${u(0.1)} solid rgba(25,10,2,0.45)`,
            boxShadow: `0 ${u(0.08)} 0 rgba(255,220,180,0.16), inset 0 ${u(0.08)} 0 rgba(255,220,180,0.12)`,
          }}
        />
      </div>

      {/* brass bead and the dark tube surround the glass sits in */}
      <div
        className="absolute"
        style={{
          inset: u(-1.5),
          borderRadius: u(f.radius + 1.5),
          background: BRASS,
          boxShadow: `0 ${u(0.25)} ${u(0.5)} rgba(20,8,0,0.5), inset 0 0 0 ${u(0.06)} rgba(90,55,10,0.7)`,
        }}
      />
      <div
        className="absolute"
        style={{
          inset: u(-1.1),
          borderRadius: u(f.radius + 1.1),
          background: 'radial-gradient(ellipse at 50% 40%, #2a1d14, #0d0906 75%)',
          boxShadow: `inset 0 0 ${u(1.1)} rgba(110,170,240,0.28), inset 0 ${u(0.35)} ${u(0.7)} rgba(0,0,0,0.8)`,
        }}
      />

      {/* control strip under the screen */}
      <div
        className="@container-[size] absolute flex items-stretch"
        style={{ left: u(-1.5), right: u(-1.5), top: `calc(100% + ${u(2.6)})`, bottom: u(-(f.bottom - 1.8)), gap: u(phone ? 1.2 : 2.4) }}
      >
        <Speaker />
        <div className="flex flex-1 flex-col justify-center" style={{ gap: '5cqh' }}>
          <div className="flex items-center justify-evenly" style={{ height: '70cqh' }}>
            {/* tuned to channel ٢, the preset key that is pressed in */}
            <Knob size="72cqh" pointer={1 / 11} channel />
            <Knob size="56cqh" pointer={0.62} />
          </div>
          <div className="flex items-end" style={{ height: '21cqh', gap: u(phone ? 0.5 : 0.4), paddingInline: u(phone ? 0.2 : 1) }}>
            {[1, 2, 3, 4].map((n) => {
              const on = n === 2;
              return (
                <div
                  key={n}
                  className="flex flex-1 items-center justify-center font-semibold"
                  style={{
                    height: on ? '84%' : '100%',
                    borderRadius: `${u(0.15)} ${u(0.15)} ${u(0.4)} ${u(0.4)}`,
                    background: on ? 'linear-gradient(180deg,#d6c6a2,#bfa982)' : 'linear-gradient(180deg,#fbf4e4,#e4d5b4)',
                    boxShadow: `inset 0 ${u(-0.15)} 0 rgba(120,90,50,0.35), 0 ${u(0.15)} ${u(0.25)} rgba(20,8,0,0.45)`,
                    fontFamily: 'var(--font-vazir)',
                    fontSize: '12cqh',
                    lineHeight: 1,
                    color: on ? '#cf1830' : '#5a3a1e',
                  }}
                >
                  {ar(n)}
                </div>
              );
            })}
            {/* pilot light */}
            <div className="self-center" style={{ width: '9cqh', height: '9cqh', marginLeft: u(0.6), borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ffd2c8, #ff3b30 45%, #9e0f0a)', boxShadow: `0 0 ${u(0.8)} rgba(255,60,40,0.75)` }} />
          </div>
        </div>
      </div>

      {/* rabbit ears on the bare wood, right of the runner */}
      <Antenna className="absolute" style={{ left: phone ? '50%' : '66%', bottom: `calc(100% + ${u(f.top - 0.3)})`, width: u(phone ? 17 : 24) }} />

      {/* the runner's hanging end, behind the runner itself; it swings outwards, away from the glass */}
      <div className="absolute" style={{ left: u(-f.side - 1.1), top: u(-f.top - 0.6), width: u(tail), transform: 'rotate(-1.5deg)', transformOrigin: '50% 0' }}>
        <div className="relative overflow-hidden" style={{ height: u(tailLen), borderRadius: `0 0 ${u(0.3)} ${u(0.3)}`, boxShadow: `${u(0.3)} ${u(0.5)} ${u(0.8)} rgba(20,8,0,0.35)` }}>
          <Sadu className="absolute inset-0 h-full w-full" box={[tail * 10, tailLen * 10]} rotate={90} scale={weave} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,8,0,0.28), rgba(20,8,0,0) 30%, rgba(255,255,255,0.1) 62%, rgba(20,8,0,0.22))' }} />
        </div>
        <Fringe count={tail} />
      </div>

      {/* the runner on top: a sliver of its upper face, then the flap over the front edge */}
      <div className="absolute" style={{ left: u(-f.side - 0.8), top: u(-f.top - 0.6), width: u(runner) }}>
        <div className="relative overflow-hidden" style={{ height: u(flap), borderRadius: `${u(0.3)} ${u(0.5)} ${u(0.2)} ${u(0.2)}`, boxShadow: `0 ${u(0.45)} ${u(0.7)} rgba(20,8,0,0.4)` }}>
          <Sadu className="absolute inset-0 h-full w-full" box={[runner * 10, flap * 10]} scale={weave} />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,240,220,0.22) 0, rgba(255,240,220,0.22) 13%, rgba(20,8,0,0.38) 15%, rgba(20,8,0,0) 32%, rgba(20,8,0,0.14) 100%), linear-gradient(90deg, rgba(20,8,0,0) 88%, rgba(20,8,0,0.25))' }}
          />
        </div>
        <Fringe count={runner} />
      </div>

      {/* gahwa on the cloth */}
      <Dallah className="absolute" style={{ left: u(phone ? 1.2 : 6), bottom: `calc(100% + ${u(f.top + 0.15)})`, height: u(phone ? 10 : 14) }} />
      <Finjan className="absolute" style={{ left: u(phone ? 10 : 19), bottom: `calc(100% + ${u(f.top + 0.2)})`, height: u(phone ? 2.6 : 3.4) }} />
      <Finjan className="absolute" style={{ left: u(phone ? 13.4 : 23.6), bottom: `calc(100% + ${u(f.top + 0.2)})`, height: u(phone ? 2.6 : 3.4) }} />
    </div>
  );
}

/** Tassels along the end of the runner: one per u, knots alternating red and black. */
function Fringe({ count }: { count: number }) {
  return (
    <svg viewBox={`0 0 ${count * 10} 24`} preserveAspectRatio="none" style={{ display: 'block', width: u(count), height: u(2.4), marginTop: u(-0.1) }} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const x = i * 10;
        return (
          <g key={i}>
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={x + 3.6 + k * 1} y1={5} x2={x + 2 + k * 2} y2={21 + (k % 2) * 1.6} stroke="#efe3c6" strokeWidth={0.75} strokeLinecap="round" />
            ))}
            <rect x={x + 2.6} y={0} width={4.8} height={5.4} rx={1.6} fill={i % 2 ? '#161616' : '#cf1830'} />
          </g>
        );
      })}
    </svg>
  );
}

/** Wooden slats over oatmeal speaker cloth, in a brass frame, with the shop's stamp as a brass badge. */
function Speaker() {
  return (
    <div className="relative" style={{ flex: 1.6, padding: u(0.32), borderRadius: u(0.9), background: BRASS, boxShadow: `0 ${u(0.15)} ${u(0.3)} rgba(20,8,0,0.45)` }}>
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          borderRadius: u(0.6),
          background: [
            `repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 ${u(0.75)}, #2e190c ${u(0.75)} ${u(0.85)}, #6a3f22 ${u(0.85)} ${u(1.05)}, #55311b ${u(1.05)} ${u(1.55)}, #2e190c ${u(1.55)} ${u(1.65)})`,
            'repeating-linear-gradient(0deg, rgba(90,60,30,0.2) 0 1px, rgba(0,0,0,0) 1px 3px)',
            'repeating-linear-gradient(90deg, rgba(90,60,30,0.16) 0 1px, rgba(0,0,0,0) 1px 3px)',
            'linear-gradient(180deg,#dccaa5,#c4b089)',
          ].join(', '),
          boxShadow: `inset 0 ${u(0.4)} ${u(0.8)} rgba(20,8,0,0.55)`,
        }}
      >
        <Medallion />
      </div>
    </div>
  );
}

function Medallion() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg viewBox="0 0 100 100" style={{ height: '62cqh', aspectRatio: '1' }} aria-hidden>
      <defs>
        <radialGradient id={`${id}b`} cx="34%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff3c9" />
          <stop offset="0.38" stopColor="#e2b85c" />
          <stop offset="0.74" stopColor="#a8771f" />
          <stop offset="1" stopColor="#6b4810" />
        </radialGradient>
        <mask id={`${id}m`} maskContentUnits="objectBoundingBox">
          <image href={brand.logoMask} width="1" height="1" preserveAspectRatio="xMidYMid meet" />
        </mask>
      </defs>
      <ellipse cx="51" cy="53" rx="48" ry="47" fill="rgba(20,8,0,0.45)" />
      <circle cx="50" cy="50" r="47" fill={`url(#${id}b)`} stroke="#5c3c0c" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="42.5" fill="none" stroke="rgba(92,60,12,0.55)" strokeWidth="0.8" />
      <rect x="11" y="11" width="78" height="78" fill="#5a3a0c" mask={`url(#${id}m)`} />
    </svg>
  );
}

/** A brass knob on a dark dial: channel numbers ١–١٢ in Arabic, or a rising volume scale. */
function Knob({ size, pointer, channel = false }: { size: string; pointer: number; channel?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // Marks sweep 270 degrees, from bottom left round to bottom right.
  const at = (t: number, r: number) => {
    const a = ((-135 + t * 270) * Math.PI) / 180;
    return [r2(50 + r * Math.sin(a)), r2(50 - r * Math.cos(a))];
  };
  const marks = channel ? 12 : 11;
  const [px, py] = at(pointer, 23);
  return (
    <svg viewBox="0 0 100 100" style={{ height: size, aspectRatio: '1' }} className="shrink-0" aria-hidden>
      <defs>
        <radialGradient id={`${id}k`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#fff2c2" />
          <stop offset="0.4" stopColor="#dcae50" />
          <stop offset="0.8" stopColor="#94651a" />
          <stop offset="1" stopColor="#5e3f0c" />
        </radialGradient>
        <radialGradient id={`${id}p`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#2c1e14" />
          <stop offset="1" stopColor="#120b06" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}p)`} stroke="#b98a30" strokeWidth="1.6" />
      {Array.from({ length: marks }, (_, i) => {
        const t = i / (marks - 1);
        if (channel) {
          const [x, y] = at(t, 37);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="700" fill="#f3e3c0" style={{ fontFamily: 'var(--font-vazir)' }}>
              {ar(i + 1)}
            </text>
          );
        }
        const [x, y] = at(t, 38);
        return <circle key={i} cx={x} cy={y} r={1.3 + t * 2.4} fill="#f3e3c0" />;
      })}
      <circle cx="51.5" cy="53" r="27" fill="rgba(0,0,0,0.5)" />
      <circle cx="50" cy="50" r="26.5" fill={`url(#${id}k)`} />
      <circle cx="50" cy="50" r="25.2" fill="none" stroke="#6b4a12" strokeWidth="2.6" strokeDasharray="1.1 1.7" />
      <circle cx="50" cy="50" r="18" fill={`url(#${id}k)`} stroke="rgba(90,58,10,0.6)" strokeWidth="0.8" />
      <line x1="50" y1="50" x2={px} y2={py} stroke="#cf1830" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** A Kuwaiti dallah in brass: crescent beak, waisted body, a tall finial on the lid. */
function Dallah({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const brass = `url(#${id}g)`;
  return (
    <svg viewBox="0 0 120 170" className={className} style={{ aspectRatio: '120 / 170', ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3b0c" />
          <stop offset="0.2" stopColor="#a9792a" />
          <stop offset="0.38" stopColor="#efcd78" />
          <stop offset="0.47" stopColor="#fff3c6" />
          <stop offset="0.6" stopColor="#d6a646" />
          <stop offset="0.84" stopColor="#8a5e17" />
          <stop offset="1" stopColor="#573a0b" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dc8e" />
          <stop offset="0.5" stopColor="#c08f34" />
          <stop offset="1" stopColor="#6b4810" />
        </linearGradient>
      </defs>
      <ellipse cx="62" cy="167" rx="30" ry="2.6" fill="rgba(20,8,0,0.4)" />
      {/* handle */}
      <path d="M76 66 C96 62 110 80 98 98 C94 104 87 106 79 107" fill="none" stroke="#4a300a" strokeWidth="6.6" strokeLinecap="round" />
      <path d="M76 66 C96 62 110 80 98 98 C94 104 87 106 79 107" fill="none" stroke={`url(#${id}s)`} strokeWidth="4.4" strokeLinecap="round" />
      {/* spout */}
      <path d="M36 96 C22 92 10 78 3 52 C2 49 5 48 6 51 C13 70 22 80 33 83 Z" fill={`url(#${id}s)`} stroke="#4a300a" strokeWidth="1.1" />
      {/* body */}
      <path
        d="M40 166 L84 166 C84 162 81 160 79 158 C92 152 99 141 96 130 C93 120 83 114 75 111 L75 105 C87 100 94 91 93 82 C92 74 85 70 75 68 L75 61 C81 60 84 56 81 52 C77 46 69 43 65 39 L59 39 C55 43 47 46 43 52 C40 56 43 60 49 61 L49 68 C39 70 32 74 31 82 C30 91 37 100 49 105 L49 111 C41 114 31 120 28 130 C25 141 32 152 45 158 C43 160 40 162 40 166 Z"
        fill={brass}
        stroke="#4a300a"
        strokeWidth="1.2"
      />
      {/* engraved bands */}
      <path d="M31 128 C50 136 74 136 93 128 M34 141 C52 148 72 148 90 141 M33 86 C50 92 74 92 91 86 M45 54 C55 57 69 57 79 54" fill="none" stroke="rgba(80,48,8,0.55)" strokeWidth="0.9" />
      {/* waist ring and lid rim */}
      <rect x="45" y="103.5" width="34" height="8.5" rx="3.4" fill={brass} stroke="#4a300a" strokeWidth="1" />
      <ellipse cx="62" cy="60.5" rx="14.5" ry="2.6" fill={brass} stroke="#4a300a" strokeWidth="0.9" />
      {/* finial */}
      <circle cx="62" cy="34" r="5" fill={brass} stroke="#4a300a" strokeWidth="0.9" />
      <path d="M60.2 30 L63.8 30 L63 25.5 L61 25.5 Z" fill={brass} stroke="#4a300a" strokeWidth="0.7" />
      <circle cx="62" cy="23" r="3" fill={brass} stroke="#4a300a" strokeWidth="0.7" />
      <path d="M62 7 C65.2 12.5 65.6 16.6 62 20.4 C58.4 16.6 58.8 12.5 62 7 Z" fill={brass} stroke="#4a300a" strokeWidth="0.8" />
    </svg>
  );
}

/** A small handleless gahwa cup with a gold rim. */
function Finjan({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg viewBox="0 0 40 26" className={className} style={{ aspectRatio: '40 / 26', ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9d0c0" />
          <stop offset="0.4" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfc4b0" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="24.4" rx="12" ry="1.6" fill="rgba(20,8,0,0.35)" />
      <path d="M5 4 L35 4 C34.5 14 29 23 20 23 C11 23 5.5 14 5 4 Z" fill={`url(#${id}c)`} stroke="#b9ab92" strokeWidth="0.6" />
      <path d="M6.3 8.6 C15 10.8 25 10.8 33.7 8.6" fill="none" stroke="#c9a04a" strokeWidth="0.9" />
      <ellipse cx="20" cy="4" rx="15" ry="2" fill="#f7f2e8" stroke="#c9a04a" strokeWidth="0.9" />
      <ellipse cx="20" cy="4.3" rx="12.4" ry="1.25" fill="#c19552" />
    </svg>
  );
}

/** Rabbit-ear antennas on a domed base, telescoping to ball tips, with a Kuwait flag tied on. */
function Antenna({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // Rods from the pivot to their tips; drawn in three telescoping segments, thinning out.
  const rods = [
    [106, 136, 22, 8],
    [114, 136, 210, 34],
  ] as const;
  const seg = [0, 0.45, 0.75, 1];
  const width = [3.8, 2.9, 2.1];
  const pt = (r: (typeof rods)[number], t: number) => [r2(r[0] + (r[2] - r[0]) * t), r2(r[1] + (r[3] - r[1]) * t)];
  return (
    <svg viewBox="0 0 220 150" className={className} style={{ aspectRatio: '220 / 150', ...style }} aria-hidden>
      <defs>
        <radialGradient id={`${id}t`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#7d868e" />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2c18" />
          <stop offset="1" stopColor="#160c06" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {rods.map((r, ri) =>
        [0, 1, 2].map((s) => {
          const [x1, y1] = pt(r, seg[s]);
          const [x2, y2] = pt(r, seg[s + 1]);
          return (
            <g key={`${ri}-${s}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#59636b" strokeWidth={width[s] + 1.2} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9d1d8" strokeWidth={width[s]} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f6f9fb" strokeWidth={width[s] * 0.32} strokeLinecap="round" />
            </g>
          );
        }),
      )}
      {rods.map((r, ri) => (
        <g key={ri}>
          {[0.45, 0.75].map((t) => {
            const [x, y] = pt(r, t);
            return <circle key={t} cx={x} cy={y} r="2.7" fill="#aeb7bf" stroke="#59636b" strokeWidth="0.6" />;
          })}
          <circle cx={r[2]} cy={r[3]} r="4.4" fill={`url(#${id}t)`} stroke="#59636b" strokeWidth="0.6" />
        </g>
      ))}
      {/* Kuwait flag, hoist along the left rod: green, white, red, with the black trapezoid at the hoist */}
      <g transform="translate(28.7 18.2) skewX(33.3)">
        <rect x="0" y="0" width="38" height="7.4" fill="#007a3d" />
        <rect x="0" y="7.4" width="38" height="7.4" fill="#ffffff" />
        <rect x="0" y="14.8" width="38" height="7.4" fill="#ce1126" />
        <path d="M0 0 L10.5 7.4 L10.5 14.8 L0 22.2 Z" fill="#000000" />
        <rect x="0" y="0" width="38" height="22.2" fill={`url(#${id}w)`} />
      </g>
      {/* domed base with a brass ring */}
      <path d="M80 150 C80 130 140 130 140 150 Z" fill={`url(#${id}b)`} />
      <rect x="82" y="144" width="56" height="4.4" rx="2.2" fill="#c99a3c" />
      <circle cx="110" cy="136" r="5.4" fill={`url(#${id}t)`} stroke="#59636b" strokeWidth="0.6" />
    </svg>
  );
}
