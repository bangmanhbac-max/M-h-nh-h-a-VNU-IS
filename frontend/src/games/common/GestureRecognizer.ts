import { Point2D } from '../../types/game';
import { StrokeGestureType } from '../../types/learning_content';

export class GestureRecognizer {
  /**
   * Phân tích chuỗi điểm vẽ (stroke points) và nhận diện dạng cử chỉ
   */
  public recognize(points: Point2D[]): StrokeGestureType | null {
    if (points.length < 5) return null;

    const start = points[0];
    const end = points[points.length - 1];
    
    // Tính tổng chiều dài đường đi (path length)
    let pathLength = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      pathLength += Math.sqrt(dx * dx + dy * dy);
    }

    if (pathLength < 25) return null; // Quá ngắn, có thể do click nhầm

    // Tính Bounding Box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const directDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);

    // 1. Kiểm tra Hình Tròn (Circle): Điểm đầu và cuối rất gần nhau, bao quanh một diện tích
    if (directDist < pathLength * 0.35 && width > 20 && height > 20) {
      return 'circle';
    }

    // 2. Kiểm tra Nét Đơn (Đường thẳng)
    const straightness = directDist / pathLength;
    if (straightness > 0.78) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 đến 180

      // Ngang (Horizontal): -30° -> 30° hoặc 150° -> 180° / -180° -> -150°
      if ((angle >= -35 && angle <= 35) || angle >= 145 || angle <= -145) {
        return 'horizontal';
      }

      // Dọc (Vertical): 55° -> 125° hoặc -125° -> -55°
      if ((angle >= 55 && angle <= 125) || (angle >= -125 && angle <= -55)) {
        return 'vertical';
      }

      // Nét Phẩy / Slash (/): góc 35° -> 55° hoặc -145° -> -125°
      if ((angle > 35 && angle < 55) || (angle > -145 && angle < -125)) {
        return 'backslash';
      }

      // Nét Mác / Backslash (\) hoặc ngược lại
      return 'slash';
    }

    // 3. Kiểm tra cử chỉ 2 nét (V, Caret ^, hoặc Z Lightning)
    // Tìm điểm cực trị (inflection point)
    let minPointY = points[0];
    let maxPointY = points[0];
    for (const p of points) {
      if (p.y < minPointY.y) minPointY = p;
      if (p.y > maxPointY.y) maxPointY = p;
    }

    // Nếu điểm thấp nhất (Y lớn nhất) nằm ở giữa -> V Shape
    if (maxPointY.y - start.y > 20 && maxPointY.y - end.y > 20) {
      return 'v_shape';
    }

    // Nếu điểm cao nhất (Y nhỏ nhất) nằm ở giữa -> Caret ^
    if (start.y - minPointY.y > 20 && end.y - minPointY.y > 20) {
      return 'caret';
    }

    // Đổi hướng nhiều lần -> Lightning
    return 'lightning';
  }

  /** Lấy biểu tượng visual cho từng loại cử chỉ */
  public static getGestureSymbol(type: StrokeGestureType): string {
    switch (type) {
      case 'horizontal': return '一 (Ngang)';
      case 'vertical': return '丨 (Sổ)';
      case 'slash': return '丿 (Phẩy)';
      case 'backslash': return '乀 (Mác)';
      case 'v_shape': return '∨ (Chữ V)';
      case 'caret': return '∧ (Mũ)';
      case 'circle': return '〇 (Tròn)';
      case 'lightning': return '⚡ (Chớp)';
      default: return '—';
    }
  }

  public static getGestureIcon(type: StrokeGestureType): string {
    switch (type) {
      case 'horizontal': return '—';
      case 'vertical': return '|';
      case 'slash': return '/';
      case 'backslash': return '\\';
      case 'v_shape': return 'V';
      case 'caret': return '^';
      case 'circle': return 'O';
      case 'lightning': return 'Z';
      default: return '•';
    }
  }
}
