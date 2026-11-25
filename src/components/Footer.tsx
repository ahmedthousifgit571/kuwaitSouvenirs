'use client';

import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import LocalTime from '@/components/LocalTime';
import Wordmark from '@/components/wordmark/Wordmark';
import { brand, contact, footer, socials } from '@/content/site';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { waLink } from '@/lib/whatsapp';

/**
 * Red footer: Instagram, Kuwait time, socials and links, then the wordmark in white,
 * its letters rising into place (the O stamps turn on their own, see Wordmark).
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Letters rise into place the first time the footer comes into view.
        gsap.from(el.querySelectorAll('.wm-letter'), {
          y: 200,
          duration: 1.2,
          ease: 'power3.out',
          stagger: { each: 0.04, from: 'center' },
          scrollTrigger: { trigger: el.querySelector('.ft-mark'), start: 'top 95%' },
        });
      });
    },
    { scope: root },
  );

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(href, { duration: 1.6, force: true });
  };

  return (
    <footer ref={root} className="relative overflow-hidden bg-red px-5 pt-7 pb-5 text-white">
      <div className="flex items-start max-md:grid max-md:grid-cols-2 max-md:gap-y-9">
        <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="it w-1/2 text-[20px] leading-none transition-opacity hover:opacity-70 max-md:col-span-2 max-md:w-auto">
          {brand.instagram}
        </a>
        <LocalTime className="label w-[24.3%] font-semibold max-md:col-span-2 max-md:w-auto" />
        {/* On phones each link gets vertical padding instead of list spacing: a taller tap area, same rhythm. */}
        <ul className="w-[12.2%] space-y-1 text-[16px] leading-[1.35] font-medium max-md:w-auto max-md:space-y-0">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href === 'whatsapp' ? waLink(contact.message) : s.href}
                target={s.href === '#' ? undefined : '_blank'}
                rel="noreferrer"
                className="inline-block transition-opacity hover:opacity-70 max-md:py-[7px]"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex-1 space-y-1 text-[16px] leading-[1.35] font-medium max-md:flex-none max-md:space-y-0">
          {footer.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={go(l.href)} className="inline-block transition-opacity hover:opacity-70 max-md:py-[7px]">
                {l.label}
              </a>
            </li>
          ))}
          <li className="label pt-3 text-[11px] opacity-70">{footer.copyright}</li>
        </ul>
      </div>

      <div className="ft-mark mt-[130px] max-md:mt-16">
        <Wordmark className="block h-auto w-full overflow-visible" />
      </div>
    </footer>
  );
}
