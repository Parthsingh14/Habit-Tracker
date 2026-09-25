from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.utils.object_id import to_object_id


class TaskRepository:
    """All raw MongoDB access for the `tasks` collection lives here.
    Nothing outside this class should touch `db["tasks"]` directly."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["tasks"]

    async def find_all_active(self) -> list[dict]:
        cursor = self.collection.find({"isActive": True}).sort("createdAt", 1)
        return await cursor.to_list(length=None)

    async def find_by_id(self, task_id: str) -> dict | None:
        return await self.collection.find_one({"_id": to_object_id(task_id)})

    async def create(self, name: str) -> dict:
        now = datetime.now(timezone.utc)
        doc = {"name": name, "isActive": True, "createdAt": now, "updatedAt": now}
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def update(self, task_id: str, name: str) -> dict | None:
        now = datetime.now(timezone.utc)
        await self.collection.update_one(
            {"_id": to_object_id(task_id)},
            {"$set": {"name": name, "updatedAt": now}},
        )
        return await self.find_by_id(task_id)

    async def soft_delete(self, task_id: str) -> bool:
        """Tasks are soft-deleted (isActive=False) rather than removed so
        that historical tracker_entries referencing this task are never
        orphaned or silently lost - they simply stop appearing in new
        month views because the task no longer shows in the active list."""
        result = await self.collection.update_one(
            {"_id": to_object_id(task_id)},
            {"$set": {"isActive": False, "updatedAt": datetime.now(timezone.utc)}},
        )
        return result.modified_count > 0
