import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SpoilerLevel } from '@/data/types';

export const SPOILER_LABELS: Record<SpoilerLevel, string> = {
  0: 'No spoilers',
  1: 'Partial spoilers',
  2: 'Full archive',
};

export const SPOILER_HINTS: Record<SpoilerLevel, string> = {
  0: 'Safe before reading volume 1. Golden Age outcomes and everything after are hidden.',
  1: 'Reveals the Golden Age and its ending. Later arcs stay hidden.',
  2: 'Everything in the archive is visible, through the latest published chapters.',
};

interface Ctx {
  level: SpoilerLevel;
  setLevel: (l: SpoilerLevel) => void;
}

const SpoilerContext = createContext<Ctx>({ level: 0, setLevel: () => {} });
const KEY = 'berserk-archive:spoiler-level';

function read(): SpoilerLevel {
  try {
    const v = Number(localStorage.getItem(KEY));
    return v === 1 || v === 2 ? v : 0;
  } catch {
    return 0;
  }
}

export function SpoilerProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<SpoilerLevel>(read);
  const setLevel = useCallback((l: SpoilerLevel) => setLevelState(l), []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, String(level));
    } catch {
      /* storage unavailable — default stays in memory */
    }
    document.documentElement.dataset.spoiler = String(level);
  }, [level]);

  const value = useMemo(() => ({ level, setLevel }), [level, setLevel]);
  return <SpoilerContext.Provider value={value}>{children}</SpoilerContext.Provider>;
}

export const useSpoilers = () => useContext(SpoilerContext);
