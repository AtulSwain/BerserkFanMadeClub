import { Link } from 'react-router-dom';
import { Page, Reveal } from '@/components/Page';
import { FactLine } from '@/components/Canon';
import { Hanko, Ja } from '@/components/Manga';
import { InkArt } from '@/art/InkArt';
import { Atmosphere } from '@/fx/Atmosphere';
import { fact } from '@/data/helpers';

const WORKS = [
  { year: '1989 —', title: 'Berserk', note: 'Serialized in Monthly Animal House, then Young Animal. His life’s work.' },
  { year: '2013 — 2014', title: 'Gigantomakhia', note: 'A short, self-contained fantasy of giants, drawn between Berserk chapters.' },
  { year: '2019 —', title: 'Duranki', note: 'A mythological series produced with his assistants at Studio Gaga.' },
];

const TIMELINE = [
  { year: '1966', f: fact('Kentaro Miura is born in Chiba Prefecture, Japan.') },
  { year: '1988', f: fact('A Berserk prototype is published.') },
  { year: '1989', f: fact('Serialization of Berserk begins.') },
  { year: '1997', f: fact('The first anime adaptation airs.', 'anime-adaptation', 0, ['src-anime-1997']) },
  { year: '2012', f: fact('The Golden Age Arc film trilogy begins.', 'anime-adaptation', 0, ['src-films']) },
  { year: '2021', f: fact('Kentaro Miura dies on 6 May 2021, aged 54.') },
  { year: '2022', f: fact('The story continues under Studio Gaga, supervised by his friend Kouji Mori.', 'canon', 0, ['src-continuation']) },
];

export default function Legacy() {
  return (
    <>
      <section className="legacy-hero" aria-label="In memory of Kentaro Miura">
        <Atmosphere density={45} embers={0.03} />
        <div className="legacy-hero__inner">
          <span className="label">The Legacy · <Ja>遺産</Ja></span>
          <h1 className="legacy-hero__title">
            Kentaro Miura
            <span className="legacy-hero__dates">1966 — 2021</span>
          </h1>
          <p className="legacy-hero__line">
            For more than thirty years he drew a world without mercy, and a man who refused to kneel to it.
          </p>
          <Hanko text="感謝" size={70} className="legacy-hero__seal" />
        </div>
      </section>

      <Page chapter="Legacy · The work" folio={170} tone="paper">
        <div className="legacy-essay">
          <div className="legacy-essay__portrait panel panel--bleed panel--black">
            <InkArt variant="hand" seed="legacy-miura" label="A drawing hand" />
          </div>
          <div className="legacy-essay__body">
            <span className="label">An editorial tribute</span>
            <h2 className="section-title">The hand behind the iron</h2>
            <p className="book book--lg dropcap">
              Few manga were drawn with the patience of <em>Berserk</em>. Pages of armour rendered plate by plate, crowds where every
              face is distinct, castles with stones you could count. That density was never ornament. It made the world heavy enough
              that a single man standing against it meant something.
            </p>
            <p className="book">
              The series moved readers between extremes — the fellowship of the Band of the Hawk and the horror that followed — and
              asked, again and again, whether a person can struggle against fate. Its influence runs through decades of dark fantasy in
              manga, games and film.
            </p>
            <p className="margin-note">editorial reading — see the craft chapter for how the pages were made</p>
            <div className="legacy-links">
              <Link to="/craft" className="bracket"><span>How Berserk was drawn</span></Link>
              <Link to="/origins" className="bracket"><span>Serialization timeline</span></Link>
            </div>
          </div>
        </div>
      </Page>

      <Page chapter="Legacy · Works & continuation" folio={171}>
        <div className="legacy-cols">
          <section>
            <h2 className="section-title">Works</h2>
            <ul className="legacy-works">
              {WORKS.map((w, i) => (
                <Reveal as="li" key={w.title} delay={i * 80}>
                  <span className="legacy-works__year">{w.year}</span>
                  <span className="legacy-works__title">{w.title}</span>
                  <span className="legacy-works__note">{w.note}</span>
                </Reveal>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="section-title">A life in the margin</h2>
            <ol className="origins__line">
              {TIMELINE.map((m, i) => (
                <Reveal as="li" key={m.year} delay={i * 50}>
                  <span className="origins__year">{m.year}</span>
                  <FactLine f={m.f} />
                </Reveal>
              ))}
            </ol>
          </section>
        </div>
        <div className="legacy-support">
          <h2 className="section-title">Honour the work</h2>
          <p className="book">
            The best tribute is to read it as he published it. Buy the official volumes — the Dark Horse deluxe hardcovers in English,
            or Hakusensha’s tankōbon in Japanese — and watch the licensed adaptations.
          </p>
          <div className="legacy-links">
            <a className="bracket bracket--red" href="https://www.darkhorse.com/" target="_blank" rel="noopener noreferrer"><span>Dark Horse ↗</span></a>
            <a className="bracket" href="https://berserk-project.jp/" target="_blank" rel="noopener noreferrer"><span>Official portal ↗</span></a>
            <Link className="bracket" to="/anime"><span>Adaptations</span></Link>
          </div>
        </div>
      </Page>
    </>
  );
}
