import os
import json
import re
from typing import Optional, Dict, Any
from ...core.config import settings

class GeminiClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self._configured = False
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._configured = True
            except Exception as e:
                print(f"[GeminiClient] Configuration warning: {e}")

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        if not self._configured:
            raise ValueError("GEMINI_API_KEY chưa được thiết lập!")

        import google.generativeai as genai
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean potential markdown wrapping if returned
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        return json.loads(text)
