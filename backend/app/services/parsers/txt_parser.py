from .base_parser import BaseParser

class TextParser(BaseParser):
    def parse(self, file_path: str) -> str:
        encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1252', 'gb2312', 'gbk']
        for enc in encodings:
            try:
                with open(file_path, 'r', encoding=enc) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
            except Exception as e:
                return f"[Lỗi khi đọc file TXT: {str(e)}]"
        return "[Lỗi: Không thể giải mã định dạng file văn bản này]"
