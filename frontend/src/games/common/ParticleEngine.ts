import { Particle } from '../../types/game';

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  scale: number;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  public update(dt: number): void {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 45 * dt;
      ft.life += dt;
      ft.alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      ft.scale = Math.min(1.3, 0.9 + (ft.life / ft.maxLife) * 0.4);

      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      if (p.shape === 'ring') {
        ctx.arc(p.x, p.y, p.size * (1 + (p.life / p.maxLife) * 2.2), 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render floating combat texts with 4K glow
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = `900 ${Math.round(20 * ft.scale)}px 'Orbitron', 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 16;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  public createExplosion(x: number, y: number, color: string = '#00F0FF', count: number = 32): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 240;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 4.5,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.4,
        shape: 'circle',
      });
    }

    // Add dual shockwave rings
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 18,
      color: '#FFFFFF',
      alpha: 1,
      life: 0,
      maxLife: 0.38,
      shape: 'ring',
    });
  }

  public addFloatingText(x: number, y: number, text: string, color: string = '#FEE75C'): void {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      life: 0,
      maxLife: 0.85,
      scale: 1,
    });
  }

  public clear(): void {
    this.particles = [];
    this.floatingTexts = [];
  }
}
