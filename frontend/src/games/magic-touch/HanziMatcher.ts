/**
 * Hanzi & Character Visual Recognizer (Bộ so khớp hình học và nét vẽ chữ cứng)
 * Sử dụng thuật toán Bounding Box Normalization + 9-Zone Density + Pixel IoU Correlation
 * Chạy 100% offline trong trình duyệt ở tốc độ cực nhanh (< 5ms)
 */
export class HanziMatcher {
  private offscreenUser: HTMLCanvasElement;
  private offscreenUserCtx: CanvasRenderingContext2D;

  private offscreenCandidate: HTMLCanvasElement;
  private offscreenCandidateCtx: CanvasRenderingContext2D;

  private readonly gridSize = 48; // 48x48 pixel grid

  constructor() {
    this.offscreenUser = document.createElement('canvas');
    this.offscreenUser.width = this.gridSize;
    this.offscreenUser.height = this.gridSize;
    this.offscreenUserCtx = this.offscreenUser.getContext('2d', { willReadFrequently: true })!;

    this.offscreenCandidate = document.createElement('canvas');
    this.offscreenCandidate.width = this.gridSize;
    this.offscreenCandidate.height = this.gridSize;
    this.offscreenCandidateCtx = this.offscreenCandidate.getContext('2d', { willReadFrequently: true })!;
  }

  /**
   * So khớp hình vẽ của người dùng với danh sách các từ/chữ cứng trên các quả bóng
   */
  public matchDrawnCanvas(
    userSourceCanvas: HTMLCanvasElement,
    candidateTexts: string[]
  ): { matchedText: string; confidence: number; candidateIndex: number } | null {
    if (candidateTexts.length === 0) return null;

    // 1. Trích xuất Bounding Box từ Canvas người dùng vẽ
    const userBox = this.extractBoundingBox(userSourceCanvas);
    if (!userBox || userBox.width < 10 || userBox.height < 10) {
      return null; // Người dùng chưa vẽ gì hoặc chỉ chấm 1 điểm quá nhỏ
    }

    // 2. Chuẩn hóa hình vẽ người dùng vào lưới 48x48 (giữ tỷ lệ và căn giữa)
    this.offscreenUserCtx.clearRect(0, 0, this.gridSize, this.gridSize);
    this.offscreenUserCtx.fillStyle = '#000000';
    this.offscreenUserCtx.fillRect(0, 0, this.gridSize, this.gridSize);

    const padding = 6;
    const targetArea = this.gridSize - padding * 2;
    const scale = Math.min(targetArea / userBox.width, targetArea / userBox.height);
    const drawW = userBox.width * scale;
    const drawH = userBox.height * scale;
    const drawX = padding + (targetArea - drawW) / 2;
    const drawY = padding + (targetArea - drawH) / 2;

    this.offscreenUserCtx.drawImage(
      userSourceCanvas,
      userBox.minX,
      userBox.minY,
      userBox.width,
      userBox.height,
      drawX,
      drawY,
      drawW,
      drawH
    );

    const userPixels = this.getBinaryGrid(this.offscreenUserCtx);
    const userZoneDensities = this.calculateZoneDensities(userPixels);

    let bestScore = -1;
    let bestIndex = -1;
    let bestText = '';

    // 3. So sánh với từng chữ cứng ứng viên
    for (let i = 0; i < candidateTexts.length; i++) {
      const targetText = candidateTexts[i];
      const score = this.compareWithTargetText(userPixels, userZoneDensities, targetText);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
        bestText = targetText;
      }
    }

    // Ngưỡng nhận diện chấp nhận được (>= 32% tương đồng)
    if (bestScore >= 32 && bestIndex >= 0) {
      return {
        matchedText: bestText,
        confidence: Math.min(99, Math.round(bestScore * 1.2)),
        candidateIndex: bestIndex,
      };
    }

