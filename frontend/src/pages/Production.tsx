import { Link } from 'react-router-dom';
import { Page, PageHead, Reveal } from '@/components/Page';
import { FactList } from '@/components/Canon';
import { InkArt } from '@/art/InkArt';
import { archive } from '@/data/archive';

const LINKS = [
  { to: '/origins', label: 'Origins', note: 'A timeline of the serialization.' },
  { to: '/craft', label: 'How Berserk was drawn', note: 'Essay on process and technique.' },
  { to: '/panel-lab', label: 'Panel lab', note: 'Interactive composition analysis.' },
  { to: '/cinematography', label: 'Why this panel works', note: 'Twelve shot types.' },
  { to: '/music', label: 'Music', note: 'Composers and themes.' },
  { to: '/sources', label: 'Bibliography', note: 'Every source and its status.' },
];

export default function Production() {
  const creators = archive.creators();
  return (
    <Page chapter="15 · Production" folio={150}>
      <PageHead
        no="15"
        kicker="Production"
        title={
          <>
            The hands<em> behind the page</em>
          </>
        }
        lede="Creators, studios and the record of how the work was made and continued."
      />
      <div className="creators">
        {creators.map((c, i) => (
          <Reveal key={c.id} id={c.id} className={`creator ${i === 0 ? 'creator--lead' : ''}`} delay={i * 90}>
            <div className="creator__art panel panel--bleed panel--black">
              <InkArt variant={c.art} seed={c.id} label={c.name} />
            </div>
            <div>
              <span className="label">{c.epithet}</span>
              <h2 className="section-title">{c.name}</h2>
              <p className="book" style={{ fontSize: 17 }}>{c.summary}</p>
              <FactList facts={c.facts} />
            </div>
          </Reveal>
        ))}
      </div>
      <div className="prod-links">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="prod-link">
            <span className="prod-link__label">{l.label}</span>
            <span className="prod-link__note">{l.note}</span>
          </Link>
        ))}
      </div>
    </Page>
  );
}
