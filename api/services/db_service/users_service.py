"""Authentication implementation"""

from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.schema import UserORM
from db.models import NewUser, User, UserInfo
from services.db_service.utils import DataServiceException

def get_user(db: Session, email: str) -> Optional[User]:
    """Get user from the database"""
    try:
        user = db.query(UserORM).filter(UserORM.email == email).first()
        if user is None:
            return user
        return User.model_validate(user)
    except SQLAlchemyError as err:
        print(err)
        raise DataServiceException("Failed to get user") from err


def get_user_info(
    db: Session, *, user_id: Optional[int] = None, email: Optional[str] = None
) -> Optional[UserInfo]:
    """Get User from info from the database"""
    try:
        if user_id is None and email is None:
            raise ValueError("Either user_id or email must be provided")
        if user_id is not None:
            user = db.query(UserORM).filter(UserORM.id == user_id).first()
            print(user)
        else:
            user = db.query(UserORM).filter(UserORM.email == email).first()
        if user is None:
            return user
        return UserInfo.model_validate(user)
    except SQLAlchemyError as err:
        print(err)
        raise DataServiceException("Failed to get user") from err


def add_user(db: Session, user: NewUser) -> UserInfo:
    """Create user"""
    try:
        db_user = UserORM(
            name=user.name,
            email=user.email,
            hashed_password=user.hashed_password,
            role=user.role,
            is_anonymous=user.is_anonymous,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserInfo.model_validate(db_user)
    except Exception as err:
        print(err)
        db.rollback()
        raise DataServiceException("Failed to create user") from err

def link_anonymous_user(db: Session, user: NewUser) -> UserInfo:
    """Link Anonymous users"""
    try:
        print(db.query(UserORM).filter(UserORM.email == user.email).count())
        db_user = db.query(UserORM).filter(UserORM.email == user.email).first()
        if db_user is None:
            raise DataServiceException("User does not exist")
        db_user.name = user.name
        db_user.hashed_password = user.hashed_password
        db_user.role = user.role
        db_user.is_anonymous = user.is_anonymous
        db.commit()
        db.refresh(db_user)
        return UserInfo.model_validate(db_user)
    except SQLAlchemyError as err:
        print(err)
        db.rollback()
        raise DataServiceException("Failed to create user") from err



def delete_user(db: Session, user_id: int) -> None:
    """Delete user"""
    try:
        user = db.query(UserORM).filter(UserORM.id == user_id).first()
        if user is None:
            raise DataServiceException("User does not exist")
        for entry in user.entries:
            db.delete(entry)
            db.commit()

        for event in user.events:
            for entry in event.entries:
                db.delete(entry)
                db.commit()
            db.delete(event)
            db.commit()
        db.delete(user)
        db.commit()

    except SQLAlchemyError as err:
        raise DataServiceException("Failed to delete user") from err
# def authenticate_user(db: Session, )
