import type { BackgroundLayer } from "./types";

interface Particle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
  accel: number;
}

export class GoldenDust implements BackgroundLayer {
  private particles: Particle[] = [];
  private count = 150;
  private cx = 0;
  private cy = 0;
  private baseHue: number;

  constructor(width: number, height: number, color?: string) {
    this.baseHue = parseInt(color || "42") || 42;
    this.cx = width / 2;
    this.cy = height / 2;
    this.init();
  }

  private spawn(): Particle {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: this.cx + (Math.random() - 0.5) * 20,
      y: this.cy + (Math.random() - 0.5) * 20,
      angle,
      speed: Math.random() * 1.2 + 0.3,
      size: Math.random() * 2 + 0.8,
      life: 0,
      maxLife: Math.random() * 180 + 80,
      hue: this.baseHue - 5 + Math.random() * 25,
      accel: 1 + Math.random() * 0.01,
    };
  }

  private init() {
    this.particles = Array.from({ length: this.count }, () => {
      const p = this.spawn();
      // Scatter initial particles at random life stages
      p.life = Math.random() * p.maxLife;
      const dist = p.speed * p.life;
      p.x = this.cx + Math.cos(p.angle) * dist;
      p.y = this.cy + Math.sin(p.angle) * dist;
      return p;
    });
  }

  resize(w: number, h: number) {
    this.cx = w / 2;
    this.cy = h / 2;
    this.init();
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    for (const p of this.particles) {
      p.speed *= p.accel;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life++;

      if (p.life > p.maxLife) {
        Object.assign(p, this.spawn());
      }

      const progress = p.life / p.maxLife;
      // Fade in quickly, fade out slowly
      const fade = progress < 0.1
        ? progress / 0.1
        : Math.pow(1 - progress, 1.5);

      const shimmer = 0.7 + 0.3 * Math.sin(time * 0.005 + p.angle * 3);
      const alpha = fade * shimmer;
      const r = p.size * (1 + progress * 1.5);

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
      gradient.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${alpha})`);
      gradient.addColorStop(0.4, `hsla(${p.hue}, 80%, 55%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 60%, 40%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
