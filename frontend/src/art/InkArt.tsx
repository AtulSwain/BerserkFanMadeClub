import { useId, useMemo, type ReactNode } from 'react';
import type { ArtVariant, Asset } from '@/data/types';

/**
 * Original abstract placeholder artwork.
 *
 * These are procedural ink compositions drawn for this archive. They are NOT
 * Berserk artwork and must never be presented as such. Pass a licensed `asset`
 * to replace a placeholder with real, legally obtained art.
 */

function rng(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 300;
const H = 400;

/** Radiating speed lines toward a focal point. */
function speedLines(r: () => number, cx: number, cy: number, n = 70, inner = 60, color = 'currentColor') {
  const lines: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.05;
    const r0 = inner + r() * 60;
    const r1 = 420;
    const w = 0.4 + r() * 2.2;
    lines.push(
      <line
        key={i}
        x1={cx + Math.cos(a) * r0}
        y1={cy + Math.sin(a) * r0}
        x2={cx + Math.cos(a) * r1}
        y2={cy + Math.sin(a) * r1}
        stroke={color}
        strokeWidth={w}
        opacity={0.25 + r() * 0.5}
      />,
    );
  }
  return <g>{lines}</g>;
}

/** Horizontal "ground" hatching. */
function groundHatch(r: () => number, y0: number, color = 'currentColor') {
  const lines: ReactNode[] = [];
  for (let y = y0; y < H; y += 3 + r() * 3) {
    const x0 = r() * 40 - 20;
    lines.push(<line key={y} x1={x0} y1={y} x2={W - x0 + r() * 30} y2={y + (r() - 0.5) * 6} stroke={color} strokeWidth={0.6 + r()} opacity={0.5} />);
  }
  return <g>{lines}</g>;
}

function rain(r: () => number, n = 90) {
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 120) - 60;
    const y = r() * H;
    const l = 20 + r() * 60;
    out.push(<line key={i} x1={x} y1={y} x2={x - l * 0.45} y2={y + l} stroke="currentColor" strokeWidth={0.5 + r()} opacity={0.35} />);
  }
  return <g>{out}</g>;
}

function crowd(r: () => number, baseY: number, n = 26) {
  const heads: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / n) * (W + 40) - 20 + r() * 10;
    const y = baseY + r() * 30;
    const s = 9 + r() * 7;
    heads.push(
      <g key={i}>
        <circle cx={x} cy={y} r={s} fill="#080808" />
        <path d={`M${x - s * 1.8} ${H} Q${x - s * 1.6} ${y + s} ${x} ${y + s * 0.8} Q${x + s * 1.6} ${y + s} ${x + s * 1.8} ${H} Z`} fill="#080808" />
        {r() > 0.6 && <line x1={x + s} y1={y - 80 - r() * 40} x2={x + s * 0.6} y2={H} stroke="#080808" strokeWidth={2} />}
      </g>,
    );
  }
  return <g>{heads}</g>;
}

