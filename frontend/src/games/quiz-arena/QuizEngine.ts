import { QuizDeck, QuizItem } from '../../types/learning_content';
import { GameStats } from '../../types/game';
import { soundManager } from '../common/SoundSynthesizer';

export interface QuizEngineCallbacks {
  onQuestionChange: (question: QuizItem, currentIndex: number, total: number) => void;
  onTimerTick: (timeLeft: number, maxTime: number) => void;
  onAnswerResult: (isCorrect: boolean, selectedIndex: number, correctIndex: number, explanation?: string) => void;
  onStatsUpdate: (stats: GameStats) => void;
  onQuizFinished: (finalStats: GameStats) => void;
}

export class QuizEngine {
  private deck: QuizDeck;
  private callbacks: QuizEngineCallbacks;
  private currentIndex: number = 0;
  private questions: QuizItem[] = [];

  private timerId: number | null = null;
  private timeLeft: number = 10;
  private maxTimePerQuestion: number = 10;

  private score: number = 0;
  private streak: number = 0;
  private maxStreak: number = 0;
  private correctCount: number = 0;
  private isAnsweringAllowed: boolean = true;

  constructor(deck: QuizDeck, callbacks: QuizEngineCallbacks) {
    this.deck = deck;
    this.callbacks = callbacks;
    this.questions = [...deck.items];
  }

  public start(): void {
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.currentIndex = 0;
    this.questions = [...this.deck.items].sort(() => Math.random() - 0.5);

    if (this.questions.length === 0) return;

    this.loadQuestion(0);
  }

  private loadQuestion(index: number): void {
    this.currentIndex = index;
    const currentQ = this.questions[index];
    this.isAnsweringAllowed = true;
    this.timeLeft = this.maxTimePerQuestion;

    this.callbacks.onQuestionChange(currentQ, index, this.questions.length);
    this.startTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.callbacks.onTimerTick(this.timeLeft, this.maxTimePerQuestion);

    this.timerId = window.setInterval(() => {
      this.timeLeft -= 1;
      this.callbacks.onTimerTick(this.timeLeft, this.maxTimePerQuestion);

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.submitAnswer(-1); // Hết giờ = Sai
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public submitAnswer(selectedIndex: number): void {
    if (!this.isAnsweringAllowed) return;
    this.isAnsweringAllowed = false;
    this.stopTimer();

    const currentQ = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === currentQ.correct_index;

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      // Điểm cộng theo thời gian còn lại & combo multiplier
      const timeBonus = this.timeLeft * 10;
      const comboMultiplier = Math.min(4, 1 + Math.floor(this.streak / 2));
      const points = (currentQ.points + timeBonus) * comboMultiplier;
      this.score += points;

      soundManager.playMagicSpell();
      if (this.streak >= 3) {
        soundManager.playCombo();
      }
    } else {
      this.streak = 0;
      soundManager.playError();
    }

    const accuracy = this.questions.length > 0
      ? Math.round((this.correctCount / (this.currentIndex + 1)) * 100)
      : 100;

    const stats: GameStats = {
      score: this.score,
      streak: this.streak,
      maxStreak: this.maxStreak,
      wordsDefeated: this.correctCount,
      accuracy,
      totalKeystrokes: this.currentIndex + 1,
      correctKeystrokes: this.correctCount,
    };

    this.callbacks.onStatsUpdate(stats);
    this.callbacks.onAnswerResult(isCorrect, selectedIndex, currentQ.correct_index, currentQ.explanation);
  }

  public nextQuestion(): void {
    if (this.currentIndex + 1 < this.questions.length) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.finishQuiz();
    }
  }

  private finishQuiz(): void {
    this.stopTimer();
    soundManager.playCombo();
    
    const accuracy = this.questions.length > 0
      ? Math.round((this.correctCount / this.questions.length) * 100)
      : 100;

    const finalStats: GameStats = {
      score: this.score,
      streak: this.streak,
      maxStreak: this.maxStreak,
      wordsDefeated: this.correctCount,
      accuracy,
      totalKeystrokes: this.questions.length,
      correctKeystrokes: this.correctCount,
    };

    this.callbacks.onQuizFinished(finalStats);
  }

  public destroy(): void {
    this.stopTimer();
  }
}
