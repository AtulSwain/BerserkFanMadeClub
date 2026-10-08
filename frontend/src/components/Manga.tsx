import type { ReactNode } from 'react';

/** Speech balloon. `shout` gets a jagged burst; `thought` gets bubbles. Original lettering only. */
export function Balloon({
  children,
  tail = 'left',
  kind = 'speech',
  className = '',
}: {
  children: ReactNode;
  tail?: 'left' | 'right' | 'down';
  kind?: 'speech' | 'shout' | 'thought';
  className?: string;
}) {
  return (
    <span className={`balloon balloon--${kind} balloon--tail-${tail} ${className}`}>
      <span className="balloon__text">{children}</span>
    </span>
  );
}

/** Red ink stamp, slightly crooked, as pressed by hand. */
export function Stamp({ children, tone = 'red', className = '' }: { children: ReactNode; tone?: 'red' | 'ink'; className?: string }) {
  return <span className={`stamp stamp--${tone} ${className}`}>{children}</span>;
}

const KANJI = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/** 3 → 三, 12 → 十二, 16 → 十六 */
export function toKanji(n: number): string {
  if (n <= 10) return KANJI[n];
  if (n < 20) return `十${KANJI[n - 10]}`;
  const t = Math.floor(n / 10);
  const u = n % 10;
  return `${KANJI[t]}十${u ? KANJI[u] : ''}`;
}

/** Vertical chapter marker, e.g. 第三章, set like the spine text of a tankōbon. */
export function ChapterMark({ no }: { no: string }) {
  const n = parseInt(no, 10);
  if (Number.isNaN(n)) return null;
  return (
    <span className="chapter-mark" lang="ja" aria-hidden="true">
      第{toKanji(n)}章
    </span>
  );
}
