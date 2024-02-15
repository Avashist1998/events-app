"""Model"""
from dataclasses import dataclass
import datetime
from pydantic import BaseModel, Field, ConfigDict, EmailStr, NonNegativeInt, NonNegativeFloat
from typing_extensions import Annotated
from typing import Optional, List


@dataclass
class NewUser:
    """New user"""
    name: str
    email: EmailStr
    hashed_password: str
    role: str = "user"
    is_anonymous: bool = False


class EntryBase(BaseModel):
    """Entry model"""
    event_id: int = Field(immutable=True)
    user_email: EmailStr = Field(immutable=True)

class EntryCreate(EntryBase):
    """Create entry model"""

class Entry(EntryBase):
    """Entry model"""
    id: int = Field(alias='id', immutable=True)
    created_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow,
                                            immutable=True)
    ss_recipient_email: Optional[Annotated[EmailStr, Field(immutable=False,
                                                        default_factory=None,
                                                        Optional=True)]] = None
    model_config = ConfigDict(from_attributes=True)

class EventData(BaseModel):
    """Event data model"""
    name: str
    location: Optional[Annotated[str, Field(immutable=False)]] = None
    limit: Optional[Annotated[NonNegativeInt, Field(default=None, immutable=False)]] = None
    price: NonNegativeFloat = Field(default=0.0, immutable=False)
    public: bool = Field(default=True, immutable=True)
    locked: bool = Field(default=False, immutable=False)
    rsvp_date: datetime.datetime = Field(immutable=False)
    event_date: datetime.datetime = Field(immutable=False)

class EventBase(EventData):
    """Event Base model"""
    creator: EmailStr = Field(immutable=True)

class EventCreate(EventBase):
    """Create event model"""
    pass

class Event(EventBase):
    """Event model"""
    id: int = Field(alias='id', immutable=True)
    created_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow,
                                            immutable=True)

    entries: List["Entry"] = []
    model_config = ConfigDict(from_attributes=True)

class EventsResponse(BaseModel):
    """Events response model"""
    count: int
    events: List[Event]

class Message(BaseModel):
    """Message model"""
    message: str


class UserBase(BaseModel):
    """User Base model"""
    name: str = Field(immutable=False)
    email: EmailStr = Field(immutable=True)


class UserSignUp(UserBase):
    """User Sign Up model"""
    password: str = Field(immutable=False)


class UserLogin(BaseModel):
    """User Login model"""
    email: EmailStr = Field(immutable=True)
    password: str = Field(immutable=True)


class UserInfo(UserBase):
    """User Info model"""
    id: int = Field(immutable=True)
    role: str = Field(immutable=False, default='user')
    created_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow,
                                            immutable=True)

    events: List[Event] = []
    entries: List[Entry] = []

    model_config = ConfigDict(from_attributes=True)

class User(UserBase):
    """User model"""
    id: int = Field(immutable=True)
    hashed_password: str = Field(immutable=False)
    created_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow,
                                            immutable=True)
    role: str = Field(immutable=False, default='user')
    is_anonymous: bool = Field(immutable=False, default=False)

    model_config = ConfigDict(from_attributes=True)


class AuthSession(BaseModel):
    """Session model"""
    id: int = Field(immutable=True)
    token: str = Field(immutable=True)
    role: str = Field(immutable=False, default="user")
    user_email: EmailStr = Field(immutable=False)
    created_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow,
                                            immutable=True)
    model_config = ConfigDict(from_attributes=True)
