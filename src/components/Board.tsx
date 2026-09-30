import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import type { EvaluatedGuess, GameStatus, Language } from "../types";
import { MAX_GUESSES, WORD_LENGTH } from "../types";
import { localeUpper, toLetterArray } from "../utils/turkish";
import { Tile } from "./Tile";

const GAP = 6;

interface BoardProps {
  language: Language;
  guesses: EvaluatedGuess[];
  currentGuess: string;
  revealingRowIndex: number | null;
  status: GameStatus;
  invalidShake: boolean;
  animationsEnabled: boolean;
  onShakeEnd: () => void;
}

function ShakeRow({
  active,
  animationsEnabled,
  onEnd,
  children,
}: {
  active: boolean;
  animationsEnabled: boolean;
  onEnd: () => void;
  children: React.ReactNode;
}) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    if (!animationsEnabled) {
      onEnd();
      return;
    }
    Animated.sequence([
      Animated.timing(x, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(x, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(x, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(x, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => onEnd());
  }, [active, animationsEnabled, onEnd, x]);

  return <Animated.View style={[styles.row, { transform: [{ translateX: x }] }]}>{children}</Animated.View>;
}

export function Board({
  language,
  guesses,
  currentGuess,
  revealingRowIndex,
  status,
  invalidShake,
  animationsEnabled,
  onShakeEnd,
}: BoardProps) {
  const [area, setArea] = useState({ width: 0, height: 0 });

  function handleLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setArea({ width, height });
  }

  // Fit the 6x5 grid to whichever dimension is tighter, capped for tablets.
  const byWidth = (area.width - 32 - GAP * (WORD_LENGTH - 1)) / WORD_LENGTH;
  const byHeight = (area.height - 8 - GAP * (MAX_GUESSES - 1)) / MAX_GUESSES;
  const size = Math.max(0, Math.min(64, byWidth, byHeight));

  const current = toLetterArray(currentGuess);
  const celebrating = status === "won" && revealingRowIndex === null;

  return (
    <View style={styles.area} onLayout={handleLayout}>
      {size > 0 &&
        Array.from({ length: MAX_GUESSES }, (_, r) => {
          const evaluated = r < guesses.length ? guesses[r] : null;
          const isCurrent = r === guesses.length;
          const isWinningRow = evaluated !== null && celebrating && r === guesses.length - 1;
          return (
            <ShakeRow
              key={r}
              active={isCurrent && invalidShake}
              animationsEnabled={animationsEnabled}
              onEnd={onShakeEnd}
            >
              {Array.from({ length: WORD_LENGTH }, (_, c) => {
                const cell = evaluated?.[c];
                const letter = cell ? cell.letter : isCurrent ? (current[c] ?? "") : "";
                return (
                  <Tile
                    key={c}
                    letter={localeUpper(letter, language)}
                    status={cell ? cell.status : "empty"}
                    size={size}
                    isRevealing={revealingRowIndex === r}
                    revealIndex={c}
                    celebrate={isWinningRow}
                    animationsEnabled={animationsEnabled}
                  />
                );
              })}
            </ShakeRow>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
});
