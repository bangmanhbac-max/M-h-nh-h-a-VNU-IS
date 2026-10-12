import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, ArrowLeft, MousePointer, Wand2 } from 'lucide-react';
import { LearningPackage } from '../types/learning_content';
import { GameState, GameStats } from '../types/game';
import { MagicTouchEngine } from '../games/magic-touch/MagicTouchEngine';
import { ScoreHUD } from '../components/game-shared/ScoreHUD';
import { HealthBar } from '../components/game-shared/HealthBar';
import { GameOverModal } from '../components/game-shared/GameOverModal';

interface MagicTouchViewProps {
  packageData: LearningPackage;
  onBackToDashboard: () => void;
}

const RUNE_GUIDES = [
  { symbol: '—', name: 'Ngang', color: 'border-rose-500/50 text-rose-300 bg-rose-500/10' },
  { symbol: '|', name: 'Sổ Dọc', color: 'border-sky-500/50 text-sky-300 bg-sky-500/10' },
  { symbol: '/', name: 'Phẩy', color: 'border-amber-500/50 text-amber-300 bg-amber-500/10' },
  { symbol: '\\', name: 'Mác', color: 'border-orange-500/50 text-orange-300 bg-orange-500/10' },
  { symbol: 'V', name: 'Chữ V', color: 'border-purple-500/50 text-purple-300 bg-purple-500/10' },
  { symbol: '^', name: 'Dấu Mũ', color: 'border-pink-500/50 text-pink-300 bg-pink-500/10' },
  { symbol: 'O', name: 'Vòng Tròn', color: 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10' },
  { symbol: '⚡', name: 'Sét (Z)', color: 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10' },
];

export const MagicTouchView: React.FC<MagicTouchViewProps> = ({
  packageData,
  onBackToDashboard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MagicTouchEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('READY');
  const [lastDrawnGesture, setLastDrawnGesture] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    wordsDefeated: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
  });
  const [hp, setHp] = useState(3);
  const [maxHp] = useState(3);
  const [wave, setWave] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new MagicTouchEngine(
      canvasRef.current,
      packageData.vocabulary_deck,
      {
        onStatsUpdate: (newStats, currentHp, _maximumHp, currentWave) => {
          setStats(newStats);
          setHp(currentHp);
          setWave(currentWave);
        },
        onGameStateChange: (newState) => {
          setGameState(newState);
        },
        onGestureDrawn: (name) => {
          setLastDrawnGesture(name);
          setTimeout(() => setLastDrawnGesture(null), 1200);
        },
      }
    );

    engineRef.current = engine;
    engine.init();

    const handleResize = () => engine.resizeCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
    };
  }, [packageData]);

  const handleStartGame = () => {
    engineRef.current?.start();
  };

  const handlePauseResume = () => {
    if (gameState === 'PLAYING') {
      engineRef.current?.pause();
    } else if (gameState === 'PAUSED') {
      engineRef.current?.resume();
    }
  };

  return (
    <div className="space-y-4 py-2 w-full max-w-7xl 3xl:max-w-[1700px] 4k:max-w-[2100px] mx-auto">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white px-3.5 py-2 rounded-xl bg-[#161F30] border border-gray-800 transition hover:border-pink-500/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát Game</span>
        </button>

        <div className="flex-1 max-w-2xl 3xl:max-w-4xl">
          <ScoreHUD stats={stats} wave={wave} modeName="✨ DOCTOR STRANGE: MAGIC TOUCH (4K)" />
        </div>

        <HealthBar hp={hp} maxHp={maxHp} />
      </div>

      {/* 4K Ultra-Sharp Game Canvas Container */}
      <div className="relative w-full h-[600px] 3xl:h-[720px] 4k:h-[860px] rounded-3xl overflow-hidden border border-pink-500/40 bg-[#0B0A16] shadow-2xl shadow-pink-950/40 touch-none">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Floating Gesture Feedback */}
        {lastDrawnGesture && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-amber-500/30 border border-amber-400/70 backdrop-blur-md px-5 py-2 rounded-full text-xs 3xl:text-sm font-black text-amber-200 shadow-2xl animate-bounce">
            ⚡ Phép Thuật Kích Hoạt: {lastDrawnGesture}
          </div>
        )}

        {/* Ready Overlay */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center animate-fade-in">
            <div className="w-20 h-20 3xl:w-24 3xl:h-24 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl 3xl:text-5xl mb-4 shadow-xl shadow-amber-500/30 animate-pulse">
              <Wand2 className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="font-game text-3xl 3xl:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-400 tracking-wider mb-2">
              DOCTOR STRANGE: MAGIC TOUCH (4K)
            </h2>
            <p className="text-sm 3xl:text-base text-gray-200 max-w-xl mb-6 leading-relaxed">
              Dùng chuột hoặc ngón tay vẽ tự do các nét phép thuật (— Ngang, | Sổ, / Phẩy, \ Mác, V, ^, O Tròn, ⚡ Sét) tương ứng với ký hiệu in trên bóng bay để giải cứu từ vựng và tiêu diệt quái vật!
            </p>

            <div className="flex items-center gap-2 mb-8 bg-[#161F30]/90 px-5 py-2.5 rounded-2xl border border-gray-700 text-xs 3xl:text-sm text-gray-300 shadow-inner">
              <MousePointer className="w-4 h-4 text-amber-400" />
              <span>Hỗ trợ cả Chuột máy tính, Touchpad và Màn hình cảm ứng 4K</span>
            </div>

            <button
              onClick={handleStartGame}
              className="flex items-center gap-3 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-base 3xl:text-lg px-9 py-4 3xl:py-5 rounded-2xl shadow-2xl shadow-pink-500/30 transition transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 3xl:w-6 3xl:h-6 text-yellow-300" />
              <span>KHỞI TẠO MA TRẬN PHÉP THUẬT (4K)</span>
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center animate-fade-in">
            <h3 className="font-game text-2xl 3xl:text-3xl font-bold text-white mb-4">TẠM DỪNG PHÉP THUẬT</h3>
            <button
              onClick={handlePauseResume}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-pink-500/25"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Tiếp Tục Chơi</span>
            </button>
          </div>
        )}

        {/* Game Over / Victory Modal */}
        <GameOverModal
          state={gameState}
          stats={stats}
          onRestart={handleStartGame}
          onBackToMenu={onBackToDashboard}
        />
      </div>

      {/* 8-Rune Quick Reference Bar */}
      <div className="bg-[#161F30]/90 border border-gray-800 rounded-2xl p-3 px-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-gray-400 shrink-0 hidden sm:inline">
            8 Nét Phép Thuật:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {RUNE_GUIDES.map((rune, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-black shadow-sm ${rune.color}`}
              >
                <span className="text-sm font-mono">{rune.symbol}</span>
                <span>{rune.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between text-xs 3xl:text-sm text-gray-400 px-2">
        <span>Bài học: <b className="text-white">{packageData.title}</b></span>
        <div className="flex items-center gap-3">
          {gameState === 'PLAYING' && (
            <button
              onClick={handlePauseResume}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#161F30] hover:bg-gray-800 text-white rounded-xl border border-gray-700 transition"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm Dừng</span>
            </button>
          )}
          <button
            onClick={handleStartGame}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#161F30] hover:bg-gray-800 text-white rounded-xl border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>Chơi Lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
