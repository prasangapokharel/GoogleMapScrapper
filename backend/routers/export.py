from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime

from backend.schemas.business import BusinessModel
from backend.utils.cleaner import clean_and_deduplicate
from backend.services.csvService import generate_csv_bytes


class ExportRequest(BaseModel):
    businesses: List[dict]


router = APIRouter(prefix="/export", tags=["export"])


@router.post("/csv")
async def export_to_csv(request: ExportRequest):
    try:
        businesses = request.businesses

        if not businesses:
            raise HTTPException(status_code=400, detail="No businesses provided")

        cleaned_businesses = clean_and_deduplicate(businesses)

        csv_bytes = generate_csv_bytes(cleaned_businesses)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"business_data_{timestamp}.csv"

        return {
            "status": "success",
            "count": len(cleaned_businesses),
            "csv_data": csv_bytes.decode("utf-8-sig"),
            "filename": filename,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
