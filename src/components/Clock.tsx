import { useEffect, useState } from 'react';
import { site } from '../data/site';

const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', timeZone: site.timeZone, hour12: false,
});

/** Rameez's local time, so clients know when he's likely awake. */
export function Clock() {
  const [now, setNow] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);
  const [h, m] = now.split(':');
  return (
    <span className="clock">
      {site.city} {h}<span className="clock-colon">:</span>{m}
    </span>
  );
}
