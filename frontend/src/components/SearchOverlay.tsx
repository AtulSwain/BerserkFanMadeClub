import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { search, group } from '@/lib/search';
import { hrefFor, KIND_LABEL } from '@/data/archive';
import { Spoiler } from './Spoiler';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const groups = useMemo(() => group(search(q, 24)), [q]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search the archive" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-overlay__sheet">
        <form onSubmit={submit} className="search-overlay__form">
          <label htmlFor="archive-search" className="label">Search the archive — characters, weapons, apostles, places, volumes, episodes, music</label>
          <input
            id="archive-search"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Guts…"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="search-overlay__hint">
            <span>Enter — full results</span>
            <span>Esc — close</span>
          </div>
        </form>
        <div className="search-overlay__results">
          {q && !groups.length && <p className="annot">Nothing in the archive under that name.</p>}
          {groups.map((g) => (
            <section key={g.kind} className="search-group">
              <h3 className="label">{KIND_LABEL[g.kind]}</h3>
              <ul>
                {g.hits.map(({ entity }) => (
                  <li key={entity.id}>
                    <Spoiler level={entity.spoiler}>
                      <Link to={hrefFor(entity)} onClick={onClose} className="search-hit">
                        <span className="search-hit__name">{entity.name}</span>
                        {entity.epithet && <span className="search-hit__ep">{entity.epithet}</span>}
                      </Link>
                    </Spoiler>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
