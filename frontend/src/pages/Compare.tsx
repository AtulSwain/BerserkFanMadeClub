import { Page, PageHead, Reveal } from '@/components/Page';
import { FactLine } from '@/components/Canon';
import { comparisons } from '@/data/media';

export default function Compare() {
  return (
    <Page chapter="13 · Manga vs anime" folio={136}>
      <PageHead
        no="13·b"
        kicker="Comparison mode"
        title={
          <>
            Manga<em> vs </em>Anime
          </>
        }
        lede="Left column: the page. Right column: the screen. Each row is one axis of difference."
      />
      <div className="compare" role="table" aria-label="Manga and anime comparison">
        <div className="compare__head" role="row">
          <span role="columnheader" className="compare__topic-h label">Axis</span>
          <span role="columnheader" className="compare__side-h compare__side-h--manga">Manga</span>
          <span role="columnheader" className="compare__side-h compare__side-h--anime">Anime</span>
        </div>
        {comparisons.map((c, i) => (
          <Reveal key={c.topic} className="compare__row" role="row" delay={i * 30}>
            <span role="rowheader" className="compare__topic">
              <span className="compare__n">{String(i + 1).padStart(2, '0')}</span>
              {c.topic}
            </span>
            <div role="cell" className="compare__cell compare__cell--manga">
              <FactLine f={c.manga} />
            </div>
            <div role="cell" className="compare__cell compare__cell--anime">
              <FactLine f={c.anime} />
            </div>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}
