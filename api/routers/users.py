from fastapi import Request, Depends, HTTPException, Response, APIRouter

from routers.utils import get_session_id
from db.models import UserSignUp, User, NewUser, UserLogin, UserInfo
from services.db_service.utils import DataServiceException
from services.db_service.users_service import (
    get_user,
    add_user,
    get_user_info,
    delete_user,
    link_anonymous_user,
)
from services.db_service.sessions_service import (
    get_session,
    create_session,
    remove_session,
)
from services.hashing import get_password_hash, verify_password

router = APIRouter()

def validate_user_email(request: Request, user: UserSignUp):
    """Validate user email"""
    user: User | None = get_user(request.app.db, user.email)
    if user and not user.is_anonymous:
        raise HTTPException(status_code=409, detail="User already exists")
    return user


@router.post("/", response_model=UserInfo)
async def signup(request: Request, user: UserSignUp):
    """Signup endpoint"""
    user.email = user.email.lower()
    curr_user: User | None = get_user(request.app.db, user.email)
    if curr_user and not curr_user.is_anonymous:
        raise HTTPException(status_code=409, detail="User already exists")

    hash_password = get_password_hash(user.password)
    new_user = NewUser(name=user.name, email=user.email, hashed_password=hash_password)
    try:
        if curr_user:
            remove_session(request.app.db, curr_user.email)
            return link_anonymous_user(request.app.db, new_user)
        return add_user(request.app.db, new_user)
    except DataServiceException as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to create user") from err


@router.post("/login")
async def login(request: Request, user: UserLogin, response: Response) -> UserInfo:
    """Login endpoint"""
    try:
        user.email = user.email.lower()
        db_user = get_user(request.app.db, user.email)
        if db_user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if db_user.is_anonymous:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        old_session = get_session(request.app.db, user.email)
        if old_session:
            remove_session(request.app.db, old_session.token)
        session = create_session(request.app.db, user.email)
        response.set_cookie(
            key="Authorization",
            domain=request.app.config.DOMAIN,
            value=session.token,
            # secure=True,
            samesite="none",
            max_age=3600,
        )
        response.set_cookie(
            key="userId",
            domain=request.app.config.DOMAIN,
            value=str(db_user.id),
            # secure=True,
            samesite="none",
            max_age=3600,
        )
        return get_user_info(request.app.db, email=user.email)
    except DataServiceException as err:
        raise HTTPException(status_code=500, detail="Failed to login") from err


@router.delete("/logout")
async def logout(request: Request, response: Response, session_id: str = Depends(get_session_id)):
    """Logout endpoint"""
    try:
        remove_session(request.app.db, session_id)
        response.set_cookie(
            key="Authorization",
            domain=request.app.config.DOMAIN,
            value="",
            secure=True,
            samesite="none",
            httponly=True,
            max_age=0,
        )
        response.set_cookie(
            key="userId",
            domain=request.app.config.DOMAIN,
            value="",
            secure=True,
            samesite="none",
            httponly=True,
            max_age=0,
        )
        return {"message": "logged out"}
    except DataServiceException as err:
        raise HTTPException(status_code=500, detail="Failed to logout") from err


@router.get("/")
async def get_info(request: Request, session_id: str = Depends(get_session_id)):
    """Whoami endpoint"""
    try:
        session = get_session(request.app.db, session_id)
        if session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = get_user_info(request.app.db, email=session.user_email)
        return user
    except DataServiceException as err:
        raise HTTPException(status_code=500, detail="Failed to logout") from err


@router.get("/{user_id}", response_model=UserInfo)
def get_user_info_from_id(
    request: Request, user_id: int, session_id: str = Depends(get_session_id)
):
    """Get user endpoint"""
    try:
        session = get_session(request.app.db, session_id)
        if session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        user = get_user_info(request.app.db, user_id=user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except DataServiceException as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to get user") from err
    except Exception as err:
        raise HTTPException(status_code=500, detail="Failed to get user") from err


@router.delete("/{user_id}")
def remove_user(request: Request, user_id: int):
    """Get user endpoint"""
    try:
        delete_user(request.app.db, user_id=user_id)
        return {"message": "User deleted"}
    except DataServiceException as err:
        print(err)
        raise HTTPException(status_code=500, detail="Failed to get user") from err
