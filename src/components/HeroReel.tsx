'use client';

import { useRef } from 'react';
import Dhow from '@/components/art/Dhow';
import Sadu from '@/components/art/Sadu';
import Photo, { PhotoChip } from '@/components/Photo';
import { brand, hero, packs, photos, shopVisit, type Photo as PhotoData } from '@/content/site';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

// A new scene every STEP seconds (the wipe runs inside it). Kept quick so all four scenes go by
// in about 6s, before most people have scrolled past the hero.
const STEP = 1.5;
const WIPE = 0.6;

function Barcode({ className }: { className?: string }) {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1];
  let x = 0;
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className={className} aria-hidden>
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} width={w * 0.9} height="24" fill="currentColor" /> : null;
        x += w * 1.15;
        return r;
      })}
    </svg>
  );
}

// Caption chip on the reel's photos, sized to the reel (cqw), larger on narrow reels.
const CHIP = 'absolute bottom-[1.2cqw] left-[1.2cqw] px-[1.1cqw] py-[0.6cqw] text-[1.25cqw] shadow-[0_0.4cqw_1.2cqw_rgba(0,0,0,0.14)] @max-[600px]:bottom-[2.4cqw] @max-[600px]:left-[2.4cqw] @max-[600px]:px-[2.6cqw] @max-[600px]:py-[1.4cqw] @max-[600px]:text-[3.2cqw]';
// The same chip for the three small product cards in scene 1.
const CARD_CHIP = 'absolute bottom-[1cqw] left-[1cqw] px-[1cqw] py-[0.55cqw] text-[1.1cqw] shadow-[0_0.4cqw_1.2cqw_rgba(0,0,0,0.14)] @max-[600px]:bottom-[2cqw] @max-[600px]:left-[2cqw] @max-[600px]:px-[2cqw] @max-[600px]:py-[1.1cqw] @max-[600px]:text-[2.8cqw]';

