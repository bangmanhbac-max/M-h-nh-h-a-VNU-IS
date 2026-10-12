export class PlayerSpaceship {
  public x: number;
  public y: number;
  public targetX: number;
  public recoilOffset: number = 0;
  public engineGlow: number = 0;
  public bankAngle: number = 0;
  private width: number = 64;
  private height: number = 52;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
  }

  public update(dt: number): void {
    const dx = this.targetX - this.x;
    // Smooth bank angle when moving laterally (nghiêng tàu khi đổi hướng)
    this.bankAngle = Math.max(-0.25, Math.min(0.25, (dx / 100) * 0.2));
    this.x += dx * 14 * dt;
    this.recoilOffset = Math.max(0, this.recoilOffset - 35 * dt);
    this.engineGlow = 0.5 + Math.sin(performance.now() * 0.02) * 0.5;
  }

  public triggerRecoil(): void {
    this.recoilOffset = 10;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y + this.recoilOffset);
    ctx.rotate(this.bankAngle);

    // 1. Dual High-Energy Repulsor Thruster Flames (Iron Man / Stark Tech Thrusters)
    const flameHeight = 16 + this.engineGlow * 12;
    const thrusterXOffsets = [-14, 14];

    for (const tx of thrusterXOffsets) {
      // Outer cyan-blue flame
      ctx.save();
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 18;
      const thrusterGrad = ctx.createLinearGradient(tx, this.height / 2 - 4, tx, this.height / 2 + flameHeight);
      thrusterGrad.addColorStop(0, '#FFFFFF');
      thrusterGrad.addColorStop(0.3, '#38BDF8');
      thrusterGrad.addColorStop(0.7, '#0284C7');
      thrusterGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

      ctx.fillStyle = thrusterGrad;
      ctx.beginPath();
      ctx.moveTo(tx - 6, this.height / 2 - 2);
      ctx.lineTo(tx, this.height / 2 + flameHeight);
      ctx.lineTo(tx + 6, this.height / 2 - 2);
      ctx.closePath();
      ctx.fill();

      // Searing white-hot inner flame core
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(tx - 2.5, this.height / 2 - 2);
      ctx.lineTo(tx, this.height / 2 + flameHeight * 0.55);
      ctx.lineTo(tx + 2.5, this.height / 2 - 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 2. Iron Man / Stark Nano-Tech Metallic Wings & Armor Plating
    ctx.save();
    ctx.shadowColor = 'rgba(0, 240, 255, 0.35)';
    ctx.shadowBlur = 12;

    // Main Metallic Red & Titanium Chassis
    const armorGrad = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
    armorGrad.addColorStop(0, '#B91C1C');   // Iron Man Crimson Red
    armorGrad.addColorStop(0.4, '#DC2626'); // Scarlet Highlight
    armorGrad.addColorStop(0.7, '#7F1D1D'); // Deep Red
    armorGrad.addColorStop(1, '#1E293B');   // Titanium Base

    ctx.fillStyle = armorGrad;
    ctx.strokeStyle = '#D97706'; // Gold accent trim
    ctx.lineWidth = 1.8;

    // Aerodynamic Jet Geometry
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2); // Sharp nose cone
    ctx.lineTo(10, -this.height / 4);
    ctx.lineTo(this.width / 2, this.height / 2 - 10); // Right wing tip
    ctx.lineTo(this.width / 2 - 8, this.height / 2);
    ctx.lineTo(16, this.height / 2 - 4); // Right thruster mount
    ctx.lineTo(0, this.height / 2 - 8);  // Engine bay
    ctx.lineTo(-16, this.height / 2 - 4); // Left thruster mount
    ctx.lineTo(-this.width / 2 + 8, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2 - 10); // Left wing tip
    ctx.lineTo(-10, -this.height / 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden Wing Inlays (Vibranium/Gold Titanium alloy panels)
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(this.width / 2 - 6, this.height / 2 - 12);
    ctx.lineTo(this.width / 2 - 14, this.height / 2 - 10);
    ctx.lineTo(4, 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(-this.width / 2 + 6, this.height / 2 - 12);
    ctx.lineTo(-this.width / 2 + 14, this.height / 2 - 10);
    ctx.lineTo(-4, 4);
    ctx.closePath();
    ctx.fill();

    // 3. Central Stark Arc Reactor Core (Pulsing Energy Hub)
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(0, -2, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Arc reactor inner triangular ring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -2, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -2, 2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Dual Plasma Cannons at Wingtips
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.width / 2 - 2, this.height / 2 - 12, 2.5, 0, Math.PI * 2);
    ctx.arc(-this.width / 2 + 2, this.height / 2 - 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }
}
