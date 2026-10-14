import { Page, PageHead } from '@/components/Page';
import { CanonLegend } from '@/components/Canon';
import { Stamp } from '@/components/Manga';
import { archive } from '@/data/archive';

export default function Sources() {
  const sources = archive.sources();
  return (
    <Page chapter="Bibliography" folio={990} tone="paper">
      <PageHead
        no="¶"
        kicker="Source system"
        title={
          <>
            Bibliography
          </>
        }
        lede="Every factual entry points here. Sources marked “Needs verification” exist, but their exact page or issue reference has not yet been checked; entries citing them stay below “complete” until it is."
      />
      <ol className="biblio">
        {sources.map((s, i) => (
          <li key={s.id} id={s.id} className="biblio__item">
            <span className="biblio__n">[{i + 1}]</span>
            <div>
              <p className="biblio__title">
                {s.title}{' '}
                {s.status === 'Needs verification' ? <Stamp>Unverified</Stamp> : <Stamp tone="ink">Checked</Stamp>}
              </p>
              <dl className="biblio__meta">
                <dt>Type</dt>
                <dd>{s.type}</dd>
                <dt>Publication</dt>
                <dd>{s.publication}</dd>
                <dt>Date</dt>
                <dd>{s.date}</dd>
                <dt>Status</dt>
                <dd className={s.status === 'Needs verification' ? 'accent' : ''}>{s.status}</dd>
                <dt>Confidence</dt>
                <dd><span className={`conf conf--${s.confidence}`}>{s.confidence}</span></dd>
                {s.url && (
                  <>
                    <dt>URL</dt>
                    <dd>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="xref">{s.url}</a>
                    </dd>
                  </>
                )}
              </dl>
              {s.note && <p className="biblio__note">{s.note}</p>}
            </div>
          </li>
        ))}
      </ol>
      <h2 className="section-title" style={{ margin: '40px 0 14px' }}>Classification key</h2>
      <CanonLegend />
    </Page>
  );
}
