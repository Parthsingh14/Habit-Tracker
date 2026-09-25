import re

from pydantic import Field, field_validator

from app.schemas.common import MongoBaseModel, PyObjectId
from app.utils.date_utils import is_valid_iso_date

TIME_PATTERN = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


class SleepRecordCreate(MongoBaseModel):
    date: str = Field(..., description="ISO date, e.g. 2026-09-22")
    sleepStart: str | None = Field(None, description="HH:MM, 24h format")
    sleepEnd: str | None = Field(None, description="HH:MM, 24h format")
    durationMinutes: int = Field(..., gt=0, le=1440, description="Must be between 1 and 1440 minutes")

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: str) -> str:
        if not is_valid_iso_date(value):
            raise ValueError("date must be a valid ISO date (YYYY-MM-DD)")
        return value

    @field_validator("sleepStart", "sleepEnd")
    @classmethod
    def validate_time(cls, value: str | None) -> str | None:
        if value is not None and not TIME_PATTERN.match(value):
            raise ValueError("time must be in HH:MM 24-hour format")
        return value


class SleepRecordResponse(MongoBaseModel):
    id: PyObjectId = Field(alias="_id")
    date: str
    sleepStart: str | None = None
    sleepEnd: str | None = None
    durationMinutes: int
