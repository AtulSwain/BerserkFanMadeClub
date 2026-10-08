import { Page, PageHead, Reveal } from '@/components/Page';
import { CanonTag } from '@/components/Canon';

const I = '#080808';
const P = '#f1eee6';

/** Original demonstration graphics for each shot type. */
const SHOTS: { name: string; note: string; draw: JSX.Element; span?: 'wide' | 'tall' | 'full' }[] = [
  {
    name: 'Long shot',
    note: 'Places a small figure in a large world. Establishes geography and isolation.',
    span: 'wide',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <path d="M0 140 Q80 120 150 135 T300 128 L300 200 L0 200 Z" fill={I} opacity="0.85" />
        <path d="M148 128 l-3 10 l6 0 Z" fill={I} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={20 + i * 8} x2={300} y2={18 + i * 8} stroke={I} strokeWidth="0.5" opacity="0.5" />)}
      </>
    ),
  },
  {
    name: 'Medium shot',
    note: 'Waist up. Body language and gesture carry the scene.',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <ellipse cx="150" cy="70" rx="24" ry="28" fill={I} />
        <path d="M80 200 C90 120 120 100 150 100 C180 100 210 120 220 200 Z" fill={I} />
      </>
    ),
  },
  {
    name: 'Close-up',
    note: 'A face fills the panel. Emotion becomes the subject.',
    draw: (
      <>
        <rect width="300" height="200" fill={I} />
        <ellipse cx="150" cy="110" rx="90" ry="110" fill={P} />
        <path d="M100 100 Q118 90 136 100 M164 100 Q182 90 200 100" stroke={I} strokeWidth="5" fill="none" />
        <path d="M128 160 Q150 168 172 160" stroke={I} strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    name: 'Extreme close-up',
    note: 'Only an eye, a hand, a blade-edge. Time slows; detail becomes symbol.',
    draw: (
      <>
        <rect width="300" height="200" fill={I} />
        <path d="M20 100 C90 30 210 30 280 100 C210 160 90 160 20 100 Z" fill={P} />
        <circle cx="150" cy="98" r="44" fill={I} />
        <circle cx="166" cy="84" r="10" fill={P} />
      </>
    ),
  },
  {
    name: 'Overhead',
    note: 'Looking straight down. Makes figures into pieces on a board.',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={20 + (i % 10) * 28} cy={40 + Math.floor(i / 10) * 50} r={7} fill={I} />)}
        <circle cx="150" cy="100" r="11" fill="#7d1111" />
      </>
    ),
  },
  {
    name: 'Low angle',
    note: 'Camera below the subject. Makes it tower, threaten, or inspire.',
    span: 'tall',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        {Array.from({ length: 20 }, (_, i) => <line key={i} x1={150} y1={-40} x2={i * 16} y2={200} stroke={I} strokeWidth="0.6" />)}
        <path d="M110 200 L130 40 L150 10 L170 40 L190 200 Z" fill={I} />
      </>
    ),
  },
  {
    name: 'Splash page',
    note: 'One image fills the page. Spent rarely, it stops the reader cold.',
    span: 'tall',
    draw: (
      <>
        <rect width="300" height="200" fill={I} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return <line key={i} x1={150 + Math.cos(a) * 30} y1={100 + Math.sin(a) * 30} x2={150 + Math.cos(a) * 300} y2={100 + Math.sin(a) * 300} stroke={P} strokeWidth={i % 2 ? 0.5 : 2} />;
        })}
        <circle cx="150" cy="100" r="28" fill={P} />
      </>
    ),
  },
  {
    name: 'Silent panel',
    note: 'No words. A beat of time — breath, dread, grief.',
    draw: (
      <>
        <rect width="300" height="200" fill={I} />
        <circle cx="230" cy="60" r="10" fill={P} />
      </>
    ),
  },
  {
    name: 'Negative space',
    note: 'Emptiness around a subject makes it lonely or monumental.',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <path d="M60 170 l-4 16 l8 0 Z" fill={I} />
      </>
    ),
  },
  {
    name: 'Diagonal composition',
    note: 'Tilted lines create instability and momentum.',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <path d="M-10 210 L250 -10 L300 20 L40 230 Z" fill={I} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 24} y1={200} x2={i * 24 + 120} y2={0} stroke={I} strokeWidth="0.6" />)}
      </>
    ),
  },
  {
    name: 'Double-page spread',
    note: 'An image across the gutter. The book itself becomes the frame.',
    span: 'full',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <path d="M0 150 Q75 110 150 140 T300 120 L300 200 L0 200 Z" fill={I} />
        <circle cx="210" cy="60" r="26" fill={I} />
        <line x1="150" y1="0" x2="150" y2="200" stroke="#7d1111" strokeWidth="1" strokeDasharray="4 4" />
      </>
    ),
  },
  {
    name: 'Impact panel',
    note: 'Broken borders, radiating lines, a single hit frozen.',
    draw: (
      <>
        <rect width="300" height="200" fill={P} />
        <path d="M150 20 L170 80 L240 60 L190 110 L260 160 L180 140 L150 200 L130 140 L40 170 L110 110 L50 50 L130 80 Z" fill={I} />
        <circle cx="150" cy="110" r="14" fill={P} />
      </>
    ),
  },
];

export default function Cinematography() {
  return (
    <Page chapter="12 · Cinematography" folio={127} tone="paper">
      <PageHead
        no="12·c"
        kicker="Why this panel works"
        title={
          <>
            Manga<br />
            <em>cinematography</em>
          </>
        }
        lede="Twelve camera decisions every manga artist makes. Each demonstration is an original drawing; none reproduces a Berserk panel."
      />
      <div className="shots">
        {SHOTS.map((s, i) => (
          <Reveal key={s.name} className={`shot ${s.span ? `shot--${s.span}` : ''}`} delay={(i % 3) * 70}>
            <div className="shot__panel panel panel--bleed panel--black">
              <span className="panel__caption">{String(i + 1).padStart(2, '0')}</span>
              <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
                <g filter="url(#ink-rough-soft)">{s.draw}</g>
              </svg>
            </div>
            <h2 className="shot__name">{s.name}</h2>
            <p className="shot__note">{s.note}</p>
          </Reveal>
        ))}
      </div>
      <p style={{ marginTop: 30 }}>
        <CanonTag c="inference" /> <span className="muted">General visual-storytelling vocabulary, offered as editorial commentary.</span>
      </p>
    </Page>
  );
}
