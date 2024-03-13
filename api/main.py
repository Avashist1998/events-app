from typing import List

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import Base, engine, make_session

from config import Config
from routers.users import router as users
from routers.events import router as events
from routers.entries import router as entries


def get_origins(config: Config) -> List[str]:
    """Get the list of origins based on the mode of the application"""
    if config.MODE == "dev":
        origin = [
            "*",
            "http://localhost:8080",
            "http://localhost:5173",
            "http://localhost:4173",
        ]
    else:
        origin = [
            "https://70.139.132.129",
            "https://avashist.com",
            "https://events-app.avashist.com",
            "https://avashist1998.github.io",
        ]
    return origin


app_config: Config = Config()
origins = get_origins(app_config)

app = FastAPI()
app.config = app_config
Base.metadata.create_all(bind=engine)
app.db = make_session()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTPException"""
    return JSONResponse(
        content={"message": exc.detail},
        status_code=exc.status_code,
        headers=exc.headers,
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


app.include_router(users, tags=["users"], prefix="/users")
app.include_router(events, tags=["events"], prefix="/events")
app.include_router(entries, tags=["entries"], prefix="/entries")

if __name__ == "__main__":
    if app_config.DEBUG:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=app_config.PORT,
            log_level="info",
            reload=True
        )
    else:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=app_config.PORT,
            log_level="info",
            ssl_keyfile="key.pem",
            ssl_certfile="cert.pem",
        )
