"""
Typed shapes of the raw documents stored in each MongoDB collection.

These are intentionally separate from app/schemas: schemas describe the
HTTP request/response contract, these TypedDicts describe what is
actually persisted (e.g. `isActive` on tasks is internal - it's never
part of the API contract). Repositories use these as type hints only;
Mongo itself stays schemaless.
"""
from datetime import datetime
from typing import TypedDict


class TaskDocument(TypedDict):
    name: str
    isActive: bool
    createdAt: datetime
    updatedAt: datetime


class TrackerEntryDocument(TypedDict):
    taskId: str
    date: str  # ISO "YYYY-MM-DD"
    completed: bool
    createdAt: datetime
    updatedAt: datetime


class MonthlyNotesDocument(TypedDict):
    month: int
    year: int
    content: str
    createdAt: datetime
    updatedAt: datetime


class SleepRecordDocument(TypedDict):
    date: str  # ISO "YYYY-MM-DD"
    sleepStart: str | None
    sleepEnd: str | None
    durationMinutes: int
    createdAt: datetime
    updatedAt: datetime
