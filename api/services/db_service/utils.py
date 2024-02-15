"""Database interface"""
from typing import List
from abc import ABC, abstractmethod

from db.models import Event, Entry

class DataServiceException(Exception):
    """Data service exception"""
    def __init__(self, message: str):
        """Constructor"""
        self.message = message
