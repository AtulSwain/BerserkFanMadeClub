import { Link } from 'react-router-dom';
import { InkArt } from '@/art/InkArt';
import { Page, Reveal, InkRule } from '@/components/Page';
import { CanonTag } from '@/components/Canon';
import { useOpenArchive } from '@/context/OpenArchive';
import { Balloon, Hanko, Ja } from '@/components/Manga';
import { INDEX } from '@/lib/sections';

export default function Home() {
  const open = useOpenArchive();

  return (
    <>
      <section className="cover" aria-label="Cover">
        <aside className="cover__colophon">
          <div className="cover__colophon-top">
            <span className="label">Berserk</span>
            <span className="label">The Manga Archive</span>
            <span className="cover__years">1989 — present</span>
          </div>
          <p className="cover__vertical" lang="ja" aria-hidden="true">ベルセルク · 剣風伝奇</p>
          <div className="cover__colophon-bottom">
            <span className="label">Vol. ∞ · Fan edition</span>
            <span className="label">Unofficial · non-commercial</span>
            <Hanko text="蔵" size={44} className="cover__seal" />
          </div>
        </aside>

        <div className="cover__page">
          <div className="cover__panel cover__panel--hero panel panel--bleed panel--black">
            <InkArt variant="swordsman" seed="cover" label="A swordsman seen from behind" sfx="auto" sfxPos="tr" />
            <Balloon tail="right" className="cover__balloon">…</Balloon>
          </div>

          <div className="cover__panel cover__panel--title panel panel--paper">
            <span className="panel__caption">Ep. 000</span>
            <h1 className="cover__title" aria-label="Berserk">
              <span className="cover__title-ink">Berserk</span>
            </h1>
            <p className="cover__subtitle">
              The world
              <br />
              <em>of the Black Swordsman</em>
            </p>
            <Hanko text="狂戦士" size={74} className="cover__hanko" />
            <span className="annot cover__annot">a fan archive —<br />not an official publication</span>
          </div>

          <div className="cover__panel cover__panel--a panel panel--bleed panel--black">
            <InkArt variant="eclipse" seed="cover-a" showCredit={false} label="An eclipsed sun" sfx="auto" sfxPos="bl" />
          </div>
          <div className="cover__panel cover__panel--b panel panel--bleed panel--black">
            <InkArt variant="hawk" seed="cover-b" showCredit={false} label="A hawk with spread wings" />
          </div>

          <div className="cover__panel cover__panel--actions panel panel--black">
            <div className="cover__actions">
              <button type="button" className="bracket bracket--red" onClick={() => open('/archive')}>
                <span>Open the archive</span>
              </button>
              <button type="button" className="bracket" onClick={() => open('/chronology')}>
                <span>Explore chronology</span>
              </button>
            </div>
            <span className="label cover__scroll">Turn the page ↓</span>
          </div>
        </div>
      </section>

      <Page chapter="Preface" folio={3} tone="paper">
        <div className="preface">
          <div className="preface__col">
            <span className="label">Editor&rsquo;s preface</span>
            <h2 className="section-title preface__title">
              A forbidden archive,
              <br />
              <em>kept by readers.</em>
            </h2>
            <InkRule />
            <p className="book book--lg dropcap">
              This volume collects what is known about Kentaro Miura&rsquo;s <em>Berserk</em>: its people, its monsters, its rules, and how
              its pages were made. It is arranged like the book it describes — chapters, panels, gutters and marginalia — and it is kept
              honest by a single rule.
            </p>
            <p className="book">
              <strong>Nothing confirmed is ever mixed with speculation.</strong> Every claim carries a classification stamp and, where
              possible, a source. What the manga shows is marked <CanonTag c="canon" />; what readers suspect is marked{' '}
              <CanonTag c="fan-theory" />.
            </p>
          </div>
          <div className="preface__col preface__col--side">
            <Reveal className="panel panel--thin preface__note taped">
              <span className="label">On the artwork</span>
              <p className="book" style={{ fontSize: 16 }}>
                No Berserk panels or official illustrations are reproduced here. Every image is an original abstract ink placeholder,
                labelled as such, built to be replaced by licensed or user-provided art.
              </p>
            </Reveal>
            <Reveal className="panel panel--thin preface__note" delay={120}>
              <span className="label">On spoilers</span>
              <p className="book" style={{ fontSize: 16 }}>
                The archive opens with <strong>no spoilers</strong>. Raise the level from the spoiler control at the top of any page, or
                reveal entries one by one.
              </p>
            </Reveal>
            <span className="margin-note">Read the index first.<br />Then follow the threads.</span>
            <div className="signoff">
              <span className="hand">— the editors</span>
              <Ja>編集部</Ja>
              <Hanko text="蔵" size={52} />
            </div>
          </div>
        </div>
      </Page>

      <Page chapter="Contents" folio={4}>
        <div className="home-contents">
          <h2 className="chapter-title">
            Contents<em>, abridged</em>
          </h2>
          <ol className="home-contents__list">
            {INDEX.slice(0, 8).map((s, i) => (
              <Reveal as="li" key={s.no} delay={i * 50}>
                <Link to={s.to} className="home-contents__item">
                  <span className="home-contents__no">{s.no}</span>
                  <span className="home-contents__name">{s.title} <Ja className="home-contents__ja">{s.ja}</Ja></span>
                  <span className="home-contents__blurb">{s.blurb}</span>
                  <span className="home-contents__pg">p. {s.page}</span>
                </Link>
              </Reveal>
            ))}
          </ol>
          <Link to="/archive" className="bracket">
            <span>Full index — sixteen chapters</span>
          </Link>
        </div>
      </Page>
    </>
  );
}
