import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Page, Xref } from '@/components/Page';
import { FactLine, FactList, SourceMarks } from '@/components/Canon';
import { Spoiler, useIsHidden } from '@/components/Spoiler';
import { archive } from '@/data/archive';
import type { GodHandMember } from '@/data/types';

const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

/** Minimal original sigils — geometric, not depictions of the characters. */
function Sigil({ id }: { id: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 };
  switch (id) {
    case 'void':
      return (
        <svg viewBox="0 0 100 300" aria-hidden="true">
          <circle cx="50" cy="70" r="34" {...common} />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${24 + i * 8} 50 q4 20 0 40`} {...common} strokeWidth={0.8} />)}
          <path d="M50 104 L50 290 M20 290 L80 290" {...common} />
          <path d="M30 150 L70 150" {...common} strokeWidth={3} />
        </svg>
      );
    case 'slan':
      return (
        <svg viewBox="0 0 100 300" aria-hidden="true">
          <path d="M50 60 C20 40 6 80 2 120 C20 100 34 100 46 110 M50 60 C80 40 94 80 98 120 C80 100 66 100 54 110" {...common} />
          <path d="M50 60 L50 290" {...common} />
          <circle cx="50" cy="60" r="8" fill="currentColor" />
        </svg>
      );
    case 'ubik':
      return (
        <svg viewBox="0 0 100 300" aria-hidden="true">
          <circle cx="50" cy="140" r="22" {...common} />
          <circle cx="42" cy="136" r="6" {...common} />
          <circle cx="58" cy="136" r="6" {...common} />
          <path d="M50 162 L50 290" {...common} strokeDasharray="3 6" />
        </svg>
      );
    case 'conrad':
      return (
        <svg viewBox="0 0 100 300" aria-hidden="true">
          <path d="M50 40 L70 90 L64 290 L36 290 L30 90 Z" {...common} />
          <path d="M50 70 L58 92 L42 92 Z" fill="currentColor" />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={20 + i * 12} cy={292} r={2} fill="currentColor" />)}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 300" aria-hidden="true">
          <path d="M50 30 L66 60 L60 100 L40 100 L34 60 Z" {...common} />
          <path d="M50 100 C10 120 4 180 0 260 C24 220 40 200 50 196 C60 200 76 220 100 260 C96 180 90 120 50 100 Z" fill="currentColor" opacity="0.9" />
          <path d="M50 196 L50 290" {...common} />
        </svg>
      );
  }
}

function Position({ m }: { m: GodHandMember }) {
  const hidden = useIsHidden(m.spoiler);
  return (
    <Link to={`/god-hand/${m.id}`} className={`gh-pos gh-pos--${m.id}`} aria-label={hidden ? `Position ${NUMERALS[m.position - 1]} — hidden` : `${m.name}, ${m.aspect}`}>
      <span className="gh-pos__numeral">{NUMERALS[m.position - 1]}</span>
      <span className="gh-pos__line" aria-hidden="true" />
      <span className="gh-pos__sigil" style={{ filter: hidden ? 'blur(6px)' : undefined }}>
        <Sigil id={m.id} />
      </span>
      <span className="gh-pos__reveal">
        <span className="gh-pos__name">{hidden ? '—' : m.name}</span>
        <span className="gh-pos__aspect">{hidden ? 'Hidden at your spoiler level' : m.aspect}</span>
        {!hidden && <span className="gh-pos__sum">{m.summary}</span>}
      </span>
    </Link>
  );
}

function FullDossier({ m, onClose }: { m: GodHandMember; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="gh-dossier" role="dialog" aria-modal="true" aria-label={`${m.name} dossier`}>
      <button type="button" className="bracket gh-dossier__close" onClick={onClose} autoFocus>
        <span>Close</span>
      </button>
      <div className="gh-dossier__sigil" aria-hidden="true">
        <Sigil id={m.id} />
      </div>
      <div className="gh-dossier__body">
        <span className="label">God Hand · Position {NUMERALS[m.position - 1]}</span>
        <h2 className="gh-dossier__name">
          <Spoiler level={m.spoiler} block>{m.name}</Spoiler>
        </h2>
        <p className="gh-dossier__aspect">
          <Spoiler level={m.spoiler}>{m.aspect}</Spoiler>
        </p>
        <p className="book book--lg">
          <Spoiler level={m.spoiler}>
            {m.summary}
            <SourceMarks ids={m.sources} />
          </Spoiler>
        </p>
        <dl className="spec">
          <dt>Human origin</dt>
          <dd><FactLine f={m.humanOrigin} /></dd>
          <dt>Appearance</dt>
          <dd><FactLine f={m.appearance} /></dd>
          <dt>Domain</dt>
          <dd><FactLine f={m.domain} /></dd>
          <dt>Known actions</dt>
          <dd><FactList facts={m.knownActions} /></dd>
          {m.related?.length ? (
            <>
              <dt>See also</dt>
              <dd>{m.related.map((r) => <Xref key={r} id={r} />)}</dd>
            </>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

export default function GodHand() {
  const { id } = useParams();
  const navigate = useNavigate();
  const members = archive.godHand();
  const open = members.find((m) => m.id === id);
  const lore = archive.get('godhand');

  return (
    <Page chapter="06 · God Hand" folio={60} className="gh-page">
      <div className="gh-head">
        <span className="label">06 · The God Hand</span>
        <h1 className="gh-title">God Hand</h1>
        <p className="gh-lede book">{lore?.summary}</p>
      </div>
      <div className="gh-row">
        {members.map((m) => (
          <Position key={m.id} m={m} />
        ))}
      </div>
      <p className="gh-foot annot">Hover a position. Open it to read the dossier.</p>
      {open && <FullDossier m={open} onClose={() => navigate('/god-hand')} />}
    </Page>
  );
}
