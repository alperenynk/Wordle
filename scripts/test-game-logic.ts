/**
 * Ad-hoc manual verification of the duplicate-letter Wordle algorithm.
 * Run with: npx tsx scripts/test-game-logic.ts
 * (Not part of the app bundle — a lightweight sanity check during
 * development, kept here for future reference.)
 */
import { evaluateGuess } from "../src/game/gameLogic";

function run(guess: string, secret: string) {
  const result = evaluateGuess(guess, secret);
  console.log(
    `guess="${guess}" secret="${secret}" ->`,
    result.map((r) => `${r.letter}:${r.status}`).join(" ")
  );
}

console.log("=== Secret has 1 of a letter, guess has 2 (classic case) ===");
// secret "apple": a×1, p×2, l×1, e×1
run("allee", "apple");
// a(0): exact match -> correct.
// l(1): secret's only 'l' is at index 3, unclaimed -> present.
// l(2): secret's 'l' pool already consumed -> absent.
// e(3): secret's 'e' is at index 4; index4 itself matches exactly in
//       pass 1 first, consuming it -> so by the time e(3) is checked in
//       pass 2, the pool is empty -> absent.
// e(4): exact match with secret's e -> correct.
// Expected: correct, present, absent, absent, correct.

console.log();
console.log("=== Secret has 2 of a letter, guess also uses it twice ===");
run("evade", "speed");
// secret "speed": s×1 p×1 e×2 d×1. Neither guess letter lines up
// positionally, but since secret truly has two e's, BOTH guess e's may be
// marked present (each consuming one from the pool), and the d is present.
// Expected: present, absent, absent, present, present.

console.log();
console.log("=== No duplicate letters, mixed correctness ===");
run("crane", "trace");

console.log();
console.log("=== No overlap at all ===");
run("zzzzz", "apple");

console.log();
console.log("=== Guess equals secret exactly ===");
run("apple", "apple");
