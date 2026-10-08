import { Link, useParams } from 'react-router-dom';
import { Page, PageHead, Xref, XrefList } from '@/components/Page';
import { FactList, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { InkArt } from '@/art/InkArt';
import { archive, nameOf } from '@/data/archive';
import type { ArtVariant, Volume } from '@/data/types';

const ART_BY_ARC: Record<string, ArtVariant> = {
  'arc-black-swordsman': 'swordsman',
  'arc-golden-age': 'hawk',
  'arc-conviction': 'tower',
  'arc-millennium-falcon': 'sea',
  'arc-fantasia': 'tree',
  'arc-current': 'storm',
};

function OpenBook({ v }: { v: Volume }) {
  const all = archive.volumes();
  const prev = all[v.number - 2];
  const next = all[v.number];
  return (
    <div className="book-open" key={v.id}>
      <div className="book-open__leaf book-open__leaf--l">
        <div className="book-open__cover panel panel--bleed panel--black">
          <InkArt variant={ART_BY_ARC[v.arc]} seed={v.id} label={`Volume ${v.number}`} />
          <span className="book-open__vol">{String(v.number).padStart(2, '0')}</span>
        </div>
        <span className="label" style={{ marginTop: 10, display: 'block' }}>
          {v.era === 'miura' ? 'Kentaro Miura' : 'Studio Gaga · supervised by Kouji Mori'} · <Xref id={v.arc} />
        </span>
        <span className={`detail-badge detail-badge--${v.detail}`}>entry: {v.detail}</span>
      </div>
      <div className="book-open__spine" aria-hidden="true" />
      <div className="book-open__leaf book-open__leaf--r">
        <span className="label">Contents</span>
        <h2 className="book-open__title">{v.name}</h2>
        <p className="book" style={{ fontSize: 17 }}>
          <Spoiler level={v.spoiler}>
            {v.summary}
            <SourceMarks ids={v.sources} />
          </Spoiler>
        </p>
        <dl className="spec spec--compact">
          <dt>Chapters</dt>
          <dd>
            {v.chapters.length ? (
              <ol className="plain-list">{v.chapters.map((c) => <li key={c.number}>{c.number} — {c.title}</li>)}</ol>
            ) : (
              <span className="muted">Episode list pending editorial verification.</span>
            )}
          </dd>
          <dt>Major events</dt>
          <dd><FactList facts={v.events} empty="—" /></dd>
          <dt>Characters</dt>
          <dd><XrefList ids={v.characters} /></dd>
          <dt>Locations</dt>
          <dd><XrefList ids={v.locations} /></dd>
          <dt>Weapons</dt>
          <dd><XrefList ids={v.weapons} /></dd>
          <dt>Revelations</dt>
          <dd><FactList facts={v.revelations} empty="—" /></dd>
          <dt>Adaptations</dt>
          <dd><XrefList ids={v.adaptations} /></dd>
        </dl>
        <nav className="pager" aria-label="Volumes">
          {prev ? <Link className="bracket" to={`/volumes/${prev.id}`}><span>← Vol. {prev.number}</span></Link> : <span />}
          <Link className="bracket" to="/volumes"><span>Close</span></Link>
          {next ? <Link className="bracket" to={`/volumes/${next.id}`}><span>Vol. {next.number} →</span></Link> : <span />}
        </nav>
      </div>
    </div>
  );
}

export default function Volumes() {
  const { id } = useParams();
  const vols = archive.volumes();
  const open = vols.find((v) => v.id === id);
  const arcs = archive.arcs();

  return (
    <Page chapter="12 · Volume index" folio={open ? 300 + open.number : 125}>
      <PageHead
        no="12·a"
        kicker="Chapter & volume index"
        title={
          <>
            The shelf
          </>
        }
        lede={`${vols.length} tankōbon volumes on file (extend the count in the CMS as new volumes publish). Volumes 1–41 were drawn by Kentaro Miura; later volumes are by Studio Gaga under Kouji Mori’s supervision. Pull a spine to open it.`}
      />
      {open && <OpenBook v={open} />}
      <div className="shelf" role="list">
        {arcs.map((a) => {
          const group = vols.filter((v) => v.arc === a.id);
          if (!group.length) return null;
          return (
            <div key={a.id} className="shelf__group" role="presentation">
              <span className="shelf__arc label">
                {a.numeral} · <Spoiler level={a.spoiler}>{nameOf(a.id)}</Spoiler>
              </span>
              <div className="shelf__row">
                {group.map((v) => (
                  <Link
                    key={v.id}
                    role="listitem"
                    to={`/volumes/${v.id}`}
                    className={`spine ${v.id === open?.id ? 'is-open' : ''} ${v.era === 'studio-gaga' ? 'spine--gaga' : ''} spine--${v.detail}`}
                    aria-label={`Volume ${v.number}`}
                    style={{ height: `${210 + ((v.number * 37) % 30)}px` }}
                  >
                    <span className="spine__brand">B</span>
                    <span className="spine__title">Berserk</span>
                    <span className="spine__num">{v.number}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="annot" style={{ marginTop: 18 }}>darker spines carry editorial content; pale spines are stubs awaiting the CMS</p>
    </Page>
  );
}
