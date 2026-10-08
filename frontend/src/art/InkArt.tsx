import { useId, useMemo, type ReactNode } from 'react';
import type { ArtVariant, Asset } from '@/data/types';
import { assetFor, fileFor } from '@/data/assets';

/**
 * Original manga-style placeholder artwork.
 *
 * Every drawing here is procedural and made for this archive. The *techniques*
 * follow seinen manga practice (cross-hatching, screentone, rim light, focus
 * lines, sound effects), but nothing reproduces a Berserk panel or character
 * design. Pass a licensed `asset` (see src/data/assets.ts) to show real art.
 */

const W = 300;
const H = 400;
const INK = '#0a0a0a';
const PAPER = '#f1eee6';
const RED = '#7d1111';

type R = () => number;

function rng(seedStr: string): R {
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

/** Per-drawing id factory so pattern/mask ids never collide between panels. */
interface Kit {
  r: R;
  id: (name: string) => string;
  url: (name: string) => string;
  next: () => string;
}

/* ─────────────────────────── drawing helpers ─────────────────────────── */

/** Focus lines (集中線): tapered wedges converging on a point. */
function focusLines(k: Kit, cx: number, cy: number, n = 90, inner = 70, color = INK, alpha = 1) {
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (k.r() - 0.5) * 0.06;
    const r0 = inner + k.r() * 70;
    const w = 0.004 + k.r() * 0.016;
    const R1 = 520;
    const p = (ang: number, rad: number) => `${cx + Math.cos(ang) * rad} ${cy + Math.sin(ang) * rad}`;
    out.push(<path key={i} d={`M${p(a, r0)} L${p(a - w, R1)} L${p(a + w, R1)} Z`} fill={color} opacity={alpha * (0.55 + k.r() * 0.45)} />);
  }
  return <g>{out}</g>;
}

/** Parallel speed lines (流線) for motion. */
function speedLines(k: Kit, angle: number, n = 60, color = INK) {
  const out: ReactNode[] = [];
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  for (let i = 0; i < n; i++) {
    const off = (k.r() - 0.5) * 700;
    const len = 60 + k.r() * 260;
    const sx = W / 2 - dy * off - dx * 300 + dx * k.r() * 300;
    const sy = H / 2 + dx * off - dy * 300 + dy * k.r() * 300;
    out.push(<line key={i} x1={sx} y1={sy} x2={sx + dx * len} y2={sy + dy * len} stroke={color} strokeWidth={0.4 + k.r() * 1.8} strokeLinecap="round" opacity={0.35 + k.r() * 0.5} />);
  }
  return <g>{out}</g>;
}

/** Screentone: a dot pattern faded by a gradient mask, like a cut sheet of tone. */
function tone(
  k: Kit,
  o: { dir?: 'down' | 'up' | 'radial'; cx?: number; cy?: number; rad?: number; light?: boolean; vignette?: boolean; x?: number; y?: number; w?: number; h?: number; strength?: number },
) {
  const gid = k.next();
  const mid = k.next();
  const { dir = 'down', x = 0, y = 0, w = W, h = H, strength = 1 } = o;
  const grad =
    dir === 'radial' ? (
      <radialGradient id={gid} cx={(o.cx ?? 150) / W} cy={(o.cy ?? 150) / H} r={(o.rad ?? 200) / W} gradientUnits="objectBoundingBox">
        <stop offset="0" stopColor={o.vignette ? '#000' : '#fff'} stopOpacity={o.vignette ? 1 : strength} />
        <stop offset="1" stopColor={o.vignette ? '#fff' : '#000'} stopOpacity={o.vignette ? strength : 1} />
      </radialGradient>
    ) : (
      <linearGradient id={gid} x1="0" y1={dir === 'down' ? 0 : 1} x2="0" y2={dir === 'down' ? 1 : 0}>
        <stop offset="0" stopColor="#fff" stopOpacity={strength} />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
    );
  return (
    <g>
      <defs>
        {grad}
        <mask id={mid}>
          <rect x={x} y={y} width={w} height={h} fill={`url(#${gid})`} />
        </mask>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={k.url(o.light ? 'dotW' : 'dot')} mask={`url(#${mid})`} />
    </g>
  );
}

