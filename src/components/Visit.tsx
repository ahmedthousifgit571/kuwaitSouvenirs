'use client';

import { ArrowUpRight, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import { useId, useRef } from 'react';
import { Pill, RichText } from '@/components/ui';
import { brand, visit } from '@/content/site';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { blurReveal } from '@/lib/reveal';

const M = visit.map;
const RATIO = M.width / M.height;

// Shop details for search engines, from the same facts the section shows.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: brand.name,
  description: brand.tagline,
  telephone: visit.phone.href.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${visit.address[1]}, ${visit.address[2]}`,
    addressLocality: 'Kuwait City',
    postalCode: '14000',
    addressCountry: 'KW',
  },
  geo: { '@type': 'GeoCoordinates', latitude: visit.geo.lat, longitude: visit.geo.lng },
  hasMap: brand.mapsUrl,
  sameAs: [brand.instagramUrl],
};

/**
 * Where to find the shop, as a postcard: the street map on the picture side, and the address
 * side with the logo as its stamp, a Kuwait City postmark, the details and the two actions.
 * On scroll the card settles from a tilt, the pin drops, and the stamp lands and gets franked.
 */
export default function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        blurReveal(el);
        const card = el.querySelector<HTMLElement>('.vs-card')!;

        // The postcard rises with a tilt and lies flat by the time it is well up the screen.
        gsap.fromTo(
          card,
          { y: 90, rotate: -2.5 },
          { y: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 40%', scrub: 0.6 } },
        );
        // The map eases out from a closer zoom over the whole pass.
        gsap.fromTo(
          '.vs-map-inner',
          { scale: 1.15 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
        );

        // Once: pin, labels, ruled lines, stamp, then the postmark thumps down on it.
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 62%', toggleActions: 'play none none none' } });
        tl.from('.vs-pin', { y: -90, autoAlpha: 0, duration: 0.9, ease: 'bounce.out' }, 0)
          .from('.vs-chip', { x: -12, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, 0.65)
          .from('.vs-label', { autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: 'power1.out' }, 0.15)
          .from('.vs-line', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.08, ease: 'power2.out' }, 0.25)
          .from('.vs-stamp', { y: -36, rotate: -14, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.3)
          .from('.vs-postmark', { scale: 1.6, autoAlpha: 0, transformOrigin: '75% 50%', duration: 0.32, ease: 'power4.in' }, 0.85);
      });
    },
    { scope: root },
  );

  return (
    // overflow-x-clip: the card's starting tilt pokes its corners past the 20px gutter on phones.
    <section ref={root} id="visit" className="relative overflow-x-clip bg-white px-5 pt-10 pb-[150px] max-md:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="grid grid-cols-2 items-end gap-10 max-md:grid-cols-1 max-md:gap-8">
        <div>
          <Pill className="text-[20px]">{visit.pill}</Pill>
          <h2 className="h2 mt-10 max-md:mt-8" data-reveal="blur">
            {visit.title}
            <br />
            <span className="it">{visit.italic}</span>
          </h2>
        </div>
        <p className="max-w-[340px] text-[16px] leading-[1.2] md:mb-1" data-reveal="blur">
          <RichText value={visit.intro} />
        </p>
      </div>

      <div className="vs-card mt-16 grid overflow-hidden rounded-[12px] bg-[#fbf8f3] shadow-[0_40px_80px_-40px_rgba(22,22,22,0.35),0_1px_3px_rgba(22,22,22,0.08)] max-md:mt-12 lg:min-h-[clamp(580px,46vw,720px)] lg:grid-cols-[1.22fr_1fr]">
        <MapPanel />
        <AddressSide />
      </div>
    </section>
  );
}

/**
 * The street map, cropped to cover the panel with the shop dead centre. The map box is sized in
 * container units so it covers at any aspect; `--zoom` shows a tighter area on phones.
 */
function MapPanel() {
  const box = {
    '--ratio': RATIO,
    '--mw': 'calc(max(100cqw, 100cqh * var(--ratio)) * var(--zoom))',
    width: 'var(--mw)',
    height: 'calc(var(--mw) / var(--ratio))',
    left: 'calc((100cqw - var(--mw)) / 2)',
    top: 'calc((100cqh - var(--mw) / var(--ratio)) / 2)',
  } as React.CSSProperties;
  const scaleBar = {
    width: `calc(max(100cqw, 100cqh * ${RATIO}) * var(--zoom) * ${M.scale / M.width})`,
  } as React.CSSProperties;

  return (
    <div className="relative aspect-[4/3.7] overflow-hidden bg-grey [container-type:size] [--zoom:1.6] md:aspect-[16/9] md:[--zoom:1] short:aspect-[21/9] lg:aspect-auto">
      <a
        href={brand.mapsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${visit.openMap}: ${brand.name}, ${visit.address[1]}`}
        className="group absolute inset-0 block"
      >
        <div className="absolute" style={box}>
          <div className="vs-map-inner relative h-full w-full will-change-transform">
            <Image src={M.src} alt={M.alt} fill sizes="(min-width: 1024px) 60vw, 160vw" unoptimized draggable={false} className="select-none" />

            {M.streets.map((s) => (
              <span
                key={s.name}
                aria-hidden
                className={`vs-label label pointer-events-none absolute text-[9.5px] whitespace-nowrap text-ink/55 [text-shadow:0_0_2px_#fff,0_0_4px_#fff] ${s.wide ? 'max-md:hidden' : ''}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%, -50%) rotate(${s.angle}deg)` }}
              >
                {s.name}
              </span>
            ))}
            {M.places.map((p) => (
              <span
                key={p.name}
                aria-hidden
                className={`vs-label it pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[17px] leading-none whitespace-nowrap text-red [text-shadow:0_0_3px_#fff,0_0_6px_#fff,0_0_10px_#fff] max-md:text-[15px] ${p.wide ? 'max-md:hidden' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {p.name}
              </span>
            ))}

            <Pin />
          </div>
        </div>

        <span className="label absolute top-4 left-4 rounded-[4px] bg-white/85 px-2 py-1 text-[11px] text-ink/70 max-md:hidden">{visit.geo.label}</span>
        <span className="label absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white py-2 pr-2.5 pl-3.5 text-[11px] font-semibold text-red shadow-[0_6px_16px_-6px_rgba(22,22,22,0.3)] transition-colors duration-300 group-hover:bg-red group-hover:text-white max-md:top-auto max-md:right-3 max-md:bottom-8">
          <span className="max-md:hidden">{visit.openMap}</span>
          <span className="md:hidden">{visit.openMapShort}</span>
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </a>

      {/* Compass and scale bar: fixed to the panel, sized from the same container maths as the map. */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 text-ink max-md:bottom-3 max-md:left-3" aria-hidden>
        <span className="flex h-9 w-9 flex-col items-center justify-center rounded-full bg-white font-mono text-[10px] leading-none font-semibold shadow-[0_4px_12px_-4px_rgba(22,22,22,0.3)]">
          <svg viewBox="0 0 10 10" className="mb-[2px] h-2.5 w-2.5 fill-red">
            <path d="M5 0 L9 10 L5 7.5 L1 10 Z" />
          </svg>
          N
        </span>
        <span className="block rounded-[4px] bg-white/85 px-2 pt-1 pb-1.5">
          <span className="label block text-[10px] text-ink/70">{M.scale} m</span>
          <span className="mt-1 block h-[5px] border-x border-b border-ink/70" style={scaleBar} />
        </span>
      </div>

      <a
        href={M.creditUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute right-0 bottom-0 rounded-tl-[4px] bg-white/85 px-1.5 py-0.5 font-mono text-[9px] text-ink/60 hover:text-ink"
      >
        {M.credit}
      </a>
    </div>
  );
}

/** The shop's pin: the logo stamp in a white disc, a pulse on the exact spot, and the name chip. */
function Pin() {
  return (
    <div className="absolute top-1/2 left-1/2 h-0 w-0">
      <span className="absolute -top-5 -left-5 h-10 w-10 animate-ping rounded-full bg-red/35 [animation-duration:1.8s]" />
      <span className="absolute -top-[6px] -left-[6px] h-3 w-3 rounded-full bg-red ring-[2.5px] ring-white" />
      <div className="vs-pin absolute bottom-[9px] -left-[32px] w-16 drop-shadow-[0_10px_14px_rgba(22,22,22,0.28)] max-md:bottom-[8px] max-md:-left-[26px] max-md:w-[52px]">
        <div className="relative z-[1] aspect-square rounded-full bg-white p-[5px] max-md:p-1">
          <Image src={brand.logo} alt="" width={128} height={128} className="h-full w-full rounded-full" />
        </div>
        <span className="mx-auto -mt-[9px] block h-3.5 w-3.5 rotate-45 bg-white" />
      </div>
      {/* Beside the pin from md up; on phones it sits centred under the dot so it never runs off the edge. */}
      <span className="vs-chip absolute -top-[60px] left-[40px] rounded-full bg-red px-3 py-[7px] text-[13px] leading-none font-medium whitespace-nowrap text-white shadow-[0_6px_14px_-6px_rgba(207,24,48,0.7)] max-md:top-[14px] max-md:left-0 max-md:-translate-x-1/2 max-md:px-2.5 max-md:text-[12px]">
        {brand.name}
      </span>
    </div>
  );
}

/** The address side of the postcard: header and stamp, ruled address lines, details, actions. */
function AddressSide() {
  const r = visit.rating;
  return (
    <div className="relative flex flex-col p-8 text-red max-md:p-5 lg:border-l lg:border-red/30 lg:p-10">
      <div className="flex items-start justify-between">
        <div className="label text-[12px] leading-[1.6]">
          <p className="font-semibold">{visit.card}</p>
          <p className="text-ink/50">{visit.code}</p>
        </div>
        <StampGroup />
      </div>

      <address className="mt-10 not-italic max-md:mt-6 lg:mt-auto lg:pt-8">
        <p className="label text-[12px] text-ink/50">{visit.to},</p>
        <ul className="mt-1">
          {visit.address.map((line) => (
            <li key={line} className="relative text-[clamp(23px,2.05vw,31px)] leading-[1.55]">
              <span className="it">{line}</span>
              <span className="vs-line absolute inset-x-0 bottom-[0.18em] h-px bg-red/25" />
            </li>
          ))}
        </ul>
        <p dir="rtl" lang="ar" className="mt-3 text-right text-[15px] text-ink/70">
          {visit.addressAr}
        </p>
      </address>

      <dl className="mt-8 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2.5 text-[15px] max-md:gap-x-4">
        <dt className="label text-[11px] text-ink/50">Hours</dt>
        <dd>{visit.hours}</dd>
        <dt className="label text-[11px] text-ink/50">Call</dt>
        <dd>
          <a href={visit.phone.href} className="-my-2 inline-block py-2 tabular-nums transition-opacity hover:opacity-60">
            {visit.phone.label}
          </a>
        </dd>
        <dt className="label text-[11px] text-ink/50">{r.source}</dt>
        <dd>
          <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="-my-2 inline-flex items-center gap-2 py-2 transition-opacity hover:opacity-60">
            <span className="tabular-nums">{r.score}</span>
            <span className="flex gap-[2px]" aria-label={`${r.score} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden />
              ))}
            </span>
            <span className="text-ink/60">({r.count} reviews)</span>
          </a>
        </dd>
        <dt className="label text-[11px] text-ink/50">Also at</dt>
        <dd>
          <a href={visit.alsoAt.href} target="_blank" rel="noreferrer" className="-my-2 inline-flex items-center gap-1 py-2 transition-opacity hover:opacity-60">
            {visit.alsoAt.label}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
        </dd>
      </dl>

      <div className="mt-8 grid grid-cols-2 gap-3 max-[400px]:grid-cols-1">
        <a
          href={visit.directions.href}
          target="_blank"
          rel="noreferrer"
          className="it flex h-14 items-center justify-center gap-2 rounded-full bg-red text-[22px] text-white transition-transform duration-300 hover:scale-[1.03] max-md:h-[52px] max-md:text-[20px]"
        >
          {visit.directions.label}
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
        </a>
        <a
          href={visit.phone.href}
          className="it flex h-14 items-center justify-center gap-2 rounded-full border border-red text-[22px] transition-colors duration-300 hover:bg-red hover:text-white max-md:h-[52px] max-md:text-[20px]"
        >
          <Phone className="h-4 w-4" strokeWidth={1.75} />
          {visit.call}
        </a>
      </div>
    </div>
  );
}

