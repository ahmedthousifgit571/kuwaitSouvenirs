'use client';

import { Crosshair } from 'lucide-react';
import { useState } from 'react';
import { RichText } from '@/components/ui';
import { packs, packsSection } from '@/content/site';
import { waOrder } from '@/lib/whatsapp';
import { Barcode, PixelCode } from './Codes';

type Pack = (typeof packs)[number];

const DOTS = [<path key="d" d="M4 0 L8 4 L4 8 L0 4 Z" />, <path key="h" d="M4 0 L7.5 2 V6 L4 8 L0.5 6 V2 Z" />, <circle key="c" cx="4" cy="4" r="3.6" />];

/**
 * A gift pack as a shipping label: white front with a perforated tear-off stub,
 * red back with a pixel code. Hover (or tap) tears the stub and swaps the barcode
 * for the WhatsApp button. The featured pack starts torn, as on the reference.
 */
export default function PackLabel({ pack, featured = false }: { pack: Pack; featured?: boolean }) {
  const [torn, setTorn] = useState(featured);
  const href = waOrder(pack.name);

  return (
    <div
      className={`pack group/pack relative w-[333px] [perspective:1400px] max-md:w-[78vw] max-md:max-w-[333px] ${torn ? 'is-torn' : ''}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && !featured && setTorn(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && !featured && setTorn(false)}
      onClick={(e) => {
        // Touch: the first tap tears the stub; the button underneath does the rest.
        if (!torn && (e.nativeEvent as PointerEvent).pointerType !== 'mouse') {
          e.preventDefault();
          setTorn(true);
        }
      }}
    >
      <div className="pack-card relative [transform-style:preserve-3d] will-change-transform">
        {/* Front: the shadow sits on an inner wrapper, because a filter on the face itself
            makes Chrome ignore backface-visibility and the back never shows. */}
        <div className="[backface-visibility:hidden]">
          <div className="[filter:drop-shadow(0_14px_22px_rgba(20,50,100,0.16))]">
            <div className="perf-bottom flex h-[315px] flex-col rounded-[20px] bg-white p-5 text-red max-md:h-[280px]">
              <h3 className="it text-[38px] leading-none">{pack.name}</h3>
              <p className="mt-3 text-[16px] leading-[1.2]">
                <RichText value={pack.intro} />
              </p>
              <ul className="mt-auto space-y-1 text-[16px] leading-[1.25]">
                {pack.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg viewBox="0 0 8 8" className="h-[7px] w-[7px] shrink-0 fill-current" aria-hidden>
                      {DOTS[i % 3]}
                    </svg>
                    <span>
                      <RichText value={b} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pack-stub perf-top relative mt-[3px] origin-top-left rounded-[20px] bg-white px-5 pt-5 pb-4 text-red">
              <div className="label flex items-baseline justify-between text-[13px]">
                <span>{packsSection.priceLabel}</span>
                <span className="text-[14px]">{pack.price}</span>
              </div>
              <div className="relative mt-4 h-12">
                <Barcode seed={pack.code} className="pack-barcode absolute inset-0 h-full w-full text-red" />
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={torn ? 0 : -1}
                  className="pack-cta it absolute inset-0 flex items-center justify-center bg-red text-[22px] text-white"
                >
                  {packsSection.order}
                </a>
              </div>
              <p className="label mt-4 text-[13px]">{pack.footer}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden>
          <div className="perf-bottom relative flex h-[315px] flex-col rounded-[20px] bg-red p-5 text-white max-md:h-[280px]">
            <div className="flex items-start justify-between">
              <PixelCode seed={pack.code} className="h-11 w-11 text-white" />
              <Crosshair className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <p className="mt-2 font-mono text-[11px]">{pack.code}</p>
            <p className="it mt-auto text-[84px] leading-[0.85]">{pack.abbr}</p>
            <span className="absolute top-1/2 right-5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white font-mono text-[12px]">
              S
            </span>
            <svg viewBox="0 0 30 8" className="mt-4 h-2 w-[30px] fill-white" aria-hidden>
              <path d="M0 0 L7 4 L0 8 Z M11 0 L18 4 L11 8 Z M22 0 L29 4 L22 8 Z" />
            </svg>
          </div>
          <div className="perf-top mt-[3px] rounded-[20px] bg-red px-5 pt-5 pb-4 text-white">
            <p className="label text-[13px]">{packsSection.tear}</p>
            <Barcode seed={pack.code + 'b'} className="mt-4 h-12 w-full text-white" />
            <p className="label mt-4 text-[13px]">{pack.back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
