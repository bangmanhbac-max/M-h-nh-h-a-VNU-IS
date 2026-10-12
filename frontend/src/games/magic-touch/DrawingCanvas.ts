import { Point2D } from '../../types/game';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
}

export class DrawingCanvas {
  private isDrawing: boolean = false;
  private points: Point2D[] = [];
  private onStrokeComplete: (points: Point2D[]) => void;
  private canvas: HTMLCanvasElement;
  private sparks: Spark[] = [];

  constructor(canvas: HTMLCanvasElement, onStrokeComplete: (points: Point2D[]) => void) {
    this.canvas = canvas;
    this.onStrokeComplete = onStrokeComplete;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  public bindEvents(): void {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  }

  public unbindEvents(): void {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }

  private getCanvasPos(e: PointerEvent): Point2D {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private emitSparks(x: number, y: number, count: number = 3): void {
    const colors = ['#F59E0B', '#EF4444', '#FBBF24', '#F97316', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 80;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.5 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.3,
      });
    }
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isDrawing = true;
    const pt = this.getCanvasPos(e);
    this.points = [pt];
    this.emitSparks(pt.x, pt.y, 6);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDrawing) return;
    const pt = this.getCanvasPos(e);
    this.points.push(pt);
    this.emitSparks(pt.x, pt.y, 3);
  }

  private handlePointerUp(): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.points.length > 3) {
      this.onStrokeComplete([...this.points]);
    }
    this.points = [];
  }

  public update(dt: number): void {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life += dt;
      s.alpha = Math.max(0, 1 - s.life / s.maxLife);
      if (s.life >= s.maxLife) {
        this.sparks.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // 1. Render Doctor Strange Eldritch Sparks
    ctx.save();
    for (const s of this.sparks) {
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (this.points.length < 2) return;

    ctx.save();

    // 2. Doctor Strange Tao Mandala Outer Fiery Glow
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();

    // Fiery Orange/Gold Core
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 14;
    ctx.stroke();

    // Searing White-Hot Center
    ctx.strokeStyle = '#FFFBEB';
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // 3. Mystical Mandala Ring at pointer tip
    const lastPt = this.points[this.points.length - 1];
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(lastPt.x, lastPt.y, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
