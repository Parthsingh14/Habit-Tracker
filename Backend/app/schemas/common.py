"""
Shared schema building blocks.

MongoDB's ObjectId isn't JSON-serialisable on its own, so every response
schema stores it as a plain string (`PyObjectId`) via a BeforeValidator -
this is the pattern FastAPI's own Mongo example recommends for Pydantic v2.
"""
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict

PyObjectId = Annotated[str, BeforeValidator(str)]


class MongoBaseModel(BaseModel):
    """Base for any schema that is read directly from a Mongo document."""

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
