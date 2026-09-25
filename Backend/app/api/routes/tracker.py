from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_tracker_service
from app.schemas.tracker import MonthlyTrackerResponse, ToggleEntryRequest, TrackerEntryResponse
from app.services.tracker_service import TrackerService

router = APIRouter(prefix="/api/tracker", tags=["tracker"])

ServiceDep = Annotated[TrackerService, Depends(get_tracker_service)]


@router.get("", response_model=MonthlyTrackerResponse)
async def get_monthly_tracker(
    service: ServiceDep,
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=1, le=9999),
):
    return await service.get_monthly_tracker(month, year)


@router.post("/toggle", response_model=TrackerEntryResponse)
async def toggle_entry(payload: ToggleEntryRequest, service: ServiceDep):
    return await service.toggle_entry(payload.taskId, payload.date)
