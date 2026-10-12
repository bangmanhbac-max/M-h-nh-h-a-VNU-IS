from .base_parser import BaseParser

class PDFParser(BaseParser):
    def parse(self, file_path: str) -> str:
        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            extracted_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    extracted_text.append(text.strip())
            return "\n\n".join(extracted_text)
        except Exception as e:
            return f"[Lỗi khi đọc file PDF: {str(e)}]"
