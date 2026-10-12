import { LearningPackage } from '../types/learning_content';

const API_BASE = '/api/v1';

export interface DocumentExtractResult {
  filename: string;
  file_type: string;
  char_count: number;
  raw_text: string;
  preview_snippet: string;
}

export async function uploadDocument(file: File): Promise<DocumentExtractResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Lỗi tải file lên máy chủ' }));
    throw new Error(errorData.detail || 'Lỗi tải file');
  }

  return res.json();
}

export async function generateLearningContent(rawText: string, filename?: string, apiKey?: string): Promise<LearningPackage> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw_text: rawText,
      filename,
      api_key: apiKey || undefined,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Lỗi khi AI tạo sinh nội dung' }));
    throw new Error(errorData.detail || 'Lỗi AI');
  }

  return res.json();
}

export async function fetchDecks(): Promise<LearningPackage[]> {
  const res = await fetch(`${API_BASE}/decks`);
  if (!res.ok) {
    throw new Error('Không thể tải danh sách bài học');
  }
  return res.json();
}

export async function saveCustomDeck(pkg: LearningPackage): Promise<LearningPackage> {
  const res = await fetch(`${API_BASE}/decks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pkg),
  });
  if (!res.ok) {
    throw new Error('Không thể lưu bài học');
  }
  return res.json();
}
