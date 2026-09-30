import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import type { ToastMessage } from "../hooks/useGame";
import { useTheme } from "../theme/ThemeContext";

interface ToastProps {
  message: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  const p = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => {
      if (finished) onDismiss();
    });
    return () => anim.stop();
  }, [message, onDismiss, opacity]);

  if (!message) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.toast, { backgroundColor: p.toastBg, opacity }]}>
      <Text style={[styles.text, { color: p.toastText }]}>{message.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    zIndex: 50,
    elevation: 8,
  },
  text: { fontSize: 14, fontWeight: "700" },
});