const silhouettes: Record<ArtVariant, (r: () => number, ids: Record<string, string>) => ReactNode> = {
  swordsman: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.18} />
      {speedLines(r, 105, 105, 60, 54, '#f1eee6')}
      <circle cx={105} cy={105} r={46} fill="#f1eee6" />
      {/* sword resting on the shoulder — original abstract silhouette */}
      <path d="M209 181 L59 31 L41 49 L191 199 Z" fill="#080808" stroke="#f1eee6" strokeWidth="1.4" />
      <path d="M220 180 L190 210" stroke="#f1eee6" strokeWidth="9" />
      <path d="M220 180 L190 210" stroke="#080808" strokeWidth="6" />
      <path d="M205 195 L234 224" stroke="#080808" strokeWidth="9" strokeLinecap="square" />
      {/* figure seen from behind */}
      <circle cx={150} cy={148} r={17} fill="#080808" />
      <path d="M132 165 C112 168 96 176 92 190 C84 230 66 300 46 372 L62 360 L74 378 L92 362 L108 382 L126 364 L144 384 L160 366 L178 386 L196 364 L214 380 L230 362 L254 372 C234 300 214 232 208 190 C204 176 188 168 168 165 Z" fill="#080808" />
      <path d="M188 172 L216 196 L206 208 L180 188 Z" fill="#080808" />
      {groundHatch(r, 372, '#f1eee6')}
    </>
  ),
  figure: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.3} />
      {speedLines(r, 150, 130, 55, 90)}
      <ellipse cx={150} cy={118} rx={26} ry={30} fill="#080808" />
      <path d="M150 140 C100 150 90 220 80 400 L220 400 C210 220 200 150 150 140 Z" fill="#080808" />
      <path d="M118 170 L60 400 M182 170 L240 400" stroke="#080808" strokeWidth="8" />
    </>
  ),
  woman: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.25} />
      {speedLines(r, 150, 140, 50, 100)}
      <path d="M150 90 C122 90 112 116 116 142 C108 170 104 190 112 220 L188 220 C196 190 192 170 184 142 C188 116 178 90 150 90 Z" fill="#080808" />
      <path d="M150 200 C112 210 98 260 92 400 L208 400 C202 260 188 210 150 200 Z" fill="#080808" />
      <path d="M120 120 C134 112 150 118 160 108" stroke="#f1eee6" strokeWidth="1.2" fill="none" opacity="0.5" />
    </>
  ),
  hawk: (r) => (
    <>
      <rect width={W} height={H} fill="#f1eee6" />
      {speedLines(r, 150, 180, 80, 40, '#080808')}
      <path d="M150 170 C120 140 70 120 10 128 C60 140 80 158 96 176 C60 172 30 184 6 204 C60 196 100 196 128 206 L142 250 L150 236 L158 250 L172 206 C200 196 240 196 294 204 C270 184 240 172 204 176 C220 158 240 140 290 128 C230 120 180 140 150 170 Z" fill="#080808" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${40 + r() * 220} ${260 + r() * 120} q6 -10 2 -22 q-6 10 -2 22 z`} fill="#080808" opacity={0.7} transform={`rotate(${r() * 90 - 45})`} />
      ))}
    </>
  ),
  eclipse: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {speedLines(r, 150, 130, 110, 66, '#f1eee6')}
      <circle cx={150} cy={130} r={64} fill="#f1eee6" />
      <circle cx={150} cy={130} r={60} fill="#080808" />
      <path d="M96 150 A60 60 0 0 0 204 150 A64 64 0 0 1 96 150 Z" fill="#7d1111" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = (i / 14) * W + r() * 14;
        const h = 60 + r() * 70;
        return <path key={i} d={`M${x} ${H} L${x - 6} ${H - h} L${x - 2} ${H - h - 14} L${x + 3} ${H - h - 4} L${x + 8} ${H - h - 12} L${x + 10} ${H - h} L${x + 14} ${H}`} fill="#1a1a1a" stroke="#f1eee6" strokeWidth="0.5" opacity="0.9" />;
      })}
    </>
  ),
  tower: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.4} />
      <path d="M118 400 L128 90 L150 50 L172 90 L182 400 Z" fill="#080808" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M126 ${110 + i * 36} L176 ${126 + i * 36}`} stroke="#f1eee6" strokeWidth="1" opacity="0.5" />)}
      <rect x={144} y={140} width={10} height={18} fill="#7d1111" />
      {crowd(r, 330, 22)}
    </>
  ),
  sea: (r) => (
    <>
      <rect width={W} height={H} fill="#f1eee6" />
      {Array.from({ length: 40 }, (_, i) => {
        const y = 150 + i * 7;
        let d = `M-10 ${y}`;
        for (let x = 0; x <= W + 20; x += 20) d += ` Q${x + 5} ${y - 4 - r() * 6} ${x + 10} ${y} T${x + 20} ${y}`;
        return <path key={i} d={d} stroke="#080808" strokeWidth={0.6 + i * 0.05} fill="none" />;
      })}
      <path d="M80 160 C100 60 210 40 240 130 C250 150 240 170 220 170 Z" fill="#080808" />
      <circle cx={196} cy={110} r={6} fill="#7d1111" />
    </>
  ),
  tree: (r) => (
    <>
      <rect width={W} height={H} fill="#d8d2c5" />
      {speedLines(r, 150, 60, 60, 20, '#080808')}
      <path d="M134 400 C138 300 130 230 110 180 C80 170 40 130 20 90 C60 120 90 140 120 150 C110 110 120 70 150 30 C170 70 180 110 176 150 C210 140 240 120 280 90 C260 130 220 170 190 180 C170 230 162 300 166 400 Z" fill="#080808" />
      {groundHatch(r, 370, '#080808')}
    </>
  ),
  hand: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {speedLines(r, 150, 100, 70, 30, '#7d1111')}
      <path d="M90 400 L96 250 C80 220 70 170 82 150 C90 140 100 150 104 172 L110 210 L112 120 C112 100 132 100 132 120 L134 200 L138 100 C138 80 160 80 160 100 L160 200 L168 116 C170 96 190 98 190 118 L186 214 L198 160 C202 140 222 146 218 166 L204 270 L210 400 Z" fill="#f1eee6" />
      <path d="M96 250 L204 270" stroke="#080808" strokeWidth="1" opacity="0.4" />
    </>
  ),
  beast: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.35} />
      {speedLines(r, 150, 170, 90, 90)}
      <path d="M150 120 L120 60 L134 120 C110 120 96 140 96 170 L20 120 L60 200 L10 240 L90 230 L100 300 L80 400 L220 400 L200 300 L210 230 L290 240 L240 200 L280 120 L204 170 C204 140 190 120 166 120 L180 60 Z" fill="#080808" />
      <circle cx={134} cy={160} r={4} fill="#7d1111" />
      <circle cx={166} cy={160} r={4} fill="#7d1111" />
    </>
  ),
  crowd: (r, ids) => (
    <>
      <rect width={W} height={H} fill="#beb6a6" />
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.5} />
      {crowd(r, 210, 18)}
      {crowd(r, 280, 24)}
    </>
  ),
  landscape: (r) => (
    <>
      <rect width={W} height={H} fill="#d8d2c5" />
      <path d={`M0 230 Q60 180 110 220 T210 200 T300 190 L300 400 L0 400 Z`} fill="#080808" opacity={0.85} />
      <path d={`M0 280 Q80 240 150 280 T300 260 L300 400 L0 400 Z`} fill="#080808" />
      {groundHatch(r, 150, '#080808')}
    </>
  ),
  sword: (r) => (
    <>
      <rect width={W} height={H} fill="#f1eee6" />
      {speedLines(r, 260, 60, 90, 40, '#080808')}
      <path d="M-10 380 L250 60 L290 80 L30 400 Z" fill="#080808" />
      <path d="M8 360 L270 66" stroke="#f1eee6" strokeWidth="1" />
    </>
  ),
  armor: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {speedLines(r, 150, 200, 70, 120, '#4a0909')}
      <path d="M150 80 C90 80 70 140 76 200 L60 180 L70 240 L100 260 L110 320 L190 320 L200 260 L230 240 L240 180 L224 200 C230 140 210 80 150 80 Z" fill="#1a1a1a" stroke="#f1eee6" strokeWidth="1.2" />
      <path d="M110 190 L140 200 L130 214 Z M190 190 L160 200 L170 214 Z" fill="#7d1111" />
      <path d="M112 250 L124 280 L136 256 L150 290 L164 256 L176 280 L188 250" stroke="#f1eee6" strokeWidth="2" fill="none" />
    </>
  ),
  skull: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {speedLines(r, 150, 160, 60, 110, '#f1eee6')}
      <path d="M150 70 C96 70 84 120 88 170 C92 200 104 214 110 240 L190 240 C196 214 208 200 212 170 C216 120 204 70 150 70 Z" fill="#f1eee6" />
      <path d="M108 150 C120 140 138 146 138 166 C126 176 112 170 108 150 Z M192 150 C180 140 162 146 162 166 C174 176 188 170 192 150 Z" fill="#080808" />
      <path d="M144 190 L150 176 L156 190 Z" fill="#080808" />
      <path d="M116 226 L184 226" stroke="#080808" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M70 400 L110 240 L190 240 L230 400 Z" fill="#1a1a1a" />
    </>
  ),
  witch: (r, ids) => (
    <>
      <rect width={W} height={H} fill={`url(#${ids.hatch})`} opacity={0.3} />
      {speedLines(r, 150, 150, 50, 110)}
      <path d="M150 40 L196 170 L104 170 Z" fill="#080808" />
      <ellipse cx={150} cy={172} rx={80} ry={12} fill="#080808" />
      <path d="M150 180 C116 190 110 260 100 400 L200 400 C190 260 184 190 150 180 Z" fill="#080808" />
      <line x1={220} y1={120} x2={196} y2={400} stroke="#080808" strokeWidth="5" />
      <circle cx={221} cy={116} r={8} fill="none" stroke="#7d1111" strokeWidth="2" />
    </>
  ),
  elf: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={r() * W} cy={r() * H} r={r() * 1.6} fill="#f1eee6" opacity={r()} />)}
      <circle cx={150} cy={190} r={70} fill="#f1eee6" opacity={0.06} />
      <path d="M150 170 C110 120 80 130 70 160 C100 170 120 180 146 190 Z M150 170 C190 120 220 130 230 160 C200 170 180 180 154 190 Z" fill="#f1eee6" opacity={0.7} />
      <ellipse cx={150} cy={190} rx={9} ry={20} fill="#f1eee6" />
      <circle cx={150} cy={165} r={8} fill="#f1eee6" />
    </>
  ),
  egg: (r) => (
    <>
      <rect width={W} height={H} fill="#080808" />
      {speedLines(r, 150, 200, 90, 100, '#4a0909')}
      <path d="M150 110 C200 110 222 190 216 240 C210 290 184 310 150 310 C116 310 90 290 84 240 C78 190 100 110 150 110 Z" fill="#7d1111" />
      <path d="M118 200 Q130 192 140 204 M168 214 Q178 204 190 210 M130 250 Q154 270 178 246 M148 170 L152 236" stroke="#080808" strokeWidth="3" fill="none" />
    </>
  ),
  castle: (r) => (
    <>
      <rect width={W} height={H} fill="#d8d2c5" />
      {speedLines(r, 150, 120, 50, 160, '#080808')}
      <path d="M20 400 L20 220 L40 220 L40 206 L52 206 L52 220 L70 220 L70 160 L84 160 L84 146 L96 146 L96 160 L110 160 L110 100 L126 100 L126 86 L138 86 L138 100 L162 100 L162 86 L174 86 L174 100 L190 100 L190 160 L204 160 L204 146 L216 146 L216 160 L230 160 L230 220 L248 220 L248 206 L260 206 L260 220 L280 220 L280 400 Z" fill="#080808" />
      <path d="M140 400 L140 330 Q150 316 160 330 L160 400 Z" fill="#d8d2c5" />
    </>
  ),
  storm: (r) => (
    <>
      <rect width={W} height={H} fill="#1a1a1a" />
      {rain(r, 140)}
      <path d="M180 0 L150 120 L176 124 L120 260 L196 110 L170 106 L210 0 Z" fill="#f1eee6" />
      {groundHatch(r, 340, '#f1eee6')}
    </>
  ),
};

