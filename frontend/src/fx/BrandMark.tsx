/**
 * A hand-brushed brand mark, drawn for this fan site in homage to the
 * Brand of Sacrifice. Rendered faint and slowly smouldering behind the title.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`brand-mark ${className}`} viewBox="0 0 200 300" aria-hidden="true">
      <defs>
        <filter id="brand-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#brand-glow)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g filter="url(#ink-rough)">
          {/* stem, hooked at the crown */}
          <path d="M100 286 C98 220 101 150 100 92 C99 62 104 40 118 28 C128 20 132 34 122 40" strokeWidth="13" />
          {/* the two arms, falling away like a cast-down figure */}
          <path d="M100 118 C84 140 66 168 40 212" strokeWidth="11" />
          <path d="M100 118 C116 140 134 168 160 212" strokeWidth="11" />
          {/* the cross-stroke */}
          <path d="M66 98 C86 94 114 94 134 98" strokeWidth="9" />
        </g>
      </g>
    </svg>
  );
}
