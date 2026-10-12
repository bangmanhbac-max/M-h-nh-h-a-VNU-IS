import { VocabularyItem, StrokeGestureType } from '../../types/learning_content';
import { GestureRecognizer } from '../common/GestureRecognizer';

export class BalloonMonster {
  public id: string;
  public vocab: VocabularyItem;
  public gestureType: StrokeGestureType;
  public targetText: string;
  public x: number;
  public y: number;
  public speed: number;
  public isPopped: boolean = false;
  public isFalling: boolean = false;
  public fallVelocity: number = 0;
  public fallRotation: number = 0;
  public isDead: boolean = false;
  public isTargetLocked: boolean = false;

  public balloonColor: string;
  public symbolColor: string;
  public balloonRadius: number = 38;
  private animTimer: number = Math.random() * 10;
  private wobbleOffset: number = 0;

  constructor(vocab: VocabularyItem, startX: number, startY: number, speed: number = 22) {
    this.id = vocab.id;
    this.vocab = vocab;
    this.gestureType = vocab.stroke_gesture || 'horizontal';
    this.targetText = vocab.target_text;
    this.x = startX;
    this.y = startY;
    this.speed = speed;

    // Distinct vivid theme colors based on gesture type for instant recognition
    const gestureColors: Record<StrokeGestureType, { balloon: string; symbol: string }> = {
      horizontal: { balloon: '#E11D48', symbol: '#FFE4E6' }, // Crimson Red
      vertical: { balloon: '#0284C7', symbol: '#E0F2FE' },   // Sky Cyan
      slash: { balloon: '#D97706', symbol: '#FEF3C7' },      // Solar Amber
      backslash: { balloon: '#EA580C', symbol: '#FFEDD5' },  // Neon Orange
      v_shape: { balloon: '#9333EA', symbol: '#F3E8FF' },    // Mystic Purple
      caret: { balloon: '#EC4899', symbol: '#FDF2F8' },      // Arcane Pink
      circle: { balloon: '#059669', symbol: '#D1FAE5' },     // Emerald Jade
      lightning: { balloon: '#F59E0B', symbol: '#FFFBEB' },  // Golden Lightning
    };

    const palette = gestureColors[this.gestureType] || { balloon: '#0284C7', symbol: '#FFFFFF' };
    this.balloonColor = palette.balloon;
    this.symbolColor = palette.symbol;
  }

  public update(dt: number): void {
    this.animTimer += dt * 3.5;
    this.wobbleOffset = Math.sin(this.animTimer) * 5;

    if (this.isFalling) {
      // Khi bóng bị nổ: Quái rơi tự do theo trọng lực và xoay tít
      this.fallVelocity += 980 * dt;
      this.y += this.fallVelocity * dt;
      this.fallRotation += 5 * dt;
      return;
    }

    // Khi còn bóng: Bay từ từ từ trên xuống
    this.y += this.speed * dt;
  }

  public pop(): void {
    this.isPopped = true;
    this.isFalling = true;
    this.fallVelocity = -140; // Nảy nhẹ lên rồi rơi tự do
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.wobbleOffset, this.y);

    if (this.isFalling) {
      ctx.rotate(this.fallRotation);
    }

