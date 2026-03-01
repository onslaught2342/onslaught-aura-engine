import type { BackgroundLayer } from "./types";

export class PlasmaField implements BackgroundLayer {
  private baseHue: number;

  constructor(_w: number, _h: number, color?: string) {
    this.baseHue = parseInt(color || "280", 10);
  }

  resize() {}

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    const t = time * 0.001;
    const cellSize = 8;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * cellSize;
        const py = y * cellSize;
        const nx = x / cols;
        const ny = y / rows;

        const v1 = Math.sin(nx * 6 + t);
        const v2 = Math.sin(ny * 8 - t * 0.7);
        const v3 = Math.sin((nx + ny) * 5 + t * 1.3);
        const v4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 8 - t);

        const val = (v1 + v2 + v3 + v4) / 4;
        const hue = (this.baseHue + val * 40 + 360) % 360;
        const light = 30 + val * 25;

        ctx.fillStyle = `hsla(${hue}, 80%, ${light}%, 0.9)`;
        ctx.fillRect(px, py, cellSize, cellSize);
      }
    }
  }
}
