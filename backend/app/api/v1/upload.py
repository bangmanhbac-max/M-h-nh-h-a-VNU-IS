import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from ...core.config import settings
from ...models.document import DocumentExtractResult
from ...services.parsers.pdf_parser import PDFParser
from ...services.parsers.docx_parser import DocxParser
from ...services.parsers.txt_parser import TextParser
from ...services.parsers.image_parser import ImageParser

router = APIRouter()

pdf_parser = PDFParser()
docx_parser = DocxParser()
txt_parser = TextParser()
image_parser = ImageParser()

@router.post("/upload", response_model=DocumentExtractResult)
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_file"
    ext = os.path.splitext(filename)[1].lower()
    
    allowed_exts = [".pdf", ".docx", ".doc", ".txt", ".md", ".png", ".jpg", ".jpeg", ".webp"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400, 
            detail=f"Định dạng {ext} không được hỗ trợ. Vui lòng tải lên PDF, DOCX, TXT hoặc ảnh (PNG/JPG)."
        )
        
    temp_path = os.path.join(settings.UPLOAD_DIR, filename)
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        if ext == ".pdf":
            raw_text = pdf_parser.parse(temp_path)
        elif ext in [".docx", ".doc"]:
            raw_text = docx_parser.parse(temp_path)
        elif ext in [".txt", ".md"]:
            raw_text = txt_parser.parse(temp_path)
        elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
            raw_text = image_parser.parse(temp_path)
        else:
            raw_text = ""
            
        snippet = raw_text[:300] + ("..." if len(raw_text) > 300 else "")
        
        return DocumentExtractResult(
            filename=filename,
            file_type=ext[1:],
            char_count=len(raw_text),
            raw_text=raw_text,
            preview_snippet=snippet
        )
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
