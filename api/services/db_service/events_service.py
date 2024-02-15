from pydantic import EmailStr
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.schema import EventORM
from db.models import Event, EventBase
from services.db_service.utils import DataServiceException

def get_events(
    db: Session,
    /,
    offset: int = 0,
    limit: int = 10,
    public: Optional[bool] = None,
    creator: Optional[EmailStr] = None,
    search_term: Optional[str] = None,
) -> Tuple[int, List[Event]]:
    """Get all events from the database"""
    try:
        total_count = db.query(EventORM).count()        
        query = db.query(EventORM)
        if public is not None:
            query = query.filter(EventORM.public == public)
        if search_term is not None:
            search_text = f"%{search_term}%"
            query = query.filter(EventORM.name.like(search_text))
        if creator is not None:
            query = query.filter(EventORM.creator == creator)

        db_events = query.offset(offset * limit).limit(limit).all()
        # print(f"total number of events in db = {db_events}")
        return total_count, [Event.model_validate(db_event) for db_event in db_events]
    except SQLAlchemyError as err:
        print(err)
        raise DataServiceException("Failed to get events") from err

def add_event(db: Session, event: EventBase) -> Event:
    """Add a event to the database"""
    try:
        db_event = EventORM(
            name=event.name,
            creator=event.creator,
            location=event.location,
            limit=event.limit,
            price=event.price,
            public=event.public,
            locked=event.locked,
            rsvp_date=event.rsvp_date,
            event_date=event.event_date,
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return Event.model_validate(db_event)
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to create event") from err

def get_event(db: Session, _id: int) -> Optional[Event]:
    """Get a event from the database"""
    try:
        print(f"total number of events in db = {db.query(EventORM).count()}")
        db_event = db.query(EventORM).filter(EventORM.id == int(_id)).first()
        if db_event is None:
            return None
        return Event.model_validate(db_event)
    except SQLAlchemyError as err:
        raise DataServiceException(f"Failed to get event with {_id=}") from err

def delete_event(db: Session, _id: int):
    """Deletes the event from database"""
    try:

        event = db.query(EventORM).filter(EventORM.id == _id).first()

        if event is None:
            raise DataServiceException("Failed to find event to delete")

        for entry in event.entries:
            db.delete(entry)
            db.commit()
        db.delete(event)
        db.commit()

    except SQLAlchemyError as err:
        raise DataServiceException("Failed to delete event") from err

def update_event(db: Session, event: Event):
    """Update a event in the database"""
    try:
        update_event_count = (
            db.query(EventORM)
            .filter(EventORM.id == event.id)
            .update(
                {
                    "name": event.name,
                    "location": event.location,
                    "limit": event.limit,
                    "price": event.price,
                    "public": event.public,
                    "locked": event.locked,
                    "rsvp_date": event.rsvp_date,
                    "event_date": event.event_date,
                }
            )
        )
        db.commit()
        if update_event_count == 0:
            raise DataServiceException("Failed to find event to update")
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to update event") from err
