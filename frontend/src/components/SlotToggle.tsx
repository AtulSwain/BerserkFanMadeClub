import { useEffect, useState } from 'react';

const KEY = 'berserk-archive:show-slots';

/**
 * Dev-only switch (npm run dev): labels every picture with the file name it
 * expects in src/assets/panels/, so you can see what to drop in where.
 */
export function SlotToggle() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.dataset.slots = on ? 'on' : 'off';
    try {
      localStorage.setItem(KEY, on ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [on]);
  return (
    <button type="button" className="slot-toggle" onClick={() => setOn((v) => !v)} aria-pressed={on}>
      {on ? 'Hide image names' : 'Show image names'}
    </button>
  );
}
