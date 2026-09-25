from datetime import datetime

from pydantic import Field

from app.schemas.common import MongoBaseModel, PyObjectId


class TaskCreate(MongoBaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class TaskUpdate(MongoBaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class TaskResponse(MongoBaseModel):
    id: PyObjectId = Field(validation_alias="_id")
    name: str
    createdAt: datetime
    updatedAt: datetime
