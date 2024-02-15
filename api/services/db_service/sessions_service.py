from typing import Optional
from uuid import uuid4
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.schema import SessionORM
from db.models import AuthSession
from services.db_service.utils import DataServiceException


def get_session(db: SessionORM, session_id: str) -> Optional[AuthSession]:
    """Get the session associated with the session id"""
    try:
        session = db.query(SessionORM).filter(SessionORM.token == session_id).first()
        if session is None:
            return session
        return AuthSession.model_validate(session)
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to get session") from err


def create_session(db: Session, user_email: str) -> AuthSession:
    """Create session"""
    try:
        session = SessionORM(token=str(uuid4()), user_email=user_email)
        db.add(session)
        db.commit()
        db.refresh(session)
        return AuthSession.model_validate(session)
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to create session") from err


def remove_session(db: Session, session_id: str) -> None:
    """Remove session"""
    try:
        db.query(SessionORM).filter(SessionORM.token == session_id).delete()
        db.commit()
    except SQLAlchemyError as err:
        raise DataServiceException("Failed to remove session") from err
