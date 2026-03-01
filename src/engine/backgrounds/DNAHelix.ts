import type { BackgroundLayer } from "./types";

export class DNAHelix implements BackgroundLayer {
  private baseHue: number;

  constructor(_w: number, _h: number, color?: string) {
    this.baseHue = parseInt(color || "190", 10);
  }

  resize() {}

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    const t = time * 0.001;
    const cx = width / 2;
    const nodeCount = 30;
    const spacing = height / nodeCount;
    const amplitude = width * 0.15;

    for (let i = 0; i < nodeCount; i++) {
      const y = i * spacing;
      const phase = (i / nodeCount) * Math.PI * 4 + t * 2;

      const x1 = cx + Math.sin(phase) * amplitude;
      const x2 = cx + Math.sin(phase + Math.PI) * amplitude;

      const z1 = Math.cos(phase);
      const z2 = Math.cos(phase + Math.PI);

      // Draw connecting rung
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = `hsla(${this.baseHue}, 40%, 50%, 0.15)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw strand 1 node
      const size1 = 3 + z1 * 2;
      const alpha1 = 0.4 + z1 * 0.4;
      ctx.beginPath();
      ctx.arc(x1, y, Math.max(1, size1), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.baseHue}, 80%, 65%, ${Math.max(0.1, alpha1)})`;
      ctx.fill();

      // Glow on front nodes
      if (z1 > 0.3) {
        ctx.beginPath();
        ctx.arc(x1, y, size1 * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x1, y, 0, x1, y, size1 * 3);
        grad.addColorStop(0, `hsla(${this.baseHue}, 90%, 70%, ${alpha1 * 0.4})`);
        grad.addColorStop(1, `hsla(${this.baseHue}, 90%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw strand 2 node
      const size2 = 3 + z2 * 2;
      const alpha2 = 0.4 + z2 * 0.4;
      ctx.beginPath();
      ctx.arc(x2, y, Math.max(1, size2), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(this.baseHue + 60) % 360}, 80%, 65%, ${Math.max(0.1, alpha2)})`;
      ctx.fill();

      if (z2 > 0.3) {
        ctx.beginPath();
        ctx.arc(x2, y, size2 * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x2, y, 0, x2, y, size2 * 3);
        grad.addColorStop(0, `hsla(${(this.baseHue + 60) % 360}, 90%, 70%, ${alpha2 * 0.4})`);
        grad.addColorStop(1, `hsla(${(this.baseHue + 60) % 360}, 90%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Connect to next node (strand lines)
      if (i < nodeCount - 1) {
        const ny = (i + 1) * spacing;
        const np = ((i + 1) / nodeCount) * Math.PI * 4 + t * 2;
        const nx1 = cx + Math.sin(np) * amplitude;
        const nx2 = cx + Math.sin(np + Math.PI) * amplitude;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(nx1, ny);
        ctx.strokeStyle = `hsla(${this.baseHue}, 60%, 60%, ${Math.max(0.05, 0.2 + z1 * 0.3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y);
        ctx.lineTo(nx2, ny);
        ctx.strokeStyle = `hsla(${(this.baseHue + 60) % 360}, 60%, 60%, ${Math.max(0.05, 0.2 + z2 * 0.3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }
}
