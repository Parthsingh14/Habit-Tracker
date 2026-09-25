from app.repositories.sleep_repository import SleepRepository
from app.schemas.sleep import SleepRecordCreate


class SleepService:
    def __init__(self, sleep_repo: SleepRepository):
        self.sleep_repo = sleep_repo

    async def get_recent(self, days: int) -> list[dict]:
        return await self.sleep_repo.find_recent(days)

    async def save_sleep(self, payload: SleepRecordCreate) -> dict:
        # Field-level validation (date format, 0 < duration <= 24h, HH:MM
        # times) is already enforced by the Pydantic schema - the service
        # only needs to persist it.
        return await self.sleep_repo.upsert(
            date=payload.date,
            sleep_start=payload.sleepStart,
            sleep_end=payload.sleepEnd,
            duration_minutes=payload.durationMinutes,
        )
