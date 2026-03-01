import type { BackgroundLayer } from "./types";

export class CinemaGrain implements BackgroundLayer {
  private buffer: Uint8ClampedArray | null = null;
  private lastW = 0;
  private lastH = 0;
  private frameSkip = 0;
  private cachedImageData: ImageData | null = null;
  private warmth: number;

  constructor(color?: string) {
    this.warmth = parseInt(color || "30") || 30;
  }

  resize() {}

  render(ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) {
    this.frameSkip++;
    if (this.frameSkip % 3 !== 0 && this.cachedImageData && this.lastW === width && this.lastH === height) {
      ctx.putImageData(this.cachedImageData, 0, 0);
      return;
    }

    if (this.lastW !== width || this.lastH !== height) {
      this.buffer = new Uint8ClampedArray(width * height * 4);
      this.lastW = width;
      this.lastH = height;
    }

    const buf = this.buffer!;
    // Fill every 4th pixel for perf, spread to neighbors
    for (let i = 0; i < buf.length; i += 16) {
      const v = (Math.random() * 255) | 0;
      buf[i] = buf[i + 4] = buf[i + 8] = buf[i + 12] = v;
      buf[i + 1] = buf[i + 5] = buf[i + 9] = buf[i + 13] = v;
      buf[i + 2] = buf[i + 6] = buf[i + 10] = buf[i + 14] = v;
      buf[i + 3] = buf[i + 7] = buf[i + 11] = buf[i + 15] = 35;
    }

    this.cachedImageData = new ImageData(new Uint8ClampedArray(buf.buffer as ArrayBuffer), width, height);
    ctx.putImageData(this.cachedImageData, 0, 0);
  }
}
