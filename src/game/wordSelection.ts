import { Language } from "../types";
import { localeLower } from "../utils/turkish";
import * as en from "../data/words/en";
import * as tr from "../data/words/tr";

function getAnswerPool(language: Language): string[] {
  const words = language === "tr" ? tr.ANSWER_WORDS : en.ANSWER_WORDS;
  return words.map((w) => localeLower(w, language));
}

/** yyyy-mm-dd in UTC, used both as the "day key" and as a stable seed. */
export function getUtcDateKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Simple, stable string hash (djb2) — deterministic across sessions and
 * browsers, which is what a shared daily word needs. Not cryptographic;
 * it doesn't need to be. */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

/** Picks today's (or a given date's) daily word deterministically from the
 * date key, so every player on the same UTC day sees the same word without
 * needing a server. */
export function getDailyWord(language: Language, date: Date = new Date()): string {
  const pool = getAnswerPool(language);
  const dateKey = getUtcDateKey(date);
  // Salt with the language so tr/en don't line up on the same index for a
  // given day.
  const index = djb2Hash(`${dateKey}:${language}`) % pool.length;
  return pool[index];
}

/** Picks a random word for "New Game" mode. Avoids repeating the word that
 * was just played, when a pool has more than one entry. */
export function getRandomWord(language: Language, avoid?: string): string {
  const pool = getAnswerPool(language);
  if (pool.length <= 1) return pool[0];
  let word = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while (word === avoid && guard < 10) {
    word = pool[Math.floor(Math.random() * pool.length)];
    guard++;
  }
  return word;
}
