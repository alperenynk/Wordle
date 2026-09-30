import { sanitizeInputToLetters, isValidWord, getGuessRejectionReason } from "../src/game/wordValidation";
import { evaluateGuess } from "../src/game/gameLogic";
import { getDailyWord } from "../src/game/wordSelection";
import { turkishToLower, turkishToUpper } from "../src/utils/turkish";
import { ANSWER_WORDS as TR } from "../src/data/words/tr";
import { ANSWER_WORDS as EN } from "../src/data/words/en";

const ok = (name: string, cond: boolean) => console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);

ok('sanitize("I","tr") -> "ı"', sanitizeInputToLetters("I", "tr") === "ı");
ok('sanitize("İ","tr") -> "i"', sanitizeInputToLetters("İ", "tr") === "i");
ok("sanitize drops digits/symbols", sanitizeInputToLetters("a1-ş!", "tr") === "aş");
ok('sanitize("A","en") -> "a"', sanitizeInputToLetters("A", "en") === "a");
ok('turkishToUpper("işığı") = "İŞIĞI"', turkishToUpper("işığı") === "İŞIĞI");
ok('turkishToLower("KADIN") = "kadın"', turkishToLower("KADIN") === "kadın");
ok('isValidWord("KADIN","tr")', isValidWord("KADIN", "tr"));
ok('isValidWord("kadin","tr") is false (dotted i != dotless ı)', !isValidWord("kadin", "tr"));
ok("too-short rejected", getGuessRejectionReason("ab", "en") === "too-short");
ok("unknown word rejected", getGuessRejectionReason("qzxwv", "en") === "not-in-list");
ok("typed-uppercase guess evaluates correctly", evaluateGuess("kadın", "kadın").every((c) => c.status === "correct"));
const d = new Date("2026-09-28T12:00:00Z");
ok("daily word deterministic", getDailyWord("tr", d) === getDailyWord("tr", d));
ok("all TR words are 5 letters", TR.every((w) => Array.from(w.normalize("NFC")).length === 5));
ok("all EN words are 5 letters", EN.every((w) => w.length === 5));
