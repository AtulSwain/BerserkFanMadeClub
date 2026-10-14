"""Editor endpoints. NOT mounted by default and MUST be placed behind authentication.

Enforces the publishing rules in frontend/src/cms/schema.ts (PUBLISH_RULES).
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from .db import get_session
from .models import Citation, Claim, Entity

router = APIRouter(tags=["admin"])

CITED_CLASSES = {"canon", "manga-only", "creator-interview"}


class ClaimIn(BaseModel):
    field: str
    text: str
    canon: str
    spoiler: int = Field(0, ge=0, le=2)
    sources: list[str] = []


@router.post("/entities/{entity_id}/claims")
def add_claim(entity_id: str, body: ClaimIn, session: Session = Depends(get_session)) -> dict:
    if not session.get(Entity, entity_id):
        raise HTTPException(404, "Unknown entity")
    if body.field == "theories" and body.canon != "fan-theory":
        raise HTTPException(422, "Theories must be classified fan-theory")
    if body.canon == "fan-theory" and body.field != "theories":
        raise HTTPException(422, "Fan theories may only be stored as theories")
    claim = Claim(entity_id=entity_id, field=body.field, text=body.text, canon=body.canon, spoiler=body.spoiler)
    session.add(claim)
    session.flush()
    for sid in body.sources:
        session.add(Citation(claim_id=claim.id, source_id=sid))
    session.commit()
    return {"id": claim.id}


@router.post("/entities/{entity_id}/publish")
def publish(entity_id: str, session: Session = Depends(get_session)) -> dict:
    e = session.get(Entity, entity_id)
    if not e:
        raise HTTPException(404, "Unknown entity")
    uncited = [
        c.id
        for c in e.claims
        if c.canon in CITED_CLASSES
        and not session.scalars(select(Citation).where(Citation.claim_id == c.id)).first()
    ]
    if uncited:
        raise HTTPException(422, {"error": "Claims need sources before publishing", "claims": uncited})
    e.state = "published"
    for c in e.claims:
        c.state = "published"
    session.commit()
    return {"id": e.id, "state": e.state}
