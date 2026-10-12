from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from ...services.ai.content_generator import ContentGenerator
from ...models.document import LearningPackage

router = APIRouter()
generator = ContentGenerator()

class GenerateRequest(BaseModel):
    raw_text: str
    filename: Optional[str] = None
    api_key: Optional[str] = None

@router.post("/generate", response_model=LearningPackage)
async def generate_learning_content(request: GenerateRequest):
    package = generator.generate_package(
        raw_text=request.raw_text,
        filename=request.filename,
        user_api_key=request.api_key
    )
    return package
