# Berserk Archive

Berserk Archive is a fan-made encyclopedia and community platform dedicated to the manga and anime series Berserk. This repository currently contains the Phase 1 foundation: a modular React frontend, a scalable FastAPI backend, and documentation-oriented project structure for future expansion.

## Technology Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router DOM, Framer Motion, GSAP, Axios
- Backend: Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Pydantic
- Planned integrations: JWT authentication, Cloudinary, Meilisearch, Redis, Docker, analytics, localization, and cloud deployment

## Folder Structure

```text
berserk-archive/
  assets/
  backend/
  database/
  docs/
  frontend/
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

