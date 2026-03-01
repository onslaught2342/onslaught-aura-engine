import { useEffect, useRef, useCallback, useState } from "react";
import type { EngineConfig, VideoItem } from "@/engine/config";

interface Props {
  config: EngineConfig;
  playlist: VideoItem[];
  onIndexChange?: (index: number) => void;
}

export const VideoPlayer = ({ config, playlist, onIndexChange }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const autoAdvanceTimer = useRef<number>(0);

  const load = useCallback(
    (i: number) => {
      const video = videoRef.current;
      if (!video || !playlist[i]) return;
      const item = playlist[i];
      video.src = item.src;
      video.loop = item.loop;
      video.muted = item.muted;
      video.play().catch(() => {});
      setIndex(i);
      onIndexChange?.(i);
    },
    [playlist, onIndexChange]
  );

  const next = useCallback(() => {
    const newIdx = (index + 1) % playlist.length;
    load(newIdx);
  }, [index, playlist.length, load]);

  const prev = useCallback(() => {
    const newIdx = (index - 1 + playlist.length) % playlist.length;
    load(newIdx);
  }, [index, playlist.length, load]);

  // Keyboard navigation
  useEffect(() => {
    if (!config.controls.arrowNavigation) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, config.controls.arrowNavigation]);

  // Touch/swipe navigation
  useEffect(() => {
    if (!config.controls.swipeNavigation) return;
    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
      touchStartX.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev, config.controls.swipeNavigation]);

  // Auto-play first
  useEffect(() => {
    if (config.controls.autoPlayFirst) load(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance on video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      if (!playlist[index]?.loop && config.controls.autoAdvance) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = window.setTimeout(() => {
          next();
        }, config.controls.autoAdvanceDelay * 1000);
      }
    };
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("ended", onEnded);
      clearTimeout(autoAdvanceTimer.current);
    };
  }, [index, next, playlist, config.controls.autoAdvance, config.controls.autoAdvanceDelay]);

  return (
    <>
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: 1,
          objectFit: config.video.fit,
          background: "transparent",
        }}
        playsInline
        controls={config.video.controls}
      />
      <div
        className="fixed bottom-6 right-6 text-sm font-mono tracking-wider select-none pointer-events-none"
        style={{ zIndex: 10, color: "rgba(255,255,255,0.35)" }}
      >
        {index + 1} / {playlist.length}
      </div>
    </>
  );
};
