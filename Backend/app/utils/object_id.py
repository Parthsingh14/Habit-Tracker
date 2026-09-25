"""
Safe ObjectId conversion.

Keeps bson.errors.InvalidId from leaking out of repositories as a 500 -
an invalid id in a URL/body is a client error (422), not a server error.
"""
from bson import ObjectId
from bson.errors import InvalidId

from app.utils.exceptions import ValidationException


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise ValidationException(f"'{id_str}' is not a valid id")
