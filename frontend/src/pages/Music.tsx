import { Page, PageHead, Reveal } from '@/components/Page';
import { FactList, SourceMarks } from '@/components/Canon';
import { archive } from '@/data/archive';
import { musicMotifs } from '@/data/media';

export default function Music() {
  const tracks = archive.music();
  const byArtist = ['Susumu Hirasawa', 'Shiro Sagisu'];
  return (
    <>
      <Page chapter="14 · Music" folio={140}>
        <PageHead
          no="14"
          kicker="Music archive"
          title={
            <>
              Score<em> for a dark age</em>
            </>
          }
          lede="Metadata only. No audio is hosted here; listen through official releases. Track roles marked with a confidence below “high” await verification."
        />
        <div className="composers">
          {byArtist.map((a, i) => (
            <Reveal key={a} className="composer" delay={i * 100}>
              <span className="composer__no">{i === 0 ? 'I' : 'II'}</span>
              <h2 className="composer__name">{a}</h2>
              <ul className="plain-list">
                {tracks
                  .filter((t) => t.artist === a)
                  .map((t) => (
                    <li key={t.id}>
                      <em>{t.name}</em> — {t.work}
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Page>
      <Page chapter="14 · Discography" folio={141} tone="paper">
        <table className="register register--music">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Work</th>
              <th scope="col">Year</th>
              <th scope="col">Role</th>
              <th scope="col">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.id} id={t.id}>
                <td className="register__name">
                  {t.name}
                  <SourceMarks ids={t.sources} />
                </td>
                <td>{t.artist}</td>
                <td>{t.work}</td>
                <td>{t.year}</td>
                <td>{t.role}</td>
                <td>
                  <span className={`conf conf--${t.confidence}`}>{t.confidence}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="music-notes">
          <h2 className="section-title" style={{ marginBottom: 12 }}>Motifs & atmosphere</h2>
          <FactList facts={musicMotifs} />
          <p className="margin-note" style={{ marginTop: 18 }}>external links to official stores are added per-track in the CMS</p>
        </div>
      </Page>
    </>
  );
}
