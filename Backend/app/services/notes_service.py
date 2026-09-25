from datetime import datetime, timezone

from app.repositories.notes_repository import NotesRepository
from app.utils.date_utils import validate_month_year


class NotesService:
    def __init__(self, notes_repo: NotesRepository):
        self.notes_repo = notes_repo

    async def get_notes(self, month: int, year: int) -> dict:
        validate_month_year(month, year)
        existing = await self.notes_repo.find_by_month(month, year)
        if existing:
            return existing
        # No notes saved yet for this month - return a well-formed empty
        # shape rather than a 404, since "no notes yet" is the normal
        # state for a month the user hasn't written in.
        return {
            "_id": f"draft-{year}-{month}",
            "month": month,
            "year": year,
            "content": "",
            "updatedAt": datetime.now(timezone.utc),
        }

    async def update_notes(self, month: int, year: int, content: str) -> dict:
        validate_month_year(month, year)
        return await self.notes_repo.upsert(month, year, content)
