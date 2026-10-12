import { VocabularyItem } from '../../types/learning_content';

export class ChickenEntity {
  public id: string;
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public speed: number;
  public vocab: VocabularyItem;
  public currentTypedIndex: number = 0;
  public isTargeted: boolean = false;
  public isDead: boolean = false;
  public radius: number = 38;
  public wingAngle: number = 0;
  public bobOffset: number = 0;
  private animTimer: number = Math.random() * 10;

  constructor(vocab: VocabularyItem, startX: number, startY: number, speed: number = 25) {
    this.id = vocab.id;
    this.vocab = vocab;
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.speed = speed;
  }

  public update(dt: number): void {
    this.animTimer += dt * 4;
    this.wingAngle = Math.sin(this.animTimer) * 0.35;
    this.bobOffset = Math.sin(this.animTimer * 0.8) * 3;

    // Di chuyển xuống dưới từ từ
    this.y += this.speed * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y + this.bobOffset);

    // 1. High-Tech Target Lock-on Reticle (Khi tàu nhắm mục tiêu)
    if (this.isTargeted) {
      ctx.save();
      ctx.strokeStyle = '#FEE75C';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#FEE75C';
      ctx.shadowBlur = 16;
      ctx.setLineDash([8, 6]);

      // Rotating targeting ring
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 14, 0, Math.PI * 2);
      ctx.stroke();

      // Corner target brackets
      const bSize = 8;
      const bDist = this.radius + 18;
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(-bDist, -bDist + bSize);
      ctx.lineTo(-bDist, -bDist);
      ctx.lineTo(-bDist + bSize, -bDist);
      // Top-Right
      ctx.moveTo(bDist - bSize, -bDist);
      ctx.lineTo(bDist, -bDist);
      ctx.lineTo(bDist, -bDist + bSize);
      // Bottom-Right
      ctx.moveTo(bDist, bDist - bSize);
      ctx.lineTo(bDist, bDist);
      ctx.lineTo(bDist - bSize, bDist);
      // Bottom-Left
      ctx.moveTo(-bDist + bSize, bDist);
      ctx.lineTo(-bDist, bDist);
      ctx.lineTo(-bDist, bDist - bSize);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Chitauri Cyber Alien Drone / Mech Invader Chassis
    ctx.save();
    ctx.shadowColor = this.isTargeted ? '#FF0055' : 'rgba(168, 85, 247, 0.4)';
    ctx.shadowBlur = 14;

    // Bio-mechanical metallic armor gradient
    const mechGrad = ctx.createRadialGradient(-6, -6, 4, 0, 0, this.radius);
    mechGrad.addColorStop(0, '#475569'); // Slate titanium highlight
    mechGrad.addColorStop(0.5, '#1E293B'); // Dark alloy
    mechGrad.addColorStop(0.85, '#0F172A'); // Shadow metal
    mechGrad.addColorStop(1, '#6366F1'); // Cosmic purple edge rim

    ctx.fillStyle = mechGrad;
    ctx.strokeStyle = this.isTargeted ? '#FF0055' : '#818CF8';
    ctx.lineWidth = 2;

    // Aerodynamic Alien Drone Silhouette
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius, this.radius * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Armor panel lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -4, this.radius * 0.65, 0, Math.PI);
    ctx.stroke();

    // 3. Plasma Energy Wing Blades (Flapping with Sin)
    const wingLength = 22;
    // Left Wing
    ctx.save();
    ctx.translate(-this.radius + 6, 0);
    ctx.rotate(this.wingAngle);
    ctx.fillStyle = '#A855F7';
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-wingLength, -4);
    ctx.lineTo(-wingLength * 1.2, 8);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(this.radius - 6, 0);
    ctx.rotate(-this.wingAngle);
    ctx.fillStyle = '#A855F7';
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(wingLength, -4);
    ctx.lineTo(wingLength * 1.2, 8);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Central Glowing Ocular Sensor Eye (Thanos/Chitauri Red/Purple Core)
    ctx.fillStyle = '#FF0055';
    ctx.shadowColor = '#FF0055';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, -14, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Core white pinpoint
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Hiển thị Chữ Cứng / Từ Vựng Chính To Rõ Bên Trong Thân Quái
    ctx.restore();
    ctx.save();
    ctx.font = "bold 22px 'Noto Sans SC', 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.fillText(this.vocab.target_text, 0, 8);
    ctx.restore();

    // 6. Holographic Typing HUD Tag Bên Dưới
    this.renderHoloTypingTag(ctx);

    ctx.restore();
  }

  private renderHoloTypingTag(ctx: CanvasRenderingContext2D): void {
    const boxY = this.radius + 16;
    const typeTarget = this.vocab.type_target.toLowerCase();

    // Holographic Stark Tech Glass Tag
    ctx.save();
    ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
    ctx.strokeStyle = this.isTargeted ? '#00F0FF' : 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1.5;

    const tagWidth = Math.max(120, typeTarget.length * 13 + 30);
    const tagHeight = 44;

    ctx.beginPath();
    ctx.roundRect(-tagWidth / 2, boxY, tagWidth, tagHeight, 10);
    ctx.fill();
    ctx.stroke();

    // Top Header: Pinyin & Nghĩa Tiếng Việt
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`${this.vocab.phonetic} • ${this.vocab.meaning}`, 0, boxY + 14);

    // Ký tự gõ bàn phím với Highlight từng chữ
    ctx.font = "900 16px 'Orbitron', monospace";
    const totalChars = typeTarget.length;
    const charSpacing = 12;
    const startX = -((totalChars - 1) * charSpacing) / 2;

    for (let i = 0; i < totalChars; i++) {
      const char = typeTarget[i];
      const charX = startX + i * charSpacing;

      if (i < this.currentTypedIndex) {
        // Đã gõ đúng: Xanh Cyan Arc Reactor sáng rực
        ctx.fillStyle = '#00F0FF';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
      } else if (i === this.currentTypedIndex && this.isTargeted) {
        // Ký tự tiếp theo cần gõ: Vàng Neon nhấp nháy
        ctx.fillStyle = '#FEE75C';
        ctx.shadowColor = '#FEE75C';
        ctx.shadowBlur = 12;
      } else {
        // Chưa gõ
        ctx.fillStyle = '#E2E8F0';
        ctx.shadowBlur = 0;
      }
      ctx.fillText(char, charX, boxY + 33);
    }
    ctx.restore();
  }
}
