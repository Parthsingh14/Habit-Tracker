from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import get_task_service
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

ServiceDep = Annotated[TaskService, Depends(get_task_service)]


@router.get("", response_model=list[TaskResponse])
async def list_tasks(service: ServiceDep):
    return await service.list_tasks()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, service: ServiceDep):
    return await service.create_task(payload.name)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, payload: TaskUpdate, service: ServiceDep):
    return await service.update_task(task_id, payload.name)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, service: ServiceDep):
    await service.delete_task(task_id)
