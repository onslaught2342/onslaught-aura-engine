import type { BackgroundLayer } from "./types";

interface Bolt {
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  alpha: number;
  hue: number;
}

export class ElectricStorm implements BackgroundLayer {
  private bolts: Bolt[] = [];
  private lastSpawn = 0;
  private color: string;
  private w = 0;
  private h = 0;

  constructor(w: number, h: number, color = "220, 90%, 65%") {
    this.color = color;
    this.w = w;
    this.h = h;
  }

  resize(w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  private createBolt(): Bolt {
    const baseHue = parseInt(this.color) || 220;
    const startX = this.w * (0.2 + Math.random() * 0.6);
    const points: { x: number; y: number }[] = [{ x: startX, y: 0 }];
    let x = startX;
    let y = 0;
    const segments = 12 + Math.floor(Math.random() * 10);
    const segH = this.h / segments;

    for (let i = 0; i < segments; i++) {
      x += (Math.random() - 0.5) * 120;
      y += segH + Math.random() * 20;
      points.push({ x, y });

      // Branch with 20% chance
      if (Math.random() < 0.2 && i > 2) {
        let bx = x, by = y;
        for (let j = 0; j < 4; j++) {
          bx += (Math.random() - 0.5) * 80;
          by += segH * 0.6;
          points.push({ x: bx, y: by });
        }
        // Return to main path
        points.push({ x, y });
      }
    }

    return {
      points,
      life: 0,
      maxLife: 8 + Math.random() * 12,
      alpha: 0.8 + Math.random() * 0.2,
      hue: baseHue + Math.random() * 30 - 15,
    };
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    // Spawn new bolts periodically
    if (time - this.lastSpawn > 800 + Math.random() * 2000) {
      this.bolts.push(this.createBolt());
      this.lastSpawn = time;
    }

    // Ambient flicker glow
    const baseHue = parseInt(this.color) || 220;
    const ambientAlpha = 0.02 + 0.01 * Math.sin(time * 0.005);
    const ambient = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, width * 0.8);
    ambient.addColorStop(0, `hsla(${baseHue}, 80%, 60%, ${ambientAlpha})`);
    ambient.addColorStop(1, "transparent");
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, width, height);

    // Render bolts
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const bolt = this.bolts[i];
      bolt.life++;

      if (bolt.life > bolt.maxLife) {
        this.bolts.splice(i, 1);
        continue;
      }

      const fade = 1 - bolt.life / bolt.maxLife;
      const flicker = Math.random() > 0.3 ? 1 : 0.3;

      // Glow layer
      ctx.strokeStyle = `hsla(${bolt.hue}, 100%, 70%, ${fade * 0.3 * flicker})`;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      bolt.points.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      // Core
      ctx.strokeStyle = `hsla(${bolt.hue}, 100%, 90%, ${fade * bolt.alpha * flicker})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      bolt.points.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }
  }
}
