import { Link, useParams } from 'react-router-dom';
import { Page, Reveal, Xref, XrefList } from '@/components/Page';
import { FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { InkArt } from '@/art/InkArt';
import { archive, nameOf } from '@/data/archive';
import type { StoryEvent } from '@/data/types';
import NotFound from './NotFound';

/** Each event becomes a cinematic manga composition. */
const PANEL_SHAPES = ['ev-p--wide', 'ev-p--tall', 'ev-p--sq', 'ev-p--sq', 'ev-p--full'];

export default function EventView() {
  const { id } = useParams();
  const ev = archive.get(id ?? '') as StoryEvent | undefined;
  if (!ev || ev.kind !== 'event') return <NotFound />;
  const all = archive.events();
  const idx = all.indexOf(ev);
  const next = all[idx + 1];
  const location = archive.get(ev.location) ? <Xref id={ev.location} /> : ev.location;

  return (
    <>
      <section className="ev-hero" aria-label={ev.name}>
        <div className="ev-hero__art" aria-hidden="true">
          <Spoiler level={ev.spoiler} block>
            <InkArt variant={ev.art} seed={ev.id} showCredit={false} />
          </Spoiler>
        </div>
        <div className="ev-hero__text">
          <span className="label">Event · {nameOf(ev.arc)}</span>
          <h1 className="ev-hero__title">
            <Spoiler level={ev.spoiler} block>
              {ev.name}
            </Spoiler>
          </h1>
          <p className="ev-hero__ep annot">{ev.epithet}</p>
        </div>
      </section>

      <Page chapter={`Event dossier · No. ${String(idx + 1).padStart(2, '0')}`} folio={200 + idx} tone="paper">
        <div className="ev-dossier">
          <div>
            <span className="label">Event dossier</span>
            <dl className="spec">
              <dt>Date</dt>
              <dd>{ev.when}</dd>
              <dt>Arc</dt>
              <dd><Xref id={ev.arc} /></dd>
              <dt>Location</dt>
              <dd><Spoiler level={ev.spoiler}>{location}</Spoiler></dd>
              <dt>Volumes</dt>
              <dd>{ev.volumes}</dd>
              <dt>Participants</dt>
              <dd><XrefList ids={ev.participants} /></dd>
              <dt>Classification</dt>
              <dd><CanonTag c={ev.canon} /></dd>
            </dl>
          </div>
          <div>
            <p className="book book--lg dropcap">
              <Spoiler level={ev.spoiler}>
                {ev.summary}
                <SourceMarks ids={ev.sources} />
              </Spoiler>
            </p>
            <WikiLink e={ev} />
            <span className="label">Consequences</span>
            <FactList facts={ev.consequences} />
          </div>
        </div>
      </Page>

      <Page chapter={`Event sequence · No. ${String(idx + 1).padStart(2, '0')}`} folio={201 + idx}>
        <span className="label">Sequence — original abstract panels; not reproductions of the manga</span>
        <div className="ev-seq">
          {ev.sequence.map((p, i) => (
            <Reveal key={i} className={`ev-p ${PANEL_SHAPES[i % PANEL_SHAPES.length]} panel panel--bleed panel--black`} delay={i * 90}>
              <span className="panel__caption">{p.caption}</span>
              <Spoiler level={p.spoiler} block>
                <InkArt variant={p.art} seed={`${ev.id}-${i}`} showCredit={i === 0} label={p.text} sfx={i % 2 === 1 || i === ev.sequence.length - 1 ? 'auto' : undefined} sfxPos={PANEL_SHAPES[i % PANEL_SHAPES.length] === 'ev-p--tall' ? 'tr' : 'bl'} />
                <span className="ev-p__narration narration">{p.text}</span>
              </Spoiler>
            </Reveal>
          ))}
        </div>
        <nav className="pager" aria-label="Events">
          <Link to="/chronology" className="bracket"><span>← Chronology</span></Link>
          {next && (
            <Link to={`/events/${next.id}`} className="bracket">
              <span>Next event →</span>
            </Link>
          )}
        </nav>
      </Page>
    </>
  );
}
