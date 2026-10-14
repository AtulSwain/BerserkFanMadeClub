# Berserk: The Struggler’s Archive

*In a world governed by fate, one man continues to struggle.*

The Struggler’s Archive is an unofficial, fan-made encyclopedia of Kentaro Miura's Berserk, designed as an interactive manga volume: chapter tabs, panels, gutters, folios, marginalia and ink. Every claim carries a canon classification and sources; spoilers are hidden by default.

### Design

- **Palette:** abyss black `#0B0A0A`, charcoal `#24211F`, aged parchment `#E4DCCB`, dried crimson `#8C2425` — red used sparingly, for emphasis only.
- **Type:** Cinzel for titles, Cormorant Garamond for story passages, Inter for interface text; Shippori Mincho and Yuji Syuku for Japanese.
- **Motion:** an almost-black prologue with a faint, smouldering brand mark; drifting ash, embers and fog; slow parallax; irregular panel-shaped reveals; an ink-spread transition between pages; thin crimson lines on the active tab; and a single Eclipse transition reserved for the Eclipse entry. All of it switches off under *reduce motion*.
- **Homepage:** prologue, then five chapters — The Struggler, The Golden Age, The Characters, The World of Berserk, The Legacy.

### Sections

Prologue & five-chapter homepage · Legacy tribute to Kentaro Miura · Archive index (16 chapters) · Character database & dossiers with development strips · Relationship map · Factions · Apostle database with interactive transformation · God Hand chamber · Weapons arsenal (blueprint plates) · Horizontal chronology & cinematic event views · Lore manuscript · Hand-drawn atlas · Manga craft essay · Interactive panel analysis · Shot-type cinematography · Anime archive · Manga vs anime comparison · Music · Volume shelf · Global search · Bibliography.

### Artwork

Every drawing is an original fan illustration built in code with seinen-manga technique: cross-hatching, screentone, rim light, focus and speed lines, hand-lettered katakana sound effects and speech balloons. No Berserk panels or official illustrations are included.

**Adding pictures:** every picture goes in the top-level [`images/`](images/) folder. [`images/IMAGE-LIST.md`](images/IMAGE-LIST.md) lists the exact file name for each spot on the site (most visible first) — save a picture with that name, e.g. `images/guts.jpg`, and it replaces the drawing. No code to edit. Steps: [`images/README.md`](images/README.md).

## See it

**Live site:** once this repository's GitHub Pages is enabled (see *Deploy* below), the site is published at
`https://atulswain.github.io/BerserkFanMadeClub/` on every push to `main`.

| Prologue | Archive index |
|---|---|
| ![Prologue](docs/screenshots/cover.jpg) | ![Archive index](docs/screenshots/archive-index.jpg) |
| **Character dossier** | **Relationship map** |
| ![Character dossier](docs/screenshots/character-dossier.jpg) | ![Relationship map](docs/screenshots/relationship-map.jpg) |
| **God Hand** | **Weapons arsenal** |
| ![God Hand](docs/screenshots/god-hand.jpg) | ![Weapons](docs/screenshots/weapons.jpg) |
| **Chronology** | **Event view — The Eclipse** |
| ![Chronology](docs/screenshots/chronology.jpg) | ![Event view](docs/screenshots/event-eclipse.jpg) |
| **Atlas** | **Panel analysis lab** |
| ![Atlas](docs/screenshots/atlas.jpg) | ![Panel lab](docs/screenshots/panel-lab.jpg) |
| **Legacy — Kentaro Miura** | |
| ![Legacy](docs/screenshots/legacy.jpg) | |

<p>
  <img src="docs/screenshots/mobile-cover.jpg" alt="Mobile cover" width="260" />
  <img src="docs/screenshots/mobile-characters.jpg" alt="Mobile characters" width="260" />
</p>

## Technology Stack

- Frontend: React, TypeScript, Vite, React Router DOM, hand-written CSS (no UI or animation libraries — CSS animations, a small canvas for ash, SVG filters and IntersectionObserver keep it fast)
- Backend: Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Pydantic
- Planned integrations: JWT authentication, Cloudinary, Meilisearch, Redis, Docker, analytics, localization, and cloud deployment

## Folder Structure

```text
backend/            FastAPI read API + unmounted admin API
database/schema.sql PostgreSQL schema (entities, claims, sources, links)
docs/CMS.md         data model, source system and CMS notes
images/             all site pictures + IMAGE-LIST.md (what to add, by name)
frontend/src/
  art/              original placeholder art, blueprints, demo manga page
  components/       page frame, panels, spoilers, canon stamps, nav, search
  data/             typed seed content + ArchiveRepository
  fx/               atmosphere (ash, fog), brand mark, parallax, Eclipse wipe
  cms/              admin field definitions (not routed)
  pages/            one lazy-loaded chunk per section
  styles/           tokens, base, system, chrome, pages, struggler
```

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Development Commands

- `npm run dev` starts the frontend development server.
- `npm run build` type-checks and builds the frontend.
- `uvicorn app.main:app --reload` starts the backend API.

## Deploy

The site is a static build and deploys to **GitHub Pages** with `.github/workflows/pages.yml`:

1. In the repository go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
2. Merge to `main` (or run the *Deploy site to GitHub Pages* workflow manually from the **Actions** tab).
3. The site appears at `https://<owner>.github.io/<repository>/`.

Build variants:

- `npm run build` — normal build served from `/`.
- `BASE_PATH=/BerserkFanMadeClub/ npm run build:pages` — GitHub Pages build (sub-path + `404.html` fallback so deep links work).
- `npm run build:preview` — hash-routed build with relative paths that runs from any folder or static host.

`.github/workflows/ci.yml` builds the frontend and checks the backend on every pull request.

## Future Roadmap

- Authentication and user profiles
- Admin dashboard
- Discussion forums and community features
- Bookmarks, favorites, reviews, and achievements
- Image uploads, search, caching, and real-time chat
- Dark mode, localization, SEO, analytics, Docker, and cloud deployment

## Contribution Guide

Keep changes small, typed, documented, and aligned with the existing folder boundaries. Prefer reusable components, service modules, and backend business logic separated from route definitions.

## License & credits

This is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by Kentaro Miura's estate, Studio Gaga, Hakusensha, Young Animal, Dark Horse or any anime licensor. *Berserk* was created by Kentaro Miura (1966–2021) and continues under Studio Gaga, supervised by Kouji Mori. No manga chapters or scans are hosted here.

Read it legally: [Dark Horse](https://www.darkhorse.com/) (English) · [Hakusensha](https://www.hakusensha.co.jp/) (Japanese) · [official portal](https://berserk-project.jp/).

Project code is intended for educational and non-commercial use.

