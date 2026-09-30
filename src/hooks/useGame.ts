import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMode, GameState, Language, Statistics } from "../types";
import { MAX_GUESSES, WORD_LENGTH } from "../types";
import { evaluateGuess, isWinningGuess, winningGuessNumber } from "../game/gameLogic";
import { getGuessRejectionReason, sanitizeInputToLetters } from "../game/wordValidation";
import { buildFreshState } from "../game/gameSession";
import { saveGameState, saveStatistics } from "../storage/storage";
import { letterCount } from "../utils/turkish";
import { t } from "../i18n/strings";

export interface ToastMessage {
  id: number;
  text: string;
}

export const REVEAL_STEP_MS = 280;
export const REVEAL_TOTAL_MS = REVEAL_STEP_MS * WORD_LENGTH + 350;

interface InitialSession {
  language: Language;
  game: GameState;
  stats: Statistics;
}

export function useGame({ language, game: initialGame, stats: initialStats }: InitialSession) {
  const [game, setGameState] = useState<GameState>(initialGame);
  const [stats, setStats] = useState<Statistics>(initialStats);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  // Bumped on every new game so the board (and its tile animation state) remounts cleanly.
  const [gameKey, setGameKey] = useState(0);

  // Mirror of state so rapid taps always act on the latest value.
  const gameRef = useRef(game);
  const toastId = useRef(0);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setGame = useCallback((next: GameState) => {
    gameRef.current = next;
    setGameState(next);
  }, []);

  const showToast = useCallback(
    (text: string) => {
      toastId.current += 1;
      setToast({ id: toastId.current, text });
    },
    []
  );

  // Persist progress (ephemeral animation fields are dropped).
  useEffect(() => {
    void saveGameState(language, {
      language: game.language,
      mode: game.mode,
      secretWord: game.secretWord,
      guesses: game.guesses,
      currentGuess: game.currentGuess,
      status: game.status,
      dailyDateKey: game.dailyDateKey,
    });
  }, [game, language]);

  useEffect(() => {
    void saveStatistics(language, stats);
  }, [stats, language]);

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    },
    []
  );

  const typeLetter = useCallback(
    (raw: string) => {
      const current = gameRef.current;
      if (current.status !== "playing" || current.revealingRowIndex !== null) return;
      const letter = sanitizeInputToLetters(raw, current.language);
      if (!letter || letterCount(current.currentGuess) >= WORD_LENGTH) return;
      setGame({ ...current, currentGuess: current.currentGuess + letter, invalidShake: false });
    },
    [setGame]
  );

  const backspace = useCallback(() => {
    const current = gameRef.current;
    if (current.status !== "playing" || current.revealingRowIndex !== null) return;
    if (current.currentGuess.length === 0) return;
    const chars = Array.from(current.currentGuess);
    chars.pop();
    setGame({ ...current, currentGuess: chars.join(""), invalidShake: false });
  }, [setGame]);

  const clearShake = useCallback(() => {
    const current = gameRef.current;
    if (current.invalidShake) setGame({ ...current, invalidShake: false });
  }, [setGame]);

  const submitGuess = useCallback((): "invalid" | "accepted" | "ignored" => {
    const current = gameRef.current;
    // Ignoring input mid-reveal also neutralises Enter spamming.
    if (current.status !== "playing" || current.revealingRowIndex !== null) return "ignored";

    const strings = t(current.language);
    const reason = getGuessRejectionReason(current.currentGuess, current.language);
    if (reason) {
      showToast(reason === "not-in-list" ? strings.notInWordList : strings.notEnoughLetters);
      setGame({ ...current, invalidShake: true });
      return "invalid";
    }

    if (current.guesses.some((g) => g.map((c) => c.letter).join("") === current.currentGuess)) {
      showToast(strings.alreadyGuessed);
      setGame({ ...current, invalidShake: true });
      return "invalid";
    }

    const evaluated = evaluateGuess(current.currentGuess, current.secretWord);
    const guesses = [...current.guesses, evaluated];
    const won = isWinningGuess(evaluated);
    const lost = !won && guesses.length >= MAX_GUESSES;
    const status = won ? "won" : lost ? "lost" : "playing";

    setGame({
      ...current,
      guesses,
      currentGuess: "",
      status,
      revealingRowIndex: guesses.length - 1,
      invalidShake: false,
    });

    // Statistics are recorded immediately (not after the flip) so a force-quit
    // mid-animation can't lose a finished game.
    if (status === "won") {
      const n = winningGuessNumber(guesses) ?? guesses.length;
      setStats((prev) => {
        const streak = prev.currentStreak + 1;
        return {
          played: prev.played + 1,
          won: prev.won + 1,
          currentStreak: streak,
          maxStreak: Math.max(prev.maxStreak, streak),
          guessDistribution: { ...prev.guessDistribution, [n]: (prev.guessDistribution[n] ?? 0) + 1 },
        };
      });
    } else if (status === "lost") {
      setStats((prev) => ({ ...prev, played: prev.played + 1, currentStreak: 0 }));
    }

    revealTimer.current = setTimeout(() => {
      setGame({ ...gameRef.current, revealingRowIndex: null });
    }, REVEAL_TOTAL_MS);

    return "accepted";
  }, [setGame, showToast]);

  const startNewGame = useCallback(
    (mode: GameMode) => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      setGame(buildFreshState(language, mode, gameRef.current.secretWord));
      setGameKey((k) => k + 1);
    },
    [language, setGame]
  );

  const dismissToast = useCallback(() => setToast(null), []);

  return {
    game,
    gameKey,
    stats,
    toast,
    dismissToast,
    typeLetter,
    backspace,
    submitGuess,
    startNewGame,
    clearShake,
    resultReady: game.status !== "playing" && game.revealingRowIndex === null,
  };
}
