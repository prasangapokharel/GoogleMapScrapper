from pydantic import BaseModel, Field
from typing import Optional


class BusinessModel(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    google_maps_url: Optional[str] = None
    address: Optional[str] = None
    rating: Optional[float] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True
