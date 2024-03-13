from typing import Optional, List
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from routers.users import get_user, add_user
from services.db_service.events_service import (
    get_event
)
from services.db_service.entries_service import (
    add_entry,
    get_entry,
    get_entries,
    delete_entry,
)
from routers.utils import get_session_from_id
from db.models import AuthSession, Entry, EntryBase, Message, NewUser

router = APIRouter()


@router.get("/",
    response_model=List[Entry],
    responses={
        500: {"model": Message},
    },
)
async def query_entries(
    request: Request,
    event_id: Optional[str] = None,
    user_id: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
):
    """Entries endpoint"""
    try:
        entries: List[Entry] = get_entries(
            request.app.db, event_id, user_id, offset, limit
        )
        return entries
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Something went wrong"}
        )


@router.get("/{entry_id}",
    response_model=Entry,
    responses={
        404: {"model": Message},
        500: {"model": Message},
    },
)
async def query_entry(request: Request, entry_id: str):
    """Entry endpoint"""
    try:
        entry: Entry = get_entry(request.app.db, entry_id)
        if entry is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Entry with {entry_id=} does not exist"},
            )
        return entry
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Something went wrong"}
        )


@router.post(
    "/",
    response_model=Entry,
    responses={
        404: {"model": Message},
        500: {"model": Message},
        400: {"model": Message},
    },
)
async def create_entry(request: Request, entry: EntryBase, session: AuthSession = Depends(get_session_from_id),):
    """Create entry endpoint"""
    try:
        event = get_event(request.app.db, entry.event_id)
        user = get_user(request.app.db, entry.user_email)
        if event is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Event with {entry.event_id=} does not exist"},
            )

        if event.locked:
            return JSONResponse(
                status_code=400,
                content={"message": f"Event with {entry.event_id=} is locked"},
            )
        if entry.user_email in [e.user_email for e in event.entries]:
            return JSONResponse(
                status_code=400,
                content={
                    "message":
                        f"Entry with {entry.event_id=} and {entry.user_email=} already exists"
                },
            )
        if event.limit is not None and event.limit == len(event.entries):
            return JSONResponse(
                status_code=400,
                content={"message": f"Event with {entry.event_id=} is full"},
            )
        if user is None:
            new_user = NewUser(name="anonymous", email=entry.user_email, hashed_password="", is_anonymous=True)
            user = add_user(request.app.db, new_user)
        created_entry = add_entry(request.app.db, entry)
        return created_entry
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500,
            content={"message": "Failed to create entry"},
        )


@router.delete("/{entry_id}")
async def remove_entry(request: Request, entry_id: str, session: AuthSession = Depends(get_session_from_id)):
    """Delete entry endpoint"""
    try:
        entry: Entry = get_entry(request.app.db, entry_id)
        if entry is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Entry with {entry_id=} does not exist"},
            )
        if session.role == "user" and session.user_email != entry.user_email:
            return JSONResponse(
                status_code=401, content={"message": "Invalid credentials"}
            )
        delete_entry(request.app.db, entry_id)
        return {"message": "Event deleted"}
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to delete entry"}
        )
