import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language, PersistedGameState, Settings, Statistics } from "../types";

const KEYS = {
  settings: "wordle:settings",
  statistics: (language: Language) => `wordle:statistics:${language}`,
  gameState: (language: Language) => `wordle:game-state:${language}`,
} as const;

export const DEFAULT_SETTINGS: Settings = {
  language: "tr",
  theme: "dark",
  animationsEnabled: true,
  hapticsEnabled: true,
};

export const DEFAULT_STATISTICS: Statistics = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

/** Storage can fail or hold malformed JSON; every access degrades to a default. */
async function safeGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function safeSet(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is best-effort; the game keeps working in memory.
  }
}

export async function loadSettings(): Promise<Settings> {
  const stored = await safeGet<Partial<Settings>>(KEYS.settings);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings: Settings): Promise<void> {
  return safeSet(KEYS.settings, settings);
}

// Statistics are kept per language: a Turkish streak and an English streak
// measure different things, so merging them would be misleading.
export async function loadStatistics(language: Language): Promise<Statistics> {
  const stored = await safeGet<Partial<Statistics>>(KEYS.statistics(language));
  return {
    ...DEFAULT_STATISTICS,
    ...stored,
    guessDistribution: {
      ...DEFAULT_STATISTICS.guessDistribution,
      ...stored?.guessDistribution,
    },
  };
}

export function saveStatistics(language: Language, stats: Statistics): Promise<void> {
  return safeSet(KEYS.statistics(language), stats);
}

export function loadGameState(language: Language): Promise<PersistedGameState | null> {
  return safeGet<PersistedGameState>(KEYS.gameState(language));
}

export function saveGameState(language: Language, state: PersistedGameState): Promise<void> {
  return safeSet(KEYS.gameState(language), state);
}

export async function clearGameState(language: Language): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.gameState(language));
  } catch {
    // ignore
  }
}
