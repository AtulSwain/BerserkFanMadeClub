import { Link } from 'react-router-dom';
import { Page, PageHead, Reveal } from '@/components/Page';
import { Ja } from '@/components/Manga';
import { InkArt } from '@/art/InkArt';
import { CanonLegend } from '@/components/Canon';
import { INDEX } from '@/lib/sections';

/** Each entry gets its own composition so the index reads like a designed page, not a card grid. */
const LAYOUT = ['xl', 'plain', 'tall', 'plain', 'wide', 'inverse', 'plain', 'tall', 'plain', 'wide', 'xl', 'plain', 'inverse', 'plain', 'wide', 'plain'] as const;

export default function ArchiveIndex() {
  return (
    <>
      <Page chapter="Index" folio={5}>
        <PageHead
          no="§"
          kicker="Table of contents"
          title={<>Archive</>}
          lede="Sixteen chapters of an enormous volume. Each opens onto its own pages; every page carries its sources in the margin."
        />
        <ol className="toc">
          {INDEX.map((s, i) => {
            const layout = LAYOUT[i];
            const hasArt = layout === 'xl' || layout === 'tall';
            return (
              <Reveal as="li" key={s.no} className={`toc__item toc__item--${layout}`} delay={(i % 4) * 60}>
                <Link to={s.to} className={`toc__link panel ${layout === 'inverse' ? 'panel--paper' : 'panel--black'} ${hasArt ? 'panel--bleed' : ''}`}>
                  {hasArt && (
                    <div className="toc__art">
                      <InkArt variant={s.art} seed={s.no} showCredit={false} label={s.title} />
                    </div>
                  )}
                  <div className="toc__text">
                    <span className="toc__no">{s.no}</span>
                    <span className="toc__title">{s.title} <Ja className="toc__ja">{s.ja}</Ja></span>
                    <span className="toc__blurb">{s.blurb}</span>
                    <span className="toc__pg">p. {s.page}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </Page>
      <Page chapter="Index · Classification" folio={6} tone="paper">
        <div className="legend-page">
          <div>
            <span className="label">How to read this archive</span>
            <h2 className="section-title" style={{ margin: '10px 0 18px' }}>
              Classification stamps
            </h2>
            <p className="book">
              Every claim is stamped with where it comes from. Stamps never combine: a sentence is either shown in the manga, said by its
              creators, taken from an adaptation, inferred by an editor, or speculated by readers.
            </p>
            <p className="book">
              Superscript numbers such as <span className="fact__src">[1]</span> lead to the{' '}
              <Link to="/sources" className="xref">bibliography</Link>.
            </p>
          </div>
          <CanonLegend />
        </div>
      </Page>
    </>
  );
}
