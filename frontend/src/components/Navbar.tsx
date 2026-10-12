import React from 'react';
import { Volume2, VolumeX, Sparkles, Upload, Gamepad2, Feather, HelpCircle, Key, Star } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'upload' | 'chicken-shooter' | 'magic-touch' | 'quiz-arena';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenApiKeyModal: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  isDolphinActive: boolean;
  onToggleDolphin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenApiKeyModal,
  isMuted,
  onToggleSound,
  isDolphinActive,
  onToggleDolphin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-cyan-950/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl 3xl:max-w-[1700px] 4k:max-w-[2100px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 3xl:w-11 3xl:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-game font-black text-xl 3xl:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                EDUPLAY
              </span>
              <span className="text-[10px] 3xl:text-xs bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                4K AI GAMING
              </span>
            </div>
            <p className="text-[11px] 3xl:text-xs text-gray-400 -mt-0.5">Biến mọi tài liệu thành trò chơi học tập</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#161F30]/80 p-1.5 rounded-2xl border border-gray-800 shadow-lg">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm 3xl:text-base font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4 3xl:w-5 3xl:h-5" />
            <span>Kho Game</span>
          </button>

          <button
            onClick={() => onSelectTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm 3xl:text-base font-medium transition ${
              activeTab === 'upload'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Upload className="w-4 h-4 3xl:w-5 3xl:h-5" />
            <span>AI Studio (Nạp File)</span>
          </button>

          <div className="h-4 w-px bg-gray-700 mx-1.5" />

          {/* Quick Play Tab Icons */}
          <button
            onClick={() => onSelectTab('chicken-shooter')}
            title="Bắn Gà Luyện Gõ"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs 3xl:text-sm font-semibold transition ${
              activeTab === 'chicken-shooter'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🐔</span>
            <span>Bắn Gà</span>
          </button>

          <button
            onClick={() => onSelectTab('magic-touch')}
            title="Vẽ Nét Phép Thuật"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs 3xl:text-sm font-semibold transition ${
              activeTab === 'magic-touch'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Feather className="w-3.5 h-3.5 3xl:w-4 3xl:h-4" />
            <span>Vẽ Chữ</span>
          </button>

          <button
            onClick={() => onSelectTab('quiz-arena')}
            title="Đấu Trường Quiz"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs 3xl:text-sm font-semibold transition ${
              activeTab === 'quiz-arena'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 3xl:w-4 3xl:h-4" />
            <span>Quiz Arena</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Dolphin & Vietnam Star Toggle */}
          <button
            onClick={onToggleDolphin}
            title={isDolphinActive ? 'Tắt Cá Heo & Chuột Ngôi Sao' : 'Bật Cá Heo & Chuột Ngôi Sao VN'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs 3xl:text-sm font-bold transition shadow-md ${
              isDolphinActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                : 'bg-[#161F30] border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span>🐬</span>
            <Star className={`w-3.5 h-3.5 ${isDolphinActive ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400'}`} />
            <span className="hidden xl:inline">Cá Heo & Sao VN</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2.5 rounded-xl bg-[#161F30] border border-gray-800 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/30 transition shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4 3xl:w-5 3xl:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 3xl:w-5 3xl:h-5 text-cyan-400" />}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161F30] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs 3xl:text-sm font-bold transition hover:bg-cyan-500/10 shadow-md"
          >
            <Key className="w-3.5 h-3.5 3xl:w-4 3xl:h-4" />
            <span className="hidden sm:inline">Cấu Hình AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
