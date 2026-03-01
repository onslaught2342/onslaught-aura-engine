export interface BackgroundLayer {
  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number): void;
  resize?(width: number, height: number): void;
}
