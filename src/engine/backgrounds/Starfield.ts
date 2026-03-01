import type { BackgroundLayer } from "./types";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  twinkleOffset: number;
}

export class Starfield implements BackgroundLayer {
  private stars: Star[] = [];
  private count = 200;
  private baseHue: number;

  constructor(width: number, height: number, color?: string) {
    this.baseHue = parseInt(color || "210") || 210;
    this.init(width, height);
  }

  private init(w: number, h: number) {
    this.stars = Array.from({ length: this.count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      brightness: Math.random(),
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }

  resize(w: number, h: number) {
    this.init(w, h);
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    for (const star of this.stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.002 * star.speed * 3 + star.twinkleOffset);
      const alpha = star.brightness * twinkle;
      ctx.fillStyle = `hsla(${this.baseHue}, 60%, 90%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // subtle drift
      star.y += star.speed * 0.1;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
    }
  }
}
