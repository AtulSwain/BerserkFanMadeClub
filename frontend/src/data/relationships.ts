import type { Relationship } from './types';
import { s0, s1, s2 } from './helpers';

export const relationships: Relationship[] = [
  { id: 'r-guts-casca', from: 'guts', to: 'casca', type: 'ally', mutual: true, label: 'Comrades, then lovers', note: s1('Their bond forms during the Golden Age; after the Eclipse Guts becomes her protector.') },
  { id: 'r-guts-griffith', from: 'guts', to: 'griffith', type: 'hatred', mutual: true, label: 'Friend turned enemy', note: s1('The central relationship of the series: the friend whose dream consumed everything Guts had.') },
  { id: 'r-guts-hawks', from: 'guts', to: 'band-of-the-hawk', type: 'historical', mutual: true, label: 'Raid Captain', note: s0('Guts served as the Hawks’ Raid Captain for roughly three years.', 'inference') },
  { id: 'r-griffith-casca', from: 'griffith', to: 'casca', type: 'conflict', label: 'Savior, then betrayer', note: s1('Casca’s devotion to Griffith predates Guts; what Griffith does at the Eclipse severs it.') },
  { id: 'r-griffith-hawks', from: 'griffith', to: 'band-of-the-hawk', type: 'conflict', label: 'Founder', note: s1('He founded the Hawks; he also offered them up.') },
  { id: 'r-guts-puck', from: 'guts', to: 'puck', type: 'ally', label: 'Companion', note: s0('Puck refuses to leave Guts despite every attempt to drive him away.') },
  { id: 'r-guts-schierke', from: 'guts', to: 'schierke', type: 'ally', label: 'Guide', note: s2('Schierke anchors Guts’ mind when the Berserker Armor takes over.') },
  { id: 'r-guts-farnese', from: 'guts', to: 'farnese', type: 'ally', label: 'Pursuer turned companion', note: s1('Farnese hunts Guts as a heretic before joining his company.') },
  { id: 'r-guts-serpico', from: 'guts', to: 'serpico', type: 'conflict', label: 'Wary ally', note: s2('Respect built through rivalry; Serpico joins for Farnese’s sake.') },
  { id: 'r-guts-isidro', from: 'guts', to: 'isidro', type: 'ally', label: 'Would-be student', note: s1('Isidro wants Guts to teach him; Guts mostly does not.') },
  { id: 'r-guts-skull', from: 'guts', to: 'skull-knight', type: 'unknown', label: 'Watcher', note: s0('The Skull Knight warns and aids Guts; his full motives are not explained.', 'canon') },
  { id: 'r-guts-zodd', from: 'guts', to: 'zodd', type: 'conflict', label: 'Rival', note: s0('Zodd seeks Guts out as a worthy opponent.') },
  { id: 'r-skull-griffith', from: 'skull-knight', to: 'griffith', type: 'hatred', label: 'Opposes the God Hand', note: s1('The Skull Knight is the God Hand’s declared enemy.') },
  { id: 'r-zodd-griffith', from: 'zodd', to: 'griffith', type: 'historical', label: 'Prophecy', note: s1('Zodd warned of a fate awaiting the Hawk; later serves him.') },
  { id: 'r-farnese-serpico', from: 'farnese', to: 'serpico', type: 'historical', mutual: true, label: 'Half-siblings', note: s2('Bound by a shared father and years of service.') },
  { id: 'r-schierke-farnese', from: 'schierke', to: 'farnese', type: 'ally', label: 'Teacher', note: s2('Schierke teaches Farnese magic.') },
  { id: 'r-rickert-griffith', from: 'rickert', to: 'griffith', type: 'conflict', label: 'Refusal', note: s2('Rickert declines to rejoin Griffith.') },
];