interface InkArtProps {
  variant?: ArtVariant;
  seed?: string;
  asset?: Asset;
  label?: string;
  showCredit?: boolean;
  className?: string;
}

export function InkArt({ variant = 'figure', seed, asset, label, showCredit = true, className }: InkArtProps) {
  const uid = useId().replace(/:/g, '');
  const ids = { hatch: `h${uid}`, rough: `r${uid}` };
  const body = useMemo(() => silhouettes[variant](rng(`${variant}:${seed ?? ''}`), ids), [variant, seed, uid]);

  if (asset) {
    return (
      <figure className={`art ${className ?? ''}`} style={{ margin: 0 }}>
        <img src={asset.src} alt={asset.alt} loading="lazy" decoding="async" />
        {showCredit && <figcaption className="art__credit">{asset.credit} · {asset.license}</figcaption>}
      </figure>
    );
  }

  return (
    <div className={`art ${className ?? ''}`} role="img" aria-label={label ? `${label} — original abstract placeholder, not official artwork` : 'Original abstract placeholder art'}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id={ids.hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#f1eee6" strokeWidth="0.8" />
          </pattern>
        </defs>
        <g filter="url(#ink-rough-soft)">{body}</g>
      </svg>
      {showCredit && <span className="art__credit">Placeholder · original abstract</span>}
    </div>
  );
}
