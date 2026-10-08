# Archive data & CMS architecture

## Layers

```
frontend/src/data/*.ts        static seed content (typed)            ← today
frontend/src/data/archive.ts  ArchiveRepository — the only read API pages use
backend/app                   FastAPI read API + (unmounted) admin API  ← next
database/schema.sql           PostgreSQL schema
frontend/src/cms/schema.ts    field definitions for a future admin UI (not routed)
```

Pages never import raw data files. To switch to the database, implement
`ArchiveRepository` against `/api/*` and swap the exported `archive` instance.

## The claim model

Every factual sentence is a **claim** carrying:

| field     | meaning |
|-----------|---------|
| `canon`   | `canon`, `creator-interview`, `anime-adaptation`, `manga-only`, `adaptation-difference`, `inference`, `fan-theory`, `unknown` |
| `spoiler` | `0` no spoilers · `1` Golden Age outcomes · `2` everything |
| `sources` | ids in the `source` table, each with type, publication, date, URL, confidence, status |

Classifications never combine. Fan theories live only in `theories` fields.

## Entities and relationships

All entries share the `entity` table (`kind` + JSON `attributes`). Typed
connections — Character → Weapon, Character → Faction, Event → Location,
Apostle → Battle, AnimeEpisode → Chapter, Source → Claim — are rows in `link`
(with a backlink index used by global search). The character graph uses
`relationship`; ordered lists (development timeline, event panel sequence,
volume chapter list) use `sequence_item`.

## Artwork

No Berserk artwork ships with the project. When an entity has no approved
`asset`, the frontend draws an original abstract placeholder labelled as such.
An asset can only be published with `credit` and `license` filled in.

## Admin

`backend/app/admin.py` enforces publishing rules (cited canon claims,
fan theories isolated). It is mounted only when `ARCHIVE_ADMIN_ENABLED=1` and
must be put behind authentication before that flag is ever set in production.

## Content status

Seed content is deliberately conservative. Entries whose sources are marked
**Needs verification** (guidebook page references, interview citations,
some music credits and Memorial Edition details) must be checked by an editor
before being promoted. Volume chapter lists are empty until verified.