    return null;
  }

  private compareWithTargetText(
    userPixels: Uint8Array,
    userZoneDensities: number[],
    text: string
  ): number {
    this.offscreenCandidateCtx.clearRect(0, 0, this.gridSize, this.gridSize);
    this.offscreenCandidateCtx.fillStyle = '#000000';
    this.offscreenCandidateCtx.fillRect(0, 0, this.gridSize, this.gridSize);

    this.offscreenCandidateCtx.fillStyle = '#FFFFFF';
    this.offscreenCandidateCtx.textAlign = 'center';
    this.offscreenCandidateCtx.textBaseline = 'middle';

    // Tự động điều chỉnh kích thước font chữ phù hợp (1 ký tự hay nhiều ký tự)
    const fontSize = text.length === 1 ? 38 : Math.max(16, Math.floor(40 / text.length));
    this.offscreenCandidateCtx.font = `bold ${fontSize}px 'Noto Sans SC', 'SimSun', 'Microsoft YaHei', 'Inter', sans-serif`;
    this.offscreenCandidateCtx.fillText(text, this.gridSize / 2, this.gridSize / 2 + 2);

    const candidatePixels = this.getBinaryGrid(this.offscreenCandidateCtx);
    const candidateZoneDensities = this.calculateZoneDensities(candidatePixels);

    // 1. Tính toán IoU (Intersection over Union) giữa 2 ma trận pixel
    let intersection = 0;
    let union = 0;

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const u = userPixels[i] > 0 ? 1 : 0;
      const c = candidatePixels[i] > 0 ? 1 : 0;

      if (u && c) intersection++;
      if (u || c) union++;
    }

    const iouScore = union > 0 ? (intersection / union) * 100 : 0;

    // 2. Tính toán độ tương đồng mật độ 9 vùng (9-Zone Correlation)
    let zoneDiffSum = 0;
    for (let z = 0; z < 9; z++) {
      zoneDiffSum += Math.abs(userZoneDensities[z] - candidateZoneDensities[z]);
    }
    const zoneScore = Math.max(0, 100 - zoneDiffSum * 100);

    // Tổng hợp điểm số (60% IoU + 40% 9-Zone density)
    return iouScore * 0.6 + zoneScore * 0.4;
  }

  private calculateZoneDensities(grid: Uint8Array): number[] {
    const densities: number[] = new Array(9).fill(0);
    const zoneW = this.gridSize / 3;
    const zoneH = this.gridSize / 3;

    for (let y = 0; y < this.gridSize; y++) {
      const zy = Math.min(2, Math.floor(y / zoneH));
      for (let x = 0; x < this.gridSize; x++) {
        const zx = Math.min(2, Math.floor(x / zoneW));
        const zoneIdx = zy * 3 + zx;

        if (grid[y * this.gridSize + x] > 0) {
          densities[zoneIdx]++;
        }
      }
    }

    const total = densities.reduce((a, b) => a + b, 0) || 1;
    return densities.map((d) => d / total);
  }

  private extractBoundingBox(canvas: HTMLCanvasElement): {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let minX = canvas.width;
    let maxX = 0;
    let minY = canvas.height;
    let maxY = 0;
    let hasPixel = false;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3];
        // Bắt các pixel có vẽ nét
        if (alpha > 30) {
          hasPixel = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!hasPixel) return null;

    return {
      minX,
      minY,
      width: Math.max(1, maxX - minX + 1),
      height: Math.max(1, maxY - minY + 1),
    };
  }

  private getBinaryGrid(ctx: CanvasRenderingContext2D): Uint8Array {
    const imgData = ctx.getImageData(0, 0, this.gridSize, this.gridSize);
    const data = imgData.data;
    const grid = new Uint8Array(this.gridSize * this.gridSize);

    for (let i = 0; i < grid.length; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const a = data[i * 4 + 3];

      // Đếm pixel nếu có màu trắng/sáng hoặc alpha cao
      if (a > 40 && (r > 30 || g > 30 || b > 30)) {
        grid[i] = 1;
      } else {
        grid[i] = 0;
      }
    }

    return grid;
  }
}
