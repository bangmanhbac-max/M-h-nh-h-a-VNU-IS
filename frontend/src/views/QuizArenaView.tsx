import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight, RotateCcw, Check, X, ArrowLeft, Trophy } from 'lucide-react';
import { LearningPackage, QuizItem } from '../types/learning_content';
import { GameStats } from '../types/game';
import { QuizEngine } from '../games/quiz-arena/QuizEngine';
import { ScoreHUD } from '../components/game-shared/ScoreHUD';

interface QuizArenaViewProps {
  packageData: LearningPackage;
  onBackToDashboard: () => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  packageData,
  onBackToDashboard,
}) => {
  const engineRef = useRef<QuizEngine | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [timeLeft, setTimeLeft] = useState(10);
  const [maxTime, setMaxTime] = useState(10);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctIndex: number;
    explanation?: string;
  } | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    wordsDefeated: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
  });

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const engine = new QuizEngine(packageData.quiz_deck, {
      onQuestionChange: (q, idx, total) => {
        setCurrentQuestion(q);
        setCurrentIndex(idx);
        setTotalQuestions(total);
        setSelectedOption(null);
        setAnswerResult(null);
      },
      onTimerTick: (time, max) => {
        setTimeLeft(time);
        setMaxTime(max);
      },
      onAnswerResult: (isCorrect, selected, correct, explanation) => {
        setSelectedOption(selected);
        setAnswerResult({ isCorrect, correctIndex: correct, explanation });
      },
      onStatsUpdate: (newStats) => {
        setStats(newStats);
      },
      onQuizFinished: (finalStats) => {
        setStats(finalStats);
        setIsFinished(true);
      },
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
    };
  }, [packageData]);

  const handleSelectOption = (index: number) => {
    if (answerResult !== null) return;
    engineRef.current?.submitAnswer(index);
  };

  const handleNextQuestion = () => {
    engineRef.current?.nextQuestion();
  };

  const handleRestartQuiz = () => {
    setIsFinished(false);
    engineRef.current?.start();
  };

  const timerPercentage = Math.max(0, (timeLeft / maxTime) * 100);

  return (
    <div className="space-y-6 py-2 max-w-5xl 3xl:max-w-6xl 4k:max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white px-3.5 py-2 rounded-xl bg-[#161F30] border border-gray-800 transition hover:border-emerald-500/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát Quiz</span>
        </button>

        <div className="flex-1">
          <ScoreHUD stats={stats} modeName="⚡ ĐẤU TRƯỜNG SPEED QUIZ (4K)" />
        </div>
      </div>

      {!isFinished && currentQuestion && (
        <div className="bg-[#161F30] border border-emerald-500/30 rounded-3xl p-6 lg:p-10 3xl:p-12 shadow-2xl space-y-8 animate-fade-in">
          {/* Progress & Countdown Bar */}
          <div>
            <div className="flex items-center justify-between text-xs 3xl:text-sm font-bold text-gray-400 mb-3">
              <span className="text-emerald-400">
                CÂU HỎI {currentIndex + 1} / {totalQuestions}
              </span>
              <div className="flex items-center gap-2 text-amber-300 font-mono">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <div className="w-full h-3 bg-[#0B0F19] rounded-full overflow-hidden border border-gray-800 shadow-inner">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  timeLeft <= 3 ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-2xl sm:text-3xl 3xl:text-4xl font-extrabold text-white leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 4 Option Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 3xl:gap-6">
            {currentQuestion.options.map((opt, optIdx) => {
              let btnClass = 'border-gray-800 bg-[#0B0F19] hover:border-emerald-500/50 hover:bg-[#0B0F19]/90 text-gray-200';

              if (answerResult !== null) {
                if (optIdx === answerResult.correctIndex) {
                  btnClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-xl shadow-emerald-500/20 font-bold';
                } else if (optIdx === selectedOption) {
                  btnClass = 'border-red-500 bg-red-500/20 text-red-300 font-bold';
                } else {
                  btnClass = 'border-gray-800 bg-[#0B0F19] opacity-40';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={answerResult !== null}
                  className={`p-5 3xl:p-6 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between text-base 3xl:text-lg cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span className="font-medium">{opt}</span>
                  {answerResult !== null && optIdx === answerResult.correctIndex && (
                    <Check className="w-6 h-6 text-emerald-400 shrink-0 ml-3" />
                  )}
                  {answerResult !== null && optIdx === selectedOption && !answerResult.isCorrect && (
                    <X className="w-6 h-6 text-red-400 shrink-0 ml-3" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {answerResult !== null && (
            <div className="p-5 3xl:p-6 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                {answerResult.isCorrect ? (
                  <span className="text-xs 3xl:text-sm font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                    🎉 CHÍNH XÁC (+{currentQuestion.points + timeLeft * 10} điểm)
                  </span>
                ) : (
                  <span className="text-xs 3xl:text-sm font-extrabold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">
                    ❌ CHƯA CHÍNH XÁC
                  </span>
                )}
              </div>

              {answerResult.explanation && (
                <p className="text-sm 3xl:text-base text-gray-300 leading-relaxed">
                  💡 <b className="text-white">Giải thích:</b> {answerResult.explanation}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold px-7 py-3 rounded-xl text-sm 3xl:text-base transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <span>{currentIndex + 1 < totalQuestions ? 'Câu Tiếp Theo' : 'Xem Kết Quả Tổng'}</span>
                  <ArrowRight className="w-4 h-4 3xl:w-5 3xl:h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Finished Summary Modal */}
      {isFinished && (
        <div className="bg-[#161F30] border border-emerald-500/50 rounded-3xl p-8 3xl:p-12 shadow-2xl text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 3xl:w-24 3xl:h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Trophy className="w-10 h-10 3xl:w-12 3xl:h-12 text-amber-400 animate-bounce" />
          </div>

          <div>
            <h2 className="font-game text-3xl 3xl:text-4xl font-black text-white">
              HOÀN THÀNH ĐẤU TRƯỜNG QUIZ!
            </h2>
            <p className="text-sm 3xl:text-base text-gray-400 mt-2">
              Bạn đã hoàn thành xuất sắc toàn bộ câu hỏi trong bộ kiến thức này.
            </p>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-[#0B0F19] p-4 3xl:p-5 rounded-2xl border border-gray-800">
              <span className="text-xs 3xl:text-sm text-gray-400 block mb-1">Tổng Điểm</span>
              <p className="font-game font-bold text-xl 3xl:text-2xl text-white">{stats.score.toLocaleString()}</p>
            </div>

            <div className="bg-[#0B0F19] p-4 3xl:p-5 rounded-2xl border border-gray-800">
              <span className="text-xs 3xl:text-sm text-gray-400 block mb-1">Max Combo</span>
              <p className="font-game font-bold text-xl 3xl:text-2xl text-pink-400">x{stats.maxStreak}</p>
            </div>

            <div className="bg-[#0B0F19] p-4 3xl:p-5 rounded-2xl border border-gray-800">
              <span className="text-xs 3xl:text-sm text-gray-400 block mb-1">Độ Chính Xác</span>
              <p className="font-game font-bold text-xl 3xl:text-2xl text-emerald-400">{stats.accuracy}%</p>
            </div>

            <div className="bg-[#0B0F19] p-4 3xl:p-5 rounded-2xl border border-gray-800">
              <span className="text-xs 3xl:text-sm text-gray-400 block mb-1">Số Câu Đúng</span>
              <p className="font-game font-bold text-xl 3xl:text-2xl text-cyan-400">{stats.wordsDefeated} / {totalQuestions}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold px-8 py-3.5 rounded-2xl text-sm 3xl:text-base transition shadow-xl shadow-emerald-500/25 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Luyện Tập Lại</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 bg-[#0B0F19] hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-2xl text-sm 3xl:text-base border border-gray-700 transition"
            >
              <span>Về Trang Chủ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
