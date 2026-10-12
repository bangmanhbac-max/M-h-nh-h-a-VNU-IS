from abc import ABC, abstractmethod

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path: str) -> str:
        """Trích xuất văn bản từ tệp tin đã cho."""
        pass
