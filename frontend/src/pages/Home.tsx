import { Link } from 'react-router-dom';
import { InkArt } from '@/art/InkArt';
import { Page, Reveal, InkRule } from '@/components/Page';
import { CanonTag } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { useOpenArchive } from '@/context/OpenArchive';
import { Balloon, Hanko, Ja } from '@/components/Manga';
import { Atmosphere } from '@/fx/Atmosphere';
import { useParallax } from '@/fx/motion';
import { archive } from '@/data/archive';
import { assetFor } from '@/data/assets';
import logoUrl from '@/assets/brand/berserk-logo.png';
import type { ArtVariant } from '@/data/types';

/** The five chapters of the homepage, each opening onto a part of the archive. */
const CAST: { id: string; title: string }[] = [
  { id: 'guts', title: 'The Struggler' },
  { id: 'griffith', title: 'The White Hawk' },
  { id: 'casca', title: 'The Commander' },
  { id: 'skull-knight', title: 'The Knight of the Skull' },
  { id: 'puck', title: 'The Elf' },
];

const WORLD = [
  { to: '/atlas', label: 'Kingdoms & locations', ja: '地理', note: 'A hand-drawn atlas of the continent' },
  { to: '/factions', label: 'Factions', ja: '勢力', note: 'Hawks, knights, churches and crowns' },
  { to: '/apostles', label: 'Apostles', ja: '使徒', note: 'Those who gave up what they loved' },
  { to: '/weapons', label: 'Artifacts', ja: '武器', note: 'Dragon Slayer, Behelits, the Berserker Armor' },
  { to: '/lore', label: 'Lore codex', ja: '伝承', note: 'Causality, the astral world, the Brand' },
  { to: '/god-hand', label: 'The God Hand', ja: 'ゴッドハンド', note: 'Five positions in the dark' },
];

