import React from 'react';
import { Trophy, Zap, Target, CheckCircle2 } from 'lucide-react';
import { GameStats } from '../../types/game';

interface ScoreHUDProps {
  stats: GameStats;
  wave?: number;
  modeName?: string;
}

export const ScoreHUD: React.FC<ScoreHUDProps> = ({ stats, wave, modeName }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161F30]/90 backdrop-blur-md border border-cyan-500/20 px-4 py-2.5 rounded-2xl shadow-lg">
      {/* Mode / Wave */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-game uppercase tracking-wider text-cyan-400 font-bold">
          {modeName || 'BÀI TẬP'}
        </span>
        {wave !== undefined && (
          <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/30">
            WAVE {wave}
          </span>
        )}
      </div>

      {/* Stats Badges */}
      <div className="flex items-center gap-4 text-xs font-medium">
        {/* Score */}
        <div className="flex items-center gap-1.5 text-amber-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>ĐIỂM:</span>
          <span className="font-game font-bold text-sm text-white tracking-wider">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Streak Combo */}
        <div className={`flex items-center gap-1 transition ${stats.streak >= 3 ? 'text-pink-400 animate-pulse' : 'text-gray-400'}`}>
          <Zap className={`w-4 h-4 ${stats.streak >= 3 ? 'text-pink-400 fill-pink-400' : 'text-gray-500'}`} />
          <span>COMBO:</span>
          <span className="font-game font-bold text-sm text-pink-300">
            x{stats.streak}
          </span>
        </div>

        {/* Accuracy */}
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>CHÍNH XÁC:</span>
          <span className="font-bold text-white">
            {stats.accuracy}%
          </span>
        </div>

        {/* Words / Kills */}
        <div className="hidden md:flex items-center gap-1.5 text-blue-400">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>HẠ GỤC:</span>
          <span className="font-bold text-white">
            {stats.wordsDefeated}
          </span>
        </div>
      </div>
    </div>
  );
};
