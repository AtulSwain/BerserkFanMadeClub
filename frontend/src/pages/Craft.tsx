import { Link } from 'react-router-dom';
import { Page, PageHead, Reveal, InkRule } from '@/components/Page';
import { FactLine } from '@/components/Canon';
import { archive } from '@/data/archive';

function HatchDemo() {
  return (
    <svg viewBox="0 0 300 120" className="craft-demo" role="img" aria-label="Comparison: cross-hatching versus dot screentone">
      <defs>
        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.4" fill="#080808" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="140" height="100" fill="#f1eee6" stroke="#080808" strokeWidth="2" />
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1={i * 6 - 40} y1={100} x2={i * 6 + 20} y2={0} stroke="#080808" strokeWidth="0.8" />)}
      {Array.from({ length: 30 }, (_, i) => <line key={`b${i}`} x1={i * 6 - 40} y1={0} x2={i * 6 + 20} y2={100} stroke="#080808" strokeWidth="0.6" />)}
      <rect x="160" y="0" width="140" height="100" fill="url(#dots)" stroke="#080808" strokeWidth="2" />
      <text x="70" y="116" textAnchor="middle" className="bp-text" fill="#080808">CROSS-HATCHING</text>
      <text x="230" y="116" textAnchor="middle" className="bp-text" fill="#080808">SCREENTONE</text>
    </svg>
  );
}

export default function Craft() {
  const topics = archive.craft();
  return (
    <>
      <Page chapter="12 · Manga craft" folio={120} tone="paper">
        <PageHead
          no="12"
          kicker="Manga craft"
          title={
            <>
              How Berserk<br />
              <em>was drawn</em>
            </>
          }
          lede={
            <>
              An essay in eleven parts. Statements attributed to Miura are stamped as creator interviews and must resolve to a specific
              source; everything else is editorial reading of the page. Continue to the{' '}
              <Link to="/panel-lab" className="xref">panel lab</Link> and the <Link to="/cinematography" className="xref">shot vocabulary</Link>.
            </>
          }
        />
        <div className="essay">
          {topics.map((t, i) => (
            <Reveal key={t.id} as="section" id={t.id} className="essay__part" delay={40}>
              <div className="essay__num">{t.numeral}</div>
              <div className="essay__body">
                <h2 className="essay__h">{t.name}</h2>
                <p className="essay__dek">{t.summary}</p>
                {t.body.map((f, j) => (
                  <FactLine key={j} f={f} />
                ))}
                {t.id === 'craft-ink' && <HatchDemo />}
              </div>
              <aside className="essay__margin">{t.margin && <span className="margin-note">{t.margin}</span>}</aside>
              {i < topics.length - 1 && <InkRule className="essay__rule" />}
            </Reveal>
          ))}
        </div>
      </Page>
    </>
  );
}
