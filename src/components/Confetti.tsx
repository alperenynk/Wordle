import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

interface Piece {
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: number;
  drift: number;
  spin: number;
}

const PIECE_COUNT = 34;

/** Small decorative burst: pieces fall from the top with staggered timing. */
export function Confetti({ active }: { active: boolean }) {
  const p = useTheme();
  const { width, height } = useWindowDimensions();
  const colors = [p.correct, p.present, p.accent, p.accent2, "#ffffff"];

  // One-time random layout; a lazy initializer is the sanctioned place for impure setup.
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: PIECE_COUNT }, (_, i) => ({
      x: Math.random(),
      delay: Math.random() * 500,
      duration: 1500 + Math.random() * 900,
      size: 7 + Math.random() * 5,
      color: i % 5,
      drift: (Math.random() - 0.5) * 120,
      spin: 2 + Math.random() * 4,
    }))
  );
  const [progress] = useState(() => pieces.map(() => new Animated.Value(0)));

  useEffect(() => {
    if (!active) return;
    progress.forEach((v) => v.setValue(0));
    const anims = progress.map((v, i) =>
      Animated.timing(v, {
        toValue: 1,
        duration: pieces[i].duration,
        delay: pieces[i].delay,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      })
    );
    Animated.parallel(anims).start();
  }, [active, progress, pieces]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            top: -20,
            left: piece.x * width,
            width: piece.size,
            height: piece.size * 1.6,
            borderRadius: 2,
            backgroundColor: colors[piece.color],
            opacity: progress[i].interpolate({ inputRange: [0, 0.05, 0.85, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateY: progress[i].interpolate({ inputRange: [0, 1], outputRange: [0, height * 0.75] }) },
              { translateX: progress[i].interpolate({ inputRange: [0, 1], outputRange: [0, piece.drift] }) },
              { rotate: progress[i].interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${piece.spin * 180}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}
