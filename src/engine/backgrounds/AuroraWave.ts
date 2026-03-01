import type { BackgroundLayer } from "./types";

export class AuroraWave implements BackgroundLayer {
  private color: string;

  constructor(_w: number, _h: number, color = "120, 80%, 50%") {
    this.color = color;
  }

  resize() {}

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    const t = time * 0.0005;
    const bands = 5;
    const bandHeight = height / bands;

    for (let i = 0; i < bands; i++) {
      const hueShift = i * 30;
      const baseY = height * 0.3 + i * bandHeight * 0.4;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 4) {
        const nx = x / width;
        const y =
          baseY +
          Math.sin(nx * 4 + t * (1.2 + i * 0.3)) * 60 +
          Math.sin(nx * 2.5 - t * 0.8 + i) * 40 +
          Math.cos(nx * 6 + t * 1.5 + i * 0.7) * 20;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, baseY - 80, 0, baseY + 120);
      const alpha = 0.12 + 0.06 * Math.sin(t * 2 + i);
      // Parse base hue from color string
      const baseHue = parseInt(this.color) || 120;
      const hue = baseHue + hueShift;
      gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
      gradient.addColorStop(0.3, `hsla(${hue}, 75%, 55%, ${alpha})`);
      gradient.addColorStop(0.6, `hsla(${hue + 20}, 70%, 50%, ${alpha * 0.7})`);
      gradient.addColorStop(1, `hsla(${hue + 40}, 65%, 45%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
}
