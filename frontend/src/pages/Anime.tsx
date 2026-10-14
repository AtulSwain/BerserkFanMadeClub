import { Link } from 'react-router-dom';
import { Page, PageHead, Reveal } from '@/components/Page';
import { FactLine, FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { InkArt } from '@/art/InkArt';
import { archive } from '@/data/archive';

export default function Anime() {
  const list = archive.anime();
  return (
    <>
      <Page chapter="13 · Anime" folio={130}>
        <PageHead
          no="13"
          kicker="Anime archive"
          title={
            <>
              Moving<br />
              <em>pictures</em>
            </>
          }
          lede={
            <>
              Every adaptation, separately catalogued. Adaptation material is stamped <CanonTag c="anime-adaptation" /> and never
              merged with manga canon. <Link to="/compare" className="xref">Compare manga and anime →</Link>
            </>
          }
        />
        <ol className="reels">
          {list.map((a) => (
            <li key={a.id}>
              <Link to={{ hash: a.id }} className="reel">
                <span className="reel__year">{a.year}</span>
                <span className="reel__name">{a.name}</span>
                <span className="reel__studio">{a.studio}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Page>

      {list.map((a, i) => (
        <Page key={a.id} id={a.id} chapter={`13 · ${a.name}`} folio={131 + i} tone={i % 2 ? 'black' : 'paper'}>
          <article className="adaptation">
            <div className="adaptation__head">
              <span className="adaptation__year">{a.year}</span>
              <div>
                <span className="label">{a.format} · {a.epithet}</span>
                <h2 className="chapter-title" style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}>{a.name}</h2>
              </div>
            </div>
            <div className="adaptation__grid">
              <Reveal className="adaptation__still panel panel--bleed panel--black">
                <InkArt variant={a.art} seed={a.id} label={a.name} />
              </Reveal>
              <div>
                <p className="book book--lg">
                  <Spoiler level={a.spoiler}>
                    {a.summary}
                    <SourceMarks ids={a.sources} />
                  </Spoiler>
                </p>
                <WikiLink e={a} />
                <dl className="spec">
                  <dt>Episodes</dt>
                  <dd>{a.episodes}</dd>
                  <dt>Studio</dt>
                  <dd>{a.studio}</dd>
                  <dt>Director</dt>
                  <dd>{a.director}</dd>
                  <dt>Music</dt>
                  <dd>{a.music}</dd>
                  <dt>Covers</dt>
                  <dd><Spoiler level={a.spoiler}>{a.covers}</Spoiler></dd>
                  <dt>Visual style</dt>
                  <dd><FactLine f={a.visualStyle} /></dd>
                </dl>
              </div>
            </div>
            {a.parts && (
              <div className="adaptation__parts">
                {a.parts.map((p, j) => (
                  <div key={p.name} className="adaptation__part panel panel--thin">
                    <span className="panel__caption">{String(j + 1).padStart(2, '0')}</span>
                    <h3 className="adaptation__part-name">{p.name}</h3>
                    <p><Spoiler level={a.spoiler}>{p.detail}</Spoiler></p>
                  </div>
                ))}
              </div>
            )}
            <div className="adaptation__cols">
              <section>
                <h3 className="folio-entry__h">Changes from the manga</h3>
                <FactList facts={a.changes} />
              </section>
              <section>
                <h3 className="folio-entry__h">Strengths</h3>
                <ul className="plain-list">{a.strengths.map((s) => <li key={s}>+ {s}</li>)}</ul>
                <h3 className="folio-entry__h">Weaknesses</h3>
                <ul className="plain-list">{a.weaknesses.map((s) => <li key={s}>− {s}</li>)}</ul>
                <span className="annot" style={{ marginTop: 6 }}>editorial opinion</span>
              </section>
              <section>
                <h3 className="folio-entry__h">Production notes</h3>
                <FactList facts={a.productionNotes} />
                <p className="label" style={{ marginTop: 10 }}>Episode guide — populate from CMS</p>
              </section>
            </div>
          </article>
        </Page>
      ))}
    </>
  );
}
