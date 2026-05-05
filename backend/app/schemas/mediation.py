from pydantic import BaseModel
from typing import Optional


class MediationCreate(BaseModel):
    mediation_type: str
    description: Optional[str] = None
    priority: Optional[str] = None
    role: Optional[str] = None
    status: str = "draft"