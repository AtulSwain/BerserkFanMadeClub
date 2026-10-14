import type { AnyEntity, EntityKind } from '@/data/types';
import { allEntities, archive } from '@/data/archive';

export interface Hit {
  entity: AnyEntity;
  score: number;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .trim();

interface Doc {
  e: AnyEntity;
  name: string;
  epithet: string;
  body: string;
}

const docs: Doc[] = allEntities.map((e) => ({
  e,
  name: norm(e.name),
  epithet: norm(e.epithet ?? ''),
  body: norm(
    [
      e.summary,
      'title' in e ? String((e as { title?: string }).title ?? '') : '',
      'artist' in e ? String((e as { artist?: string }).artist ?? '') : '',
      'studio' in e ? String((e as { studio?: string }).studio ?? '') : '',
      'director' in e ? String((e as { director?: string }).director ?? '') : '',
      'music' in e && typeof (e as { music?: unknown }).music === 'string' ? String((e as { music: string }).music) : '',
      'work' in e ? String((e as { work?: string }).work ?? '') : '',
    ].join(' '),
  ),
}));

export function search(query: string, limit = 60): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const terms = q.split(/\s+/);
  const hits: Hit[] = [];
  for (const d of docs) {
    let score = 0;
    if (d.name === q) score += 100;
    else if (d.name.startsWith(q)) score += 60;
    else if (d.name.includes(q)) score += 40;
    for (const t of terms) {
      if (d.name.split(' ').some((w) => w.startsWith(t))) score += 12;
      if (d.epithet.includes(t)) score += 6;
      if (d.body.includes(t)) score += 3;
    }
    if (terms.every((t) => d.name.includes(t) || d.epithet.includes(t) || d.body.includes(t))) score += 5;
    else if (score < 40) score = 0;
    if (score > 0) hits.push({ entity: d.e, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export const GROUP_ORDER: EntityKind[] = [
  'character',
  'godhand',
  'apostle',
  'event',
  'arc',
  'weapon',
  'location',
  'lore',
  'faction',
  'creature',
  'volume',
  'anime',
  'music',
  'craft',
  'creator',
  'glossary',
];

export function group(hits: Hit[]) {
  const m = new Map<EntityKind, Hit[]>();
  for (const h of hits) {
    const list = m.get(h.entity.kind) ?? [];
    list.push(h);
    m.set(h.entity.kind, list);
  }
  return GROUP_ORDER.filter((k) => m.has(k)).map((k) => ({ kind: k, hits: m.get(k)! }));
}

/** For the top hit: every entity that points at it, grouped by role. */
export function connections(e: AnyEntity) {
  const back = archive.backlinks(e.id);
  const rels = archive.relationships().filter((r) => r.from === e.id || r.to === e.id);
  const pick = (k: EntityKind) => back.filter((b) => b.kind === k);
  return {
    events: pick('event'),
    weapons: [...pick('weapon'), ...('weapons' in e ? (e.weapons as string[]).map((id) => archive.get(id)).filter(Boolean) : [])] as AnyEntity[],
    volumes: pick('volume'),
    anime: pick('anime'),
    lore: pick('lore'),
    relationships: rels,
    other: back.filter((b) => !['event', 'weapon', 'volume', 'anime', 'lore'].includes(b.kind)),
  };
}
