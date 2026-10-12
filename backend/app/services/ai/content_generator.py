import uuid
from datetime import datetime
from typing import Optional
from .gemini_client import GeminiClient
from .prompt_templates import VOCABULARY_EXTRACTION_PROMPT, QUIZ_GENERATION_PROMPT
from ...models.vocabulary import VocabularyDeck, VocabularyItem
from ...models.quiz import QuizDeck, QuizItem
from ...models.document import LearningPackage

class ContentGenerator:
    def __init__(self, api_key: Optional[str] = None):
        self.client = GeminiClient(api_key=api_key)

    def generate_package(self, raw_text: str, filename: Optional[str] = None, user_api_key: Optional[str] = None) -> LearningPackage:
        client = GeminiClient(api_key=user_api_key) if user_api_key else self.client
        
        # Nếu có API key, gọi Gemini trực tiếp
        if client._configured:
            try:
                vocab_prompt = VOCABULARY_EXTRACTION_PROMPT.format(raw_text=raw_text[:12000])
                vocab_json = client.generate_json(vocab_prompt)
                
                quiz_prompt = QUIZ_GENERATION_PROMPT.format(raw_text=raw_text[:12000])
                quiz_json = client.generate_json(quiz_prompt)
                
                pkg_id = f"pkg-{uuid.uuid4().hex[:8]}"
                
                # Parse items
                vocab_items = []
                for idx, item in enumerate(vocab_json.get("items", [])):
                    vocab_items.append(VocabularyItem(
                        id=item.get("id", f"v{idx+1}"),
                        target_text=item.get("target_text", "Sample"),
                        phonetic=item.get("phonetic", ""),
                        type_target=item.get("type_target", item.get("target_text", "sample").lower()),
                        meaning=item.get("meaning", "Nghĩa từ vựng"),
                        example=item.get("example"),
                        difficulty=item.get("difficulty", 1),
                        stroke_gesture=item.get("stroke_gesture", "horizontal")
                    ))
                
                quiz_items = []
                for idx, item in enumerate(quiz_json.get("items", [])):
                    quiz_items.append(QuizItem(
                        id=item.get("id", f"q{idx+1}"),
                        question=item.get("question", "Câu hỏi mẫu?"),
                        options=item.get("options", ["A", "B", "C", "D"]),
                        correct_index=item.get("correct_index", 0),
                        explanation=item.get("explanation", ""),
                        points=item.get("points", 100)
                    ))
                    
                return LearningPackage(
                    package_id=pkg_id,
                    title=vocab_json.get("title", f"Bài học từ {filename or 'Tài liệu'}"),
                    source_filename=filename,
                    created_at=datetime.now().isoformat(),
                    vocabulary_deck=VocabularyDeck(
                        id=f"deck-{pkg_id}",
                        title=vocab_json.get("title", "Bộ từ vựng AI"),
                        description=vocab_json.get("description", "Trích xuất tự động bằng AI"),
                        target_language=vocab_json.get("target_language", "zh-CN"),
                        items=vocab_items
                    ),
                    quiz_deck=QuizDeck(
                        id=f"quiz-{pkg_id}",
                        title=quiz_json.get("title", "Đấu trường Quiz AI"),
                        description=quiz_json.get("description", "Câu hỏi trắc nghiệm tự động"),
                        items=quiz_items
                    )
                )
            except Exception as e:
                print(f"[ContentGenerator] Lỗi khi gọi Gemini: {e}. Chuyển sang trích xuất quy tắc thông minh.")

        # Fallback Parser: Trích xuất dựa trên phân tích dòng & từ ngữ thông minh
        return self._smart_rule_based_fallback(raw_text, filename)

    def _smart_rule_based_fallback(self, raw_text: str, filename: Optional[str]) -> LearningPackage:
        """Tự động phân tích văn bản theo dòng, từ, ký tự khi chưa có API key để người dùng vẫn trải nghiệm ngay."""
        pkg_id = f"pkg-{uuid.uuid4().hex[:8]}"
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        
        gestures = ["horizontal", "vertical", "slash", "backslash", "v_shape", "caret", "circle", "lightning"]
        vocab_items = []
        quiz_items = []
        
        for idx, line in enumerate(lines[:15]):
            # Kiểm tra xem có dấu phân tách như -, :, =, |
            parts = [p.strip() for p in line.replace(":", "-").replace("=", "-").replace("|", "-").split("-")]
            if len(parts) >= 2:
                target = parts[0]
                meaning = parts[1]
            else:
                target = line[:20]
                meaning = "Ý nghĩa trong bài học"
                
            # Loại bỏ ký tự đặc biệt cho type_target
            type_target = "".join([c for c in target.lower() if c.isalnum()]) or f"word{idx+1}"
            
            vocab_items.append(VocabularyItem(
                id=f"v-{idx+1}",
                target_text=target,
                phonetic=f"/{type_target}/",
                type_target=type_target,
                meaning=meaning,
                example=f"Ví dụ: {target} - {meaning}",
                difficulty=1 + (idx % 3),
                stroke_gesture=gestures[idx % len(gestures)]
            ))
            
        if not vocab_items:
            vocab_items = [
                VocabularyItem(
                    id="v-1",
                    target_text="你好",
                    phonetic="nǐ hǎo",
                    type_target="nihao",
                    meaning="Xin chào",
                    example="你好！很高兴认识你。",
                    difficulty=1,
                    stroke_gesture="horizontal"
                )
            ]

        # Tạo Quiz từ vocab_items
        for idx, v in enumerate(vocab_items[:8]):
            other_meanings = [item.meaning for item in vocab_items if item.id != v.id]
            while len(other_meanings) < 3:
                other_meanings.append(f"Ý nghĩa khác {len(other_meanings)+1}")
            
            opts = [v.meaning, other_meanings[0], other_meanings[1], other_meanings[2]]
            import random
            # random shuffle but keep correct index
            correct_meaning = opts[0]
            random.shuffle(opts)
            c_idx = opts.index(correct_meaning)
            
            quiz_items.append(QuizItem(
                id=f"q-{idx+1}",
                question=f"Từ '{v.target_text}' ({v.phonetic}) có nghĩa là gì?",
                options=[f"A. {opts[0]}", f"B. {opts[1]}", f"C. {opts[2]}", f"D. {opts[3]}"],
                correct_index=c_idx,
                explanation=f"Chính xác! '{v.target_text}' có nghĩa là '{v.meaning}'.",
                points=100
            ))

        title = f"Bài học: {filename or 'Tài liệu tải lên'}"
        return LearningPackage(
            package_id=pkg_id,
            title=title,
            source_filename=filename,
            created_at=datetime.now().isoformat(),
            vocabulary_deck=VocabularyDeck(
                id=f"deck-{pkg_id}",
                title=f"Bộ từ vựng {filename or 'Tài liệu'}",
                description="Bộ thẻ từ vựng trích xuất tự động từ văn bản của bạn",
                target_language="auto",
                items=vocab_items
            ),
            quiz_deck=QuizDeck(
                id=f"quiz-{pkg_id}",
                title=f"Đấu trường trắc nghiệm: {filename or 'Tài liệu'}",
                description="Bộ câu hỏi phản xạ tốc độ",
                items=quiz_items
            )
        )
