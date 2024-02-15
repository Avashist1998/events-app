from os import getenv
from sqlalchemy.orm import  sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLITE_DB_PATH = getenv("SQLITE_DB_PATH", "database.db")
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    "sqlite:///"+ SQLITE_DB_PATH, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
make_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)