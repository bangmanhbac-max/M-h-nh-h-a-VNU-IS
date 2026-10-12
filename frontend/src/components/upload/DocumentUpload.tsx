import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { uploadDocument, generateLearningContent, DocumentExtractResult } from '../../lib/api';
import { LearningPackage } from '../../types/learning_content';

interface DocumentUploadProps {
  onPackageGenerated: (pkg: LearningPackage) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onPackageGenerated }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [extractedDoc, setExtractedDoc] = useState<DocumentExtractResult | null>(null);
  const [customText, setCustomText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setIsExtracting(true);
    try {
      const result = await uploadDocument(file);
      setExtractedDoc(result);
      setCustomText(result.raw_text);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể đọc file';
      setError(errorMsg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateAI = async () => {
    const textToProcess = customText.trim();
    if (!textToProcess) {
      setError('Vui lòng tải lên tài liệu hoặc dán nội dung văn bản');
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      const userApiKey = localStorage.getItem('gemini_api_key') || undefined;
      const pkg = await generateLearningContent(
        textToProcess,
        extractedDoc?.filename || 'Tài liệu tùy chỉnh',
        userApiKey
      );
      onPackageGenerated(pkg);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi AI xử lý nội dung';
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-gray-700 hover:border-cyan-500/50 bg-[#161F30]/60 hover:bg-[#161F30]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          {isExtracting ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {isExtracting ? 'Đang trích xuất văn bản từ tài liệu...' : 'Kéo thả hoặc Nhấp để chọn tài liệu'}
        </h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
          Hỗ trợ đa định dạng: <span className="text-cyan-300 font-semibold">PDF</span>,{' '}
          <span className="text-blue-300 font-semibold">Word (DOCX)</span>,{' '}
          <span className="text-amber-300 font-semibold">Ảnh giáo trình (PNG/JPG)</span>, hoặc{' '}
          <span className="text-emerald-300 font-semibold">TXT</span>.
        </p>

        {/* Format Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
            <FileText className="w-3.5 h-3.5" /> PDF
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <FileText className="w-3.5 h-3.5" /> DOCX
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <ImageIcon className="w-3.5 h-3.5" /> Ảnh / OCR
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <FileText className="w-3.5 h-3.5" /> TXT / MD
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted / Direct Text Area */}
      <div className="bg-[#161F30] border border-gray-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-base">Nội Dung Kiến Thức Để AI Phân Tích</h4>
          </div>
          {extractedDoc && (
            <span className="text-xs text-gray-400 bg-[#0B0F19] px-3 py-1 rounded-lg border border-gray-800">
              {extractedDoc.filename} ({extractedDoc.char_count} ký tự)
            </span>
          )}
        </div>

        <textarea
          rows={6}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Dán bài học hoặc danh sách từ vựng tiếng Trung / Anh tại đây... (Ví dụ: 你好: Xin chào, 谢谢: Cảm ơn...)"
          className="w-full bg-[#0B0F19] border border-gray-700 focus:border-cyan-400 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-y transition"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            💡 AI sẽ tự động phân tích ngữ nghĩa, pinyin, tạo cử chỉ nét vẽ và sinh câu hỏi trắc nghiệm.
          </p>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating || !customText.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl text-sm transition shadow-lg shadow-purple-500/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Đang Xử Lý & Tạo Game...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Tạo Mini-Game Bằng AI Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
