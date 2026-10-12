import { VocabularyDeck, VocabularyItem } from '../../types/learning_content';
import { GameState, GameStats, Point2D } from '../../types/game';
import { GameLoop } from '../common/GameLoop';
import { ParticleEngine } from '../common/ParticleEngine';
import { soundManager } from '../common/SoundSynthesizer';
import { GestureRecognizer } from '../common/GestureRecognizer';
import { BalloonMonster } from './BalloonMonster';
import { DrawingCanvas } from './DrawingCanvas';

export interface MagicTouchCallbacks {
  onStatsUpdate: (stats: GameStats, hp: number, maxHp: number, wave: number) => void;
  onGameStateChange: (state: GameState) => void;
  onGestureDrawn?: (gestureName: string) => void;
}

export class MagicTouchEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private deck: VocabularyDeck;
  private callbacks: MagicTouchCallbacks;

  private gameLoop: GameLoop;
  private particleEngine: ParticleEngine;
  private gestureRecognizer: GestureRecognizer;
  private drawingCanvas: DrawingCanvas;

  private monsters: BalloonMonster[] = [];
  private remainingDeckItems: VocabularyItem[] = [];

  // 4K HiDPI Canvas metrics
  private dpr: number = 1;
  private virtualWidth: number = 800;
  private virtualHeight: number = 600;

  // Background 4K Image
  private bgImage: HTMLImageElement | null = null;
  private isBgLoaded: boolean = false;

  private gameState: GameState = 'READY';
  private hp: number = 3;
  private maxHp: number = 3;
  private wave: number = 1;
  private score: number = 0;
  private streak: number = 0;
  private maxStreak: number = 0;
  private wordsDefeated: number = 0;
  private totalStrokes: number = 0;
  private correctStrokes: number = 0;

  private spawnTimer: number = 0;
  private spawnInterval: number = 3.2;

  constructor(canvas: HTMLCanvasElement, deck: VocabularyDeck, callbacks: MagicTouchCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.deck = deck;
    this.callbacks = callbacks;

    this.particleEngine = new ParticleEngine();
    this.gestureRecognizer = new GestureRecognizer();
    this.drawingCanvas = new DrawingCanvas(canvas, (points) => this.handleStrokeComplete(points));

    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    // Preload Doctor Strange 4K Background
    this.loadBackground();
  }

  private loadBackground(): void {
    const img = new Image();
    img.src = '/assets/doctor_strange_4k.jpg';
    img.onload = () => {
      this.bgImage = img;
      this.isBgLoaded = true;
    };
  }

  public init(): void {
    this.resetStats();
    this.resizeCanvas();
    this.drawingCanvas.bindEvents();
  }

  public start(): void {
    this.resetStats();
    this.gameState = 'PLAYING';
    this.callbacks.onGameStateChange(this.gameState);
    this.remainingDeckItems = [...this.deck.items].sort(() => Math.random() - 0.5);
    this.spawnNextMonster();
    this.gameLoop.start();
  }

  public pause(): void {
    if (this.gameState === 'PLAYING') {
      this.gameState = 'PAUSED';
      this.gameLoop.stop();
      this.callbacks.onGameStateChange(this.gameState);
    }
  }

  public resume(): void {
    if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
      this.gameLoop.start();
      this.callbacks.onGameStateChange(this.gameState);
    }
  }

  public destroy(): void {
    this.gameLoop.stop();
    this.drawingCanvas.unbindEvents();
  }

  private resetStats(): void {
    this.hp = this.maxHp;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.wordsDefeated = 0;
    this.totalStrokes = 0;
    this.correctStrokes = 0;
    this.wave = 1;
    this.monsters = [];
    this.spawnTimer = 0;
    this.particleEngine.clear();
  }

  public resizeCanvas(): void {
    const parent = this.canvas.parentElement;
    if (parent) {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      this.dpr = dpr;

      const displayWidth = parent.clientWidth;
      const displayHeight = parent.clientHeight || 650;

      this.virtualWidth = displayWidth;
      this.virtualHeight = displayHeight;

      this.canvas.width = Math.round(displayWidth * dpr);
      this.canvas.height = Math.round(displayHeight * dpr);
      this.canvas.style.width = `${displayWidth}px`;
      this.canvas.style.height = `${displayHeight}px`;
    }
  }

  private handleStrokeComplete(points: Point2D[]): void {
    if (this.gameState !== 'PLAYING') return;

    this.totalStrokes++;
    const recognizedGesture = this.gestureRecognizer.recognize(points);

    if (!recognizedGesture) {
      soundManager.playError();
      this.streak = 0;
      this.notifyStats();
      return;
    }

    if (this.callbacks.onGestureDrawn) {
      this.callbacks.onGestureDrawn(GestureRecognizer.getGestureSymbol(recognizedGesture));
    }

    // Tìm tất cả các quái vật có bóng mang cử chỉ này
    const matchedMonsters = this.monsters.filter(
      (m) => !m.isPopped && m.gestureType === recognizedGesture
    );

    if (matchedMonsters.length > 0) {
      this.correctStrokes++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      soundManager.playMagicSpell();

      for (const m of matchedMonsters) {
        m.pop();
        this.wordsDefeated++;
        const pointsEarned = 150 * Math.min(5, 1 + Math.floor(this.streak / 3));
        this.score += pointsEarned;

        soundManager.playPop();
        soundManager.speakText(m.vocab.target_text);

        // Hiệu ứng nổ bóng ma thuật Doctor Strange 4K
        this.particleEngine.createExplosion(m.x, m.y - 45, m.balloonColor, 36);
        this.particleEngine.addFloatingText(m.x, m.y - 70, `+${pointsEarned}`, '#FEE75C');
      }

      if (this.streak >= 4 && this.streak % 3 === 0) {
        soundManager.playCombo();
      }

      // Kiểm tra chiến thắng
      if (this.remainingDeckItems.length === 0 && this.monsters.every(m => m.isDead || m.isFalling)) {
        setTimeout(() => this.triggerVictory(), 1000);
      }
    } else {
      soundManager.playError();
      this.streak = 0;
    }

    this.notifyStats();
  }

  private spawnNextMonster(): void {
    if (this.remainingDeckItems.length === 0) {
      if (this.deck.items.length > 0) {
        this.wave++;
        this.remainingDeckItems = [...this.deck.items].sort(() => Math.random() - 0.5);
      } else {
        return;
      }
    }

    const nextVocab = this.remainingDeckItems.pop()!;
    const padding = 100;
    const spawnX = padding + Math.random() * Math.max(100, this.virtualWidth - padding * 2);
    const speed = 20 + this.wave * 4 + nextVocab.difficulty * 3;

    const monster = new BalloonMonster(nextVocab, spawnX, -60, speed);
    this.monsters.push(monster);
  }

  private update(dt: number): void {
    if (this.gameState !== 'PLAYING') return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= Math.max(1.8, this.spawnInterval - this.wave * 0.25)) {
      this.spawnTimer = 0;
      this.spawnNextMonster();
    }

    this.particleEngine.update(dt);
    this.drawingCanvas.update(dt);

    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      m.update(dt);

      // Nếu quái rơi ra khỏi màn hình sau khi vỡ bóng
      if (m.isFalling && m.y > this.virtualHeight + 120) {
        m.isDead = true;
        this.monsters.splice(i, 1);
        continue;
      }

      // Nếu bóng chưa vỡ mà chạm đáy đất
      if (!m.isPopped && m.y > this.virtualHeight - 85) {
        m.isDead = true;
        this.monsters.splice(i, 1);
        this.hp--;
        this.streak = 0;
        soundManager.playError();
        this.particleEngine.createExplosion(m.x, m.y, '#FF0055', 30);
        this.particleEngine.addFloatingText(m.x, m.y, '-1 HP', '#FF0055');
        this.notifyStats();

        if (this.hp <= 0) {
          this.triggerGameOver();
          return;
        }
      }
    }
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.save();
    // 4K HiDPI Transform
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // Render 4K Doctor Strange Mystic Background
    this.renderMysticBackground();

    // Render Monsters
    for (const m of this.monsters) {
      m.render(ctx);
    }

    // Render Doctor Strange Active Eldritch Drawing Stroke
    this.drawingCanvas.render(ctx);

    // Render Particles & Floaters
    this.particleEngine.render(ctx);

    ctx.restore();
  }

  private renderMysticBackground(): void {
    const ctx = this.ctx;

    // 1. Render Doctor Strange 4K Cinematic Background Image
    if (this.isBgLoaded && this.bgImage) {
      ctx.save();
      // Draw image cover with aspect ratio
      const imgRatio = this.bgImage.width / this.bgImage.height;
      const canvasRatio = this.virtualWidth / this.virtualHeight;
      let drawW = this.virtualWidth;
      let drawH = this.virtualHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawH = this.virtualWidth / imgRatio;
        offsetY = (this.virtualHeight - drawH) / 2;
      } else {
        drawW = this.virtualHeight * imgRatio;
        offsetX = (this.virtualWidth - drawW) / 2;
      }

      ctx.drawImage(this.bgImage, offsetX, offsetY, drawW, drawH);

      // Dark cinematic vignette overlay so neon balloons and eldritch runes pop
      const darkOverlay = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      darkOverlay.addColorStop(0, 'rgba(11, 15, 25, 0.72)');
      darkOverlay.addColorStop(0.5, 'rgba(15, 10, 30, 0.65)');
      darkOverlay.addColorStop(1, 'rgba(5, 8, 17, 0.88)');

      ctx.fillStyle = darkOverlay;
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
      ctx.restore();
    } else {
      // Fallback mystical gradient
      const grad = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      grad.addColorStop(0, '#1E1035');
      grad.addColorStop(1, '#080512');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
    }

    // 2. Sanctum mystical boundary floor
    ctx.save();
    const floorY = this.virtualHeight - 45;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, floorY, this.virtualWidth, 45);

    // Eldritch mystic orange-gold barrier line
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.virtualWidth, floorY);
    ctx.stroke();

    // Geometric runes along the floor
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    for (let x = 30; x < this.virtualWidth; x += 80) {
      ctx.strokeRect(x, floorY + 12, 20, 20);
      ctx.beginPath();
      ctx.arc(x + 10, floorY + 22, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private triggerGameOver(): void {
    this.gameState = 'GAMEOVER';
    this.gameLoop.stop();
    soundManager.playError();
    this.callbacks.onGameStateChange(this.gameState);
  }

  private triggerVictory(): void {
    this.gameState = 'VICTORY';
    this.gameLoop.stop();
    soundManager.playCombo();
    this.callbacks.onGameStateChange(this.gameState);
  }

  private notifyStats(): void {
    const accuracy = this.totalStrokes > 0 
      ? Math.round((this.correctStrokes / this.totalStrokes) * 100) 
      : 100;

    const stats: GameStats = {
      score: this.score,
      streak: this.streak,
      maxStreak: this.maxStreak,
      wordsDefeated: this.wordsDefeated,
      accuracy,
      totalKeystrokes: this.totalStrokes,
      correctKeystrokes: this.correctStrokes,
    };

    this.callbacks.onStatsUpdate(stats, this.hp, this.maxHp, this.wave);
  }
}
