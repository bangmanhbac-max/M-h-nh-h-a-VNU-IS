import { ChickenEntity } from './ChickenEntity';
import { soundManager } from '../common/SoundSynthesizer';

export interface TypingResult {
  hit: boolean;
  char: string;
  wordCompleted: boolean;
  completedChicken: ChickenEntity | null;
  targetChicken: ChickenEntity | null;
}

export class TypingController {
  private activeTarget: ChickenEntity | null = null;

  public handleKeyPress(key: string, chickens: ChickenEntity[]): TypingResult {
    const inputChar = key.toLowerCase();
    
    // Chỉ xử lý các ký tự chữ cái và số cơ bản
    if (inputChar.length !== 1 || !/[a-z0-9]/i.test(inputChar)) {
      return { hit: false, char: inputChar, wordCompleted: false, completedChicken: null, targetChicken: null };
    }

    // 1. Nếu đã có mục tiêu đang bị khóa (Active Lock-on)
    if (this.activeTarget && !this.activeTarget.isDead) {
      const targetStr = this.activeTarget.vocab.type_target.toLowerCase();
      const expectedChar = targetStr[this.activeTarget.currentTypedIndex];

      if (inputChar === expectedChar) {
        this.activeTarget.currentTypedIndex++;
        soundManager.playKeyHit();

        // Kiểm tra xem đã hoàn thành toàn bộ từ chưa
        if (this.activeTarget.currentTypedIndex >= targetStr.length) {
          const completed = this.activeTarget;
          this.activeTarget = null;
          soundManager.playExplosion();
          soundManager.speakText(completed.vocab.target_text);
          return { hit: true, char: inputChar, wordCompleted: true, completedChicken: completed, targetChicken: completed };
        }

        return { hit: true, char: inputChar, wordCompleted: false, completedChicken: null, targetChicken: this.activeTarget };
      } else {
        // Gõ sai ký tự tiếp theo của mục tiêu hiện tại
        soundManager.playError();
        return { hit: false, char: inputChar, wordCompleted: false, completedChicken: null, targetChicken: this.activeTarget };
      }
    }

    // 2. Nếu chưa có mục tiêu: Tìm chú gà có ký tự đầu tiên khớp với phím vừa gõ
    // Ưu tiên chú gà ở vị trí thấp nhất (y lớn nhất - nguy hiểm nhất)
    const matchingChickens = chickens
      .filter(c => !c.isDead && c.vocab.type_target.toLowerCase().startsWith(inputChar))
      .sort((a, b) => b.y - a.y);

    if (matchingChickens.length > 0) {
      const selected = matchingChickens[0];
      this.activeTarget = selected;
      selected.isTargeted = true;
      selected.currentTypedIndex = 1;
      soundManager.playKeyHit();

      const targetStr = selected.vocab.type_target.toLowerCase();
      if (selected.currentTypedIndex >= targetStr.length) {
        this.activeTarget = null;
        soundManager.playExplosion();
        soundManager.speakText(selected.vocab.target_text);
        return { hit: true, char: inputChar, wordCompleted: true, completedChicken: selected, targetChicken: selected };
      }

      return { hit: true, char: inputChar, wordCompleted: false, completedChicken: null, targetChicken: selected };
    }

    // Không có từ nào bắt đầu bằng ký tự này
    soundManager.playError();
    return { hit: false, char: inputChar, wordCompleted: false, completedChicken: null, targetChicken: null };
  }

  public getActiveTarget(): ChickenEntity | null {
    return this.activeTarget;
  }

  public resetTarget(): void {
    if (this.activeTarget) {
      this.activeTarget.isTargeted = false;
      this.activeTarget = null;
    }
  }
}
