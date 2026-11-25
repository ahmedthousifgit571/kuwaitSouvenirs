'use client';

import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/** Keeps ScrollTrigger in step with Lenis. Must sit inside the Lenis provider. */
function ScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/** Lenis smooth scroll, driven by GSAP's ticker. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<LenisRef>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // Read the instance on every tick: it is created after this effect first runs.
    const tick = (time: number) => ref.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.1 }}>
      <ScrollSync />
      {children}
    </ReactLenis>
  );
}
