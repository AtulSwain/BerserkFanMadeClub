import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Page, PageHead, Reveal, Xref, XrefList } from '@/components/Page';
import { FactLine, SourceMarks } from '@/components/Canon';
import { Spoiler, useIsHidden } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { InkArt } from '@/art/InkArt';
import { archive } from '@/data/archive';
import type { Apostle } from '@/data/types';

function Transformation({ a }: { a: Apostle }) {
  const [t, setT] = useState(0);
  const warp = Math.sin(Math.PI * t) * 46;
  const stage = t < 0.34 ? 'Human' : t < 0.67 ? 'Transformation' : 'Apostle';
  const hidden = useIsHidden(a.spoiler);
  const fid = `warp-${a.id}`;

  return (
    <div className="transform">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={fid}>
          <feTurbulence type="turbulence" baseFrequency="0.018 0.05" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale={warp} />
        </filter>
      </svg>
      <div className="transform__stage panel panel--bleed panel--black" style={{ filter: hidden ? 'blur(10px)' : undefined }}>
        <div className="transform__layer" style={{ opacity: 1 - t, filter: `url(#${fid})` }}>
          <InkArt variant="figure" seed={`${a.id}-h`} showCredit={false} label={`${a.name}, human form`} />
        </div>
        <div className="transform__layer" style={{ opacity: t, filter: `url(#${fid})` }}>
          <InkArt variant={a.art ?? 'beast'} seed={`${a.id}-a`} showCredit={false} label={`${a.name}, apostle form`} />
        </div>
        <div className="transform__flash" style={{ opacity: Math.sin(Math.PI * t) * 0.55 }} />
        <span className="panel__caption">{stage}</span>
        <span className="art__credit">Placeholder · original abstract</span>
      </div>
      <div className="transform__control">
        <div className="transform__ticks" aria-hidden="true">
          {['Human', 'Transformation', 'Apostle'].map((s, i) => (
            <button key={s} type="button" tabIndex={-1} className={stage === s ? 'is-on' : ''} onClick={() => setT(i / 2)}>
              {s}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="Transformation"
          aria-valuetext={stage}
          className="ink-range"
        />
      </div>
    </div>
  );
}

export default function Apostles() {
  const { id } = useParams();
  const list = archive.apostles();
  const a = (list.find((x) => x.id === id) ?? list[0]) as Apostle;
  const idx = list.indexOf(a);

  return (
    <Page chapter="05 · Apostles" folio={50 + idx} tone="abyss">
      <PageHead
        no="05"
        kicker="Apostle database"
        title={
          <>
            Apostles<em> — those who gave</em>
          </>
        }
        lede={archive.get('apostles')?.summary}
      />
      <div className="apostles">
        <nav className="specimens" aria-label="Apostles">
          <span className="label">Specimens</span>
          <ol>
            {list.map((x, i) => (
              <li key={x.id}>
                <Link to={`/apostles/${x.id}`} className={`specimen ${x.id === a.id ? 'is-active' : ''}`} aria-current={x.id === a.id ? 'page' : undefined}>
                  <span className="specimen__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="specimen__name">
                    <Spoiler level={x.spoiler}>{x.name}</Spoiler>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <article className="apostle" key={a.id}>
          <div className="apostle__head">
            <span className="label">Specimen {String(idx + 1).padStart(2, '0')} · {a.epithet}</span>
            <h2 className="apostle__name">
              <Spoiler level={a.spoiler}>{a.name}</Spoiler>
            </h2>
            <p className="book">
              <Spoiler level={a.spoiler}>
                {a.summary}
                <SourceMarks ids={a.sources} />
              </Spoiler>
            </p>
            <WikiLink e={a} />
          </div>

          <Reveal className="apostle__transform">
            <span className="label">Human ↓ Transformation ↓ Apostle — drag to transform</span>
            <Transformation a={a} />
          </Reveal>

          <dl className="spec apostle__spec">
            <dt>Human form</dt>
            <dd><FactLine f={a.humanForm} /></dd>
            <dt>Apostle form</dt>
            <dd><FactLine f={a.apostleForm} /></dd>
            <dt>Ability</dt>
            <dd><FactLine f={a.ability} /></dd>
            <dt>Design</dt>
            <dd><FactLine f={a.design} /></dd>
            <dt>First appearance</dt>
            <dd>{a.firstAppearance}</dd>
            <dt>Victims</dt>
            <dd><FactLine f={a.victims} /></dd>
            <dt>Affiliation</dt>
            <dd><Spoiler level={a.spoiler}>{a.affiliation}</Spoiler></dd>
            <dt>Death</dt>
            <dd><FactLine f={a.death} /></dd>
            <dt>Battles</dt>
            <dd><XrefList ids={a.battles} /></dd>
            <dt>Symbolism</dt>
            <dd><FactLine f={a.symbolism} /></dd>
            {a.related?.length ? (
              <>
                <dt>See also</dt>
                <dd>{a.related.map((r) => <Xref key={r} id={r} />)}</dd>
              </>
            ) : null}
          </dl>
        </article>
      </div>
    </Page>
  );
}
