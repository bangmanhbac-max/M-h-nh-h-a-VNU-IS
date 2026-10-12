VOCABULARY_EXTRACTION_PROMPT = """
Bạn là một AI chuyên gia giáo dục và trò chơi hóa (gamification).
Nhiệm vụ của bạn là phân tích tài liệu học tập được cung cấp và tạo ra một bộ từ vựng & kiến thức tối ưu cho các mini-game (Bắn gà luyện gõ phím, Game vẽ nét cử chỉ phép thuật Magic Touch, và Đấu trường trắc nghiệm).

TÀI LIỆU NGUỒN:
\"\"\"
{raw_text}
\"\"\"

YÊU CẦU ĐẦU RA (JSON FORMAT):
Hãy trích xuất/tạo ra từ 5 đến 20 mục từ vựng/khái niệm quan trọng nhất theo đúng định dạng JSON:
{{
  "title": "Tiêu đề ngắn gọn của bài học",
  "description": "Mô tả nội dung bài học",
  "target_language": "zh-CN hoặc en hoặc ja hoặc vi",
  "items": [
    {{
      "id": "v1",
      "target_text": "Từ hoặc ký tự chính (vd: 你好, Computer, 谢谢, 苹果)",
      "phonetic": "Cách phát âm / Pinyin / IPA (vd: nǐ hǎo, kəmˈpjuː.tər, xièxie)",
      "type_target": "Chuỗi ký tự không dấu hoặc gõ bàn phím (vd: nihao, computer, xiexie, pingguo)",
      "meaning": "Nghĩa tiếng Việt ngắn gọn (vd: Xin chào, Máy vi tính, Cảm ơn, Quả táo)",
      "example": "Câu ví dụ ngắn nếu có",
      "difficulty": 1,
      "stroke_gesture": "Mã cử chỉ cho game vẽ nét, chọn 1 trong các giá trị: 'horizontal' (nét ngang -), 'vertical' (nét sổ |), 'slash' (nét phẩy /), 'backslash' (nét mác \\), 'v_shape' (nét V), 'caret' (nét mũ ^), 'circle' (hình tròn O), 'lightning' (hình tia chớp Z)"
    }}
  ]
}}

LƯU Ý QUAN TRỌNG:
- Chỉ trả về duy nhất chuỗi JSON hợp lệ, không bọc markdown thừa ngoài JSON hoặc trả về JSON thuần túy.
- `type_target` là chuỗi để người chơi gõ trên bàn phím (chữ thường, không dấu tiếng Việt, không dấu thanh Pinyin).
- `stroke_gesture` phân bổ đa dạng giữa các từ để game vẽ thú vị hơn.
"""

QUIZ_GENERATION_PROMPT = """
Bạn là một AI chuyên gia sư phạm và thiết kế game trắc nghiệm.
Dựa trên tài liệu được cung cấp, hãy tạo ra 5-10 câu hỏi trắc nghiệm chất lượng cao, hấp dẫn và phản ánh đúng kiến thức cốt lõi.

TÀI LIỆU NGUỒN:
\"\"\"
{raw_text}
\"\"\"

YÊU CẦU ĐẦU RA (JSON FORMAT):
{{
  "title": "Tên bộ câu hỏi trắc nghiệm",
  "description": "Mô tả ngắn",
  "items": [
    {{
      "id": "q1",
      "question": "Nội dung câu hỏi trắc nghiệm (vd: Từ '你好' trong tiếng Trung có nghĩa là gì?)",
      "options": [
        "A. Tạm biệt",
        "B. Xin chào",
        "C. Cảm ơn",
        "D. Xin lỗi"
      ],
      "correct_index": 1,
      "explanation": "Giải thích chi tiết tại sao B đúng ('你好' phiên âm pinyin là nǐ hǎo nghĩa là Xin chào).",
      "points": 100
    }}
  ]
}}

LƯU Ý:
- Chỉ trả về chuỗi JSON hợp lệ.
- 4 đáp án đa dạng, không được để lộ đáp án quá dễ.
- `correct_index` là số nguyên từ 0 đến 3 (tương ứng vị trí trong mảng `options`).
"""
