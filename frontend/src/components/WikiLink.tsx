import type { AnyEntity } from '@/data/types';
import { useIsHidden } from './Spoiler';

const BASE = 'https://berserk.fandom.com/wiki/';

/** Direct article URL when known, otherwise the wiki's own go-to-title search. */
export function wikiUrl(e: Pick<AnyEntity, 'name' | 'wiki'>): string {
  if (e.wiki) return BASE + encodeURIComponent(e.wiki.replace(/ /g, '_'));
  return `${BASE}Special:Search?go=Go&query=${encodeURIComponent(e.name)}`;
}

/** Link out to the community wiki for images and the full article. Hidden while the entry is a spoiler. */
export function WikiLink({ e }: { e: AnyEntity }) {
  const hidden = useIsHidden(e.spoiler);
  if (hidden) return null;
  return (
    <a className="wiki-link" href={wikiUrl(e)} target="_blank" rel="noopener noreferrer">
      <span className="wiki-link__label">Images &amp; full article</span>
      <span className="wiki-link__site">Berserk Wiki ↗</span>
    </a>
  );
}
