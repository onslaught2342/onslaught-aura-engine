export interface SlideBackground {
  type: string;
  color: string;
  opacity: number;
  blendMode: GlobalCompositeOperation;
  saturation: number;
  brightness: number;
  speed: number;
}

export interface BackgroundConfig {
  type: string;
  enabled: boolean;
  zIndex: number;
  opacity: number;
  blendMode: GlobalCompositeOperation;
}

export interface VideoItem {
  src: string;
  loop: boolean;
  muted: boolean;
  background: SlideBackground;
}

export interface EngineConfig {
  backgrounds: BackgroundConfig[];
  video: {
    fit: "contain" | "cover";
    controls: boolean;
    playlist: VideoItem[];
    bgColor: string;
  };
  controls: {
    arrowNavigation: boolean;
    autoPlayFirst: boolean;
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    transitionDuration: number;
    swipeNavigation: boolean;
  };
}

const slideDefaults: { type: string; color: string }[] = [
  { type: "goldenDust", color: "42" },
  { type: "starfield", color: "210" },
  { type: "auroraWave", color: "140" },
  { type: "neonGrid", color: "180" },
  { type: "fireEmbers", color: "15" },
  { type: "electricStorm", color: "220" },
  { type: "cinemaGrain", color: "30" },
  { type: "smokeRing", color: "270" },
  { type: "matrixRain", color: "120" },
];

export const CONFIG: EngineConfig = {
  backgrounds: [],
  video: {
    fit: "contain",
    controls: false,
    bgColor: "#000000",
    playlist: Array.from({ length: 9 }, (_, i) => ({
      src: `https://cdn.onslaught2342.qzz.io/assets/videos/pptx/${i + 1}.webm`,
      loop: false,
      muted: true,
      background: {
        type: slideDefaults[i].type,
        color: slideDefaults[i].color,
        opacity: 1,
        blendMode: "screen" as GlobalCompositeOperation,
        saturation: 80,
        brightness: 50,
        speed: 1,
      },
    })),
  },
  controls: {
    arrowNavigation: true,
    autoPlayFirst: true,
    autoAdvance: true,
    autoAdvanceDelay: 0,
    transitionDuration: 800,
    swipeNavigation: true,
  },
};
