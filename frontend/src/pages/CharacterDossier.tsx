import { Link, useParams } from 'react-router-dom';
import { Page, Reveal, Xref, XrefList, InkRule } from '@/components/Page';
import { FactLine, FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { InkArt } from '@/art/InkArt';
import { Stamp } from '@/components/Manga';
import { archive, hrefFor } from '@/data/archive';
import type { Character } from '@/data/types';
import NotFound from './NotFound';

export default function CharacterDossier() {
  const { id } = useParams();
  const c = archive.get(id ?? '') as Character | undefined;
  if (!c || c.kind !== 'character') return <NotFound />;

  const idx = archive.characters().indexOf(c);
  const rels = archive.relationships().filter((r) => r.from === c.id || r.to === c.id);
  const prev = archive.characters()[idx - 1];
  const next = archive.characters()[idx + 1];

  return (
    <>
      <Page chapter={`Dossier · No. ${String(idx + 1).padStart(3, '0')}`} folio={32 + idx} className="dossier-page">
        <div className="dossier">
          <Reveal className="dossier__portrait taped">
            <div className="panel panel--bleed panel--black dossier__frame">
              <span className="panel__caption">Fig. {String(idx + 1).padStart(2, '0')}</span>
              <InkArt variant={c.art} seed={c.id} asset={c.asset} label={c.name} />
            </div>
            <span className="annot dossier__portrait-note">
              {c.asset ? c.asset.credit : 'placeholder — replace with licensed art'}
            </span>
          </Reveal>

          <div className="dossier__sheet">
            <div className="dossier__stamps">
              <span className="label">Character sheet · No. {String(idx + 1).padStart(3, '0')}</span>
              <Stamp>Archived · {c.canon === 'canon' ? 'Manga canon' : 'Mixed sources'}</Stamp>
            </div>
            <h1 className="dossier__name">
              <Spoiler level={c.spoiler} block>
                {c.name}
              </Spoiler>
            </h1>
            <p className="dossier__title">
              <Spoiler level={c.spoiler}>{c.title}</Spoiler>
            </p>
            <div className="dossier__summary book">
              <Spoiler level={c.spoiler} block>
                {c.summary}
                <SourceMarks ids={c.sources} />
              </Spoiler>
            </div>
            <WikiLink e={c} />

            <dl className="spec">
              <dt>Name</dt>
              <dd><Spoiler level={c.spoiler}>{c.name}</Spoiler></dd>
              <dt>Title</dt>
              <dd><Spoiler level={c.spoiler}>{c.title}</Spoiler></dd>
              <dt>First appearance</dt>
              <dd>{c.firstAppearance}</dd>
              <dt>Faction</dt>
              <dd><XrefList ids={c.faction} /></dd>
              <dt>Status</dt>
              <dd><FactLine f={c.status} /></dd>
              <dt>Age</dt>
              <dd><FactLine f={c.age} /></dd>
              <dt>Weapons</dt>
              <dd><XrefList ids={c.weapons} empty="None of note" /></dd>
              <dt>Abilities</dt>
              <dd><FactList facts={c.abilities} /></dd>
            </dl>
          </div>
        </div>
      </Page>

      <Page chapter={`Dossier · No. ${String(idx + 1).padStart(3, '0')} · Development`} folio={33 + idx} tone="paper">
        <div className="dossier-cols">
          <div>
            <span className="label">Character arc</span>
            <h2 className="section-title" style={{ margin: '8px 0 14px' }}>Arc</h2>
            <FactList facts={c.arc} />
          </div>
          <div>
            <span className="label">Relationships</span>
            <h2 className="section-title" style={{ margin: '8px 0 14px' }}>Bonds</h2>
            {rels.length ? (
              <ul className="bond-list">
                {rels.map((r) => {
                  const other = r.from === c.id ? r.to : r.from;
                  return (
                    <li key={r.id} className={`bond bond--${r.type}`}>
                      <span className="bond__line" aria-hidden="true" />
                      <span className="bond__who"><Xref id={other} /></span>
                      <span className="bond__what"><Spoiler level={r.note.spoiler}>{r.label}</Spoiler></span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted">No mapped relationships yet.</p>
            )}
            <Link to={`/relationships?focus=${c.id}`} className="bracket" style={{ marginTop: 10 }}>
              <span>View on map</span>
            </Link>
          </div>
          <div>
            <span className="label">Major events</span>
            <h2 className="section-title" style={{ margin: '8px 0 14px' }}>Events</h2>
            <ul className="plain-list">
              {c.majorEvents.map((e) => (
                <li key={e}><Xref id={e} /></li>
              ))}
            </ul>
            <span className="label" style={{ display: 'block', marginTop: 22 }}>Appearances</span>
            <ul className="plain-list">
              <li>Manga <CanonTag c="canon" /></li>
              {c.appearances.map((a) => (
                <li key={a}><Xref id={a} /></li>
              ))}
            </ul>
          </div>
        </div>

        <InkRule />
        <span className="label">Development · read left to right</span>
        <ol className="strip" aria-label={`${c.name} timeline`}>
          {c.timeline.map((t, i) => (
            <Reveal as="li" key={i} className="strip__cell" delay={i * 60}>
              <div className="strip__panel panel panel--bleed panel--black">
                <Spoiler level={t.spoiler} block>
                  <InkArt variant={t.art ?? c.art} seed={`${c.id}-${i}`} showCredit={false} label={t.stage} />
                </Spoiler>
              </div>
              <span className="strip__stage">
                <Spoiler level={t.spoiler}>{t.stage}</Spoiler>
              </span>
              <span className="strip__note">
                <Spoiler level={t.spoiler}>{t.note}</Spoiler>
              </span>
            </Reveal>
          ))}
        </ol>

        <nav className="pager" aria-label="Other dossiers">
          {prev ? <Link to={hrefFor(prev)} className="bracket"><span>← {prev.spoiler ? 'Previous' : prev.name}</span></Link> : <span />}
          <Link to="/characters" className="bracket"><span>All characters</span></Link>
          {next ? <Link to={hrefFor(next)} className="bracket"><span>{next.spoiler ? 'Next' : next.name} →</span></Link> : <span />}
        </nav>
      </Page>
    </>
  );
}
