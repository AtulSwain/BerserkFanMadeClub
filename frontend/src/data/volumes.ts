import type { Volume, Fact } from './types';
import { s0, s1, s2 } from './helpers';

/** Which arc a volume belongs to. Boundary volumes straddle two arcs; the later arc wins. */
function arcFor(n: number): string {
  if (n <= 2) return 'arc-black-swordsman';
  if (n <= 13) return 'arc-golden-age';
  if (n <= 21) return 'arc-conviction';
  if (n <= 34) return 'arc-millennium-falcon';
  if (n <= 41) return 'arc-fantasia';
  return 'arc-current';
}

type Detail = Partial<Pick<Volume, 'events' | 'characters' | 'locations' | 'weapons' | 'revelations' | 'adaptations' | 'summary'>> & { spoiler?: 0 | 1 | 2 };

const detail: Record<number, Detail> = {
  1: { spoiler: 0, summary: 'The Black Swordsman arrives. Puck is rescued; the Snake Baron falls.', events: [s0('Guts meets Puck.'), s0('Guts kills the Snake Baron.')], characters: ['guts', 'puck'], weapons: ['dragon-slayer', 'cannon-arm', 'repeating-crossbow'], revelations: [s0('Apostles exist and wear human faces.')], adaptations: ['anime-1997'] },
  2: { spoiler: 0, summary: 'The Count and his daughter Theresia.', events: [s0('Guts confronts the Count.')], characters: ['guts', 'puck', 'skull-knight'], revelations: [s0('The Skull Knight appears.')] },
  3: { spoiler: 1, summary: 'The God Hand descend; the Golden Age flashback begins.', events: [s1('Guts sees the God Hand.'), s0('The Golden Age begins with Guts’ birth.')], characters: ['guts', 'void', 'slan', 'ubik', 'conrad', 'griffith', 'casca'], revelations: [s1('Guts’ enemy is someone he once knew.')], adaptations: ['anime-1997', 'anime-films'] },
  12: { spoiler: 1, summary: 'The rescue, and the dark descending.', events: [s1('The Eclipse begins.')], characters: ['griffith', 'guts', 'casca'], adaptations: ['anime-1997', 'anime-films'] },
  13: { spoiler: 1, summary: 'The Eclipse.', events: [s1('The Band of the Hawk is sacrificed.'), s1('Femto is born.')], characters: ['griffith', 'guts', 'casca', 'skull-knight', 'zodd'], revelations: [s2('The full meaning of the Brand of Sacrifice.')], adaptations: ['anime-films', 'anime-memorial'] },
  14: { spoiler: 2, summary: 'Aftermath; the hunt begins; the Lost Children.', events: [s2('Guts leaves Casca in Godo’s care and begins hunting Apostles.')], characters: ['guts', 'godo', 'rickert', 'casca'] },
  21: { spoiler: 2, summary: 'The Incarnation at the Tower of Conviction.', events: [s2('Femto takes flesh.')], characters: ['guts', 'griffith', 'mozgus', 'farnese', 'serpico'], adaptations: ['anime-2016'] },
  35: { spoiler: 2, summary: 'A transformed world; Falconia.', events: [s2('Fantasia begins.')], characters: ['griffith', 'guts'] },
  40: { spoiler: 2, summary: 'Casca awakens.', events: [s2('Casca’s mind is restored in Elfhelm.')], characters: ['casca', 'guts', 'schierke', 'farnese'] },
  41: { spoiler: 2, summary: 'The final volume completed in Miura’s lifetime.', events: [s0('Published after Miura’s death in 2021.', 'canon')], characters: ['guts', 'casca'] },
};

const TOTAL = 42;

export const volumes: Volume[] = Array.from({ length: TOTAL }, (_, i) => {
  const n = i + 1;
  const d = detail[n] ?? {};
  const events: Fact[] = d.events ?? [];
  return {
    id: `vol-${String(n).padStart(2, '0')}`,
    kind: 'volume',
    number: n,
    name: `Volume ${String(n).padStart(2, '0')}`,
    summary: d.summary ?? 'Entry awaiting editorial content.',
    canon: 'canon',
    spoiler: d.spoiler ?? (n <= 2 ? 0 : n <= 13 ? 1 : 2),
    arc: arcFor(n),
    era: n <= 41 ? 'miura' : 'studio-gaga',
    events,
    characters: d.characters ?? [],
    locations: d.locations ?? [],
    weapons: d.weapons ?? [],
    revelations: d.revelations ?? [],
    adaptations: d.adaptations ?? [],
    chapters: [],
    detail: d.summary ? 'partial' : 'stub',
    sources: n <= 41 ? ['src-manga'] : ['src-manga', 'src-continuation'],
  } satisfies Volume;
});
