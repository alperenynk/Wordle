import { Pressable, StyleSheet, Text, View } from "react-native";
import type { KeyboardLetterStates, Language } from "../types";
import { localeLower } from "../utils/turkish";
import { useTheme } from "../theme/ThemeContext";

const LAYOUTS: Record<Language, string[][]> = {
  en: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
  ],
  tr: [
    ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["ENTER", "Z", "C", "V", "B", "N", "M", "Ö", "Ç", "BACK"],
  ],
};

interface KeyboardProps {
  language: Language;
  keyStates: KeyboardLetterStates;
  disabled: boolean;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export function Keyboard({ language, keyStates, disabled, onLetter, onEnter, onBackspace }: KeyboardProps) {
  const p = useTheme();

  function renderKey(key: string) {
    const isEnter = key === "ENTER";
    const isBack = key === "BACK";
    const wide = isEnter || isBack;
    const status = wide ? undefined : keyStates[localeLower(key, language)];

    const bg =
      status === "correct" ? p.correct : status === "present" ? p.present : status === "absent" ? p.absent : p.surfaceAlt;
    const fg =
      status === "correct"
        ? p.correctText
        : status === "present"
          ? p.presentText
          : status === "absent"
            ? p.absentText
            : p.text;

    const onPress = isEnter ? onEnter : isBack ? onBackspace : () => onLetter(key);
    const label = isEnter ? "ENTER" : isBack ? "⌫" : key;

    return (
      <Pressable
        key={key}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={isEnter ? "Enter" : isBack ? "Backspace" : key}
        style={({ pressed }) => [
          styles.key,
          wide && styles.wide,
          { backgroundColor: bg, opacity: disabled ? 0.55 : pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
      >
        <Text style={[styles.keyText, wide && styles.wideText, { color: fg }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.keyboard}>
      {LAYOUTS[language].map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map(renderKey)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { width: "100%", maxWidth: 560, alignSelf: "center", paddingHorizontal: 4, gap: 8, paddingBottom: 6 },
  row: { flexDirection: "row", justifyContent: "center", gap: 5 },
  key: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wide: { flex: 1.5 },
  keyText: { fontSize: 16, fontWeight: "700" },
  wideText: { fontSize: 12, letterSpacing: 0.3 },
});
