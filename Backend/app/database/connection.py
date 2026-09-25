"""
MongoDB connection lifecycle.

A single AsyncIOMotorClient is created on application startup and reused
for every request. Indexes are created once at startup so that:
  - toggling a tracker cell is a fast upsert (unique index on taskId+date)
  - notes/sleep lookups by date are fast
  - duplicate (month, year) notes documents can never be created
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

settings = get_settings()


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


mongodb = MongoDB()


async def connect_to_mongo() -> None:
    mongodb.client = AsyncIOMotorClient(settings.mongodb_uri)
    mongodb.db = mongodb.client[settings.database_name]
    await _ensure_indexes(mongodb.db)


async def close_mongo_connection() -> None:
    if mongodb.client:
        mongodb.client.close()


async def _ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    await db["tasks"].create_index("isActive")
    await db["tracker_entries"].create_index(
        [("taskId", 1), ("date", 1)], unique=True
    )
    await db["tracker_entries"].create_index("date")
    await db["monthly_notes"].create_index(
        [("year", 1), ("month", 1)], unique=True
    )
    await db["sleep_records"].create_index("date", unique=True)


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency - returns the shared database instance."""
    return mongodb.db
