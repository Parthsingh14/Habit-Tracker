from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase


class TrackerRepository:
    """Raw MongoDB access for the `tracker_entries` collection.

    Each (task, date) cell is its own tiny document rather than the whole
    month being one giant document - toggling a single cell is therefore
    a cheap, targeted upsert instead of a rewrite of a large document."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["tracker_entries"]

    async def find_for_range(self, start_date: str, end_date: str) -> list[dict]:
        cursor = self.collection.find(
            {"date": {"$gte": start_date, "$lte": end_date}}
        )
        return await cursor.to_list(length=None)

    async def toggle(self, task_id: str, date: str) -> dict:
        existing = await self.collection.find_one({"taskId": task_id, "date": date})
        now = datetime.now(timezone.utc)

        if existing:
            new_completed = not existing["completed"]
            await self.collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"completed": new_completed, "updatedAt": now}},
            )
            existing["completed"] = new_completed
            return existing

        doc = {
            "taskId": task_id,
            "date": date,
            "completed": True,
            "createdAt": now,
            "updatedAt": now,
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def delete_for_task(self, task_id: str) -> None:
        await self.collection.delete_many({"taskId": task_id})
