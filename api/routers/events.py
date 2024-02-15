from typing import Optional, Tuple, List
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import EmailStr

from routers.utils import get_session_from_id
from db.models import Event, EventData, EventBase, Message, EventsResponse, AuthSession
from services.db_service import DataServiceException
from services.db_service.events_service import (
    get_events,
    get_event,
    add_event,
    update_event,
    delete_event,
)

router = APIRouter()


@router.get("/", response_model=EventsResponse, responses={500: {"model": Message}})
async def query_events(
    request: Request,
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
    public: Optional[bool] = None,
    creator: Optional[EmailStr] = None,
    search_term: Optional[str] = None,
):
    """Events endpoint"""
    limit = max(10, limit)
    limit = min(100, limit)
    offset = max(0, offset)
    try:
        res: Optional[Tuple[int, List[Event]]] = get_events(
            request.app.db, offset, limit, public, creator, search_term
        )
        if res is None:
            return JSONResponse(status_code=404, content={"message": "No events found"})
        return EventsResponse(count=res[0], events=res[1])
    except DataServiceException as err:
        print(err, type(err))
        return JSONResponse(
            status_code=500, content={"message": "Failed to get events"}
        )
    except Exception as err:
        print(err, type(err))
        return JSONResponse(
            status_code=500, content={"message": "Failed to get events"}
        )


@router.get("/{event_id}")
async def query_event(request: Request, event_id: int):
    """Event endpoint"""
    try:
        event = get_event(request.app.db, event_id)
        if event is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Event with {event_id=} does not exist"},
            )
        return event
    except DataServiceException as err:
        print(err)
        return JSONResponse(status_code=500, content={"message": "Failed to get event"})
    except Exception as err:
        print(err)
        return JSONResponse(status_code=500, content={"message": "Failed to get event"})


@router.post("/")
async def create_event(
    request: Request,
    event: EventBase,
    session: AuthSession = Depends(get_session_from_id),
):
    """Create event endpoint"""
    try:
        res = add_event(request.app.db, event)
        if res is None:
            return JSONResponse(
                status_code=500, content={"message": "Failed to create event"}
            )
        return res
    except DataServiceException as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to create event"}
        )
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to create event"}
        )


@router.put("/{event_id}", response_model=Event)
async def modify_event(
    request: Request,
    event_id: int,
    event: EventData,
    session: AuthSession = Depends(get_session_from_id),
):
    """Update event endpoint"""
    try:
        print(event_id, event)
        db_event: Event = get_event(request.app.db, event_id)
        if db_event is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Event with {event_id=} does not exist"},
            )
        if session.role == "user" and session.user_email != db_event.creator:
            return JSONResponse(
                status_code=401, content={"message": "Invalid credentials"}
            )
        db_event.name = event.name
        db_event.limit = event.limit
        db_event.price = event.price
        db_event.public = event.public
        db_event.locked = event.locked
        db_event.location = event.location
        db_event.rsvp_date = event.rsvp_date
        db_event.event_date = event.event_date
        _ = update_event(request.app.db, db_event)
        return db_event
    except DataServiceException as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to update event"}
        )
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to update event"}
        )


@router.delete("/{event_id}")
async def remove_event(
    request: Request, event_id: str, session: AuthSession = Depends(get_session_from_id)
):
    """Delete event endpoint"""
    try:
        event = get_event(request.app.db, event_id)
        if event is None:
            return JSONResponse(
                status_code=404,
                content={"message": f"Event with {event_id=} does not exist"},
            )
        if session.role == "user" and session.user_email != event.creator:
            return JSONResponse(
                status_code=401, content={"message": "Invalid credentials"}
            )
        delete_event(request.app.db, event_id)
        return {"message": "Event deleted"}
    except DataServiceException as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to delete event"}
        )
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500, content={"message": "Failed to delete event"}
        )
