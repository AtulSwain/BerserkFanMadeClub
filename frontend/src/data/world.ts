import type { LocationEntry, SimpleEntry } from './types';
import { s0, s1, s2 } from './helpers';

export const locations: LocationEntry[] = [
  { id: 'midland', kind: 'location', name: 'Midland', epithet: 'Kingdom', region: 'Central continent', summary: 'The kingdom whose war with Chuder frames the Golden Age.', canon: 'canon', spoiler: 0, map: { x: 430, y: 390 }, symbol: 'city', facts: [s0('Fought the Hundred-Year War against Chuder.'), s2('Later overrun by the Kushan.')], sources: ['src-manga'] },
  { id: 'windham', kind: 'location', name: 'Windham', epithet: 'Royal capital', region: 'Midland', summary: 'Capital of Midland and seat of its king.', canon: 'canon', spoiler: 0, map: { x: 530, y: 310 }, symbol: 'castle', facts: [s0('Site of the royal palace.')], sources: ['src-manga'] },
  { id: 'doldrey', kind: 'location', name: 'Doldrey', epithet: 'Fortress', region: 'Midland–Chuder border', summary: 'An "impregnable" Chuder fortress taken by the Hawks.', canon: 'canon', spoiler: 0, map: { x: 610, y: 365 }, symbol: 'castle', facts: [s0('Captured by the Band of the Hawk.')], sources: ['src-manga'] },
  { id: 'tower-of-rebirth', kind: 'location', name: 'Tower of Rebirth', epithet: 'Prison', region: 'Windham', summary: 'The prison tower where Griffith is held and tortured.', canon: 'canon', spoiler: 1, map: { x: 575, y: 255 }, symbol: 'tower', facts: [s1('Griffith is imprisoned here.')], sources: ['src-manga'] },
  { id: 'tower-of-conviction', kind: 'location', name: 'Tower of Conviction', epithet: 'Albion', region: 'Midland frontier', summary: 'A monastery-fortress at Albion where refugees and inquisitors gather.', canon: 'canon', spoiler: 1, map: { x: 380, y: 250 }, symbol: 'tower', facts: [s2('Site of the Incarnation.')], sources: ['src-manga'] },
  { id: 'vritannis', kind: 'location', name: 'Vritannis', epithet: 'Port city', region: 'Southern coast', summary: 'A wealthy port city where the Vandimion family holds power.', canon: 'canon', spoiler: 2, map: { x: 300, y: 520 }, symbol: 'port', facts: [s2('The party seeks a ship here.')], sources: ['src-manga'] },
  { id: 'elfhelm', kind: 'location', name: 'Elfhelm', epithet: 'Elf island', region: 'Western sea', summary: 'An island of elves, ruled by the Flower Storm Monarch.', canon: 'canon', spoiler: 2, map: { x: 110, y: 360 }, symbol: 'tree', facts: [s2('The company’s destination.')], sources: ['src-manga'] },
  { id: 'falconia', kind: 'location', name: 'Falconia', epithet: 'City of the Hawk', region: 'Former Windham', summary: 'A white city built in a night at the site of old Windham.', canon: 'canon', spoiler: 2, map: { x: 470, y: 290 }, symbol: 'city', facts: [s2('A refuge for humans in the transformed world.')], sources: ['src-manga'] },
  { id: 'qliphoth', kind: 'location', name: 'Qliphoth', epithet: 'Netherworld cave', region: 'Near Enoch village', summary: 'A cave tied to the Interstice, infested by trolls.', canon: 'canon', spoiler: 2, map: { x: 420, y: 175 }, symbol: 'void', facts: [s2('Guts confronts Slan here.')], sources: ['src-manga'] },
  { id: 'enchanted-forest', kind: 'location', name: 'Enchanted Forest', epithet: 'Flora’s home', region: 'Northern woods', summary: 'The forest hiding Flora’s mansion.', canon: 'canon', spoiler: 2, map: { x: 330, y: 140 }, symbol: 'forest', facts: [s2('Home of Flora and Schierke.')], sources: ['src-manga'] },
  { id: 'godo-mine', kind: 'location', name: 'Godo’s Mine', epithet: 'Forge', region: 'Mountains', summary: 'The blacksmith Godo’s home and forge.', canon: 'canon', spoiler: 1, map: { x: 690, y: 210 }, symbol: 'mountain', facts: [s1('Where the Dragon Slayer was kept.')], sources: ['src-manga'] },
  { id: 'chuder', kind: 'location', name: 'Chuder', epithet: 'Empire', region: 'East', summary: 'Midland’s enemy in the Hundred-Year War.', canon: 'canon', spoiler: 0, map: { x: 770, y: 400 }, symbol: 'city', facts: [s0('At war with Midland for a century.')], sources: ['src-manga'] },
  { id: 'kushan', kind: 'location', name: 'Kushan Empire', epithet: 'Eastern empire', region: 'Far east', summary: 'A distant empire whose forces invade Midland.', canon: 'canon', spoiler: 2, map: { x: 900, y: 290 }, symbol: 'ruin', facts: [s2('Invades Midland under Emperor Ganishka.')], sources: ['src-manga'] },
];

