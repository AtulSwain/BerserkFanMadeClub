import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Page, PageHead } from '@/components/Page';
import { CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler, useIsHidden } from '@/components/Spoiler';
import { useSpoilers } from '@/context/SpoilerContext';
import { archive, hrefFor, nameOf } from '@/data/archive';
import type { Relationship, RelationType } from '@/data/types';

const POS: Record<string, { x: number; y: number }> = {
  guts: { x: 500, y: 335 },
  casca: { x: 320, y: 205 },
  griffith: { x: 690, y: 190 },
  'band-of-the-hawk': { x: 505, y: 95 },
  puck: { x: 300, y: 430 },
  schierke: { x: 175, y: 320 },
  farnese: { x: 380, y: 570 },
  serpico: { x: 590, y: 585 },
  isidro: { x: 190, y: 530 },
  'skull-knight': { x: 800, y: 430 },
  zodd: { x: 845, y: 270 },
  rickert: { x: 880, y: 110 },
};

export const REL_STYLE: Record<RelationType, { label: string; stroke: string; dash?: string; width: number }> = {
  ally: { label: 'Ally', stroke: '#080808', width: 2 },
  conflict: { label: 'Conflict', stroke: '#080808', dash: '12 7', width: 2 },
  hatred: { label: 'Hatred', stroke: '#7d1111', width: 4 },
  historical: { label: 'Historical connection', stroke: '#8c7340', width: 2.5 },
  unknown: { label: 'Unknown', stroke: '#080808', dash: '2 5', width: 3 },
};

