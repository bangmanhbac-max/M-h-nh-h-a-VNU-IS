import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { VietnamStarCursor } from './components/effects/VietnamStarCursor';
import { DolphinCompanion } from './components/effects/DolphinCompanion';
import { DashboardView } from './views/DashboardView';
import { UploadStudioView } from './views/UploadStudioView';
import { ChickenShooterView } from './views/ChickenShooterView';
import { MagicTouchView } from './views/MagicTouchView';
import { QuizArenaView } from './views/QuizArenaView';
import { LearningPackage } from './types/learning_content';
import { fetchDecks } from './lib/api';
import { soundManager } from './games/common/SoundSynthesizer';

const DEFAULT_CHINESE_DECK: LearningPackage = {
  package_id: 'default-chinese-hsk1',
  title: 'Tiếng Trung Giao Tiếp HSK 1 Căn Bản',
  source_filename: 'tieng_trung_hsk1.pdf',
  created_at: new Date().toISOString(),
  vocabulary_deck: {
    id: 'deck-zh-default',
    title: 'Từ Vựng Tiếng Trung HSK 1',
    description: 'Các từ giao tiếp căn bản: Chào hỏi, cảm ơn, bạn bè, học tập',
    target_language: 'zh-CN',
    items: [
      { id: 'zh-1', target_text: '你好', phonetic: 'nǐ hǎo', type_target: 'nihao', meaning: 'Xin chào', difficulty: 1, stroke_gesture: 'horizontal' },
      { id: 'zh-2', target_text: '谢谢', phonetic: 'xièxie', type_target: 'xiexie', meaning: 'Cảm ơn', difficulty: 1, stroke_gesture: 'vertical' },
      { id: 'zh-3', target_text: '再见', phonetic: 'zàijiàn', type_target: 'zaijian', meaning: 'Tạm biệt', difficulty: 1, stroke_gesture: 'slash' },
      { id: 'zh-4', target_text: '老师', phonetic: 'lǎoshī', type_target: 'laoshi', meaning: 'Thầy/Cô giáo', difficulty: 2, stroke_gesture: 'caret' },
      { id: 'zh-5', target_text: '朋友', phonetic: 'péngyou', type_target: 'pengyou', meaning: 'Bạn bè', difficulty: 2, stroke_gesture: 'lightning' },
      { id: 'zh-6', target_text: '学习', phonetic: 'xuéxí', type_target: 'xuexi', meaning: 'Học tập', difficulty: 2, stroke_gesture: 'circle' },
      { id: 'zh-7', target_text: '开心', phonetic: 'kāixīn', type_target: 'kaixin', meaning: 'Vui vẻ', difficulty: 1, stroke_gesture: 'v_shape' },
      { id: 'zh-8', target_text: '苹果', phonetic: 'píngguǒ', type_target: 'pingguo', meaning: 'Quả táo', difficulty: 2, stroke_gesture: 'backslash' },
    ],
  },
  quiz_deck: {
    id: 'quiz-zh-default',
    title: 'Đấu Trường Quiz Tiếng Trung HSK 1',
    description: 'Thử thách phản xạ nghĩa từ vựng và pinyin',
    items: [
      {
        id: 'q1',
        question: "Từ '你好' (nǐ hǎo) có ý nghĩa là gì?",
        options: ['A. Tạm biệt', 'B. Xin chào', 'C. Cảm ơn', 'D. Không có chi'],
        correct_index: 1,
        explanation: "'你好' (nǐ hǎo) nghĩa là Xin chào trong tiếng Trung.",
        points: 100,
      },
      {
        id: 'q2',
        question: "Khi muốn nói 'Cảm ơn', bạn dùng từ nào?",
        options: ['A. 谢谢 (xièxie)', 'B. 再见 (zàijiàn)', 'C. 老师 (lǎoshī)', 'D. 学习 (xuéxí)'],
        correct_index: 0,
        explanation: "'谢谢' (xièxie) có nghĩa là Cảm ơn.",
        points: 100,
      },
      {
        id: 'q3',
        question: "Từ '苹果' (píngguǒ) nghĩa là gì?",
        options: ['A. Quả dưa hấu', 'B. Quả táo', 'C. Quả chuối', 'D. Quả xoài'],
        correct_index: 1,
        explanation: "'苹果' (píngguǒ) có nghĩa là Quả táo.",
        points: 100,
      },
    ],
  },
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [decks, setDecks] = useState<LearningPackage[]>([DEFAULT_CHINESE_DECK]);
  const [activeDeck, setActiveDeck] = useState<LearningPackage>(DEFAULT_CHINESE_DECK);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDolphinActive, setIsDolphinActive] = useState(true);

  useEffect(() => {
    fetchDecks()
      .then((serverDecks) => {
        if (serverDecks && serverDecks.length > 0) {
          setDecks(serverDecks);
          setActiveDeck(serverDecks[0]);
        }
      })
      .catch(() => {
        // Fallback local deck
      });
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleDolphin = () => {
    setIsDolphinActive((prev) => !prev);
  };

  const handleSavePackage = (pkg: LearningPackage) => {
    setDecks((prev) => {
      const idx = prev.findIndex((d) => d.package_id === pkg.package_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = pkg;
        return next;
      }
      return [pkg, ...prev];
    });
    setActiveDeck(pkg);
  };

  const handleSelectDeck = (deck: LearningPackage) => {
    setActiveDeck(deck);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      {/* Vietnam Golden Star Cursor */}
      <VietnamStarCursor enabled={isDolphinActive} />

      {/* Dolphin Screen Companion */}
      <DolphinCompanion enabled={isDolphinActive} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isDolphinActive={isDolphinActive}
        onToggleDolphin={handleToggleDolphin}
      />

      {/* Main Container with 4K Max-Width Scaling */}
      <main className="flex-1 max-w-7xl 3xl:max-w-[1700px] 4k:max-w-[2100px] w-full mx-auto px-4 lg:px-8 3xl:px-12 py-6 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            decks={decks}
            activeDeck={activeDeck}
            onSelectDeck={handleSelectDeck}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'upload' && (
          <UploadStudioView
            currentPackage={activeDeck}
            onSavePackage={handleSavePackage}
            onLaunchGame={setActiveTab}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'chicken-shooter' && (
          <ChickenShooterView
            packageData={activeDeck}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'magic-touch' && (
          <MagicTouchView
            packageData={activeDeck}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'quiz-arena' && (
          <QuizArenaView
            packageData={activeDeck}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-[#070A12] py-6 px-4 text-center text-xs 3xl:text-sm text-gray-500 relative z-10">
        <p>AI EduPlay Platform • Nền Tảng Học Tập Trò Chơi Hóa Thế Hệ Mới Bằng AI • 🐬 Cá Heo Đồng Hành & ⭐ Chuột Ngôi Sao Việt Nam</p>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default App;