/**
 * The logo as a perforated stamp, franked by a round Kuwait City postmark whose wavy cancel
 * lines run off to the left. Sizes are multiples of the 10px perforation so the bites line up.
 */
function StampGroup() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ring = visit.postmark.ring;
  return (
    <div className="relative -mt-1 origin-top-right max-md:scale-[0.82]">
      <div className="vs-stamp rotate-[3deg]">
        <div className="h-[120px] w-[100px] p-[6px] drop-shadow-[0_3px_5px_rgba(22,22,22,0.18)] [background:radial-gradient(circle,transparent_3px,#fff_3.5px)_-5px_-5px/10px_10px]">
          <div className="flex h-full w-full flex-col border border-red/40 bg-white px-1.5 py-1">
            <span className="font-mono text-[8px] leading-none font-semibold tracking-[0.08em]">{visit.stamp.country}</span>
            <Image src={brand.logo} alt="" width={128} height={128} className="m-auto h-[58px] w-[58px]" />
            <span className="text-right font-mono text-[10px] leading-none font-semibold">{visit.stamp.value}</span>
          </div>
        </div>
      </div>
      <svg viewBox="0 0 220 120" className="vs-postmark pointer-events-none absolute top-[44px] -left-[128px] w-[176px] text-red opacity-80 mix-blend-multiply" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M4 ${32 + i * 14} q 12 -7 24 0 t 24 0 t 24 0 t 24 0`} />
          ))}
        </g>
        <circle cx="165" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="165" cy="60" r="31" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <defs>
          <path id={id} d="M165 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
        </defs>
        <text className="font-mono" fontSize="10" fontWeight="600" fill="currentColor" style={{ whiteSpace: 'pre' }}>
          <textPath href={`#${id}`} textLength={2 * Math.PI * 41 - 2} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <text x="165" y="62" textAnchor="middle" className="font-mono" fontSize="15" fontWeight="600" fill="currentColor">
          {visit.postmark.centre}
        </text>
        <text x="165" y="77" textAnchor="middle" className="font-mono" fontSize="9" fontWeight="600" fill="currentColor" letterSpacing="2">
          {visit.postmark.sub}
        </text>
      </svg>
    </div>
  );
}
