/**
 * JavaScript's default `.toLowerCase()` / `.toUpperCase()` are locale-unaware
 * and mishandle Turkish dotted/dotless I:
 *   "I".toLowerCase()   -> "i"   (wrong, should be "ı")
 *   "İ".toLowerCase()   -> "i̇"  (wrong in some engines, extra combining dot)
 *   "i".toUpperCase()   -> "I"   (wrong, should be "İ")
 * These helpers implement correct Turkish casing manually so word matching
 * and rendering are consistent regardless of the input source (keyboard,
 * on-screen keys, or word lists).
 */

const TR_UPPER_TO_LOWER: Record<string, string> = {
  I: "ı",
  İ: "i",
  Ç: "ç",
  Ğ: "ğ",
  Ö: "ö",
  Ş: "ş",
  Ü: "ü",
};

const TR_LOWER_TO_UPPER: Record<string, string> = {
  ı: "I",
  i: "İ",
  ç: "Ç",
  ğ: "Ğ",
  ö: "Ö",
  ş: "Ş",
  ü: "Ü",
};

export function turkishToLower(input: string): string {
  let result = "";
  for (const ch of input) {
    if (TR_UPPER_TO_LOWER[ch]) {
      result += TR_UPPER_TO_LOWER[ch];
    } else {
      // For plain ASCII letters (A-Z except I, handled above) fall back to
      // the standard lowercase conversion, which is safe for the rest.
      result += ch.toLowerCase();
    }
  }
  return result;
}

export function turkishToUpper(input: string): string {
  let result = "";
  for (const ch of input) {
    if (TR_LOWER_TO_UPPER[ch]) {
      result += TR_LOWER_TO_UPPER[ch];
    } else {
      result += ch.toUpperCase();
    }
  }
  return result;
}

/** Locale-correct lowercasing for the given language ("tr" uses Turkish rules). */
export function localeLower(input: string, language: "tr" | "en"): string {
  return language === "tr" ? turkishToLower(input) : input.toLowerCase();
}

/** Locale-correct uppercasing for the given language ("tr" uses Turkish rules). */
export function localeUpper(input: string, language: "tr" | "en"): string {
  return language === "tr" ? turkishToUpper(input) : input.toUpperCase();
}

/**
 * Counts *grapheme-ish* letters correctly for Turkish, where every letter
 * (including Ç Ğ İ Ö Ş Ü) is a single code point in NFC form, so normal
 * `.length` works as long as the string is NFC-normalized first. We
 * normalize defensively in case of NFD input from some keyboards/IMEs.
 */
export function letterCount(word: string): number {
  return Array.from(word.normalize("NFC")).length;
}

export function toLetterArray(word: string): string[] {
  return Array.from(word.normalize("NFC"));
}
