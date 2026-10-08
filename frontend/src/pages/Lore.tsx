import { Link, useParams } from 'react-router-dom';
import { Page, PageHead, Reveal, XrefList } from '@/components/Page';
import { FactLine, FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { archive } from '@/data/archive';

const WORLD_LINKS = [
  { to: '/atlas', label: 'Atlas' },
  { to: '/apostles', label: 'Apostles' },
  { to: '/god-hand', label: 'God Hand' },
  { to: '/factions', label: 'Factions' },
  { to: '/creatures', label: 'Bestiary' },
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];

export default function Lore() {
  const { id } = useParams();
  const entries = archive.lore();
  const e = entries.find((x) => x.id === id);

  return (
    <Page chapter={e ? `11 · Lore · Folio ${ROMAN[entries.indexOf(e)]}` : '11 · Lore'} folio={110 + (e ? entries.indexOf(e) + 1 : 0)} tone="aged" className="manuscript-page">
      <PageHead
        no="11"
        kicker="Manuscript of the world"
        title={
          <>
            Liber<em> occultus</em>
          </>
        }
        lede="An archive of rules, forces and secrets. Each folio separates what is shown from what is supposed."
      />
      <nav className="world-tabs" aria-label="World sections">
        <span className="label">The world:</span>
        {WORLD_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="chip">
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>

      <div className="manuscript">
        <nav className="manuscript__toc" aria-label="Lore entries">
          <ol>
            {entries.map((x, i) => (
              <li key={x.id}>
                <Link to={`/lore/${x.id}`} className={`manuscript__toc-item ${x.id === e?.id ? 'is-active' : ''}`}>
                  <span className="manuscript__toc-no">{ROMAN[i]}</span>
                  <Spoiler level={x.spoiler}>{x.name}</Spoiler>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {e ? (
          <article className="folio-entry" key={e.id}>
            <header>
              <span className="label">Folio {ROMAN[entries.indexOf(e)]} · {e.epithet}</span>
              <h2 className="folio-entry__title">
                <Spoiler level={e.spoiler} block>{e.name}</Spoiler>
              </h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="label">Canon status</span>
                <CanonTag c={e.canon} />
              </div>
            </header>
            <p className="book book--lg dropcap folio-entry__lede">
              <Spoiler level={e.spoiler}>
                {e.summary}
                <SourceMarks ids={e.sources} />
              </Spoiler>
            </p>
            <WikiLink e={e} />

            <div className="folio-entry__grid">
              <section>
                <h3 className="folio-entry__h">Definition</h3>
                <FactLine f={e.definition} />
                <h3 className="folio-entry__h">Origin</h3>
                <FactLine f={e.origin} />
                <h3 className="folio-entry__h">Known facts</h3>
                <FactList facts={e.knownFacts} />
                <h3 className="folio-entry__h">Symbolism</h3>
                <FactLine f={e.symbolism} />
              </section>
              <aside className="folio-entry__margin">
                <h3 className="folio-entry__h">Known appearances</h3>
                <XrefList ids={e.appearances} />
                <h3 className="folio-entry__h">Connections</h3>
                <XrefList ids={e.connections} />
                <h3 className="folio-entry__h folio-entry__h--warn">Uncertainties</h3>
                <FactList facts={e.uncertainties} empty="None recorded." />
                <div className="theory-box">
                  <h3 className="folio-entry__h">Fan theories</h3>
                  <span className="annot annot--red">speculation — not canon</span>
                  <FactList facts={e.theories} empty="None recorded." />
                </div>
              </aside>
            </div>
          </article>
        ) : (
          <div className="manuscript__grid">
            {entries.map((x, i) => (
              <Reveal key={x.id} delay={(i % 4) * 50} className="has-annot">
                <Link to={`/lore/${x.id}`} className="manuscript__card">
                  <span className="manuscript__card-no">{ROMAN[i]}</span>
                  <span className="manuscript__card-name">
                    <Spoiler level={x.spoiler}>{x.name}</Spoiler>
                  </span>
                  <span className="manuscript__card-ep">{x.epithet}</span>
                  <CanonTag c={x.canon} />
                </Link>
                <span className="annot annot--hover manuscript__hover">
                  <Spoiler level={x.spoiler}>{x.summary.split('.')[0]}.</Spoiler>
                </span>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
