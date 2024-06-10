"""This module contains the base configuration class for the application"""
from os import getenv


class Config:
    """Base configuration class"""
    MODE = getenv("MODE", 'prod')
    DEBUG = "True" == getenv('DEBUG', "False")
    PORT = int(getenv("PORT", "8000"))
    DOMAIN = getenv("DOMAIN", "events-app-api.avashist.com")
