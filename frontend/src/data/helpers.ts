import type { CanonClass, Fact, SpoilerLevel } from './types';

/** Shorthand for building a classified claim. Defaults to manga canon, spoiler-safe. */
export function fact(
  text: string,
  canon: CanonClass = 'canon',
  spoiler: SpoilerLevel = 0,
  sources: string[] = canon === 'canon' || canon === 'manga-only' ? ['src-manga'] : [],
): Fact {
  return { text, canon, spoiler, sources };
}

export const s0 = (text: string, canon: CanonClass = 'canon') => fact(text, canon, 0);
export const s1 = (text: string, canon: CanonClass = 'canon') => fact(text, canon, 1);
export const s2 = (text: string, canon: CanonClass = 'canon') => fact(text, canon, 2);
