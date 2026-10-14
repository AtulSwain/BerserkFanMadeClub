/**
 * CMS field definitions.
 *
 * Describes each editable entity so a future admin UI can render its forms
 * generically. This module is NOT routed and NOT imported by any public page —
 * the admin interface is intentionally unexposed until authentication exists.
 */
import type { EntityKind } from '@/data/types';

export type FieldType =
  | 'text'
  | 'longtext'
  | 'slug'
  | 'number'
  | 'spoiler'
  | 'canon'
  | 'claim' // a single classified fact
  | 'claims' // a list of classified facts
  | 'ref' // reference to another entity
  | 'refs'
  | 'sources'
  | 'asset'
  | 'stages'; // ordered timeline/sequence items

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  refKinds?: EntityKind[];
  help?: string;
}

const base: FieldDef[] = [
  { key: 'id', label: 'Slug', type: 'slug', required: true, help: 'Global, permanent. Never reuse.' },
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'epithet', label: 'Epithet', type: 'text' },
  { key: 'summary', label: 'Summary', type: 'longtext', required: true },
  { key: 'canon', label: 'Classification', type: 'canon', required: true },
  { key: 'spoiler', label: 'Spoiler level of the entry itself', type: 'spoiler', required: true },
  { key: 'sources', label: 'Sources', type: 'sources' },
  { key: 'asset', label: 'Licensed artwork', type: 'asset', help: 'Credit and license are mandatory. Never upload official art without a license.' },
  { key: 'related', label: 'See also', type: 'refs' },
];

export const CMS_SCHEMA: Partial<Record<EntityKind, FieldDef[]>> = {
  character: [
    ...base,
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'firstAppearance', label: 'First appearance', type: 'text' },
    { key: 'faction', label: 'Factions', type: 'refs', refKinds: ['faction'] },
    { key: 'status', label: 'Status', type: 'claim' },
    { key: 'age', label: 'Age', type: 'claim' },
    { key: 'weapons', label: 'Weapons', type: 'refs', refKinds: ['weapon'] },
    { key: 'abilities', label: 'Abilities', type: 'claims' },
    { key: 'arc', label: 'Character arc', type: 'claims' },
    { key: 'majorEvents', label: 'Major events', type: 'refs', refKinds: ['event'] },
    { key: 'appearances', label: 'Adaptation appearances', type: 'refs', refKinds: ['anime'] },
    { key: 'timeline', label: 'Development timeline', type: 'stages' },
  ],
  weapon: [
    ...base,
    { key: 'origin', label: 'Origin', type: 'claim' },
    { key: 'owner', label: 'Owner', type: 'ref', refKinds: ['character'] },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'function', label: 'Function', type: 'longtext' },
    { key: 'firstAppearance', label: 'First appearance', type: 'text' },
    { key: 'knownUsers', label: 'Known users', type: 'refs', refKinds: ['character'] },
    { key: 'battles', label: 'Important battles', type: 'refs', refKinds: ['event'] },
    { key: 'evolution', label: 'Evolution', type: 'claims' },
    { key: 'symbolism', label: 'Symbolism', type: 'claim' },
  ],
  apostle: [
    ...base,
    { key: 'humanForm', label: 'Human form', type: 'claim' },
    { key: 'apostleForm', label: 'Apostle form', type: 'claim' },
    { key: 'ability', label: 'Ability', type: 'claim' },
    { key: 'design', label: 'Design', type: 'claim' },
    { key: 'firstAppearance', label: 'First appearance', type: 'text' },
    { key: 'victims', label: 'Victims', type: 'claim' },
    { key: 'affiliation', label: 'Affiliation', type: 'text' },
    { key: 'death', label: 'Death', type: 'claim' },
    { key: 'battles', label: 'Battles', type: 'refs', refKinds: ['event'] },
    { key: 'symbolism', label: 'Symbolism', type: 'claim' },
  ],
  lore: [
    ...base,
    { key: 'definition', label: 'Definition', type: 'claim' },
    { key: 'origin', label: 'Origin', type: 'claim' },
    { key: 'knownFacts', label: 'Known facts', type: 'claims' },
    { key: 'appearances', label: 'Known appearances', type: 'refs' },
    { key: 'connections', label: 'Connections', type: 'refs' },
    { key: 'symbolism', label: 'Symbolism', type: 'claim' },
    { key: 'uncertainties', label: 'Uncertainties', type: 'claims' },
    { key: 'theories', label: 'Fan theories', type: 'claims', help: 'Every item must be classified fan-theory.' },
  ],
  event: [
    ...base,
    { key: 'arc', label: 'Arc', type: 'ref', refKinds: ['arc'] },
    { key: 'when', label: 'Date', type: 'text' },
    { key: 'location', label: 'Location', type: 'ref', refKinds: ['location'] },
    { key: 'participants', label: 'Participants', type: 'refs' },
    { key: 'volumes', label: 'Volumes', type: 'text' },
    { key: 'sequence', label: 'Panel sequence', type: 'stages' },
    { key: 'consequences', label: 'Consequences', type: 'claims' },
  ],
  volume: [
    ...base,
    { key: 'number', label: 'Number', type: 'number', required: true },
    { key: 'arc', label: 'Arc', type: 'ref', refKinds: ['arc'] },
    { key: 'chapters', label: 'Chapters (episodes)', type: 'stages' },
    { key: 'events', label: 'Major events', type: 'claims' },
    { key: 'characters', label: 'Characters', type: 'refs', refKinds: ['character'] },
    { key: 'locations', label: 'Locations', type: 'refs', refKinds: ['location'] },
    { key: 'weapons', label: 'Weapons', type: 'refs', refKinds: ['weapon'] },
    { key: 'revelations', label: 'Revelations', type: 'claims' },
    { key: 'adaptations', label: 'Adaptations', type: 'refs', refKinds: ['anime'] },
  ],
};

/** Publishing rules the admin UI must enforce before an entry goes live. */
export const PUBLISH_RULES = [
  'Every claim has a canon classification.',
  'Claims classified canon, manga-only or creator-interview cite at least one source.',
  'Fan theories are never stored in a canon field.',
  'Assets carry credit and license; unlicensed official artwork is rejected.',
  'Spoiler level of an entry is at least the highest level needed to identify it.',
];
