export type Language = "tr" | "en";

export type LetterStatus = "correct" | "present" | "absent" | "empty";

export type GameMode = "daily" | "random";

export type GameStatus = "playing" | "won" | "lost";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

/** A single evaluated letter in a submitted guess. */
export interface EvaluatedLetter {
  letter: string;
  status: LetterStatus;
}

/** A guess is a fixed-length row of evaluated letters. */
export type EvaluatedGuess = EvaluatedLetter[];

export interface GameState {
  language: Language;
  mode: GameMode;
  secretWord: string;
  /** Guesses already submitted and evaluated. */
  guesses: EvaluatedGuess[];
  /** The word currently being typed (not yet submitted). */
  currentGuess: string;
  status: GameStatus;
  /** ISO date string (yyyy-mm-dd, UTC) the daily word corresponds to, when mode === 'daily'. */
  dailyDateKey?: string;
  /** Row index currently animating a flip, if any (for sequential reveal). */
  revealingRowIndex: number | null;
  /** Set when the current row should shake because of an invalid submission. */
  invalidShake: boolean;
}

export interface KeyboardLetterStates {
  [letter: string]: LetterStatus;
}

export interface Settings {
  language: Language;
  theme: "dark" | "light";
  animationsEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface GuessDistribution {
  [guessNumber: number]: number; // 1..MAX_GUESSES
}

export interface Statistics {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: GuessDistribution;
}

export interface PersistedGameState {
  language: Language;
  mode: GameMode;
  secretWord: string;
  guesses: EvaluatedGuess[];
  currentGuess: string;
  status: GameStatus;
  dailyDateKey?: string;
}