/** Cross-hatching inside a shape: 1 = single, 2 = cross, 3 = triple. */
function hatch(k: Kit, d: string, layers = 1, light = false, opacity = 1) {
  const set = light ? ['hW1', 'hW2', 'hW3'] : ['h1', 'h2', 'h3'];
  return (
    <g opacity={opacity}>
      {set.slice(0, layers).map((p) => (
        <path key={p} d={d} fill={k.url(p)} />
      ))}
    </g>
  );
}

/** Silhouette with a rim of light on one side — the shape is drawn twice, offset. */
function rimmed(d: string, dx = -2.4, dy = 0, fill = INK, rim = PAPER, rimW = 2.6) {
  return (
    <g>
      <path d={d} fill="none" stroke={rim} strokeWidth={rimW} strokeLinejoin="round" />
      <path d={d} fill={fill} transform={`translate(${dx} ${dy})`} />
    </g>
  );
}

/** Loose hand-drawn strokes inside a shape: folds, fur, cracks. */
function strokes(k: Kit, n: number, box: [number, number, number, number], color = PAPER, len = 30, angle = 1.3, width = 0.8, alpha = 0.55) {
  const [x, y, w, h] = box;
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const sx = x + k.r() * w;
    const sy = y + k.r() * h;
    const a = angle + (k.r() - 0.5) * 0.5;
    const l = len * (0.5 + k.r());
    const bend = (k.r() - 0.5) * 12;
    out.push(
      <path
        key={i}
        d={`M${sx} ${sy} q${Math.cos(a) * l * 0.5 + bend} ${Math.sin(a) * l * 0.5} ${Math.cos(a) * l} ${Math.sin(a) * l}`}
        stroke={color}
        strokeWidth={width * (0.5 + k.r())}
        fill="none"
        strokeLinecap="round"
        opacity={alpha}
      />,
    );
  }
  return <g>{out}</g>;
}

/** Ink spatter and dry-brush flecks. */
function splatter(k: Kit, n = 30, color = INK, box: [number, number, number, number] = [0, 0, W, H]) {
  const [x, y, w, h] = box;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const s = k.r() < 0.85 ? 0.6 + k.r() * 1.6 : 2.5 + k.r() * 4;
        return <circle key={i} cx={x + k.r() * w} cy={y + k.r() * h} r={s} fill={color} opacity={0.6 + k.r() * 0.4} />;
      })}
    </g>
  );
}

/** Horizontal ground strokes. */
function ground(k: Kit, y0: number, color = INK) {
  const out: ReactNode[] = [];
  for (let y = y0; y < H + 10; y += 2.5 + k.r() * 4) {
    const x0 = k.r() * 60 - 30;
    const x1 = W - k.r() * 60 + 30;
    out.push(<path key={y} d={`M${x0} ${y} Q${(x0 + x1) / 2} ${y + (k.r() - 0.5) * 6} ${x1} ${y + (k.r() - 0.5) * 4}`} stroke={color} strokeWidth={0.5 + k.r() * 1.2} fill="none" opacity={0.6} />);
  }
  return <g>{out}</g>;
}

function crowd(k: Kit, baseY: number, n = 20, scale = 1, spears = true) {
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / n) * (W + 60) - 30 + k.r() * 12;
    const y = baseY + k.r() * 26 * scale;
    const s = (8 + k.r() * 6) * scale;
    out.push(
      <g key={i}>
        {spears && k.r() > 0.45 && <path d={`M${x + s * 0.9} ${y - (90 + k.r() * 60) * scale} l${(k.r() - 0.5) * 10} ${H}`} stroke={INK} strokeWidth={1.6 * scale} />}
        {spears && k.r() > 0.7 && <path d={`M${x + s * 0.9} ${y - 150 * scale} l-4 10 l8 0 Z`} fill={INK} />}
        <ellipse cx={x} cy={y} rx={s * 0.85} ry={s} fill={INK} />
        <path d={`M${x - s * 2} ${H + 20} Q${x - s * 1.8} ${y + s * 0.9} ${x} ${y + s * 0.7} Q${x + s * 1.8} ${y + s * 0.9} ${x + s * 2} ${H + 20} Z`} fill={INK} />
      </g>,
    );
  }
  return <g>{out}</g>;
}

