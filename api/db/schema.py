"""Database Schemas"""
from datetime import datetime
from typing import List
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship, Mapped

from db.base import Base


class SessionORM(Base):
    """Session model"""

    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, index=True)
    role = Column(String, index=False, default="user")
    user_email = Column(String, ForeignKey("users.email"))
    created_date = Column(DateTime, nullable=False, index=False, default=datetime.now())


class UserORM(Base):
    """User model"""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, index=True)
    role = Column(String, index=False)
    is_anonymous = Column(Boolean, index=False, default=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, index=False)
    created_date = Column(DateTime, nullable=False, index=False, default=datetime.now())

    events: Mapped[List["EventORM"]] = relationship(
        "EventORM", foreign_keys="EventORM.creator"
    )

    entries: Mapped[List["EntryORM"]] = relationship(
        "EntryORM", foreign_keys="EntryORM.user_email"
    )


class EventORM(Base):
    """Event model"""

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, index=True)
    creator = Column(String, ForeignKey("users.email"))
    location = Column(String, nullable=True, default=None, index=False)

    limit = Column(Integer, nullable=True, default=None, index=False)
    price = Column(Float, nullable=False, default=0.0, index=False)
    public = Column(Boolean, nullable=False, default=True, index=False)
    locked = Column(Boolean, nullable=False, default=False, index=False)

    rsvp_date = Column(DateTime, nullable=False, index=False)
    event_date = Column(DateTime, nullable=False, index=False)
    created_date = Column(DateTime, nullable=False, index=False, default=datetime.now())

    entries: Mapped[List["EntryORM"]] = relationship(
        "EntryORM", foreign_keys="EntryORM.event_id"
    )


class EntryORM(Base):
    """Entry model"""

    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_email = Column(Integer, ForeignKey("users.email"), nullable=False)
    created_date = Column(DateTime, nullable=False, index=False, default=datetime.now())
    ss_recipient_email = Column(
        Integer, ForeignKey("users.email"), nullable=True, default=None, index=False
    )
