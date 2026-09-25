from pydantic import Field, field_validator

from app.schemas.common import MongoBaseModel, PyObjectId
from app.utils.date_utils import is_valid_iso_date


class TrackerEntryResponse(MongoBaseModel):
    id: PyObjectId = Field(alias="_id")
    taskId: str
    date: str
    completed: bool


class ToggleEntryRequest(MongoBaseModel):
    taskId: str = Field(..., min_length=1)
    date: str = Field(..., description="ISO date, e.g. 2026-09-22")

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: str) -> str:
        if not is_valid_iso_date(value):
            raise ValueError("date must be a valid ISO date (YYYY-MM-DD)")
        return value


class MonthlyTrackerResponse(MongoBaseModel):
    month: int
    year: int
    daysInMonth: int
    entries: list[TrackerEntryResponse]