const F = (e: Omit<SimpleEntry, 'canon' | 'sources'> & { sources?: string[] }): SimpleEntry => ({ canon: 'canon', sources: ['src-manga'], ...e });

export const factions: SimpleEntry[] = [
  F({ id: 'band-of-the-hawk', kind: 'faction', name: 'Band of the Hawk', epithet: 'Mercenary company', summary: 'Griffith’s mercenary band, which rose from a gang of youths to an ennobled regiment of Midland.', spoiler: 0, art: 'hawk', facts: [s0('Founded and led by Griffith.'), s0('Guts served as Raid Captain.'), s1('Destroyed at the Eclipse.')], related: ['griffith', 'guts', 'casca', 'judeau', 'rickert'] }),
  F({ id: 'neue-band-of-the-hawk', kind: 'faction', name: 'Neue Band of the Hawk', epithet: 'The new Hawks', summary: 'Griffith’s new army, including human soldiers and Apostles.', spoiler: 2, art: 'hawk', facts: [s2('Includes Zodd, Grunbeld, Locus, Irvine.')], related: ['griffith', 'zodd'] }),
  F({ id: 'holy-iron-chain-knights', kind: 'faction', name: 'Holy Iron Chain Knights', epithet: 'Order of the Holy See', summary: 'A ceremonial knightly order sent after Guts.', spoiler: 1, art: 'crowd', facts: [s1('Commanded by Farnese.')], related: ['farnese', 'serpico'] }),
  F({ id: 'holy-see', kind: 'faction', name: 'Holy See', epithet: 'Church', summary: 'The dominant religious institution of the continent.', spoiler: 0, art: 'tower', facts: [s1('Its inquisition persecutes heretics.')], related: ['mozgus'] }),
  F({ id: 'midland-crown', kind: 'faction', name: 'Kingdom of Midland', epithet: 'Crown', summary: 'Royal court and army of Midland.', spoiler: 0, art: 'castle', facts: [s0('Hires the Hawks.')], related: ['charlotte', 'windham'] }),
  F({ id: 'guts-party', kind: 'faction', name: 'Guts’ Company', epithet: 'The travelers', summary: 'Those who travel with Guts after the Conviction arc.', spoiler: 2, art: 'crowd', facts: [s2('Puck, Casca, Isidro, Farnese, Serpico, Schierke.')], related: ['guts', 'puck', 'casca', 'isidro', 'farnese', 'serpico', 'schierke'] }),
  F({ id: 'godhand-faction', kind: 'faction', name: 'God Hand', epithet: 'Five', summary: 'See the God Hand chamber.', spoiler: 0, art: 'hand', facts: [s0('Four members at the story’s opening.')], related: ['void', 'slan', 'ubik', 'conrad', 'femto'] }),
  F({ id: 'apostles-faction', kind: 'faction', name: 'Apostles', epithet: 'Shito', summary: 'See the Apostle database.', spoiler: 0, art: 'beast', facts: [s0('Former humans.')], related: ['apostles'] }),
];

