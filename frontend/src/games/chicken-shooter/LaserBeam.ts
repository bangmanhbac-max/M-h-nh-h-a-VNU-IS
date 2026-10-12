export class LaserBeam {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public speed: number = 950;
  public isDead: boolean = false;
  public color: string = '#00F0FF';
  public length: number = 28;

  constructor(startX: number, startY: number, targetX: number, targetY: number, color: string = '#00F0FF') {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
  }

  public update(dt: number): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 22 || this.y < -60) {
      this.isDead = true;
      return;
    }

    const moveDist = this.speed * dt;
    this.x += (dx / dist) * moveDist;
    this.y += (dy / dist) * moveDist;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const angle = Math.atan2(dy, dx);

    ctx.translate(this.x, this.y);
    ctx.rotate(angle);

    // Outer plasma energy bloom
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-this.length, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Searing pure white inner core
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-this.length + 3, 0);
    ctx.lineTo(2, 0);
    ctx.stroke();

    // Plasma impact head
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(2, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
