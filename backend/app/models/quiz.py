from typing import List, Optional
from pydantic import BaseModel, Field

class QuizItem(BaseModel):
    id: str = Field(..., description="Mã định danh câu hỏi")
    question: str = Field(..., description="Nội dung câu hỏi trắc nghiệm")
    options: List[str] = Field(..., description="4 lựa chọn A, B, C, D")
    correct_index: int = Field(..., ge=0, le=3, description="Vị trí đáp án đúng (0-3)")
    explanation: Optional[str] = Field(None, description="Giải thích chi tiết tại sao đúng")
    points: int = Field(100, description="Điểm cơ bản của câu hỏi")

class QuizDeck(BaseModel):
    id: str
    title: str
    description: str
    items: List[QuizItem]
