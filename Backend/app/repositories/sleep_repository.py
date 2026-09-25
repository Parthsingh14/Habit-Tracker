from datetime import datetime, timedelta, timezone, date as date_cls

from motor.motor_asyncio import AsyncIOMotorDatabase


class SleepRepository:
    """Raw MongoDB access for the `sleep_records` collection.
    One document per date - saving today's sleep again upserts in place."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["sleep_records"]

    async def find_recent(self, days: int) -> list[dict]:
        end = date_cls.today()
        start = end - timedelta(days=days - 1)
        cursor = self.collection.find(
            {"date": {"$gte": start.isoformat(), "$lte": end.isoformat()}}
        ).sort("date", 1)
        return await cursor.to_list(length=None)

    async def upsert(
        self,
        date: str,
        sleep_start: str | None,
        sleep_end: str | None,
        duration_minutes: int,
    ) -> dict:
        now = datetime.now(timezone.utc)
        existing = await self.collection.find_one({"date": date})

        payload = {
            "date": date,
            "sleepStart": sleep_start,
            "sleepEnd": sleep_end,
            "durationMinutes": duration_minutes,
            "updatedAt": now,
        }

        if existing:
            await self.collection.update_one({"_id": existing["_id"]}, {"$set": payload})
            return await self.collection.find_one({"_id": existing["_id"]})

        payload["createdAt"] = now
        result = await self.collection.insert_one(payload)
        payload["_id"] = result.inserted_id
        return payload
