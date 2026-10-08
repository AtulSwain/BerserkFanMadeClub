import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, PageHead, Reveal } from '@/components/Page';
import { Spoiler } from '@/components/Spoiler';
import { InkArt } from '@/art/InkArt';
import { archive, nameOf } from '@/data/archive';

export default function Characters() {
  const all = archive.characters();
  const lead = all.slice(0, 6);
  const factions = Array.from(new Set(all.flatMap((c) => c.faction)));
  const [filter, setFilter] = useState<string | null>(null);
  const list = filter ? all.filter((c) => c.faction.includes(filter)) : all;

  return (
    <>
      <Page chapter="03 · Characters" folio={30}>
        <PageHead
          no="03"
          kicker="Character database"
          title={
            <>
              Dramatis<br />
              <em>personae</em>
            </>
          }
          lede={
            <>
              Character sheets, drawn as a manga&rsquo;s cast page. Point at a strip to bring its figure out of the ink; open it to read the full dossier.{' '}
              <Link to="/relationships" className="xref">Open the relationship map →</Link>
            </>
          }
        />

        <div className="cast" role="list">
          {lead.map((c, i) => (
            <Reveal key={c.id} role="listitem" className={`cast__strip cast__strip--${i}`} delay={i * 70}>
              <Link to={`/characters/${c.id}`} className="cast__link panel panel--bleed panel--black">
                <div className="cast__art">
                  <InkArt variant={c.art} seed={c.id} showCredit={false} label={c.name} />
                </div>
                <span className="cast__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="cast__name">
                  <Spoiler level={c.spoiler}>{c.name}</Spoiler>
                </span>
                <span className="cast__title annot">{c.title}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Page>

      <Page chapter="03 · Register" folio={31} tone="paper">
        <div className="register-head">
          <h2 className="section-title">Register of persons</h2>
          <div className="chips" role="group" aria-label="Filter by faction">
            <button type="button" className={`chip ${!filter ? 'is-active' : ''}`} onClick={() => setFilter(null)}>
              <span>All</span>
            </button>
            {factions.map((f) => (
              <button key={f} type="button" className={`chip ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
                <Spoiler level={archive.get(f)?.spoiler}>
                  <span>{nameOf(f)}</span>
                </Spoiler>
              </button>
            ))}
          </div>
        </div>
        <table className="register">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Name</th>
              <th scope="col">Title</th>
              <th scope="col">First appearance</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td className="register__no">{String(all.indexOf(c) + 1).padStart(3, '0')}</td>
                <td>
                  <Spoiler level={c.spoiler}>
                    <Link to={`/characters/${c.id}`} className="register__name">{c.name}</Link>
                  </Spoiler>
                </td>
                <td>
                  <Spoiler level={c.spoiler}>{c.title}</Spoiler>
                </td>
                <td>{c.firstAppearance}</td>
                <td>
                  <Spoiler level={Math.max(c.spoiler, c.status.spoiler ?? 0) as 0 | 1 | 2}>{c.status.text}</Spoiler>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    </>
  );
}
