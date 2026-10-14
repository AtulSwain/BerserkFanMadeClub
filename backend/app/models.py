"""ORM models mirroring /database/schema.sql."""
from sqlalchemy import JSON, BigInteger, Boolean, ForeignKey, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Entity(Base):
    __tablename__ = "entity"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    kind: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(Text)
    epithet: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str] = mapped_column(Text, default="")
    canon: Mapped[str] = mapped_column(String, default="canon")
    spoiler: Mapped[int] = mapped_column(SmallInteger, default=0)
    attributes: Mapped[dict] = mapped_column(JSON, default=dict)
    sort_key: Mapped[str | None] = mapped_column(Text)
    state: Mapped[str] = mapped_column(String, default="draft")

    claims: Mapped[list["Claim"]] = relationship(back_populates="entity", order_by="Claim.position")


class Claim(Base):
    __tablename__ = "claim"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    entity_id: Mapped[str] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"))
    field: Mapped[str] = mapped_column(Text)
    position: Mapped[int] = mapped_column(Integer, default=0)
    text: Mapped[str] = mapped_column(Text)
    canon: Mapped[str] = mapped_column(String)
    spoiler: Mapped[int] = mapped_column(SmallInteger, default=0)
    state: Mapped[str] = mapped_column(String, default="draft")

    entity: Mapped[Entity] = relationship(back_populates="claims")


class Source(Base):
    __tablename__ = "source"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(Text)
    publication: Mapped[str | None] = mapped_column(Text)
    date: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text)
    confidence: Mapped[str] = mapped_column(String, default="medium")
    status: Mapped[str] = mapped_column(String, default="Needs verification")
    note: Mapped[str | None] = mapped_column(Text)


class Citation(Base):
    __tablename__ = "citation"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    claim_id: Mapped[int | None] = mapped_column(ForeignKey("claim.id", ondelete="CASCADE"))
    entity_id: Mapped[str | None] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"))
    source_id: Mapped[str] = mapped_column(ForeignKey("source.id"))
    locator: Mapped[str | None] = mapped_column(Text)


class Link(Base):
    __tablename__ = "link"

    from_id: Mapped[str] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"), primary_key=True)
    to_id: Mapped[str] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[str] = mapped_column(Text, primary_key=True)
    position: Mapped[int] = mapped_column(Integer, default=0)


class Asset(Base):
    __tablename__ = "asset"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    entity_id: Mapped[str | None] = mapped_column(ForeignKey("entity.id", ondelete="SET NULL"))
    src: Mapped[str] = mapped_column(Text)
    alt: Mapped[str] = mapped_column(Text)
    credit: Mapped[str] = mapped_column(Text)
    license: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str | None] = mapped_column(Text)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
