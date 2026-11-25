'use client';

// The loader tells the hero when to start its entrance. If the loader is skipped,
// the signal fires straight away. Late subscribers still get called.

let fired = false;
const listeners = new Set<() => void>();

export function startIntro() {
  if (fired) return;
  fired = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntro(fn: () => void) {
  if (fired) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function introSkipped() {
  return typeof document !== 'undefined' && document.documentElement.dataset.intro === 'skip';
}
