"""
Dependency wiring: Routes -> Services -> Repositories -> MongoDB.

Centralising the `Depends(...)` factories here keeps every route file
focused purely on HTTP concerns.
"""
from typing import Annotated

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.connection import get_database
from app.repositories.notes_repository import NotesRepository
from app.repositories.sleep_repository import SleepRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.tracker_repository import TrackerRepository
from app.services.notes_service import NotesService
from app.services.sleep_service import SleepService
from app.services.task_service import TaskService
from app.services.tracker_service import TrackerService

DbDep = Annotated[AsyncIOMotorDatabase, Depends(get_database)]


def get_task_service(db: DbDep) -> TaskService:
    return TaskService(TaskRepository(db))


def get_tracker_service(db: DbDep) -> TrackerService:
    return TrackerService(TrackerRepository(db), TaskRepository(db))


def get_sleep_service(db: DbDep) -> SleepService:
    return SleepService(SleepRepository(db))


def get_notes_service(db: DbDep) -> NotesService:
    return NotesService(NotesRepository(db))
