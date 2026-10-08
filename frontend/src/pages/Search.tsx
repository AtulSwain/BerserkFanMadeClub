import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Page, Xref } from '@/components/Page';
import { Spoiler } from '@/components/Spoiler';
import { search, group, connections } from '@/lib/search';
import { archive, hrefFor, KIND_LABEL } from '@/data/archive';
import type { AnyEntity } from '@/data/types';

function Block({ title, items }: { title: string; items: AnyEntity[] }) {
  const uniq = Array.from(new Map(items.map((i) => [i.id, i])).values());
  if (!uniq.length) return null;
  return (
    <section className="conn">
      <h3 className="label">{title}</h3>
      <ul className="plain-list">
        {uniq.map((e) => (
          <li key={e.id}>
            <Xref id={e.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);
  const hits = useMemo(() => search(q), [q]);
  const groups = useMemo(() => group(hits), [hits]);
  const top = hits[0]?.entity;
  const conn = top ? connections(top) : null;
  const animeOf = top && 'appearances' in top ? (top.appearances as string[]).map((id) => archive.get(id)).filter(Boolean) as AnyEntity[] : [];

  return (
    <Page chapter="Search" folio={900}>
      <form
        className="search-page__form"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(draft ? { q: draft } : {});
        }}
      >
        <label htmlFor="q" className="label">Search the archive</label>
        <input id="q" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Guts" autoComplete="off" />
      </form>

      {!q && <p className="annot">Type a name — a person, a place, a weapon, a song.</p>}
      {q && !hits.length && <p className="annot">No entries match “{q}”.</p>}

      {top && conn && (
        <div className="search-top">
          <div className="search-top__main panel panel--paper">
            <span className="panel__caption">{KIND_LABEL[top.kind]}</span>
            <h1 className="search-top__name">
              <Spoiler level={top.spoiler}>
                <Link to={hrefFor(top)}>{top.name}</Link>
              </Spoiler>
            </h1>
            <p className="book">
              <Spoiler level={top.spoiler}>{top.summary}</Spoiler>
            </p>
            <Link to={hrefFor(top)} className="bracket"><span>Open entry</span></Link>
          </div>
          <div className="search-top__conn">
            <Block title="Related events" items={conn.events} />
            <Block title="Weapons" items={conn.weapons} />
            {conn.relationships.length > 0 && (
              <section className="conn">
                <h3 className="label">Relationships</h3>
                <ul className="plain-list">
                  {conn.relationships.map((r) => (
                    <li key={r.id}>
                      <Xref id={r.from === top.id ? r.to : r.from} /> — <Spoiler level={r.note.spoiler}>{r.label}</Spoiler>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <Block title="Chapters & volumes" items={conn.volumes} />
            <Block title="Anime appearances" items={[...conn.anime, ...animeOf]} />
            <Block title="Lore connections" items={conn.lore} />
            <Block title="Also referenced by" items={conn.other} />
          </div>
        </div>
      )}

      {groups.length > 0 && (
        <div className="search-all">
          <h2 className="section-title" style={{ marginBottom: 12 }}>All results</h2>
          {groups.map((g) => (
            <section key={g.kind} className="search-group">
              <h3 className="label">{KIND_LABEL[g.kind]} · {g.hits.length}</h3>
              <ul>
                {g.hits.map(({ entity }) => (
                  <li key={entity.id}>
                    <Spoiler level={entity.spoiler}>
                      <Link to={hrefFor(entity)} className="search-hit">
                        <span className="search-hit__name">{entity.name}</span>
                        {entity.epithet && <span className="search-hit__ep">{entity.epithet}</span>}
                      </Link>
                    </Spoiler>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Page>
  );
}
