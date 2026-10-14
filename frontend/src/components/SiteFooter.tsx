import { Link } from 'react-router-dom';
import { Hanko } from './Manga';

const OFFICIAL = [
  { label: 'Berserk official portal', href: 'https://berserk-project.jp/' },
  { label: 'Official anime site', href: 'https://www.berserk-anime.com/' },
  { label: 'Memorial Edition site', href: 'https://berserk-me.com/' },
  { label: 'Dark Horse — English editions', href: 'https://www.darkhorse.com/' },
  { label: 'Hakusensha — Japanese publisher', href: 'https://www.hakusensha.co.jp/' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__mark">
          <Hanko text="蔵" size={46} />
          <p className="site-footer__name">
            Berserk
            <span>The Struggler’s Archive</span>
          </p>
        </div>
        <div>
          <h2 className="site-footer__h">Unofficial fan site</h2>
          <p className="site-footer__text">
            Made by fans, for readers. Not affiliated with, endorsed or sponsored by Kentaro Miura’s estate, Studio Gaga, Hakusensha,
            Young Animal, Dark Horse or any anime licensor. <em>Berserk</em> and all of its characters, artwork and logos belong to their
            owners. No manga chapters or scans are hosted here.
          </p>
          <p className="site-footer__text">
            Created by <strong>Kentaro Miura</strong> (1966–2021). Continued by <strong>Studio Gaga</strong> under the supervision of{' '}
            <strong>Kouji Mori</strong>. <Link to="/legacy" className="xref">Read the tribute →</Link>
          </p>
        </div>
        <div>
          <h2 className="site-footer__h">Read and watch it legally</h2>
          <ul className="site-footer__links">
            {OFFICIAL.map((o) => (
              <li key={o.href}>
                <a href={o.href} target="_blank" rel="noopener noreferrer">
                  {o.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="site-footer__h">This archive</h2>
          <ul className="site-footer__links">
            <li><Link to="/archive">Index</Link></li>
            <li><Link to="/sources">Bibliography & sources</Link></li>
            <li><Link to="/glossary">Glossary</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