export const creatures: SimpleEntry[] = [
  F({ id: 'trolls', kind: 'creature', name: 'Trolls', epithet: 'Raiders from the Qliphoth', summary: 'Ugly, voracious creatures that raid villages.', spoiler: 2, art: 'beast', facts: [s2('Emerge from the Qliphoth.')] }),
  F({ id: 'elves', kind: 'creature', name: 'Elves', epithet: 'Piskies and others', summary: 'Small winged beings like Puck.', spoiler: 0, art: 'elf', facts: [s0('Puck is an elf.')], related: ['puck'] }),
  F({ id: 'kushan-daka', kind: 'creature', name: 'Daka', epithet: 'Kushan monsters', summary: 'Demonic soldiers serving the Kushan.', spoiler: 2, art: 'beast', facts: [s2('Created through Kushan sorcery.')] }),
  F({ id: 'sea-god', kind: 'creature', name: 'The Sea God', epithet: 'Leviathan', summary: 'A colossal being in the waters near an island the party visits.', spoiler: 2, art: 'sea', facts: [s2('Guts fights it from inside.')] }),
];

export const glossary: SimpleEntry[] = [
  F({ id: 'g-struggler', kind: 'glossary', name: 'Struggler', summary: 'The Skull Knight’s name for one who fights against causality.', spoiler: 1, facts: [] }),
  F({ id: 'g-apostle', kind: 'glossary', name: 'Apostle (Shito)', summary: 'A human transformed by a Behelit sacrifice.', spoiler: 0, facts: [] }),
  F({ id: 'g-behelit', kind: 'glossary', name: 'Behelit', summary: 'Egg-shaped stone that summons the God Hand.', spoiler: 0, facts: [] }),
  F({ id: 'g-eclipse', kind: 'glossary', name: 'Eclipse', summary: 'The God Hand ritual in which the Hawks were sacrificed.', spoiler: 1, facts: [] }),
  F({ id: 'g-hundred-year-war', kind: 'glossary', name: 'Hundred-Year War', summary: 'Conflict between Midland and Chuder.', spoiler: 0, facts: [] }),
  F({ id: 'g-od', kind: 'glossary', name: 'Od', summary: 'Spiritual energy perceived by witches.', spoiler: 2, facts: [] }),
  F({ id: 'g-interstice', kind: 'glossary', name: 'Interstice', summary: 'Boundary realm between worlds.', spoiler: 1, facts: [] }),
  F({ id: 'g-raid-captain', kind: 'glossary', name: 'Raid Captain', summary: 'Guts’ rank in the Band of the Hawk.', spoiler: 0, facts: [] }),
  F({ id: 'g-episode', kind: 'glossary', name: 'Episode', summary: 'Berserk counts its chapters as "episodes".', spoiler: 0, facts: [] }),
  F({ id: 'g-tankobon', kind: 'glossary', name: 'Tankōbon', summary: 'Collected volume edition of a manga.', spoiler: 0, facts: [] }),
];

export const creators: SimpleEntry[] = [
  F({
    id: 'kentaro-miura',
    kind: 'creator',
    name: 'Kentaro Miura',
    epithet: '1966 — 2021',
    summary: 'Creator of Berserk. Began the series in 1989 and drew it until his death in May 2021.',
    spoiler: 0,
    art: 'hand',
    facts: [
      s0('Born 1966 in Chiba Prefecture, Japan.'),
      s0('Prototype of Berserk published 1988; serialization began 1989.'),
      s0('Also created Gigantomakhia (2013) and Duranki (2019).'),
      s0('Died 6 May 2021.'),
    ],
  }),
  F({
    id: 'studio-gaga',
    kind: 'creator',
    name: 'Studio Gaga',
    epithet: 'Miura’s studio',
    summary: 'The studio of assistants who worked with Miura and continue Berserk.',
    spoiler: 0,
    art: 'crowd',
    sources: ['src-continuation'],
    facts: [{ text: 'Continues the manga from 2022 with supervision by Kouji Mori.', canon: 'canon', spoiler: 0, sources: ['src-continuation'] }],
  }),
  F({
    id: 'kouji-mori',
    kind: 'creator',
    name: 'Kouji Mori',
    epithet: 'Supervisor',
    summary: 'Manga artist and Miura’s longtime friend who supervises the continuation.',
    spoiler: 0,
    art: 'figure',
    sources: ['src-continuation'],
    facts: [{ text: 'Stated that Miura had told him of the story’s planned developments.', canon: 'creator-interview', spoiler: 0, sources: ['src-continuation'] }],
  }),
];
