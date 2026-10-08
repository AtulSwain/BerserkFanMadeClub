import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Page, PageHead } from '@/components/Page';
import { FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { useSpoilers } from '@/context/SpoilerContext';
import { archive } from '@/data/archive';
import type { LocationEntry } from '@/data/types';

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function Symbol({ kind }: { kind: LocationEntry['symbol'] }) {
  const s = { fill: 'none', stroke: '#080808', strokeWidth: 1.6 };
  switch (kind) {
    case 'castle':
      return <path d="M-10 8 L-10 -6 L-6 -6 L-6 -2 L-2 -2 L-2 -8 L2 -8 L2 -2 L6 -2 L6 -6 L10 -6 L10 8 Z" {...s} fill="#d8d2c5" />;
    case 'tower':
      return <path d="M-5 9 L-4 -10 L0 -16 L4 -10 L5 9 Z" {...s} fill="#d8d2c5" />;
    case 'tree':
      return <path d="M0 -14 C10 -10 12 0 4 2 L4 10 L-4 10 L-4 2 C-12 0 -10 -10 0 -14 Z" {...s} fill="#d8d2c5" />;
    case 'port':
      return <path d="M0 -12 L0 8 M-9 2 C-8 10 8 10 9 2 M-5 -8 L5 -8" {...s} />;
    case 'void':
      return (
        <g>
          <circle r={9} {...s} fill="#080808" />
          <circle r={4} fill="#7d1111" />
        </g>
      );
    case 'forest':
      return <path d="M-10 8 L-6 -4 L-2 8 M-2 8 L2 -8 L6 8 M4 8 L8 -2 L12 8" {...s} />;
    case 'mountain':
      return <path d="M-12 8 L-3 -9 L2 0 L6 -5 L12 8 Z" {...s} fill="#d8d2c5" />;
    case 'ruin':
      return <path d="M-9 8 L-9 -4 L-5 -4 L-5 8 M-1 8 L-1 -9 L3 -9 L3 2 M7 8 L7 0" {...s} />;
    default:
      return (
        <g>
          <circle r={8} {...s} fill="#d8d2c5" />
          <circle r={2.5} fill="#080808" />
        </g>
      );
  }
}

function MapDecor() {
  const r = rng(41);
  const mountains = Array.from({ length: 26 }, () => ({ x: 560 + r() * 220, y: 140 + r() * 120 }));
  const trees = Array.from({ length: 40 }, () => ({ x: 260 + r() * 160, y: 100 + r() * 90 }));
  const waves = Array.from({ length: 34 }, () => ({ x: r() * 1000, y: r() * 700 }));
  return (
    <g className="atlas-decor">
      {/* sea hatching */}
      {waves.map((w, i) =>
        w.x < 180 || w.y > 560 || w.x > 940 ? (
          <path key={i} d={`M${w.x} ${w.y} q8 -6 16 0 t16 0`} fill="none" stroke="#080808" strokeWidth={0.8} opacity={0.5} />
        ) : null,
      )}
      {/* continent */}
      <path
        d="M190 120 C230 70 330 60 420 80 C520 55 640 70 740 95 C820 110 900 150 930 230 C960 320 920 400 900 470 C870 540 780 560 700 548 C620 560 540 600 450 585 C370 600 300 590 250 540 C200 500 210 440 190 400 C170 350 200 300 185 250 C170 200 160 160 190 120 Z"
        fill="rgba(190,182,166,0.55)"
        stroke="#080808"
        strokeWidth={2.2}
      />
      <path
        d="M196 128 C236 82 332 72 420 92 C520 68 640 82 736 106 C812 122 888 160 916 234 C944 320 908 398 888 466 C860 530 778 548 700 538 C620 548 540 588 452 574 C372 588 306 578 258 530 C212 494 220 438 200 400 C182 352 210 300 196 252 C182 204 172 166 196 128 Z"
        fill="none"
        stroke="#080808"
        strokeWidth={0.6}
        strokeDasharray="3 4"
      />
      {/* island */}
      <path d="M80 330 C100 300 140 310 148 340 C156 380 120 400 96 392 C70 384 64 352 80 330 Z" fill="rgba(190,182,166,0.55)" stroke="#080808" strokeWidth={1.8} />
      {/* river */}
      <path d="M760 150 C700 200 640 230 600 280 C560 330 520 340 480 370 C440 400 400 450 330 510" fill="none" stroke="#080808" strokeWidth={1.4} />
      {mountains.map((m, i) => (
        <path key={i} d={`M${m.x - 9} ${m.y + 6} L${m.x} ${m.y - 8} L${m.x + 9} ${m.y + 6}`} fill="none" stroke="#080808" strokeWidth={1} />
      ))}
      {trees.map((t, i) => (
        <path key={i} d={`M${t.x} ${t.y - 6} L${t.x - 4} ${t.y + 3} L${t.x + 4} ${t.y + 3} Z M${t.x} ${t.y + 3} L${t.x} ${t.y + 6}`} fill="none" stroke="#080808" strokeWidth={0.8} />
      ))}
      {/* compass */}
      <g transform="translate(900 610)">
        <circle r={38} fill="none" stroke="#080808" strokeWidth={1} />
        <circle r={30} fill="none" stroke="#080808" strokeWidth={0.5} strokeDasharray="2 3" />
        <path d="M0 -44 L7 0 L0 44 L-7 0 Z" fill="#080808" />
        <path d="M-44 0 L0 6 L44 0 L0 -6 Z" fill="none" stroke="#080808" />
        <path d="M0 -44 L7 0 L-7 0 Z" fill="#7d1111" />
        <text y={-50} textAnchor="middle" className="atlas-text">N</text>
      </g>
      {/* cartouche */}
      <g transform="translate(40 40)">
        <rect width={300} height={60} fill="#d8d2c5" stroke="#080808" strokeWidth={2} />
        <rect x={5} y={5} width={290} height={50} fill="none" stroke="#080808" strokeWidth={0.6} />
        <text x={150} y={30} textAnchor="middle" className="atlas-title">The Known Lands</text>
        <text x={150} y={46} textAnchor="middle" className="atlas-text">schematic · not to scale</text>
      </g>
      <text x={60} y={640} className="atlas-hand">here be the Western Sea</text>
      <text x={720} y={80} className="atlas-hand">the long road east →</text>
    </g>
  );
}

export default function Atlas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { level } = useSpoilers();
  const locs = archive.locations();
  const sel = locs.find((l) => l.id === id);
  const ordered = useMemo(() => [...locs].sort((a, b) => a.map.y - b.map.y), [locs]);

  return (
    <Page chapter="08 · Locations" folio={80} tone="paper">
      <PageHead
        no="08"
        kicker="Atlas"
        title={
          <>
            Atlas<em> of the known lands</em>
          </>
        }
        lede={
          <>
            A hand-drawn schematic. Positions are <CanonTag c="inference" /> — relative placements drawn by the editors from the story,
            not an official map.
          </>
        }
      />
      <div className="atlas">
        <div className="atlas__map panel panel--thin">
          <svg viewBox="0 0 1000 700" role="group" aria-label="Schematic map">
            <MapDecor />
            {ordered.map((l) => {
              const hidden = l.spoiler > level;
              const on = sel?.id === l.id;
              return (
                <g
                  key={l.id}
                  className={`atlas-pin ${on ? 'is-on' : ''}`}
                  transform={`translate(${l.map.x} ${l.map.y})`}
                  role="link"
                  tabIndex={0}
                  aria-label={hidden ? 'Hidden location' : l.name}
                  onClick={() => navigate(`/atlas/${l.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/atlas/${l.id}`)}
                >
                  {on && <circle r={22} fill="none" stroke="#7d1111" strokeWidth={2} strokeDasharray="4 3" />}
                  {hidden ? <text textAnchor="middle" y={6} className="atlas-q">?</text> : <Symbol kind={l.symbol} />}
                  {!hidden && (
                    <text y={26} textAnchor="middle" className="atlas-label">
                      {l.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="atlas__side">
          {sel ? (
            <div className="atlas__entry" key={sel.id}>
              <span className="label">{sel.region} · {sel.epithet}</span>
              <h2 className="section-title">
                <Spoiler level={sel.spoiler}>{sel.name}</Spoiler>
              </h2>
              <p className="book" style={{ fontSize: 16 }}>
                <Spoiler level={sel.spoiler}>
                  {sel.summary}
                  <SourceMarks ids={sel.sources} />
                </Spoiler>
              </p>
              <WikiLink e={sel} />
              <FactList facts={sel.facts} />
              <span className="margin-note" style={{ display: 'block', marginTop: 16 }}>
                position on map: approximate
              </span>
              <Link to="/atlas" className="bracket" style={{ marginTop: 12 }}>
                <span>Clear</span>
              </Link>
            </div>
          ) : (
            <>
              <span className="label">Gazetteer</span>
              <ul className="gazetteer">
                {locs.map((l) => (
                  <li key={l.id}>
                    <Spoiler level={l.spoiler}>
                      <Link to={`/atlas/${l.id}`}>
                        <span>{l.name}</span>
                        <span className="gazetteer__ep">{l.epithet}</span>
                      </Link>
                    </Spoiler>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </Page>
  );
}
