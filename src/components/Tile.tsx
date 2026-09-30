import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import type { LetterStatus } from "../types";
import { useTheme } from "../theme/ThemeContext";
import { REVEAL_STEP_MS } from "../hooks/useGame";

interface TileProps {
  letter: string;
  status: LetterStatus;
  size: number;
  isRevealing: boolean;
  revealIndex: number;
  celebrate: boolean;
  animationsEnabled: boolean;
}

export function Tile({ letter, status, size, isRevealing, revealIndex, celebrate, animationsEnabled }: TileProps) {
  const p = useTheme();
  const flip = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const jump = useRef(new Animated.Value(0)).current;
  // Becomes true at the midpoint of the flip so the colour swaps while the tile is edge-on.
  // Tiles are remounted per game (see Board key), so this never needs resetting.
  const [flipped, setFlipped] = useState(false);

  // Pop when a letter is typed.
  useEffect(() => {
    if (!letter || !animationsEnabled || status !== "empty") return;
    pop.setValue(1);
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.12, duration: 70, useNativeDriver: true }),
      Animated.timing(pop, { toValue: 1, duration: 70, useNativeDriver: true }),
    ]).start();
  }, [letter, status, animationsEnabled, pop]);

  // Sequential flip reveal.
  useEffect(() => {
    if (!isRevealing) return;
    if (!animationsEnabled) {
      setFlipped(true);
      return;
    }
    const anim = Animated.sequence([
      Animated.delay(revealIndex * REVEAL_STEP_MS),
      Animated.timing(flip, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => {
      if (!finished) return;
      setFlipped(true);
      Animated.timing(flip, { toValue: 0, duration: 140, useNativeDriver: true }).start();
    });
    return () => anim.stop();
  }, [isRevealing, animationsEnabled, revealIndex, flip]);

  // Win celebration: staggered hop.
  useEffect(() => {
    if (!celebrate || !animationsEnabled) return;
    Animated.sequence([
      Animated.delay(revealIndex * 90),
      Animated.timing(jump, { toValue: -14, duration: 140, useNativeDriver: true }),
      Animated.timing(jump, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [celebrate, animationsEnabled, revealIndex, jump]);

  const shown: LetterStatus = isRevealing && !flipped ? "empty" : status;

  const colors = {
    empty: { bg: p.surface, border: letter ? p.textFaint : p.borderStrong, text: p.text },
    correct: { bg: p.correct, border: p.correct, text: p.correctText },
    present: { bg: p.present, border: p.present, text: p.presentText },
    absent: { bg: p.absent, border: p.absent, text: p.absentText },
  }[shown];

  const rotateX = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] });

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          transform: [{ perspective: 400 }, { rotateX }, { scale: pop }, { translateY: jump }],
        },
      ]}
    >
      <Text style={[styles.letter, { color: colors.text, fontSize: size * 0.5 }]}>{letter}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontWeight: "800",
  },
});
