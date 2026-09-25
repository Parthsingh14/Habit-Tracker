"""
Calendar helpers shared by the tracker and notes services.

Centralising this logic means leap years, 30 vs 31 day months, etc. are
handled in exactly one place instead of being re-derived per feature.
"""
import calendar
from datetime import date

from app.utils.exceptions import ValidationException


def validate_month_year(month: int, year: int) -> None:
    if not (1 <= month <= 12):
        raise ValidationException(f"Month must be between 1 and 12, got {month}")
    if not (1 <= year <= 9999):
        raise ValidationException(f"Year {year} is out of range")


def get_days_in_month(month: int, year: int) -> int:
    validate_month_year(month, year)
    return calendar.monthrange(year, month)[1]


def get_month_date_range(month: int, year: int) -> tuple[str, str]:
    """Returns (first_day_iso, last_day_iso) for the given month/year."""
    days = get_days_in_month(month, year)
    start = date(year, month, 1).isoformat()
    end = date(year, month, days).isoformat()
    return start, end


def is_valid_iso_date(value: str) -> bool:
    try:
        date.fromisoformat(value)
        return True
    except ValueError:
        return False
