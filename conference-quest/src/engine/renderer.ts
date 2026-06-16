import type { Scene, Hotspot } from '../types';
import { SCENE_WIDTH, SCENE_HEIGHT } from '../world/constants';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private currentScene: Scene | null = null;

  constructor(private container: HTMLElement) {}

  mount(scene: Scene): void {
    this.currentScene = scene;
    this.canvas = document.createElement('canvas');
    this.canvas.width = SCENE_WIDTH;
    this.canvas.height = SCENE_HEIGHT;
    this.canvas.style.display = 'block';
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.startLoop();
  }

  startLoop() {
    const loop = () => {
      if (this.currentScene) {
        this.renderFrame(this.currentScene, Date.now());
      }
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  renderFrame(scene: Scene, time: number) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

    ctx.fillStyle = '#0c051f';
    ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

    const hotspots = scene.hotspots;
    hotspots.forEach((hotspot) => {
      ctx.fillStyle = '#2f1f52';
      ctx.strokeStyle = '#502a8f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e8d5ff';
      ctx.font = '14px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText(hotspot.label, hotspot.x + hotspot.width / 2, hotspot.y + hotspot.height / 2 + 6);
    });

    ctx.fillStyle = '#120d20';
    ctx.fillRect(0, SCENE_HEIGHT - 160, SCENE_WIDTH, 160);
    ctx.strokeStyle = '#502a8f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, SCENE_HEIGHT - 160);
    ctx.lineTo(SCENE_WIDTH, SCENE_HEIGHT - 160);
    ctx.stroke();
  }

  shutdown(): void {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.currentScene = null;
  }
}
