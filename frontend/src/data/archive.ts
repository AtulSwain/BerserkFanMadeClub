/**
 * The archive repository.
 *
 * All pages read content through this module and never import raw data files
 * directly. To move to a database, implement `ArchiveRepository` against the API
 * (see /docs/CMS.md) and swap the exported instance — pages do not change.
 */
import type {
  AnyEntity,
  Apostle,
  Arc,
  AnimeProduction,
  Character,
  CraftTopic,
  EntityKind,
  GodHandMember,
  LocationEntry,
  LoreEntry,
  MusicEntry,
  Relationship,
  SimpleEntry,
  Source,
  StoryEvent,
  Volume,
  Weapon,
} from './types';
import { characters } from './characters';
import { relationships } from './relationships';
import { weapons } from './weapons';
import { apostles, godHand } from './apostles';
import { arcs, events } from './story';
import { lore } from './lore';
import { locations, factions, creatures, glossary, creators } from './world';
import { anime, music, craft } from './media';
import { volumes } from './volumes';
import { sources, sourceById } from './sources';

export interface ArchiveRepository {
  characters(): Character[];
  relationships(): Relationship[];
  weapons(): Weapon[];
  apostles(): Apostle[];
  godHand(): GodHandMember[];
  arcs(): Arc[];
  events(): StoryEvent[];
  lore(): LoreEntry[];
  locations(): LocationEntry[];
  factions(): SimpleEntry[];
  creatures(): SimpleEntry[];
  glossary(): SimpleEntry[];
  creators(): SimpleEntry[];
  anime(): AnimeProduction[];
  music(): MusicEntry[];
  craft(): CraftTopic[];
  volumes(): Volume[];
  sources(): Source[];
  get(id: string): AnyEntity | undefined;
  source(id: string): Source | undefined;
  /** Every entity that references `id`, in any field. */
  backlinks(id: string): AnyEntity[];
}

const all: AnyEntity[] = [
  ...characters,
  ...weapons,
  ...apostles,
  ...godHand,
  ...arcs,
  ...events,
  ...lore,
  ...locations,
  ...factions,
  ...creatures,
  ...glossary,
  ...creators,
  ...anime,
  ...music,
  ...craft,
  ...volumes,
];

const byId = new Map<string, AnyEntity>();
for (const e of all) {
  if (import.meta.env.DEV && byId.has(e.id)) console.warn(`[archive] duplicate id: ${e.id}`);
  byId.set(e.id, e);
}

/** Collect every string id referenced anywhere inside an entity. */
function referencedIds(e: AnyEntity): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      if (byId.has(v) && v !== e.id) out.add(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(e);
  return out;
}

const backlinkIndex = new Map<string, AnyEntity[]>();
for (const e of all) {
  for (const ref of referencedIds(e)) {
    const list = backlinkIndex.get(ref) ?? [];
    list.push(e);
    backlinkIndex.set(ref, list);
  }
}

export const archive: ArchiveRepository = {
  characters: () => characters,
  relationships: () => relationships,
  weapons: () => weapons,
  apostles: () => apostles,
  godHand: () => godHand,
  arcs: () => arcs,
  events: () => events,
  lore: () => lore,
  locations: () => locations,
  factions: () => factions,
  creatures: () => creatures,
  glossary: () => glossary,
  creators: () => creators,
  anime: () => anime,
  music: () => music,
  craft: () => craft,
  volumes: () => volumes,
  sources: () => sources,
  get: (id) => byId.get(id),
  source: (id) => sourceById.get(id),
  backlinks: (id) => backlinkIndex.get(id) ?? [],
};

export const allEntities = all;

export const KIND_LABEL: Record<EntityKind, string> = {
  character: 'Character',
  faction: 'Faction',
  apostle: 'Apostle',
  godhand: 'God Hand',
  weapon: 'Weapon',
  location: 'Location',
  arc: 'Arc',
  event: 'Event',
  lore: 'Lore',
  volume: 'Volume',
  anime: 'Anime',
  music: 'Music',
  craft: 'Manga Craft',
  creature: 'Creature',
  glossary: 'Glossary',
  creator: 'Production',
};

/** Canonical URL for any entity. */
export function hrefFor(e: Pick<AnyEntity, 'id' | 'kind'>): string {
  switch (e.kind) {
    case 'character': return `/characters/${e.id}`;
    case 'weapon': return `/weapons/${e.id}`;
    case 'apostle': return `/apostles/${e.id}`;
    case 'godhand': return `/god-hand/${e.id}`;
    case 'arc': return `/chronology#${e.id}`;
    case 'event': return `/events/${e.id}`;
    case 'lore': return `/lore/${e.id}`;
    case 'location': return `/atlas/${e.id}`;
    case 'volume': return `/volumes/${e.id}`;
    case 'anime': return `/anime#${e.id}`;
    case 'music': return `/music#${e.id}`;
    case 'craft': return `/craft#${e.id}`;
    case 'faction': return `/factions#${e.id}`;
    case 'creature': return `/creatures#${e.id}`;
    case 'glossary': return `/glossary#${e.id}`;
    case 'creator': return `/production#${e.id}`;
  }
}

export function nameOf(id: string): string {
  return byId.get(id)?.name ?? id.replace(/-/g, ' ');
}
