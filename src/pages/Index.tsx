import { useState, useCallback } from "react";
import { CONFIG } from "@/engine/config";
import type { EngineConfig, VideoItem } from "@/engine/config";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";
import { VideoPlayer } from "@/components/VideoPlayer";
import { KeyboardHint } from "@/components/KeyboardHint";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const [engineConfig, setEngineConfig] = useState<EngineConfig>(() => ({ ...CONFIG }));
  const [playlist, setPlaylist] = useState<VideoItem[]>(() => [...CONFIG.video.playlist]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleIndexChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const currentBg = playlist[currentSlide]?.background ?? {
    type: "goldenDust",
    color: "42",
    opacity: 1,
    blendMode: "screen" as GlobalCompositeOperation,
    saturation: 80,
    brightness: 50,
    speed: 1,
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: engineConfig.video.bgColor }}>
      <BackgroundCanvas background={currentBg} transitionDuration={engineConfig.controls.transitionDuration} />
      <VideoPlayer
        config={engineConfig}
        playlist={playlist}
        onIndexChange={handleIndexChange}
      />
      <SettingsPanel
        config={engineConfig}
        playlist={playlist}
        currentSlide={currentSlide}
        onPlaylistChange={setPlaylist}
        onConfigChange={setEngineConfig}
      />
      <KeyboardHint />
    </div>
  );
};

export default Index;
