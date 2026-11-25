'use client';

import { useEffect, useState } from 'react';
import { brand } from '@/content/site';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: brand.timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** Ticking clock in Kuwait time. Rendered on the client only so the server HTML never disagrees. */
export default function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={className}>
      Local time
      <br />
      <span className="tabular-nums">{now ?? '--:--:--'}</span> ({brand.timezoneLabel})
    </div>
  );
}
