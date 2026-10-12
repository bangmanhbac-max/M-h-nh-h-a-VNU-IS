import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Keyboard, ArrowLeft } from 'lucide-react';
import { LearningPackage } from '../types/learning_content';
import { GameState, GameStats } from '../types/game';
import { ChickenEngine } from '../games/chicken-shooter/ChickenEngine';
import { ScoreHUD } from '../components/game-shared/ScoreHUD';
import { HealthBar } from '../components/game-shared/HealthBar';
import { GameOverModal } from '../components/game-shared/GameOverModal';

interface ChickenShooterViewProps {
  packageData: LearningPackage;
  onBackToDashboard: () => void;
}

export const ChickenShooterView: React.FC<ChickenShooterViewProps> = ({
  packageData,
  onBackToDashboard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ChickenEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('READY');
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

    const engine = new ChickenEngine(
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
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white px-3.5 py-2 rounded-xl bg-[#161F30] border border-gray-800 transition hover:border-cyan-500/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát Game</span>
        </button>

        <div className="flex-1 max-w-2xl 3xl:max-w-4xl">
          <ScoreHUD stats={stats} wave={wave} modeName="🐔 BẮN GÀ LUYỆN GÕ" />
        </div>

        <HealthBar hp={hp} maxHp={maxHp} />
      </div>

      {/* 4K Ultra-Sharp Game Canvas Container */}
      <div className="relative w-full h-[620px] 3xl:h-[750px] 4k:h-[880px] rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#0B0F19] shadow-2xl shadow-cyan-950/40">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Ready Overlay */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md p-6 text-center animate-fade-in">
            <div className="w-20 h-20 3xl:w-24 3xl:h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl 3xl:text-5xl mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
              🐔
            </div>
            <h2 className="font-game text-3xl 3xl:text-4xl font-black text-amber-400 tracking-wider mb-2">
              CHICKEN INVADERS TYPING
            </h2>
            <p className="text-sm 3xl:text-base text-gray-300 max-w-lg mb-6 leading-relaxed">
              Nhập các ký tự Pinyin hoặc từ tương ứng với chữ Hán hiển thị trên đầu chú gà để tàu vũ trụ khóa mục tiêu và bắn hạ chúng!
            </p>

            <div className="flex items-center gap-2 mb-8 bg-[#161F30] px-5 py-2.5 rounded-2xl border border-gray-700 text-xs 3xl:text-sm text-gray-300 shadow-inner">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>Gợi ý: Gõ chữ thường trên bàn phím không dấu (ví dụ: <b className="text-cyan-300">nihao</b>)</span>
            </div>

            <button
              onClick={handleStartGame}
              className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-base 3xl:text-lg px-9 py-4 3xl:py-5 rounded-2xl shadow-2xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
            >
              <Play className="w-5 h-5 3xl:w-6 3xl:h-6 fill-black" />
              <span>BẮT ĐẦU BẮN GÀ (4K ULTRA-HD)</span>
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center animate-fade-in">
            <h3 className="font-game text-2xl 3xl:text-3xl font-bold text-white mb-4">TẠM DỪNG GAME</h3>
            <button
              onClick={handlePauseResume}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/25"
            >
              <Play className="w-4 h-4 fill-black" />
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

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between text-xs 3xl:text-sm text-gray-400 px-2">
        <span>Bài học: <b className="text-white">{packageData.title}</b> ({packageData.vocabulary_deck.items.length} từ vựng)</span>
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
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chơi Lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
