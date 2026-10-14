import type { Weapon } from '@/data/types';

/**
 * Technical drawings for the arsenal. Original schematic illustrations —
 * generic object forms with dimension lines, not copies of manga art.
 */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 } as const;
const thin = { ...S, strokeWidth: 0.7 } as const;

function Dim({ x1, y1, x2, y2, label, off = 18 }: { x1: number; y1: number; x2: number; y2: number; label: string; off?: number }) {
  const horizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  const ox = horizontal ? 0 : off;
  const oy = horizontal ? off : 0;
  return (
    <g className="bp-dim">
      <line x1={x1} y1={y1} x2={x1 + ox} y2={y1 + oy} {...thin} />
      <line x1={x2} y1={y2} x2={x2 + ox} y2={y2 + oy} {...thin} />
      <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} {...thin} markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
      <text x={(x1 + x2) / 2 + ox + (horizontal ? 0 : 8)} y={(y1 + y2) / 2 + oy + (horizontal ? -5 : 4)} textAnchor={horizontal ? 'middle' : 'start'} className="bp-text">
        {label}
      </text>
    </g>
  );
}

function Callout({ x, y, tx, ty, n, text }: { x: number; y: number; tx: number; ty: number; n: string; text: string }) {
  return (
    <g className="bp-callout">
      <circle cx={x} cy={y} r={3} fill="currentColor" />
      <line x1={x} y1={y} x2={tx} y2={ty} {...thin} />
      <circle cx={tx} cy={ty} r={9} {...thin} />
      <text x={tx} y={ty + 3.5} textAnchor="middle" className="bp-text bp-text--n">{n}</text>
      <text x={tx + (tx > x ? 14 : -14)} y={ty + 4} textAnchor={tx > x ? 'start' : 'end'} className="bp-text">{text}</text>
    </g>
  );
}

