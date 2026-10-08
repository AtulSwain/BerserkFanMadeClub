import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { archive, hrefFor } from '@/data/archive';
import { Spoiler } from './Spoiler';

type Tone = 'black' | 'paper' | 'aged' | 'abyss';

interface PageProps {
  chapter: string;
  folio: number;
  tone?: Tone;
  children: ReactNode;
  id?: string;
  className?: string;
  label?: string;
}

/** A single printed page: running head, content, folio. */
export function Page({ chapter, folio, tone = 'black', children, id, className, label }: PageProps) {
  const toneClass = tone === 'black' ? '' : tone === 'aged' ? 'page--paper page--aged' : `page--${tone}`;
  return (
    <section id={id} className={`page ${toneClass} ${className ?? ''}`} aria-label={label ?? chapter}>
      <header className="running-head" aria-hidden="true">
        <span>
          <span className="running-head__mark">■</span> Berserk · The Manga Archive
        </span>
        <span>{chapter}</span>
      </header>
      {children}
      <footer className="folio" aria-hidden="true">
        <span className="roman" style={{ fontSize: 10 }}>Fan archive</span>
        <span className="folio__num">{String(folio).padStart(3, '0')}</span>
        <span className="roman" style={{ fontSize: 10 }}>{chapter}</span>
      </footer>
    </section>
  );
}

interface HeadProps {
  no: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
}

export function PageHead({ no, kicker, title, lede }: HeadProps) {
  return (
    <div className="page-head">
      <div>
        <div className="page-head__kicker">
          <span className="page-head__no">{no}</span>
          <span className="label label--ink">{kicker}</span>
        </div>
        <h1 className="chapter-title">{title}</h1>
      </div>
      {lede && <div className="page-head__lede">{lede}</div>}
    </div>
  );
}

/** Reveal a panel as it scrolls into view. */
export function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** Cross-reference to any archive entity, spoiler-aware. */
export function Xref({ id, children }: { id: string; children?: ReactNode }) {
  const e = archive.get(id);
  if (!e) return <span className="muted">{children ?? id}</span>;
  return (
    <Spoiler level={e.spoiler} what={e.kind}>
      <Link className="xref" to={hrefFor(e)}>
        {children ?? e.name}
      </Link>
    </Spoiler>
  );
}

export function XrefList({ ids, empty = '—' }: { ids: string[]; empty?: string }) {
  if (!ids.length) return <span className="muted">{empty}</span>;
  return (
    <span className="xref-list">
      {ids.map((id) => (
        <Xref key={id} id={id} />
      ))}
    </span>
  );
}

/** A hand-drawn horizontal ink stroke. */
export function InkRule({ className }: { className?: string }) {
  return (
    <svg className={`ink-rule ${className ?? ''}`} viewBox="0 0 600 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8 C80 5 160 9 240 7 S420 4 520 8 S590 7 598 6 L598 9 C520 11 440 8 330 10 S120 11 2 10 Z" fill="currentColor" />
    </svg>
  );
}

/** Global SVG filters: rough ink borders and title bleed. Rendered once. */
export function InkFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" />
      </filter>
      <filter id="ink-rough-soft">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="2" />
      </filter>
      <filter id="ink-bleed" x="-2%" y="-10%" width="104%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.5" result="holes" />
        <feComposite in="SourceGraphic" in2="holes" operator="in" result="pitted" />
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="warp" />
        <feDisplacementMap in="pitted" in2="warp" scale="4" />
      </filter>
    </svg>
  );
}
