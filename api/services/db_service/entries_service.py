from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.models import Entry, EntryBase
from db.schema import EntryORM
from services.db_service.utils import DataServiceException



def get_entries(
    db: Session,
    user_email: Optional[str] = None,
    event_id: Optional[int] = None,
    offset: int = 0,
    limit: int = 10,
) -> List[Entry]:
    """Get all entries from the database"""
    try:
        db_entries = (
            db.query(EntryORM).offset(offset*limit).limit(limit).all()
        )
        if user_email:
            db_entries = (
                db.query(EntryORM)
                .filter(EntryORM.user_email == user_email)
                .offset(offset*limit).limit(limit)
                .all()
            )
        if event_id:
            db_entries = (
                db.query(EntryORM)
                .filter(EntryORM.event_id == event_id)
                .offset(offset*limit).limit(limit)
                .all()
            )
        if user_email and event_id:
            db_entries = (
                db.query(EntryORM)
                .filter(EntryORM.user_email == user_email)
                .filter(EntryORM.event_id == event_id)
                .offset(offset*limit).limit(limit)
                .all()
            )
        db.commit()
        return [Entry.model_validate(db_entry) for db_entry in db_entries]
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to get entries") from err

def add_entry(db: Session, entry: EntryBase) -> Entry:
    """Create a entry in the database"""
    try:
        db_entry = EntryORM(
            event_id = entry.event_id,
            user_email=entry.user_email,
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return Entry.model_validate(db_entry)
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to create entry") from err

def get_entry(db: Session, _id: int) -> Optional[Entry]:
    """Get a entry from the database"""
    try:
        db_entry = db.query(EntryORM).filter(EntryORM.id == _id).first()
        db.commit()
        if db_entry is None:
            return None
        return Entry.model_validate(db_entry)
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to get entry") from err

def delete_entry(db: Session, _id: int):
    """Deletes the entry from database"""
    try:
        _ = db.query(EntryORM).filter(EntryORM.id == _id).delete()
        db.commit()
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to delete entry") from err
