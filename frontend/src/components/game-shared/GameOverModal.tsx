import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Zap, Target, CheckCircle2 } from 'lucide-react';
import { GameStats, GameState } from '../../types/game';

interface GameOverModalProps {
  state: GameState;
  stats: GameStats;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  stats,
  onRestart,
  onBackToMenu,
}) => {
  if (state !== 'GAMEOVER' && state !== 'VICTORY') return null;

  const isVictory = state === 'VICTORY';

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className={`bg-[#161F30] border ${isVictory ? 'border-amber-400/50 shadow-amber-500/20' : 'border-red-500/50 shadow-red-500/20'} rounded-3xl w-full max-w-md p-8 shadow-2xl text-center`}>
        {/* Header Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg">
          <div className="w-full h-full bg-[#161F30] rounded-[14px] flex items-center justify-center">
            {isVictory ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <span className="text-3xl">💥</span>
            )}
          </div>
        </div>

        <h2 className={`font-game text-2xl font-black tracking-wider uppercase ${isVictory ? 'text-amber-400' : 'text-red-400'}`}>
          {isVictory ? 'CHIẾN THẮNG TUYỆT ĐỐI!' : 'HẾT MÁU / GAME OVER'}
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          {isVictory
            ? 'Bạn đã làm chủ hoàn toàn các từ vựng trong bài học này!'
            : 'Đừng nản lòng, hãy luyện tập lại để tăng tốc độ phản xạ!'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-6 text-left">
          <div className="bg-[#0B0F19] p-3.5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Tổng Điểm</span>
            </div>
            <p className="font-game font-bold text-xl text-white">{stats.score.toLocaleString()}</p>
          </div>

          <div className="bg-[#0B0F19] p-3.5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-pink-400" />
              <span>Max Combo</span>
            </div>
            <p className="font-game font-bold text-xl text-pink-400">x{stats.maxStreak}</p>
          </div>

          <div className="bg-[#0B0F19] p-3.5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Độ Chính Xác</span>
            </div>
            <p className="font-game font-bold text-xl text-emerald-400">{stats.accuracy}%</p>
          </div>

          <div className="bg-[#0B0F19] p-3.5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Số Từ Hạ Gục</span>
            </div>
            <p className="font-game font-bold text-xl text-cyan-400">{stats.wordsDefeated}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-cyan-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="flex items-center justify-center gap-2 bg-[#0B0F19] hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl text-sm border border-gray-700 transition"
          >
            <span>Trang Chủ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
