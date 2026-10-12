export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  wordsDefeated: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'spark' | 'ring' | 'star';
}

export interface Point2D {
  x: number;
  y: number;
}
