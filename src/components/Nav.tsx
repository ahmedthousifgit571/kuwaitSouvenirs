'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import Wordmark from '@/components/wordmark/Wordmark';
import { HEIGHT, WIDTH } from '@/components/wordmark/letters';
import { brand, nav, navOrder } from '@/content/site';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { introSkipped, onIntro } from '@/lib/intro';
import { waLink } from '@/lib/whatsapp';

const SMALL_DESKTOP = 150;
const SMALL_PHONE = 112;

/**
 * The giant wordmark lives in the fixed nav: on scroll it shrinks into a small logo top left
 * while the link row slides up beside it. Further down the nav hides on the way down
 * and comes back on the way up.
 */
export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const logo = q('.nav-logo')[0] as HTMLElement;
      const rowOuter = q('.nav-row')[0] as HTMLElement;

      // Publish the rendered wordmark height so the hero can sit right under it.
      const publish = () => document.documentElement.style.setProperty('--wm-h', `${logo.offsetHeight}px`);
      publish();
      const ro = new ResizeObserver(() => {
        publish();
        ScrollTrigger.refresh();
      });
      ro.observe(logo);

      const smallW = () => (window.innerWidth < 768 ? SMALL_PHONE : SMALL_DESKTOP);
      const smallH = () => (smallW() * HEIGHT) / WIDTH;

      const shrink = gsap.timeline({
        scrollTrigger: { start: 0, end: () => Math.max(260, window.innerHeight * 0.42), scrub: 0.4, invalidateOnRefresh: true },
        defaults: { ease: 'none' },
      });
      shrink
        .fromTo(logo, { scale: 1 }, { scale: () => smallW() / logo.offsetWidth }, 0)
        .fromTo(rowOuter, { y: 0 }, { y: () => 20 + smallH() / 2 - 10 - rowOuter.offsetTop }, 0)
        .fromTo(q('.nav-tagline'), { opacity: 1 }, { opacity: 0, duration: 0.35 }, 0)
        .fromTo(q('.nav-cover'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);

      // Hide on the way down, show on the way up, once past the hero opening.
      let hidden = false;
      const setHidden = (h: boolean) => {
        if (h === hidden) return;
        hidden = h;
        gsap.to(el, { y: h ? -140 : 0, duration: 0.5, ease: h ? 'power2.in' : 'power2.out', overwrite: true });
      };
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.9,
        end: 'max',
        onUpdate: (self) => setHidden(self.direction === 1),
        onLeaveBack: () => setHidden(false),
      });

      // Entrance: the link row rises in when the loader hands over.
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(q('.nav-row-inner'), { y: 20, opacity: 0 });
        if (introSkipped()) {
          gsap.from(q('.nav-logo .wm-letter'), { y: -420, duration: 1.3, ease: 'power2.out', stagger: { each: 0.04, from: 'center' } });
        }
        const off = onIntro(() => gsap.to(q('.nav-row-inner'), { y: 0, opacity: 1, duration: 0.5, ease: 'power1.out', clearProps: 'transform' }));
        return () => off();
      });

      return () => ro.disconnect();
    },
    { scope: root },
  );

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  // Menu: Escape closes it; focus moves into it on open and back to the button on close.
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      closeBtn.current?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      wasOpen.current = true;
      return () => window.removeEventListener('keydown', onKey);
    }
    if (wasOpen.current) menuBtn.current?.focus({ preventScroll: true });
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Restart Lenis (stopped while the menu is open) before scrolling: starting it later, from the
    // effect, runs Lenis's reset() and cancels the scroll.
    lenis?.start();
    lenis?.scrollTo(href, { duration: 1.4, force: true });
  };

  return (
    <>
      <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[78px] max-md:h-[64px]">
        <div className="nav-cover absolute inset-0 bg-white opacity-0" />
        {/* Full width between the gutters; on a phone held sideways it is capped at 30% of the height. */}
        <a
          href="#top"
          onClick={go('#top')}
          aria-label="Souvenir & More, back to top"
          className="nav-logo pointer-events-auto absolute top-5 right-5 left-5 block origin-top-left text-red will-change-transform short:right-auto short:w-[min(calc(100vw-40px),calc(30svh*1400/342))]"
        >
          <Wordmark className="block h-auto w-full" decorative />
        </a>
        <div className="nav-row absolute inset-x-5" style={{ top: 'calc(20px + var(--wm-h) + 24px)' }}>
          <div className="nav-row-inner relative flex h-[19px] items-center">
            <p className="nav-tagline text-[16px] max-md:text-[14px]">{brand.tagline}</p>
            {/* Inline links from lg up; below that (phones and tablets) the Menu button takes over. */}
            <nav aria-label="Main" className="pointer-events-auto absolute left-1/2 flex gap-[10px] max-lg:hidden">
              {nav.map((l) => (
                <a key={l.href} href={l.href} onClick={go(l.href)} className="text-[16px] font-medium transition-opacity hover:opacity-60">
                  {l.label}
                </a>
              ))}
              <a href={waLink(navOrder.message)} target="_blank" rel="noreferrer" className="text-[16px] font-medium transition-opacity hover:opacity-60">
                {navOrder.label}
              </a>
            </nav>
            {/* Hidden below 72rem: with six links the row reaches it on small laptops (it is in the footer too). */}
            <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="it pointer-events-auto ml-auto text-[19px] transition-opacity hover:opacity-60 max-[72rem]:hidden">
              {brand.instagram}
            </a>
            {/* Padding widens the tap area to about 44px without moving the label. */}
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen(true)}
              className="label pointer-events-auto -m-3 ml-auto hidden p-3 font-semibold max-lg:block"
              aria-expanded={open}
              aria-controls="menu"
            >
              [ Menu ]
            </button>
          </div>
        </div>
      </header>

      {/* Always mounted so it can slide in and out; inert and hidden while closed. */}
      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        // Opening shows it at once (so focus can move in) and wipes the red down; closing wipes it
        // up and only hides it once the wipe ends.
        className={`fixed inset-0 z-[60] flex flex-col bg-red p-5 text-white duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:duration-0 ${
          open ? 'visible transition-[clip-path] [clip-path:inset(0_0_0_0)]' : 'invisible transition-[clip-path,visibility] [clip-path:inset(0_0_100%_0)]'
        }`}
        data-lenis-prevent
      >
        <div className="flex items-start justify-between">
          <p className="label">{brand.tagline}</p>
          <button ref={closeBtn} type="button" onClick={() => setOpen(false)} className="label -m-3 p-3 font-semibold">
            [ Close ]
          </button>
        </div>
        <nav aria-label="Menu" className="mt-auto flex flex-col gap-1">
          {[...nav.map((l) => ({ ...l, order: false })), { label: navOrder.label, href: waLink(navOrder.message), order: true }].map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={l.order ? () => setOpen(false) : go(l.href)}
              target={l.order ? '_blank' : undefined}
              rel={l.order ? 'noreferrer' : undefined}
              className={`h1 block py-1 transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${l.order ? 'it text-[min(48px,12vw)]' : 'text-[min(44px,11vw)]'} ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${220 + i * 70}ms` : '0ms' }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="it mt-10 py-1 text-[22px]">
          {brand.instagram}
        </a>
      </div>
    </>
  );
}
