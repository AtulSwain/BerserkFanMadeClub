"""Berserk Archive API.

Public routes are read-only and only ever return *published* rows.
The admin router is not mounted unless ARCHIVE_ADMIN_ENABLED=1 — and even then
it must sit behind authentication before deployment (see docs/CMS.md).
"""
import os

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .db import get_session
from .models import Claim, Entity, Link, Source

app = FastAPI(title="Berserk Archive API", version="0.1.0")


def serialize(e: Entity, max_spoiler: int) -> dict:
    claims: dict[str, list[dict]] = {}
    for c in e.claims:
        if c.state != "published":
            continue
        claims.setdefault(c.field, []).append(
            {"text": c.text if c.spoiler <= max_spoiler else None, "canon": c.canon, "spoiler": c.spoiler}
        )
    return {
        "id": e.id,
        "kind": e.kind,
        "name": e.name if e.spoiler <= max_spoiler else None,
        "epithet": e.epithet,
        "summary": e.summary if e.spoiler <= max_spoiler else None,
        "canon": e.canon,
        "spoiler": e.spoiler,
        **(e.attributes or {}),
        "claims": claims,
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/entities")
def list_entities(
    kind: str | None = None,
    spoiler: int = Query(0, ge=0, le=2),
    session: Session = Depends(get_session),
) -> list[dict]:
    q = select(Entity).where(Entity.state == "published")
    if kind:
        q = q.where(Entity.kind == kind)
    return [serialize(e, spoiler) for e in session.scalars(q.order_by(Entity.sort_key, Entity.name))]


@app.get("/api/entities/{entity_id}")
def get_entity(entity_id: str, spoiler: int = Query(0, ge=0, le=2), session: Session = Depends(get_session)) -> dict:
    e = session.get(Entity, entity_id)
    if not e or e.state != "published":
        raise HTTPException(404, "Not in the archive")
    links = session.scalars(select(Link).where(or_(Link.from_id == entity_id, Link.to_id == entity_id))).all()
    return {**serialize(e, spoiler), "links": [{"from": l.from_id, "to": l.to_id, "role": l.role} for l in links]}


@app.get("/api/search")
def search(q: str, spoiler: int = Query(0, ge=0, le=2), session: Session = Depends(get_session)) -> list[dict]:
    pattern = f"%{q}%"
    rows = session.scalars(
        select(Entity)
        .where(Entity.state == "published")
        .where(or_(Entity.name.ilike(pattern), Entity.epithet.ilike(pattern), Entity.summary.ilike(pattern)))
        .limit(60)
    )
    return [serialize(e, spoiler) for e in rows]


@app.get("/api/sources")
def sources(session: Session = Depends(get_session)) -> list[dict]:
    return [
        {k: getattr(s, k) for k in ("id", "title", "type", "publication", "date", "url", "confidence", "status", "note")}
        for s in session.scalars(select(Source))
    ]


if os.getenv("ARCHIVE_ADMIN_ENABLED") == "1":  # pragma: no cover - not exposed publicly yet
    from .admin import router as admin_router

    app.include_router(admin_router, prefix="/api/admin")
