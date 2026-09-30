import type { GameMode, GameState, Language, PersistedGameState } from "../types";
import { getDailyWord, getRandomWord, getUtcDateKey } from "./wordSelection";

export function buildFreshState(language: Language, mode: GameMode, avoid?: string): GameState {
  return {
    language,
    mode,
    secretWord: mode === "daily" ? getDailyWord(language) : getRandomWord(language, avoid),
    guesses: [],
    currentGuess: "",
    status: "playing",
    dailyDateKey: mode === "daily" ? getUtcDateKey() : undefined,
    revealingRowIndex: null,
    invalidShake: false,
  };
}

/** Resumes a saved game, unless it is a daily puzzle from a previous UTC day. */
export function createInitialGame(language: Language, persisted: PersistedGameState | null): GameState {
  if (!persisted || persisted.language !== language) {
    return buildFreshState(language, "daily");
  }
  if (persisted.mode === "daily" && persisted.dailyDateKey !== getUtcDateKey()) {
    return buildFreshState(language, "daily");
  }
  return { ...persisted, revealingRowIndex: null, invalidShake: false };
}
