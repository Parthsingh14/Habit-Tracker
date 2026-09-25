from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_sleep_service
from app.schemas.sleep import SleepRecordCreate, SleepRecordResponse
from app.services.sleep_service import SleepService

router = APIRouter(prefix="/api/sleep", tags=["sleep"])

ServiceDep = Annotated[SleepService, Depends(get_sleep_service)]


@router.get("", response_model=list[SleepRecordResponse])
async def get_recent_sleep(
    service: ServiceDep,
    days: int = Query(15, ge=1, le=90, description="How many trailing days to return"),
):
    return await service.get_recent(days)


@router.post("", response_model=SleepRecordResponse, status_code=status.HTTP_201_CREATED)
async def save_sleep(payload: SleepRecordCreate, service: ServiceDep):
    return await service.save_sleep(payload)
