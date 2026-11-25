'use client';

import { BatteryMedium, Search, SlidersHorizontal, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { brand } from '@/content/site';

const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: brand.timezone, weekday: 'short', month: 'short', day: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: brand.timezone, hour: 'numeric', minute: '2-digit', hour12: true });

/** Status icons and the live Kuwait date and time, bottom right of the desktop. */
export default function Taskbar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="pointer-events-none absolute right-5 bottom-4 flex items-center gap-4 text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.55))] max-md:right-3 max-md:gap-3">
      <BatteryMedium className="h-5 w-5" strokeWidth={1.75} />
      <SlidersHorizontal className="h-4 w-4 max-md:hidden" strokeWidth={2} />
      <Search className="h-4 w-4 max-md:hidden" strokeWidth={2.25} />
      <Wifi className="h-4 w-4" strokeWidth={2.25} />
      <span className="text-[15px] font-semibold tabular-nums max-md:text-[13px]">
        {now ? `${dateFmt.format(now)}  ${timeFmt.format(now)}` : ' '}
      </span>
    </div>
  );
}
