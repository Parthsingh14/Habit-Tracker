from datetime import datetime

from pydantic import Field

from app.schemas.common import MongoBaseModel, PyObjectId


class MonthlyNotesUpdate(MongoBaseModel):
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=1, le=9999)
    content: str = Field("", max_length=10000)


class MonthlyNotesResponse(MongoBaseModel):
    id: PyObjectId = Field(alias="_id")
    month: int
    year: int
    content: str
    updatedAt: datetime