    if (!this.isPopped) {
      // 1. Vòng hào quang đa tầng nếu đang được nhắm mục tiêu
      if (this.isTargetLocked) {
        ctx.strokeStyle = '#FEE75C';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FEE75C';
        ctx.shadowBlur = 18;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(0, -this.balloonRadius - 10, this.balloonRadius + 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. Vẽ Quả Bóng Bay 3D Shading Siêu Thực
      const balloonCenterY = -this.balloonRadius - 10;
      
      // Outer magical aura
      ctx.save();
      ctx.shadowColor = this.balloonColor;
      ctx.shadowBlur = 20;

      // 3D Spherical Radial Gradient
      const radGrad = ctx.createRadialGradient(
        -this.balloonRadius * 0.35,
        balloonCenterY - this.balloonRadius * 0.35,
        2,
        0,
        balloonCenterY,
        this.balloonRadius
      );
      radGrad.addColorStop(0, '#FFFFFF');
      radGrad.addColorStop(0.2, this.symbolColor);
      radGrad.addColorStop(0.65, this.balloonColor);
      radGrad.addColorStop(1, '#0B0F19');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.ellipse(0, balloonCenterY, this.balloonRadius, this.balloonRadius * 1.14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Translucent inner rune ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, balloonCenterY, this.balloonRadius * 0.76, 0, Math.PI * 2);
      ctx.stroke();

      // Specular highlight spot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(
        -this.balloonRadius * 0.4,
        balloonCenterY - this.balloonRadius * 0.45,
        5,
        10,
        -Math.PI / 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Nút buộc bóng
      ctx.fillStyle = this.balloonColor;
      ctx.beginPath();
      ctx.moveTo(-5, -6);
      ctx.lineTo(5, -6);
      ctx.lineTo(0, -1);
      ctx.closePath();
      ctx.fill();

      // Dây buộc nối từ bóng xuống quái
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -1);
      ctx.quadraticCurveTo(this.wobbleOffset * 0.8, 10, 0, 22);
      ctx.stroke();

      // 3. HIỂN THỊ KÝ HIỆU CỬ CHỈ NÉT VẼ TO RÕ TRONG BÓNG (MAGIC TOUCH ICON)
      ctx.save();
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "900 32px 'Orbitron', monospace";
      const icon = GestureRecognizer.getGestureIcon(this.gestureType);
      ctx.fillText(icon, 0, balloonCenterY);

      // Sub-label for stroke type (VD: Ngang, Sổ, V, ^...)
      ctx.font = "bold 11px 'Inter', sans-serif";
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const shortLabel = GestureRecognizer.getGestureSymbol(this.gestureType).split(' ')[1] || '';
      ctx.fillText(shortLabel, 0, balloonCenterY + 22);
      ctx.restore();
    }

    // 4. Vẽ Chú Quái Vật Mystic Minion Có Chi Tiết Cao Dưới Bóng
    ctx.save();
    ctx.translate(0, 26);

    // Chân & Vạt áo bay
    ctx.fillStyle = '#4338CA';
    ctx.beginPath();
    ctx.arc(-8, 14, 5, 0, Math.PI * 2);
    ctx.arc(8, 14, 5, 0, Math.PI * 2);
    ctx.fill();

    // Thân quái vật pháp sư
    const bodyGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 18);
    bodyGrad.addColorStop(0, '#818CF8');
    bodyGrad.addColorStop(0.7, '#4F46E5');
    bodyGrad.addColorStop(1, '#312E81');

    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = '#6366F1';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();

    // Cặp sừng phép thuật phát sáng nhỏ
    ctx.fillStyle = '#F59E0B';
    ctx.shadowColor = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(-11, -12);
    ctx.lineTo(-16, -24);
    ctx.lineTo(-7, -15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(11, -12);
    ctx.lineTo(16, -24);
    ctx.lineTo(7, -15);
    ctx.closePath();
    ctx.fill();

    // Đôi mắt to tròn phát sáng biểu cảm
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(-6, -2, 5, 0, Math.PI * 2);
    ctx.arc(6, -2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Con ngươi mắt
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(-5.5, -2, 2.8, 0, Math.PI * 2);
    ctx.arc(6.5, -2, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Đốm sáng phản chiếu mắt
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(-6.5, -3, 1.2, 0, Math.PI * 2);
    ctx.arc(5.5, -3, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Cà vạt / Ngọc năng lượng trước ngực
    ctx.fillStyle = '#F43F5E';
    ctx.shadowColor = '#F43F5E';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 8, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 5. Thẻ Từ Vựng & Pinyin Tinh Xảo Bên Dưới
    const tagY = 56;
    ctx.save();
    // Glassmorphic tag container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-65, tagY - 2, 130, 36, 8);
    ctx.fill();
    ctx.stroke();

    // Từ gốc / Chữ Hán
    ctx.font = "bold 15px 'Noto Sans SC', 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.targetText, 0, tagY + 12);

    // Pinyin & Nghĩa ngắn
    ctx.font = "10px 'Inter', sans-serif";
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(`${this.vocab.phonetic} • ${this.vocab.meaning}`, 0, tagY + 26);
    ctx.restore();

    ctx.restore();
  }
}
