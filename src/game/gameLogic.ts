import {
  EvaluatedGuess,
  KeyboardLetterStates,
  LetterStatus,
  MAX_GUESSES,
} from "../types";
import { toLetterArray } from "../utils/turkish";

/**
 * Evaluates a single guess against the secret word, following real Wordle
 * duplicate-letter rules:
 *
 * Pass 1 — mark every letter that is in the exact correct position as
 * "correct", and remove one occurrence of that letter from the secret
 * word's remaining-letter pool.
 *
 * Pass 2 — for every letter not already marked "correct", if the secret
 * word's remaining pool still has that letter available, mark it
 * "present" and consume one occurrence from the pool; otherwise "absent".
 *
 * This ensures a guess with two of the same letter is never both marked
 * present/correct unless the secret word actually contains that letter
 * twice.
 */
export function evaluateGuess(guess: string, secretWord: string): EvaluatedGuess {
  const guessLetters = toLetterArray(guess);
  const secretLetters = toLetterArray(secretWord);

  const statuses: LetterStatus[] = new Array(guessLetters.length).fill("absent");

  // Pool of secret letters not yet "claimed" by a correct or present match.
  const remaining: Record<string, number> = {};
  for (const letter of secretLetters) {
    remaining[letter] = (remaining[letter] ?? 0) + 1;
  }

  // Pass 1: exact position matches.
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === secretLetters[i]) {
      statuses[i] = "correct";
      remaining[guessLetters[i]] -= 1;
    }
  }

  // Pass 2: wrong-position matches, limited by remaining occurrences.
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] === "correct") continue;
    const letter = guessLetters[i];
    if ((remaining[letter] ?? 0) > 0) {
      statuses[i] = "present";
      remaining[letter] -= 1;
    } else {
      statuses[i] = "absent";
    }
  }

  return guessLetters.map((letter, i) => ({ letter, status: statuses[i] }));
}

/** Merges a new evaluated guess into the running keyboard letter-state map,
 * respecting the priority green > yellow > gray > unused so a letter that
 * has ever been "correct" never regresses to a weaker status. */
export function mergeKeyboardStates(
  current: KeyboardLetterStates,
  guess: EvaluatedGuess
): KeyboardLetterStates {
  const priority: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    empty: 0,
  };

  const next: KeyboardLetterStates = { ...current };
  for (const { letter, status } of guess) {
    const existing = next[letter];
    if (!existing || priority[status] > priority[existing]) {
      next[letter] = status;
    }
  }
  return next;
}

export function buildKeyboardStates(guesses: EvaluatedGuess[]): KeyboardLetterStates {
  return guesses.reduce(
    (acc, guess) => mergeKeyboardStates(acc, guess),
    {} as KeyboardLetterStates
  );
}

export function isWinningGuess(evaluated: EvaluatedGuess): boolean {
  return evaluated.every((l) => l.status === "correct");
}

export function isGameOver(guessCount: number, won: boolean): boolean {
  return won || guessCount >= MAX_GUESSES;
}

/** Number of guesses it took to win, or null if the game wasn't won. */
export function winningGuessNumber(guesses: EvaluatedGuess[]): number | null {
  const index = guesses.findIndex(isWinningGuess);
  return index === -1 ? null : index + 1;
}