const drawings: Record<Weapon['diagram'], JSX.Element> = {
  greatsword: (
    <g>
      <path d="M80 200 L620 186 L680 200 L620 214 Z" {...S} strokeWidth={2} />
      <path d="M90 200 L640 200" {...thin} strokeDasharray="6 4" />
      <rect x={52} y={176} width={18} height={48} {...S} />
      <rect x={8} y={192} width={44} height={16} {...S} />
      <path d="M8 196 L52 196 M8 204 L52 204" {...thin} />
      <Dim x1={8} y1={232} x2={680} y2={232} label="Overall length — exceeds wielder's height" off={20} />
      <Callout x={330} y={192} tx={300} ty={110} n="1" text="Unrefined iron mass" />
      <Callout x={660} y={200} tx={640} ty={120} n="2" text="Blunt, broad tip" />
      <Callout x={30} y={200} tx={60} ty={300} n="3" text="Long two-hand grip" />
      {Array.from({ length: 18 }, (_, i) => <line key={i} x1={120 + i * 28} y1={188 + (i % 3)} x2={132 + i * 28} y2={196} {...thin} opacity={0.5} />)}
    </g>
  ),
  arm: (
    <g>
      <path d="M140 160 L420 150 L440 170 L440 230 L420 250 L140 240 Z" {...S} strokeWidth={2} />
      <circle cx={430} cy={200} r={18} {...S} />
      <circle cx={430} cy={200} r={8} {...thin} />
      <path d="M140 160 C100 170 100 230 140 240" {...S} />
      <path d="M440 176 L520 170 L540 180 L540 220 L520 230 L440 224" {...S} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M540 ${182 + i * 10} l26 ${-4 + i * 3}`} {...S} />)}
      <path d="M200 180 L380 176 M200 220 L380 224" {...thin} strokeDasharray="5 4" />
      <Dim x1={100} y1={270} x2={566} y2={270} label="Forearm length" />
      <Callout x={430} y={200} tx={470} ty={90} n="1" text="Cannon bore — single charge" />
      <Callout x={555} y={196} tx={620} ty={290} n="2" text="Magnetic hand grips the hilt" />
      <Callout x={140} y={200} tx={110} ty={110} n="3" text="Strap socket" />
    </g>
  ),
  crossbow: (
    <g>
      <path d="M140 200 L560 200" {...S} strokeWidth={2.5} />
      <path d="M520 200 C520 120 560 80 600 70 M520 200 C520 280 560 320 600 330" {...S} strokeWidth={2} />
      <line x1={600} y1={70} x2={600} y2={330} {...thin} />
      <rect x={300} y={160} width={120} height={30} {...S} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={310 + i * 18} y1={164} x2={310 + i * 18} y2={186} {...thin} />)}
      <circle cx={250} cy={230} r={18} {...S} />
      <path d="M250 230 L276 250" {...S} />
      <Dim x1={140} y1={360} x2={600} y2={360} label="Body length" />
      <Callout x={360} y={175} tx={330} ty={90} n="1" text="Bolt magazine" />
      <Callout x={250} y={230} tx={170} ty={300} n="2" text="Crank" />
      <Callout x={560} y={110} tx={680} ty={140} n="3" text="Prod" />
    </g>
  ),
  bomb: (
    <g>
      <circle cx={260} cy={210} r={70} {...S} strokeWidth={2} />
      <path d="M260 140 L260 110 C260 90 290 80 300 66" {...S} />
      <path d="M300 66 l6 -10 l4 12 l10 -4" {...S} />
      <path d="M200 180 A70 70 0 0 1 300 150" {...thin} />
      <path d="M470 150 L560 120 L580 140 L490 172 Z" {...S} strokeWidth={2} />
      <path d="M470 150 L430 160 L436 176 L490 172" {...S} />
      <Dim x1={190} y1={300} x2={330} y2={300} label="Fits the palm" />
      <Callout x={300} y={66} tx={380} ty={60} n="1" text="Fuse" />
      <Callout x={520} y={150} tx={560} ty={240} n="2" text="Throwing knife" />
    </g>
  ),
  armor: (
    <g>
      <path d="M350 40 C290 40 270 90 274 140 L256 126 L266 180 L300 200 L310 250 L390 250 L400 200 L434 180 L444 126 L426 140 C430 90 410 40 350 40 Z" {...S} strokeWidth={2} />
      <path d="M310 130 L340 140 L330 152 Z M390 130 L360 140 L370 152 Z" fill="currentColor" />
      <path d="M312 196 L324 222 L336 200 L350 230 L364 200 L376 222 L388 196" {...S} />
      <path d="M250 260 L450 260 L480 380 L220 380 Z" {...S} />
      <path d="M220 270 L160 300 L170 360 L220 350 M480 270 L540 300 L530 360 L480 350" {...S} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M240 ${290 + i * 18} L460 ${290 + i * 18}`} {...thin} />)}
      <Callout x={350} y={210} tx={520} ty={120} n="1" text="Helm closes into a beast's jaw" />
      <Callout x={170} y={330} tx={110} ty={220} n="2" text="Pauldron" />
      <Callout x={350} y={330} tx={560} ty={420} n="3" text="Full plate — overrides the body's limits" />
    </g>
  ),
  behelit: (
    <g>
      <path d="M350 80 C430 80 460 200 450 260 C440 320 400 350 350 350 C300 350 260 320 250 260 C240 200 270 80 350 80 Z" {...S} strokeWidth={2} />
      <path d="M300 200 Q318 190 332 206 M372 220 Q386 206 404 214 M318 270 Q352 298 386 266 M348 160 L354 248" {...S} />
      <path d="M520 120 C560 120 580 200 574 230 C568 260 548 280 520 280 C492 280 472 260 466 230 C460 200 480 120 520 120 Z" {...thin} />
      <path d="M490 220 Q520 190 550 220 M500 250 Q520 240 540 250" {...thin} />
      <text x={520} y={310} textAnchor="middle" className="bp-text">features rearranged</text>
      <Dim x1={246} y1={380} x2={454} y2={380} label="Palm-sized" />
      <Callout x={318} y={198} tx={160} ty={140} n="1" text="Displaced eye" />
      <Callout x={352} y={282} tx={180} ty={320} n="2" text="Mouth" />
    </g>
  ),
  swordbehelit: (
    <g>
      <path d="M120 200 L560 196 L600 200 L560 204 Z" {...S} strokeWidth={2} />
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={160 + i * 44} cy={200} rx={14} ry={9} {...thin} />)}
      <rect x={90} y={180} width={14} height={40} {...S} />
      <rect x={40} y={194} width={50} height={12} {...S} />
      <Callout x={204} y={200} tx={240} ty={110} n="1" text="Formed from swallowed Behelits" />
      <Callout x={590} y={200} tx={620} ty={290} n="2" text="Cuts dimensional space" />
    </g>
  ),
  cloak: (
    <g>
      <path d="M250 60 C320 60 340 80 350 100 C360 80 380 60 450 60 L500 380 L200 380 Z" {...S} strokeWidth={2} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${230 + i * 40} ${120 + (i % 2) * 20} q-10 120 -4 250`} {...thin} />)}
      <path d="M560 120 L600 340 M552 120 L568 120" {...S} strokeWidth={2} />
      <path d="M140 140 L180 320" {...S} strokeWidth={2} />
      <path d="M140 140 l-6 -20 l12 6 l2 -18 l8 14" {...S} />
      <Callout x={350} y={220} tx={640} ty={80} n="1" text="Sylph cloak — wind" />
      <Callout x={580} y={230} tx={660} ty={300} n="2" text="Sylph sword" />
      <Callout x={150} y={180} tx={80} ty={260} n="3" text="Salamander dagger — flame" />
    </g>
  ),
  staff: (
    <g>
      <line x1={350} y1={60} x2={350} y2={380} {...S} strokeWidth={3} />
      <circle cx={350} cy={60} r={18} {...S} />
    </g>
  ),
};

export function Blueprint({ w }: { w: Weapon }) {
  return (
    <svg viewBox="0 0 720 420" className="blueprint__svg" role="img" aria-label={`Technical drawing: ${w.name} (schematic, not to scale)`}>
      <defs>
        <marker id="bp-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
        <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0 L0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="720" height="420" fill="url(#bp-grid)" />
      <g filter="url(#ink-rough-soft)">{drawings[w.diagram]}</g>
      <text x={12} y={410} className="bp-text">SCHEMATIC · NOT TO SCALE · ORIGINAL DRAWING</text>
    </svg>
  );
}
