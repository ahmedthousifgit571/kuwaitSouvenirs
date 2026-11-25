'use client';

import { useEffect, useRef, useState } from 'react';
import KuwaitTv, { tvFrame } from '@/components/desktop/KuwaitTv';
import RetroDesktop from '@/components/desktop/RetroDesktop';
import { WindowDots } from '@/components/desktop/Window';
import { Pill, RichText } from '@/components/ui';
import { desktop, packs, packsSection } from '@/content/site';
import { Draggable, gsap, MOTION_OK, REDUCED, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { nextZ } from '@/lib/zstack';
import PackLabel from './PackLabel';

// Where the scroll hands over from the full-screen packs to the desktop, and when the TV takes over.
const MINIMIZE_AT = 0.6;
const TV_FROM = 0.79;
const TV_LEN = 0.18;

// Below lg (phones, tablets, phones on their side) the labels are a swipeable row at full size;
// from lg up the whole 1440 x 900 layout is scaled to fit.
const NARROW = '(max-width: 63.99rem)';
// The TV takes the tall cabinet when the screen is taller than wide.
const PORTRAIT = '(orientation: portrait)';

function useMedia(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setOn(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [query]);
  return on;
}

/**
 * Gift packs as shipping labels, then the retro desktop, then the TV.
 * One sticky stage: a blue bloom rises behind "We keep our focus on what matters", the labels
 * fly up and flip over, the packs view shrinks into a Packs.html window on a desktop, and finally
 * the whole desktop shrinks into the screen of a 1970s Kuwaiti family TV (`KuwaitTv`).
 */
export default function Packs() {
  const root = useRef<HTMLElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const packsIconRef = useRef<HTMLButtonElement>(null);
  const api = useRef<{ close: () => void; reopen: () => void } | null>(null);
  const narrow = useMedia(NARROW);
  const portrait = useMedia(PORTRAIT);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const stage = q('.pk-stage')[0] as HTMLElement;
      const rig = q('.pk-rig')[0] as HTMLElement;
      const screen = q('.pk-screen')[0] as HTMLElement;
      const fly = q('.pw-fly')[0] as HTMLElement;
      const pw = q('.pw')[0] as HTMLElement;
      const chrome = q('.pw-chrome')[0] as HTMLElement;
      const bar = q('.pw-bar')[0] as HTMLElement;
      const fit = q('.pw-fit')[0] as HTMLElement | undefined;
      const track = q('.pw-track')[0] as HTMLElement | undefined;
      const row = q('.pw-row')[0] as HTMLElement | undefined;
      const dots = q('.pw-dots')[0] as HTMLElement | undefined;
      // How far the row has to slide for the last label to come into view (0 when they all fit).
      const pan = () => (row && track ? Math.max(0, row.offsetWidth - track.clientWidth) : 0);

      // Wide screens: the packs layout is drawn at 1440 x 900 and scaled to fit the screen.
      // Narrow screens: the labels keep their size unless the screen is too short for them,
      // then the whole row zooms down (never below half) so the price and order button stay in view.
      const setFit = () => {
        fit?.style.setProperty('--fit', String(Math.min(stage.clientWidth / 1440, stage.clientHeight / 900)));
        if (track) {
          track.style.setProperty('--pk-zoom', '1');
          const label = track.querySelector<HTMLElement>('.pack'); // measured at zoom 1
          const dotsH = dots && getComputedStyle(dots).display !== 'none' ? dots.offsetHeight + parseFloat(getComputedStyle(dots).marginTop) : 0;
          const room = stage.clientHeight - track.offsetTop - parseFloat(getComputedStyle(track).paddingBottom) - dotsH - 8;
          const z = label ? Math.min(1, Math.max(0.5, room / label.offsetHeight)) : 1;
          track.style.setProperty('--pk-zoom', String(Math.round(z * 1000) / 1000));
          // The dots only mean something when the row has to slide.
          if (dots) dots.style.visibility = pan() > 0 ? '' : 'hidden';
        }
      };
      setFit();
      window.addEventListener('resize', setFit);

      const MIN = narrow ? 0.5 : 0.45;
      gsap.set(pw, { transformOrigin: narrow ? '50% 100%' : '0% 100%' });
      const state = { minimized: false, closed: false };
      let instant = false;

      const drag = narrow
        ? null
        : Draggable.create(pw, {
            trigger: bar,
            bounds: deskRef.current!,
            type: 'x,y',
            zIndexBoost: false,
            onPress: () => {
              pw.style.zIndex = String(nextZ());
            },
          })[0];
      drag?.disable();

      const minimize = () => {
        if (state.minimized) return;
        state.minimized = true;
        pw.style.zIndex = String(nextZ());
        // Narrow: centred above the taskbar, lifted less on short screens so it clears the icon row.
        const lift = narrow ? -Math.min(84, stage.clientHeight * 0.1) : -20;
        gsap.to(pw, { scale: MIN, x: narrow ? 0 : 20, y: lift, duration: instant ? 0 : 0.6, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(chrome, { opacity: 1, duration: instant ? 0 : 0.5 });
        drag?.enable();
      };
      const restore = () => {
        if (!state.minimized) return;
        state.minimized = false;
        drag?.disable();
        if (state.closed) {
          gsap.set(fly, { scale: 1, opacity: 1 });
          state.closed = false;
        }
        gsap.to(pw, { scale: 1, x: 0, y: 0, duration: instant ? 0 : 0.6, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(chrome, { opacity: 0, duration: instant ? 0 : 0.4 });
      };
      // The red dot sends the window back into its icon; the icon brings it back.
      api.current = {
        close: () => {
          if (!state.minimized || state.closed) return;
          const icon = packsIconRef.current;
          const desk = deskRef.current;
          if (!icon || !desk) return;
          const r = icon.getBoundingClientRect();
          const d = desk.getBoundingClientRect();
          gsap.set(fly, { transformOrigin: `${r.left + r.width / 2 - d.left}px ${r.top + 34 - d.top}px` });
          gsap.to(fly, { scale: 0.02, opacity: 0, duration: instant ? 0 : 0.5, ease: 'power2.in' });
          state.closed = true;
        },
        reopen: () => {
          if (!state.minimized) return;
          pw.style.zIndex = String(nextZ());
          if (!state.closed) return;
          gsap.to(fly, { scale: 1, opacity: 1, duration: instant ? 0 : 0.5, ease: 'power2.out' });
          state.closed = false;
        },
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const cards = q('.pack-card');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
        });

        // Blue bloom rises from the bottom, then fills the screen.
        tl.fromTo(q('.pw-bloom'), { scale: 0.3, yPercent: 60 }, { scale: 1.9, yPercent: 0, duration: 0.12 }, 0)
          .fromTo(q('.pw-body'), { backgroundColor: '#ffffff' }, { backgroundColor: '#7ab3ee', duration: 0.04 }, 0.1)
          .fromTo(q('.pw-edge'), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.1)
          // The focus line appears over the blue, then blurs away behind the labels.
          .fromTo(q('.pw-focus'), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.04)
          .to(q('.pw-focus-plain'), { filter: 'blur(12px)', opacity: 0.55, duration: 0.08 }, 0.13)
          .to(q('.pw-focus-it'), { filter: 'blur(12px)', opacity: 0.5, duration: 0.08 }, 0.21)
          .to(q('.pw-focus'), { opacity: 0, duration: 0.04 }, 0.4);

        // Labels fly up from below as red backs and flip over to their fronts.
        const spin = [-16, 12, 20];
        const drift = [-90, 30, 150];
        const tilt = [0, -3, 6];
        cards.forEach((c, i) => {
          const at = 0.16 + i * 0.06;
          gsap.set(c, { transformPerspective: 1400 });
          // Rise with the red back showing...
          tl.fromTo(
            c,
            { yPercent: 170, y: 0, x: drift[i], rotation: spin[i], rotationX: 26 },
            { yPercent: 0, y: 0, x: 0, rotation: tilt[i], rotationX: 0, duration: 0.15, ease: 'power2.out' },
            at,
          )
            // ...and flip over to the front only as it nears its place.
            .fromTo(c, { rotationY: 180 }, { rotationY: 0, duration: 0.07, ease: 'power1.inOut' }, at + 0.07);
        });
        tl.to(cards, { rotation: 0, duration: 0.04 }, 0.41)
          .fromTo(q('.pw-pill'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.03 }, 0.43)
          .fromTo(q('.pw-note'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.03 }, 0.44);

        // Narrow screens: scrolling on slides the row so each label takes its turn in the middle,
        // pausing on each one, before the window minimises at MINIMIZE_AT.
        if (row) {
          const pips = q('.pw-dot');
          const last = packs.length - 1;
          const SLIDE = 0.04;
          const HOLD = 0.025;
          gsap.set(row, { x: 0 });
          gsap.set(pips, { width: 6, opacity: 0.5 });
          gsap.set(pips[0], { width: 20, opacity: 1 });
          for (let i = 1; i <= last; i++) {
            const at = 0.46 + (i - 1) * (SLIDE + HOLD);
            tl.to(row, { x: () => (-pan() * i) / last, duration: SLIDE, ease: 'power2.inOut' }, at)
              .to(pips[i - 1], { width: 6, opacity: 0.5, duration: SLIDE }, at)
              .to(pips[i], { width: 20, opacity: 1, duration: SLIDE }, at);
          }
        }

        // The desktop shrinks into the TV, the glass curving as it goes. The TV is measured in
        // u (a share of the viewport width), so convert to pixels when the trigger refreshes.
        const frame = tvFrame(portrait);
        const uPx = () => (window.innerWidth * frame.unit) / 100;
        // Final size: the usual 0.56 (tall TV) or 0.4 (wide TV), smaller if that would push the
        // dallah and antennas off the top (short phones, portrait tablets, phones on their side).
        const sEnd = () => {
          const H = stage.clientHeight;
          const u = uPx();
          const cabinet = H + (frame.top + frame.bottom + frame.legs) * u;
          return Math.min(portrait ? 0.56 : 0.4, (0.43 * H) / (cabinet / 2 + frame.crown * u));
        };
        tl.fromTo(
          rig,
          { scale: 1, y: 0, rotationX: 0, rotationY: 0, rotation: 0 },
          {
            scale: () => sEnd(),
            // Centre the cabinet and legs a little above the middle of the screen.
            y: () => -0.05 * stage.clientHeight - ((frame.bottom + frame.legs - frame.top) * uPx() * sEnd()) / 2,
            rotationX: 7,
            rotationY: -11,
            rotation: -3,
            duration: TV_LEN,
            ease: 'power1.inOut',
          },
          TV_FROM,
        )
          .fromTo(screen, { borderRadius: '0px' }, { borderRadius: () => `${frame.radius * uPx()}px`, duration: TV_LEN * 0.6 }, TV_FROM)
          .fromTo(q('.pk-crt-glass'), { opacity: 0 }, { opacity: 1, duration: TV_LEN * 0.6 }, TV_FROM)
          .to({}, { duration: 1 - (TV_FROM + TV_LEN) }, TV_FROM + TV_LEN);

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => (self.progress >= MINIMIZE_AT ? minimize() : restore()),
        });
        return () => st.kill();
      });

      // Reduced motion: no flights or shrinking, the window simply swaps state halfway down.
      mm.add(REDUCED, () => {
        instant = true;
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => (self.progress >= 0.5 ? minimize() : restore()),
        });
        return () => st.kill();
      });

      return () => {
        window.removeEventListener('resize', setFit);
        drag?.kill();
        api.current = null;
      };
    },
    { scope: root, dependencies: [narrow, portrait], revertOnUpdate: true },
  );

  const labels = packs.map((p, i) => <PackLabel key={p.code} pack={p} featured={i === 1} />);

  const focus = (
    <div className="pw-focus pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white motion-reduce:hidden">
      <p className="text-[64px] leading-none tracking-[-0.04em] max-md:text-[44px]">
        {packsSection.focus.plain.map((l) => (
          <span key={l} className="pw-focus-plain block">
            {l}
          </span>
        ))}
        <span className="pw-focus-it it block text-[1.1em] leading-[0.95]">{packsSection.focus.italic}</span>
      </p>
    </div>
  );

  return (
    <section ref={root} id="packs" className="relative h-[calc(100svh+820vh)] bg-white motion-reduce:h-[calc(100svh+140vh)]">
      <div className="pk-stage sticky top-0 h-svh overflow-hidden [perspective:2000px]">
        <div className="pk-rig absolute inset-0 origin-center [transform-style:preserve-3d] will-change-transform">
          <div className="motion-reduce:hidden">
            <KuwaitTv phone={portrait} />
          </div>
          <div className="pk-screen absolute inset-0 overflow-hidden bg-white">
            <RetroDesktop phone={narrow} deskRef={deskRef} packsIconRef={packsIconRef} onPacksIcon={() => api.current?.reopen()}>
              <div className="pw-fly absolute inset-0 z-[30] [pointer-events:none]">
                <div className="pw absolute inset-0 [pointer-events:auto]" style={{ zIndex: 30 }}>
                  <div className="pw-body absolute inset-0 overflow-hidden bg-white motion-reduce:bg-[#7ab3ee]">
                    <div
                      className="pw-bloom absolute bottom-[-30vh] left-1/2 h-[120vh] w-[150vw] -translate-x-1/2 rounded-[50%] motion-reduce:hidden"
                      style={{ background: 'radial-gradient(closest-side, #76aef0 0%, #80b9f4 38%, #9ad4fb 60%, rgba(190,232,255,0.6) 80%, rgba(255,255,255,0) 100%)' }}
                    />
                    <div className="pw-edge pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0) 55%, rgba(225,242,255,0.45) 100%)' }} />

                    {narrow ? (
                      <>
                        {focus}
                        <div className="pw-pill absolute inset-x-0 top-[clamp(64px,9svh,78px)] flex justify-center text-white">
                          <Pill className="text-[18px]">{packsSection.pill}</Pill>
                        </div>
                        {/* The label row. Scrolling slides it sideways (see the timeline); with reduced
                            motion it is a plain swipeable row instead. --pk-zoom (set in setFit) shrinks
                            the labels on short screens; mx-auto centres the row when it fits. */}
                        <div className="pw-track absolute inset-x-0 top-[calc(clamp(64px,9svh,78px)+58px)] bottom-0 pb-28 [scrollbar-width:none] short:pb-3 motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto">
                          <div className="pw-row mx-auto flex w-max items-start gap-4 px-[11vw] will-change-transform">
                            {labels.map((l, i) => (
                              <div key={i} className="shrink-0 snap-center" style={{ zoom: 'var(--pk-zoom, 1)' }}>
                                {l}
                              </div>
                            ))}
                          </div>
                          {/* mt-9 clears the featured label's stub, which hangs lower once torn. */}
                          <div className="pw-dots mt-9 flex justify-center gap-1.5 motion-reduce:hidden" aria-hidden>
                            {packs.map((p) => (
                              <span key={p.code} className="pw-dot block h-1.5 w-1.5 rounded-full bg-white opacity-50" />
                            ))}
                          </div>
                        </div>
                        <p className="pw-note absolute inset-x-6 bottom-6 mx-auto max-w-[480px] text-center text-[13px] leading-[1.25] text-white short:hidden">
                          <RichText value={packsSection.note} />
                        </p>
                      </>
                    ) : (
                      <div className="pw-fit absolute top-1/2 left-1/2 h-[900px] w-[1440px] -translate-x-1/2 -translate-y-1/2 scale-[var(--fit,1)]">
                        {focus}
                        <div className="pw-pill absolute inset-x-0 top-[100px] flex justify-center text-white">
                          <Pill>{packsSection.pill}</Pill>
                        </div>
                        <div className="absolute inset-x-0 top-[232px] flex justify-center gap-5">{labels}</div>
                        <p className="pw-note absolute top-[795px] left-1/2 w-[480px] -translate-x-1/2 text-center text-[16px] leading-[1.25] font-medium text-white">
                          <RichText value={packsSection.note} />
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Window chrome, drawn at 1/0.45 size so it reads normally once the window shrinks. */}
                  <div className="pw-chrome pointer-events-none absolute inset-0 opacity-0">
                    <div className={`absolute inset-0 border-white ${narrow ? 'border-[16px] border-t-[80px]' : 'border-[18px] border-t-[80px]'}`} />
                    <div className="pw-bar pointer-events-auto absolute inset-x-0 top-0 flex h-[80px] cursor-grab items-center px-[22px] select-none active:cursor-grabbing">
                      <WindowDots size={26} onClose={() => api.current?.close()} />
                      <p className="absolute left-1/2 -translate-x-1/2 text-[34px] font-semibold text-red">{desktop.packsFile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </RetroDesktop>

            {/* Tube glass: scanlines, a warm vignette and a curved reflection, shown as the screen shrinks */}
            <div
              className="pk-crt-glass pointer-events-none absolute inset-0 z-[200] opacity-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 3px), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(30,12,0,0.5) 100%), radial-gradient(ellipse 70% 45% at 30% 12%, rgba(255,255,255,0.2), rgba(255,255,255,0) 70%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
