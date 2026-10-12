from typing import List
from fastapi import APIRouter, HTTPException
from ...models.document import LearningPackage
from ...services.sample_data import SAMPLE_PACKAGES

router = APIRouter()

# In-memory storage for session packages
SAVED_PACKAGES = dict(SAMPLE_PACKAGES)

@router.get("/decks", response_model=List[LearningPackage])
async def list_decks():
    return list(SAVED_PACKAGES.values())

@router.get("/decks/{deck_id}", response_model=LearningPackage)
async def get_deck(deck_id: str):
    if deck_id in SAVED_PACKAGES:
        return SAVED_PACKAGES[deck_id]
    raise HTTPException(status_code=404, detail="Không tìm thấy bộ từ vựng")

@router.post("/decks", response_model=LearningPackage)
async def save_deck(package: LearningPackage):
    SAVED_PACKAGES[package.package_id] = package
    return package
