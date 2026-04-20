/**
 * Adaptive quality system.
 *
 * Detects device capability and provides configuration for:
 * - Globe rendering (rotation speed, pitch limits)
 * - Marker rendering (pulse animations, glow effects)
 * - Starfield density
 * - Transition durations
 *
 * Users can override via localStorage.
 */

export type QualityMode = "high" | "balanced" | "performance";

export interface QualityConfig {
  /** Enable pulse ring animation on live markers */
  markerPulse: boolean;
  /** Enable glow box-shadow on marker dots */
  markerGlow: boolean;
  /** Globe auto-rotation speed (deg/frame) */
  rotationSpeed: number;
  /** Fly-to animation duration (ms) */
  flyDuration: number;
  /** Max pitch angle for globe tilt */
  maxPitch: number;
  /** Star count multiplier (1 = default) */
  starDensity: number;
  /** Enable backdrop-filter blur on panels */
  backdropBlur: boolean;
}

const QUALITY_CONFIGS: Record<QualityMode, QualityConfig> = {
  high: {
    markerPulse: true,
    markerGlow: true,
    rotationSpeed: 0.03,
    flyDuration: 2000,
    maxPitch: 60,
    starDensity: 1,
    backdropBlur: true,
  },
  balanced: {
    markerPulse: true,
    markerGlow: true,
    rotationSpeed: 0.025,
    flyDuration: 1500,
    maxPitch: 45,
    starDensity: 0.5,
    backdropBlur: true,
  },
  performance: {
    markerPulse: false,
    markerGlow: false,
    rotationSpeed: 0.02,
    flyDuration: 1000,
    maxPitch: 30,
    starDensity: 0.3,
    backdropBlur: false,
  },
};

const STORAGE_KEY = "goalglobe-quality";

/**
 * Detect the best quality mode for the current device.
 */
function detectQuality(): QualityMode {
  if (typeof window === "undefined") return "balanced";

  // Check for user override
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as QualityMode | null;
    if (saved && saved in QUALITY_CONFIGS) return saved;
  } catch {
    // Ignore
  }

  const isMobile = window.innerWidth < 768;
  const isLowEnd =
    navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
  const hasReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (hasReducedMotion || (isMobile && isLowEnd)) return "performance";
  if (isMobile) return "balanced";
  return "high";
}

let cachedMode: QualityMode | null = null;
let cachedConfig: QualityConfig | null = null;

export function getQualityMode(): QualityMode {
  if (!cachedMode) cachedMode = detectQuality();
  return cachedMode;
}

export function getQualityConfig(): QualityConfig {
  if (!cachedConfig) cachedConfig = QUALITY_CONFIGS[getQualityMode()];
  return cachedConfig;
}

export function setQualityMode(mode: QualityMode): void {
  cachedMode = mode;
  cachedConfig = QUALITY_CONFIGS[mode];
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore
  }
}
