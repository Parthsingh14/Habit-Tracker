from app.repositories.task_repository import TaskRepository
from app.utils.exceptions import NotFoundException


class TaskService:
    def __init__(self, task_repo: TaskRepository):
        self.task_repo = task_repo

    async def list_tasks(self) -> list[dict]:
        return await self.task_repo.find_all_active()

    async def create_task(self, name: str) -> dict:
        return await self.task_repo.create(name.strip())

    async def update_task(self, task_id: str, name: str) -> dict:
        existing = await self.task_repo.find_by_id(task_id)
        if not existing or not existing.get("isActive", True):
            raise NotFoundException(f"Task '{task_id}' not found")
        updated = await self.task_repo.update(task_id, name.strip())
        return updated

    async def delete_task(self, task_id: str) -> None:
        existing = await self.task_repo.find_by_id(task_id)
        if not existing or not existing.get("isActive", True):
            raise NotFoundException(f"Task '{task_id}' not found")
        await self.task_repo.soft_delete(task_id)
        # Historical entries are kept in the DB for data integrity, but a
        # deleted task should not still light up on the grid, so future
        # tracker reads simply won't include it (tasks come from the
        # active-only list); no cascade delete needed here.
