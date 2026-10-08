import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Page, PageHead, Xref, XrefList } from '@/components/Page';
import { Ja } from '@/components/Manga';
import { FactLine, FactList } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { InkArt } from '@/art/InkArt';
import { archive } from '@/data/archive';

/** A giant horizontal chronology: each arc is a chapter divider followed by its pages. */
export default function Chronology() {
  const arcs = archive.arcs();
  const track = useRef<HTMLDivElement>(null);

  // Vertical wheel scrolls the track sideways on desktop, like turning pages.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (window.matchMedia('(max-width: 820px)').matches) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <Page chapter="02 · Chronology" folio={20} className="chrono-page">
      <PageHead
        no="02"
        kicker="Story chronology"
        title={
          <>
            Chronology<em> — a long march</em>
          </>
        }
        lede="Read left to right. Each arc opens with a chapter divider; its events, people, places and consequences follow as pages."
      />

      <div className="chrono-controls">
        <button type="button" className="bracket" onClick={() => nudge(-1)}><span>← Earlier</span></button>
        <nav className="chrono-jump" aria-label="Jump to arc">
          {arcs.map((a) => (
            <Link key={a.id} to={{ hash: a.id }} className="chrono-jump__link">
              <span className="chrono-jump__num">{a.numeral}</span>
              <Spoiler level={a.spoiler}>{a.name}</Spoiler>
            </Link>
          ))}
        </nav>
        <button type="button" className="bracket" onClick={() => nudge(1)}><span>Later →</span></button>
      </div>

      <div className="chrono" ref={track} tabIndex={0} aria-label="Chronology, scroll horizontally">
        {arcs.map((a, ai) => (
          <section key={a.id} id={a.id} className="chrono__arc" aria-label={`Arc ${a.numeral}`}>
            <div className="chrono__divider">
              <span className="chrono__numeral">{a.numeral}</span>
              <h2 className="chrono__name">
                <Spoiler level={a.spoiler}>
                  {a.name}
                  <Ja className="ja-sub">{a.ja}</Ja>
                </Spoiler>
              </h2>
              <span className="chrono__bar" aria-hidden="true" />
              <span className="label">{a.volumes}</span>
              <span className="annot chrono__ep">{a.epithet}</span>
            </div>

            <div className="chrono__page panel panel--paper">
              <span className="panel__caption">Beginning</span>
              <div className="chrono__art panel panel--bleed panel--black">
                <Spoiler level={a.spoiler} block>
                  <InkArt variant={a.art} seed={a.id} label={a.name} />
                </Spoiler>
              </div>
              <p className="book" style={{ fontSize: 16, marginTop: 12 }}>
                <Spoiler level={a.spoiler}>{a.summary}</Spoiler>
              </p>
              <FactLine f={a.beginning} />
            </div>

            <div className="chrono__page chrono__page--events panel panel--black">
              <span className="panel__caption">Major events</span>
              <ol className="chrono__events">
                {a.events.length ? (
                  a.events.map((e) => {
                    const ev = archive.get(e);
                    return (
                      <li key={e}>
                        <Spoiler level={ev?.spoiler}>
                          <Link to={`/events/${e}`} className="chrono__event">
                            <span className="chrono__event-name">{ev?.name}</span>
                            <span className="chrono__event-ep">{ev?.epithet}</span>
                          </Link>
                        </Spoiler>
                      </li>
                    );
                  })
                ) : (
                  <li className="muted">Ongoing — entries pending.</li>
                )}
              </ol>
              <dl className="chrono__meta">
                <dt>Battles</dt>
                <dd><Spoiler level={a.spoiler}>{a.battles.join(' · ') || '—'}</Spoiler></dd>
                <dt>Objects</dt>
                <dd><XrefList ids={a.objects} /></dd>
              </dl>
            </div>

            <div className="chrono__page panel panel--paper">
              <span className="panel__caption">Cast & places</span>
              <span className="label" style={{ display: 'block', marginTop: 12 }}>Characters</span>
              <p><XrefList ids={a.characters} /></p>
              <span className="label">Locations</span>
              <p><XrefList ids={a.locations} /></p>
              <span className="label">Consequences</span>
              <FactList facts={a.consequences} />
            </div>

            {ai < arcs.length - 1 && (
              <div className="chrono__gutter" aria-hidden="true">
                <div className="chrono__gutter-panel panel panel--bleed panel--black panel--slant">
                  <InkArt variant={arcs[ai + 1].art} seed={`g-${a.id}`} showCredit={false} sfx="auto" sfxPos="tl" />
                </div>
                <span className="chrono__line" />
              </div>
            )}
          </section>
        ))}
        <div className="chrono__end">
          <span className="annot">to be continued —</span>
          <Xref id="arc-current">Current era</Xref>
        </div>
      </div>
    </Page>
  );
}
