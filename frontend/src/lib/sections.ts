import type { ArtVariant } from '@/data/types';

/** The archive's table of contents. Folio numbers are stable "page numbers". */
export interface Section {
  no: string;
  title: string;
  to: string;
  page: number;
  blurb: string;
  art: ArtVariant;
}

export const INDEX: Section[] = [
  { no: '01', title: 'Origins', to: '/origins', page: 10, blurb: 'Kentaro Miura, the 1988 prototype and the long serialization.', art: 'hand' },
  { no: '02', title: 'Chronology', to: '/chronology', page: 20, blurb: 'Six arcs laid end to end as chapter dividers.', art: 'landscape' },
  { no: '03', title: 'Characters', to: '/characters', page: 30, blurb: 'Dossiers in the manner of character sheets.', art: 'swordsman' },
  { no: '04', title: 'Factions', to: '/factions', page: 40, blurb: 'Hawks, knights, churches and crowns.', art: 'crowd' },
  { no: '05', title: 'Apostles', to: '/apostles', page: 50, blurb: 'Those who gave up what they loved.', art: 'beast' },
  { no: '06', title: 'God Hand', to: '/god-hand', page: 60, blurb: 'Five positions in the dark.', art: 'eclipse' },
  { no: '07', title: 'Weapons', to: '/weapons', page: 70, blurb: 'An arsenal drawn as blueprints.', art: 'sword' },
  { no: '08', title: 'Locations', to: '/atlas', page: 80, blurb: 'A hand-drawn atlas of the continent.', art: 'castle' },
  { no: '09', title: 'Creatures', to: '/creatures', page: 90, blurb: 'Trolls, elves and things from the sea.', art: 'beast' },
  { no: '10', title: 'Magic', to: '/lore/magic', page: 100, blurb: 'Witchcraft, od and the elemental kings.', art: 'witch' },
  { no: '11', title: 'Lore', to: '/lore', page: 110, blurb: 'A forbidden manuscript of the world’s rules.', art: 'egg' },
  { no: '12', title: 'Manga Craft', to: '/craft', page: 120, blurb: 'How Berserk was drawn.', art: 'hand' },
  { no: '13', title: 'Anime', to: '/anime', page: 130, blurb: 'Every adaptation, 1997 to 2022.', art: 'hawk' },
  { no: '14', title: 'Music', to: '/music', page: 140, blurb: 'Hirasawa, Sagisu and the sound of the Hawk.', art: 'storm' },
  { no: '15', title: 'Production', to: '/production', page: 150, blurb: 'Creators, studios and the bibliography.', art: 'figure' },
  { no: '16', title: 'Glossary', to: '/glossary', page: 160, blurb: 'Terms of the archive.', art: 'tower' },
];
