import type { Asset } from './types';
import creditsFile from '../../../images/credits.json';

/**
 * Pictures in the top-level images/ folder, found automatically at build time.
 * The file name (without extension) is the slot key: `guts.jpg` → slot "guts".
 * images/IMAGE-LIST.md lists every name the site uses.
 */
const files = import.meta.glob('../../../images/*.{jpg,jpeg,png,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

interface Credit {
  alt?: string;
  credit?: string;
  license?: string;
  sourceUrl?: string;
}

const credits = (creditsFile as { credits: Record<string, Credit> }).credits ?? {};

const byKey = new Map<string, { url: string; file: string }>();
for (const [path, url] of Object.entries(files)) {
  const file = path.split('/').pop()!;
  const key = file.replace(/\.[^.]+$/, '').toLowerCase();
  byKey.set(key, { url, file });
}

export function assetFor(key: string | undefined): Asset | undefined {
  if (!key) return undefined;
  const hit = byKey.get(key.toLowerCase());
  if (!hit) return undefined;
  const c = credits[key] ?? {};
  return {
    src: hit.url,
    alt: c.alt ?? key.replace(/-/g, ' '),
    credit: c.credit ?? 'Credit needed',
    license: c.license ?? 'license not recorded',
    sourceUrl: c.sourceUrl,
  };
}

/** File name currently filling a slot, if any (used by the dev slot labels). */
export function fileFor(key: string): string | undefined {
  return byKey.get(key.toLowerCase())?.file;
}
