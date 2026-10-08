# Berserk Archive

Berserk Archive — *The Manga Archive* — is a fan-made encyclopedia of Kentaro Miura's Berserk, designed as an interactive manga volume: chapter tabs, panels, gutters, folios, marginalia and ink. Every claim carries a canon classification and sources; spoilers are hidden by default.

### Sections

Cover with page-split entry · Archive index (16 chapters) · Character database & dossiers with development strips · Relationship map · Factions · Apostle database with interactive transformation · God Hand chamber · Weapons arsenal (blueprint plates) · Horizontal chronology & cinematic event views · Lore manuscript · Hand-drawn atlas · Manga craft essay · Interactive panel analysis · Shot-type cinematography · Anime archive · Manga vs anime comparison · Music · Volume shelf · Global search · Bibliography.

### Artwork

No Berserk panels or official illustrations are included. All images are original procedural ink placeholders, labelled as such, and can be replaced with licensed assets via the `asset` field (see `docs/CMS.md`).

## Technology Stack

- Frontend: React, TypeScript, Vite, React Router DOM, hand-written CSS (no UI or animation libraries — CSS animations, SVG filters and IntersectionObserver keep it fast)
- Backend: Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Pydantic
- Planned integrations: JWT authentication, Cloudinary, Meilisearch, Redis, Docker, analytics, localization, and cloud deployment

## Folder Structure

```text
backend/            FastAPI read API + unmounted admin API
database/schema.sql PostgreSQL schema (entities, claims, sources, links)
docs/CMS.md         data model, source system and CMS notes
frontend/src/
  art/              original placeholder art, blueprints, demo manga page
  components/       page frame, panels, spoilers, canon stamps, nav, search
  data/             typed seed content + ArchiveRepository
  cms/              admin field definitions (not routed)
  pages/            one lazy-loaded chunk per section
  styles/           tokens, base, system, chrome, pages
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

## Future Roadmap

- Authentication and user profiles
- Admin dashboard
- Discussion forums and community features
- Bookmarks, favorites, reviews, and achievements
- Image uploads, search, caching, and real-time chat
- Dark mode, localization, SEO, analytics, Docker, and cloud deployment

## Contribution Guide

Keep changes small, typed, documented, and aligned with the existing folder boundaries. Prefer reusable components, service modules, and backend business logic separated from route definitions.

## License

This is a fan-made project and is not affiliated with, endorsed by, or sponsored by the owners of Berserk. Project code is intended for educational and non-commercial use.