/* ─────────────────────────── compositions ─────────────────────────── */

const SWORDSMAN_CAPE =
  'M132 165 C112 168 96 176 92 190 C84 230 66 300 46 372 L62 360 L70 381 L88 364 L102 388 L122 366 L140 390 L158 368 L176 392 L194 366 L212 386 L230 364 L254 374 C234 300 214 232 208 190 C204 176 188 168 168 165 Z';

const compositions: Record<ArtVariant, (k: Kit) => ReactNode> = {
  swordsman: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {tone(k, { dir: 'radial', cx: 105, cy: 105, rad: 260, light: true, strength: 0.9 })}
      {focusLines(k, 105, 105, 70, 56, PAPER, 0.5)}
      <circle cx={105} cy={105} r={46} fill={PAPER} />
      <path d="M78 76 A46 46 0 0 0 96 150 A40 40 0 0 1 78 76 Z" fill={k.url('h2')} />
      {/* blade on the shoulder */}
      <path d="M209 181 L59 31 L41 49 L191 199 Z" fill={INK} stroke={PAPER} strokeWidth="1.2" />
      <path d="M200 182 L56 38" stroke={PAPER} strokeWidth="0.6" opacity="0.7" />
      <path d="M205 195 L234 224" stroke={INK} strokeWidth="9" strokeLinecap="square" />
      <path d="M222 178 L188 212" stroke={INK} strokeWidth="7" />
      <path d="M222 178 L188 212" stroke={PAPER} strokeWidth="0.8" />
      {/* figure from behind, rim-lit by the moon */}
      {rimmed('M150 131 C140 131 133 139 133 149 C133 159 140 166 150 166 C160 166 167 159 167 149 C167 139 160 131 150 131 Z', 2.4, 1.6)}
      {rimmed(SWORDSMAN_CAPE, 2.4, 1.4)}
      {rimmed('M188 172 L216 196 L206 208 L180 188 Z', 1.6, 1.6)}
      {strokes(k, 18, [80, 200, 150, 160], PAPER, 60, 1.62, 0.7, 0.22)}
      {ground(k, 378, PAPER)}
      {splatter(k, 22, PAPER, [0, 300, W, 100])}
    </>
  ),
  figure: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {focusLines(k, 150, 150, 100, 110)}
      {tone(k, { dir: 'up', y: 220, h: 180 })}
      {rimmed('M150 92 C132 92 122 108 124 126 C126 144 136 154 150 154 C164 154 174 144 176 126 C178 108 168 92 150 92 Z', 0, 0, INK, PAPER, 0)}
      <path d="M150 150 C112 156 96 190 88 240 L72 400 L228 400 L212 240 C204 190 188 156 150 150 Z" fill={INK} />
      {hatch(k, 'M88 240 L72 400 L228 400 L212 240 Z', 1, true, 0.35)}
      <path d="M150 160 L150 400" stroke={PAPER} strokeWidth="0.8" opacity="0.4" />
      {strokes(k, 14, [90, 180, 120, 200], PAPER, 50, 1.55, 0.6, 0.3)}
    </>
  ),
  woman: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'radial', vignette: true, cx: 150, cy: 150, rad: 230, strength: 0.8 })}
      {focusLines(k, 150, 150, 80, 120, INK, 0.7)}
      {/* short hair, cloak over armor — original design */}
      <path d="M150 86 C122 86 108 108 112 136 C114 156 124 170 132 176 L168 176 C176 170 186 156 188 136 C192 108 178 86 150 86 Z" fill={INK} />
      <path d="M118 120 C132 104 156 100 182 116" stroke={PAPER} strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M150 176 C108 184 92 230 84 300 L74 400 L226 400 L216 300 C208 230 192 184 150 176 Z" fill={INK} />
      {hatch(k, 'M84 300 L74 400 L226 400 L216 300 Z', 2, true, 0.25)}
      <path d="M150 190 L150 260 M120 230 L180 230" stroke={PAPER} strokeWidth="0.8" opacity="0.35" />
      <path d="M205 200 L250 400" stroke={INK} strokeWidth="5" />
      {splatter(k, 14)}
    </>
  ),
  hawk: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 240, strength: 0.7 })}
      {focusLines(k, 150, 190, 110, 50)}
      <path d="M150 175 C120 140 70 120 8 128 C58 140 80 158 96 176 C60 172 28 184 4 206 C60 196 100 196 128 208 L140 256 L150 240 L160 256 L172 208 C200 196 240 196 296 206 C272 184 240 172 204 176 C220 158 242 140 292 128 C230 120 180 140 150 175 Z" fill={INK} />
      {strokes(k, 26, [20, 140, 260, 70], PAPER, 22, 0.25, 0.6, 0.5)}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 30 + k.r() * 240;
        const y = 270 + k.r() * 120;
        return <path key={i} d={`M${x} ${y} q5 -12 1 -24 q-7 10 -1 24 z`} fill={INK} transform={`rotate(${k.r() * 120 - 60} ${x} ${y})`} />;
      })}
    </>
  ),
  eclipse: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {focusLines(k, 150, 130, 140, 66, PAPER, 0.75)}
      <circle cx={150} cy={130} r={68} fill={PAPER} />
      <circle cx={150} cy={130} r={63} fill={INK} />
      <path d="M92 150 A62 62 0 0 0 208 150 A68 68 0 0 1 92 150 Z" fill={RED} />
      {/* a horizon of reaching hands */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i / 16) * W + k.r() * 10;
        const h = 50 + k.r() * 80;
        const b = H + 4;
        return (
          <path
            key={i}
            d={`M${x - 8} ${b} L${x - 7} ${b - h} L${x - 10} ${b - h - 18} L${x - 6} ${b - h - 6} L${x - 3} ${b - h - 24} L${x} ${b - h - 8} L${x + 3} ${b - h - 22} L${x + 5} ${b - h - 6} L${x + 9} ${b - h - 14} L${x + 7} ${b - h} L${x + 8} ${b}`}
            fill={INK}
            stroke={PAPER}
            strokeWidth="0.8"
          />
        );
      })}
      {tone(k, { dir: 'up', y: 260, h: 140, light: true, strength: 0.6 })}
    </>
  ),
  tower: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 260 })}
      {speedLines(k, Math.PI / 2 + 0.25, 40)}
      <path d="M112 400 L124 92 L150 44 L176 92 L188 400 Z" fill={INK} />
      {hatch(k, 'M150 44 L176 92 L188 400 L150 400 Z', 1, true, 0.4)}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M120 ${108 + i * 32} L180 ${122 + i * 32}`} stroke={PAPER} strokeWidth="1.2" opacity="0.55" />
      ))}
      <rect x={143} y={140} width={10} height={20} fill={RED} />
      {crowd(k, 330, 24, 1)}
    </>
  ),
  sea: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 160, strength: 0.8 })}
      {Array.from({ length: 34 }, (_, i) => {
        const y = 160 + i * 7.5;
        let d = `M-10 ${y}`;
        for (let x = 0; x <= W + 30; x += 22) d += ` q6 ${-4 - k.r() * 7} 11 0 t11 0`;
        return <path key={i} d={d} stroke={INK} strokeWidth={0.6 + i * 0.07} fill="none" />;
      })}
      {/* a vast back breaking the surface */}
      <path d="M60 172 C84 70 214 40 252 130 C262 152 254 170 232 172 Z" fill={INK} />
      {strokes(k, 30, [80, 80, 160, 80], PAPER, 18, 0.2, 0.7, 0.35)}
      <circle cx={204} cy={112} r={6} fill={RED} />
      <path d="M40 176 C80 160 230 160 270 176" stroke={PAPER} strokeWidth="3" fill="none" />
    </>
  ),
  tree: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'radial', vignette: true, cx: 150, cy: 70, rad: 280, strength: 0.75 })}
      {focusLines(k, 150, 60, 70, 30, INK, 0.5)}
      <path d="M132 400 C138 300 130 232 110 182 C80 172 40 132 18 92 C58 122 90 140 120 150 C108 110 120 70 150 28 C172 70 182 110 176 150 C210 140 240 120 282 92 C260 132 220 172 190 182 C170 232 162 300 168 400 Z" fill={INK} />
      {strokes(k, 30, [120, 190, 60, 210], PAPER, 40, 1.55, 0.6, 0.35)}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={20 + k.r() * 260} cy={40 + k.r() * 160} r={1 + k.r() * 2} fill={PAPER} stroke={INK} strokeWidth="0.6" />
      ))}
      {ground(k, 372)}
    </>
  ),
  hand: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {focusLines(k, 150, 90, 90, 30, RED, 0.6)}
      <path d="M90 400 L96 250 C80 220 70 170 82 150 C90 140 100 150 104 172 L110 210 L112 120 C112 100 132 100 132 120 L134 200 L138 100 C138 80 160 80 160 100 L160 200 L168 116 C170 96 190 98 190 118 L186 214 L198 160 C202 140 222 146 218 166 L204 270 L210 400 Z" fill={PAPER} />
      {hatch(k, 'M96 250 L204 270 L210 400 L90 400 Z', 2, false, 0.55)}
      {hatch(k, 'M160 100 L160 200 L168 116 Z M186 214 L198 160 L218 166 L204 270 Z', 1, false, 0.6)}
      <path d="M116 208 Q124 214 132 208 M140 202 Q150 208 158 202 M164 206 Q176 212 186 208" stroke={INK} strokeWidth="1" fill="none" />
    </>
  ),
  beast: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {focusLines(k, 150, 170, 120, 100)}
      {tone(k, { dir: 'up', y: 250, h: 150, strength: 0.8 })}
      {rimmed('M150 118 L118 52 L134 118 C110 118 96 140 96 170 L18 118 L58 200 L8 242 L88 230 L98 300 L76 400 L224 400 L202 300 L212 230 L292 242 L242 200 L282 118 L204 170 C204 140 190 118 166 118 L182 52 Z', -2.4, 0, INK, PAPER, 2.4)}
      {hatch(k, 'M96 170 L204 170 L212 230 L202 300 L98 300 L88 230 Z', 1, true, 0.3)}
      {strokes(k, 40, [90, 160, 120, 140], PAPER, 16, 1.4, 0.6, 0.5)}
      <path d="M128 156 L142 162 L130 168 Z M172 156 L158 162 L170 168 Z" fill={RED} />
      <path d="M128 196 L136 210 L144 198 L152 212 L160 198 L168 210 L174 196" stroke={PAPER} strokeWidth="1.6" fill="none" />
      {splatter(k, 18)}
    </>
  ),
  crowd: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 300, strength: 0.6 })}
      {speedLines(k, Math.PI / 2 + 0.15, 30)}
      {crowd(k, 200, 16, 0.8)}
      {crowd(k, 270, 20, 1.15)}
    </>
  ),
  landscape: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 200, strength: 0.5 })}
      <path d="M210 160 l0 -18 l4 0 l0 -6 l4 0 l0 6 l6 0 l0 -10 l4 -6 l4 6 l0 10 l4 0 l0 18 Z" fill={INK} opacity="0.7" />
      <path d="M0 228 Q60 180 110 218 T210 196 T300 188 L300 400 L0 400 Z" fill={INK} opacity="0.8" />
      {hatch(k, 'M0 228 Q60 180 110 218 T210 196 T300 188 L300 260 L0 260 Z', 1, true, 0.4)}
      <path d="M0 282 Q80 238 150 280 T300 258 L300 400 L0 400 Z" fill={INK} />
      {ground(k, 330, PAPER)}
      <path d="M40 120 q10 -6 20 0 q10 -6 20 0" stroke={INK} strokeWidth="1.2" fill="none" />
    </>
  ),
  sword: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {speedLines(k, -0.9, 70)}
      <path d="M-14 380 L248 58 L292 80 L32 404 Z" fill={INK} />
      <path d="M2 372 L262 66" stroke={PAPER} strokeWidth="1.4" />
      {hatch(k, 'M20 396 L280 74 L292 80 L32 404 Z', 1, true, 0.6)}
      {splatter(k, 26, INK, [150, 40, 150, 140])}
      {splatter(k, 8, RED, [170, 60, 120, 100])}
    </>
  ),
  armor: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {focusLines(k, 150, 200, 80, 130, RED, 0.5)}
      {rimmed('M150 76 C88 76 68 138 74 200 L58 180 L68 244 L100 264 L110 326 L190 326 L200 264 L232 244 L242 180 L226 200 C232 138 212 76 150 76 Z', 0, 0, '#1b1b1b', PAPER, 1.4)}
      {hatch(k, 'M150 76 C212 76 232 138 226 200 L200 264 L190 326 L150 326 Z', 2, true, 0.22)}
      <path d="M106 188 L140 200 L128 216 Z M194 188 L160 200 L172 216 Z" fill={RED} />
      <path d="M110 252 L122 284 L136 258 L150 296 L164 258 L178 284 L190 252" stroke={PAPER} strokeWidth="2.2" fill="none" />
      <path d="M150 84 L150 180" stroke={PAPER} strokeWidth="1" opacity="0.5" />
      {strokes(k, 16, [80, 90, 140, 90], PAPER, 20, 0.6, 0.6, 0.3)}
    </>
  ),
  skull: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {tone(k, { dir: 'radial', cx: 150, cy: 160, rad: 240, light: true, strength: 0.8 })}
      {focusLines(k, 150, 160, 70, 110, PAPER, 0.6)}
      <path d="M150 68 C94 68 82 120 86 170 C90 202 104 216 110 242 L190 242 C196 216 210 202 214 170 C218 120 206 68 150 68 Z" fill={PAPER} />
      {hatch(k, 'M150 68 C206 68 218 120 214 170 C210 202 196 216 190 242 L150 242 Z', 2, false, 0.5)}
      <path d="M106 150 C120 138 140 146 140 168 C126 180 110 172 106 150 Z M194 150 C180 138 160 146 160 168 C174 180 190 172 194 150 Z" fill={INK} />
      <path d="M144 192 L150 176 L156 192 Z" fill={INK} />
      <path d="M114 226 L186 226" stroke={INK} strokeWidth="2.5" strokeDasharray="6 3" />
      <path d="M64 400 L108 242 L192 242 L236 400 Z" fill="#1b1b1b" stroke={PAPER} strokeWidth="1" />
      {strokes(k, 20, [80, 260, 140, 130], PAPER, 30, 1.6, 0.6, 0.3)}
    </>
  ),
  witch: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'radial', vignette: true, cx: 150, cy: 170, rad: 260, strength: 0.7 })}
      {focusLines(k, 150, 160, 80, 120)}
      <path d="M150 36 L200 172 L100 172 Z" fill={INK} />
      <ellipse cx={150} cy={174} rx={84} ry={13} fill={INK} />
      <path d="M150 182 C116 192 108 262 98 400 L202 400 C192 262 184 192 150 182 Z" fill={INK} />
      {hatch(k, 'M98 300 L202 300 L202 400 L98 400 Z', 1, true, 0.3)}
      <line x1={224} y1={118} x2={198} y2={400} stroke={INK} strokeWidth="5" />
      <circle cx={225} cy={112} r={10} fill="none" stroke={RED} strokeWidth="2.4" />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={200 + k.r() * 60} cy={70 + k.r() * 80} r={1.2} fill={RED} />)}
    </>
  ),
  elf: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={k.r() * W} cy={k.r() * H} r={k.r() * 1.6} fill={PAPER} opacity={k.r()} />)}
      {tone(k, { dir: 'radial', cx: 150, cy: 190, rad: 120, light: true, strength: 1 })}
      <path d="M150 172 C110 120 76 126 66 160 C98 172 122 182 146 192 Z M150 172 C190 120 224 126 234 160 C202 172 178 182 154 192 Z" fill={PAPER} opacity="0.75" />
      <path d="M150 172 C120 150 96 150 80 160 M150 172 C180 150 204 150 220 160" stroke={INK} strokeWidth="0.6" fill="none" />
      <ellipse cx={150} cy={192} rx={9} ry={20} fill={PAPER} />
      <circle cx={150} cy={166} r={8} fill={PAPER} />
    </>
  ),
  egg: (k) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {focusLines(k, 150, 210, 110, 110, RED, 0.5)}
      <path d="M150 110 C200 110 222 190 216 240 C210 290 184 312 150 312 C116 312 90 290 84 240 C78 190 100 110 150 110 Z" fill={RED} />
      {hatch(k, 'M150 110 C200 110 222 190 216 240 C210 290 184 312 150 312 Z', 2, false, 0.45)}
      {/* displaced, asymmetric features */}
      <path d="M112 196 Q124 186 138 200" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx={126} cy={200} r={3} fill={INK} />
      <path d="M170 222 Q182 214 196 224" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx={184} cy={224} r={2.6} fill={INK} />
      <path d="M150 166 L146 238" stroke={INK} strokeWidth="2.4" />
      <path d="M118 262 Q140 252 158 270 Q172 280 186 262" stroke={INK} strokeWidth="3" fill="none" />
      <path d="M118 140 C130 128 144 124 156 126" stroke={PAPER} strokeWidth="2" fill="none" opacity="0.6" />
    </>
  ),
  castle: (k) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      {tone(k, { dir: 'down', h: 300, strength: 0.7 })}
      {speedLines(k, Math.PI / 2, 26)}
      <path d="M20 400 L20 220 L40 220 L40 206 L52 206 L52 220 L70 220 L70 160 L84 160 L84 146 L96 146 L96 160 L110 160 L110 100 L126 100 L126 86 L138 86 L138 100 L162 100 L162 86 L174 86 L174 100 L190 100 L190 160 L204 160 L204 146 L216 146 L216 160 L230 160 L230 220 L248 220 L248 206 L260 206 L260 220 L280 220 L280 400 Z" fill={INK} />
      {hatch(k, 'M190 100 L190 400 L280 400 L280 220 L230 220 L230 160 L190 160 Z', 1, true, 0.35)}
      {[130, 180, 240].map((y) => <rect key={y} x={146} y={y} width={8} height={16} fill={PAPER} />)}
      <path d="M140 400 L140 330 Q150 316 160 330 L160 400 Z" fill={PAPER} />
      {ground(k, 386)}
    </>
  ),
  storm: (k) => (
    <>
      <rect width={W} height={H} fill="#1a1a1a" />
      {tone(k, { dir: 'down', h: 220, light: true, strength: 0.5 })}
      {speedLines(k, 1.95, 120, PAPER)}
      <path d="M180 0 L150 120 L176 124 L120 260 L196 110 L170 106 L210 0 Z" fill={PAPER} />
      {ground(k, 340, PAPER)}
    </>
  ),
};

/* ─────────────────────────── component ─────────────────────────── */

/** Default sound effect per scene, hand-lettered in katakana the way manga letters noise. */
const SFX_BY_VARIANT: Partial<Record<ArtVariant, string>> = {
  swordsman: 'ゴゴゴ',
  sword: 'ザンッ',
  beast: 'グオオ',
  storm: 'ゴロゴロ',
  eclipse: 'ドクン',
  castle: 'ドドド',
  crowd: 'ザワ…',
  hawk: 'バサッ',
  egg: 'ドクン',
  skull: 'ヒヒーン',
  tower: 'ゴォォ',
  hand: 'ズズ…',
  armor: 'ガキン',
  sea: 'ザバァ',
  tree: 'サァァ',
};

interface InkArtProps {
  variant?: ArtVariant;
  seed?: string;
  asset?: Asset;
  label?: string;
  showCredit?: boolean;
  className?: string;
  /** Hand-lettered sound effect, e.g. ゴゴゴ; 'auto' picks one for the scene. Purely decorative. */
  sfx?: string;
  sfxPos?: 'tl' | 'tr' | 'bl' | 'br';
}

export function InkArt({ variant = 'figure', seed, asset: assetProp, label, showCredit = true, className, sfx, sfxPos = 'tr' }: InkArtProps) {
  const uid = useId().replace(/:/g, '');
  const asset = assetProp ?? assetFor(seed);
  if (sfx === 'auto') sfx = SFX_BY_VARIANT[variant];
  const body = useMemo(() => {
    let n = 0;
    const kit: Kit = {
      r: rng(`${variant}:${seed ?? ''}`),
      id: (name) => `${uid}-${name}`,
      url: (name) => `url(#${uid}-${name})`,
      next: () => `${uid}-x${n++}`,
    };
    return compositions[variant](kit);
  }, [variant, seed, uid]);

  if (asset) {
    return (
      <figure className={`art art--asset ${className ?? ''}`} style={{ margin: 0 }}>
        <img src={asset.src} alt={asset.alt} loading="lazy" decoding="async" />
        {sfx && <span className={`sfx sfx--${sfxPos}`} aria-hidden="true">{sfx}</span>}
        {showCredit && <figcaption className="art__credit">{asset.credit} · {asset.license}</figcaption>}
        {import.meta.env.DEV && seed && <span className="slot-label" aria-hidden="true">{fileFor(seed) ? `✓ ${fileFor(seed)}` : `${seed}.jpg`}</span>}
      </figure>
    );
  }

  const id = (n: string) => `${uid}-${n}`;
  const hatchPattern = (name: string, angle: number, color: string, gap = 4.2, w = 0.75) => (
    <pattern id={id(name)} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={w} />
    </pattern>
  );

  return (
    <div
      className={`art ${className ?? ''}`}
      role="img"
      aria-label={label ? `${label} — original placeholder drawing, not official artwork` : 'Original placeholder drawing'}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id={id('dot')} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="2.5" cy="2.5" r="1.05" fill={INK} />
          </pattern>
          <pattern id={id('dotW')} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="2.5" cy="2.5" r="1.05" fill={PAPER} />
          </pattern>
          {hatchPattern('h1', 38, INK)}
          {hatchPattern('h2', -42, INK)}
          {hatchPattern('h3', 82, INK, 3.4, 0.6)}
          {hatchPattern('hW1', 32, PAPER)}
          {hatchPattern('hW2', -48, PAPER)}
          {hatchPattern('hW3', 86, PAPER, 3.4, 0.6)}
        </defs>
        <g filter="url(#ink-rough-soft)">{body}</g>
      </svg>
      {sfx && <span className={`sfx sfx--${sfxPos}`} aria-hidden="true">{sfx}</span>}
      {showCredit && <span className="art__credit">Fan drawing · placeholder</span>}
      {import.meta.env.DEV && seed && <span className="slot-label" aria-hidden="true">{fileFor(seed) ? `✓ ${fileFor(seed)}` : `${seed}.jpg`}</span>}
    </div>
  );
}
