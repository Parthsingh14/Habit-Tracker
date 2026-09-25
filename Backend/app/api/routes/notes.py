from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_notes_service
from app.schemas.notes import MonthlyNotesResponse, MonthlyNotesUpdate
from app.services.notes_service import NotesService

router = APIRouter(prefix="/api/notes", tags=["notes"])

ServiceDep = Annotated[NotesService, Depends(get_notes_service)]


@router.get("", response_model=MonthlyNotesResponse)
async def get_notes(
    service: ServiceDep,
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=1, le=9999),
):
    return await service.get_notes(month, year)


@router.put("", response_model=MonthlyNotesResponse)
async def update_notes(payload: MonthlyNotesUpdate, service: ServiceDep):
    return await service.update_notes(payload.month, payload.year, payload.content)