/** Scene 1: a framed poster on brushed steel, the dhow model and three products. */
function PosterWall() {
  return (
    <div className="grid h-full grid-cols-2 bg-ink @max-[600px]:grid-cols-1 @max-[600px]:grid-rows-[1.4fr_1fr]">
      <div className="relative flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(100deg,#8d9196,#d8dbdf 22%,#a7abb0 38%,#eef0f2 55%,#9a9ea3 72%,#c9ccd0)' }}>
        <div className="absolute inset-y-0 left-[8%] w-[2cqw] bg-black/25" />
        <div className="absolute inset-y-0 right-[8%] w-[2cqw] bg-black/25" />
        <div className="relative aspect-[3/4] h-[82%] rounded-[0.4cqw] border-[1.1cqw] border-[#c4c7cb] shadow-[0_2cqw_4cqw_rgba(0,0,0,0.35)] @max-[600px]:h-[86%]">
          <div className="flex h-full flex-col bg-red p-[2.4cqw] text-white [--art-bg:var(--red)]">
            <p className="label text-[1.1cqw] @max-[600px]:text-[2.6cqw]">{brand.name}</p>
            <p className="mt-[2.2cqw] text-[3.6cqw] leading-[0.95] tracking-[-0.04em] @max-[600px]:text-[8cqw]">
              Take Kuwait
              <br />
              home.
            </p>
            <p className="it mt-[0.6cqw] text-[2.4cqw] leading-none @max-[600px]:text-[5.6cqw]">one keepsake at a time</p>
            <Dhow className="mt-auto w-full text-white" />
          </div>
        </div>
      </div>
      {/* Narrow reels drop the dhow panel and keep the three products under the poster. */}
      <div className="grid grid-rows-[1.1fr_1fr] @max-[600px]:grid-rows-1">
        <div className="relative overflow-hidden bg-[#efe3cc] @max-[600px]:hidden">
          <Photo photo={photos.dhow} sizes="50vw" />
          <p className="label absolute top-[1.6cqw] left-[1.6cqw] text-[0.9cqw] text-red">New in</p>
          <PhotoChip photo={photos.dhow} className={CHIP} />
        </div>
        <div className="grid grid-cols-3 gap-[1.6cqw] bg-ink p-[2cqw] @max-[600px]:gap-[3cqw] @max-[600px]:p-[4cqw]">
          {[photos.crystal, photos.flagMug, photos.towersTote].map((p) => (
            <div key={p.alt} className="relative overflow-hidden rounded-[0.6cqw] bg-[#efe3cc] @max-[600px]:rounded-[1.6cqw]">
              <Photo photo={p} sizes="(max-width: 767px) 30vw, 16vw" />
              <PhotoChip photo={p} className={CARD_CHIP} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Scene 2: a grid of product posts. */
function SocialGrid() {
  const card = 'relative overflow-hidden rounded-[0.5cqw] aspect-square';
  const post = (p: PhotoData) => (
    <div className={`${card} bg-[#efe3cc]`}>
      <Photo photo={p} sizes="(max-width: 767px) 45vw, 25vw" />
      <PhotoChip photo={p} className={CHIP} />
    </div>
  );
  return (
    <div className="flex h-full items-center justify-center bg-ink px-[12cqw] @max-[600px]:px-[7cqw]">
      <div className="grid w-full grid-cols-3 gap-[3cqw] @max-[600px]:grid-cols-2 @max-[600px]:gap-[4cqw]">
        {post(photos.caps)}
        {post(photos.kuwaitTote)}
        <div className={`${card} flex flex-col justify-between bg-red p-[1.4cqw] text-white`}>
          <p className="label text-[0.9cqw] @max-[600px]:text-[2cqw]">{packs[1].code}</p>
          <p className="text-[3.2cqw] leading-[0.9] tracking-[-0.04em] @max-[600px]:text-[7cqw]">
            Diwaniya
            <br />
            <span className="it">Box</span>
          </p>
          <div>
            <Barcode className="h-[2.4cqw] w-full text-white" />
            <p className="label mt-[0.6cqw] text-[0.9cqw] @max-[600px]:text-[2cqw]">from {packs[1].price}</p>
          </div>
        </div>
        {post(photos.skylineMugs)}
        {post(photos.tee)}
        {post(photos.barcodeMugs)}
      </div>
    </div>
  );
}

/** Scene 3: a gift label over a full Sadu weave. */
function GiftLabel() {
  const p = packs[1];
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <Sadu className="absolute inset-0 h-full w-full" scale={1.6} />
      <div className="relative w-[30cqw] rotate-[-4deg] rounded-[1.4cqw] bg-white p-[2cqw] text-red shadow-[0_2cqw_5cqw_rgba(0,0,0,0.35)] @max-[600px]:w-[70cqw] @max-[600px]:p-[5cqw]">
        <p className="it text-[3.4cqw] leading-none @max-[600px]:text-[9cqw]">{p.name}</p>
        <p className="mt-[1cqw] text-[1.1cqw] leading-[1.2] @max-[600px]:text-[3cqw]">
          A gahwa cup set, skyline chai glasses and a Kuwait mug, <span className="it">wrapped by hand.</span>
        </p>
        <div className="my-[1.6cqw] border-t-2 border-dashed border-blue" />
        <div className="label flex justify-between text-[0.9cqw] @max-[600px]:text-[2.4cqw]">
          <span>Price starts at:</span>
          <span>{p.price}</span>
        </div>
        <Barcode className="mt-[1cqw] h-[3.2cqw] w-full text-red @max-[600px]:h-[8cqw]" />
        <p className="label mt-[1cqw] text-[0.9cqw] @max-[600px]:text-[2.4cqw]">{p.code}</p>
      </div>
    </div>
  );
}

/** Scene 4: the shop itself, and where to find it. */
function ShopVisit() {
  return (
    <div className="grid h-full grid-cols-[1.15fr_1fr] bg-[#efe3cc] text-red @max-[600px]:grid-cols-1 @max-[600px]:grid-rows-[1fr_auto]">
      <div className="flex flex-col justify-between p-[3cqw] @max-[600px]:order-2 @max-[600px]:gap-[6cqw] @max-[600px]:p-[6cqw]">
        <p className="label text-[1.1cqw] @max-[600px]:hidden">{shopVisit.label}</p>
        <p className="text-[8.4cqw] leading-[0.9] tracking-[-0.04em] @max-[600px]:text-[15cqw]">
          {shopVisit.title}
          <br />
          <span className="it text-[1.08em]">{shopVisit.italic}</span>
        </p>
        <div className="label flex items-end justify-between border-t border-red pt-[1.2cqw] text-[1.1cqw] leading-[1.5] @max-[600px]:pt-[3cqw] @max-[600px]:text-[3.2cqw]">
          <ul>
            {shopVisit.places.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span>{shopVisit.city}</span>
        </div>
      </div>
      <div className="relative overflow-hidden @max-[600px]:order-1">
        <Photo photo={photos.shop} sizes="(max-width: 767px) 100vw, 48vw" />
      </div>
    </div>
  );
}

const SCENES = [PosterWall, SocialGrid, GiftLabel, ShopVisit];

/**
 * The showreel slot. Until a real film is supplied (`hero.reelVideo`), it plays a coded loop of
 * product scenes that wipe in one after another.
 */
export default function HeroReel() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (hero.reelVideo) return;
      const scenes = gsap.utils.toArray<HTMLElement>('.reel-scene', root.current);
      const inners = scenes.map((s) => s.firstElementChild as HTMLElement);
      let current = 0;
      gsap.set(scenes, { clipPath: 'inset(0% 0% 0% 100%)', zIndex: 0, visibility: 'hidden' });
      gsap.set(scenes[0], { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1, visibility: 'visible' });
      const drift = (el: HTMLElement) => gsap.fromTo(el, { scale: 1.08 }, { scale: 1, duration: STEP + 0.6, ease: 'power1.out' });
      drift(inners[0]);

      const advance = () => {
        const prev = current;
        current = (current + 1) % scenes.length;
        gsap.set(scenes[current], { zIndex: 2, clipPath: 'inset(0% 0% 0% 100%)', visibility: 'visible' });
        gsap.to(scenes[current], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: WIPE,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(scenes[prev], { zIndex: 0, clipPath: 'inset(0% 0% 0% 100%)', visibility: 'hidden' });
            gsap.set(scenes[current], { zIndex: 1 });
          },
        });
        gsap.to(inners[prev], { scale: 1.12, duration: WIPE, ease: 'power3.inOut' });
        drift(inners[current]);
      };

      const loop = gsap.timeline({ repeat: -1, paused: true }).call(advance, [], STEP).to({}, { duration: 0.001 }, STEP);
      // Only run while it is on screen. The reel sits on a sticky stage, so measure the whole hero
      // section: the reel's own box would end the trigger just as it reaches full bleed.
      ScrollTrigger.create({
        trigger: root.current!.closest('section') ?? root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
    },
    { scope: root },
  );

  if (hero.reelVideo) {
    return (
      <div ref={root} className="h-full w-full bg-ink">
        <video className="h-full w-full object-cover" src={hero.reelVideo} autoPlay muted loop playsInline />
      </div>
    );
  }

  return (
    <div ref={root} className="@container-[size] relative h-full w-full overflow-hidden bg-ink" aria-label="Showreel of Souvenir & More products" role="img">
      {SCENES.map((Scene, i) => (
        <div key={i} className="reel-scene absolute inset-0 overflow-hidden">
          <div className="h-full w-full will-change-transform">
            <Scene />
          </div>
        </div>
      ))}
    </div>
  );
}
