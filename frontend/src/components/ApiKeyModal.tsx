import React, { useState, useEffect } from 'react';
import { Key, Check, X, ShieldAlert } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('gemini_api_key') || '';
    setApiKey(existing);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#161F30] border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-cyan-950">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-game tracking-wider">Cấu Hình Gemini API</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300">
            Nhập <span className="text-cyan-400 font-semibold">Gemini API Key</span> của bạn để sử dụng trí tuệ nhân tạo tạo sinh trích xuất từ vựng, tạo câu hỏi và OCR ảnh không giới hạn.
          </p>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#0B0F19] border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>Nếu bạn chưa có API Key, hệ thống vẫn cung cấp sẵn các bộ dữ liệu mẫu phong phú và bộ phân tích thông minh để bạn chơi ngay!</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition"
            >
              Xóa Key
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-5 py-2 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? 'Đã Lưu!' : 'Lưu Cấu Hình'}
          </button>
        </div>
      </div>
    </div>
  );
};
