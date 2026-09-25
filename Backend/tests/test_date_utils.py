import pytest

from app.utils.date_utils import get_days_in_month, get_month_date_range, is_valid_iso_date
from app.utils.exceptions import ValidationException


def test_get_days_in_month_regular():
    assert get_days_in_month(9, 2026) == 30  # September
    assert get_days_in_month(1, 2026) == 31  # January


def test_get_days_in_month_leap_year():
    assert get_days_in_month(2, 2024) == 29  # 2024 is a leap year
    assert get_days_in_month(2, 2026) == 28  # 2026 is not


def test_get_days_in_month_invalid_month_raises():
    with pytest.raises(ValidationException):
        get_days_in_month(13, 2026)


def test_get_month_date_range():
    start, end = get_month_date_range(9, 2026)
    assert start == "2026-09-01"
    assert end == "2026-09-30"


def test_get_month_date_range_leap_february():
    start, end = get_month_date_range(2, 2024)
    assert end == "2024-02-29"


def test_is_valid_iso_date():
    assert is_valid_iso_date("2026-09-22") is True
    assert is_valid_iso_date("2026-13-01") is False
    assert is_valid_iso_date("not-a-date") is False
