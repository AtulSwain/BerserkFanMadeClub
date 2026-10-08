import { useState, type ReactNode } from 'react';
import type { SpoilerLevel } from '@/data/types';
import { useSpoilers, SPOILER_LABELS } from '@/context/SpoilerContext';

interface Props {
  level: SpoilerLevel | undefined;
  children: ReactNode;
  block?: boolean;
  /** Short label for screen readers, e.g. "Character status". */
  what?: string;
}

/** Blurs content above the reader's chosen spoiler level, with a per-item reveal. */
export function Spoiler({ level = 0, children, block, what }: Props) {
  const { level: allowed } = useSpoilers();
  const [revealed, setRevealed] = useState(false);
  const Tag = block ? 'div' : 'span';

  if (level <= allowed || revealed) return <>{children}</>;

  return (
    <Tag className={`spoiler spoiler--hidden ${block ? 'spoiler--block' : ''}`}>
      <Tag className="spoiler__content" aria-hidden="true">
        {children}
      </Tag>
      <span className="spoiler__reveal">
        <button type="button" onClick={() => setRevealed(true)} title={`Hidden at "${SPOILER_LABELS[allowed]}"`}>
          {block ? 'Reveal spoiler' : 'Reveal'}{what ? <span className="sr-only">: {what}</span> : null}
        </button>
      </span>
    </Tag>
  );
}

export function useIsHidden(level: SpoilerLevel | undefined) {
  const { level: allowed } = useSpoilers();
  return (level ?? 0) > allowed;
}
