import os
from .base_parser import BaseParser
from ...core.config import settings

class ImageParser(BaseParser):
    def parse(self, file_path: str) -> str:
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return "[Thông báo: Cần cấu hình GEMINI_API_KEY để OCR tự động bằng AI Vision cho ảnh. Bạn có thể nhập text trực tiếp hoặc tải file TXT/PDF/DOCX]"
        
        try:
            import google.generativeai as genai
            from PIL import Image

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            img = Image.open(file_path)
            prompt = (
                "Bạn là chuyên gia OCR và xử lý tài liệu giáo dục. "
                "Hãy trích xuất toàn bộ văn bản, từ vựng, ngữ pháp, chữ Hán/Anh/Việt và bảng biểu trong hình ảnh này. "
                "Giữ nguyên cấu trúc dòng và các thông tin phát âm (Pinyin, IPA) nếu có."
            )
            response = model.generate_content([prompt, img])
            return response.text if response.text else "[Không nhận diện được chữ trong ảnh]"
        except Exception as e:
            return f"[Lỗi OCR ảnh với Gemini Vision: {str(e)}]"
