import { Link, useParams } from 'react-router-dom';
import { Page, PageHead, Reveal, XrefList } from '@/components/Page';
import { Ja } from '@/components/Manga';
import { FactLine, FactList, CanonTag, SourceMarks } from '@/components/Canon';
import { Spoiler, useIsHidden } from '@/components/Spoiler';
import { WikiLink } from '@/components/WikiLink';
import { Blueprint } from '@/art/Blueprint';
import { archive } from '@/data/archive';

export default function Weapons() {
  const { id } = useParams();
  const list = archive.weapons();
  const w = list.find((x) => x.id === id) ?? list[0];
  const idx = list.indexOf(w);
  const hidden = useIsHidden(w.spoiler);
  const code = `ARM-${String(idx + 1).padStart(2, '0')}`;

  return (
    <Page chapter="07 · Weapons" folio={70 + idx}>
      <PageHead
        no="07"
        kicker="Arsenal"
        title={
          <>
            Arsenal<em> — iron & will</em>
          </>
        }
        lede="Every piece is drawn as a technical plate. Dimensions are relative: the manga gives proportions, not measurements."
      />

      <div className="arsenal">
        <nav className="arsenal__index" aria-label="Weapons">
          {list.map((x, i) => (
            <Link key={x.id} to={`/weapons/${x.id}`} className={`arsenal__item ${x.id === w.id ? 'is-active' : ''}`} aria-current={x.id === w.id ? 'page' : undefined}>
              <span className="arsenal__code">ARM-{String(i + 1).padStart(2, '0')}</span>
              <span className="arsenal__name">
                <Spoiler level={x.spoiler}>{x.name}</Spoiler>
              </span>
            </Link>
          ))}
        </nav>

        <article className="plate-sheet" key={w.id}>
          <header className="plate-sheet__head">
            <div>
              <span className="label">Plate {code} · {w.epithet}</span>
              <h2 className="plate-sheet__name">
                <Spoiler level={w.spoiler}>
                  {w.name}
                  <Ja className="ja-sub">{w.ja}</Ja>
                </Spoiler>
              </h2>
            </div>
            <CanonTag c={w.canon} />
          </header>

          <Reveal className="blueprint">
            <div style={{ filter: hidden ? 'blur(10px)' : undefined }}>
              <Blueprint w={w} />
            </div>
            <span className="blueprint__stamp">{code}</span>
          </Reveal>

          <p className="book plate-sheet__sum">
            <Spoiler level={w.spoiler}>
              {w.summary}
              <SourceMarks ids={w.sources} />
            </Spoiler>
          </p>
          <WikiLink e={w} />

          <div className="plate-sheet__cols">
            <dl className="spec">
              <dt>Origin</dt>
              <dd><FactLine f={w.origin} /></dd>
              <dt>Owner</dt>
              <dd>{archive.get(w.owner) ? <XrefList ids={[w.owner]} /> : <Spoiler level={w.spoiler}>{w.owner}</Spoiler>}</dd>
              <dt>Material</dt>
              <dd><Spoiler level={w.spoiler}>{w.material}</Spoiler></dd>
              <dt>Size</dt>
              <dd><Spoiler level={w.spoiler}>{w.size}</Spoiler></dd>
              <dt>Function</dt>
              <dd><Spoiler level={w.spoiler}>{w.function}</Spoiler></dd>
            </dl>
            <dl className="spec">
              <dt>First appearance</dt>
              <dd>{w.firstAppearance}</dd>
              <dt>Known users</dt>
              <dd><XrefList ids={w.knownUsers} /></dd>
              <dt>Important battles</dt>
              <dd><XrefList ids={w.battles} /></dd>
              <dt>Evolution</dt>
              <dd><FactList facts={w.evolution} /></dd>
              <dt>Symbolism</dt>
              <dd><FactLine f={w.symbolism} /></dd>
            </dl>
          </div>
          <p className="plate-sheet__note"><span className="annot">see also →</span> <XrefList ids={w.related ?? []} /></p>
        </article>
      </div>
    </Page>
  );
}
