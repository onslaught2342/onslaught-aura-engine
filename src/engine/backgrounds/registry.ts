import type { BackgroundLayer } from "./types";
import { Starfield } from "./Starfield";
import { GoldenDust } from "./GoldenDust";
import { CinemaGrain } from "./CinemaGrain";
import { AuroraWave } from "./AuroraWave";
import { NeonGrid } from "./NeonGrid";
import { FireEmbers } from "./FireEmbers";
import { ElectricStorm } from "./ElectricStorm";
import { SmokeRing } from "./SmokeRing";
import { MatrixRain } from "./MatrixRain";
import { PlasmaField } from "./PlasmaField";
import { RainfallEffect } from "./RainfallEffect";
import { DNAHelix } from "./DNAHelix";
import { CosmicDust } from "./CosmicDust";

type LayerFactory = (w: number, h: number, color?: string) => BackgroundLayer;

export const backgroundRegistry: Record<string, LayerFactory> = {
  starfield: (w, h, c) => new Starfield(w, h, c),
  goldenDust: (w, h, c) => new GoldenDust(w, h, c),
  cinemaGrain: (_w, _h, c) => new CinemaGrain(c),
  auroraWave: (w, h, c) => new AuroraWave(w, h, c),
  neonGrid: (w, h, c) => new NeonGrid(w, h, c),
  fireEmbers: (w, h, c) => new FireEmbers(w, h, c),
  electricStorm: (w, h, c) => new ElectricStorm(w, h, c),
  smokeRing: (w, h, c) => new SmokeRing(w, h, c),
  matrixRain: (w, h, c) => new MatrixRain(w, h, c),
  plasmaField: (w, h, c) => new PlasmaField(w, h, c),
  rainfall: (w, h, c) => new RainfallEffect(w, h, c),
  dnaHelix: (w, h, c) => new DNAHelix(w, h, c),
  cosmicDust: (w, h, c) => new CosmicDust(w, h, c),
};
