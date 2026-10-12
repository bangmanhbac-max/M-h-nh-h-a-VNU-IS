from typing import List, Optional
from pydantic import BaseModel, Field

class VocabularyItem(BaseModel):
    id: str = Field(..., description="Mã định danh duy nhất")
    target_text: str = Field(..., description="Từ hoặc ký tự chính (vd: 你好, Apple)")
    phonetic: str = Field(..., description="Cách phát âm / Pinyin / IPA (vd: nǐ hǎo, /ˈæp.əl/)")
    type_target: str = Field(..., description="Chuỗi ký tự không dấu hoặc gõ bàn phím (vd: nihao, apple)")
    meaning: str = Field(..., description="Ý nghĩa tiếng Việt")
    example: Optional[str] = Field(None, description="Ví dụ minh họa")
    difficulty: int = Field(1, ge=1, le=5, description="Độ khó từ 1 đến 5")
    stroke_gesture: str = Field(
        "horizontal", 
        description="Mẫu cử chỉ hình vẽ tương ứng (horizontal, vertical, slash, backslash, v_shape, caret, circle, lightning)"
    )

class VocabularyDeck(BaseModel):
    id: str
    title: str
    description: str
    target_language: str = "zh-CN" # zh-CN, en, ja, etc.
    items: List[VocabularyItem]
