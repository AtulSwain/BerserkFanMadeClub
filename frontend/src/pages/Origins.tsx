import { Page, PageHead, Reveal } from '@/components/Page';
import { FactLine } from '@/components/Canon';
import { InkArt } from '@/art/InkArt';
import { fact } from '@/data/helpers';
import { archive } from '@/data/archive';

const milestones = [
  { year: '1966', f: fact('Kentaro Miura is born in Chiba Prefecture.') },
  { year: '1988', f: fact('A Berserk prototype is published.') },
  { year: '1989', f: fact('Berserk begins serialization in Hakusensha’s Monthly Animal House.') },
  { year: '1992', f: fact('The magazine becomes Young Animal; Berserk continues there.') },
  { year: '1997', f: fact('First anime adaptation airs.', 'anime-adaptation', 0, ['src-anime-1997']) },
  { year: '2012', f: fact('The Golden Age Arc film trilogy begins.', 'anime-adaptation', 0, ['src-films']) },
  { year: '2016', f: fact('A new TV adaptation adapts the Conviction arc.', 'anime-adaptation', 0, ['src-anime-2016']) },
  { year: '2021', f: fact('Kentaro Miura dies on 6 May 2021, aged 54.') },
  { year: '2022', f: fact('Serialization resumes under Studio Gaga, supervised by Kouji Mori.', 'canon', 0, ['src-continuation']) },
];

export default function Origins() {
  const miura = archive.get('kentaro-miura');
  return (
    <>
      <Page chapter="01 · Origins" folio={10}>
        <PageHead
          no="01"
          kicker="Origins"
          title={
            <>
              Origins<em> of a long night</em>
            </>
          }
          lede={miura?.summary}
        />
        <div className="origins">
          <Reveal className="origins__portrait panel panel--bleed panel--black">
            <InkArt variant="hand" seed="origins-miura" label="A drawing hand" />
          </Reveal>
          <ol className="origins__line">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 50}>
                <span className="origins__year">{m.year}</span>
                <FactLine f={m.f} />
              </Reveal>
            ))}
          </ol>
        </div>
      </Page>
    </>
  );
}
