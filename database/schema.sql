-- Berserk Archive — PostgreSQL schema
-- Mirrors frontend/src/data/types.ts. Every claim is a row in `claim` so that
-- canon classification, spoiler level and sources attach to individual facts,
-- not whole entries. Designed to scale to thousands of entries.

CREATE TYPE canon_class AS ENUM (
  'canon', 'creator-interview', 'anime-adaptation', 'manga-only',
  'adaptation-difference', 'inference', 'fan-theory', 'unknown'
);
CREATE TYPE confidence AS ENUM ('high', 'medium', 'low');
CREATE TYPE source_status AS ENUM ('Primary source', 'Secondary source', 'Needs verification');
CREATE TYPE relation_type AS ENUM ('ally', 'conflict', 'hatred', 'historical', 'unknown');
CREATE TYPE entity_kind AS ENUM (
  'character', 'faction', 'apostle', 'godhand', 'weapon', 'artifact', 'location', 'arc',
  'event', 'lore', 'volume', 'chapter', 'anime', 'anime_episode', 'studio', 'music',
  'craft', 'creature', 'glossary', 'creator', 'influence', 'production_note'
);
CREATE TYPE editorial_state AS ENUM ('draft', 'review', 'published');

-- ── Core: every archive entry shares one table, kind-specific data lives in `attributes`.
CREATE TABLE entity (
  id            TEXT PRIMARY KEY,                -- global slug, e.g. 'guts'
  kind          entity_kind NOT NULL,
  name          TEXT NOT NULL,
  epithet       TEXT,
  summary       TEXT NOT NULL DEFAULT '',
  canon         canon_class NOT NULL DEFAULT 'canon',
  spoiler       SMALLINT NOT NULL DEFAULT 0 CHECK (spoiler BETWEEN 0 AND 2),
  attributes    JSONB NOT NULL DEFAULT '{}',     -- title, first_appearance, size, material…
  sort_key      TEXT,
  state         editorial_state NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    TEXT
);
CREATE INDEX entity_kind_idx ON entity (kind, sort_key);
CREATE INDEX entity_search_idx ON entity USING GIN (to_tsvector('english', name || ' ' || coalesce(epithet, '') || ' ' || summary));

-- ── Claims: the unit of classification. A dossier field ("status", "abilities") is a list of claims.
CREATE TABLE claim (
  id          BIGSERIAL PRIMARY KEY,
  entity_id   TEXT NOT NULL REFERENCES entity (id) ON DELETE CASCADE,
  field       TEXT NOT NULL,                     -- 'status', 'abilities', 'theories', …
  position    INT NOT NULL DEFAULT 0,
  text        TEXT NOT NULL,
  canon       canon_class NOT NULL,
  spoiler     SMALLINT NOT NULL DEFAULT 0 CHECK (spoiler BETWEEN 0 AND 2),
  state       editorial_state NOT NULL DEFAULT 'draft'
);
CREATE INDEX claim_entity_idx ON claim (entity_id, field, position);

-- ── Sources & citations (Source → Claim)
CREATE TABLE source (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL,                    -- Manga, Creator Interview, Official Guidebook, …
  publication  TEXT,
  date         TEXT,
  url          TEXT,
  confidence   confidence NOT NULL DEFAULT 'medium',
  status       source_status NOT NULL DEFAULT 'Needs verification',
  note         TEXT
);
CREATE TABLE citation (
  id         BIGSERIAL PRIMARY KEY,
  claim_id   BIGINT REFERENCES claim (id) ON DELETE CASCADE,
  entity_id  TEXT REFERENCES entity (id) ON DELETE CASCADE,
  source_id  TEXT NOT NULL REFERENCES source (id),
  locator    TEXT,                               -- page, episode, timestamp
  CHECK (claim_id IS NOT NULL OR entity_id IS NOT NULL)
);

-- ── Typed links between entities (Character → Weapon, Event → Location, AnimeEpisode → Chapter …)
CREATE TABLE link (
  from_id   TEXT NOT NULL REFERENCES entity (id) ON DELETE CASCADE,
  to_id     TEXT NOT NULL REFERENCES entity (id) ON DELETE CASCADE,
  role      TEXT NOT NULL,                       -- 'wields', 'member_of', 'participant', 'adapts', 'appears_in', 'owner', 'battle', 'located_at', 'human_form' …
  position  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (from_id, to_id, role)
);
CREATE INDEX link_to_idx ON link (to_id, role);   -- backlinks for search "connections"

-- ── Relationships (character graph)
CREATE TABLE relationship (
  id        TEXT PRIMARY KEY,
  from_id   TEXT NOT NULL REFERENCES entity (id),
  to_id     TEXT NOT NULL REFERENCES entity (id),
  type      relation_type NOT NULL,
  label     TEXT NOT NULL,
  mutual    BOOLEAN NOT NULL DEFAULT FALSE,
  note_claim_id BIGINT REFERENCES claim (id)
);

-- ── Timeline stages, event sequences, volume chapter lists
CREATE TABLE sequence_item (
  entity_id  TEXT NOT NULL REFERENCES entity (id) ON DELETE CASCADE,
  list       TEXT NOT NULL,                      -- 'timeline', 'sequence', 'chapters'
  position   INT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  spoiler    SMALLINT NOT NULL DEFAULT 0,
  asset_id   BIGINT,
  PRIMARY KEY (entity_id, list, position)
);

-- ── Licensed / user-provided artwork. Placeholders are drawn in the frontend when absent.
CREATE TABLE asset (
  id          BIGSERIAL PRIMARY KEY,
  entity_id   TEXT REFERENCES entity (id) ON DELETE SET NULL,
  src         TEXT NOT NULL,
  alt         TEXT NOT NULL,
  credit      TEXT NOT NULL,
  license     TEXT NOT NULL,                     -- must be filled before publishing
  source_url  TEXT,
  uploaded_by TEXT,
  approved    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ── Editorial audit trail
CREATE TABLE revision (
  id          BIGSERIAL PRIMARY KEY,
  entity_id   TEXT NOT NULL,
  editor      TEXT NOT NULL,
  diff        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
