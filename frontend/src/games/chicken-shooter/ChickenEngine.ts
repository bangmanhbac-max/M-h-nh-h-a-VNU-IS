import { VocabularyDeck, VocabularyItem } from '../../types/learning_content';
import { GameState, GameStats } from '../../types/game';
import { GameLoop } from '../common/GameLoop';
import { ParticleEngine } from '../common/ParticleEngine';
import { soundManager } from '../common/SoundSynthesizer';
import { ChickenEntity } from './ChickenEntity';
import { PlayerSpaceship } from './PlayerSpaceship';
import { LaserBeam } from './LaserBeam';
import { TypingController } from './TypingController';

export interface ChickenGameCallbacks {
  onStatsUpdate: (stats: GameStats, hp: number, maxHp: number, wave: number) => void;
  onGameStateChange: (state: GameState) => void;
}

export class ChickenEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private deck: VocabularyDeck;
  private callbacks: ChickenGameCallbacks;

  private gameLoop: GameLoop;
  private particleEngine: ParticleEngine;
  private typingController: TypingController;

  private player: PlayerSpaceship;
  private chickens: ChickenEntity[] = [];
  private lasers: LaserBeam[] = [];

  // HiDPI / 4K Crisp Canvas metrics
  private dpr: number = 1;
  private virtualWidth: number = 800;
  private virtualHeight: number = 600;

  // 4K Background Image
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
  private totalKeystrokes: number = 0;
  private correctKeystrokes: number = 0;

  private spawnTimer: number = 0;
  private spawnInterval: number = 3.2;
  private remainingDeckItems: VocabularyItem[] = [];

  constructor(canvas: HTMLCanvasElement, deck: VocabularyDeck, callbacks: ChickenGameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.deck = deck;
    this.callbacks = callbacks;

    this.particleEngine = new ParticleEngine();
    this.typingController = new TypingController();
    this.player = new PlayerSpaceship(400, 540);

    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.loadBackground();
  }

  private loadBackground(): void {
    const img = new Image();
    img.src = '/assets/iron_man_4k.jpg';
    img.onload = () => {
      this.bgImage = img;
      this.isBgLoaded = true;
    };
  }

  public init(): void {
    this.resetStats();
    this.resizeCanvas();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public start(): void {
    this.resetStats();
    this.gameState = 'PLAYING';
    this.callbacks.onGameStateChange(this.gameState);
    this.remainingDeckItems = [...this.deck.items].sort(() => Math.random() - 0.5);
    this.spawnNextChicken();
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
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  private resetStats(): void {
    this.hp = this.maxHp;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.wordsDefeated = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.wave = 1;
    this.chickens = [];
    this.lasers = [];
    this.spawnTimer = 0;
    this.typingController.resetTarget();
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

      this.player.y = this.virtualHeight - 75;
      this.player.x = this.virtualWidth / 2;
      this.player.targetX = this.virtualWidth / 2;
    }
  }

  private spawnNextChicken(): void {
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

    const chicken = new ChickenEntity(nextVocab, spawnX, -60, speed);
    this.chickens.push(chicken);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.gameState !== 'PLAYING') return;

    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const key = e.key.toLowerCase();
    if (key.length !== 1 || !/^[a-z0-9]$/.test(key)) return;

    this.totalKeystrokes++;

    const result = this.typingController.handleKeyPress(key, this.chickens);

    if (result.hit) {
      this.correctKeystrokes++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      const target = result.targetChicken!;

      // Cập nhật targetX cho phi thuyền di chuyển mượt mà về phía kẻ địch
      this.player.targetX = target.x;
      this.player.triggerRecoil();

      // Bắn tia Stark Plasma Laser kép
      this.lasers.push(new LaserBeam(this.player.x - 14, this.player.y - 15, target.x, target.y, '#00F0FF'));
      this.lasers.push(new LaserBeam(this.player.x + 14, this.player.y - 15, target.x, target.y, '#00F0FF'));
      soundManager.playLaser();

      if (result.wordCompleted) {
        // Kẻ địch bị tiêu diệt hoàn toàn
        target.isDead = true;
        this.wordsDefeated++;
        const pointsEarned = 100 * Math.min(5, 1 + Math.floor(this.streak / 3));
        this.score += pointsEarned;

        soundManager.playExplosion();
        soundManager.speakText(target.vocab.target_text);

        // Hiệu ứng nổ hạt lửa Plasma 4K
        this.particleEngine.createExplosion(target.x, target.y, '#FF0055', 38);
        this.particleEngine.addFloatingText(target.x, target.y - 30, `+${pointsEarned}`, '#00F0FF');

        if (this.streak >= 4 && this.streak % 3 === 0) {
          soundManager.playCombo();
        }

        // Kiểm tra điều kiện qua màn
        if (this.remainingDeckItems.length === 0 && this.chickens.every((c) => c.isDead)) {
          setTimeout(() => this.triggerVictory(), 1000);
        }
      }
    } else {
      // Gõ sai phím
      soundManager.playError();
      this.streak = 0;
    }

    this.notifyStats();
  }

  private update(dt: number): void {
    if (this.gameState !== 'PLAYING') return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= Math.max(1.8, this.spawnInterval - this.wave * 0.25)) {
      this.spawnTimer = 0;
      this.spawnNextChicken();
    }

    this.player.update(dt);
    this.particleEngine.update(dt);

    // Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.update(dt);
      if (laser.isDead) {
        this.lasers.splice(i, 1);
      }
    }

    // Update Invaders
    for (let i = this.chickens.length - 1; i >= 0; i--) {
      const c = this.chickens[i];
      c.update(dt);

      // Nếu quái chạm đáy màn hình
      if (c.y > this.virtualHeight - 85 && !c.isDead) {
        c.isDead = true;
        this.hp--;
        this.streak = 0;
        soundManager.playError();
        this.particleEngine.createExplosion(c.x, c.y, '#FF0055', 34);
        this.particleEngine.addFloatingText(c.x, c.y, '-1 HP', '#FF0055');

        if (this.typingController.getActiveTarget() === c) {
          this.typingController.resetTarget();
        }

        this.notifyStats();

        if (this.hp <= 0) {
          this.triggerGameOver();
          return;
        }
      }

      if (c.isDead) {
        this.chickens.splice(i, 1);
      }
    }
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.save();
    // 4K HiDPI Coordinate Mapping
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // Render Ultra-HD Stark Cosmic Background
    this.renderSpaceBackground();

    // Render Lasers
    for (const laser of this.lasers) {
      laser.render(ctx);
    }

    // Render Invaders
    for (const chicken of this.chickens) {
      chicken.render(ctx);
    }

    // Render Player
    this.player.render(ctx);

    // Render Particles & Floaters
    this.particleEngine.render(ctx);

    ctx.restore();
  }

  private renderSpaceBackground(): void {
    const ctx = this.ctx;

    // 1. Render 4K Iron Man Wallpaper Background
    if (this.isBgLoaded && this.bgImage) {
      ctx.save();
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

      // Dark cinematic sci-fi vignette
      const darkOverlay = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      darkOverlay.addColorStop(0, 'rgba(11, 15, 25, 0.78)');
      darkOverlay.addColorStop(0.5, 'rgba(5, 8, 17, 0.72)');
      darkOverlay.addColorStop(1, 'rgba(2, 4, 10, 0.90)');

      ctx.fillStyle = darkOverlay;
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
      ctx.restore();
    } else {
      // Cosmic Nebula gradient fallback
      const grad = ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
    }

    // 2. Star dust particles with subtle 4K twinkle
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    const count = Math.round(this.virtualWidth / 25);
    for (let i = 0; i < count; i++) {
      const sx = ((i * 12345) % this.virtualWidth);
      const sy = ((i * 67890 + performance.now() * 0.02) % this.virtualHeight);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // 3. Stark Industries HUD Telemetry Grid at the bottom
    const gridY = this.virtualHeight - 120;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.virtualWidth; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, gridY);
      ctx.lineTo(x, this.virtualHeight);
      ctx.stroke();
    }

    // Horizon line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, gridY);
    ctx.lineTo(this.virtualWidth, gridY);
    ctx.stroke();

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
    const accuracy = this.totalKeystrokes > 0 
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) 
      : 100;

    const stats: GameStats = {
      score: this.score,
      streak: this.streak,
      maxStreak: this.maxStreak,
      wordsDefeated: this.wordsDefeated,
      accuracy,
      totalKeystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
    };

    this.callbacks.onStatsUpdate(stats, this.hp, this.maxHp, this.wave);
  }
}
