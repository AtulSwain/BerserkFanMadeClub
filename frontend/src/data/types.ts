/**
 * Archive data model.
 *
 * Every entity is shaped so it can be served unchanged by a database/API later
 * (see /database/schema.sql and /docs/CMS.md). Ids are globally unique slugs so
 * cross-references (`related`) work across entity kinds.
 */

/** How certain / where a piece of information comes from. Never mix these. */
export type CanonClass =
  | 'canon'
  | 'creator-interview'
  | 'anime-adaptation'
  | 'manga-only'
  | 'adaptation-difference'
  | 'inference'
  | 'fan-theory'
  | 'unknown';

/**
 * 0 = safe for someone who has not started the manga
 * 1 = partial: reveals Golden Age outcomes / early-arc developments
 * 2 = full archive: Eclipse fallout, Falconia, Fantasia and later
 */
export type SpoilerLevel = 0 | 1 | 2;

export type Confidence = 'high' | 'medium' | 'low';

/** A single claim. Facts are the unit the canon/source system attaches to. */
export interface Fact {
  text: string;
  canon: CanonClass;
  spoiler?: SpoilerLevel;
  sources?: string[]; // Source ids
}

/** Licensed / user-provided artwork. When absent, an original abstract placeholder is drawn. */
export interface Asset {
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl?: string;
}

export type EntityKind =
  | 'character'
  | 'faction'
  | 'apostle'
  | 'godhand'
  | 'weapon'
  | 'location'
  | 'arc'
  | 'event'
  | 'lore'
  | 'volume'
  | 'anime'
  | 'music'
  | 'craft'
  | 'creature'
  | 'glossary'
  | 'creator';

export interface BaseEntity {
  id: string;
  kind: EntityKind;
  name: string;
  /** Short one-line descriptor shown in indexes. */
  epithet?: string;
  summary: string;
  canon: CanonClass;
  spoiler: SpoilerLevel;
  related?: string[];
  sources?: string[];
  asset?: Asset;
  /** Seed for the placeholder art generator. */
  art?: ArtVariant;
  /** Exact Berserk Wiki article title when it differs from `name`. */
  wiki?: string;
}

export type ArtVariant =
  | 'swordsman'
  | 'figure'
  | 'woman'
  | 'hawk'
  | 'eclipse'
  | 'tower'
  | 'sea'
  | 'tree'
  | 'hand'
  | 'beast'
  | 'crowd'
  | 'landscape'
  | 'sword'
  | 'armor'
  | 'skull'
  | 'witch'
  | 'elf'
  | 'egg'
  | 'castle'
  | 'storm';

export interface Character extends BaseEntity {
  kind: 'character';
  title: string;
  firstAppearance: string;
  faction: string[];
  status: Fact;
  age: Fact;
  weapons: string[];
  abilities: Fact[];
  arc: Fact[];
  majorEvents: string[];
  appearances: string[];
  timeline: { stage: string; note: string; spoiler: SpoilerLevel; art?: ArtVariant }[];
}

export type RelationType = 'ally' | 'conflict' | 'hatred' | 'historical' | 'unknown';

export interface Relationship {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  label: string;
  note: Fact;
  mutual?: boolean;
}

export interface Weapon extends BaseEntity {
  kind: 'weapon';
  origin: Fact;
  owner: string;
  material: string;
  size: string;
  function: string;
  firstAppearance: string;
  knownUsers: string[];
  battles: string[];
  evolution: Fact[];
  symbolism: Fact;
  /** Blueprint drawing id */
  diagram: 'greatsword' | 'arm' | 'crossbow' | 'bomb' | 'armor' | 'behelit' | 'swordbehelit' | 'staff' | 'cloak';
}

export interface Apostle extends BaseEntity {
  kind: 'apostle';
  humanForm: Fact;
  apostleForm: Fact;
  ability: Fact;
  design: Fact;
  firstAppearance: string;
  victims: Fact;
  affiliation: string;
  death: Fact;
  battles: string[];
  symbolism: Fact;
}

export interface GodHandMember extends BaseEntity {
  kind: 'godhand';
  position: number;
  aspect: string;
  humanOrigin: Fact;
  appearance: Fact;
  domain: Fact;
  knownActions: Fact[];
}

export interface LocationEntry extends BaseEntity {
  kind: 'location';
  region: string;
  /** Position on the schematic atlas, 0–1000 x 0–700. Approximate. */
  map: { x: number; y: number };
  symbol: 'castle' | 'tower' | 'tree' | 'port' | 'ruin' | 'city' | 'forest' | 'void' | 'mountain';
  facts: Fact[];
}

export interface Arc extends BaseEntity {
  kind: 'arc';
  numeral: string;
  volumes: string;
  beginning: Fact;
  events: string[];
  characters: string[];
  locations: string[];
  battles: string[];
  objects: string[];
  consequences: Fact[];
}

export interface StoryEvent extends BaseEntity {
  kind: 'event';
  arc: string;
  when: string;
  location: string;
  participants: string[];
  sequence: { caption: string; text: string; spoiler: SpoilerLevel; art: ArtVariant }[];
  consequences: Fact[];
  volumes: string;
}

export interface LoreEntry extends BaseEntity {
  kind: 'lore';
  definition: Fact;
  origin: Fact;
  knownFacts: Fact[];
  appearances: string[];
  connections: string[];
  symbolism: Fact;
  uncertainties: Fact[];
  theories: Fact[];
}

export interface Volume extends BaseEntity {
  kind: 'volume';
  number: number;
  arc: string;
  era: 'miura' | 'studio-gaga';
  events: Fact[];
  characters: string[];
  locations: string[];
  weapons: string[];
  revelations: Fact[];
  adaptations: string[];
  /** Chapter (episode) titles are stored in the CMS; empty here until verified. */
  chapters: { number: string; title: string }[];
  detail: 'stub' | 'partial' | 'complete';
}

export interface AnimeProduction extends BaseEntity {
  kind: 'anime';
  year: string;
  format: string;
  episodes: string;
  studio: string;
  director: string;
  music: string;
  visualStyle: Fact;
  changes: Fact[];
  strengths: string[];
  weaknesses: string[];
  productionNotes: Fact[];
  covers: string;
  parts?: { name: string; detail: string }[];
}

export interface MusicEntry extends BaseEntity {
  kind: 'music';
  artist: string;
  work: string;
  year: string;
  role: string;
  confidence: Confidence;
}

export interface CraftTopic extends BaseEntity {
  kind: 'craft';
  numeral: string;
  body: Fact[];
  margin?: string;
}

export interface SimpleEntry extends BaseEntity {
  kind: 'faction' | 'creature' | 'glossary' | 'creator';
  facts: Fact[];
}

export type SourceType =
  | 'Manga'
  | 'Creator Interview'
  | 'Official Guidebook'
  | 'Publisher Statement'
  | 'Anime'
  | 'Film'
  | 'Soundtrack'
  | 'Secondary';

export interface Source {
  id: string;
  title: string;
  type: SourceType;
  publication: string;
  date: string;
  url?: string;
  confidence: Confidence;
  status: 'Primary source' | 'Secondary source' | 'Needs verification';
  note?: string;
}

export type AnyEntity =
  | Character
  | Weapon
  | Apostle
  | GodHandMember
  | LocationEntry
  | Arc
  | StoryEvent
  | LoreEntry
  | Volume
  | AnimeProduction
  | MusicEntry
  | CraftTopic
  | SimpleEntry;
