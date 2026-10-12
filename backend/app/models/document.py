from typing import Optional, List
from pydantic import BaseModel
from .vocabulary import VocabularyDeck
from .quiz import QuizDeck

class DocumentExtractResult(BaseModel):
    filename: str
    file_type: str
    char_count: int
    raw_text: str
    preview_snippet: str

class LearningPackage(BaseModel):
    package_id: str
    title: str
    source_filename: Optional[str] = None
    created_at: str
    vocabulary_deck: VocabularyDeck
    quiz_deck: QuizDeck
