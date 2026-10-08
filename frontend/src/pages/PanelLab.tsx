import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, PageHead } from '@/components/Page';
import { CanonTag } from '@/components/Canon';
import { DemoPage, type LabMode } from '@/art/DemoPage';

const MODES: { id: LabMode; label: string; key: string; color: string; text: string[] }[] = [
  {
    id: 'composition',
    label: 'Composition',
    key: 'Yellow marks — focal points. White lines — thirds and the dominant diagonal.',
    color: '#e5b80b',
    text: [
      'Each panel has one focal point; they alternate sides so the eye zig-zags down the page.',
      'The establishing panel places its tower on a third line rather than the centre, leaving sky as negative space.',
      'The bottom tier breaks the grid with a diagonal: the strongest action gets the least stable shape.',
    ],
  },
  {
    id: 'perspective',
    label: 'Perspective',
    key: 'Blue lines — perspective guides to a single vanishing point.',
    color: '#2f6fd6',
    text: [
      'One-point perspective in the long shot pulls the road toward a tiny figure, making the world enormous and the person small.',
      'A low horizon in the first panel and a high camera in the second keep the reader physically oriented.',
    ],
  },
  {
    id: 'light',
    label: 'Light',
    key: 'Yellow arrows — light direction.',
    color: '#e5b80b',
    text: [
      'Light arrives from the upper left throughout the sequence, so cuts between panels never feel disorienting.',
      'In the close-up, a rim of light carves the eye out of a solid black panel — light used as a scalpel, not a lamp.',
    ],
  },
  {
    id: 'black',
    label: 'Black mass',
    key: 'Red outlines — areas of solid black ink.',
    color: '#c0261f',
    text: [
      'Large solid blacks weigh the page down; distributing them diagonally (top-right figure, middle-left close-up, bottom-right silent panel) balances it.',
      'A near-total black panel signals silence and dread before a single word is read.',
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    key: 'Red arrows — implied motion vectors.',
    color: '#c0261f',
    text: [
      'Speed lines run parallel to the action’s direction; their density sets the speed.',
      'The lunge travels from upper right to lower left — with the Japanese reading direction — so motion and reading reinforce each other.',
    ],
  },
  {
    id: 'character',
    label: 'Character',
    key: 'White outlines — character silhouettes.',
    color: '#ffffff',
    text: [
      'Every figure reads instantly as a silhouette. If a shape is clear in solid black, it is clear in any lighting.',
      'The tiny figure in the long shot is the same character as the medium shot; scale tells the story of isolation.',
    ],
  },
  {
    id: 'environment',
    label: 'Environment',
    key: 'Blue — environment and atmosphere.',
    color: '#2f6fd6',
    text: [
      'Sky rendered by hatching rather than screentone keeps the texture consistent with the figures.',
      'Architecture is introduced once, early, so later panels can omit it without losing place.',
    ],
  },
  {
    id: 'flow',
    label: 'Reading flow',
    key: 'Red arrows & numbers — reading order (right to left, top to bottom).',
    color: '#c0261f',
    text: [
      'Manga reads right to left. Panel 2 sits on the right of the middle tier so it is read before panel 3.',
      'The silent panel (4) is read before the impact (5): a held breath before the blow.',
    ],
  },
];

export default function PanelLab() {
  const [mode, setMode] = useState<LabMode | null>('flow');
  const cur = MODES.find((m) => m.id === mode);

  return (
    <Page chapter="12 · Panel analysis" folio={126}>
      <PageHead
        no="12·b"
        kicker="Interactive panel analysis"
        title={
          <>
            Why the<br />
            <em>eye moves</em>
          </>
        }
        lede={
          <>
            An original abstract page, not a Berserk page, used to teach how manga composition works. Choose a lens to overlay the
            analysis. <Link to="/cinematography" className="xref">Shot types →</Link>
          </>
        }
      />
      <div className="lab">
        <div className="lab__left">
          <div className="lab__frame">
            <DemoPage mode={mode} />
          </div>
          <span className="art__credit" style={{ position: 'static', display: 'inline-block', marginTop: 8 }}>
            Original demonstration page · not official artwork
          </span>
        </div>
        <div className="lab__right">
          <div className="lab__controls" role="group" aria-label="Analysis lens">
            {MODES.map((m) => (
              <button key={m.id} type="button" className="bracket" aria-pressed={mode === m.id} onClick={() => setMode(mode === m.id ? null : m.id)}>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          {cur ? (
            <div className="lab__analysis" aria-live="polite">
              <span className="label">Analysis · {cur.label}</span>
              <p className="lab__key">
                <span className="lab__swatch" style={{ background: cur.color }} />
                {cur.key}
              </p>
              {cur.text.map((t, i) => (
                <p key={i} className="book">
                  <span className="accent">{String(i + 1).padStart(2, '0')}</span> {t}
                </p>
              ))}
              <CanonTag c="inference" />
              <span className="margin-note" style={{ display: 'block', marginTop: 16 }}>
                general manga technique — not a claim about Miura&rsquo;s process
              </span>
            </div>
          ) : (
            <p className="annot">choose a lens ↑</p>
          )}
        </div>
      </div>
    </Page>
  );
}
