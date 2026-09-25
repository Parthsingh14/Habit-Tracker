from app.repositories.task_repository import TaskRepository
from app.repositories.tracker_repository import TrackerRepository
from app.utils.date_utils import get_days_in_month, get_month_date_range, is_valid_iso_date
from app.utils.exceptions import NotFoundException, ValidationException


class TrackerService:
    def __init__(self, tracker_repo: TrackerRepository, task_repo: TaskRepository):
        self.tracker_repo = tracker_repo
        self.task_repo = task_repo

    async def get_monthly_tracker(self, month: int, year: int) -> dict:
        days_in_month = get_days_in_month(month, year)  # validates month/year too
        start_date, end_date = get_month_date_range(month, year)
        entries = await self.tracker_repo.find_for_range(start_date, end_date)
        return {
            "month": month,
            "year": year,
            "daysInMonth": days_in_month,
            "entries": entries,
        }

    async def toggle_entry(self, task_id: str, date: str) -> dict:
        if not is_valid_iso_date(date):
            raise ValidationException("date must be a valid ISO date (YYYY-MM-DD)")

        task = await self.task_repo.find_by_id(task_id)
        if not task or not task.get("isActive", True):
            raise NotFoundException(f"Task '{task_id}' not found")

        return await self.tracker_repo.toggle(task_id, date)