function Edge({ r, active, dim, onPick }: { r: Relationship; active: boolean; dim: boolean; onPick: () => void }) {
  const { level } = useSpoilers();
  const a = POS[r.from];
  const b = POS[r.to];
  if (!a || !b) return null;
  const hidden = (r.note.spoiler ?? 0) > level;
  const st = REL_STYLE[hidden ? 'unknown' : r.type];
  // slight curve, as if drawn by hand
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.08;
  const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.08;
  const d = `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
  return (
    <g
      className={`rel-edge ${active ? 'is-active' : ''} ${dim ? 'is-dim' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${nameOf(r.from)} and ${nameOf(r.to)}: ${hidden ? 'hidden relationship' : st.label}`}
      onClick={onPick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick())}
    >
      <path d={d} stroke="transparent" strokeWidth={18} fill="none" />
      <path d={d} stroke={st.stroke} strokeWidth={active ? st.width + 1.5 : st.width} strokeDasharray={st.dash} fill="none" strokeLinecap="round" />
      {r.mutual && <circle cx={mx * 0.5 + (a.x + b.x) / 4} cy={my * 0.5 + (a.y + b.y) / 4} r={3} fill={st.stroke} />}
    </g>
  );
}

function Node({ id, focus, onFocus }: { id: string; focus: string | null; onFocus: (id: string) => void }) {
  const e = archive.get(id);
  const hidden = useIsHidden(e?.spoiler);
  const p = POS[id];
  const isCenter = id === 'guts';
  const on = focus === id;
  const label = hidden ? '— ? —' : nameOf(id).replace('Nosferatu ', '').replace(' de Vandimion', '').toUpperCase();
  const w = Math.max(isCenter ? 140 : 116, label.length * 13 + 34);
  return (
    <g
      className={`rel-node ${on ? 'is-focus' : ''}`}
      transform={`translate(${p.x} ${p.y})`}
      role="button"
      tabIndex={0}
      aria-label={hidden ? 'Hidden character' : nameOf(id)}
      onClick={() => onFocus(id)}
      onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), onFocus(id))}
    >
      <rect x={-w / 2} y={-18} width={w} height={36} fill={on || isCenter ? '#080808' : '#d8d2c5'} stroke="#080808" strokeWidth={2} filter="url(#ink-rough)" />
      <text textAnchor="middle" y={6} className="rel-node__label" fill={on || isCenter ? '#f1eee6' : '#080808'} style={{ filter: hidden ? 'blur(4px)' : undefined }}>
        {label}
      </text>
    </g>
  );
}

export default function Relationships() {
  const [params] = useSearchParams();
  const rels = archive.relationships();
  const [focus, setFocus] = useState<string | null>(params.get('focus'));
  const [picked, setPicked] = useState<Relationship | null>(null);

  const connected = useMemo(() => {
    if (!focus) return null;
    const s = new Set<string>([focus]);
    rels.forEach((r) => {
      if (r.from === focus) s.add(r.to);
      if (r.to === focus) s.add(r.from);
    });
    return s;
  }, [focus, rels]);

  const pickedPos = picked ? { x: (POS[picked.from].x + POS[picked.to].x) / 2, y: (POS[picked.from].y + POS[picked.to].y) / 2 } : null;

  return (
    <Page chapter="03 · Relationship map" folio={38} tone="paper">
      <PageHead
        no="03·b"
        kicker="Relationship map"
        title={
          <>
            Threads<em> of ink</em>
          </>
        }
        lede="Select a figure to isolate its threads; select a thread to read the annotation. Hidden relationships are drawn as unknown until your spoiler level allows them."
      />

      <div className="relmap">
        <div className="relmap__board panel panel--thin">
          <svg viewBox="0 0 1000 660" className="relmap__svg" role="group" aria-label="Relationship graph">
            <defs>
              <pattern id="relgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(8,8,8,0.06)" />
              </pattern>
            </defs>
            <rect width="1000" height="660" fill="url(#relgrid)" />
            {rels.map((r) => (
              <Edge
                key={r.id}
                r={r}
                active={picked?.id === r.id}
                dim={!!connected && !(connected.has(r.from) && connected.has(r.to) && (r.from === focus || r.to === focus))}
                onPick={() => setPicked(r)}
              />
            ))}
            {Object.keys(POS).map((id) => (
              <g key={id} opacity={connected && !connected.has(id) ? 0.25 : 1} style={{ transition: 'opacity .3s' }}>
                <Node id={id} focus={focus} onFocus={(n) => setFocus(focus === n ? null : n)} />
              </g>
            ))}
            {pickedPos && (
              <g transform={`translate(${pickedPos.x} ${pickedPos.y})`} pointerEvents="none">
                <circle r={9} fill="none" stroke="#7d1111" strokeWidth={2} />
                <circle r={2.5} fill="#7d1111" />
              </g>
            )}
          </svg>
        </div>

        <aside className="relmap__side">
          <div className="relmap__legend">
            <span className="label">Line key</span>
            {(Object.keys(REL_STYLE) as RelationType[]).map((t) => (
              <div key={t} className="relmap__key">
                <svg width="54" height="10" aria-hidden="true">
                  <line x1="2" y1="5" x2="52" y2="5" stroke={REL_STYLE[t].stroke} strokeWidth={REL_STYLE[t].width} strokeDasharray={REL_STYLE[t].dash} />
                </svg>
                <span>{REL_STYLE[t].label}</span>
              </div>
            ))}
          </div>

          <div className="relmap__note" aria-live="polite">
            {picked ? (
              <div className="annotation-card">
                <button type="button" className="annotation-card__close" onClick={() => setPicked(null)} aria-label="Close annotation">×</button>
                <span className="label">Annotation</span>
                <p className="annotation-card__who">
                  <Spoiler level={archive.get(picked.from)?.spoiler}><Link to={hrefFor(archive.get(picked.from)!)}>{nameOf(picked.from)}</Link></Spoiler>
                  <span className="accent"> {picked.mutual ? '↔' : '→'} </span>
                  <Spoiler level={archive.get(picked.to)?.spoiler}><Link to={hrefFor(archive.get(picked.to)!)}>{nameOf(picked.to)}</Link></Spoiler>
                </p>
                <p className="hand annotation-card__label">
                  <Spoiler level={picked.note.spoiler}>{picked.label}</Spoiler>
                </p>
                <p className="book" style={{ fontSize: 16 }}>
                  <Spoiler level={picked.note.spoiler}>
                    {picked.note.text}
                    <SourceMarks ids={picked.note.sources} />
                  </Spoiler>
                </p>
                <CanonTag c={picked.note.canon} />
              </div>
            ) : (
              <p className="annot">← choose a thread</p>
            )}
          </div>
          {focus && (
            <button type="button" className="bracket" onClick={() => setFocus(null)}>
              <span>Clear focus</span>
            </button>
          )}
        </aside>
      </div>
    </Page>
  );
}
