/**
 * Every place on the site that shows a picture, and the image file name it expects.
 *
 * Drop `<key>.jpg` (or .png / .webp / .avif) into `src/assets/panels/` and that
 * picture replaces the drawing. Pages build their keys with `slotKey` below, so
 * this list and the site can never disagree.
 *
 * Run `npm run panels` to regenerate the checklist (src/assets/panels/SLOTS.md).
 */
import { characters } from './characters';
import { apostles } from './apostles';
import { arcs, events } from './story';
import { factions, creatures, creators } from './world';
import { anime } from './media';
import { volumes } from './volumes';
import { INDEX, INDEX_LAYOUT } from '../lib/sections';

export const slotKey = {
  character: (id: string) => id,
  characterStage: (id: string, i: number) => `${id}-stage-${i + 1}`,
  event: (id: string) => id,
  eventPanel: (id: string, i: number) => `${id}-panel-${i + 1}`,
  arc: (id: string) => id,
  arcGutter: (nextArcId: string) => `${nextArcId}-gutter`,
  apostleHuman: (id: string) => `${id}-human`,
  apostleForm: (id: string) => `${id}-apostle`,
  index: (title: string) => `index-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  entity: (id: string) => id,
};

export interface Slot {
  key: string;
  section: string;
  where: string;
  /** Page to open in the browser to see it, e.g. /characters/guts */
  page: string;
  /** Rough shape so you can crop sensibly. */
  shape: 'portrait' | 'landscape' | 'square' | 'tall strip' | 'wide strip';
}

export function listSlots(): Slot[] {
  const out: Slot[] = [];
  const add = (s: Slot) => out.push(s);

  add({ key: 'cover', section: 'Cover', where: 'Big swordsman panel on the cover', page: '/', shape: 'portrait' });
  add({ key: 'cover-a', section: 'Cover', where: 'Small panel, left (eclipse)', page: '/', shape: 'landscape' });
  add({ key: 'cover-b', section: 'Cover', where: 'Small panel, right (hawk)', page: '/', shape: 'square' });
  add({ key: 'origins-miura', section: 'Origins', where: 'Portrait beside the timeline', page: '/origins', shape: 'portrait' });

  INDEX.forEach((s, i) => {
    const layout = INDEX_LAYOUT[i];
    if (layout === 'xl' || layout === 'tall') {
      add({ key: slotKey.index(s.title), section: 'Archive index', where: `Index tile “${s.title}”`, page: '/archive', shape: layout === 'xl' ? 'square' : 'tall strip' });
    }
  });

  for (const c of characters) {
    add({ key: slotKey.character(c.id), section: 'Characters', where: `${c.name} — portrait (dossier + cast strip)`, page: `/characters/${c.id}`, shape: 'portrait' });
    c.timeline.forEach((t, i) =>
      add({ key: slotKey.characterStage(c.id, i), section: 'Characters', where: `${c.name} — development strip, stage ${i + 1}: ${t.stage}`, page: `/characters/${c.id}`, shape: 'portrait' }),
    );
  }

  for (const a of apostles) {
    add({ key: slotKey.apostleHuman(a.id), section: 'Apostles', where: `${a.name} — human form`, page: `/apostles/${a.id}`, shape: 'portrait' });
    add({ key: slotKey.apostleForm(a.id), section: 'Apostles', where: `${a.name} — apostle form`, page: `/apostles/${a.id}`, shape: 'portrait' });
  }

  arcs.forEach((a, i) => {
    add({ key: slotKey.arc(a.id), section: 'Chronology', where: `Arc ${a.numeral} ${a.name} — opening panel`, page: `/chronology#${a.id}`, shape: 'landscape' });
    if (i > 0) add({ key: slotKey.arcGutter(a.id), section: 'Chronology', where: `Narrow panel before arc ${a.numeral} ${a.name}`, page: '/chronology', shape: 'tall strip' });
  });

  for (const e of events) {
    add({ key: slotKey.event(e.id), section: 'Events', where: `${e.name} — full-screen background`, page: `/events/${e.id}`, shape: 'landscape' });
    e.sequence.forEach((p, i) =>
      add({ key: slotKey.eventPanel(e.id, i), section: 'Events', where: `${e.name} — panel ${i + 1}: “${p.text}”`, page: `/events/${e.id}`, shape: i === 1 ? 'portrait' : i === 4 ? 'wide strip' : 'landscape' }),
    );
  }

  for (const f of factions) add({ key: slotKey.entity(f.id), section: 'Factions', where: `${f.name} — banner`, page: `/factions#${f.id}`, shape: 'landscape' });
  for (const c of creatures) add({ key: slotKey.entity(c.id), section: 'Creatures', where: `${c.name} — plate`, page: `/creatures#${c.id}`, shape: 'landscape' });
  for (const c of creators) add({ key: slotKey.entity(c.id), section: 'Production', where: `${c.name} — portrait`, page: `/production#${c.id}`, shape: 'portrait' });
  for (const a of anime) add({ key: slotKey.entity(a.id), section: 'Anime', where: `${a.name} — still`, page: `/anime#${a.id}`, shape: 'landscape' });
  for (const v of volumes) add({ key: slotKey.entity(v.id), section: 'Volumes', where: `${v.name} — cover (shown when the book is open)`, page: `/volumes/${v.id}`, shape: 'portrait' });

  return out;
}
