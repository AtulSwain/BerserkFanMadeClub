import type { Asset } from './types';
import manifest from './panels.json';

interface PanelEntry {
  file: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl?: string;
}

const entries = (manifest as { panels: Record<string, PanelEntry> }).panels;

/**
 * Licensed artwork registered in panels.json, keyed by drawing key
 * (an entity id such as "guts", or a panel key such as "ev-eclipse-0").
 * Any key without an entry keeps its original placeholder drawing.
 */
export function assetFor(key: string | undefined): Asset | undefined {
  if (!key) return undefined;
  const e = entries[key];
  if (!e) return undefined;
  return {
    src: `${import.meta.env.BASE_URL}panels/${e.file}`,
    alt: e.alt,
    credit: e.credit,
    license: e.license,
    sourceUrl: e.sourceUrl,
  };
}
