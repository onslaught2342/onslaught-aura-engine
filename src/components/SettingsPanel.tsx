import { Settings } from "lucide-react";
import type { VideoItem, EngineConfig } from "@/engine/config";
import { backgroundRegistry } from "@/engine/backgrounds/registry";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const EFFECT_NAMES: Record<string, string> = {
  goldenDust: "Golden Dust",
  starfield: "Starfield",
  auroraWave: "Aurora Wave",
  neonGrid: "Neon Grid",
  fireEmbers: "Fire Embers",
  electricStorm: "Electric Storm",
  cinemaGrain: "Cinema Grain",
  smokeRing: "Smoke Ring",
  matrixRain: "Matrix Rain",
  plasmaField: "Plasma Field",
  rainfall: "Rainfall",
  dnaHelix: "DNA Helix",
  cosmicDust: "Cosmic Dust",
};

const BLEND_MODES: GlobalCompositeOperation[] = [
  "source-over", "screen", "multiply", "overlay",
  "lighten", "color-dodge", "hard-light", "soft-light",
];

interface Props {
  config: EngineConfig;
  playlist: VideoItem[];
  currentSlide: number;
  onPlaylistChange: (playlist: VideoItem[]) => void;
  onConfigChange: (config: EngineConfig) => void;
}

export const SettingsPanel = ({
  config, playlist, currentSlide, onPlaylistChange, onConfigChange,
}: Props) => {
  const currentItem = playlist[currentSlide];
  if (!currentItem) return null;

  const updateSlide = (updates: Partial<VideoItem>) => {
    const newPlaylist = [...playlist];
    newPlaylist[currentSlide] = { ...newPlaylist[currentSlide], ...updates };
    onPlaylistChange(newPlaylist);
  };

  const updateBackground = (updates: Partial<VideoItem["background"]>) => {
    updateSlide({ background: { ...currentItem.background, ...updates } });
  };

  const updateControls = (updates: Partial<EngineConfig["controls"]>) => {
    onConfigChange({ ...config, controls: { ...config.controls, ...updates } });
  };

  const updateVideo = (updates: Partial<EngineConfig["video"]>) => {
    onConfigChange({ ...config, video: { ...config.video, ...updates } });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed top-6 right-6 p-2 rounded-full transition-opacity hover:opacity-100 opacity-40"
          style={{ zIndex: 20, color: "white", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
        >
          <Settings className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="overflow-y-auto border-l border-white/10 w-[340px]"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" }}
      >
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
          <SheetDescription className="text-white/50">
            Slide {currentSlide + 1} / {playlist.length}
          </SheetDescription>
        </SheetHeader>

        <Accordion type="multiple" defaultValue={["global", "slide", "effect"]} className="mt-4">
          {/* ─── GLOBAL ─── */}
          <AccordionItem value="global" className="border-white/10">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white/70">
              Global
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Row label="Video Fit">
                <Select value={config.video.fit} onValueChange={(v) => updateVideo({ fit: v as "contain" | "cover" })}>
                  <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="cover">Cover</SelectItem>
                  </SelectContent>
                </Select>
              </Row>

              <Row label="Background Color">
                <input
                  type="color"
                  value={config.video.bgColor}
                  onChange={(e) => updateVideo({ bgColor: e.target.value })}
                  className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                />
              </Row>

              <Row label="Arrow Navigation">
                <Switch checked={config.controls.arrowNavigation} onCheckedChange={(v) => updateControls({ arrowNavigation: v })} />
              </Row>

              <Row label="Swipe Navigation">
                <Switch checked={config.controls.swipeNavigation} onCheckedChange={(v) => updateControls({ swipeNavigation: v })} />
              </Row>

              <Row label="Auto-play First">
                <Switch checked={config.controls.autoPlayFirst} onCheckedChange={(v) => updateControls({ autoPlayFirst: v })} />
              </Row>

              <Row label="Auto-advance">
                <Switch checked={config.controls.autoAdvance} onCheckedChange={(v) => updateControls({ autoAdvance: v })} />
              </Row>

              {config.controls.autoAdvance && (
                <div className="space-y-2">
                  <Label className="text-white/70">Advance Delay: {config.controls.autoAdvanceDelay}s</Label>
                  <Slider
                    value={[config.controls.autoAdvanceDelay]}
                    min={0} max={10} step={0.5}
                    onValueChange={([v]) => updateControls({ autoAdvanceDelay: v })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white/70">Transition: {config.controls.transitionDuration}ms</Label>
                <Slider
                  value={[config.controls.transitionDuration]}
                  min={200} max={2000} step={100}
                  onValueChange={([v]) => updateControls({ transitionDuration: v })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── SLIDE ─── */}
          <AccordionItem value="slide" className="border-white/10">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white/70">
              Slide {currentSlide + 1}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Row label="Loop">
                <Switch checked={currentItem.loop} onCheckedChange={(v) => updateSlide({ loop: v })} />
              </Row>
              <Row label="Muted">
                <Switch checked={currentItem.muted} onCheckedChange={(v) => updateSlide({ muted: v })} />
              </Row>
            </AccordionContent>
          </AccordionItem>

          {/* ─── EFFECT ─── */}
          <AccordionItem value="effect" className="border-white/10">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white/70">
              Background Effect
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-white/70">Effect</Label>
                <Select value={currentItem.background.type} onValueChange={(v) => updateBackground({ type: v })}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(backgroundRegistry).map((key) => (
                      <SelectItem key={key} value={key}>{EFFECT_NAMES[key] || key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Hue: {currentItem.background.color}°</Label>
                <input
                  type="range" min="0" max="360"
                  value={parseInt(currentItem.background.color) || 0}
                  onChange={(e) => updateBackground({ color: e.target.value })}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ background: "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))" }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Saturation: {currentItem.background.saturation}%</Label>
                <Slider
                  value={[currentItem.background.saturation]}
                  min={0} max={100} step={1}
                  onValueChange={([v]) => updateBackground({ saturation: v })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Brightness: {currentItem.background.brightness}%</Label>
                <Slider
                  value={[currentItem.background.brightness]}
                  min={0} max={100} step={1}
                  onValueChange={([v]) => updateBackground({ brightness: v })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Opacity: {Math.round(currentItem.background.opacity * 100)}%</Label>
                <Slider
                  value={[currentItem.background.opacity]}
                  min={0} max={1} step={0.05}
                  onValueChange={([v]) => updateBackground({ opacity: v })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Speed: {currentItem.background.speed.toFixed(1)}x</Label>
                <Slider
                  value={[currentItem.background.speed]}
                  min={0.1} max={3} step={0.1}
                  onValueChange={([v]) => updateBackground({ speed: v })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Blend Mode</Label>
                <Select value={currentItem.background.blendMode} onValueChange={(v) => updateBackground({ blendMode: v as GlobalCompositeOperation })}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BLEND_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <Label className="text-white/70">{label}</Label>
    {children}
  </div>
);
