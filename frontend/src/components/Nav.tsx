import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSpoilers, SPOILER_LABELS, SPOILER_HINTS } from '@/context/SpoilerContext';
import type { SpoilerLevel } from '@/data/types';
import { INDEX } from '@/lib/sections';

export const TABS: { to: string; label: string; no: string; match: string[] }[] = [
  { to: '/archive', label: 'Index', no: '00', match: ['/archive', '/sources', '/glossary'] },
  { to: '/characters', label: 'Characters', no: '03', match: ['/characters', '/relationships', '/factions'] },
  { to: '/lore', label: 'World', no: '11', match: ['/lore', '/atlas', '/apostles', '/god-hand', '/creatures'] },
  { to: '/weapons', label: 'Weapons', no: '07', match: ['/weapons'] },
  { to: '/chronology', label: 'Chronology', no: '02', match: ['/chronology', '/events'] },
  { to: '/volumes', label: 'Manga', no: '12', match: ['/volumes', '/craft', '/panel-lab', '/cinematography'] },
  { to: '/anime', label: 'Anime', no: '13', match: ['/anime', '/compare', '/music'] },
  { to: '/production', label: 'Production', no: '15', match: ['/production', '/origins'] },
];

function SpoilerControl({ compact = false }: { compact?: boolean }) {
  const { level, setLevel } = useSpoilers();
  return (
    <div className={`spoiler-control ${compact ? 'spoiler-control--compact' : ''}`} role="radiogroup" aria-label="Spoiler level">
      <span className="spoiler-control__label">Spoilers</span>
      {([0, 1, 2] as SpoilerLevel[]).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={level === l}
          className={`spoiler-control__opt ${level === l ? 'is-on' : ''}`}
          onClick={() => setLevel(l)}
          title={SPOILER_HINTS[l]}
        >
          {compact ? ['None', 'Part', 'Full'][l] : SPOILER_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

export function Nav({ onSearch }: { onSearch: () => void }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isHome = pathname === '/';

  return (
    <>
      <nav className={`edge-nav ${isHome ? 'edge-nav--home' : ''}`} aria-label="Archive sections">
        <Link to="/" className="edge-nav__brand" aria-label="Berserk Archive — cover">
          <span className="edge-nav__sigil" aria-hidden="true" />
          <span>Berserk</span>
          <span className="edge-nav__brand-sub">Archive</span>
        </Link>

        <ul className="edge-tabs">
          {TABS.map((t) => {
            const active = t.match.some((m) => pathname === m || pathname.startsWith(m + '/'));
            return (
              <li key={t.to}>
                <NavLink to={t.to} className={`edge-tab ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                  <span className="edge-tab__no">{t.no}</span>
                  <span className="edge-tab__label">{t.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="edge-nav__tools">
          <button type="button" className="edge-nav__search" onClick={onSearch} aria-label="Search the archive (press /)">
            <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12.2 12.2 L18 18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span className="edge-nav__search-label">Search</span>
            <kbd>/</kbd>
          </button>
          <SpoilerControl compact />
          <button type="button" className="edge-nav__contents" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="contents-drawer">
            Contents
          </button>
        </div>
      </nav>

      <div id="contents-drawer" className={`contents-drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Contents" hidden={!open}>
        <div className="contents-drawer__page">
          <div className="contents-drawer__head">
            <span className="label label--ink">Contents</span>
            <button type="button" className="bracket" onClick={() => setOpen(false)}>
              <span>Close</span>
            </button>
          </div>
          <h2 className="contents-drawer__title">Berserk<br /><em>The Manga Archive</em></h2>
          <ol className="contents-drawer__list">
            <li>
              <Link to="/">
                <span className="contents-drawer__no">—</span>
                <span className="contents-drawer__name">Cover</span>
                <span className="contents-drawer__leader" />
                <span className="contents-drawer__pg">i</span>
              </Link>
            </li>
            {INDEX.map((s) => (
              <li key={s.no}>
                <Link to={s.to}>
                  <span className="contents-drawer__no">{s.no}</span>
                  <span className="contents-drawer__name">{s.title}</span>
                  <span className="contents-drawer__leader" />
                  <span className="contents-drawer__pg">{s.page}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="contents-drawer__foot">
            <SpoilerControl />
            <button type="button" className="bracket" onClick={() => { setOpen(false); onSearch(); }}>
              <span>Search the archive</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { SpoilerControl };
