/**
 * An original abstract manga page used for teaching composition.
 * Nothing here reproduces a Berserk page; it is a generic demonstration layout.
 */

export type LabMode = 'composition' | 'perspective' | 'light' | 'black' | 'motion' | 'character' | 'environment' | 'flow';

export const PANELS = [
  { id: 'p1', x: 30, y: 30, w: 540, h: 230 },
  { id: 'p2', x: 316, y: 274, w: 254, h: 300 },
  { id: 'p3', x: 30, y: 274, w: 272, h: 300 },
  { id: 'p4', x: 30, y: 588, w: 400, h: 262 },
  { id: 'p5', x: 444, y: 588, w: 126, h: 262 },
];

const INK = '#080808';
const PAPER = '#f1eee6';

function Panel({ id, x, y, w, h, children }: { id: string; x: number; y: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <g>
      <clipPath id={`clip-${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#clip-${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={PAPER} />
        {children}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={3} />
    </g>
  );
}

function hatch(x: number, y: number, w: number, h: number, step = 5, angle = 1) {
  const out = [];
  for (let i = -h; i < w; i += step) out.push(<line key={i} x1={x + i} y1={y + h} x2={x + i + h * angle} y2={y} stroke={INK} strokeWidth={0.7} />);
  return out;
}

export function DemoPage({ mode }: { mode: LabMode | null }) {
  const [p1, p2, p3, p4, p5] = PANELS;
  return (
    <svg viewBox="0 0 600 880" className="lab__page" role="img" aria-label="Abstract demonstration manga page with five panels">
      <rect width="600" height="880" fill={PAPER} />
      <g filter="url(#ink-rough-soft)">
        {/* P1 — establishing long shot: horizon, tower, road */}
        <Panel {...p1}>
          <rect x={30} y={30} width={540} height={110} fill={INK} opacity={0.08} />
          {hatch(30, 30, 540, 90, 7, 0.2)}
          <path d="M30 170 L570 160" stroke={INK} strokeWidth={1.5} />
          <path d="M240 260 L300 165 L330 165 L460 260 Z" fill={INK} opacity={0.15} />
          <path d="M200 260 L298 166 M500 260 L332 166" stroke={INK} strokeWidth={1.4} />
          <path d="M400 168 L404 70 L414 50 L424 70 L428 166 Z" fill={INK} />
          <circle cx={150} cy={80} r={22} fill="none" stroke={INK} strokeWidth={1.5} />
          <path d="M310 172 l-3 10 l6 0 Z" fill={INK} />
        </Panel>
        {/* P2 — medium shot: figure from behind */}
        <Panel {...p2}>
          {hatch(316, 274, 254, 300, 4)}
          <rect x={316} y={274} width={254} height={300} fill={PAPER} opacity={0.55} />
          <path d="M440 330 C424 330 418 346 420 360 C404 370 392 392 386 430 L376 574 L520 574 L504 430 C498 392 486 370 470 360 C472 346 466 330 440 330 Z" fill={INK} />
          <path d="M350 300 L366 292 L528 520 L516 530 Z" fill={INK} />
        </Panel>
        {/* P3 — close-up: an eye in shadow */}
        <Panel {...p3}>
          <rect x={30} y={274} width={272} height={300} fill={INK} />
          <path d="M60 430 C110 380 220 380 272 430 C220 470 110 470 60 430 Z" fill={PAPER} />
          <circle cx={166} cy={428} r={30} fill={INK} />
          <circle cx={176} cy={420} r={6} fill={PAPER} />
          <path d="M50 370 C120 340 220 340 286 372" stroke={PAPER} strokeWidth={3} fill="none" />
        </Panel>
        {/* P4 — impact: a lunging shape, diagonal speed lines */}
        <Panel {...p4}>
          {Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={30 + i * 12} y1={588} x2={-120 + i * 12} y2={850} stroke={INK} strokeWidth={i % 3 ? 0.8 : 2} />
          ))}
          <path d="M120 820 L180 700 L240 690 L300 620 L340 640 L330 700 L400 720 L300 760 L260 840 Z" fill={INK} />
          <circle cx={318} cy={650} r={5} fill="#7d1111" />
        </Panel>
        {/* P5 — silent panel */}
        <Panel {...p5}>
          <rect x={444} y={588} width={126} height={262} fill={INK} />
          <circle cx={507} cy={660} r={14} fill={PAPER} />
        </Panel>
      </g>

      {mode && <Overlay mode={mode} />}
    </svg>
  );
}

const RED = '#c0261f';
const BLUE = '#2f6fd6';
const YELLOW = '#e5b80b';
const WHITE = '#ffffff';

function Arrow({ d, color = RED, w = 3 }: { d: string; color?: string; w?: number }) {
  return <path d={d} stroke={color} strokeWidth={w} fill="none" markerEnd={`url(#ah-${color.slice(1)})`} strokeLinecap="round" />;
}

function Overlay({ mode }: { mode: LabMode }) {
  const defs = (
    <defs>
      {[RED, BLUE, YELLOW, WHITE].map((c) => (
        <marker key={c} id={`ah-${c.slice(1)}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill={c} />
        </marker>
      ))}
    </defs>
  );
  const focal = (x: number, y: number, r = 14) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={YELLOW} strokeWidth={3} />
      <circle cx={x} cy={y} r={3} fill={YELLOW} />
    </g>
  );

  let body: React.ReactNode = null;
  switch (mode) {
    case 'composition':
      body = (
        <g>
          {[210, 390].map((x) => <line key={x} x1={x} y1={30} x2={x} y2={260} stroke={WHITE} strokeWidth={1.5} strokeDasharray="6 4" />)}
          {[107, 183].map((y) => <line key={y} x1={30} y1={y} x2={570} y2={y} stroke={WHITE} strokeWidth={1.5} strokeDasharray="6 4" />)}
          <line x1={30} y1={850} x2={430} y2={588} stroke={WHITE} strokeWidth={2} />
          {focal(414, 70)}
          {focal(166, 428)}
          {focal(318, 650)}
          {focal(507, 660, 18)}
        </g>
      );
      break;
    case 'perspective':
      body = (
        <g>
          {[30, 120, 200, 460, 520, 570].map((x) => <line key={x} x1={x} y1={260} x2={315} y2={164} stroke={BLUE} strokeWidth={1.5} />)}
          <line x1={30} y1={168} x2={570} y2={160} stroke={BLUE} strokeWidth={2.5} />
          <circle cx={315} cy={164} r={6} fill={BLUE} />
          <text x={325} y={155} fill={BLUE} className="lab-text">VP</text>
          <line x1={360} y1={296} x2={540} y2={560} stroke={BLUE} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>
      );
      break;
    case 'light':
      body = (
        <g>
          <Arrow d="M110 58 L170 110" color={YELLOW} />
          <Arrow d="M130 46 L230 70" color={YELLOW} />
          <rect x={316} y={274} width={254} height={300} fill={YELLOW} opacity={0.12} />
          <Arrow d="M180 320 L176 405" color={YELLOW} />
          <text x={40} y={300} fill={YELLOW} className="lab-text">RIM LIGHT</text>
          <Arrow d="M507 620 L507 645" color={YELLOW} />
        </g>
      );
      break;
    case 'black':
      body = (
        <g>
          {[p3Rect(), p5Rect()].map((r, i) => (
            <rect key={i} {...r} fill="none" stroke={RED} strokeWidth={4} />
          ))}
          <path d="M440 330 C424 330 418 346 420 360 C404 370 392 392 386 430 L376 574 L520 574 L504 430 C498 392 486 370 470 360 C472 346 466 330 440 330 Z" fill="none" stroke={RED} strokeWidth={3} />
          <text x={40} y={300} fill={RED} className="lab-text">~80% BLACK</text>
          <text x={452} y={612} fill={RED} className="lab-text">~90%</text>
        </g>
      );
      break;
    case 'motion':
      body = (
        <g>
          <Arrow d="M400 610 L160 830" w={5} />
          <Arrow d="M350 300 L520 520" w={3} />
          <text x={250} y={610} fill={RED} className="lab-text">THRUST</text>
        </g>
      );
      break;
    case 'character':
      body = (
        <g>
          <path d="M440 330 C424 330 418 346 420 360 C404 370 392 392 386 430 L376 574 L520 574 L504 430 C498 392 486 370 470 360 C472 346 466 330 440 330 Z" fill="none" stroke={WHITE} strokeWidth={3} />
          <path d="M60 430 C110 380 220 380 272 430 C220 470 110 470 60 430 Z" fill="none" stroke={WHITE} strokeWidth={3} />
          <path d="M120 820 L180 700 L240 690 L300 620 L340 640 L330 700 L400 720 L300 760 L260 840 Z" fill="none" stroke={WHITE} strokeWidth={3} />
          <path d="M310 172 l-3 10 l6 0 Z" fill="none" stroke={WHITE} strokeWidth={2} />
          {focal(310, 176, 10)}
        </g>
      );
      break;
    case 'environment':
      body = (
        <g>
          <rect x={34} y={34} width={532} height={120} fill={BLUE} opacity={0.12} />
          <path d="M400 168 L404 70 L414 50 L424 70 L428 166 Z" fill="none" stroke={BLUE} strokeWidth={3} />
          <path d="M240 260 L300 165 L330 165 L460 260 Z" fill="none" stroke={BLUE} strokeWidth={2} />
          <text x={40} y={150} fill={BLUE} className="lab-text">SKY · TONE / HATCH</text>
        </g>
      );
      break;
    case 'flow':
      body = (
        <g>
          <Arrow d="M540 120 L80 120" />
          <Arrow d="M90 200 C300 240 520 250 540 300" />
          <Arrow d="M500 420 L120 420" />
          <Arrow d="M120 520 C300 560 520 570 510 640" />
          <Arrow d="M470 760 L360 760" />
          {[
            [550, 60],
            [550, 300],
            [270, 300],
            [550, 610],
            [400, 610],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={15} fill={RED} />
              <text x={x} y={y + 5} textAnchor="middle" fill={WHITE} className="lab-text">{i + 1}</text>
            </g>
          ))}
        </g>
      );
      break;
  }
  return (
    <g className="lab-overlay">
      {defs}
      {body}
    </g>
  );
}

function p3Rect() {
  const p = PANELS[2];
  return { x: p.x, y: p.y, width: p.w, height: p.h };
}
function p5Rect() {
  const p = PANELS[4];
  return { x: p.x, y: p.y, width: p.w, height: p.h };
}