function Chapter({
  no,
  ja,
  kicker,
  title,
  children,
  art,
  seed,
  flip = false,
  sfx,
}: {
  no: string;
  ja: string;
  kicker: string;
  title: React.ReactNode;
  children: React.ReactNode;
  art: ArtVariant;
  seed: string;
  flip?: boolean;
  sfx?: string;
}) {
  const drift = useParallax<HTMLDivElement>(0.06);
  return (
    <section className={`home-chapter ${flip ? 'home-chapter--flip' : ''}`} aria-label={kicker}>
      <div className="home-chapter__text">
        <div className="home-chapter__mark">
          <span className="home-chapter__no">{no}</span>
          <Ja vertical className="home-chapter__ja">{ja}</Ja>
        </div>
        <span className="label">{kicker}</span>
        <h2 className="home-chapter__title">{title}</h2>
        {children}
      </div>
      <Reveal className="home-chapter__art reveal--shard">
        <div className="home-chapter__drift" ref={drift}>
          <InkArt variant={art} seed={seed} label={kicker} sfx={sfx} sfxPos="tr" />
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  const open = useOpenArchive();
  const heroDrift = useParallax<HTMLDivElement>(0.14);
  // A real cover picture (src/assets/panels/cover.*) is shown whole, without lettering over it.
  const coverArt = assetFor('cover');

  return (
    <>
      {/* ── Prologue ─────────────────────────────────────────── */}
      <section className="prologue" aria-label="Berserk: The Struggler’s Archive">
        <img className="prologue__logo" src={logoUrl} alt="" aria-hidden="true" decoding="async" />
        <Atmosphere density={80} embers={0.07} />

        <div className="prologue__text">
          <span className="label prologue__kicker">Unofficial fan archive · 1989 — present</span>
          <h1 className="prologue__title" aria-label="Berserk">
            <span className="prologue__title-ink">Berserk</span>
          </h1>
          <p className="prologue__sub">The Struggler’s Archive</p>
          <p className="prologue__line">In a world governed by fate, one man continues to struggle.</p>
          <div className="prologue__actions">
            <button type="button" className="bracket bracket--red" onClick={() => open('/archive')}>
              <span>Enter the archive</span>
            </button>
            <button type="button" className="bracket" onClick={() => open('/chronology')}>
              <span>Follow the story</span>
            </button>
          </div>
        </div>

        <div className={`prologue__hero ${coverArt ? 'prologue__hero--art' : ''}`}>
          <div className="prologue__hero-frame">
            <div className="prologue__hero-drift" ref={heroDrift}>
              <InkArt variant="swordsman" seed="cover" label="A swordsman seen from behind" sfx={coverArt ? undefined : 'auto'} sfxPos="tr" />
            </div>
            {!coverArt && <Balloon tail="right" className="cover__balloon">…</Balloon>}
          </div>
          <Hanko text="狂戦士" size={70} className="prologue__hanko" />
        </div>

        <p className="prologue__vertical" lang="ja" aria-hidden="true">ベルセルク</p>
        <span className="label prologue__scroll">Turn the page ↓</span>
      </section>

      {/* ── I. The Struggler ─────────────────────────────────── */}
      <Chapter no="I" ja="黒い剣士" kicker="Chapter I · The Struggler" title={<>The Struggler</>} art="sword" seed="home-struggler" sfx="ザンッ">
        <p className="book book--lg">
          A one-armed swordsman arrives at night carrying a sword “too big to be called a sword”. Monsters wear the faces of lords, and he
          hunts them one by one. The story opens in the middle of his war and only later tells you how it began.
        </p>
        <Link to="/characters/guts" className="bracket bracket--red"><span>Open Guts’ dossier</span></Link>
      </Chapter>

      {/* ── II. The Golden Age ───────────────────────────────── */}
      <Chapter no="II" ja="黄金時代" kicker="Chapter II · The Golden Age" title={<>The Golden Age</>} art="hawk" seed="home-golden-age" flip>
        <p className="book book--lg">
          Long before the hunt, a young mercenary joined a band of soldiers led by a man with a dream. The Band of the Hawk rose through
          a hundred years of war — and what happened to them is the wound at the centre of the whole story.
        </p>
        <p className="margin-note">spoiler-safe summary — the ending stays hidden until you choose</p>
        <Link to="/chronology#arc-golden-age" className="bracket"><span>Explore the arc</span></Link>
      </Chapter>

      {/* ── III. The Characters ──────────────────────────────── */}
      <section className="home-cast" aria-label="Chapter III · The Characters">
        <div className="home-cast__head">
          <span className="home-chapter__no">III</span>
          <div>
            <span className="label">Chapter III · The Characters <Ja>人物</Ja></span>
            <h2 className="home-chapter__title">The Characters</h2>
          </div>
          <Link to="/characters" className="bracket"><span>All dossiers</span></Link>
        </div>
        <ol className="home-cast__row">
          {CAST.map((c, i) => {
            const e = archive.get(c.id);
            if (!e) return null;
            return (
              <Reveal as="li" key={c.id} className="home-cast__item reveal--shard" delay={i * 90}>
                <Link to={`/characters/${c.id}`} className="home-cast__link">
                  <div className="home-cast__art panel panel--bleed panel--black">
                    <InkArt variant={e.art ?? 'figure'} seed={c.id} showCredit={false} label={e.name} />
                  </div>
                  <span className="home-cast__name">
                    <Spoiler level={e.spoiler}>{e.name}</Spoiler>
                  </span>
                  <span className="home-cast__title">{c.title}</span>
                  {e.ja && e.spoiler === 0 && <Ja vertical className="home-cast__ja">{e.ja}</Ja>}
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* ── IV. The World ────────────────────────────────────── */}
      <Chapter no="IV" ja="世界" kicker="Chapter IV · The World of Berserk" title={<>The World of Berserk</>} art="castle" seed="home-world">
        <p className="book">A continent of kingdoms at war, a church that burns heretics, and a second world of spirits pressed close behind it.</p>
        <ol className="home-world">
          {WORLD.map((w, i) => (
            <li key={w.to}>
              <Link to={w.to} className="home-world__link">
                <span className="home-world__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="home-world__label">
                  {w.label} <Ja className="home-world__ja">{w.ja}</Ja>
                </span>
                <span className="home-world__note">{w.note}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* ── V. The Legacy ────────────────────────────────────── */}
      <section className="home-legacy" aria-label="Chapter V · The Legacy">
        <Atmosphere density={30} embers={0.02} />
        <div className="home-legacy__inner">
          <span className="home-chapter__no">V</span>
          <span className="label">Chapter V · The Legacy <Ja>遺産</Ja></span>
          <h2 className="home-legacy__title">Kentaro Miura</h2>
          <p className="home-legacy__dates">1966 — 2021</p>
          <p className="book book--lg">A tribute to the man who drew it, the manga he left behind, and the adaptations it inspired.</p>
          <div className="legacy-links">
            <Link to="/legacy" className="bracket bracket--red"><span>Read the tribute</span></Link>
            <Link to="/anime" className="bracket"><span>Adaptations</span></Link>
            <Link to="/compare" className="bracket"><span>Manga vs anime</span></Link>
          </div>
          <Hanko text="感謝" size={56} className="home-legacy__seal" />
        </div>
      </section>

      {/* ── About this archive ───────────────────────────────── */}
      <Page chapter="About this archive" folio={3} tone="paper">
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
              This archive collects what is known about Kentaro Miura&rsquo;s <em>Berserk</em>: its people, its monsters, its rules, and how
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
                The drawings here are original fan illustrations made for this archive. Licensed or permitted artwork can replace any of
                them, always with credit.
              </p>
            </Reveal>
            <Reveal className="panel panel--thin preface__note" delay={120}>
              <span className="label">On spoilers</span>
              <p className="book" style={{ fontSize: 16 }}>
                The archive opens with <strong>no spoilers</strong>. Raise the level from the spoiler control at the top of any page, or
                reveal entries one by one.
              </p>
            </Reveal>
            <div className="signoff">
              <span className="hand">— the editors</span>
              <Ja>編集部</Ja>
              <Hanko text="蔵" size={52} />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
