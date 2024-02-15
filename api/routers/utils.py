from fastapi import Request, HTTPException, Depends

from api.services.db_service.sessions_service import get_session

def get_session_id(request: Request):
    """Get session id"""
    session_id = request.cookies.get("Authorization")
    print("session_id", session_id)
    if not session_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return session_id


def get_session_from_id(request: Request, session_id: str = Depends(get_session_id)):
    """Get session"""
    session = get_session(request.app.db, session_id)
    if session is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return session
