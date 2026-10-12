export class GameLoop {
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private updateFn: (deltaTime: number) => void;
  private renderFn: () => void;

  constructor(update: (deltaTime: number) => void, render: () => void) {
    this.updateFn = update;
    this.renderFn = render;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    // Delta time in seconds, clamped to max 0.1s to prevent huge jumps on tab switch
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.updateFn(deltaTime);
    this.renderFn();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
