import { Page, PageHead, Reveal, XrefList } from '@/components/Page';
import { FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { InkArt } from '@/art/InkArt';
import { archive } from '@/data/archive';
import type { SimpleEntry } from '@/data/types';

const CONFIG = {
  faction: { no: '04', title: <>Factions<em> & orders</em></>, kicker: 'Factions', folio: 40, tone: 'black' as const, lede: 'Companies, crowns, churches and the things that serve the God Hand.' },
  creature: { no: '09', title: <>Bestiary</>, kicker: 'Creatures', folio: 90, tone: 'aged' as const, lede: 'A field guide to what is not human and never was. Apostles have their own chapter.' },
  glossary: { no: '16', title: <>Glossary</>, kicker: 'Terms', folio: 160, tone: 'paper' as const, lede: 'Short definitions. Follow the search for full entries.' },
};

export default function Entries({ kind }: { kind: 'faction' | 'creature' | 'glossary' }) {
  const cfg = CONFIG[kind];
  const items: SimpleEntry[] = kind === 'faction' ? archive.factions() : kind === 'creature' ? archive.creatures() : archive.glossary();

  return (
    <Page chapter={`${cfg.no} · ${cfg.kicker}`} folio={cfg.folio} tone={cfg.tone}>
      <PageHead no={cfg.no} kicker={cfg.kicker} title={cfg.title} lede={cfg.lede} />

      {kind === 'glossary' && (
        <dl className="glossary">
          {[...items].sort((a, b) => a.name.localeCompare(b.name)).map((g) => (
            <div key={g.id} id={g.id} className="glossary__entry">
              <dt>
                <Spoiler level={g.spoiler}>{g.name}</Spoiler>
              </dt>
              <dd>
                <Spoiler level={g.spoiler}>{g.summary}</Spoiler>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {kind === 'faction' && (
        <div className="banners">
          {items.map((f, i) => (
            <Reveal key={f.id} id={f.id} className={`banner ${i % 3 === 0 ? 'banner--wide' : ''}`} delay={(i % 3) * 80}>
              <div className="banner__flag panel panel--bleed panel--black">
                <Spoiler level={f.spoiler} block>
                  <InkArt variant={f.art} seed={f.id} showCredit={false} label={f.name} />
                </Spoiler>
              </div>
              <div className="banner__body">
                <span className="label">{f.epithet}</span>
                <h2 className="section-title">
                  <Spoiler level={f.spoiler}>{f.name}</Spoiler>
                </h2>
                <p className="book" style={{ fontSize: 16 }}>
                  <Spoiler level={f.spoiler}>{f.summary}</Spoiler>
                </p>
                <FactList facts={f.facts} />
                {f.related && (
                  <p className="label" style={{ marginTop: 10 }}>
                    Members & links: <XrefList ids={f.related} />
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {kind === 'creature' && (
        <div className="plates">
          {items.map((c, i) => (
            <Reveal key={c.id} id={c.id} className="plate" delay={(i % 2) * 90}>
              <span className="plate__no">Plate {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}</span>
              <div className="plate__art panel panel--bleed panel--black">
                <Spoiler level={c.spoiler} block>
                  <InkArt variant={c.art} seed={c.id} label={c.name} />
                </Spoiler>
              </div>
              <h2 className="plate__name">
                <Spoiler level={c.spoiler}>{c.name}</Spoiler>
              </h2>
              <p className="plate__ep annot">{c.epithet}</p>
              <p className="book" style={{ fontSize: 16 }}>
                <Spoiler level={c.spoiler}>
                  {c.summary}
                  <SourceMarks ids={c.sources} />
                </Spoiler>
              </p>
              <FactList facts={c.facts} />
              <CanonTag c={c.canon} />
            </Reveal>
          ))}
        </div>
      )}
    </Page>
  );
}
