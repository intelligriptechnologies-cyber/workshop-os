from uuid import UUID

import pytest
from fastapi import HTTPException

from app.materials import MaterialCommand, MaterialReservationInput, _reservation


def test_material_command_requires_a_positive_quantity() -> None:
    with pytest.raises(Exception):
        MaterialCommand(quantity=0)
    assert MaterialCommand(quantity=1.25, reason="Returned unopened").quantity == 1.25


def test_reservation_projection_keeps_reservation_and_on_job_quantities_distinct() -> None:
    row = {
        "id": 7, "job_card_id": 11, "item_id": 13, "branch_id": UUID("00000000-0000-4000-8000-000000000001"),
        "reserved_qty": 10, "status": "PARTIALLY_ISSUED", "note": "service kit", "created_at": "now", "updated_at": "now",
    }
    view = _reservation(row, {"issued": 6, "returned": 2, "wasted": 1, "released": 1, "reversed": 0.5}, available_to_reserve=4)
    assert view["availableToIssue"] == 3
    assert view["onJobQty"] == 2.5
    assert view["returnedQty"] == 2
    assert view["availableToReserve"] == 4


def test_reservation_input_uses_camel_case_wire_fields() -> None:
    parsed = MaterialReservationInput(jobId=4, itemId=9, quantity=2, note="Oil filter")
    assert parsed.job_id == 4 and parsed.item_id == 9
