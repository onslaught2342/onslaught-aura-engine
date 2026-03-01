import { useEffect, useRef, useState } from "react";
import type { SlideBackground } from "@/engine/config";
import type { BackgroundLayer } from "@/engine/backgrounds/types";
import { backgroundRegistry } from "@/engine/backgrounds/registry";

interface Props {
  background: SlideBackground;
  transitionDuration: number;
}

export const BackgroundCanvas = ({ background, transitionDuration }: Props) => {
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const layerARef = useRef<{ layer: BackgroundLayer; type: string; color: string } | null>(null);
  const layerBRef = useRef<{ layer: BackgroundLayer; type: string; color: string } | null>(null);
  const activeRef = useRef<"A" | "B">("A");
  const fadeRef = useRef({ progress: 1, startTime: 0, duration: transitionDuration });
  const rafRef = useRef<number>(0);
  const prevBgRef = useRef<string>("");

  useEffect(() => {
    fadeRef.current.duration = transitionDuration;
  }, [transitionDuration]);

  useEffect(() => {
    const canvasA = canvasARef.current;
    const canvasB = canvasBRef.current;
    if (!canvasA || !canvasB) return;
    const ctxA = canvasA.getContext("2d");
    const ctxB = canvasB.getContext("2d");
    if (!ctxA || !ctxB) return;

    const resize = () => {
      canvasA.width = canvasB.width = window.innerWidth;
      canvasA.height = canvasB.height = window.innerHeight;
      layerARef.current?.layer.resize?.(canvasA.width, canvasA.height);
      layerBRef.current?.layer.resize?.(canvasB.width, canvasB.height);
    };

    const bgKey = `${background.type}-${background.color}`;
    if (prevBgRef.current && prevBgRef.current !== bgKey) {
      // Transition: swap active canvas
      const incoming = activeRef.current === "A" ? "B" : "A";
      const factory = backgroundRegistry[background.type];
      if (factory) {
        const ref = incoming === "A" ? layerARef : layerBRef;
        ref.current = {
          layer: factory(window.innerWidth, window.innerHeight, background.color),
          type: background.type,
          color: background.color,
        };
      }
      activeRef.current = incoming;
      fadeRef.current = { progress: 0, startTime: performance.now(), duration: fadeRef.current.duration };
    } else if (!prevBgRef.current) {
      // Initial load
      const factory = backgroundRegistry[background.type];
      if (factory) {
        layerARef.current = {
          layer: factory(window.innerWidth, window.innerHeight, background.color),
          type: background.type,
          color: background.color,
        };
      }
    }
    prevBgRef.current = bgKey;

    resize();
    window.addEventListener("resize", resize);

    const loop = (time: number) => {
      const adjustedTime = time * background.speed;
      // Update fade progress
      if (fadeRef.current.progress < 1) {
        fadeRef.current.progress = Math.min(1, (time - fadeRef.current.startTime) / fadeRef.current.duration);
      }

      const fadeIn = fadeRef.current.progress;
      const fadeOut = 1 - fadeIn;

      const activeIsA = activeRef.current === "A";
      const inCtx = activeIsA ? ctxA : ctxB;
      const outCtx = activeIsA ? ctxB : ctxA;
      const inLayer = activeIsA ? layerARef.current : layerBRef.current;
      const outLayer = activeIsA ? layerBRef.current : layerARef.current;
      const inCanvas = activeIsA ? canvasA : canvasB;
      const outCanvas = activeIsA ? canvasB : canvasA;

      // Render outgoing (fading out)
      if (outLayer && fadeOut > 0.01) {
        outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);
        outCtx.save();
        outCtx.globalAlpha = background.opacity * fadeOut;
        outCtx.globalCompositeOperation = background.blendMode;
        outLayer.layer.render(outCtx, outCanvas.width, outCanvas.height, adjustedTime);
        outCtx.restore();
        outCanvas.style.opacity = "1";
      } else {
        outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);
        outCanvas.style.opacity = "0";
      }

      // Render incoming (fading in)
      if (inLayer) {
        inCtx.clearRect(0, 0, inCanvas.width, inCanvas.height);
        inCtx.save();
        inCtx.globalAlpha = background.opacity * fadeIn;
        inCtx.globalCompositeOperation = background.blendMode;
        inLayer.layer.render(inCtx, inCanvas.width, inCanvas.height, adjustedTime);
        inCtx.restore();
        inCanvas.style.opacity = "1";
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [background]);

  const canvasStyle = { position: "fixed" as const, inset: 0, width: "100%", height: "100%", zIndex: 0 };

  return (
    <>
      <canvas ref={canvasARef} style={canvasStyle} />
      <canvas ref={canvasBRef} style={canvasStyle} />
    </>
  );
};
