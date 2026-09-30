import { Language, WORD_LENGTH } from "../types";
import { localeLower, letterCount, toLetterArray } from "../utils/turkish";
import * as en from "../data/words/en";
import * as tr from "../data/words/tr";

function getValidGuessSet(language: Language): Set<string> {
  const words = language === "tr" ? tr.VALID_GUESSES : en.VALID_GUESSES;
  return new Set(words.map((w) => localeLower(w, language)));
}

// Cache the sets so we don't rebuild them on every keystroke.
const validGuessCache: Partial<Record<Language, Set<string>>> = {};

export function isValidWord(guess: string, language: Language): boolean {
  const normalized = localeLower(guess, language);
  if (letterCount(normalized) !== WORD_LENGTH) return false;
  if (!validGuessCache[language]) {
    validGuessCache[language] = getValidGuessSet(language);
  }
  return validGuessCache[language]!.has(normalized);
}

/** Only allows letters valid for the given language's alphabet (blocks
 * numbers and special characters at the input layer, defense in depth). */
export function isAllowedLetter(char: string, language: Language): boolean {
  const lower = localeLower(char, language);
  if (language === "tr") {
    return /^[a-zçğıiöşü]$/.test(lower);
  }
  return /^[a-z]$/.test(lower);
}

export function sanitizeInputToLetters(input: string, language: Language): string {
  // Always normalised to lowercase (Turkish-aware) so guesses compare
  // correctly against the lowercase secret word and word lists.
  return toLetterArray(input)
    .filter((ch) => isAllowedLetter(ch, language))
    .map((ch) => localeLower(ch, language))
    .join("");
}

export type GuessRejectionReason = "too-short" | "too-long" | "not-in-list" | null;

export function getGuessRejectionReason(
  guess: string,
  language: Language
): GuessRejectionReason {
  const len = letterCount(guess);
  if (len < WORD_LENGTH) return "too-short";
  if (len > WORD_LENGTH) return "too-long";
  if (!isValidWord(guess, language)) return "not-in-list";
  return null;
}
