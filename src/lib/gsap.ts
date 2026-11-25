'use client';

import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MorphSVGPlugin, ScrollToPlugin, Observer, CustomEase, Draggable, Flip);

CustomEase.create('ks', '0.16, 1, 0.3, 1');
CustomEase.create('ksInOut', '0.76, 0, 0.24, 1');

ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const REDUCED = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 64rem)'; // Tailwind lg
export const PHONE = '(max-width: 47.99rem)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// Touch screens have no hover, so an element shows its hover look while it crosses the middle of the screen.
export function liveWhileCentred(targets: HTMLElement[]) {
  return targets.map((trigger) => ScrollTrigger.create({ trigger, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-live' }));
}

export { gsap, ScrollTrigger, SplitText, MorphSVGPlugin, Draggable, Flip, useGSAP };
