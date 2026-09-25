from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase


class NotesRepository:
    """Raw MongoDB access for the `monthly_notes` collection.
    One document per (month, year), upserted on save."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["monthly_notes"]

    async def find_by_month(self, month: int, year: int) -> dict | None:
        return await self.collection.find_one({"month": month, "year": year})

    async def upsert(self, month: int, year: int, content: str) -> dict:
        now = datetime.now(timezone.utc)
        existing = await self.find_by_month(month, year)

        if existing:
            await self.collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"content": content, "updatedAt": now}},
            )
            return await self.collection.find_one({"_id": existing["_id"]})

        doc = {
            "month": month,
            "year": year,
            "content": content,
            "createdAt": now,
            "updatedAt": now,
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc
