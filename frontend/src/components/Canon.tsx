import { Link } from 'react-router-dom';
import type { CanonClass, Fact } from '@/data/types';
import { archive } from '@/data/archive';
import { Spoiler } from './Spoiler';

export const CANON_LABEL: Record<CanonClass, string> = {
  canon: 'Canon',
  'creator-interview': 'Creator Interview',
  'anime-adaptation': 'Anime Adaptation',
  'manga-only': 'Manga-only',
  'adaptation-difference': 'Adaptation Difference',
  inference: 'Inference',
  'fan-theory': 'Fan Theory',
  unknown: 'Unknown',
};

export const CANON_HINT: Record<CanonClass, string> = {
  canon: 'Stated or shown in the manga.',
  'creator-interview': 'Said by Kentaro Miura or the official creative team outside the manga.',
  'anime-adaptation': 'Comes from an anime adaptation, not the manga.',
  'manga-only': 'Appears in the manga only (e.g. magazine-only material).',
  'adaptation-difference': 'Describes a difference between manga and an adaptation.',
  inference: 'An editorial reading of the text. Reasonable, not stated outright.',
  'fan-theory': 'Speculation from the fan community. Not confirmed.',
  unknown: 'Not established by any source.',
};

export function CanonTag({ c }: { c: CanonClass }) {
  return (
    <span className={`canon canon--${c}`} title={CANON_HINT[c]}>
      <span>{CANON_LABEL[c]}</span>
    </span>
  );
}

/** Superscript source markers linking to the bibliography. */
export function SourceMarks({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null;
  return (
    <>
      {ids.map((id) => {
        const s = archive.source(id);
        if (!s) return null;
        const n = archive.sources().indexOf(s) + 1;
        return (
          <Link key={id} to={`/sources#${id}`} className="fact__src" title={`${s.title} — ${s.status}`}>
            [{n}]
          </Link>
        );
      })}
    </>
  );
}

export function FactLine({ f, showTag = true }: { f: Fact; showTag?: boolean }) {
  return (
    <div className={`fact ${f.canon === 'fan-theory' ? 'fact--theory' : ''}`}>
      <span className="fact__text">
        <Spoiler level={f.spoiler}>
          {f.text}
          <SourceMarks ids={f.sources} />
        </Spoiler>
      </span>
      {showTag && <CanonTag c={f.canon} />}
    </div>
  );
}

export function FactList({ facts, empty = '—' }: { facts: Fact[]; empty?: string }) {
  if (!facts.length) return <p className="muted">{empty}</p>;
  return (
    <div>
      {facts.map((f, i) => (
        <FactLine key={i} f={f} />
      ))}
    </div>
  );
}

export function CanonLegend() {
  return (
    <div className="canon-legend">
      {(Object.keys(CANON_LABEL) as CanonClass[]).map((c) => (
        <div key={c} className="canon-legend__row">
          <CanonTag c={c} />
          <span>{CANON_HINT[c]}</span>
        </div>
      ))}
    </div>
  );
}
