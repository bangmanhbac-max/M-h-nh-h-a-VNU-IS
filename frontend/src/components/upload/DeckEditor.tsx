import React, { useState } from 'react';
import { Plus, Trash2, Play, Save, HelpCircle, Gamepad2, Volume2 } from 'lucide-react';
import { LearningPackage, VocabularyItem, QuizItem, StrokeGestureType } from '../../types/learning_content';
import { soundManager } from '../../games/common/SoundSynthesizer';
import { ActiveTab } from '../Navbar';

interface DeckEditorProps {
  packageData: LearningPackage;
  onSave: (pkg: LearningPackage) => void;
  onLaunchGame: (mode: ActiveTab) => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({ packageData, onSave, onLaunchGame }) => {
  const [activeSubTab, setActiveSubTab] = useState<'vocab' | 'quiz'>('vocab');
  const [deckTitle, setDeckTitle] = useState(packageData.title);
  const [vocabItems, setVocabItems] = useState<VocabularyItem[]>(packageData.vocabulary_deck.items);
  const [quizItems, setQuizItems] = useState<QuizItem[]>(packageData.quiz_deck.items);
  const [saveNotification, setSaveNotification] = useState(false);

  const gestureOptions: { value: StrokeGestureType; label: string }[] = [
    { value: 'horizontal', label: '— Ngang' },
    { value: 'vertical', label: '| Sổ' },
    { value: 'slash', label: '/ Phẩy' },
    { value: 'backslash', label: '\\ Mác' },
    { value: 'v_shape', label: 'V Shape' },
    { value: 'caret', label: '^ Caret' },
    { value: 'circle', label: 'O Tròn' },
    { value: 'lightning', label: '⚡ Chớp' },
  ];

  const handleUpdateVocab = (index: number, field: keyof VocabularyItem, val: string | number) => {
    const updated = [...vocabItems];
    updated[index] = { ...updated[index], [field]: val };
    setVocabItems(updated);
  };

  const handleAddVocab = () => {
    const newItem: VocabularyItem = {
      id: `v-${Date.now()}`,
      target_text: '新词',
      phonetic: 'xīncí',
      type_target: 'xinci',
      meaning: 'Từ mới',
      difficulty: 1,
      stroke_gesture: 'horizontal',
    };
    setVocabItems([...vocabItems, newItem]);
  };

  const handleDeleteVocab = (index: number) => {
    setVocabItems(vocabItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuiz = (qIndex: number, field: keyof QuizItem, val: string | number | string[]) => {
    const updated = [...quizItems];
    updated[qIndex] = { ...updated[qIndex], [field]: val };
    setQuizItems(updated);
  };

  const handleSavePackage = () => {
    const updatedPkg: LearningPackage = {
      ...packageData,
      title: deckTitle,
      vocabulary_deck: {
        ...packageData.vocabulary_deck,
        title: deckTitle,
        items: vocabItems,
      },
      quiz_deck: {
        ...packageData.quiz_deck,
        title: `Quiz: ${deckTitle}`,
        items: quizItems,
      },
    };
    onSave(updatedPkg);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  return (
    <div className="bg-[#161F30] border border-cyan-500/20 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex-1">
          <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">
            Tiêu Đề Bài Học
          </label>
          <input
            type="text"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="w-full bg-[#0B0F19] border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-lg font-bold text-white focus:outline-none transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePackage}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm border border-gray-700 transition"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            <span>{saveNotification ? 'Đã Lưu Bộ Thẻ!' : 'Lưu Bộ Thẻ'}</span>
          </button>
        </div>
      </div>

      {/* Mode Launch Bar */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-pink-950/40 border border-cyan-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            Chọn Game Để Bắt Đầu Học:
          </h4>
          <p className="text-xs text-gray-400">Tất cả dữ liệu từ vựng bên dưới sẽ được nạp ngay vào game</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLaunchGame('chicken-shooter')}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20"
          >
            <span>🐔</span>
            <span>Chơi Bắn Gà</span>
            <Play className="w-3.5 h-3.5 fill-black" />
          </button>

          <button
            onClick={() => onLaunchGame('magic-touch')}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-pink-500/20"
          >
            <span>✨</span>
            <span>Chơi Vẽ Chữ (Magic)</span>
            <Play className="w-3.5 h-3.5 fill-white" />
          </button>

          <button
            onClick={() => onLaunchGame('quiz-arena')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Đấu Trường Quiz</span>
            <Play className="w-3.5 h-3.5 fill-black" />
          </button>
        </div>
      </div>

      {/* Tab Switcher: Vocab vs Quiz */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveSubTab('vocab')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeSubTab === 'vocab'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>Danh Sách Từ Vựng & Nét Vẽ ({vocabItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
            activeSubTab === 'quiz'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>Câu Hỏi Trắc Nghiệm ({quizItems.length})</span>
        </button>
      </div>

      {/* TAB 1: VOCABULARY LIST */}
      {activeSubTab === 'vocab' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vocabItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#0B0F19] border border-gray-800 hover:border-cyan-500/30 rounded-2xl p-4 transition space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => soundManager.speakText(item.target_text)}
                      title="Nghe phát âm"
                      className="p-1 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVocab(idx)}
                      title="Xóa từ này"
                      className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-0.5 block">
                      Từ Gốc / Chữ Cứng
                    </label>
                    <input
                      type="text"
                      value={item.target_text}
                      onChange={(e) => handleUpdateVocab(idx, 'target_text', e.target.value)}
                      className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-0.5 block">
                      Phiên Âm / Pinyin
                    </label>
                    <input
                      type="text"
                      value={item.phonetic}
                      onChange={(e) => handleUpdateVocab(idx, 'phonetic', e.target.value)}
                      className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-sm text-cyan-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-0.5 block">
                      Ký Tự Gõ Phím (Type Target)
                    </label>
                    <input
                      type="text"
                      value={item.type_target}
                      onChange={(e) => handleUpdateVocab(idx, 'type_target', e.target.value)}
                      className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-sm font-mono text-amber-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-0.5 block">
                      Cử Chỉ Nét Vẽ (Magic Stroke)
                    </label>
                    <select
                      value={item.stroke_gesture}
                      onChange={(e) => handleUpdateVocab(idx, 'stroke_gesture', e.target.value as StrokeGestureType)}
                      className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs text-purple-300 focus:outline-none"
                    >
                      {gestureOptions.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold mb-0.5 block">
                    Ý Nghĩa Tiếng Việt
                  </label>
                  <input
                    type="text"
                    value={item.meaning}
                    onChange={(e) => handleUpdateVocab(idx, 'meaning', e.target.value)}
                    className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-sm text-emerald-300 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddVocab}
            className="w-full py-3 border border-dashed border-gray-700 hover:border-cyan-400 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Từ Vựng Mới</span>
          </button>
        </div>
      )}

      {/* TAB 2: QUIZ LIST */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-4">
          {quizItems.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">Câu Hỏi #{qIdx + 1}</span>
                <span className="text-xs text-gray-500">100 Điểm</span>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">Nội dung câu hỏi</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleUpdateQuiz(qIdx, 'question', e.target.value)}
                  className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none"
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-2 p-2 rounded-xl border ${
                      q.correct_index === optIdx
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-800 bg-[#161F30]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correct_index === optIdx}
                      onChange={() => handleUpdateQuiz(qIdx, 'correct_index', optIdx)}
                      className="text-emerald-400 focus:ring-0"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...q.options];
                        newOpts[optIdx] = e.target.value;
                        handleUpdateQuiz(qIdx, 'options', newOpts);
                      }}
                      className="flex-1 bg-transparent text-xs text-gray-200 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">Giải thích đáp án</label>
                <input
                  type="text"
                  value={q.explanation || ''}
                  onChange={(e) => handleUpdateQuiz(qIdx, 'explanation', e.target.value)}
                  placeholder="Giải thích vì sao đáp án đúng..."
                  className="w-full bg-[#161F30] border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-1.5 text-xs text-gray-300 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
